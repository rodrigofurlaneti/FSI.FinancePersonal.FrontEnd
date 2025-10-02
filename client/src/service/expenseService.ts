import api from "../api/api";
import type { Expense, PagedResult, CreateExpensePayload, UpdateExpensePayload } from "../types/expense";
import { getAccessToken } from "./authService";

const base = "/api/Expense";

export const ExpenseService = {
  getPaged: async (page = 1, pageSize = 10, search = ""): Promise<PagedResult<Expense>> => {
    const resp = await api.get<PagedResult<Expense>>(`${base}/paged`, {
      params: { page, pageSize, name: search }
    });
    return resp.data;
  },

  getAll: async (): Promise<Expense[]> => {
    const token = getAccessToken();
    const { data } = await api.get<Expense[]>(base, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },

  getById: async (id: number): Promise<Expense> => {
    const token = getAccessToken();
    const { data } = await api.get<Expense>(`${base}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },

  getByName: async (name: string): Promise<Expense> => {
    const token = getAccessToken();
    const { data } = await api.get<Expense>(`${base}/by-name`, {
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

  create: async (payload: CreateExpensePayload): Promise<Expense> => {
    const token = getAccessToken();
    const { data } = await api.post<Expense>(
      base,
      payload,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return data;
  },

  update: async (id: number, payload: UpdateExpensePayload): Promise<Expense> => {
    const token = getAccessToken();
    const { data } = await api.put<Expense>(`${base}/${id}`, {
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

export default ExpenseService;