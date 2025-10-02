// src/components/Table/ExpensesCategoriesTable.tsx
import React from "react";
import type { ExpenseCategory } from "../../types/expenseCategory";

type Props = {
  items: ExpenseCategory[];
  page: number;
  pageSize: number;
  total: number;
  onEdit: (c: ExpenseCategory) => void;
  onDelete: (id: number) => void;
};

export default function ExpensesCategoriesTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nome</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={2}>Nenhuma categoria encontrada.</td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id}>
                <td>{it.name}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => onEdit(it)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(it.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}