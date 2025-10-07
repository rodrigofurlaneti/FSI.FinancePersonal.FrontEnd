import React, { useEffect, useState } from "react";
import type { IncomeCategory } from "../../types/incomeCategory";
import type { Icon } from "../../types/icon";

import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as Io5Icons from "react-icons/io5";  // import para io5
import * as TbIcons from "react-icons/tb";    // import para tb
import * as GiIcons from "react-icons/gi";    // import para gi

import IconService from "../../service/iconService"; // ajuste o caminho conforme seu projeto

type Props = {
  items: IncomeCategory[];
  onEdit: (c: IncomeCategory) => void;
  onDelete: (id: number) => void;
};

export default function IncomesCategoriesTable({ items, onEdit, onDelete }: Props) {
  const [iconsMap, setIconsMap] = useState<Record<number, Icon>>({});

  useEffect(() => {
    async function fetchIcons() {
      try {
        const icons = await IconService.getAll();
        console.log("Ícones carregados:", icons);
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

  function renderIcon(iconId?: number | string | null) {
    if (!iconId) return <span>❓</span>;
    const icon = iconsMap[Number(iconId)];
    console.log("Renderizando ícone para id:", iconId, icon);
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

    if (!IconComponent) {
      console.warn(`Ícone não encontrado: biblioteca=${icon.library} nome=${icon.name}`);
      return <span>❓</span>;
    }

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
            <th>Ícone</th>
            <th>Nome</th>
            <th className="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={3}>Nenhuma categoria encontrada.</td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id}>
                <td style={{ textAlign: "center" }}>{renderIcon(it.iconId)}</td>
                <td>{it.name}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(it)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(it.id)}>Remover</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}