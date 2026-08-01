"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, type AuthUser } from "@/lib/api/auth";
import { clearToken, getToken, setToken } from "./session";

type AuthStatus = "loading" | "authenticated" | "guest";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function hydrate() {
      const token = getToken();
      if (!token) {
        setStatus("guest");
        return;
      }
      try {
        const profile = await authApi.me();
        setUser(profile);
        setStatus("authenticated");
      } catch {
        clearToken();
        setStatus("guest");
      }
    }
    void hydrate();
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    const { token } = await authApi.login(email, password);
    setToken(token, remember);
    const profile = await authApi.me();
    setUser(profile);
    setStatus("authenticated");
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirmation: string) => {
      const { token } = await authApi.register(name, email, password, passwordConfirmation);
      setToken(token, true);
      const profile = await authApi.me();
      setUser(profile);
      setStatus("authenticated");
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Token may already be invalid/expired — clear local state regardless.
    }
    clearToken();
    setUser(null);
    setStatus("guest");
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
