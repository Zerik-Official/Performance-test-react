/**
 * Auth context with login/register/logout.
 * @module shared/context/AuthContext
 */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '@features/auth/services/authService';
import { sessionStore } from '@shared/lib/sessionStore';
import type { User } from '@shared/types/user';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const authService = new AuthService();

/**
 * Auth provider.
 * @param {{children: ReactNode}} props - Props.
 * @returns {React.ReactElement} Element.
 */
export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(() => sessionStore.getUser() as unknown as User | null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const token = sessionStore.get();
        if (!token) {
          setLoading(false);
          return;
        }
        const me = await authService.me();
        setUser(me);
        sessionStore.setUser(me as unknown as never);
      } catch {
        sessionStore.delete();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const res = await authService.login(email, password);
    sessionStore.set(res.accessToken);
    sessionStore.setUser(res.user as unknown as never);
    setUser(res.user);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    await authService.register(name, email, password);
    await login(email, password);
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout();
    } finally {
      sessionStore.delete();
      setUser(null);
      window.location.href = '/login';
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth.
 * @returns {AuthContextValue} Context.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}