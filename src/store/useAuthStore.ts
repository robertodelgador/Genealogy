import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id?: number | string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: 'admin' | 'editor' | 'viewer';
  auth_provider: 'email' | 'google';
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  loginError: string | null;
  loading: boolean;
  checkSession: () => Promise<boolean>;
  login: (emailOrPass: string, password?: string) => Promise<boolean>;
  googleLogin: (credential: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUser: null,
      loginError: null,
      loading: false,

      checkSession: async () => {
        try {
          const res = await fetch('api.php?action=me');
          if (res.ok) {
            const data = await res.json();
            if (data.authenticated && data.user) {
              set({ isAuthenticated: true, currentUser: data.user, loginError: null });
              return true;
            }
          }
        } catch {
          // ignore network errors
        }
        return false;
      },

      login: async (emailOrPass: string, password?: string) => {
        set({ loading: true, loginError: null });
        try {
          // If only 1 argument passed, check if it is a family passphrase
          if (!password) {
            if (emailOrPass === 'Urruela2026' || emailOrPass === 'Indelrue2026!') {
              const familyUser: AuthUser = {
                email: 'familia@indelrue.com',
                full_name: 'Miembro de la Familia',
                role: 'editor',
                auth_provider: 'email'
              };
              set({ isAuthenticated: true, currentUser: familyUser, loading: false, loginError: null });
              return true;
            }
          }

          // Otherwise call PostgreSQL API
          const res = await fetch('api.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailOrPass, password: password || '' })
          });

          const data = await res.json();
          if (res.ok && data.success && data.user) {
            set({ isAuthenticated: true, currentUser: data.user, loading: false, loginError: null });
            return true;
          } else {
            set({ loginError: data.error || 'Credenciales inválidas.', loading: false });
            return false;
          }
        } catch (e: any) {
          // Fallback offline admin check
          if (emailOrPass.toLowerCase() === 'admin' && password === 'Indelrue2026!') {
            const adminUser: AuthUser = {
              email: 'admin@indelrue.com',
              full_name: 'Roberto Delgado',
              role: 'admin',
              auth_provider: 'email'
            };
            set({ isAuthenticated: true, currentUser: adminUser, loading: false, loginError: null });
            return true;
          }
          set({ loginError: 'Error al conectar con el servidor PostgreSQL.', loading: false });
          return false;
        }
      },

      googleLogin: async (credential: string) => {
        set({ loading: true, loginError: null });
        try {
          const res = await fetch('api.php?action=google-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential })
          });
          const data = await res.json();
          if (res.ok && data.success && data.user) {
            set({ isAuthenticated: true, currentUser: data.user, loading: false, loginError: null });
            return true;
          } else {
            set({ loginError: data.error || 'Error al autenticar con Google.', loading: false });
            return false;
          }
        } catch (e: any) {
          set({ loginError: 'Error al conectar con el servidor para Google Login.', loading: false });
          return false;
        }
      },

      register: async (name: string, email: string, pass: string) => {
        set({ loading: true, loginError: null });
        try {
          const res = await fetch('api.php?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password: pass })
          });
          const data = await res.json();
          if (res.ok && data.success && data.user) {
            set({ isAuthenticated: true, currentUser: data.user, loading: false, loginError: null });
            return true;
          } else {
            set({ loginError: data.error || 'Error al crear la cuenta familiar.', loading: false });
            return false;
          }
        } catch (e: any) {
          set({ loginError: 'Error al conectar con el servidor PostgreSQL.', loading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          await fetch('api.php?action=logout', { method: 'POST' });
        } catch {
          // ignore
        }
        set({ isAuthenticated: false, currentUser: null, loginError: null });
      },

      clearError: () => set({ loginError: null }),
    }),
    {
      name: 'genealogy-auth-storage',
    }
  )
);
