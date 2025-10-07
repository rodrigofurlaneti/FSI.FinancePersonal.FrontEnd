import api from "../api/api";
import type { Income, PagedResult, CreateIncomePayload, UpdateIncomePayload } from "../types/income";
import { getAccessToken } from "./authService";

const base = "/api/Income";

export const IncomeService = {
  getPaged: async (page = 1, pageSize = 10, search = ""): Promise<PagedResult<Income>> => {
    const resp = await api.get<PagedResult<Income>>(`${base}/paged`, {
      params: { page, pageSize, name: search }
    });
    return resp.data;
  },

  getAll: async (): Promise<Income[]> => {
    const token = getAccessToken();
    const { data } = await api.get<Income[]>(base, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },

  getById: async (id: number): Promise<Income> => {
    const token = getAccessToken();
    const { data } = await api.get<Income>(`${base}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },

  getByName: async (name: string): Promise<Income> => {
    const token = getAccessToken();
    const { data } = await api.get<Income>(`${base}/by-name`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: { name }
    });
    return data;
  },

  checkNameExists: async (name: string): Promise<boolean> => {
    const token = getAccessToken();
    const { data } = await api.get<boolean>(`${base}/name-exists`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: { name }
    });
    return data;
  },

  create: async (payload: CreateIncomePayload): Promise<Income> => {
    const token = getAccessToken();
    const { data } = await api.post<Income>(
      base,
      payload,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return data;
  },

  update: async (id: number, payload: UpdateIncomePayload): Promise<Income> => {
    const token = getAccessToken();
    const { data } = await api.put<Income>(`${base}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      payload
    });
    return data;
  },

  remove: async (id: number): Promise<void> => {
    const token = getAccessToken();
    await api.delete(`${base}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
};

export default IncomeService;