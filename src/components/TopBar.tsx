import { useRef, useState } from 'react';
import {
  TreePine,
  UserPlus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Upload,
  LogOut,
  UserCircle2,
  Sun,
  Moon,
  Target,
  FileCode,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { useTreeStore } from '../store/useTreeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { parseGedcom, exportToGedcom } from '../utils/gedcom';

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

  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExportJson() {
    setShowExportMenu(false);
    const data = { people, rootId };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arbol-genealogico.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportGedcom() {
    setShowExportMenu(false);
    const gedcomContent = exportToGedcom({ people, rootId });
    const blob = new Blob([gedcomContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arbol-genealogico.ged';
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
    reader.onload = async () => {
      const content = reader.result as string;
      try {
        if (file.name.toLowerCase().endsWith('.ged') || content.includes('0 HEAD') || content.includes('INDI')) {
          const parsed = parseGedcom(content);
          const totalPeople = Object.keys(parsed.people).length;
          if (totalPeople === 0) {
            alert('No se encontraron registros de personas en el archivo GEDCOM.');
            return;
          }
          if (confirm(`¿Deseas importar ${totalPeople} familiares desde el archivo GEDCOM '${file.name}'?`)) {
            await importData(parsed);
            alert(`¡Se importaron ${totalPeople} registros correctamente a la base de datos!`);
          }
        } else {
          const data = JSON.parse(content);
          if (data && typeof data === 'object' && data.people) {
            const totalPeople = Object.keys(data.people).length;
            if (confirm(`¿Deseas importar ${totalPeople} familiares desde el archivo JSON?`)) {
              await importData(data);
              alert(`¡Se importaron ${totalPeople} registros correctamente a la base de datos!`);
            }
          } else {
            alert('Archivo genealógico JSON inválido.');
          }
        }
      } catch (err: any) {
        console.error('Import error:', err);
        alert('Error al leer o procesar el archivo: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function centerOnRoberto() {
    let targetId = 'I500002';
    if (!people[targetId]) {
      targetId = 'roberto-delgado-ruegg';
    }
    if (!people[targetId]) {
      for (const [id, p] of Object.entries(people)) {
        const fn = `${p.firstName} ${p.lastName}`.toLowerCase();
        if (fn.includes('roberto') && fn.includes('delgado') && fn.includes('r')) {
          targetId = id;
          break;
        }
      }
    }
    if (people[targetId]) {
      setRoot(targetId);
      setSelected(targetId);
      if (onFocusPerson) onFocusPerson(targetId);
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 shadow-sm backdrop-blur-md transition-colors z-40 relative">
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

        {/* Import Button (GEDCOM & JSON) */}
        <button
          onClick={handleImportClick}
          title="Cargar archivo GEDCOM (.ged) o JSON"
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer"
        >
          <Upload size={14} /> <span className="hidden md:inline">Importar GEDCOM / JSON</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ged,.gedcom,.json,text/plain,application/json"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Export Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            title="Exportar archivo genealógico"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <Download size={14} /> <span className="hidden md:inline">Exportar</span> <ChevronDown size={12} />
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onMouseLeave={() => setShowExportMenu(false)}
            >
              <button
                onClick={handleExportGedcom}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <FileCode size={16} className="text-emerald-500" />
                <div>
                  <div>Formato GEDCOM (.ged)</div>
                  <div className="text-[10px] font-normal text-slate-400">Estándar Ancestry, MyHeritage</div>
                </div>
              </button>

              <button
                onClick={handleExportJson}
                className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer mt-1"
              >
                <FileSpreadsheet size={16} className="text-blue-500" />
                <div>
                  <div>Copia de Seguridad JSON</div>
                  <div className="text-[10px] font-normal text-slate-400">Backup completo del sistema</div>
                </div>
              </button>
            </div>
          )}
        </div>

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
