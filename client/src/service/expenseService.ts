// src/api/expenseService.ts
import api from "../api/api";
import type { Expense, PagedResult, CreateExpensePayload, UpdateExpensePayload } from "../types/expense";

export const ExpenseService = {
  // GET /api/Expense/paged?page=1&pageSize=10&name=search
  getPaged: async (page = 1, pageSize = 10, search = ""): Promise<PagedResult<Expense>> => {
    const resp = await api.get<PagedResult<Expense>>("/api/Expense/paged", {
      params: { page, pageSize, name: search }
    });
    return resp.data;
  },

  // GET /api/Expense
  getAll: async (): Promise<Expense[]> => {
    const { data } = await api.get<Expense[]>("/api/Expense");
    return data;
  },

  // GET /api/Expense/{id}
  getById: async (id: number): Promise<Expense> => {
    const { data } = await api.get<Expense>(`/api/Expense/${id}`);
    return data;
  },

  // GET /api/Expense/by-name?name=xxx
  getByName: async (name: string): Promise<Expense> => {
    const { data } = await api.get<Expense>(`/api/Expense/by-name`, {
      params: { name }
    });
    return data;
  },

  // GET /api/Expense/name-exists?name=xxx
  checkNameExists: async (name: string): Promise<boolean> => {
    const { data } = await api.get<boolean>(`/api/Expense/name-exists`, {
      params: { name }
    });
    return data;
  },

  // POST /api/Expense
  create: async (payload: CreateExpensePayload): Promise<Expense> => {
    const { data } = await api.post<Expense>("/api/Expense", payload);
    return data;
  },

  // PUT /api/Expense/{id}
  update: async (id: number, payload: UpdateExpensePayload): Promise<Expense> => {
    const { data } = await api.put<Expense>(`/api/Expense/${id}`, payload);
    return data;
  },

  // DELETE /api/Expense/{id}
  remove: async (id: number): Promise<void> => {
    await api.delete(`/api/Expense/${id}`);
  }
};

export default ExpenseService;