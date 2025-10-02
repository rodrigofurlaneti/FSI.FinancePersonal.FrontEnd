import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpenseService } from "../service/expenseService";
import { CategoryExpenseService } from "../service/categoryExpenseService";
import ExpensesDonut from "../components/Charts/ExpensesDonut";
import ExpenseCategoriesTable from "../components/Table/ExpensesCategoriesTable";
import ExpenseTable from "../components/Table/ExpensesTable";
import ExpenseCategoryModal from "../components/Modal/ExpenseCategoryModal";
import ExpenseModal from "../components/Modal/ExpenseModal";
import "../styles/dashboard.css";
import type { CreateExpensePayload, Expense } from "../types/expense";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Busca todas as despesas
  const {
    data: expenses = [],
    isLoading: expensesLoading
  } = useQuery<Expense[]>({
    queryKey: ["expenses", "all"],
    queryFn: () => ExpenseService.getAll(),
    retry: false
  });

  // Busca categorias
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["expenseCategories", "all"],
    queryFn: () => CategoryExpenseService.getAll(),
    retry: false
  });

  // Mutação para deletar categoria
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => CategoryExpenseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
  });

  // Mutação para deletar despesa
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: number) => ExpenseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
  });

  // ✅ Mutação para criar despesa
  const createExpenseMutation = useMutation<Expense, unknown, CreateExpensePayload>({
    mutationFn: (newExpense) => ExpenseService.create(newExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setShowExpenseModal(false);
    }
  });

  // Estados para modais e edição
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | undefined>(undefined);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | undefined>(undefined);
  const [initialExpenseData, setInitialExpenseData] = useState<Partial<CreateExpensePayload> | undefined>(undefined);

  // Handlers para abrir modais
  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat.id);
    setShowCategoryModal(true);
  };

  const handleCreateCategory = () => {
    setEditingCategoryId(undefined);
    setShowCategoryModal(true);
  };

const handleEditExpense = async (expense: Expense) => {
  // Se quiser, pode buscar dados completos via API aqui, por exemplo:
  // const fullExpense = await ExpenseService.getById(expense.id);

  setInitialExpenseData({
    name: expense.name,
    amount: expense.amount,
    dueDate: expense.date, // ajuste se necessário para o formato esperado
    description: expense.description ?? "",
    expenseCategoryId: expense.categoryId ?? 0,
  });

  setEditingExpenseId(expense.id);
  setShowExpenseModal(true);
};

const handleCreateExpense = () => {
  setInitialExpenseData(undefined);
  setEditingExpenseId(undefined);
  setShowExpenseModal(true);
};

  // Callbacks após salvar
  const onCategorySaved = async () => {
    await queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    setShowCategoryModal(false);
    setEditingCategoryId(undefined);
  };

  const handleExpenseSaved = () => {
    createExpenseMutation.reset();
    setShowExpenseModal(false);
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  };

  // Calcula total das despesas
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  return (
    <div className="container py-4">
      <div className="row g-3 my-3">
        {/* Total e Últimas Despesas */}
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <div className="text-muted small">Total de Despesas</div>
            <div className="h4">
              {totalExpenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <button className="btn btn-primary" onClick={handleCreateExpense}>
              Nova Despesa
            </button>
          </div>

          <div className="card p-3">
            <div className="text-muted small mb-2">Últimas Despesas</div>
            {expensesLoading ? (
              <div>Carregando gráfico...</div>
            ) : (
              <ExpensesDonut expenses={expenses} />
            )}
          </div>
        </div>

        {/* Categorias */}
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Categorias</div>
                <div className="h4">{categories?.length ?? 0}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-primary" onClick={handleCreateCategory}>
                  Nova categoria
                </button>
              </div>
            </div>

            <div className="mt-3">
              {categoriesLoading ? (
                <div>Carregando...</div>
              ) : (
                <ExpenseCategoriesTable
                  items={categories ?? []}
                  page={1}
                  pageSize={5}
                  total={categories?.length ?? 0}
                  onEdit={handleEditCategory}
                  onDelete={(id) => deleteCategoryMutation.mutate(id)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Despesas */}
        <div className="col-md-12">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="text-muted small">Despesas</div>
                <div className="h4">{expenses?.length ?? 0}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-primary" onClick={handleCreateExpense}>
                  Nova despesa
                </button>
              </div>
            </div>

            {expensesLoading ? (
              <div>Carregando...</div>
            ) : (
              <ExpenseTable
                items={expenses ?? []}
                page={1}
                pageSize={5}
                total={expenses?.length ?? 0}
                onEdit={handleEditExpense}
                onDelete={(id) => deleteExpenseMutation.mutate(id)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal para criar/editar categoria */}
      <ExpenseCategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSaved={onCategorySaved}
        id={editingCategoryId}
      />

      {/* Modal para criar/editar despesa */}
      <ExpenseModal
        show={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSaved={handleExpenseSaved}
        editingExpenseId={editingExpenseId}
        createExpenseMutation={createExpenseMutation}
        initialData={initialExpenseData}
      />
    </div>
  );
}