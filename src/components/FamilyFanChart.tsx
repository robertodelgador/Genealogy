import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { useTreeStore } from '../store/useTreeStore';
import { useThemeStore } from '../store/useThemeStore';
import { fullName, initials, lifespan } from '../utils/person';
import {
  ZoomIn,
  ZoomOut,
  Compass,
  Layers,
} from 'lucide-react';
import type { Person } from '../types';

interface Props {
  onSelectPerson: (id: string) => void;
  onEditPerson: (id: string) => void;
}

interface FanNode {
  person: Person | null;
  id: string | null;
  gen: number; // 0 = root, 1 = parents, 2 = grandparents...
  indexInGen: number; // 0 to 2^gen - 1
  startAngle: number; // in radians
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  isPaternal: boolean;
  expectedGender: 'male' | 'female';
}

export function FamilyFanChart({ onSelectPerson, onEditPerson }: Props) {
  const people = useTreeStore((s) => s.people);
  const selectedId = useTreeStore((s) => s.selectedId);
  const rootId = useTreeStore((s) => s.rootId);
  const setSelected = useTreeStore((s) => s.setSelected);
  const theme = useThemeStore((s) => s.theme);

  const [maxGenerations, setMaxGenerations] = useState<number>(6);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const panState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const draggedRef = useRef(false);

  const activePersonId = selectedId || rootId || 'I500002';
  const rootPerson = people[activePersonId] || Object.values(people)[0];

  // Base Fan geometry: 180-degree semicircular fan facing upwards (-180deg to 0deg)
  const CENTER_RADIUS = 95;
  const RING_WIDTH = 85;

  // Build binary tree of ancestors up to maxGenerations
  const fanNodes = useMemo(() => {
    if (!rootPerson) return [];

    const nodes: FanNode[] = [];
    const totalAngle = Math.PI; // 180 degrees
    const startBaseAngle = -Math.PI; // from 9 o'clock (-180°) to 3 o'clock (0°)

    // Recursive helper to traverse binary pedigree tree
    const buildPedigree = (
      currentPerson: Person | null,
      gen: number,
      indexInGen: number,
      isPaternal: boolean,
      expectedGender: 'male' | 'female'
    ) => {
      if (gen >= maxGenerations) return;

      const numSectors = Math.pow(2, gen);
      const sectorAngle = totalAngle / (gen === 0 ? 1 : numSectors);
      const sectorStart = gen === 0 ? startBaseAngle : startBaseAngle + indexInGen * sectorAngle;
      const sectorEnd = sectorStart + sectorAngle;

      const innerRadius = gen === 0 ? 0 : CENTER_RADIUS + (gen - 1) * RING_WIDTH;
      const outerRadius = gen === 0 ? CENTER_RADIUS : innerRadius + RING_WIDTH;

      nodes.push({
        person: currentPerson,
        id: currentPerson?.id ?? null,
        gen,
        indexInGen,
        startAngle: sectorStart,
        endAngle: sectorEnd,
        innerRadius,
        outerRadius,
        isPaternal,
        expectedGender,
      });

      if (gen < maxGenerations - 1) {
        // Resolve father and mother
        let father: Person | null = null;
        let mother: Person | null = null;

        if (currentPerson && currentPerson.parentIds.length > 0) {
          for (const pid of currentPerson.parentIds) {
            const p = people[pid];
            if (p) {
              if (p.gender === 'male' && !father) father = p;
              else if (p.gender === 'female' && !mother) mother = p;
              else if (!father) father = p;
              else if (!mother) mother = p;
            }
          }
        }

        // Left half = Father's side (index * 2), Right half = Mother's side (index * 2 + 1)
        buildPedigree(
          father,
          gen + 1,
          indexInGen * 2,
          gen === 0 ? true : isPaternal,
          'male'
        );
        buildPedigree(
          mother,
          gen + 1,
          indexInGen * 2 + 1,
          gen === 0 ? false : isPaternal,
          'female'
        );
      }
    };

    buildPedigree(rootPerson, 0, 0, true, 'male');
    return nodes;
  }, [rootPerson, people, maxGenerations]);

  // Center the fan on mount or when rootPerson changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const initialScale = Math.min(rect.width / 1100, rect.height / 650, 1.1);
    setTransform({
      x: rect.width / 2,
      y: rect.height - 70,
      scale: Math.max(0.65, initialScale),
    });
  }, [rootPerson?.id, maxGenerations]);

  // Native wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      setTransform((t) => {
        const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
        const newScale = Math.min(2.5, Math.max(0.3, t.scale * factor));
        const worldX = (cursorX - t.x) / t.scale;
        const worldY = (cursorY - t.y) / t.scale;
        return {
          scale: newScale,
          x: cursorX - worldX * newScale,
          y: cursorY - worldY * newScale,
        };
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-fan-node]')) return;
    panState.current = { startX: e.clientX, startY: e.clientY, origX: transform.x, origY: transform.y };
    draggedRef.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [transform.x, transform.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!panState.current) return;
    const dx = e.clientX - panState.current.startX;
    const dy = e.clientY - panState.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) draggedRef.current = true;
    setTransform((t) => ({ ...t, x: panState.current!.origX + dx, y: panState.current!.origY + dy }));
  }, []);

  const handlePointerUp = useCallback(() => {
    panState.current = null;
  }, []);

  // SVG arc path generator
  const createArcPath = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    // Add tiny gap
    const gapAngle = (0.35 * Math.PI) / 180;
    const sA = startAngle + gapAngle;
    const eA = endAngle - gapAngle;

    const x1 = Math.cos(sA) * outerR;
    const y1 = Math.sin(sA) * outerR;
    const x2 = Math.cos(eA) * outerR;
    const y2 = Math.sin(eA) * outerR;
    const x3 = Math.cos(eA) * innerR;
    const y3 = Math.sin(eA) * innerR;
    const x4 = Math.cos(sA) * innerR;
    const y4 = Math.sin(sA) * innerR;

    const largeArc = eA - sA > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Color theme per sector (Paternal = Cyan/Emerald/Blue, Maternal = Coral/Rose/Amber)
  const getNodeFill = (node: FanNode, isHovered: boolean) => {
    if (!node.person) {
      return theme === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.7)';
    }

    if (node.gen === 0) {
      return theme === 'dark' ? '#0f172a' : '#ffffff';
    }

    if (node.isPaternal) {
      // Paternal shades
      const colorsDark = ['#0891b2', '#0284c7', '#2563eb', '#4f46e5', '#059669', '#0d9488'];
      const colorsLight = ['#e0f2fe', '#bae6fd', '#dbeafe', '#ede9fe', '#d1fae5', '#ccfbf1'];
      const base = theme === 'dark' ? colorsDark[(node.gen - 1) % colorsDark.length] : colorsLight[(node.gen - 1) % colorsLight.length];
      return isHovered ? (theme === 'dark' ? '#38bdf8' : '#7dd3fc') : base;
    } else {
      // Maternal shades
      const colorsDark = ['#e11d48', '#d97706', '#ea580c', '#c026d3', '#db2777', '#ca8a04'];
      const colorsLight = ['#ffe4e6', '#fef3c7', '#ffedd5', '#fae8ff', '#fce7f3', '#fef9c3'];
      const base = theme === 'dark' ? colorsDark[(node.gen - 1) % colorsDark.length] : colorsLight[(node.gen - 1) % colorsLight.length];
      return isHovered ? (theme === 'dark' ? '#fb7185' : '#f43f5e') : base;
    }
  };

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950 select-none touch-none transition-colors"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        backgroundImage: `radial-gradient(circle, ${theme === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(100,116,139,0.12)'} 1.5px, transparent 1.5px)`,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <Layers size={15} className="text-emerald-500" /> Generaciones:
        </div>
        <div className="flex items-center gap-1">
          {[4, 5, 6, 7, 8].map((g) => (
            <button
              key={g}
              onClick={() => setMaxGenerations(g)}
              className={`h-7 w-7 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                maxGenerations === g
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Quick View Controls Bottom-Right */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-md">
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.min(2.5, t.scale * 1.2) }))}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          title="Acercar"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.3, t.scale / 1.2) }))}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          title="Alejar"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={() => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const initialScale = Math.min(rect.width / 1100, rect.height / 650, 1.1);
            setTransform({
              x: rect.width / 2,
              y: rect.height - 70,
              scale: Math.max(0.65, initialScale),
            });
          }}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          title="Centrar Abanico"
        >
          <Compass size={16} />
        </button>
      </div>

      {/* SVG Canvas World */}
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          position: 'absolute',
          willChange: 'transform',
        }}
      >
        <svg
          width={1800}
          height={1200}
          viewBox="-900 -900 1800 1200"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Center avatar clip path */}
            <clipPath id="center-avatar-clip">
              <circle cx={0} cy={0} r={32} />
            </clipPath>
          </defs>

          {/* Semicircular Ring Borders */}
          {Array.from({ length: maxGenerations }).map((_, idx) => {
            const r = CENTER_RADIUS + idx * RING_WIDTH;
            return (
              <path
                key={`ring-border-${idx}`}
                d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`}
                fill="none"
                stroke={theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                strokeWidth={1}
              />
            );
          })}

          {/* Fan Arc Nodes */}
          {fanNodes.map((node) => {
            if (node.gen === 0) return null; // Central hub rendered separately

            const pathD = createArcPath(node.startAngle, node.endAngle, node.innerRadius, node.outerRadius);
            const isHovered = hoveredId === `${node.gen}-${node.indexInGen}`;
            const isSelected = selectedId === node.person?.id;

            // Center angle of this segment for label rotation
            const midAngle = (node.startAngle + node.endAngle) / 2;
            const midR = (node.innerRadius + node.outerRadius) / 2;
            const textX = Math.cos(midAngle) * midR;
            const textY = Math.sin(midAngle) * midR;

            // Compute angle in degrees for text alignment
            let angleDeg = (midAngle * 180) / Math.PI + 90;
            if (angleDeg > 90) angleDeg -= 180;

            const textColor = node.person
              ? theme === 'dark'
                ? '#f8fafc'
                : node.isPaternal
                ? '#0369a1'
                : '#9f1239'
              : theme === 'dark'
              ? '#64748b'
              : '#94a3b8';

            return (
              <g
                key={`fan-node-${node.gen}-${node.indexInGen}`}
                data-fan-node="true"
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredId(`${node.gen}-${node.indexInGen}`)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  if (node.person) {
                    setSelected(node.person.id);
                    onSelectPerson(node.person.id);
                  }
                }}
                onDoubleClick={() => {
                  if (node.person) onEditPerson(node.person.id);
                }}
              >
                <path
                  d={pathD}
                  fill={getNodeFill(node, isHovered)}
                  stroke={
                    isSelected
                      ? '#10b981'
                      : isHovered
                      ? '#38bdf8'
                      : theme === 'dark'
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(0,0,0,0.1)'
                  }
                  strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                  className="transition-colors"
                />

                {/* Node Label Text */}
                {node.person ? (
                  <g transform={`translate(${textX}, ${textY}) rotate(${angleDeg})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={textColor}
                      className="font-bold select-none pointer-events-none"
                      style={{
                        fontSize: node.gen <= 2 ? 11 : node.gen <= 4 ? 9.5 : 8,
                      }}
                    >
                      {fullName(node.person)}
                    </text>
                    {node.gen <= 4 && (
                      <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        y={node.gen <= 2 ? 14 : 11}
                        fill={theme === 'dark' ? '#94a3b8' : '#64748b'}
                        className="font-medium select-none pointer-events-none"
                        style={{ fontSize: node.gen <= 2 ? 9 : 8 }}
                      >
                        {lifespan(node.person)}
                      </text>
                    )}
                  </g>
                ) : (
                  <g transform={`translate(${textX}, ${textY}) rotate(${angleDeg})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={theme === 'dark' ? '#475569' : '#cbd5e1'}
                      className="font-bold select-none pointer-events-none"
                      style={{ fontSize: 10 }}
                    >
                      +
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Central Root Person Semi-Hub */}
          {rootPerson && (
            <g
              data-fan-node="true"
              className="cursor-pointer"
              onClick={() => {
                setSelected(rootPerson.id);
                onSelectPerson(rootPerson.id);
              }}
              onDoubleClick={() => onEditPerson(rootPerson.id)}
            >
              {/* Semicircular center background */}
              <path
                d={`M ${-CENTER_RADIUS} 0 A ${CENTER_RADIUS} ${CENTER_RADIUS} 0 0 1 ${CENTER_RADIUS} 0 Z`}
                fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
                stroke="#10b981"
                strokeWidth={3}
                className="shadow-2xl"
              />

              {/* Avatar circle */}
              <g transform="translate(0, -45)">
                {rootPerson.photoUrl ? (
                  <image
                    href={rootPerson.photoUrl}
                    x={-28}
                    y={-28}
                    width={56}
                    height={56}
                    clipPath="url(#center-avatar-clip)"
                  />
                ) : (
                  <circle cx={0} cy={0} r={28} fill="#10b981" />
                )}
                {!rootPerson.photoUrl && (
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#020617"
                    className="text-xs font-black select-none pointer-events-none"
                  >
                    {initials(rootPerson)}
                  </text>
                )}
              </g>

              {/* Central Name & Lifespan */}
              <text
                textAnchor="middle"
                y={-14}
                fill={theme === 'dark' ? '#f8fafc' : '#0f172a'}
                className="font-bold text-xs select-none pointer-events-none"
              >
                {fullName(rootPerson)}
              </text>
              <text
                textAnchor="middle"
                y={-2}
                fill="#10b981"
                className="font-semibold text-[10px] select-none pointer-events-none"
              >
                {lifespan(rootPerson) || 'Nacido'}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
