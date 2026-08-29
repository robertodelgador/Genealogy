import { memo } from 'react';
import type { Person } from '../types';
import { fullName, lifespan, initials } from '../utils/person';
import { CARD_W, CARD_H } from '../utils/positions';

interface Props {
  person: Person;
  x: number;
  y: number;
  selected: boolean;
  isRoot: boolean;
  onClick: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

const genderBorder: Record<string, string> = {
  male: 'border-sky-500/30 hover:border-sky-500 dark:border-sky-500/40',
  female: 'border-rose-500/30 hover:border-rose-500 dark:border-rose-500/40',
  unknown: 'border-slate-300 dark:border-white/10 hover:border-slate-400',
};

const genderAvatar: Record<string, string> = {
  male: 'bg-sky-500 text-white',
  female: 'bg-rose-500 text-white',
  unknown: 'bg-slate-500 text-white',
};

function PersonCardImpl({ person, x, y, selected, isRoot, onClick, onDoubleClick }: Props) {
  return (
    <div
      className={`absolute flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 shadow-sm backdrop-blur-md cursor-pointer select-none transition-all duration-150
        ${selected
          ? 'border-emerald-500 ring-2 ring-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 shadow-xl scale-[1.03] z-20'
          : `bg-white/90 dark:bg-slate-800/90 ${genderBorder[person.gender]} hover:scale-[1.02] hover:shadow-lg`}
      `}
      style={{
        width: CARD_W,
        height: CARD_H,
        left: x - CARD_W / 2,
        top: y - CARD_H / 2,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(person.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(person.id);
      }}
      data-person-id={person.id}
    >
      {isRoot && (
        <span className="absolute -top-2.5 -right-2 text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 rounded-full px-2 py-0.5 shadow-md ring-1 ring-amber-500/50">
          Raíz
        </span>
      )}
      {person.photoUrl ? (
        <img
          src={person.photoUrl}
          alt={fullName(person)}
          className="h-11 w-11 rounded-xl object-cover shrink-0 ring-1 ring-black/10 dark:ring-white/20 shadow-sm"
        />
      ) : (
        <div
          className={`h-11 w-11 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-inner ${genderAvatar[person.gender]}`}
        >
          {initials(person)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{fullName(person)}</div>
        {person.maidenName && (
          <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">née {person.maidenName}</div>
        )}
        <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 truncate mt-0.5">{lifespan(person) || '—'}</div>
      </div>
    </div>
  );
}

export const PersonCard = memo(PersonCardImpl);
