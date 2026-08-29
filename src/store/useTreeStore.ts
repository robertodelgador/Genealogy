import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { FamilyTreeData, NewPerson, Person } from '../types';
import { seedData } from '../utils/seedData';

export interface ChangeLogEntry {
  id: number;
  person_id: string;
  person_name: string;
  user_email: string;
  user_name: string;
  action: string;
  changes_summary: string;
  created_at: string;
  old_data?: any;
  new_data?: any;
}

interface TreeState extends FamilyTreeData {
  selectedId: string | null;
  historyLogs: ChangeLogEntry[];
  isLoading: boolean;
  fetchTreeFromDB: () => Promise<void>;
  fetchHistory: (personId?: string) => Promise<void>;
  addPerson: (data: NewPerson) => string;
  updatePerson: (id: string, data: Partial<NewPerson>) => void;
  removePerson: (id: string) => void;
  linkParentChild: (parentId: string, childId: string) => void;
  unlinkParentChild: (parentId: string, childId: string) => void;
  linkSpouses: (aId: string, bId: string) => void;
  unlinkSpouses: (aId: string, bId: string) => void;
  addChildOf: (parentIds: string[], data: NewPerson) => string;
  addParentOf: (childId: string, data: NewPerson) => string;
  addSpouseOf: (personId: string, data: NewPerson) => string;
  setSelected: (id: string | null) => void;
  setRoot: (id: string | null) => void;
  importData: (data: FamilyTreeData) => void;
  resetToSeed: () => void;
  clearAll: () => void;
}

function withoutId(ids: string[], id: string) {
  return ids.filter((x) => x !== id);
}

// Sync person change to PostgreSQL backend
async function syncPersonToBackend(person: Person) {
  try {
    await fetch('api.php?action=save-person', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ person })
    });
  } catch (e) {
    console.error('Error syncing person to PostgreSQL:', e);
  }
}

