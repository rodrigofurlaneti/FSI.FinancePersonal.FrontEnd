import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpenseService } from "../api/expenseService";
import ExpensesTable from "../components/Table/ExpensesTable";

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(["expenses", page, pageSize], () => ExpenseService.getPaged(page, pageSize), {
    keepPreviousData: true
  });

  const deleteMutation = useMutation((id: number) => ExpenseService.remove(id), {
    onSuccess: () => queryClient.invalidateQueries(["expenses"])
  });

  return (
    <div className="container py-3">
      <h3>Despesas</h3>
      {isLoading ? <div>Carregando...</div> : (
        <>
          <ExpensesTable
            items={data?.items ?? []}
            page={data?.page ?? page}
            pageSize={data?.pageSize ?? pageSize}
            total={data?.total ?? 0}
            onEdit={(e) => console.log("editar", e)}
            onDelete={(id) => deleteMutation.mutate(id)}
          />

          <div className="d-flex justify-content-between align-items-center">
            <div>Mostrando {data?.items.length ?? 0} de {data?.total ?? 0}</div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => p + 1)}>Próxima</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
