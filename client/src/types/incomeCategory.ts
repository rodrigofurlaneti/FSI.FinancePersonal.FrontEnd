// src/types/incomeCategory.ts
export type IncomeCategory = {
  id: number;
  name: string;
  userId?: number | string | null;
  iconId?: number | string | null;
};

export type PagedResult<T> = {
  items: T[];
  total?: number;
  totalItems?: number;
  page: number;
  pageSize: number;
};

export type CreateIncomeCategoryPayload = {
  name: string;
  iconId?: number | null;
  createdAtUserId?: number | null;
  updatedAtUserId?: number | null;
};

export type UpdateIncomeCategoryPayload = {
  name: string;
  iconId?: number | null;
  updatedAtUserId?: number | null;
};