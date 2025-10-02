// src/components/Forms/ExpenseCategoryFormContent.tsx
import React from "react";

type Props = {
  name: string;
  setName: (value: string) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
};

export default function ExpenseCategoryFormContent({
  name,
  setName,
  onCancel,
  onSubmit,
  isLoading,
  isEditing,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Nome
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
          className="form-control"
        />
      </label>
      <div className="mt-3 d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isEditing ? "Salvar" : "Criar"}
        </button>
      </div>
    </form>
  );
}