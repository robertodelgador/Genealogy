import type { Person } from '../types';

export interface LayoutUnit {
  id: string;
  memberIds: string[];
  gen: number;
  width: number;
  x: number; // Center X in pixels
}

export interface LayoutResult {
  units: LayoutUnit[];
  personToUnit: Record<string, string>;
  personGen: Record<string, number>;
  minGen: number;
  maxGen: number;
}

export const CARD_WIDTH = 200;
export const CARD_HEIGHT = 88;
export const COUPLE_SPACING = 20;
export const UNIT_GAP = 48;
export const GENERATION_HEIGHT = 180;

function byBirthDate(people: Record<string, Person>) {
  return (a: string, b: string) => {
    const da = people[a]?.birthDate ?? '';
    const db = people[b]?.birthDate ?? '';
    if (da && db) return da.localeCompare(db);
    return a.localeCompare(b);
  };
}

/** Assign generational depth relative to focusId (focusId = 0) */
export function assignGenerations(
  people: Record<string, Person>,
  focusId: string,
  filterDirectOnly = false
): Record<string, number> {
  const gen: Record<string, number> = {};
  if (!people[focusId]) return gen;

  gen[focusId] = 0;
  const queue: string[] = [focusId];

  // If filtering to direct ancestry and contiguous relations
  if (filterDirectOnly) {
    const allowed = new Set<string>([focusId]);

    // Add ancestors (parents, grandparents...)
    const addAncestors = (id: string, currentGen: number) => {
      const p = people[id];
      if (!p) return;
      for (const pid of p.parentIds) {
        if (people[pid] && !allowed.has(pid)) {
          allowed.add(pid);
          gen[pid] = currentGen - 1;
          addAncestors(pid, currentGen - 1);
        }
      }
    };
    addAncestors(focusId, 0);

    // Add spouses
    for (const sid of people[focusId]?.spouseIds ?? []) {
      if (people[sid]) {
        allowed.add(sid);
        gen[sid] = 0;
      }
    }

    // Add siblings (sharing same parents)
    for (const pid of people[focusId]?.parentIds ?? []) {
      for (const cid of people[pid]?.childIds ?? []) {
        if (people[cid]) {
          allowed.add(cid);
          gen[cid] = 0;
        }
      }
    }

    // Add descendants (children, grandchildren...)
    const addDescendants = (id: string, currentGen: number) => {
      const p = people[id];
      if (!p) return;
      for (const cid of p.childIds) {
        if (people[cid] && !allowed.has(cid)) {
          allowed.add(cid);
          gen[cid] = currentGen + 1;
          addDescendants(cid, currentGen + 1);
        }
      }
    };
    addDescendants(focusId, 0);

    return gen;
  }

  // Full tree BFS
  while (queue.length) {
    const id = queue.shift()!;
    const person = people[id];
    if (!person) continue;
    const g = gen[id];

    // Spouses at same generation
    for (const sid of person.spouseIds) {
      if (!(sid in gen) && people[sid]) {
        gen[sid] = g;
        queue.push(sid);
      }
    }
    // Children at gen + 1
    for (const cid of person.childIds) {
      if (!(cid in gen) && people[cid]) {
        gen[cid] = g + 1;
        queue.push(cid);
      }
    }
    // Parents at gen - 1
    for (const pid of person.parentIds) {
      if (!(pid in gen) && people[pid]) {
        gen[pid] = g - 1;
        queue.push(pid);
      }
    }
  }

  return gen;
}

/** Build couple or single layout units */
function buildUnitsForGen(
  ids: string[],
  people: Record<string, Person>,
  genOf: Record<string, number>,
  placed: Set<string>
): string[][] {
  const groups: string[][] = [];
  const visited = new Set<string>();

  for (const id of ids) {
    if (visited.has(id) || placed.has(id)) continue;
    const person = people[id];
    if (!person) continue;

    // Find spouse in same generation
    const spouse = person.spouseIds.find(
      (s) => genOf[s] === genOf[id] && !visited.has(s) && !placed.has(s) && ids.includes(s)
    );

    if (spouse) {
      groups.push([id, spouse]);
      visited.add(id);
      visited.add(spouse);
    } else {
      groups.push([id]);
      visited.add(id);
    }
  }

  return groups;
}

