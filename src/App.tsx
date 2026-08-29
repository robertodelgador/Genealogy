import { useEffect, useRef, useState } from 'react';
import { TopBar } from './components/TopBar';
import { PeopleSearch } from './components/PeopleSearch';
import { Inspector } from './components/Inspector';
import { TreeView, type TreeViewHandle } from './components/TreeView';
import { PersonModal, type RelationContext } from './components/PersonModal';
import { LoginScreen } from './components/LoginScreen';
import { useAuthStore } from './store/useAuthStore';
import { useTreeStore } from './store/useTreeStore';

type ModalState = { mode: 'edit'; id: string } | { mode: 'create'; relation?: RelationContext } | null;

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const checkSession = useAuthStore((s) => s.checkSession);
  const fetchTreeFromDB = useTreeStore((s) => s.fetchTreeFromDB);

  const treeRef = useRef<TreeViewHandle>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTreeFromDB();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <TopBar
        onAddPerson={() => setModal({ mode: 'create' })}
        onZoomIn={() => treeRef.current?.zoomIn()}
        onZoomOut={() => treeRef.current?.zoomOut()}
        onResetView={() => treeRef.current?.resetView()}
      />
      <div className="flex min-h-0 flex-1">
        <aside className="w-64 shrink-0 border-r border-white/10 bg-slate-900">
          <PeopleSearch onFocusPerson={(id) => treeRef.current?.focusPerson(id)} />
        </aside>
        <main className="min-w-0 flex-1">
          <TreeView ref={treeRef} onEditPerson={(id) => setModal({ mode: 'edit', id })} />
        </main>
        <aside className="w-80 shrink-0 border-l border-white/10 bg-slate-900">
          <Inspector
            onEdit={(id) => setModal({ mode: 'edit', id })}
            onAddRelation={(relation) => setModal({ mode: 'create', relation })}
          />
        </aside>
      </div>

      {modal?.mode === 'edit' && <PersonModal personId={modal.id} onClose={() => setModal(null)} />}
      {modal?.mode === 'create' && <PersonModal relation={modal.relation} onClose={() => setModal(null)} />}
    </div>
  );
}

export default App;
