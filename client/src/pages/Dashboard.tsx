import React from "react";
import { useQuery } from "@tanstack/react-query";
import { ExpenseService } from "../api/expenseService";
import ExpensesDonut from "../components/Charts/ExpensesDonut";

export default function Dashboard() {
  console.log("Dashboard renderizado");
  const last30 = useQuery(["expenses", "last30"], async () => {
    const all = await ExpenseService.getAll();
    // filtrar últimos 30 dias
    const from = new Date();
    from.setDate(from.getDate() - 30);
    return all.filter(e => new Date(e.date) >= from);
  });

  const total30 = last30.data?.reduce((s, e) => s + e.amount, 0) ?? 0;

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
            {last30.isLoading ? <div>Carregando...</div> : <ExpensesDonut expenses={last30.data ?? []} />}
          </div>
        </div>
      </div>

      <div className="card mt-3 p-3">
        <h6>Últimas despesas</h6>
        {/* aqui você pode usar ExpensesTable com getPaged */}
      </div>
    </div>
  );
}
