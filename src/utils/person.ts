import type { Person } from '../types';

export function fullName(person: Person): string {
  return `${person.firstName} ${person.lastName}`.trim();
}

export function yearOf(dateStr?: string): string {
  if (!dateStr) return '';
  const match = dateStr.match(/\d{4}/);
  return match ? match[0] : dateStr;
}

export function lifespan(person: Person): string {
  const birth = yearOf(person.birthDate);
  const death = yearOf(person.deathDate);
  if (!birth && !death) return '';
  if (birth && death) return `${birth} – ${death}`;
  if (birth) return `b. ${birth}`;
  return `d. ${death}`;
}

export function initials(person: Person): string {
  const a = person.firstName?.[0] ?? '';
  const b = person.lastName?.[0] ?? '';
  return (a + b).toUpperCase() || '?';
}
