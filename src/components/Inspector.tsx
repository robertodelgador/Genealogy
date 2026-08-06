import { useState } from 'react';
import { Edit2, Star, Trash2, UserPlus, Heart, Baby, X } from 'lucide-react';
import { useTreeStore } from '../store/useTreeStore';
import { fullName, lifespan, initials } from '../utils/person';
import type { RelationContext } from './PersonModal';

interface Props {
  onEdit: (id: string) => void;
  onAddRelation: (ctx: RelationContext) => void;
}

export function Inspector({ onEdit, onAddRelation }: Props) {
  const people = useTreeStore((s) => s.people);
  const selectedId = useTreeStore((s) => s.selectedId);
  const rootId = useTreeStore((s) => s.rootId);
  const setRoot = useTreeStore((s) => s.setRoot);
  const setSelected = useTreeStore((s) => s.setSelected);
  const removePerson = useTreeStore((s) => s.removePerson);
  const unlinkParentChild = useTreeStore((s) => s.unlinkParentChild);
  const unlinkSpouses = useTreeStore((s) => s.unlinkSpouses);
  const linkParentChild = useTreeStore((s) => s.linkParentChild);
  const linkSpouses = useTreeStore((s) => s.linkSpouses);

  const [linking, setLinking] = useState<'parent' | 'spouse' | 'child' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const person = selectedId ? people[selectedId] : undefined;

  if (!person) {
    return (
      <div className="p-5 text-sm text-slate-500">
        Select someone in the tree to view details, or add a new person to begin.
      </div>
    );
  }

  const parents = person.parentIds.map((id) => people[id]).filter(Boolean);
  const spouses = person.spouseIds.map((id) => people[id]).filter(Boolean);
  const children = person.childIds.map((id) => people[id]).filter(Boolean);

  const linkableCandidates = Object.values(people).filter((p) => {
    if (p.id === person.id) return false;
    if (linking === 'parent') return !person.parentIds.includes(p.id) && !person.childIds.includes(p.id);
    if (linking === 'spouse') return !person.spouseIds.includes(p.id);
    if (linking === 'child') return !person.childIds.includes(p.id) && !person.parentIds.includes(p.id);
    return false;
  });

  function commitLink(otherId: string) {
    if (!person) return;
    if (linking === 'parent') linkParentChild(otherId, person.id);
    if (linking === 'child') linkParentChild(person.id, otherId);
    if (linking === 'spouse') linkSpouses(person.id, otherId);
    setLinking(null);
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-start gap-3">
          {person.photoUrl ? (
            <img src={person.photoUrl} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-700 text-lg font-semibold text-slate-200">
              {initials(person)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-base font-semibold text-slate-100">{fullName(person)}</h3>
              {rootId === person.id && <Star size={14} className="shrink-0 fill-amber-400 text-amber-400" />}
            </div>
            {person.maidenName && <p className="text-xs text-slate-400">née {person.maidenName}</p>}
            <p className="text-xs text-slate-400">{lifespan(person)}</p>
          </div>
        </div>
        {(person.birthPlace || person.deathPlace || person.notes) && (
          <div className="mt-3 space-y-1 text-xs text-slate-400">
            {person.birthPlace && <p>Born in {person.birthPlace}</p>}
            {person.deathPlace && <p>Died in {person.deathPlace}</p>}
            {person.notes && <p className="whitespace-pre-wrap text-slate-300">{person.notes}</p>}
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={() => onEdit(person.id)} className="btn-secondary">
            <Edit2 size={13} /> Edit
          </button>
          {rootId !== person.id && (
            <button onClick={() => setRoot(person.id)} className="btn-secondary">
              <Star size={13} /> Set as root
            </button>
          )}
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="btn-secondary text-red-400 hover:bg-red-500/10">
              <Trash2 size={13} /> Delete
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  removePerson(person.id);
                  setConfirmDelete(false);
                }}
                className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs text-white hover:bg-red-600"
              >
                Confirm delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:bg-white/10">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <RelationSection
        title="Parents"
        icon={<UserPlus size={13} />}
        people={parents}
        onSelect={setSelected}
        onRemove={(id) => unlinkParentChild(id, person.id)}
        onAddNew={() => onAddRelation({ type: 'parent', relatedId: person.id })}
        onLinkExisting={() => setLinking('parent')}
        linking={linking === 'parent'}
        candidates={linkableCandidates}
        onPickCandidate={commitLink}
        onCancelLink={() => setLinking(null)}
        disableAddNew={parents.length >= 2}
      />
      <RelationSection
        title="Spouses / Partners"
        icon={<Heart size={13} />}
        people={spouses}
        onSelect={setSelected}
        onRemove={(id) => unlinkSpouses(id, person.id)}
        onAddNew={() => onAddRelation({ type: 'spouse', relatedId: person.id })}
        onLinkExisting={() => setLinking('spouse')}
        linking={linking === 'spouse'}
        candidates={linkableCandidates}
        onPickCandidate={commitLink}
        onCancelLink={() => setLinking(null)}
      />
      <RelationSection
        title="Children"
        icon={<Baby size={13} />}
        people={children}
        onSelect={setSelected}
        onRemove={(id) => unlinkParentChild(person.id, id)}
        onAddNew={() => onAddRelation({ type: 'child', relatedId: person.id })}
        onLinkExisting={() => setLinking('child')}
        linking={linking === 'child'}
        candidates={linkableCandidates}
        onPickCandidate={commitLink}
        onCancelLink={() => setLinking(null)}
      />
    </div>
  );
}

function RelationSection({
  title,
  icon,
  people,
  onSelect,
  onRemove,
  onAddNew,
  onLinkExisting,
  linking,
  candidates,
  onPickCandidate,
  onCancelLink,
  disableAddNew,
}: {
  title: string;
  icon: React.ReactNode;
  people: { id: string; firstName: string; lastName: string; birthDate?: string; deathDate?: string }[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onAddNew: () => void;
  onLinkExisting: () => void;
  linking: boolean;
  candidates: { id: string; firstName: string; lastName: string }[];
  onPickCandidate: (id: string) => void;
  onCancelLink: () => void;
  disableAddNew?: boolean;
}) {
  return (
    <div className="border-b border-white/10 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {icon} {title}
        </h4>
        <div className="flex gap-1">
          {!disableAddNew && (
            <button onClick={onAddNew} title="Add new person" className="rounded-md p-1 text-slate-400 hover:bg-white/10 hover:text-slate-100">
              <UserPlus size={14} />
            </button>
          )}
        </div>
      </div>
      <ul className="space-y-1">
        {people.length === 0 && !linking && <li className="text-xs text-slate-500">None recorded</li>}
        {people.map((p) => (
          <li
            key={p.id}
            className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-200 hover:bg-white/5"
          >
            <button onClick={() => onSelect(p.id)} className="truncate text-left">
              {p.firstName} {p.lastName}
            </button>
            <button
              onClick={() => onRemove(p.id)}
              className="ml-2 shrink-0 rounded p-0.5 text-slate-500 opacity-0 hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
              title="Remove link"
            >
              <X size={13} />
            </button>
          </li>
        ))}
      </ul>
      {!linking ? (
        <button onClick={onLinkExisting} className="mt-1.5 text-xs text-indigo-400 hover:text-indigo-300">
          + Link existing person
        </button>
      ) : (
        <div className="mt-2 rounded-lg border border-white/10 bg-slate-800/60 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-slate-400">Choose a person</span>
            <button onClick={onCancelLink} className="text-slate-500 hover:text-slate-200">
              <X size={12} />
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto">
            {candidates.length === 0 && <p className="text-xs text-slate-500">No candidates available</p>}
            {candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => onPickCandidate(c.id)}
                className="block w-full truncate rounded px-2 py-1 text-left text-xs text-slate-200 hover:bg-white/10"
              >
                {c.firstName} {c.lastName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
