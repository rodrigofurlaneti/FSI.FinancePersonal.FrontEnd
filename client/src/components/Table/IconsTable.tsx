import React from "react";
import type { Icon } from "../../types/icon";

type Props = {
  items: Icon[];
  page: number;
  pageSize: number;
  total: number;
  onEdit: (e: Icon) => void;
  onDelete: (id: number) => void;
};

export default function IconsTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nome</th>
            <th>Biblioteca</th>
            <th>Adereços padrão</th>
            <th>Título</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id}>
              <td>
                {it.name}
              </td>
              <td>
                {it.library}
              </td>
              <td>
                {it.defaultProps}
              </td>
              <td>
                {it.title}
              </td>
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