async function syncDeleteToBackend(id: string) {
  try {
    await fetch('api.php?action=delete-person', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  } catch (e) {
    console.error('Error syncing delete to PostgreSQL:', e);
  }
}

export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      people: seedData.people,
      rootId: seedData.rootId,
      selectedId: seedData.rootId,
      historyLogs: [],
      isLoading: false,

      fetchTreeFromDB: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('api.php?action=get-tree');
          if (res.ok) {
            const data = await res.json();
            if (data.people && Object.keys(data.people).length > 0) {
              set({
                people: data.people,
                rootId: data.rootId || Object.keys(data.people)[0],
                selectedId: data.rootId || Object.keys(data.people)[0],
                isLoading: false
              });
              return;
            }
          }
        } catch (e) {
          console.log('Using local store fallback');
        }
        set({ isLoading: false });
      },

      fetchHistory: async (personId?: string) => {
        try {
          const url = personId ? `api.php?action=get-history&personId=${encodeURIComponent(personId)}` : 'api.php?action=get-history';
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.history) {
              set({ historyLogs: data.history });
            }
          }
        } catch (e) {
          console.error('Error fetching audit history:', e);
        }
      },

      addPerson: (data) => {
        const id = uuid();
        const person: Person = {
          ...data,
          id,
          parentIds: [],
          spouseIds: [],
          childIds: [],
        };
        set((state) => ({ people: { ...state.people, [id]: person } }));
        syncPersonToBackend(person);
        return id;
      },

      updatePerson: (id, data) => {
        const existing = get().people[id];
        if (!existing) return;
        const updated: Person = { ...existing, ...data };
        set((state) => ({
          people: { ...state.people, [id]: updated },
        }));
        syncPersonToBackend(updated);
      },

      removePerson: (id) => {
        set((state) => {
          const people = { ...state.people };
          const target = people[id];
          if (!target) return state;
          target.parentIds.forEach((pid) => {
            const p = people[pid];
            if (p) {
              people[pid] = { ...p, childIds: withoutId(p.childIds, id) };
              syncPersonToBackend(people[pid]);
            }
          });
          target.spouseIds.forEach((sid) => {
            const s = people[sid];
            if (s) {
              people[sid] = { ...s, spouseIds: withoutId(s.spouseIds, id) };
              syncPersonToBackend(people[sid]);
            }
          });
          target.childIds.forEach((cid) => {
            const c = people[cid];
            if (c) {
              people[cid] = { ...c, parentIds: withoutId(c.parentIds, id) };
              syncPersonToBackend(people[cid]);
            }
          });
          delete people[id];
          const rootId = state.rootId === id ? Object.keys(people)[0] ?? null : state.rootId;
          const selectedId = state.selectedId === id ? rootId : state.selectedId;
          syncDeleteToBackend(id);
          return { people, rootId, selectedId };
        });
      },

      linkParentChild: (parentId, childId) => {
        set((state) => {
          const parent = state.people[parentId];
          const child = state.people[childId];
          if (!parent || !child || parentId === childId) return state;
          if (child.parentIds.includes(parentId)) return state;
          const updatedParent = { ...parent, childIds: [...parent.childIds, childId] };
          const updatedChild = { ...child, parentIds: [...child.parentIds, parentId] };
          syncPersonToBackend(updatedParent);
          syncPersonToBackend(updatedChild);
          return {
            people: {
              ...state.people,
              [parentId]: updatedParent,
              [childId]: updatedChild,
            },
          };
        });
      },

      unlinkParentChild: (parentId, childId) => {
        set((state) => {
          const parent = state.people[parentId];
          const child = state.people[childId];
          if (!parent || !child) return state;
          const updatedParent = { ...parent, childIds: withoutId(parent.childIds, childId) };
          const updatedChild = { ...child, parentIds: withoutId(child.parentIds, parentId) };
          syncPersonToBackend(updatedParent);
          syncPersonToBackend(updatedChild);
          return {
            people: {
              ...state.people,
              [parentId]: updatedParent,
              [childId]: updatedChild,
            },
          };
        });
      },

      linkSpouses: (aId, bId) => {
        set((state) => {
          const a = state.people[aId];
          const b = state.people[bId];
          if (!a || !b || aId === bId) return state;
          if (a.spouseIds.includes(bId)) return state;
          const updatedA = { ...a, spouseIds: [...a.spouseIds, bId] };
          const updatedB = { ...b, spouseIds: [...b.spouseIds, aId] };
          syncPersonToBackend(updatedA);
          syncPersonToBackend(updatedB);
          return {
            people: {
              ...state.people,
              [aId]: updatedA,
              [bId]: updatedB,
            },
          };
        });
      },

      unlinkSpouses: (aId, bId) => {
        set((state) => {
          const a = state.people[aId];
          const b = state.people[bId];
          if (!a || !b) return state;
          const updatedA = { ...a, spouseIds: withoutId(a.spouseIds, bId) };
          const updatedB = { ...b, spouseIds: withoutId(b.spouseIds, aId) };
          syncPersonToBackend(updatedA);
          syncPersonToBackend(updatedB);
          return {
            people: {
              ...state.people,
              [aId]: updatedA,
              [bId]: updatedB,
            },
          };
        });
      },

      addChildOf: (parentIds, data) => {
        const id = get().addPerson(data);
        parentIds.forEach((pid) => get().linkParentChild(pid, id));
        return id;
      },

      addParentOf: (childId, data) => {
        const id = get().addPerson(data);
        get().linkParentChild(id, childId);
        return id;
      },

      addSpouseOf: (personId, data) => {
        const id = get().addPerson(data);
        get().linkSpouses(personId, id);
        return id;
      },

      setSelected: (id) => set({ selectedId: id }),
      setRoot: (id) => set({ rootId: id }),
      importData: (data) => {
        set({ people: data.people, rootId: data.rootId, selectedId: data.rootId });
        Object.values(data.people).forEach(syncPersonToBackend);
      },
      resetToSeed: () => set({ people: seedData.people, rootId: seedData.rootId, selectedId: seedData.rootId }),
      clearAll: () => {
        const id = uuid();
        const person: Person = {
          id,
          firstName: 'Nuevo',
          lastName: 'Familiar',
          gender: 'unknown',
          parentIds: [],
          spouseIds: [],
          childIds: [],
        };
        set({ people: { [id]: person }, rootId: id, selectedId: id });
        syncPersonToBackend(person);
      },
    }),
    {
      name: 'genealogy-tree-storage',
    }
  )
);
