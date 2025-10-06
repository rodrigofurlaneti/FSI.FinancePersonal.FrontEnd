import api from "../api/api";
import type { Icon, PagedResult, CreateIconPayload, UpdateIconPayload } from "../types/icon";
import { getAccessToken } from "./authService";

const base = "/api/Icon";

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export const IconService = {
  getPaged: async (page = 1, pageSize = 10, search = ""): Promise<PagedResult<Icon>> => {
    const resp = await api.get<PagedResult<Icon>>(`${base}/paged`, {
      params: { page, pageSize, name: search },
      headers: authHeaders(),
    });
    return resp.data;
  },

  getAll: async (): Promise<Icon[]> => {
    const { data } = await api.get<Icon[]>(base, { headers: authHeaders() });
    return data;
  },

  getById: async (id: number): Promise<Icon> => {
    const { data } = await api.get<Icon>(`${base}/${id}`, { headers: authHeaders() });
    return data;
  },

  getByName: async (name: string): Promise<Icon> => {
    const { data } = await api.get<Icon>(`${base}/by-name`, {
      headers: authHeaders(),
      params: { name }
    });
    return data;
  },

  checkNameExists: async (name: string): Promise<boolean> => {
    const { data } = await api.get<boolean>(`${base}/name-exists`, {
      headers: authHeaders(),
      params: { name }
    });
    return data;
  },

  create: async (payload: CreateIconPayload): Promise<Icon> => {
    const { data } = await api.post<Icon>(base, payload, { headers: authHeaders() });
    return data;
  },

  update: async (id: number, payload: UpdateIconPayload): Promise<Icon> => {
    const { data } = await api.put<Icon>(`${base}/${id}`, payload, { headers: authHeaders() });
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`${base}/${id}`, { headers: authHeaders() });
  }
};

export default IconService;