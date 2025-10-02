import React from "react";
import type { Expense } from "../../types/expense";

type Props = {
  items: Expense[];
  page: number;
  pageSize: number;
  total: number;
  onEdit: (e: Expense) => void;
  onDelete: (id: number) => void;
};

export default function ExpensesTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Data</th>
            <th className="text-end">Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>{it.name}</td>
              <td>{it.categoryId ?? "-"}</td>
              <td>{new Date(it.date).toLocaleDateString()}</td>
              <td className="text-end">{it.amount.toLocaleString(undefined, { style: "currency", currency: "BRL" })}</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(it)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(it.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
