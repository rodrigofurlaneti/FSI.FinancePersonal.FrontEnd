// src/authService.ts
import api from "../api/api";

const ACCESS_TOKEN_KEY = "access_token";

export type AuthRequest = { email: string; password: string };

export async function loginRequest(payload: AuthRequest) {
  const resp = await api.post("/api/auth/login", payload);
  const token = resp.data?.token ?? resp.data;
  if (!token) throw new Error("Token não retornado pelo servidor");
  setAccessToken(token);
  return resp.data;
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export async function logout() {
  try {
    await api.post("/api/auth/logout"); // backend opcional
  } catch {

  } finally {
    removeAccessToken();
    window.location.href = "/login";
  }
}