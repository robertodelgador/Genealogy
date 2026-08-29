import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useEffect,
  type PointerEvent,
} from 'react';
import { useTreeStore } from '../store/useTreeStore';
import { useThemeStore } from '../store/useThemeStore';
import { computeLayout } from '../utils/layout';
import { computePositions, CARD_H } from '../utils/positions';
import { PersonCard } from './PersonCard';
import { Layers, Network, ZoomIn, ZoomOut, Compass } from 'lucide-react';

export interface TreeViewHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  focusPerson: (id: string) => void;
}

interface Props {
  onEditPerson: (id: string) => void;
}

const MIN_SCALE = 0.15;
const MAX_SCALE = 2.2;

export const TreeView = forwardRef<TreeViewHandle, Props>(({ onEditPerson }, ref) => {
  const people = useTreeStore((s) => s.people);
  const rootId = useTreeStore((s) => s.rootId);
  const selectedId = useTreeStore((s) => s.selectedId);
  const setSelected = useTreeStore((s) => s.setSelected);
  const theme = useThemeStore((s) => s.theme);

  // View mode: 'lineage' (Focused Ancestry & Direct Relations) or 'full' (Entire Tree)
  const [viewMode, setViewMode] = useState<'lineage' | 'full'>('full');

  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 80, scale: 0.85 });
  const panState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const draggedRef = useRef(false);

  const focusTargetId = selectedId || rootId || 'roberto-delgado-ruegg';

  // Compute layout with collision avoidance
  const layout = useMemo(
    () => computeLayout(people, focusTargetId, viewMode === 'lineage'),
    [people, focusTargetId, viewMode]
  );
  const positioned = useMemo(() => computePositions(layout, people), [layout, people]);

  const centerOn = useCallback((px: number, py: number, customScale?: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTransform((t) => {
      const s = customScale !== undefined ? customScale : t.scale;
      return {
        scale: s,
        x: rect.width / 2 - px * s,
        y: rect.height / 2 - py * s,
      };
    });
  }, []);

  useImperativeHandle(ref, () => ({
    zoomIn: () => setTransform((t) => ({ ...t, scale: Math.min(MAX_SCALE, t.scale * 1.2) })),
    zoomOut: () => setTransform((t) => ({ ...t, scale: Math.max(MIN_SCALE, t.scale / 1.2) })),
    resetView: () => {
      const target = focusTargetId && positioned.people[focusTargetId];
      if (target) {
        centerOn(target.x, target.y, 0.85);
      } else {
        setTransform({ x: 0, y: 80, scale: 0.85 });
      }
    },
    focusPerson: (id: string) => {
      const pos = positioned.people[id];
      if (pos) centerOn(pos.x, pos.y);
    },
  }));

  // Initial center on target person
  useEffect(() => {
    if (focusTargetId && positioned.people[focusTargetId]) {
      const target = positioned.people[focusTargetId];
      centerOn(target.x, target.y, 0.85);
    }
  }, [focusTargetId, viewMode]);

  // Robust Native Wheel Listener (Prevents scrolling jitter & page bounce)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelNative = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setTransform((t) => {
        const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * factor));
        const worldX = (cursorX - t.x) / t.scale;
        const worldY = (cursorY - t.y) / t.scale;
        return {
          scale: newScale,
          x: cursorX - worldX * newScale,
          y: cursorY - worldY * newScale,
        };
      });
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => el.removeEventListener('wheel', handleWheelNative);
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-person-id]') || (e.target as HTMLElement).closest('button')) return;
    panState.current = { startX: e.clientX, startY: e.clientY, origX: transform.x, origY: transform.y };
    draggedRef.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [transform.x, transform.y]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!panState.current) return;
    const dx = e.clientX - panState.current.startX;
    const dy = e.clientY - panState.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) draggedRef.current = true;
    setTransform((t) => ({ ...t, x: panState.current!.origX + dx, y: panState.current!.origY + dy }));
  }, []);

  const handlePointerUp = useCallback(() => {
    panState.current = null;
  }, []);

  const handleBackgroundClick = useCallback(() => {
    if (draggedRef.current) return;
  }, []);

  const { bounds } = positioned;
  const svgW = Math.max(bounds.maxX - bounds.minX + 800, 2000);
  const svgH = Math.max(bounds.maxY - bounds.minY + 800, 2000);
  const svgOffsetX = -bounds.minX + 400;
  const svgOffsetY = -bounds.minY + 200;

  const lineColor = theme === 'dark' ? '#475569' : '#94a3b8';
  const spouseLineColor = theme === 'dark' ? '#f472b6' : '#ec4899';
  const dotColor = theme === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(100,116,139,0.12)';

  if (!rootId || Object.keys(people).length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400 text-sm">
        Cargando árbol genealógico...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-950 select-none touch-none transition-colors"
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
        backgroundSize: '28px 28px',
        backgroundPosition: `${transform.x % 28}px ${transform.y % 28}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleBackgroundClick}
    >
      {/* Floating View Controls */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg backdrop-blur-md">
        <button
          onClick={() => setViewMode('full')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'full'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
          title="Ver todos los 106 familiares"
        >
          <Network size={14} /> Árbol Completo
        </button>
        <button
          onClick={() => setViewMode('lineage')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'lineage'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
          title="Ver linaje directo y ancestros del familiar seleccionado"
        >
          <Layers size={14} /> Linaje Directo
        </button>
      </div>

      {/* Floating Bottom Quick Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-md">
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(MAX_SCALE, t.scale * 1.2) }))}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          title="Acercar"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(MIN_SCALE, t.scale / 1.2) }))}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          title="Alejar"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={() => {
            const target = focusTargetId && positioned.people[focusTargetId];
            if (target) centerOn(target.x, target.y, 0.85);
          }}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          title="Centrar en el familiar activo"
        >
          <Compass size={16} />
        </button>
      </div>

      {/* World Canvas */}
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
          willChange: 'transform',
        }}
      >
        {/* Connectors SVG Layer */}
        <svg
          width={svgW}
          height={svgH}
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        >
          <g transform={`translate(${svgOffsetX}, ${svgOffsetY})`}>
            {/* Spousal Connector Lines */}
            {positioned.spouseLinks.map((link) => (
              <line
                key={`spouse-${link.aId}-${link.bId}`}
                x1={link.x1}
                y1={link.y}
                x2={link.x2}
                y2={link.y}
                stroke={spouseLineColor}
                strokeWidth={2.5}
                strokeDasharray="5 4"
              />
            ))}

            {/* Parent-Child Tree Connectors (Strictly isolated per family) */}
            {positioned.familyLinks.map((fl) => {
              const busLeft = Math.min(fl.parentX, fl.minChildX);
              const busRight = Math.max(fl.parentX, fl.maxChildX);
              return (
                <g key={fl.unitId}>
                  {/* Stem from parents down to horizontal bus bar */}
                  <line
                    x1={fl.parentX}
                    y1={fl.parentY}
                    x2={fl.parentX}
                    y2={fl.busY}
                    stroke={lineColor}
                    strokeWidth={2}
                  />
                  {/* Horizontal bus bar connecting strictly this family's children */}
                  <line
                    x1={busLeft}
                    y1={fl.busY}
                    x2={busRight}
                    y2={fl.busY}
                    stroke={lineColor}
                    strokeWidth={2}
                  />
                  {/* Drop lines from horizontal bus bar into each child card */}
                  {fl.children.map((c) => (
                    <line
                      key={`child-${c.id}`}
                      x1={c.x}
                      y1={fl.busY}
                      x2={c.x}
                      y2={c.y - CARD_H / 2}
                      stroke={lineColor}
                      strokeWidth={2}
                    />
                  ))}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Nodes Layer */}
        <div style={{ position: 'relative', left: svgOffsetX, top: svgOffsetY }}>
          {Object.values(positioned.people).map((pos) => {
            const person = people[pos.id];
            if (!person) return null;
            return (
              <PersonCard
                key={pos.id}
                person={person}
                x={pos.x}
                y={pos.y}
                selected={selectedId === pos.id}
                isRoot={rootId === pos.id}
                onClick={(id) => setSelected(id)}
                onDoubleClick={(id) => onEditPerson(id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
});

TreeView.displayName = 'TreeView';
