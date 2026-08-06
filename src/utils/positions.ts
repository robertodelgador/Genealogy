import type { Person } from '../types';
import type { LayoutResult, Unit } from './layout';

export const CARD_W = 184;
export const CARD_H = 92;
export const SLOT_W = 232;
export const ROW_H = 176;
export const COUPLE_GAP = 16;

export interface PositionedPerson {
  id: string;
  x: number; // center x, px
  y: number; // center y, px
}

export interface SpouseLink {
  aId: string;
  bId: string;
  x1: number;
  x2: number;
  y: number;
}

export interface FamilyLink {
  unitId: string;
  parentX: number;
  parentY: number;
  children: { id: string; x: number; y: number }[];
  busY: number;
}

export interface ComputedPositions {
  people: Record<string, PositionedPerson>;
  spouseLinks: SpouseLink[];
  familyLinks: FamilyLink[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

export function computePositions(layout: LayoutResult, people: Record<string, Person>): ComputedPositions {
  const positions: Record<string, PositionedPerson> = {};
  const spouseLinks: SpouseLink[] = [];

  for (const unit of layout.units) {
    const centerX = unit.x * SLOT_W;
    const y = (unit.gen - layout.minGen) * ROW_H;
    if (unit.memberIds.length === 2) {
      const leftX = centerX - (CARD_W + COUPLE_GAP) / 2;
      const rightX = centerX + (CARD_W + COUPLE_GAP) / 2;
      positions[unit.memberIds[0]] = { id: unit.memberIds[0], x: leftX, y };
      positions[unit.memberIds[1]] = { id: unit.memberIds[1], x: rightX, y };
      spouseLinks.push({
        aId: unit.memberIds[0],
        bId: unit.memberIds[1],
        x1: leftX + CARD_W / 2,
        x2: rightX - CARD_W / 2,
        y,
      });
    } else {
      positions[unit.memberIds[0]] = { id: unit.memberIds[0], x: centerX, y };
    }
  }

  const familyLinks: FamilyLink[] = [];
  for (const unit of layout.units) {
    const childIds = new Set<string>();
    for (const m of unit.memberIds) {
      for (const cid of people[m]?.childIds ?? []) {
        if (layout.personToUnit[cid]) childIds.add(cid);
      }
    }
    if (childIds.size === 0) continue;
    const memberPositions = unit.memberIds.map((m) => positions[m]).filter(Boolean);
    const parentX =
      memberPositions.reduce((s, p) => s + p.x, 0) / (memberPositions.length || 1);
    const parentY = memberPositions[0]?.y ?? 0;
    const children = [...childIds]
      .map((cid) => positions[cid])
      .filter(Boolean)
      .map((p) => ({ id: p.id, x: p.x, y: p.y }));
    if (children.length === 0) continue;
    familyLinks.push({
      unitId: unit.id,
      parentX,
      parentY,
      children,
      busY: parentY + ROW_H / 2,
    });
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const pos of Object.values(positions)) {
    minX = Math.min(minX, pos.x - CARD_W / 2);
    maxX = Math.max(maxX, pos.x + CARD_W / 2);
    minY = Math.min(minY, pos.y - CARD_H / 2);
    maxY = Math.max(maxY, pos.y + CARD_H / 2);
  }
  if (!isFinite(minX)) {
    minX = 0;
    maxX = 0;
    minY = 0;
    maxY = 0;
  }

  return { people: positions, spouseLinks, familyLinks, bounds: { minX, maxX, minY, maxY } };
}

export type { Unit };
