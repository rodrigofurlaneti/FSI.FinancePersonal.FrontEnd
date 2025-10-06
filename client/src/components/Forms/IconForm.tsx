import React, { useState, useEffect } from "react";
import { IconService } from "../../service/iconService";
import type { CreateIconPayload, Icon } from "../../types/icon";
import type { UseMutationResult } from "@tanstack/react-query";

type Props = {
  onCancel: () => void;
  onSaved: () => void;
  createIconMutation: UseMutationResult<Icon, unknown, CreateIconPayload, unknown>;
  initialData?: Partial<CreateIconPayload>;
};

export default function IconForm({ onCancel, onSaved, createIconMutation, initialData }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [library, setLibrary] = useState(initialData?.library?.toString() ?? "");
  const [defaultProps, setDefaultProps] = useState(initialData?.defaultProps?.toString()  ?? "");
  const [title, setTitle] = useState(initialData?.title?.toString() ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    IconService.getAll().then();
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setLibrary(initialData.library?.toString() ?? "");
      setDefaultProps(initialData.defaultProps?.toString() ?? "");
      setTitle(initialData.title?.toString() ?? "");
    } else {
      setName("");
      setLibrary("");
      setDefaultProps("");
      setTitle("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) { alert("Informe o nome do icone"); return; }
    if (!library.trim()) { alert("Informe nome da biblioteca"); return; }
    if (!defaultProps.trim()) { alert("Informe os adereços padrão"); return; }
    if (!title.trim()) { alert("Informe os título"); return; }

    const payload: CreateIconPayload = {
      name: name.trim(),
      library: library.trim(),
      defaultProps: defaultProps.trim(),
      title: title.trim()
    };

    try {
      setSubmitting(true);

      if ((createIconMutation as any).mutateAsync) {
        await (createIconMutation as any).mutateAsync(payload);
      } else {

        await new Promise<void>((resolve, reject) => {
          createIconMutation.mutate(payload, {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          });
        });
      }
      onSaved();
    } catch (err) {
      console.error("Erro ao salvar despesa:", err);
      alert("Erro ao salvar despesa");
    } finally {
      setSubmitting(false);
    }
  };

  const loading = submitting;

  return (
    <form onSubmit={handleSubmit}>
<div className="mb-3">
        <label>Nome</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Valor</label>
        <input
          type="text"
          className="form-control"
          value={library}
          onChange={e => setLibrary(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Data de Vencimento</label>
        <input
          type="text"
          className="form-control"
          value={defaultProps}
          onChange={e => setDefaultProps(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Title</label>
        <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
        />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}