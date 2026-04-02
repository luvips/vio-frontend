"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  login as loginApi,
  logout as logoutApi,
  refreshSession as refreshSessionApi,
  register as registerApi,
} from "@/lib/api/auth";

type AuthStatus = "loading" | "authenticated" | "guest";

type Credentials = {
  email: string;
  password: string;
};

type AuthContextValue = {
  status: AuthStatus;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshSession = useCallback(async () => {
    try {
      await refreshSessionApi();
      setStatus("authenticated");
    } catch {
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (credentials: Credentials) => {
    await loginApi(credentials);
    setStatus("authenticated");
  }, []);

  const register = useCallback(async (credentials: Credentials) => {
    await registerApi(credentials);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      setStatus("guest");
    }
  }, []);

  const value = useMemo(
    () => ({
      status,
      login,
      register,
      logout,
      refreshSession,
    }),
    [status, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
