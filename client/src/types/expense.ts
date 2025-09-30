// src/types/expense.ts
// Tipos/DTOs usados pelo frontend para trabalhar com despesas (create/update/list)

export type Expense = {
  id: number;
  name: string;
  amount: number;         // manter como number aqui (pode enviar como number ou string no payload)
  date: string;           // ISO date string (ex: "2025-09-30T17:30:00Z")
  categoryId?: number;
  description?: string | null;
  paidAt?: string | null; // ISO date string or null
  userId?: number;        // apenas leitura no frontend (backend extrai do JWT)
};

// Resultado paginado genérico
export type PagedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

// Payload enviado ao backend para criar uma despesa.
// NÃO incluir userId (o backend preenche esse valor a partir do JWT).
export type CreateExpensePayload = {
  name: string;
  amount: number | string;        // number recomendado; string se precisar preservar precisão
  dueDate: string;                // ISO date string
  description?: string | null;
  paidAt?: string | null;         // ISO date string or null
  expenseCategoryId: number;
  createdAtUserId?: number | null; // normalmente não enviado pelo frontend
  updatedAtUserId?: number | null;
};

// Payload enviado ao backend para atualizar uma despesa.
// O ID da despesa é passado pela URL (PUT /api/Expense/{id}), portanto
// não incluir o Id no corpo aqui.
export type UpdateExpensePayload = {
  name: string;
  amount: number | string;
  dueDate: string;
  description?: string | null;
  paidAt?: string | null;
  expenseCategoryId: number;
  updatedAtUserId?: number | null;
};