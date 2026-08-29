import type { Person } from '../types';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  COUPLE_SPACING,
  GENERATION_HEIGHT,
  type LayoutResult,
  type LayoutUnit,
} from './layout';

export const CARD_W = CARD_WIDTH;
export const CARD_H = CARD_HEIGHT;

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
    const y = (unit.gen - layout.minGen) * GENERATION_HEIGHT;

    if (unit.memberIds.length === 2) {
      const leftX = unit.x - (CARD_WIDTH + COUPLE_SPACING) / 2;
      const rightX = unit.x + (CARD_WIDTH + COUPLE_SPACING) / 2;
      positions[unit.memberIds[0]] = { id: unit.memberIds[0], x: leftX, y };
      positions[unit.memberIds[1]] = { id: unit.memberIds[1], x: rightX, y };

      spouseLinks.push({
        aId: unit.memberIds[0],
        bId: unit.memberIds[1],
        x1: leftX + CARD_WIDTH / 2,
        x2: rightX - CARD_WIDTH / 2,
        y,
      });
    } else {
      positions[unit.memberIds[0]] = { id: unit.memberIds[0], x: unit.x, y };
    }
  }

  const familyLinks: FamilyLink[] = [];
  for (const unit of layout.units) {
    const childIds = new Set<string>();
    for (const m of unit.memberIds) {
      for (const cid of people[m]?.childIds ?? []) {
        if (layout.personToUnit[cid] && positions[cid]) childIds.add(cid);
      }
    }
    if (childIds.size === 0) continue;

    const parentX = unit.x;
    const parentY = (unit.gen - layout.minGen) * GENERATION_HEIGHT;
    const children = [...childIds]
      .map((cid) => positions[cid])
      .filter(Boolean)
      .map((p) => ({ id: p.id, x: p.x, y: p.y }));

    if (children.length === 0) continue;

    familyLinks.push({
      unitId: unit.id,
      parentX,
      parentY: parentY + CARD_HEIGHT / 2,
      children,
      busY: parentY + GENERATION_HEIGHT / 2,
    });
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const pos of Object.values(positions)) {
    minX = Math.min(minX, pos.x - CARD_WIDTH / 2);
    maxX = Math.max(maxX, pos.x + CARD_WIDTH / 2);
    minY = Math.min(minY, pos.y - CARD_HEIGHT / 2);
    maxY = Math.max(maxY, pos.y + CARD_HEIGHT / 2);
  }

  if (!isFinite(minX)) {
    minX = -400;
    maxX = 400;
    minY = 0;
    maxY = 600;
  }

  return { people: positions, spouseLinks, familyLinks, bounds: { minX, maxX, minY, maxY } };
}

export type { LayoutUnit as Unit };
