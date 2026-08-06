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

const genderRing: Record<string, string> = {
  male: 'ring-sky-400/70 bg-sky-500/10',
  female: 'ring-rose-400/70 bg-rose-500/10',
  unknown: 'ring-slate-400/60 bg-slate-500/10',
};

const genderAvatar: Record<string, string> = {
  male: 'bg-sky-500',
  female: 'bg-rose-500',
  unknown: 'bg-slate-500',
};

function PersonCardImpl({ person, x, y, selected, isRoot, onClick, onDoubleClick }: Props) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-xl border px-3 py-2.5 shadow-sm backdrop-blur-sm cursor-pointer select-none transition-all
        ${selected ? 'border-indigo-400 ring-2 ring-indigo-400 bg-indigo-500/10 shadow-lg scale-[1.03]' : `border-white/10 ring-1 ${genderRing[person.gender]} hover:scale-[1.02] hover:shadow-md`}
        bg-slate-800/80`}
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
        <span className="absolute -top-2 -right-2 text-[9px] font-semibold uppercase tracking-wide bg-amber-400 text-amber-950 rounded-full px-1.5 py-0.5 shadow">
          Root
        </span>
      )}
      {person.photoUrl ? (
        <img
          src={person.photoUrl}
          alt={fullName(person)}
          className="h-10 w-10 rounded-full object-cover shrink-0 ring-1 ring-white/20"
        />
      ) : (
        <div
          className={`h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-semibold ${genderAvatar[person.gender]}`}
        >
          {initials(person)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-100 truncate">{fullName(person)}</div>
        {person.maidenName && (
          <div className="text-[11px] text-slate-400 truncate">née {person.maidenName}</div>
        )}
        <div className="text-[11px] text-slate-400 truncate">{lifespan(person) || ' '}</div>
      </div>
    </div>
  );
}

export const PersonCard = memo(PersonCardImpl);
