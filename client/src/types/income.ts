export type Income = {
  id: number;
  name: string;
  amount: number;
  incomeDate: string;
  incomeCategoryId?: number;
  description?: string | null;
  paidAt?: string | null;
  userId?: number;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type CreateIncomePayload = {
  name: string;
  amount: number | string;
  incomeDate: string;
  description?: string | null;
  paidAt?: string | null;
  incomeCategoryId: number;
  createdAtUserId?: number | null;
  updatedAtUserId?: number | null;
};

export type UpdateIncomePayload = {
  name: string;
  amount: number | string;
  incomeDate: string;
  description?: string | null;
  paidAt?: string | null;
  incomeCategoryId: number;
  updatedAtUserId?: number | null;
};