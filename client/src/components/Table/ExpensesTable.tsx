import React, { useEffect, useState } from "react";
import type { Expense } from "../../types/expense";
import type { ExpenseCategory } from "../../types/expenseCategory";
import type { Icon } from "../../types/icon";

import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as Io5Icons from "react-icons/io5";
import * as TbIcons from "react-icons/tb";
import * as GiIcons from "react-icons/gi";

import IconService from "../../service/iconService";
import ExpenseCategoryService from "../../service/categoryExpenseService"; 

type Props = {
  items: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: number) => void;
};

export default function ExpensesTable({ items, onEdit, onDelete }: Props) {
  const [iconsMap, setIconsMap] = useState<Record<number, Icon>>({});
  const [categoriesMap, setCategoriesMap] = useState<Record<number, ExpenseCategory>>({});

  useEffect(() => {
    async function fetchIcons() {
      try {
        const icons = await IconService.getAll();
        const map: Record<number, Icon> = {};
        icons.forEach(icon => {
          map[icon.id] = icon;
        });
        setIconsMap(map);
      } catch (error) {
        console.error("Erro ao buscar ícones:", error);
      }
    }
    fetchIcons();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const uniqueCategoryIds = Array.from(new Set(items.map(i => i.expenseCategoryId).filter(Boolean) as number[]));
      const newCategoriesMap: Record<number, ExpenseCategory> = { ...categoriesMap };

      await Promise.all(uniqueCategoryIds.map(async (id) => {
        if (!newCategoriesMap[id]) {
          try {
            const category = await ExpenseCategoryService.getById(id);
            newCategoriesMap[id] = category;
          } catch (error) {
            console.error(`Erro ao buscar categoria id=${id}`, error);
          }
        }
      }));

      setCategoriesMap(newCategoriesMap);
    }

    fetchCategories();
  }, [items]);

  function renderIcon(iconId?: number | string | null) {
    if (!iconId) return <span>❓</span>;
    const icon = iconsMap[Number(iconId)];
    if (!icon) return <span>❓</span>;

    let IconComponent: React.ComponentType<any> | undefined;
    switch (icon.library.toLowerCase()) {
      case "md":
        IconComponent = (MdIcons as any)[icon.name];
        break;
      case "fa":
        IconComponent = (FaIcons as any)[icon.name];
        break;
      case "ai":
        IconComponent = (AiIcons as any)[icon.name];
        break;
      case "io5":
        IconComponent = (Io5Icons as any)[icon.name];
        break;
      case "tb":
        IconComponent = (TbIcons as any)[icon.name];
        break;
      case "gi":
        IconComponent = (GiIcons as any)[icon.name];
        break;
      default:
        IconComponent = undefined;
    }

    if (!IconComponent) return <span>❓</span>;

    let props = {};
    if (icon.defaultProps) {
      try {
        props = JSON.parse(icon.defaultProps);
      } catch {
        props = {};
      }
    }

    return <IconComponent {...props} title={icon.title || icon.name} size={24} />;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nome</th>
            <th>Ícone da categoria</th>
            <th>Nome da categoria</th>
            <th>Data do vencimento</th>
            <th>Data do pagamento</th>
            <th className="text-end">Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => {
            const category = it.expenseCategoryId ? categoriesMap[it.expenseCategoryId] : undefined;
            return (
              <tr key={it.id}>
                <td>{it.name}</td>
                <td style={{ textAlign: "center" }}>
                  {renderIcon(category?.iconId)}
                </td>
                <td>{category?.name ?? "-"}</td>
                <td>{new Date(it.dueDate).toLocaleDateString()}</td>
                <td>{it.paidAt ? new Date(it.paidAt).toLocaleDateString() : "-"}</td>
                <td className="text-end">
                  {it.amount.toLocaleString(undefined, { style: "currency", currency: "BRL" })}
                </td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(it)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(it.id)}>Remover</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}