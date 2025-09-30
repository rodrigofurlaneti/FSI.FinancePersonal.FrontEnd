// src/api/api.ts
import axios from "axios";
import { getAccessToken, removeAccessToken } from "../service/authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:60820",
  withCredentials: true, // mantemos para cookies HttpOnly se existirem
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // Remove token local
      try {
        removeAccessToken();
      } catch (e) {
        // ignore storage errors
      }

      // Dispatch a global event so AuthContext (ou outro consumidor) trate o logout/redirecionamento
      try {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      } catch (e) {
        // fallback: se CustomEvent não funcionar, usar location
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;