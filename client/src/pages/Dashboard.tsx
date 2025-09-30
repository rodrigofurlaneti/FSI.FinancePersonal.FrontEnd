// src/pages/Dashboard.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpenseService } from "../service/expenseService";
import ExpensesDonut from "../components/Charts/ExpensesDonut";
import "../styles/dashboard.css";

function parseExpenseDate(e: any): Date | null {
  // tenta várias chaves comuns que o backend pode retornar
  const dateStr = e.date ?? e.dueDate ?? e.createdAt ?? e.transactionDate;
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export default function Dashboard() {
  console.log("Dashboard renderizado");

  const last30 = useQuery({
    queryKey: ["expenses", "last30"],
    queryFn: async () => {
      const all = await ExpenseService.getAll();
      console.log("Dados brutos recebidos:", all);

      // filtrar últimos 30 dias
      const from = new Date();
      from.setDate(from.getDate() - 30);

      const filtered = all.filter(e => {
        const date = parseExpenseDate(e);
        if (!date) {
          console.warn("Data inválida ou ausente para item:", e);
          return false;
        }
        return date >= from;
      });

      console.log("Despesas filtradas (últimos 30 dias):", filtered);
      return filtered;
    },
    retry: false
  });

  if (last30.error) {
    console.error("Erro ao carregar despesas:", last30.error);
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Erro ao carregar dados: {(last30.error as any)?.message || "Erro desconhecido"}</div>
      </div>
    );
  }

  const total30 = last30.data?.reduce((s, e) => s + (e.amount ?? 0), 0) ?? 0;

  return (
    <div className="container py-4">
      <h2>Dashboard</h2>

      <div className="row g-3 my-3">
        <div className="col-md-4">
          <div className="card p-3">
            <div className="text-muted small">Despesas (30d)</div>
            <div className="h4">{total30.toLocaleString(undefined, { style: "currency", currency: "BRL" })}</div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3">
            <h6>Distribuição por categoria (30d)</h6>
            {last30.isLoading ? (
              <div>Carregando...</div>
            ) : last30.data?.length ? (
              <ExpensesDonut expenses={last30.data} />
            ) : (
              <div className="text-muted">Nenhuma despesa nos últimos 30 dias.</div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-3 p-3">
        <h6>Últimas despesas</h6>
        {last30.isLoading ? (
          <div>Carregando últimas despesas...</div>
        ) : last30.data?.length ? (
          <ul>
            {last30.data.slice(0, 5).map(e => (
              <li key={e.id}>
                {e.name ?? e.description ?? "Sem descrição"} -{" "}
                {parseExpenseDate(e)?.toLocaleDateString() ?? "data inválida"} -{" "}
                {(e.amount ?? 0).toLocaleString(undefined, { style: "currency", currency: "BRL" })}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted">Nenhuma despesa registrada.</div>
        )}
      </div>
    </div>
  );
}