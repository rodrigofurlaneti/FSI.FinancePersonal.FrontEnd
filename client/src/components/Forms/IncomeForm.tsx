import React, { useState, useEffect } from "react";
import { CategoryIncomeService } from "../../service/categoryIncomeService";
import type { CreateIncomePayload, Income } from "../../types/expense";
import type { UseMutationResult } from "@tanstack/react-query";

type Props = {
  onCancel: () => void;
  onSaved: () => void;
  createIncomeMutation: UseMutationResult<Income, unknown, CreateIncomePayload, unknown>;
  initialData?: Partial<CreateIncomePayload>;
};

export default function IncomeForm({ onCancel, onSaved, createIncomeMutation, initialData }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [expenseCategoryId, setIncomeCategoryId] = useState<number | "">(initialData?.expenseCategoryId ?? "");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    CategoryIncomeService.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setAmount(initialData.amount?.toString() ?? "");
      setDueDate(initialData.dueDate ?? "");
      setDescription(initialData.description ?? "");
      setIncomeCategoryId(initialData.expenseCategoryId ?? "");
    } else {
      setName("");
      setAmount("");
      setDueDate("");
      setDescription("");
      setIncomeCategoryId("");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) { alert("Informe o nome da despesa"); return; }
    if (!amount || isNaN(Number(amount))) { alert("Informe um valor válido"); return; }
    if (!dueDate) { alert("Informe a data de vencimento"); return; }
    if (!expenseCategoryId) { alert("Selecione uma categoria"); return; }

    const payload: CreateIncomePayload = {
      name: name.trim(),
      amount: Number(amount),
      dueDate,
      description: description.trim() || null,
      expenseCategoryId,
    };

    try {
      setSubmitting(true);
      // usar mutateAsync garante promise e facilita tratamento de erro/sucesso
      if ((createIncomeMutation as any).mutateAsync) {
        await (createIncomeMutation as any).mutateAsync(payload);
      } else {
        // fallback para mutate com callback
        await new Promise<void>((resolve, reject) => {
          createIncomeMutation.mutate(payload, {
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
          type="number"
          step="0.01"
          className="form-control"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Data de Vencimento</label>
        <input
          type="date"
          className="form-control"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label>Categoria</label>
        <select
          className="form-select"
          value={expenseCategoryId}
          onChange={e => setIncomeCategoryId(Number(e.target.value))}
          required
        >
          <option value="">Selecione</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Descrição</label>
        <textarea
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
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