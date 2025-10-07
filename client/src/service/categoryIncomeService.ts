// src/service/categoryIncomeService.ts
import api from "../api/api"; // ajuste conforme sua instância axios
import type {
  IncomeCategory,
  PagedResult,
  CreateIncomeCategoryPayload,
  UpdateIncomeCategoryPayload
} from "../types/incomeCategory";
import { getAccessToken } from "./authService"; // ajuste se seu authService está em outro lugar

const base = "/api/IncomeCategory";

export const CategoryIncomeService = {
  getPaged: async (page = 1, pageSize = 10, search = "") => {
    const token = getAccessToken();
    const resp = await api.get<PagedResult<IncomeCategory>>(`${base}/paged`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: { page, pageSize, name: search }
    });
    return resp.data;
  },

  getAll: async () => {
    const token = getAccessToken();
    const { data } = await api.get<IncomeCategory[]>(base, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    return data;
  },

  getById: async (id: number) => {
    const token = getAccessToken();
    const { data } = await api.get<IncomeCategory>(`${base}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
    return data;
  },

  checkNameExists: async (name: string) => {
    const token = getAccessToken();
    const { data } = await api.get<boolean>(`${base}/name-exists`, { 
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: { name } });
    return data;
  },

  create: async (payload: CreateIncomeCategoryPayload): Promise<IncomeCategory> => {
    const token = getAccessToken();
    const { data } = await api.post<IncomeCategory>(
      base,
      payload, 
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return data;
  },

  update: async (id: number, payload: UpdateIncomeCategoryPayload) => {
    const token = getAccessToken();
    const { data } = await api.put<IncomeCategory>(`${base}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      payload     
    });
    return data;
  },

  remove: async (id: number) => {
    const token = getAccessToken();
    await api.delete(`${base}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }
};

export default CategoryIncomeService;