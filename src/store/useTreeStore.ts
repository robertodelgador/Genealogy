import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { FamilyTreeData, NewPerson, Person } from '../types';
import { seedData } from '../utils/seedData';

interface TreeState extends FamilyTreeData {
  selectedId: string | null;
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

export const useTreeStore = create<TreeState>()(
  persist(
    (set, get) => ({
      people: seedData.people,
      rootId: seedData.rootId,
      selectedId: seedData.rootId,

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
        return id;
      },

      updatePerson: (id, data) => {
        set((state) => {
          const existing = state.people[id];
          if (!existing) return state;
          return {
            people: { ...state.people, [id]: { ...existing, ...data } },
          };
        });
      },

      removePerson: (id) => {
        set((state) => {
          const people = { ...state.people };
          const target = people[id];
          if (!target) return state;
          // detach from all relations
          target.parentIds.forEach((pid) => {
            const p = people[pid];
            if (p) people[pid] = { ...p, childIds: withoutId(p.childIds, id) };
          });
          target.spouseIds.forEach((sid) => {
            const s = people[sid];
            if (s) people[sid] = { ...s, spouseIds: withoutId(s.spouseIds, id) };
          });
          target.childIds.forEach((cid) => {
            const c = people[cid];
            if (c) people[cid] = { ...c, parentIds: withoutId(c.parentIds, id) };
          });
          delete people[id];
          const rootId = state.rootId === id ? Object.keys(people)[0] ?? null : state.rootId;
          const selectedId = state.selectedId === id ? rootId : state.selectedId;
          return { people, rootId, selectedId };
        });
      },

      linkParentChild: (parentId, childId) => {
        set((state) => {
          const parent = state.people[parentId];
          const child = state.people[childId];
          if (!parent || !child || parentId === childId) return state;
          if (child.parentIds.includes(parentId)) return state;
          return {
            people: {
              ...state.people,
              [parentId]: { ...parent, childIds: [...parent.childIds, childId] },
              [childId]: { ...child, parentIds: [...child.parentIds, parentId] },
            },
          };
        });
      },

      unlinkParentChild: (parentId, childId) => {
        set((state) => {
          const parent = state.people[parentId];
          const child = state.people[childId];
          if (!parent || !child) return state;
          return {
            people: {
              ...state.people,
              [parentId]: { ...parent, childIds: withoutId(parent.childIds, childId) },
              [childId]: { ...child, parentIds: withoutId(child.parentIds, parentId) },
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
          return {
            people: {
              ...state.people,
              [aId]: { ...a, spouseIds: [...a.spouseIds, bId] },
              [bId]: { ...b, spouseIds: [...b.spouseIds, aId] },
            },
          };
        });
      },

      unlinkSpouses: (aId, bId) => {
        set((state) => {
          const a = state.people[aId];
          const b = state.people[bId];
          if (!a || !b) return state;
          return {
            people: {
              ...state.people,
              [aId]: { ...a, spouseIds: withoutId(a.spouseIds, bId) },
              [bId]: { ...b, spouseIds: withoutId(b.spouseIds, aId) },
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

      importData: (data) => set({ people: data.people, rootId: data.rootId, selectedId: data.rootId }),

      resetToSeed: () => set({ people: seedData.people, rootId: seedData.rootId, selectedId: seedData.rootId }),

      clearAll: () => {
        const id = uuid();
        const person: Person = {
          id,
          firstName: 'New',
          lastName: 'Person',
          gender: 'unknown',
          parentIds: [],
          spouseIds: [],
          childIds: [],
        };
        set({ people: { [id]: person }, rootId: id, selectedId: id });
      },
    }),
    {
      name: 'genealogy-tree-storage',
    }
  )
);
