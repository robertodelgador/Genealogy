import { useState } from 'react';
import { TreePine, Lock, KeyRound, User, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const loginError = useAuthStore((s) => s.loginError);
  const clearError = useAuthStore((s) => s.clearError);

  const [mode, setMode] = useState<'passphrase' | 'credentials'>('passphrase');
  const [passphrase, setPassphrase] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    clearError();

    setTimeout(() => {
      if (mode === 'passphrase') {
        login(passphrase);
      } else {
        login(username, password);
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 px-4 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 bg-slate-800/40 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
              <TreePine size={36} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Historia Genealógica</h1>
            <p className="mt-1.5 text-xs font-medium text-slate-400">
              Archivo y Árbol Genealógico Familiar Privado
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              <Lock size={12} /> Acceso Restringido & Protegido
            </div>
          </div>

          <div className="flex border-b border-white/10 bg-slate-900/50 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('passphrase');
                clearError();
              }}
              className={mode === 'passphrase' ? 'flex-1 rounded-lg py-2 text-xs font-medium bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30 transition-all' : 'flex-1 rounded-lg py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-all'}
            >
              <KeyRound size={13} className="inline mr-1.5 -mt-0.5" /> Clave Familiar
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('credentials');
                clearError();
              }}
              className={mode === 'credentials' ? 'flex-1 rounded-lg py-2 text-xs font-medium bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30 transition-all' : 'flex-1 rounded-lg py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-all'}
            >
              <User size={13} className="inline mr-1.5 -mt-0.5" /> Usuario y Contraseña
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {loginError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {mode === 'passphrase' ? (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Clave de Acceso Familiar
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Introduce la clave familiar..."
                    required
                    autoFocus
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-emerald-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Usuario
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin, familia o tu usuario"
                      required
                      autoFocus
                      className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-emerald-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-emerald-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-emerald-400 active:scale-[0.99] disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              ) : (
                <>
                  <ShieldCheck size={18} /> Entrar al Árbol Genealógico
                </>
              )}
            </button>
          </form>

          <div className="border-t border-white/5 bg-slate-950/40 p-4 text-center text-[11px] text-slate-400">
            Todos los datos genealógicos se mantienen confidenciales.
          </div>
        </div>
      </div>
    </div>
  );
}
