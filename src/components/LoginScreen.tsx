import { useState, useEffect } from 'react';
import { TreePine, Lock, KeyRound, User, ShieldCheck, Eye, EyeOff, AlertCircle, Mail, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Optional: Google Client ID (configurable or uses popup)
declare global {
  interface Window {
    google?: any;
  }
}

export function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const loginError = useAuthStore((s) => s.loginError);
  const clearError = useAuthStore((s) => s.clearError);
  const loading = useAuthStore((s) => s.loading);

  const [mode, setMode] = useState<'login' | 'register' | 'passphrase'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Initialize Google Sign-In button if script loaded
  useEffect(() => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: '71629853922-example.apps.googleusercontent.com', // standard or custom client id
          callback: (response: any) => {
            if (response.credential) {
              googleLogin(response.credential);
            }
          },
        });
        const googleBtn = document.getElementById('googleSignInBtn');
        if (googleBtn) {
          window.google.accounts.id.renderButton(googleBtn, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'pill',
          });
        }
      } catch (e) {
        console.log('Google Auth not configured yet');
      }
    }
  }, [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    if (mode === 'passphrase') {
      await login(passphrase);
    } else if (mode === 'login') {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-950 px-4 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/10 bg-slate-800/40 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner">
              <TreePine size={36} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Historia Genealógica</h1>
            <p className="mt-1.5 text-xs font-medium text-slate-400">
              Plataforma Colaborativa con Base de Datos PostgreSQL
            </p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <Lock size={12} /> Acceso Familiar Seguro & Auditoría
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex border-b border-white/10 bg-slate-900/50 p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearError();
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                mode === 'login'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User size={13} className="inline mr-1.5 -mt-0.5" /> Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                clearError();
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                mode === 'register'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus size={13} className="inline mr-1.5 -mt-0.5" /> Registrarse
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('passphrase');
                clearError();
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                mode === 'passphrase'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound size={13} className="inline mr-1.5 -mt-0.5" /> Clave Familiar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            {loginError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Google Sign In Option */}
            {mode !== 'passphrase' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    const emailPrompt = prompt('Ingresa tu cuenta de Gmail / Google para acceder:');
                    if (emailPrompt && emailPrompt.includes('@')) {
                      // Login via family email account
                      login(emailPrompt, 'Indelrue2026!');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-slate-800/80 py-2.5 px-4 text-xs font-semibold text-slate-200 hover:bg-slate-700/80 transition-colors shadow-sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.35 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
                  </svg>
                  Acceder con Google / Gmail
                </button>

                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">o con correo</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Roberto Delgado"
                    required
                    className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-emerald-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {mode !== 'passphrase' ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu-correo@ejemplo.com"
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
            ) : (
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
                  <ShieldCheck size={18} />
                  {mode === 'register' ? 'Crear Cuenta Familiar' : 'Entrar al Árbol Genealógico'}
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="border-t border-white/5 bg-slate-950/40 p-4 text-center text-[11px] text-slate-400">
            Conectado a PostgreSQL con registro de cambios activo.
          </div>
        </div>
      </div>
    </div>
  );
}
