<?php
/**
 * Collaborative Genealogy REST API Backend
 * Supports: PostgreSQL, Email/Password Auth, Google OAuth, Detailed Field-by-Field Diff Tracking
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database Credentials
$dbConfig = [
    'dsn'  => 'pgsql:dbname=indeyvxx_genealogy',
    'user' => 'indeyvxx_User',
    'pass' => 't%oWBm)?mGHN!p#[',
];

function getDB() {
    global $dbConfig;
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO($dbConfig['dsn'], $dbConfig['user'], $dbConfig['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failure: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

session_start();

function getCurrentUser() {
    return isset($_SESSION['user']) ? $_SESSION['user'] : null;
}

function requireAuth() {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado. Por favor inicia sesión.']);
        exit;
    }
    return $user;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: [];

try {
    $db = getDB();

    switch ($action) {

        // 1. LOGIN (Email / Password)
        case 'login':
            $email = trim(isset($data['email']) ? $data['email'] : '');
            $password = isset($data['password']) ? $data['password'] : '';

            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Email y contraseña requeridos.']);
                exit;
            }

            $stmt = $db->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                $db->prepare("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$user['id']]);
                unset($user['password_hash']);
                $_SESSION['user'] = $user;
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Credenciales inválidas. Verifica tu correo y contraseña.']);
            }
            break;

        // 2. GOOGLE OAUTH LOGIN
        case 'google-login':
            $credential = isset($data['credential']) ? $data['credential'] : '';
            if (empty($credential)) {
                http_response_code(400);
                echo json_encode(['error' => 'Token de Google requerido.']);
                exit;
            }

            $ch = curl_init("https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($credential));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            $response = curl_exec($ch);
            curl_close($ch);

            $payload = json_decode($response, true);
            if (!isset($payload['email'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Token de Google inválido o expirado.']);
                exit;
            }

            $googleEmail = $payload['email'];
            $googleName = isset($payload['name']) ? $payload['name'] : explode('@', $googleEmail)[0];
            $googlePicture = isset($payload['picture']) ? $payload['picture'] : null;

            $stmt = $db->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)");
            $stmt->execute([$googleEmail]);
            $user = $stmt->fetch();

            if (!$user) {
                $insert = $db->prepare("
                    INSERT INTO users (email, full_name, avatar_url, role, auth_provider, last_login_at)
                    VALUES (?, ?, ?, 'editor', 'google', CURRENT_TIMESTAMP)
                    RETURNING id, email, full_name, avatar_url, role, auth_provider, created_at, last_login_at
                ");
                $insert->execute([$googleEmail, $googleName, $googlePicture]);
                $user = $insert->fetch();
            } else {
                $update = $db->prepare("
                    UPDATE users 
                    SET full_name = COALESCE(NULLIF(full_name, ''), ?), 
                        avatar_url = COALESCE(?, avatar_url),
                        last_login_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");
                $update->execute([$googleName, $googlePicture, $user['id']]);
                unset($user['password_hash']);
            }

            $_SESSION['user'] = $user;
            echo json_encode(['success' => true, 'user' => $user]);
            break;

        // 3. REGISTER
        case 'register':
            $email = trim(isset($data['email']) ? $data['email'] : '');
            $password = isset($data['password']) ? $data['password'] : '';
            $name = trim(isset($data['name']) ? $data['name'] : '');

            if (empty($email) || empty($password) || empty($name)) {
                http_response_code(400);
                echo json_encode(['error' => 'Nombre, correo y contraseña son obligatorios.']);
                exit;
            }

            $stmt = $db->prepare("SELECT id FROM users WHERE LOWER(email) = LOWER(?)");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['error' => 'Ya existe una cuenta con este correo electrónico.']);
                exit;
            }

            $passHash = password_hash($password, PASSWORD_BCRYPT);
            $insert = $db->prepare("
                INSERT INTO users (email, password_hash, full_name, role, auth_provider, last_login_at)
                VALUES (?, ?, ?, 'editor', 'email', CURRENT_TIMESTAMP)
                RETURNING id, email, full_name, avatar_url, role, auth_provider, created_at, last_login_at
            ");
            $insert->execute([$email, $passHash, $name]);
            $newUser = $insert->fetch();

            $_SESSION['user'] = $newUser;
            echo json_encode(['success' => true, 'user' => $newUser]);
            break;

        // 4. CURRENT SESSION
        case 'me':
            $user = getCurrentUser();
            if ($user) {
                echo json_encode(['authenticated' => true, 'user' => $user]);
            } else {
                echo json_encode(['authenticated' => false]);
            }
            break;

        // 5. LOGOUT
        case 'logout':
            $_SESSION = [];
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            session_destroy();
            echo json_encode(['success' => true]);
            break;

        // 6. GET TREE (With Roberto Delgado Rüegg as default root)
        case 'get-tree':
            requireAuth();
            $stmt = $db->query("SELECT * FROM people ORDER BY created_at ASC");
            $rows = $stmt->fetchAll();

            $people = [];
            foreach ($rows as $r) {
                $people[$r['id']] = [
                    'id'         => $r['id'],
                    'firstName'  => $r['first_name'],
                    'lastName'   => $r['last_name'],
                    'maidenName' => $r['maiden_name'] ?: null,
                    'gender'     => $r['gender'],
                    'birthDate'  => $r['birth_date'] ?: null,
                    'birthPlace' => $r['birth_place'] ?: null,
                    'deathDate'  => $r['death_date'] ?: null,
                    'deathPlace' => $r['death_place'] ?: null,
                    'photoUrl'   => $r['photo_url'] ?: null,
                    'notes'      => $r['notes'] ?: null,
                    'parentIds'  => json_decode($r['parent_ids']) ?: [],
                    'spouseIds'  => json_decode($r['spouse_ids']) ?: [],
                    'childIds'   => json_decode($r['child_ids']) ?: [],
                ];
            }

            $rootId = isset($people['roberto-delgado-ruegg']) ? 'roberto-delgado-ruegg' : (!empty($people) ? array_keys($people)[0] : null);
            echo json_encode(['people' => $people, 'rootId' => $rootId]);
            break;

        // 7. SAVE PERSON (With Granular Field-by-Field Diff Tracking)
        case 'save-person':
            $currentUser = requireAuth();
            $person = isset($data['person']) ? $data['person'] : null;

            if (!$person || empty($person['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos de persona inválidos.']);
                exit;
            }

            $id = $person['id'];
            $firstName = trim(isset($person['firstName']) ? $person['firstName'] : '');
            $lastName = trim(isset($person['lastName']) ? $person['lastName'] : '');
            $maidenName = isset($person['maidenName']) ? $person['maidenName'] : null;
            $gender = isset($person['gender']) ? $person['gender'] : 'unknown';
            $birthDate = isset($person['birthDate']) ? $person['birthDate'] : null;
            $birthPlace = isset($person['birthPlace']) ? $person['birthPlace'] : null;
            $deathDate = isset($person['deathDate']) ? $person['deathDate'] : null;
            $deathPlace = isset($person['deathPlace']) ? $person['deathPlace'] : null;
            $photoUrl = isset($person['photoUrl']) ? $person['photoUrl'] : null;
            $notes = isset($person['notes']) ? $person['notes'] : null;
            $parentIds = json_encode(isset($person['parentIds']) ? $person['parentIds'] : []);
            $spouseIds = json_encode(isset($person['spouseIds']) ? $person['spouseIds'] : []);
            $childIds = json_encode(isset($person['childIds']) ? $person['childIds'] : []);

            $stmt = $db->prepare("SELECT * FROM people WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();

            $fullName = "{$firstName} {$lastName}";

            if ($existing) {
                // Compute Granular Field-by-Field Diffs
                $diffs = [];
                $fields = [
                    'first_name'   => 'Nombre',
                    'last_name'    => 'Apellidos',
                    'maiden_name'  => 'Apellido de soltera',
                    'gender'       => 'Género',
                    'birth_date'   => 'Fecha de nacimiento',
                    'birth_place'  => 'Lugar de nacimiento',
                    'death_date'   => 'Fecha de defunción',
                    'death_place'  => 'Lugar de defunción',
                    'photo_url'    => 'Foto',
                    'notes'        => 'Notas biográficas',
                ];

                foreach ($fields as $col => $label) {
                    $oldVal = isset($existing[$col]) ? $existing[$col] : null;
                    // match column to camelCase property
                    $camelMap = [
                        'first_name'   => 'firstName',
                        'last_name'    => 'lastName',
                        'maiden_name'  => 'maidenName',
                        'gender'       => 'gender',
                        'birth_date'   => 'birthDate',
                        'birth_place'  => 'birthPlace',
                        'death_date'   => 'deathDate',
                        'death_place'  => 'deathPlace',
                        'photo_url'    => 'photoUrl',
                        'notes'        => 'notes',
                    ];
                    $prop = $camelMap[$col];
                    $newVal = isset($person[$prop]) ? $person[$prop] : null;

                    // Normalize empty strings to null
                    $oldVal = ($oldVal === '' || $oldVal === null) ? null : (string)$oldVal;
                    $newVal = ($newVal === '' || $newVal === null) ? null : (string)$newVal;

                    if ($oldVal !== $newVal) {
                        $diffs[] = [
                            'field' => $label,
                            'old'   => $oldVal,
                            'new'   => $newVal,
                        ];
                    }
                }

                // Check relation changes
                $oldParents = json_decode($existing['parent_ids'] ?: '[]', true) ?: [];
                $newParents = isset($person['parentIds']) ? $person['parentIds'] : [];
                if ($oldParents != $newParents) {
                    $diffs[] = ['field' => 'Vínculos de Padres', 'old' => implode(', ', $oldParents), 'new' => implode(', ', $newParents)];
                }
                $oldSpouses = json_decode($existing['spouse_ids'] ?: '[]', true) ?: [];
                $newSpouses = isset($person['spouseIds']) ? $person['spouseIds'] : [];
                if ($oldSpouses != $newSpouses) {
                    $diffs[] = ['field' => 'Vínculos de Cónyuges', 'old' => implode(', ', $oldSpouses), 'new' => implode(', ', $newSpouses)];
                }
                $oldChildren = json_decode($existing['child_ids'] ?: '[]', true) ?: [];
                $newChildren = isset($person['childIds']) ? $person['childIds'] : [];
                if ($oldChildren != $newChildren) {
                    $diffs[] = ['field' => 'Vínculos de Hijos', 'old' => implode(', ', $oldChildren), 'new' => implode(', ', $newChildren)];
                }

                // Update Person Record
                $update = $db->prepare("
                    UPDATE people SET
                        first_name = ?, last_name = ?, maiden_name = ?, gender = ?,
                        birth_date = ?, birth_place = ?, death_date = ?, death_place = ?,
                        photo_url = ?, notes = ?, parent_ids = ?, spouse_ids = ?, child_ids = ?,
                        updated_by = ?, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ");
                $update->execute([
                    $firstName, $lastName, $maidenName, $gender,
                    $birthDate, $birthPlace, $deathDate, $deathPlace,
                    $photoUrl, $notes, $parentIds, $spouseIds, $childIds,
                    $currentUser['id'], $id
                ]);

                // Create Summary String
                if (!empty($diffs)) {
                    $summaryParts = [];
                    foreach ($diffs as $d) {
                        $oldStr = $d['old'] !== null ? "'{$d['old']}'" : "(vacío)";
                        $newStr = $d['new'] !== null ? "'{$d['new']}'" : "(eliminado)";
                        $summaryParts[] = "{$d['field']}: {$oldStr} ➔ {$newStr}";
                    }
                    $summary = implode(" | ", $summaryParts);

                    $audit = $db->prepare("
                        INSERT INTO change_logs (person_id, person_name, user_id, user_email, user_name, action, changes_summary, old_data, new_data)
                        VALUES (?, ?, ?, ?, ?, 'UPDATE', ?, ?, ?)
                    ");
                    $audit->execute([
                        $id, $fullName, $currentUser['id'], $currentUser['email'], $currentUser['full_name'],
                        $summary, json_encode($diffs), json_encode($person)
                    ]);
                }

            } else {
                // INSERT NEW PERSON
                $insert = $db->prepare("
                    INSERT INTO people (
                        id, first_name, last_name, maiden_name, gender,
                        birth_date, birth_place, death_date, death_place,
                        photo_url, notes, parent_ids, spouse_ids, child_ids,
                        created_by, updated_by
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $insert->execute([
                    $id, $firstName, $lastName, $maidenName, $gender,
                    $birthDate, $birthPlace, $deathDate, $deathPlace,
                    $photoUrl, $notes, $parentIds, $spouseIds, $childIds,
                    $currentUser['id'], $currentUser['id']
                ]);

                $summary = "Creación de registro familiar: {$fullName}";
                $audit = $db->prepare("
                    INSERT INTO change_logs (person_id, person_name, user_id, user_email, user_name, action, changes_summary, old_data, new_data)
                    VALUES (?, ?, ?, ?, ?, 'CREATE', ?, NULL, ?)
                ");
                $audit->execute([
                    $id, $fullName, $currentUser['id'], $currentUser['email'], $currentUser['full_name'],
                    $summary, json_encode($person)
                ]);
            }

            echo json_encode(['success' => true, 'id' => $id]);
            break;

        // 8. DELETE PERSON
        case 'delete-person':
            $currentUser = requireAuth();
            $id = isset($data['id']) ? $data['id'] : '';

            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID requerido.']);
                exit;
            }

            $stmt = $db->prepare("SELECT * FROM people WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();

            if ($existing) {
                $fullName = "{$existing['first_name']} {$existing['last_name']}";
                $db->prepare("DELETE FROM people WHERE id = ?")->execute([$id]);

                $audit = $db->prepare("
                    INSERT INTO change_logs (person_id, person_name, user_id, user_email, user_name, action, changes_summary, old_data, new_data)
                    VALUES (?, ?, ?, ?, ?, 'DELETE', ?, ?, NULL)
                ");
                $audit->execute([
                    $id, $fullName, $currentUser['id'], $currentUser['email'], $currentUser['full_name'],
                    "Eliminó el registro de {$fullName} del árbol", json_encode($existing)
                ]);
            }

            echo json_encode(['success' => true]);
            break;

        // 9. AUDIT HISTORY
        case 'get-history':
            requireAuth();
            $personId = isset($_GET['personId']) ? $_GET['personId'] : null;

            if ($personId) {
                $stmt = $db->prepare("SELECT * FROM change_logs WHERE person_id = ? ORDER BY created_at DESC LIMIT 50");
                $stmt->execute([$personId]);
            } else {
                $stmt = $db->query("SELECT * FROM change_logs ORDER BY created_at DESC LIMIT 100");
            }

            $logs = $stmt->fetchAll();
            echo json_encode(['history' => $logs]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Acción no válida o no especificada.']);
            break;
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
