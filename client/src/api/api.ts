import axios from "axios";
import { getAccessToken, logout } from "./authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://localhost:60820",
  withCredentials: true // se usar cookies HttpOnly, mantenha true
});

// Request: adiciona header Authorization se houver token em storage
api.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response: tratamento de 401 (opcional: tentar refresh)
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // aqui poderíamos tentar um refresh token (implementar authService.refresh())
      originalRequest._retry = true;
      try {

      } catch {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
