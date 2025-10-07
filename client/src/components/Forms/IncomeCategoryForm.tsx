// src/components/Forms/IncomeCategoryForm.tsx
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoryIncomeService } from "../../service/categoryIncomeService";
import { IconService } from "../../service/iconService";
import IncomeCategoryFormContent from "../Content/IncomeCategoryFormContent";

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

export default function IncomeCategoryForm({ id, onSaved, onCancel }: Props) {
  const [name, setName] = useState("");
  const [iconId, setIconId] = useState<number | null>(null);

  // busca todos os ícones
  const { data: icons, isLoading: iconsLoading, isError: iconsError } = useQuery<IconItem[]>({
    queryKey: ["icons"],
    queryFn: () => IconService.getAll(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    let mounted = true;
    if (id) {
      CategoryIncomeService.getById(id)
        .then((cat) => {
          if (!mounted) return;
          setName(cat.name ?? "");
          setIconId(cat.icon?.id ?? null);
        })
        .catch(() => {
          if (mounted) {
            setName("");
            setIconId(null);
          }
        });
    } else {
      setName("");
      setIconId(null);
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  // Tipagem genérica nas mutações: <TData, TError, TVariables>
  const createMutation = useMutation<
    unknown,
    Error,
    { name: string; iconId?: number | null }
  >({
    mutationFn: (newCategory) => CategoryIncomeService.create(newCategory),
    onSuccess: () => {
      onSaved();
    },
  });

  const updateMutation = useMutation<
    unknown,
    Error,
    { id: number; name: string; iconId?: number | null }
  >({
    mutationFn: (updatedCategory) =>
      CategoryIncomeService.update(updatedCategory.id, {
        name: updatedCategory.name,
        iconId: updatedCategory.iconId,
      }),
    onSuccess: () => {
      onSaved();
    },
  });

  // usar os booleans isLoading de react-query v5
  const isLoading = createMutation.isLoading || updateMutation.isLoading || iconsLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      updateMutation.mutate({ id, name, iconId });
    } else {
      createMutation.mutate({ name, iconId });
    }
  };

  if (iconsError) {
    console.warn("Falha ao carregar ícones");
    // opcional: retornar UI de erro
  }

  return (
    <IncomeCategoryFormContent
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
