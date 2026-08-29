import type { Person, FamilyTreeData } from '../types';

interface RawIndi {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  gender: 'male' | 'female' | 'unknown';
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  notes?: string;
  famc: string[];
  fams: string[];
}

interface RawFam {
  id: string;
  husb?: string;
  wife?: string;
  children: string[];
  marrDate?: string;
  marrPlace?: string;
}

/**
 * Standard GEDCOM 5.5 / 5.5.1 Date Normalizer (e.g., "26 APR 1978" -> "1978-04-26" or "1978")
 */
function normalizeGedcomDate(rawDate?: string): string | undefined {
  if (!rawDate) return undefined;
  const cleaned = rawDate.trim();

  // Handle formats like "26 APR 1978", "15 FEB 1984", "MAY 1985", "1956", "ABT 1920"
  const months: Record<string, string> = {
    JAN: '01', ENE: '01',
    FEB: '02',
    MAR: '03',
    APR: '04', ABR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08', AGO: '08',
    SEP: '09', SET: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12', DIC: '12',
  };

  const dmy = cleaned.match(/(?:(?:ABT|CAL|EST|AFT|BEF|BET)\s+)?(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/i);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = months[dmy[2].toUpperCase()] || '01';
    const year = dmy[3];
    return `${year}-${month}-${day}`;
  }

  const my = cleaned.match(/(?:(?:ABT|CAL|EST|AFT|BEF|BET)\s+)?([A-Za-z]{3})\s+(\d{4})/i);
  if (my) {
    const month = months[my[1].toUpperCase()] || '01';
    const year = my[2];
    return `${year}-${month}-01`;
  }

  const y = cleaned.match(/\b(\d{4})\b/);
  if (y) {
    return y[1];
  }

  return cleaned;
}

/**
 * Parse standard GEDCOM 5.5 / 5.5.1 text into FamilyTreeData
 */
