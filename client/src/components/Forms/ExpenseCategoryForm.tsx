// src/components/Forms/ExpenseCategoryForm.tsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { CategoryExpenseService } from "../../service/categoryExpenseService";
import ExpenseCategoryFormContent  from "../Content/ExpenseCategoryFormContent";

type Props = {
  id?: number;
  onSaved: () => void;
  onCancel: () => void;
};

export default function ExpenseCategoryForm({ id, onSaved, onCancel }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (id) {
      CategoryExpenseService.getById(id).then(cat => {
        setName(cat.name);
      });
    } else {
      setName("");
    }
  }, [id]);

  const createMutation = useMutation({
    mutationFn: (newCategory: { name: string }) => CategoryExpenseService.create(newCategory),
    onSuccess: () => {
      onSaved();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updatedCategory: { id: number; name: string }) =>
      CategoryExpenseService.update(updatedCategory.id, { name: updatedCategory.name }),
    onSuccess: () => {
      onSaved();
    }
  });

  const isLoading =
    createMutation.status === "loading" || updateMutation.status === "loading";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateMutation.mutate({ id, name });
    } else {
      createMutation.mutate({ name });
    }
  };

  return (
    <ExpenseCategoryFormContent
      name={name}
      setName={setName}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={!!id}
    />
  );
}