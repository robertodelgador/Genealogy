import { useEffect, useRef, useState } from 'react';
import { TopBar } from './components/TopBar';
import { PeopleSearch } from './components/PeopleSearch';
import { Inspector } from './components/Inspector';
import { TreeView, type TreeViewHandle } from './components/TreeView';
import { FamilyFanChart } from './components/FamilyFanChart';
import { PersonModal, type RelationContext } from './components/PersonModal';
import { LoginScreen } from './components/LoginScreen';
import { useAuthStore } from './store/useAuthStore';
import { useTreeStore } from './store/useTreeStore';
import { useThemeStore } from './store/useThemeStore';
import { ChevronLeft, ChevronRight, Network, Disc } from 'lucide-react';

type ModalState = { mode: 'edit'; id: string } | { mode: 'create'; relation?: RelationContext } | null;

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);
  const fetchTreeFromDB = useTreeStore((s) => s.fetchTreeFromDB);
  const theme = useThemeStore((s) => s.theme);

  const treeRef = useRef<TreeViewHandle>(null);
  const [modal, setModal] = useState<ModalState>(null);

  // Layout Panels Collapsible State
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  // Main Canvas View Mode: 'tree' (Hierarchical Family Tree) or 'fan' (Ancestry Fan Chart)
  const [canvasView, setCanvasView] = useState<'tree' | 'fan'>('tree');

  // Sync theme class to html element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTreeFromDB().then(() => {
        setTimeout(() => {
          treeRef.current?.focusPerson('I500002');
        }, 300);
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <TopBar
        onAddPerson={() => setModal({ mode: 'create' })}
        onZoomIn={() => treeRef.current?.zoomIn()}
        onZoomOut={() => treeRef.current?.zoomOut()}
        onResetView={() => treeRef.current?.resetView()}
        onFocusPerson={(id) => treeRef.current?.focusPerson(id)}
      />

      {/* Primary Workspace */}
      <div className="flex min-h-0 flex-1 relative overflow-hidden">
        {/* Left Collapsible Panel (People Search) */}
        <div
          className={`shrink-0 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 transition-all duration-300 relative ${
            leftOpen ? 'w-64' : 'w-0'
          }`}
        >
          <div className={`h-full w-64 overflow-hidden transition-opacity duration-200 ${leftOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <PeopleSearch onFocusPerson={(id) => treeRef.current?.focusPerson(id)} />
          </div>

          {/* Left Collapse / Expand Chevron Tab */}
          <button
            onClick={() => setLeftOpen(!leftOpen)}
            title={leftOpen ? 'Ocultar lista de familiares' : 'Mostrar lista de familiares'}
            className="absolute top-1/2 -right-3.5 -translate-y-1/2 z-50 flex h-8 w-7 items-center justify-center rounded-r-xl border border-l-0 border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            {leftOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Center Canvas with View Switcher (Tree vs Fan Chart) */}
        <main className="min-w-0 flex-1 relative h-full">
          {/* Floating Canvas Mode Switcher Bar */}
          <div className="absolute top-4 right-6 z-30 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl backdrop-blur-md">
            <button
              onClick={() => setCanvasView('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                canvasView === 'tree'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Network size={14} /> Árbol Genealógico
            </button>
            <button
              onClick={() => setCanvasView('fan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                canvasView === 'fan'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              <Disc size={14} /> Abanico de Ancestros
            </button>
          </div>

          {canvasView === 'tree' ? (
            <TreeView ref={treeRef} onEditPerson={(id) => setModal({ mode: 'edit', id })} />
          ) : (
            <FamilyFanChart
              onSelectPerson={(id) => treeRef.current?.focusPerson(id)}
              onEditPerson={(id) => setModal({ mode: 'edit', id })}
            />
          )}
        </main>

        {/* Right Collapsible Panel (Inspector / Details & Audit History) */}
        <div
          className={`shrink-0 border-l border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 transition-all duration-300 relative ${
            rightOpen ? 'w-80' : 'w-0'
          }`}
        >
          {/* Right Collapse / Expand Chevron Tab */}
          <button
            onClick={() => setRightOpen(!rightOpen)}
            title={rightOpen ? 'Ocultar panel de detalles' : 'Mostrar panel de detalles'}
            className="absolute top-1/2 -left-3.5 -translate-y-1/2 z-50 flex h-8 w-7 items-center justify-center rounded-l-xl border border-r-0 border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            {rightOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <div className={`h-full w-80 overflow-hidden transition-opacity duration-200 ${rightOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Inspector
              onEdit={(id) => setModal({ mode: 'edit', id })}
              onAddRelation={(relation) => setModal({ mode: 'create', relation })}
            />
          </div>
        </div>
      </div>

      {modal?.mode === 'edit' && <PersonModal personId={modal.id} onClose={() => setModal(null)} />}
      {modal?.mode === 'create' && <PersonModal relation={modal.relation} onClose={() => setModal(null)} />}
    </div>
  );
}

export default App;