export function parseGedcom(content: string): FamilyTreeData {
  const lines = content.split(/\r?\n/);
  const indis: Record<string, RawIndi> = {};
  const fams: Record<string, RawFam> = {};

  let currentType: 'INDI' | 'FAM' | null = null;
  let currentIndi: RawIndi | null = null;
  let currentFam: RawFam | null = null;
  let currentContext: 'BIRT' | 'DEAT' | 'MARR' | 'NAME' | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match GEDCOM line syntax: <level> [<tag_or_id>] [<content>]
    const match = trimmed.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?(\w+)(?:\s+(.*))?$/);
    if (!match) continue;

    const level = parseInt(match[1], 10);
    const pointer = match[2];
    const tag = match[3];
    const value = match[4]?.trim() ?? '';

    if (level === 0) {
      currentContext = null;
      if (pointer && (tag === 'INDI' || value === 'INDI')) {
        currentType = 'INDI';
        currentIndi = {
          id: pointer.replace(/@/g, '').toLowerCase(),
          firstName: 'Desconocido',
          lastName: '',
          gender: 'unknown',
          famc: [],
          fams: [],
        };
        indis[currentIndi.id] = currentIndi;
      } else if (pointer && (tag === 'FAM' || value === 'FAM')) {
        currentType = 'FAM';
        currentFam = {
          id: pointer.replace(/@/g, '').toLowerCase(),
          children: [],
        };
        fams[currentFam.id] = currentFam;
      } else {
        currentType = null;
      }
      continue;
    }

    if (currentType === 'INDI' && currentIndi) {
      if (level === 1) {
        currentContext = null;
        if (tag === 'NAME') {
          currentContext = 'NAME';
          // Name in format "Roberto /Delgado Rüegg/"
          const nameMatch = value.match(/^(.*?)(?:\s*\/(.*?)\/)?$/);
          if (nameMatch) {
            currentIndi.firstName = nameMatch[1]?.trim() || 'Desconocido';
            currentIndi.lastName = nameMatch[2]?.trim() || '';
          } else {
            currentIndi.firstName = value || 'Desconocido';
          }
        } else if (tag === 'SEX') {
          const s = value.toUpperCase();
          currentIndi.gender = s === 'M' ? 'male' : s === 'F' ? 'female' : 'unknown';
        } else if (tag === 'BIRT') {
          currentContext = 'BIRT';
        } else if (tag === 'DEAT') {
          currentContext = 'DEAT';
        } else if (tag === 'FAMC') {
          const famId = value.replace(/@/g, '').toLowerCase();
          if (famId) currentIndi.famc.push(famId);
        } else if (tag === 'FAMS') {
          const famId = value.replace(/@/g, '').toLowerCase();
          if (famId) currentIndi.fams.push(famId);
        } else if (tag === 'NOTE') {
          currentIndi.notes = currentIndi.notes ? `${currentIndi.notes}\n${value}` : value;
        }
      } else if (level === 2) {
        if (currentContext === 'NAME') {
          if (tag === 'GIVN' && value) currentIndi.firstName = value;
          if (tag === 'SURN' && value) currentIndi.lastName = value;
          if (tag === '_MARNM' && value) currentIndi.maidenName = value;
        } else if (currentContext === 'BIRT') {
          if (tag === 'DATE') currentIndi.birthDate = normalizeGedcomDate(value);
          if (tag === 'PLAC') currentIndi.birthPlace = value;
        } else if (currentContext === 'DEAT') {
          if (tag === 'DATE') currentIndi.deathDate = normalizeGedcomDate(value);
          if (tag === 'PLAC') currentIndi.deathPlace = value;
        }
      }
    } else if (currentType === 'FAM' && currentFam) {
      if (level === 1) {
        currentContext = null;
        if (tag === 'HUSB') {
          currentFam.husb = value.replace(/@/g, '').toLowerCase();
        } else if (tag === 'WIFE') {
          currentFam.wife = value.replace(/@/g, '').toLowerCase();
        } else if (tag === 'CHIL') {
          const cid = value.replace(/@/g, '').toLowerCase();
          if (cid) currentFam.children.push(cid);
        } else if (tag === 'MARR') {
          currentContext = 'MARR';
        }
      } else if (level === 2 && currentContext === 'MARR') {
        if (tag === 'DATE') currentFam.marrDate = normalizeGedcomDate(value);
        if (tag === 'PLAC') currentFam.marrPlace = value;
      }
    }
  }

  // Convert RawIndis and RawFams into bidirectional Person dictionary
  const people: Record<string, Person> = {};

  for (const [id, raw] of Object.entries(indis)) {
    people[id] = {
      id,
      firstName: raw.firstName || 'Desconocido',
      lastName: raw.lastName || '',
      maidenName: raw.maidenName,
      gender: raw.gender,
      birthDate: raw.birthDate,
      birthPlace: raw.birthPlace,
      deathDate: raw.deathDate,
      deathPlace: raw.deathPlace,
      notes: raw.notes,
      parentIds: [],
      spouseIds: [],
      childIds: [],
    };
  }

  // Connect families
  for (const fam of Object.values(fams)) {
    const { husb, wife, children } = fam;

    // Link spouses
    if (husb && wife && people[husb] && people[wife]) {
      if (!people[husb].spouseIds.includes(wife)) people[husb].spouseIds.push(wife);
      if (!people[wife].spouseIds.includes(husb)) people[wife].spouseIds.push(husb);
    }

    // Link parents to children
    for (const cid of children) {
      if (!people[cid]) continue;

      if (husb && people[husb]) {
        if (!people[cid].parentIds.includes(husb)) people[cid].parentIds.push(husb);
        if (!people[husb].childIds.includes(cid)) people[husb].childIds.push(cid);
      }
      if (wife && people[wife]) {
        if (!people[cid].parentIds.includes(wife)) people[cid].parentIds.push(wife);
        if (!people[wife].childIds.includes(cid)) people[wife].childIds.push(cid);
      }
    }
  }

  // Determine root person
  const allIds = Object.keys(people);
  let rootId = allIds[0] || '';

  // Look for Roberto Delgado Rüegg first
  for (const [id, p] of Object.entries(people)) {
    const full = `${p.firstName} ${p.lastName}`.toLowerCase();
    if (full.includes('roberto') && full.includes('delgado') && full.includes('ruegg')) {
      rootId = id;
      break;
    }
  }

  return { rootId, people };
}

/**
 * Export FamilyTreeData to standard GEDCOM 5.5.1 file format
 */
