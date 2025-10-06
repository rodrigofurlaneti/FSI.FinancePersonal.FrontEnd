// src/components/Content/ExpenseCategoryFormContent.tsx
import React from "react";
import IconPreview from "../Shared/IconPreview"; // ajuste o path se necessário

type IconItem = {
  id: number;
  name: string;
  library: string;
  defaultProps?: Record<string, any> | null;
  title?: string | null;
};

type Props = {
  name: string;
  setName: (v: string) => void;
  iconId: number | null;
  setIconId: (id: number | null) => void;
  icons: IconItem[];
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
};

export default function ExpenseCategoryFormContent({
  name,
  setName,
  iconId,
  setIconId,
  icons,
  onCancel,
  onSubmit,
  isLoading,
  isEditing,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Nome</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da categoria"
          required
        />
      </div>

      <div className="form-group" style={{ marginTop: 12 }}>
        <label>Ícone</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            className="form-control"
            value={iconId ?? ""}
            onChange={(e) => setIconId(e.target.value ? Number(e.target.value) : null)}
            style={{ flex: 1 }}
          >
            <option value="">-- usar padrão / sem ícone --</option>
            {icons.map((ic) => (
              <option key={ic.id} value={ic.id}>
                {ic.title ?? ic.name}
              </option>
            ))}
          </select>

          <div style={{ width: 40, height: 40, display: "grid", placeItems: "center" }}>
            {iconId ? (
              <IconPreview
                library={icons.find((x) => x.id === iconId)?.library}
                name={icons.find((x) => x.id === iconId)?.name}
                props={icons.find((x) => x.id === iconId)?.defaultProps ?? undefined}
                size={24}
              />
            ) : (
              <div style={{ opacity: 0.5 }}>—</div>
            )}
          </div>
        </div>
        <small className="form-text text-muted">Escolha um ícone para essa categoria.</small>
      </div>

      <div className="form-actions" style={{ marginTop: 16 }}>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isEditing ? "Salvar" : "Criar"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={isLoading}
          style={{ marginLeft: 8 }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
