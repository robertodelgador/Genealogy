import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  username: string;
  name: string;
  role: 'admin' | 'family';
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  loginError: string | null;
  login: (usernameOrPin: string, password?: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

// Pre-configured authorized accounts & family passcodes
const AUTHORIZED_ACCOUNTS: Record<string, { pass: string; name: string; role: 'admin' | 'family' }> = {
  admin: { pass: 'Indelrue2026!', name: 'Administrador', role: 'admin' },
  familia: { pass: 'Urruela2026', name: 'Familia', role: 'family' },
  roberto: { pass: 'Indelrue2026!', name: 'Roberto Delgado', role: 'admin' },
};

// Also allows a single direct Family Passphrase / PIN
const SHARED_PASSPHRASES = ['Urruela2026', 'Indelrue2026!', 'ArbolGenealogico2026'];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      loginError: null,

      login: (usernameOrPin: string, password?: string) => {
        const cleanInput = usernameOrPin.trim();
        const cleanPass = (password || '').trim();

        // 1. Direct Passphrase/PIN login
        if (!password && SHARED_PASSPHRASES.includes(cleanInput)) {
          set({
            isAuthenticated: true,
            currentUser: { username: 'familia', name: 'Miembro de la Familia', role: 'family' },
            loginError: null,
          });
          return true;
        }

        // 2. Username + Password login
        const accountKey = cleanInput.toLowerCase();
        const account = AUTHORIZED_ACCOUNTS[accountKey];

        if (account && (cleanPass === account.pass || (!cleanPass && SHARED_PASSPHRASES.includes(cleanInput)))) {
          set({
            isAuthenticated: true,
            currentUser: { username: accountKey, name: account.name, role: account.role },
            loginError: null,
          });
          return true;
        }

        // Failed login
        set({
          loginError: 'Usuario, contraseña o clave de acceso familiar incorrecta.',
        });
        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          loginError: null,
        });
      },

      clearError: () => set({ loginError: null }),
    }),
    {
      name: 'genealogy-auth-storage',
    }
  )
);