export function exportToGedcom(data: FamilyTreeData): string {
  const { people } = data;
  const lines: string[] = [
    '0 HEAD',
    '1 SOUR GenealogyTreeManager',
    '2 VERS 1.0.0',
    '2 NAME Gestor de Árbol Genealógico',
    '1 GEDC',
    '2 VERS 5.5.1',
    '2 FORM LINEAGE-LINKED',
    '1 CHAR UTF-8',
    '1 LANG Spanish',
  ];

  // Map of families: key = "husb:wife", value = { famId, husb, wife, children }
  const familyMap = new Map<string, { famId: string; husb?: string; wife?: string; children: string[] }>();
  let famCounter = 1;

  // Build families
  for (const person of Object.values(people)) {
    for (const sid of person.spouseIds) {
      const p1 = person.gender === 'male' ? person.id : sid;
      const p2 = person.gender === 'male' ? sid : person.id;
      const key = `${p1}:${p2}`;
      if (!familyMap.has(key)) {
        familyMap.set(key, {
          famId: `F${famCounter++}`,
          husb: p1,
          wife: p2,
          children: [],
        });
      }
    }
  }

  // Assign children to families
  for (const child of Object.values(people)) {
    if (child.parentIds.length >= 1) {
      const p1 = child.parentIds[0];
      const p2 = child.parentIds[1];
      let foundKey = '';
      for (const [key, fam] of familyMap.entries()) {
        if ((fam.husb === p1 && fam.wife === p2) || (fam.husb === p2 && fam.wife === p1)) {
          foundKey = key;
          break;
        }
      }
      if (!foundKey) {
        foundKey = `${p1}:${p2 || ''}`;
        familyMap.set(foundKey, {
          famId: `F${famCounter++}`,
          husb: p1,
          wife: p2,
          children: [],
        });
      }
      familyMap.get(foundKey)!.children.push(child.id);
    }
  }

  // 1. Output Individuals (INDI)
  for (const p of Object.values(people)) {
    const indiId = `@I_${p.id.replace(/[^a-zA-Z0-9_]/g, '_')}@`;
    lines.push(`0 ${indiId} INDI`);
    lines.push(`1 NAME ${p.firstName} /${p.lastName}/`);
    lines.push(`2 GIVN ${p.firstName}`);
    lines.push(`2 SURN ${p.lastName}`);
    if (p.maidenName) lines.push(`2 _MARNM ${p.maidenName}`);
    lines.push(`1 SEX ${p.gender === 'male' ? 'M' : p.gender === 'female' ? 'F' : 'U'}`);

    if (p.birthDate || p.birthPlace) {
      lines.push('1 BIRT');
      if (p.birthDate) lines.push(`2 DATE ${p.birthDate}`);
      if (p.birthPlace) lines.push(`2 PLAC ${p.birthPlace}`);
    }

    if (p.deathDate || p.deathPlace) {
      lines.push('1 DEAT');
      if (p.deathDate) lines.push(`2 DATE ${p.deathDate}`);
      if (p.deathPlace) lines.push(`2 PLAC ${p.deathPlace}`);
    }

    if (p.notes) {
      lines.push(`1 NOTE ${p.notes.replace(/\n/g, ' ')}`);
    }

    // Link to Families
    for (const fam of familyMap.values()) {
      if (fam.husb === p.id || fam.wife === p.id) {
        lines.push(`1 FAMS @${fam.famId}@`);
      }
      if (fam.children.includes(p.id)) {
        lines.push(`1 FAMC @${fam.famId}@`);
      }
    }
  }

  // 2. Output Families (FAM)
  for (const fam of familyMap.values()) {
    lines.push(`0 @${fam.famId}@ FAM`);
    if (fam.husb && people[fam.husb]) {
      lines.push(`1 HUSB @I_${fam.husb.replace(/[^a-zA-Z0-9_]/g, '_')}@`);
    }
    if (fam.wife && people[fam.wife]) {
      lines.push(`1 WIFE @I_${fam.wife.replace(/[^a-zA-Z0-9_]/g, '_')}@`);
    }
    for (const cid of fam.children) {
      if (people[cid]) {
        lines.push(`1 CHIL @I_${cid.replace(/[^a-zA-Z0-9_]/g, '_')}@`);
      }
    }
  }

  lines.push('0 TRLR');
  return lines.join('\n');
}
