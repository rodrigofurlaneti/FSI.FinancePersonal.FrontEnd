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
    console.log("[api] request token:", token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[api] Authorization header set:", config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    console.error("[api] response error", {
      status,
      url: error?.config?.url,
      data: error?.response?.data,
    });

    if (status === 401) {
      console.warn("[api] got 401 -> removing token and dispatching auth:logout");
      try {
        removeAccessToken();
      } catch (e) {
        console.error("[api] error removing token:", e);
      }

      try {
        window.dispatchEvent(new CustomEvent("auth:logout", { detail: { url: error?.config?.url } }));
      } catch (e) {
        console.error("[api] error dispatching auth:logout event:", e);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;