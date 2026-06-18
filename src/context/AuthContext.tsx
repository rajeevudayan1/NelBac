import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import { tokenStore } from '@/api/tokenStore';
import { setForcedLogoutHandler } from '@/api/client';
import type { RegisterPayload, UserMe } from '@/types';

export type AuthModalView = 'login' | 'register';

interface AuthContextValue {
  user: UserMe | null;
  isAuthenticated: boolean;
  loading: boolean;
  // Auth actions — throw ApiError on failure so callers can surface messages.
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Permission gate for menus/routes/buttons (super_admin bypasses all checks).
  can: (permission: string) => boolean;
  // Global auth modal control.
  authModalOpen: boolean;
  authModalView: AuthModalView;
  openAuthModal: (view?: AuthModalView) => void;
  closeAuthModal: () => void;
  // Run `action` if signed in, otherwise open the modal and run it after login.
  requireAuth: (action: () => void, view?: AuthModalView) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('login');
  const pendingAction = useRef<(() => void) | null>(null);

  const refreshUser = useCallback(async () => {
    if (!tokenStore.getAccess()) {
      setUser(null);
      return;
    }
    try {
      setUser(await authApi.me());
    } catch {
      // Token invalid/expired and refresh failed — treat as signed out.
      tokenStore.clear();
      setUser(null);
    }
  }, []);

  // Let the API client force a logout (e.g. on a "permissions changed" 401).
  useEffect(() => {
    setForcedLogoutHandler(() => setUser(null));
    return () => setForcedLogoutHandler(null);
  }, []);

  // Restore session on first load.
  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, [refreshUser]);

  // Shared success path — once tokens are stored (by any provider), load the
  // user from /auth/me, close the modal, and run any queued gated action.
  const completeLogin = useCallback(async () => {
    setUser(await authApi.me());
    setAuthModalOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    if (action) action();
  }, []);

  const login = useCallback(
    async (usernameOrEmail: string, password: string) => {
      await authApi.login(usernameOrEmail, password);
      await completeLogin();
    },
    [completeLogin]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      await authApi.register(payload);
      // Registration returns the user but no tokens — sign in immediately.
      await authApi.login(payload.username, payload.password);
      await completeLogin();
    },
    [completeLogin]
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      await authApi.googleLogin(idToken);
      await completeLogin();
    },
    [completeLogin]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const can = useCallback(
    (permission: string) => !!user && (user.is_superuser || user.permissions.includes(permission)),
    [user]
  );

  const openAuthModal = useCallback((view: AuthModalView = 'login') => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    pendingAction.current = null;
    setAuthModalOpen(false);
  }, []);

  const requireAuth = useCallback(
    (action: () => void, view: AuthModalView = 'login') => {
      if (user) {
        action();
        return;
      }
      pendingAction.current = action;
      openAuthModal(view);
    },
    [user, openAuthModal]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
    can,
    authModalOpen,
    authModalView,
    openAuthModal,
    closeAuthModal,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
