import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type WheelEvent,
  type PointerEvent,
} from 'react';
import { useTreeStore } from '../store/useTreeStore';
import { useThemeStore } from '../store/useThemeStore';
import { computeLayout } from '../utils/layout';
import { computePositions, CARD_H } from '../utils/positions';
import { PersonCard } from './PersonCard';

export interface TreeViewHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  focusPerson: (id: string) => void;
}

interface Props {
  onEditPerson: (id: string) => void;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 2;

export const TreeView = forwardRef<TreeViewHandle, Props>(({ onEditPerson }, ref) => {
  const people = useTreeStore((s) => s.people);
  const rootId = useTreeStore((s) => s.rootId);
  const selectedId = useTreeStore((s) => s.selectedId);
  const setSelected = useTreeStore((s) => s.setSelected);
  const theme = useThemeStore((s) => s.theme);

  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 80, y: 60, scale: 1 });
  const panState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const draggedRef = useRef(false);

  const layout = useMemo(() => computeLayout(people, rootId), [people, rootId]);
  const positioned = useMemo(() => computePositions(layout, people), [layout, people]);

  const centerOn = useCallback((px: number, py: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTransform((t) => ({
      ...t,
      x: rect.width / 2 - px * t.scale,
      y: rect.height / 2 - py * t.scale,
    }));
  }, []);

  useImperativeHandle(ref, () => ({
    zoomIn: () => setTransform((t) => ({ ...t, scale: Math.min(MAX_SCALE, t.scale * 1.2) })),
    zoomOut: () => setTransform((t) => ({ ...t, scale: Math.max(MIN_SCALE, t.scale / 1.2) })),
    resetView: () => setTransform({ x: 80, y: 60, scale: 1 }),
    focusPerson: (id: string) => {
      const pos = positioned.people[id];
      if (pos) centerOn(pos.x, pos.y);
    },
  }));

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    setTransform((t) => {
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale * factor));
      const worldX = (cursorX - t.x) / t.scale;
      const worldY = (cursorY - t.y) / t.scale;
      return {
        scale: newScale,
        x: cursorX - worldX * newScale,
        y: cursorY - worldY * newScale,
      };
    });
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-person-id]')) return;
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
    setSelected(null);
  }, [setSelected]);

  const { bounds } = positioned;
  const svgW = Math.max(bounds.maxX - bounds.minX + 400, 800);
  const svgH = Math.max(bounds.maxY - bounds.minY + 400, 600);
  const svgOffsetX = -bounds.minX + 200;
  const svgOffsetY = -bounds.minY + 100;

  const lineColor = theme === 'dark' ? '#64748b' : '#94a3b8';
  const spouseLineColor = theme === 'dark' ? '#f472b6' : '#ec4899';
  const dotColor = theme === 'dark' ? 'rgba(148,163,184,0.15)' : 'rgba(100,116,139,0.12)';

  if (!rootId || Object.keys(people).length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400 text-sm">
        Cargando árbol familiar desde PostgreSQL...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-950 touch-none transition-colors"
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
        backgroundSize: '24px 24px',
        backgroundPosition: `${transform.x % 24}px ${transform.y % 24}px`,
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleBackgroundClick}
    >
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
        }}
      >
        <svg
          width={svgW}
          height={svgH}
          style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        >
          <g transform={`translate(${svgOffsetX}, ${svgOffsetY})`}>
            {positioned.spouseLinks.map((link) => (
              <line
                key={`${link.aId}-${link.bId}`}
                x1={link.x1}
                y1={link.y}
                x2={link.x2}
                y2={link.y}
                stroke={spouseLineColor}
                strokeWidth={2}
                strokeDasharray="4 3"
              />
            ))}
            {positioned.familyLinks.map((fl) => (
              <g key={fl.unitId}>
                <line
                  x1={fl.parentX}
                  y1={fl.parentY + CARD_H / 2}
                  x2={fl.parentX}
                  y2={fl.busY}
                  stroke={lineColor}
                  strokeWidth={2}
                />
                {fl.children.length > 1 && (
                  <line
                    x1={Math.min(...fl.children.map((c) => c.x))}
                    y1={fl.busY}
                    x2={Math.max(...fl.children.map((c) => c.x))}
                    y2={fl.busY}
                    stroke={lineColor}
                    strokeWidth={2}
                  />
                )}
                {fl.children.map((c) => (
                  <line
                    key={c.id}
                    x1={c.x}
                    y1={fl.busY}
                    x2={c.x}
                    y2={c.y - CARD_H / 2}
                    stroke={lineColor}
                    strokeWidth={2}
                  />
                ))}
              </g>
            ))}
          </g>
        </svg>

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
