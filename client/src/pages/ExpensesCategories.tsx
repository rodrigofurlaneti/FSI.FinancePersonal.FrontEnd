// src/pages/ExpensesCategories.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryExpenseService } from "../service/categoryExpenseService";
import ExpensesCategoriesTable from "../components/Table/ExpensesCategoriesTable";
import type { ExpenseCategory } from "../types/expenseCategory";

export default function ExpensesCategoriesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  // Busca paginada das categorias
  const { data, isLoading } = useQuery({
    queryKey: ["expenseCategories", page, pageSize],
    queryFn: () => CategoryExpenseService.getPaged(page, pageSize),
    keepPreviousData: true,
  });

  // Mutação para deletar categoria
  const deleteMutation = useMutation({
    mutationFn: (id: number) => CategoryExpenseService.remove(id),
    onSuccess: () => {
      // Invalida a query da página atual para refazer a busca
      queryClient.invalidateQueries(["expenseCategories", page, pageSize]);
      // opcional: invalidar listas "all" ou outras queries que dependem de categorias
      queryClient.invalidateQueries(["expenseCategories", "all"]);
    },
  });

  // Compatibilidade com diferentes formatos de PagedResult (totalItems | total)
  const totalItems = data ? (data.totalItems ?? data.total ?? 0) : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handleNextPage = () => {
    setPage((p) => (p < totalPages ? p + 1 : p));
  };

  const handlePrevPage = () => {
    setPage((p) => (p > 1 ? p - 1 : p));
  };

  return (
    <div className="container py-3">
      <h3>Categorias de Despesa</h3>

      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <ExpensesCategoriesTable
            items={data?.items ?? ([] as ExpenseCategory[])}
            page={data?.page ?? page}
            pageSize={data?.pageSize ?? pageSize}
            total={totalItems}
            onEdit={(c) => console.log("editar", c)}
            onDelete={(id) => deleteMutation.mutate(id)}
          />

          <div className="d-flex justify-content-between align-items-center">
            <div>
              Mostrando {data?.items.length ?? 0} de {totalItems}
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}