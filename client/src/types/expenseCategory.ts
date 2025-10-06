// src/types/expenseCategory.ts
export type ExpenseCategory = {
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

export type CreateExpenseCategoryPayload = {
  name: string;
  iconId?: number | null;
  createdAtUserId?: number | null;
  updatedAtUserId?: number | null;
};

export type UpdateExpenseCategoryPayload = {
  name: string;
  iconId?: number | null;
  updatedAtUserId?: number | null;
};