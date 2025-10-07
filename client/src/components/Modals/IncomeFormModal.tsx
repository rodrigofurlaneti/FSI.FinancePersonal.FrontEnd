// src/components/Forms/IncomeCategoryModal.tsx
import React from "react";
import IncomeCategoryForm from "../Forms/IncomeCategoryForm";

type Props = {
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
  id?: number;
};

export default function IncomeCategoryModal({ show, onClose, onSaved, id }: Props) {
  if (!show) return null;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1050,
        overflowY: "auto",
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "500px", margin: "1.75rem auto" }}
        onClick={stopPropagation}
      >
        <div
          className="modal-content"
          style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.3rem" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">{id ? "Editar Categoria" : "Nova Categoria"}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <IncomeCategoryForm
              id={id}
              onCancel={onClose}
              onSaved={onSaved}
            />
          </div>
        </div>
      </div>
    </div>
  );
}