export function computeLayout(
  people: Record<string, Person>,
  focusId: string | null,
  filterDirectOnly = false
): LayoutResult {
  const allIds = Object.keys(people);
  if (!focusId || !people[focusId] || allIds.length === 0) {
    return { units: [], personToUnit: {}, personGen: {}, minGen: 0, maxGen: 0 };
  }

  const genOf = assignGenerations(people, focusId, filterDirectOnly);
  const byGen = new Map<number, string[]>();

  for (const id of Object.keys(genOf)) {
    const g = genOf[id];
    if (!byGen.has(g)) byGen.set(g, []);
    byGen.get(g)!.push(id);
  }

  const genLevels = [...byGen.keys()].sort((a, b) => a - b);
  if (genLevels.length === 0) {
    return { units: [], personToUnit: {}, personGen: {}, minGen: 0, maxGen: 0 };
  }

  const minGen = genLevels[0];
  const maxGen = genLevels[genLevels.length - 1];

  const placed = new Set<string>();
  const genUnitsMap = new Map<number, string[][]>();

  // Pass 1: Build units per generation ordered by parental links
  for (const g of genLevels) {
    const idsInGen = (byGen.get(g) ?? []).sort(byBirthDate(people));
    if (g === minGen) {
      const units = buildUnitsForGen(idsInGen, people, genOf, placed);
      units.forEach((u) => u.forEach((id) => placed.add(id)));
      genUnitsMap.set(g, units);
      continue;
    }

    const prevUnits = genUnitsMap.get(g - 1) ?? [];
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

    for (const id of idsInGen) {
      if (!seenChild.has(id)) {
        seenChild.add(id);
        orderedChildren.push(id);
      }
    }

    const units = buildUnitsForGen(orderedChildren, people, genOf, placed);
    units.forEach((u) => u.forEach((id) => placed.add(id)));
    genUnitsMap.set(g, units);
  }

  // Create layout units with exact pixel widths
  const units: LayoutUnit[] = [];
  const personToUnit: Record<string, string> = {};

  for (const g of genLevels) {
    const groups = genUnitsMap.get(g) ?? [];
    groups.forEach((members, idx) => {
      const unitId = `u-${g}-${idx}`;
      const width = members.length === 2 ? CARD_WIDTH * 2 + COUPLE_SPACING : CARD_WIDTH;
      units.push({
        id: unitId,
        memberIds: members,
        gen: g,
        width,
        x: 0,
      });
      members.forEach((m) => (personToUnit[m] = unitId));
    });
  }

  // Group units by generation
  const unitsByGen = new Map<number, LayoutUnit[]>();
  for (const u of units) {
    if (!unitsByGen.has(u.gen)) unitsByGen.set(u.gen, []);
    unitsByGen.get(u.gen)!.push(u);
  }

  // Pass 2: Initial non-overlapping horizontal placement from left to right
  for (const g of genLevels) {
    const arr = unitsByGen.get(g) ?? [];
    for (let i = 0; i < arr.length; i++) {
      const u = arr[i];
      if (i === 0) {
        u.x = u.width / 2;
      } else {
        const prev = arr[i - 1];
        u.x = prev.x + prev.width / 2 + UNIT_GAP + u.width / 2;
      }
    }
  }

  // Pass 3: Bottom-up centering alignment (Parents centered above children)
  const childUnitsOf = (unit: LayoutUnit): LayoutUnit[] => {
    const childIds = new Set<string>();
    for (const m of unit.memberIds) {
      for (const cid of people[m]?.childIds ?? []) {
        if (personToUnit[cid]) childIds.add(cid);
      }
    }
    const res = new Set<LayoutUnit>();
    for (const cid of childIds) {
      const uid = personToUnit[cid];
      if (uid) {
        const found = units.find((x) => x.id === uid);
        if (found) res.add(found);
      }
    }
    return [...res];
  };

  for (let g = maxGen - 1; g >= minGen; g--) {
    const arr = unitsByGen.get(g);
    if (!arr) continue;

    for (const unit of arr) {
      const kids = childUnitsOf(unit);
      if (kids.length > 0) {
        const minKidX = Math.min(...kids.map((k) => k.x - k.width / 2));
        const maxKidX = Math.max(...kids.map((k) => k.x + k.width / 2));
        unit.x = (minKidX + maxKidX) / 2;
      }
    }

    // Resolve overlaps strictly
    arr.sort((a, b) => a.x - b.x);
    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1];
      const curr = arr[i];
      const minAllowed = prev.x + prev.width / 2 + UNIT_GAP + curr.width / 2;
      if (curr.x < minAllowed) {
        curr.x = minAllowed;
      }
    }
  }

  // Pass 4: Top-down relaxation (children aligned under parents without overlap)
  for (let g = minGen + 1; g <= maxGen; g++) {
    const arr = unitsByGen.get(g);
    if (!arr) continue;

    // Check overlaps
    arr.sort((a, b) => a.x - b.x);
    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1];
      const curr = arr[i];
      const minAllowed = prev.x + prev.width / 2 + UNIT_GAP + curr.width / 2;
      if (curr.x < minAllowed) {
        curr.x = minAllowed;
      }
    }
  }

  // Center entire tree horizontally at x = 0
  let totalMinX = Infinity;
  let totalMaxX = -Infinity;
  for (const u of units) {
    totalMinX = Math.min(totalMinX, u.x - u.width / 2);
    totalMaxX = Math.max(totalMaxX, u.x + u.width / 2);
  }
  const treeCenterX = (totalMinX + totalMaxX) / 2;
  for (const u of units) {
    u.x -= treeCenterX;
  }

  return { units, personToUnit, personGen: genOf, minGen, maxGen };
}
