import api from "./api";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  date: string; // ISO
  categoryId?: number;
  description?: string;
};

export type PagedResult<T> = { items: T[]; total: number; page: number; pageSize: number };

export const ExpenseService = {
  getPaged: async (page = 1, pageSize = 10, search = "") => {
    const resp = await api.get<PagedResult<Expense>>("/api/Expense/paged", {
      params: { page, pageSize, name: search }
    });
    return resp.data;
  },

  getAll: async () => {
    const { data } = await api.get<Expense[]>("/api/Expense");
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<Expense>(`/api/Expense/${id}`);
    return data;
  },

  create: async (payload: Partial<Expense>) => {
    const { data } = await api.post("/api/Expense", payload);
    return data;
  },

  update: async (id: number, payload: Partial<Expense>) => {
    const { data } = await api.put(`/api/Expense/${id}`, payload);
    return data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete(`/api/Expense/${id}`);
    return data;
  }
};
