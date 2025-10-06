import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IconService } from "../service/iconService";
import IconsTable from "../components/Table/IconsTable";

export default function IconsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  // Busca paginada das despesas
  const { data, isLoading } = useQuery({
    queryKey: ["icons", page, pageSize],
    queryFn: () => IconService.getPaged(page, pageSize),
    keepPreviousData: true, // mantém dados antigos enquanto carrega novos
  });

  // Mutação para deletar despesa
  const deleteMutation = useMutation({
    mutationFn: (id: number) => IconService.remove(id),
    onSuccess: () => {
      // Invalida a query da página atual para refazer a busca
      queryClient.invalidateQueries(["icons", page, pageSize]);
    },
  });

  // Função para ir para a próxima página, limitando pelo total de páginas
  const totalPages = data ? Math.ceil(data.totalItems / pageSize) : 1;

  const handleNextPage = () => {
    setPage((p) => (p < totalPages ? p + 1 : p));
  };

  const handlePrevPage = () => {
    setPage((p) => (p > 1 ? p - 1 : p));
  };

  return (
    <div className="container py-3">
      <h3>Despesas</h3>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <IconsTable
            items={data?.items ?? []}
            page={data?.page ?? page}
            pageSize={data?.pageSize ?? pageSize}
            total={data?.totalItems ?? 0}
            onEdit={(e) => console.log("editar", e)}
            onDelete={(id) => deleteMutation.mutate(id)}
          />

          <div className="d-flex justify-content-between align-items-center">
            <div>
              Mostrando {data?.items.length ?? 0} de {data?.totalItems ?? 0}
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Anterior
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}