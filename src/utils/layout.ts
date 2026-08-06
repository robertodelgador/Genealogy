import type { Person } from '../types';

export interface Unit {
  id: string;
  memberIds: string[]; // 1 (single) or 2 (couple)
  gen: number;
  x: number; // slot index (later converted to px)
}

export interface LayoutResult {
  units: Unit[];
  personToUnit: Record<string, string>;
  personGen: Record<string, number>;
  minGen: number;
  maxGen: number;
}

function byBirthDate(people: Record<string, Person>) {
  return (a: string, b: string) => {
    const da = people[a]?.birthDate ?? '';
    const db = people[b]?.birthDate ?? '';
    if (da && db) return da.localeCompare(db);
    return a.localeCompare(b);
  };
}

/** Assign a generation number to every person reachable from rootId. */
function assignGenerations(people: Record<string, Person>, rootId: string) {
  const gen: Record<string, number> = {};
  const queue: string[] = [rootId];
  gen[rootId] = 0;
  while (queue.length) {
    const id = queue.shift()!;
    const person = people[id];
    if (!person) continue;
    const g = gen[id];
    for (const sid of person.spouseIds) {
      if (!(sid in gen) && people[sid]) {
        gen[sid] = g;
        queue.push(sid);
      }
    }
    for (const cid of person.childIds) {
      if (!(cid in gen) && people[cid]) {
        gen[cid] = g + 1;
        queue.push(cid);
      }
    }
    for (const pid of person.parentIds) {
      if (!(pid in gen) && people[pid]) {
        gen[pid] = g - 1;
        queue.push(pid);
      }
    }
  }
  return gen;
}

/** Pair up people within a generation into couple units, preserving given order. */
function buildUnits(
  ids: string[],
  people: Record<string, Person>,
  genOf: Record<string, number>,
  placed: Set<string>
): string[][] {
  const groups: string[][] = [];
  const localVisited = new Set<string>();
  for (const id of ids) {
    if (localVisited.has(id) || placed.has(id)) continue;
    const person = people[id];
    const spouse = person.spouseIds.find(
      (s) => genOf[s] === genOf[id] && !localVisited.has(s) && !placed.has(s) && ids.includes(s)
    );
    if (spouse) {
      groups.push([id, spouse]);
      localVisited.add(id);
      localVisited.add(spouse);
    } else {
      groups.push([id]);
      localVisited.add(id);
    }
  }
  return groups;
}

export function computeLayout(people: Record<string, Person>, rootId: string | null): LayoutResult {
  const allIds = Object.keys(people);
  if (!rootId || !people[rootId] || allIds.length === 0) {
    return { units: [], personToUnit: {}, personGen: {}, minGen: 0, maxGen: 0 };
  }

  const genOf = assignGenerations(people, rootId);
  // Any people not reachable from root are dropped from the visual tree (they belong to
  // a separate disconnected family group and aren't shown until connected).
  const byGen = new Map<number, string[]>();
  for (const id of allIds) {
    if (!(id in genOf)) continue;
    const g = genOf[id];
    if (!byGen.has(g)) byGen.set(g, []);
    byGen.get(g)!.push(id);
  }
  const genLevels = [...byGen.keys()].sort((a, b) => a - b);
  const minGen = genLevels[0];
  const maxGen = genLevels[genLevels.length - 1];

  const placed = new Set<string>();
  const genUnits = new Map<number, string[][]>(); // gen -> ordered groups (in x order)

  // --- Pass 1: top-down, order driven by parent order in previous generation ---
  for (const g of genLevels) {
    const idsInGen = (byGen.get(g) ?? []).sort(byBirthDate(people));
    if (g === minGen) {
      const units = buildUnits(idsInGen, people, genOf, placed);
      units.forEach((u) => u.forEach((id) => placed.add(id)));
      genUnits.set(g, units);
      continue;
    }
    const prevUnits = genUnits.get(g - 1) ?? [];
    const orderedChildren: string[] = [];
    const seenChild = new Set<string>();
    for (const unit of prevUnits) {
      const childIds = new Set<string>();
      for (const memberId of unit) {
        for (const cid of people[memberId]?.childIds ?? []) {
          if (genOf[cid] === g) childIds.add(cid);
        }
      }
      const sorted = [...childIds].sort(byBirthDate(people));
      for (const cid of sorted) {
        if (!seenChild.has(cid)) {
          seenChild.add(cid);
          orderedChildren.push(cid);
        }
      }
    }
    // Anyone in this generation not attached to a previous-gen unit (married-in with
    // untracked parents, or orphaned entries) gets appended at the end, in stable order.
    for (const id of idsInGen) {
      if (!seenChild.has(id)) {
        seenChild.add(id);
        orderedChildren.push(id);
      }
    }
    const units = buildUnits(orderedChildren, people, genOf, placed);
    units.forEach((u) => u.forEach((id) => placed.add(id)));
    genUnits.set(g, units);
  }

  // --- Assign initial integer slots ---
  const units: Unit[] = [];
  const personToUnit: Record<string, string> = {};
  for (const g of genLevels) {
    const groups = genUnits.get(g) ?? [];
    groups.forEach((members, idx) => {
      const unitId = `u-${g}-${idx}`;
      units.push({ id: unitId, memberIds: members, gen: g, x: idx });
      members.forEach((m) => (personToUnit[m] = unitId));
    });
  }

  // --- Pass 2: bottom-up centering refinement ---
  const unitByGenOrdered = new Map<number, Unit[]>();
  for (const u of units) {
    if (!unitByGenOrdered.has(u.gen)) unitByGenOrdered.set(u.gen, []);
    unitByGenOrdered.get(u.gen)!.push(u);
  }
  unitByGenOrdered.forEach((arr) => arr.sort((a, b) => a.x - b.x));

  const childUnitsOf = (unit: Unit): Unit[] => {
    const childIds = new Set<string>();
    for (const m of unit.memberIds) {
      for (const cid of people[m]?.childIds ?? []) childIds.add(cid);
    }
    const result = new Set<Unit>();
    for (const cid of childIds) {
      const uid = personToUnit[cid];
      if (uid) {
        const u = units.find((x) => x.id === uid);
        if (u) result.add(u);
      }
    }
    return [...result];
  };

  for (let g = maxGen - 1; g >= minGen; g--) {
    const arr = unitByGenOrdered.get(g);
    if (!arr) continue;
    for (const unit of arr) {
      const kids = childUnitsOf(unit);
      if (kids.length > 0) {
        const avg = kids.reduce((sum, k) => sum + k.x, 0) / kids.length;
        unit.x = avg;
      }
    }
    // resolve overlaps left-to-right while preserving relative order
    arr.sort((a, b) => a.x - b.x);
    for (let i = 1; i < arr.length; i++) {
      const minGap = 1;
      if (arr[i].x < arr[i - 1].x + minGap) {
        arr[i].x = arr[i - 1].x + minGap;
      }
    }
  }

  return { units, personToUnit, personGen: genOf, minGen, maxGen };
}
