// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { loginRequest, setAccessToken, removeAccessToken } from "../service/authService";
import api from "../api/api";

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
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("access_token");
    } catch {
      return null;
    }
  });

  // sincroniza estado com localStorage em caso de mudança externa (ex: outra aba)
  useEffect(() => {
    const syncToken = () => {
      try {
        const storedToken = localStorage.getItem("access_token");
        setTokenState(storedToken);
      } catch {
        setTokenState(null);
      }
    };

    // escuta mudanças no localStorage (ex: em outra aba)
    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener("storage", syncToken);
    };
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    const token = await loginRequest({ email, password });
    setAccessToken(token);
    setTokenState(token);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore network errors
    }
    removeAccessToken();
    setTokenState(null);
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