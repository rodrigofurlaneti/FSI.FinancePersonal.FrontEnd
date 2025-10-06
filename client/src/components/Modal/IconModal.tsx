import React from "react";
import IconForm from "../Forms/IconForm";
import type { CreateIconPayload, Icon } from "../../types/icon";
import type { UseMutationResult } from "@tanstack/react-query";

type Props = {
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingIconId?: number;
  createIconMutation: UseMutationResult<Icon, unknown, CreateIconPayload, unknown>;
  initialData?: Partial<CreateIconPayload>;
};

export default function IconModal({
  show,
  onClose,
  onSaved,
  editingIconId,
  createIconMutation,
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
            <h5 className="modal-title">{editingIconId ? "Editar Despesa" : "Nova Despesa"}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <IconForm
              onCancel={onClose}
              onSaved={onSaved}
              createIconMutation={createIconMutation}
              initialData={initialData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}