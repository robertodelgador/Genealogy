import { useMemo, useState } from 'react';
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

  const results = useMemo(() => {
    const list = Object.values(people);
    const q = query.trim().toLowerCase();
    const filtered = q
      ? list.filter((p) => fullName(p).toLowerCase().includes(q) || (p.maidenName ?? '').toLowerCase().includes(q))
      : list;
    return filtered.sort((a, b) => fullName(a).localeCompare(fullName(b)));
  }, [people, query]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 p-3">
        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people…"
            className="w-full rounded-lg border border-white/10 bg-slate-800/70 py-2 pl-8 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">{Object.keys(people).length} people in tree</p>
      </div>
      <ul className="flex-1 overflow-y-auto p-2">
        {results.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => {
                setSelected(p.id);
                onFocusPerson(p.id);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                selectedId === p.id ? 'bg-indigo-500/15 text-indigo-200' : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-semibold text-slate-200">
                {initials(p)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">{fullName(p)}</span>
                <span className="block truncate text-xs text-slate-500">{lifespan(p)}</span>
              </span>
            </button>
          </li>
        ))}
        {results.length === 0 && <li className="p-3 text-center text-xs text-slate-500">No matches</li>}
      </ul>
    </div>
  );
}
