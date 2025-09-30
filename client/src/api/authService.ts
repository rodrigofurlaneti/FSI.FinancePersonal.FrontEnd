import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:60820",
  withCredentials: true
});

export type AuthRequest = { email: string; password: string };

export async function loginRequest(payload: AuthRequest) {
  const resp = await api.post("/api/auth/login", payload);
  // retorna token (conforme seu controller) e permite o caller armazenar
  return resp.data;
}

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

export function logout() {
  localStorage.removeItem("access_token");
  window.location.href = "/login";
}

export function setAccessToken(token: string) {
  localStorage.setItem("access_token", token);
}


