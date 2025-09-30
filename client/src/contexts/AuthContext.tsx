import React, { createContext, useContext, useState } from "react";
import { loginRequest } from "../api/authService";

type AuthContextType = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));

  const login = async (email: string, password: string) => {
    const data = await loginRequest({ email, password });
    const t = data?.token;
    if (!t) throw new Error(data?.message ?? "Token not received");
    // temporário: armazenar em localStorage; em produção prefira cookie HttpOnly
    localStorage.setItem("access_token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
