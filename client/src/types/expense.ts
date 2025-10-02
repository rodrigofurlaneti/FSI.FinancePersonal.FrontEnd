export type Expense = {
  id: number;
  name: string;
  amount: number;
  date: string; 
  categoryId?: number;
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

export type CreateExpensePayload = {
  name: string;
  amount: number | string;
  dueDate: string;
  description?: string | null;
  paidAt?: string | null;
  expenseCategoryId: number;
  createdAtUserId?: number | null;
  updatedAtUserId?: number | null;
};

export type UpdateExpensePayload = {
  name: string;
  amount: number | string;
  dueDate: string;
  description?: string | null;
  paidAt?: string | null;
  expenseCategoryId: number;
  updatedAtUserId?: number | null;
};