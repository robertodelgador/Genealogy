import { useState, type FormEvent } from 'react';
import { X, Trash2, Calendar, User, MapPin, FileText, Camera } from 'lucide-react';
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

  const relationLabels: Record<string, string> = {
    parent: 'Padre / Madre',
    spouse: 'Cónyuge / Pareja',
    child: 'Hijo / Hija',
  };

  const title = existing
    ? `Editar datos de ${existing.firstName} ${existing.lastName}`
    : relation
    ? `Agregar ${relationLabels[relation.type]}${relatedPerson ? ` de ${relatedPerson.firstName} ${relatedPerson.lastName}` : ''}`
    : 'Agregar Nuevo Familiar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl transition-all"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <User size={18} className="text-emerald-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-5">
          <Field label="Nombre" required>
            <input
              autoFocus
              className="input"
              value={form.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              placeholder="Ej. Roberto"
              required
            />
          </Field>

          <Field label="Apellidos" required>
            <input
              className="input"
              value={form.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              placeholder="Ej. Delgado Rüegg"
              required
            />
          </Field>

          <Field label="Apellido de soltera">
            <input
              className="input"
              value={form.maidenName}
              onChange={(e) => set('maidenName', e.target.value)}
              placeholder="Ej. Rüegg"
            />
          </Field>

          <Field label="Género">
            <select
              className="input"
              value={form.gender}
              onChange={(e) => set('gender', e.target.value as Gender)}
            >
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="unknown">No especificado</option>
            </select>
          </Field>

          {/* DatePicker for Birth Date */}
          <Field label="Fecha de Nacimiento" icon={<Calendar size={13} className="inline text-emerald-500" />}>
            <input
              type="date"
              className="input"
              value={form.birthDate}
              onChange={(e) => set('birthDate', e.target.value)}
            />
          </Field>

          <Field label="Lugar de Nacimiento" icon={<MapPin size={13} className="inline text-emerald-500" />}>
            <input
              className="input"
              value={form.birthPlace}
              onChange={(e) => set('birthPlace', e.target.value)}
              placeholder="Ej. Ciudad de Guatemala"
            />
          </Field>

          {/* DatePicker for Death Date */}
          <Field label="Fecha de Defunción" icon={<Calendar size={13} className="inline text-rose-500" />}>
            <input
              type="date"
              className="input"
              value={form.deathDate}
              onChange={(e) => set('deathDate', e.target.value)}
            />
          </Field>

          <Field label="Lugar de Defunción" icon={<MapPin size={13} className="inline text-rose-500" />}>
            <input
              className="input"
              value={form.deathPlace}
              onChange={(e) => set('deathPlace', e.target.value)}
              placeholder="Ej. Ciudad de Guatemala"
            />
          </Field>

          <Field label="Enlace de Foto (URL)" icon={<Camera size={13} className="inline text-blue-500" />} full>
            <input
              className="input"
              value={form.photoUrl}
              onChange={(e) => set('photoUrl', e.target.value)}
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </Field>

          <Field label="Notas Biográficas / Históricas" icon={<FileText size={13} className="inline text-amber-500" />} full>
            <textarea
              className="input min-h-[85px] resize-y leading-relaxed"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Escribe notas, cargos, referencias documentales o sucesos destacados..."
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 dark:border-white/10 px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <div>
            {existing && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 size={15} /> Eliminar
              </button>
            )}
            {existing && confirmDelete && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">¿Eliminar a este familiar?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-xl px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {existing ? 'Guardar Cambios' : 'Agregar Familiar'}
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
  icon,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
        {required && <span className="text-rose-500 font-bold">*</span>}
      </span>
      {children}
    </label>
  );
}
