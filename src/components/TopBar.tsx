import { useRef } from 'react';
import { TreePine, UserPlus, ZoomIn, ZoomOut, Maximize2, Download, Upload, RotateCcw, LogOut, UserCircle2 } from 'lucide-react';
import { useTreeStore } from '../store/useTreeStore';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  onAddPerson: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export function TopBar({ onAddPerson, onZoomIn, onZoomOut, onResetView }: Props) {
  const people = useTreeStore((s) => s.people);
  const rootId = useTreeStore((s) => s.rootId);
  const importData = useTreeStore((s) => s.importData);
  const resetToSeed = useTreeStore((s) => s.resetToSeed);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data = { people, rootId };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'genealogy-tree.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data && typeof data === 'object' && data.people) {
          importData(data);
        } else {
          alert('Invalid genealogy file.');
        }
      } catch {
        alert('Could not parse file as JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-slate-900 px-4">
      <div className="flex items-center gap-3 text-slate-100">
        <div className="flex items-center gap-2">
          <TreePine size={20} className="text-emerald-400" />
          <span className="font-semibold tracking-tight">Genealogy Tree Manager</span>
        </div>
        {currentUser && (
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-300">
            <UserCircle2 size={13} /> {currentUser.name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={onAddPerson} className="btn-primary">
          <UserPlus size={14} /> Add Person
        </button>
        <div className="mx-1.5 h-6 w-px bg-white/10" />
        <button onClick={onZoomOut} title="Zoom out" className="icon-btn">
          <ZoomOut size={16} />
        </button>
        <button onClick={onZoomIn} title="Zoom in" className="icon-btn">
          <ZoomIn size={16} />
        </button>
        <button onClick={onResetView} title="Fit view" className="icon-btn">
          <Maximize2 size={16} />
        </button>
        <div className="mx-1.5 h-6 w-px bg-white/10" />
        <button onClick={handleExport} title="Export JSON" className="icon-btn">
          <Download size={16} />
        </button>
        <button onClick={handleImportClick} title="Import JSON" className="icon-btn">
          <Upload size={16} />
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />
        <button
          onClick={() => {
            if (confirm('Reset the tree to the sample family? This replaces your current data.')) {
              resetToSeed();
            }
          }}
          title="Reset to sample data"
          className="icon-btn"
        >
          <RotateCcw size={16} />
        </button>

        <div className="mx-1.5 h-6 w-px bg-white/10" />
        {/* Logout Button */}
        <button
          onClick={() => {
            if (confirm('¿Deseas cerrar sesión?')) {
              logout();
            }
          }}
          title="Cerrar Sesión"
          className="icon-btn text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
