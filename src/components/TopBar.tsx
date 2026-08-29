import { useRef } from 'react';
import { TreePine, UserPlus, ZoomIn, ZoomOut, Maximize2, Download, Upload, LogOut, UserCircle2, Sun, Moon, Target } from 'lucide-react';
import { useTreeStore } from '../store/useTreeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

interface Props {
  onAddPerson: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFocusPerson?: (id: string) => void;
}

export function TopBar({ onAddPerson, onZoomIn, onZoomOut, onResetView, onFocusPerson }: Props) {
  const people = useTreeStore((s) => s.people);
  const rootId = useTreeStore((s) => s.rootId);
  const setRoot = useTreeStore((s) => s.setRoot);
  const setSelected = useTreeStore((s) => s.setSelected);
  const importData = useTreeStore((s) => s.importData);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data = { people, rootId };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arbol-genealogico.json';
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
          alert('Archivo genealógico inválido.');
        }
      } catch {
        alert('No se pudo leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function centerOnRoberto() {
    const targetId = 'roberto-delgado-ruegg';
    if (people[targetId]) {
      setRoot(targetId);
      setSelected(targetId);
      if (onFocusPerson) onFocusPerson(targetId);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 dark:bg-slate-900/90 bg-white px-4 shadow-sm backdrop-blur-md transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-inner">
            <TreePine size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Árbol Genealógico
            </h1>
            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              Familia Urruela • Delgado • Rüegg
            </p>
          </div>
        </div>

        {currentUser && (
          <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 ml-2">
            <UserCircle2 size={14} /> {currentUser.full_name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Center on Roberto Delgado Rüegg */}
        <button
          onClick={centerOnRoberto}
          title="Centrar en Roberto Delgado Rüegg"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Target size={14} /> Roberto Delgado Rüegg
        </button>

        <button onClick={onAddPerson} className="btn-primary">
          <UserPlus size={15} /> <span className="hidden sm:inline">Agregar Familiar</span>
        </button>

        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />

        <button onClick={onZoomOut} title="Alejar" className="icon-btn">
          <ZoomOut size={17} />
        </button>
        <button onClick={onZoomIn} title="Acercar" className="icon-btn">
          <ZoomIn size={17} />
        </button>
        <button onClick={onResetView} title="Ajustar vista completa" className="icon-btn">
          <Maximize2 size={17} />
        </button>

        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />

        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          className="icon-btn text-amber-500 dark:text-amber-300"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={handleExport} title="Descargar copia de seguridad JSON" className="icon-btn">
          <Download size={17} />
        </button>
        <button onClick={handleImportClick} title="Cargar archivo JSON" className="icon-btn">
          <Upload size={17} />
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileChange} />

        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-white/10" />

        {/* Logout */}
        <button
          onClick={() => {
            if (confirm('¿Deseas cerrar sesión?')) {
              logout();
            }
          }}
          title="Cerrar Sesión"
          className="icon-btn text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
