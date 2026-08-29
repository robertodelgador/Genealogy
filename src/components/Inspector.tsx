import { useState, useEffect } from 'react';
import { Edit2, Star, Trash2, UserPlus, Heart, Baby, X, History, User, Clock, FileText, ArrowRight } from 'lucide-react';
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
  const historyLogs = useTreeStore((s) => s.historyLogs);
  const fetchHistory = useTreeStore((s) => s.fetchHistory);

  const [tab, setTab] = useState<'details' | 'history'>('details');
  const [linking, setLinking] = useState<'parent' | 'spouse' | 'child' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const person = selectedId ? people[selectedId] : undefined;

  useEffect(() => {
    if (tab === 'history') {
      fetchHistory(selectedId || undefined);
    }
  }, [tab, selectedId]);

  if (!person) {
    return (
      <div className="p-6 text-sm text-slate-500 dark:text-slate-400 text-center">
        Selecciona a un familiar en el árbol para ver sus detalles o su historial de cambios.
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
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50/50 dark:bg-slate-900 transition-colors">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-slate-950/50 p-1.5">
        <button
          onClick={() => setTab('details')}
          className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer ${
            tab === 'details'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-white/10'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <FileText size={13} className="inline mr-1.5 -mt-0.5" /> Detalles
        </button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all cursor-pointer ${
            tab === 'history'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-white/10'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <History size={13} className="inline mr-1.5 -mt-0.5" /> Historial de Cambios
        </button>
      </div>

      {tab === 'details' ? (
        <>
          <div className="border-b border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-slate-900">
            <div className="flex items-start gap-3.5">
              {person.photoUrl ? (
                <img src={person.photoUrl} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-500/30" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xl font-bold shadow-inner">
                  {initials(person)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-base font-bold text-slate-900 dark:text-slate-100">{fullName(person)}</h3>
                  {rootId === person.id && <Star size={15} className="shrink-0 fill-amber-400 text-amber-400" />}
                </div>
                {person.maidenName && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">née {person.maidenName}</p>}
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{lifespan(person)}</p>
              </div>
            </div>

            {(person.birthPlace || person.deathPlace || person.notes) && (
              <div className="mt-3.5 space-y-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 p-3 text-xs text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                {person.birthPlace && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Nacimiento:</span> {person.birthPlace}</p>}
                {person.deathPlace && <p><span className="font-semibold text-slate-700 dark:text-slate-300">Fallecimiento:</span> {person.deathPlace}</p>}
                {person.notes && <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 mt-1 font-normal leading-relaxed">{person.notes}</p>}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => onEdit(person.id)} className="btn-secondary">
                <Edit2 size={13} /> Editar
              </button>
              {rootId !== person.id && (
                <button onClick={() => setRoot(person.id)} className="btn-secondary">
                  <Star size={13} /> Raíz del Árbol
                </button>
              )}
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)} className="btn-secondary text-rose-500 hover:bg-rose-500/10">
                  <Trash2 size={13} /> Eliminar
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      removePerson(person.id);
                      setConfirmDelete(false);
                    }}
                    className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-600"
                  >
                    Confirmar
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          <RelationSection
            title="Padres"
            icon={<UserPlus size={14} />}
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
            title="Cónyuges / Parejas"
            icon={<Heart size={14} />}
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
            title="Hijos"
            icon={<Baby size={14} />}
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
        </>
      ) : (
        /* Detailed History & Change Tracking View (Original -> New Value) */
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Auditoría & Trazabilidad
            </h4>
            <button
              onClick={() => fetchHistory(selectedId || undefined)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Actualizar
            </button>
          </div>

          {historyLogs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-800/40 p-5 text-center text-xs text-slate-500">
              No hay modificaciones registradas para esta persona en la base de datos PostgreSQL.
            </div>
          ) : (
            <div className="space-y-3">
              {historyLogs.map((log) => {
                let parsedDiffs: Array<{ field: string; old: any; new: any }> = [];
                try {
                  if (typeof log.old_data === 'string') {
                    parsedDiffs = JSON.parse(log.old_data);
                  } else if (Array.isArray(log.old_data)) {
                    parsedDiffs = log.old_data;
                  }
                } catch {
                  parsedDiffs = [];
                }

                return (
                  <div
                    key={log.id}
                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800/80 p-4 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
                      <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-200">
                        <User size={13} className="text-emerald-500" />
                        {log.user_name || log.user_email || 'Familiar'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={11} />
                        {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Action badge */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider ${
                        log.action === 'CREATE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}>
                        {log.action}
                      </span>
                    </div>

                    {/* Detailed Diffs: Original Value -> New Value */}
                    {Array.isArray(parsedDiffs) && parsedDiffs.length > 0 ? (
                      <div className="mt-2.5 space-y-2">
                        {parsedDiffs.map((d, i) => (
                          <div key={i} className="rounded-xl bg-slate-50 dark:bg-slate-900/90 p-2.5 border border-slate-200/60 dark:border-white/5 text-[11px]">
                            <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              {d.field}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 px-2 py-0.5 line-through font-mono text-[10px]">
                                {d.old !== null && d.old !== undefined ? String(d.old) : '(vacío)'}
                              </span>
                              <ArrowRight size={12} className="text-slate-400 shrink-0" />
                              <span className="rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 font-mono text-[10px]">
                                {d.new !== null && d.new !== undefined ? String(d.new) : '(eliminado)'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {log.changes_summary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
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
    <div className="border-b border-slate-200 dark:border-white/10 p-5 bg-white dark:bg-slate-900">
      <div className="mb-2.5 flex items-center justify-between">
        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {icon} {title}
        </h4>
        <div className="flex gap-1">
          {!disableAddNew && (
            <button onClick={onAddNew} title="Agregar nueva persona" className="rounded-xl p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-emerald-500 transition-colors cursor-pointer">
              <UserPlus size={15} />
            </button>
          )}
        </div>
      </div>
      <ul className="space-y-1.5">
        {people.length === 0 && !linking && <li className="text-xs text-slate-400 italic">Ninguno registrado</li>}
        {people.map((p) => (
          <li
            key={p.id}
            className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <button onClick={() => onSelect(p.id)} className="truncate text-left cursor-pointer">
              {p.firstName} {p.lastName}
            </button>
            <button
              onClick={() => onRemove(p.id)}
              className="ml-2 shrink-0 rounded-lg p-1 text-slate-400 opacity-0 hover:bg-rose-500/10 hover:text-rose-500 group-hover:opacity-100 transition-all cursor-pointer"
              title="Eliminar vínculo"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>
      {!linking ? (
        <button onClick={onLinkExisting} className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
          + Vincular persona existente
        </button>
      ) : (
        <div className="mt-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 p-3 shadow-inner">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Elegir persona</span>
            <button onClick={onCancelLink} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={14} />
            </button>
          </div>
          <div className="max-h-36 overflow-y-auto space-y-1">
            {candidates.length === 0 && <p className="text-xs text-slate-400">No hay candidatos disponibles</p>}
            {candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => onPickCandidate(c.id)}
                className="block w-full truncate rounded-xl px-3 py-1.5 text-left text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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
