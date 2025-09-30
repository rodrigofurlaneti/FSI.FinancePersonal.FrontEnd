// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { loginRequest, getAccessToken, setAccessToken, removeAccessToken } from "../service/authService";
import api from "../api/api";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return getAccessToken();
    } catch {
      return null;
    }
  });

  // Central logout implementation
  const doLogout = useCallback(async () => {
    console.warn("[AuthContext] doLogout called");
    try {
      // Tentar invalidar sessão no servidor (opcional)
      try {
        await api.post("/api/auth/logout");
      } catch {
        // ignore network errors
      }

      // Limpar token local e estado
      removeAccessToken();
      setTokenState(null);

      // Limpar cache do react-query
      try {
        await queryClient.clear();
      } catch (e) {
        console.error("[AuthContext] error clearing queryClient:", e);
      }

      // Redireciona para login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("[AuthContext] error during logout:", err);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }, [queryClient]);

  // Listener para o evento global "auth:logout" (disparado pelo interceptor 401)
  useEffect(() => {
    const onAuthLogout = (e?: Event) => {
      console.warn("[AuthContext] auth:logout event received", (e as any)?.detail);
      doLogout();
    };

    window.addEventListener("auth:logout", onAuthLogout as EventListener);
    return () => window.removeEventListener("auth:logout", onAuthLogout as EventListener);
  }, [doLogout]);

  // Sincroniza com mudanças no localStorage (outras abas)
  useEffect(() => {
    const syncToken = () => {
      const stored = getAccessToken();
      console.log("[AuthContext] storage changed, token now:", stored);
      setTokenState(stored);
    };

    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    console.log("[AuthContext] login called");
    const resp = await loginRequest({ email, password });

    try {
      const stored = getAccessToken();
      console.log("[AuthContext] token after loginRequest:", stored);
      setTokenState(stored);
    } catch {
      const maybeToken = (resp && (resp.token ?? resp.accessToken ?? resp)) as string | undefined;
      if (maybeToken) {
        setAccessToken(maybeToken);
        setTokenState(maybeToken);
      } else {
        setTokenState(null);
      }
    }
  };

  const logout = async () => {
    console.log("[AuthContext] logout called");
    await doLogout();
  };

  const value = useMemo(
    () => ({
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);