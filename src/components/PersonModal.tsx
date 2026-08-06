import { useState, type FormEvent } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useTreeStore } from '../store/useTreeStore';
import type { Gender, NewPerson } from '../types';

export type RelationContext = { type: 'parent' | 'spouse' | 'child'; relatedId: string };

interface Props {
  personId?: string;
  relation?: RelationContext;
  onClose: () => void;
}

const emptyForm: NewPerson = {
  firstName: '',
  lastName: '',
  maidenName: '',
  gender: 'unknown',
  birthDate: '',
  birthPlace: '',
  deathDate: '',
  deathPlace: '',
  photoUrl: '',
  notes: '',
};

export function PersonModal({ personId, relation, onClose }: Props) {
  const people = useTreeStore((s) => s.people);
  const addPerson = useTreeStore((s) => s.addPerson);
  const updatePerson = useTreeStore((s) => s.updatePerson);
  const removePerson = useTreeStore((s) => s.removePerson);
  const linkParentChild = useTreeStore((s) => s.linkParentChild);
  const linkSpouses = useTreeStore((s) => s.linkSpouses);
  const setSelected = useTreeStore((s) => s.setSelected);

  const existing = personId ? people[personId] : undefined;
  const [form, setForm] = useState<NewPerson>(
    existing
      ? {
          firstName: existing.firstName,
          lastName: existing.lastName,
          maidenName: existing.maidenName ?? '',
          gender: existing.gender,
          birthDate: existing.birthDate ?? '',
          birthPlace: existing.birthPlace ?? '',
          deathDate: existing.deathDate ?? '',
          deathPlace: existing.deathPlace ?? '',
          photoUrl: existing.photoUrl ?? '',
          notes: existing.notes ?? '',
        }
      : emptyForm
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  const relatedPerson = relation ? people[relation.relatedId] : undefined;

  function set<K extends keyof NewPerson>(key: K, value: NewPerson[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;

    if (existing) {
      updatePerson(existing.id, form);
      onClose();
      return;
    }

    const newId = addPerson(form);
    if (relation) {
      if (relation.type === 'parent') {
        linkParentChild(newId, relation.relatedId);
      } else if (relation.type === 'child') {
        linkParentChild(relation.relatedId, newId);
      } else if (relation.type === 'spouse') {
        linkSpouses(relation.relatedId, newId);
      }
    }
    setSelected(newId);
    onClose();
  }

  function handleDelete() {
    if (!existing) return;
    removePerson(existing.id);
    onClose();
  }

  const title = existing
    ? `Edit ${existing.firstName || 'Person'}`
    : relation
    ? `Add ${relation.type}${relatedPerson ? ` of ${relatedPerson.firstName}` : ''}`
    : 'Add Person';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sticky top-0 bg-slate-900 rounded-t-2xl">
          <h2 className="text-base font-semibold text-slate-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 px-5 py-4">
          <Field label="First name" required>
            <input
              autoFocus
              className="input"
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              required
            />
          </Field>
          <Field label="Last name" required>
            <input
              className="input"
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              required
            />
          </Field>
          <Field label="Maiden name">
            <input
              className="input"
              value={form.maidenName}
              onChange={(e) => set('maidenName', e.target.value)}
            />
          </Field>
          <Field label="Gender">
            <select
              className="input"
              value={form.gender}
              onChange={(e) => set('gender', e.target.value as Gender)}
            >
              <option value="unknown">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
          <Field label="Birth date">
            <input
              type="date"
              className="input"
              value={form.birthDate}
              onChange={(e) => set('birthDate', e.target.value)}
            />
          </Field>
          <Field label="Birth place">
            <input
              className="input"
              value={form.birthPlace}
              onChange={(e) => set('birthPlace', e.target.value)}
            />
          </Field>
          <Field label="Death date">
            <input
              type="date"
              className="input"
              value={form.deathDate}
              onChange={(e) => set('deathDate', e.target.value)}
            />
          </Field>
          <Field label="Death place">
            <input
              className="input"
              value={form.deathPlace}
              onChange={(e) => set('deathPlace', e.target.value)}
            />
          </Field>
          <Field label="Photo URL" full>
            <input
              className="input"
              value={form.photoUrl}
              onChange={(e) => set('photoUrl', e.target.value)}
              placeholder="https://..."
            />
          </Field>
          <Field label="Notes" full>
            <textarea
              className="input min-h-[70px] resize-y"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-5 py-4">
          <div>
            {existing && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
            {existing && confirmDelete && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-300">Delete this person?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-red-500 px-2.5 py-1.5 text-white hover:bg-red-600"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-lg px-2.5 py-1.5 text-slate-400 hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              {existing ? 'Save changes' : 'Add person'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  full,
  required,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  required?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 text-xs text-slate-400 ${full ? 'col-span-2' : ''}`}>
      <span>
        {label}
        {required && <span className="text-rose-400"> *</span>}
      </span>
      {children}
    </label>
  );
}
