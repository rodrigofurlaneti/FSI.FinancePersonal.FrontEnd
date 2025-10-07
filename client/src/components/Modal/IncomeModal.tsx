import React from "react";
import IncomeForm from "../Forms/IncomeForm";
import type { CreateIncomePayload, Income } from "../../types/income";
import type { UseMutationResult } from "@tanstack/react-query";

type Props = {
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingIncomeId?: number;
  createIncomeMutation: UseMutationResult<Income, unknown, CreateIncomePayload, unknown>;
  initialData?: Partial<CreateIncomePayload>;
};

export default function IncomeModal({
  show,
  onClose,
  onSaved,
  editingIncomeId,
  createIncomeMutation,
  initialData,
}: Props) {
  if (!show) return null;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="modal fade show"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1050,
        padding: "1rem",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "500px", width: "100%" }}
        onClick={stopPropagation}
      >
        <div
          className="modal-content"
          style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.3rem" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">{editingIncomeId ? "Editar Despesa" : "Nova Despesa"}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <IncomeForm
              onCancel={onClose}
              onSaved={onSaved}
              createIncomeMutation={createIncomeMutation}
              initialData={initialData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}