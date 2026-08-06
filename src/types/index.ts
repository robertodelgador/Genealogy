export type Gender = 'male' | 'female' | 'unknown';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  gender: Gender;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  photoUrl?: string;
  notes?: string;
  /** Ids of parents (max 2 in practice, but not enforced). */
  parentIds: string[];
  /** Ids of spouses/partners. */
  spouseIds: string[];
  /** Ids of children. */
  childIds: string[];
}

export interface FamilyTreeData {
  people: Record<string, Person>;
  rootId: string | null;
}

export type NewPerson = Omit<Person, 'id' | 'parentIds' | 'spouseIds' | 'childIds'>;
