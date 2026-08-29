import { useState } from 'react';
import { Search } from 'lucide-react';
import { useTreeStore } from '../store/useTreeStore';
import { fullName, lifespan, initials } from '../utils/person';

interface Props {
  onFocusPerson: (id: string) => void;
}

export function PeopleSearch({ onFocusPerson }: Props) {
  const people = useTreeStore((s) => s.people);
  const selectedId = useTreeStore((s) => s.selectedId);
  const setSelected = useTreeStore((s) => s.setSelected);
  const [query, setQuery] = useState('');

  const list = Object.values(people).sort((a, b) =>
    fullName(a).localeCompare(fullName(b), 'es')
  );

  const filtered = query.trim()
    ? list.filter((p) =>
        fullName(p).toLowerCase().includes(query.toLowerCase()) ||
        (p.notes && p.notes.toLowerCase().includes(query.toLowerCase())) ||
        (p.birthPlace && p.birthPlace.toLowerCase().includes(query.toLowerCase()))
      )
    : list;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 transition-colors">
      <div className="p-3.5 border-b border-slate-200 dark:border-white/10">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="input w-full pl-9 py-2 text-xs"
            placeholder="Buscar por nombre, lugar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
          <span>{filtered.length} familiares</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filtered.map((person) => {
          const isSelected = selectedId === person.id;
          return (
            <button
              key={person.id}
              onClick={() => {
                setSelected(person.id);
                onFocusPerson(person.id);
              }}
              className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                {initials(person)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium leading-tight">{fullName(person)}</div>
                <div className="truncate text-[10px] text-slate-400">{lifespan(person)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
