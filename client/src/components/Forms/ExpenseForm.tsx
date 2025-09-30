import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpenseService } from "../../service/expenseService";

export default function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newExpense: { amount: number; description: string }) =>
      ExpenseService.create(newExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const isLoading = mutation.status === "loading";
  const isError = mutation.status === "error";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ amount: parseFloat(amount), description });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar"}
      </button>
      {isError && <p>Erro ao salvar despesa.</p>}
    </form>
  );
}