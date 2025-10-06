// src/components/Forms/ExpenseCategoryForm.tsx
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoryExpenseService } from "../../service/categoryExpenseService";
import { IconService } from "../../service/iconService";
import ExpenseCategoryFormContent from "../Content/ExpenseCategoryFormContent";

type Props = {
  id?: number;
  onSaved: () => void;
  onCancel: () => void;
};

type IconItem = {
  id: number;
  name: string;
  library: string;
  defaultProps?: Record<string, any> | null;
  title?: string | null;
};

export default function ExpenseCategoryForm({ id, onSaved, onCancel }: Props) {
  const [name, setName] = useState("");
  const [iconId, setIconId] = useState<number | null>(null);

  // busca todos os ícones (react-query v5: passar um objeto)
  const { data: icons, isLoading: iconsLoading, isError: iconsError } = useQuery<IconItem[]>({
    queryKey: ["icons"],
    queryFn: () => IconService.getAll(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    let mounted = true;
    if (id) {
      CategoryExpenseService.getById(id).then((cat) => {
        if (!mounted) return;
        setName(cat.name ?? "");
        setIconId(cat.icon?.id ?? null);
      }).catch(() => {
        // opcional: tratar erro de fetch da categoria
        if (mounted) {
          setName("");
          setIconId(null);
        }
      });
    } else {
      setName("");
      setIconId(null);
    }
    return () => { mounted = false; };
  }, [id]);

  const createMutation = useMutation({
    mutationFn: (newCategory: { name: string; iconId?: number | null }) =>
      CategoryExpenseService.create(newCategory),
    onSuccess: () => {
      onSaved();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedCategory: { id: number; name: string; iconId?: number | null }) =>
      CategoryExpenseService.update(updatedCategory.id, { name: updatedCategory.name, iconId: updatedCategory.iconId }),
    onSuccess: () => {
      onSaved();
    },
  });

  const isLoading = createMutation.status === "loading" || updateMutation.status === "loading" || iconsLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateMutation.mutate({ id, name, iconId });
    } else {
      createMutation.mutate({ name, iconId });
    }
  };

  // opcional: mensagem de erro caso falhe ao carregar icons
  if (iconsError) {
    // você pode retornar um UI de erro ou apenas continuar com lista vazia
    console.warn("Falha ao carregar ícones");
  }

  return (
    <ExpenseCategoryFormContent
      name={name}
      setName={setName}
      iconId={iconId}
      setIconId={setIconId}
      icons={icons ?? []}
      onCancel={onCancel}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      isEditing={!!id}
    />
  );
}
