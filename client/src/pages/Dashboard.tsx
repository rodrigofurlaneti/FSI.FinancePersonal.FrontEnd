import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExpenseService } from "../service/expenseService";
import { CategoryExpenseService } from "../service/categoryExpenseService";
import ExpensesDonut from "../components/Charts/ExpensesDonut";
import ExpenseCategoriesTable from "../components/Table/ExpensesCategoriesTable";
import ExpenseTable from "../components/Table/ExpensesTable";
import ExpenseCategoryModal from "../components/Modal/ExpenseCategoryModal";
import ExpenseModal from "../components/Modal/ExpenseModal";

import { IncomeService } from "../service/incomeService";
import { CategoryIncomeService } from "../service/categoryIncomeService";
import IncomesDonut from "../components/Charts/IncomesDonut";
import IncomeCategoriesTable from "../components/Table/IncomesCategoriesTable";
import IncomeTable from "../components/Table/IncomesTable";
import IncomeCategoryModal from "../components/Modal/IncomeCategoryModal";
import IncomeModal from "../components/Modal/IncomeModal";

import "../styles/dashboard.css";
import type { CreateExpensePayload, Expense } from "../types/expense";
import type { CreateIncomePayload, Income } from "../types/income";

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

    // Busca todas as rendas
  const {
    data: incomes = [],
    isLoading: incomesLoading
  } = useQuery<Income[]>({
    queryKey: ["incomes", "all"],
    queryFn: () => IncomeService.getAll(),
    retry: false
  });

  // Busca categorias de despesa
  const { data: categoriesExpense, isLoading: categoriesExpenseLoading } = useQuery({
    queryKey: ["expenseCategories", "all"],
    queryFn: () => CategoryExpenseService.getAll(),
    retry: false
  });

    // Busca categorias de renda
  const { data: categoriesIncome, isLoading: categoriesIncomeLoading } = useQuery({
    queryKey: ["incomeCategories", "all"],
    queryFn: () => CategoryIncomeService.getAll(),
    retry: false
  });

  // Mutação para deletar categoria despesa
  const deleteCategoryExpenseMutation = useMutation({
    mutationFn: (id: number) => CategoryExpenseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    }
  });

  // Mutação para deletar categoria despesa
  const deleteCategoryIncomeMutation = useMutation({
    mutationFn: (id: number) => CategoryIncomeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomeCategories"] });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
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

  // Mutação para deletar renda
  const deleteIncomeMutation = useMutation({
    mutationFn: (id: number) => IncomeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomeCategories"] });
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
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

    // ✅ Mutação para criar renda
  const createIncomeMutation = useMutation<Income, unknown, CreateIncomePayload>({
    mutationFn: (newIncome) => IncomeService.create(newIncome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      setShowIncomeModal(false);
    }
  });

  // Estados para modais e edição
  // Despesas
  const [showCategoryExpenseModal, setShowCategoryExpenseModal] = useState(false);
  const [editingCategoryExpenseId, setEditingCategoryExpenseId] = useState<number | undefined>(undefined);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<number | undefined>(undefined);
  const [initialExpenseData, setInitialExpenseData] = useState<Partial<CreateExpensePayload> | undefined>(undefined);

  // Renda
  const [showCategoryIncomeModal, setShowCategoryIncomeModal] = useState(false);
  const [editingCategoryIncomeId, setEditingCategoryIncomeId] = useState<number | undefined>(undefined);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState<number | undefined>(undefined);
  const [initialIncomeData, setInitialIncomeData] = useState<Partial<CreateIncomePayload> | undefined>(undefined);

  // Handlers para abrir modais
  // Despesa
  const handleEditCategoryExpense = (cat: any) => {
    setEditingCategoryExpenseId(cat.id);
    setShowCategoryExpenseModal(true);
  };

  const handleCreateCategoryExpense = () => {
    setEditingCategoryExpenseId(undefined);
    setShowCategoryExpenseModal(true);
  };

  // Handlers para abrir modais
  // Renda
  const handleEditCategoryIncome = (cat: any) => {
    setEditingCategoryIncomeId(cat.id);
    setShowCategoryIncomeModal(true);
  };

  const handleCreateCategoryIncome = () => {
    setEditingCategoryIncomeId(undefined);
    setShowCategoryIncomeModal(true);
  };

const handleEditExpense = async (expense: Expense) => {

  setInitialExpenseData({
    name: expense.name,
    amount: expense.amount,
    dueDate: expense.dueDate, 
    paidAt: expense.paidAt,
    description: expense.description ?? "",
    expenseCategoryId: expense.expenseCategoryId ?? 0,
  });

  setEditingExpenseId(expense.id);
  setShowExpenseModal(true);
};

const handleEditIncome = async (income: Income) => {

  setInitialIncomeData({
    name: income.name,
    amount: income.amount,
    incomeDate: income.incomeDate, 
    description: income.description ?? "",
    incomeCategoryId: income.incomeCategoryId ?? 0,
  });

  setEditingIncomeId(income.id);
  setShowIncomeModal(true);
};

const handleCreateExpense = () => {
  setInitialExpenseData(undefined);
  setEditingExpenseId(undefined);
  setShowExpenseModal(true);
};

const handleCreateIncome = () => {
  setInitialIncomeData(undefined);
  setEditingIncomeId(undefined);
  setShowIncomeModal(true);
};

  // Callbacks após salvar
  const onCategoryExpenseSaved = async () => {
    await queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    setShowCategoryExpenseModal(false);
    setEditingCategoryExpenseId(undefined);
  };

  const onCategoryIncomeSaved = async () => {
    await queryClient.invalidateQueries({ queryKey: ["incomeCategories"] });
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    setShowCategoryExpenseModal(false);
    setEditingCategoryExpenseId(undefined);
  };

  const handleExpenseSaved = () => {
    createExpenseMutation.reset();
    setShowExpenseModal(false);
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  };

    const handleIncomeSaved = () => {
    createIncomeMutation.reset();
    setShowIncomeModal(false);
    queryClient.invalidateQueries({ queryKey: ["incomes"] });
  };

  // Calcula total das despesas
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);

  const totalIncomes = incomes.reduce((sum, e) => sum + (e.amount ?? 0), 0);

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
                <div style={{ width: "100%", maxWidth: 400, height: 300, margin: "0 auto" }}>
                  <ExpensesDonut expenses={expenses} />
                </div>
            )}
          </div>
        </div>

        {/* Categorias de despesas*/}
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Categorias das despesas</div>
                <div className="h4">{categoriesExpense?.length ?? 0}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-primary" onClick={handleCreateCategoryExpense}>
                  Nova categoria
                </button>
              </div>
            </div>

            <div className="mt-3">
              {categoriesExpenseLoading ? (
                <div>Carregando...</div>
              ) : (
                <ExpenseCategoriesTable
                  items={categoriesExpense ?? []}
                  page={1}
                  pageSize={5}
                  total={categoriesExpense?.length ?? 0}
                  onEdit={handleEditCategoryExpense}
                  onDelete={(id) => deleteCategoryExpenseMutation.mutate(id)}
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

        {/* Total e Últimas Rendas */}
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <div className="text-muted small">Total de Rendas</div>
            <div className="h4">
              {totalIncomes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <button className="btn btn-primary" onClick={handleCreateIncome}>
              Nova Renda
            </button>
          </div>

          <div className="card p-3">
            <div className="text-muted small mb-2">Últimas Despesas</div>
            {incomesLoading ? (
              <div>Carregando gráfico...</div>
            ) : (
              <IncomesDonut incomes={incomes} />
            )}
          </div>
        </div>
 
       {/* Categorias  das rendas*/}
        <div className="col-md-6">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Categorias das rendas</div>
                <div className="h4">{categoriesIncome?.length ?? 0}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-primary" onClick={handleCreateCategoryIncome}>
                  Nova categoria
                </button>
              </div>
            </div>

            <div className="mt-3">
              {categoriesIncomeLoading ? (
                <div>Carregando...</div>
              ) : (
                <IncomeCategoriesTable
                  items={categoriesIncome ?? []}
                  page={1}
                  pageSize={5}
                  total={categoriesIncome?.length ?? 0}
                  onEdit={handleEditCategoryIncome}
                  onDelete={(id) => deleteCategoryIncomeMutation.mutate(id)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Rendas */}
        <div className="col-md-12">
          <div className="card p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="text-muted small">Rendas</div>
                <div className="h4">{incomes?.length ?? 0}</div>
              </div>
              <div>
                <button className="btn btn-sm btn-primary" onClick={handleCreateIncome}>
                  Nova renda
                </button>
              </div>
            </div>

            {incomesLoading ? (
              <div>Carregando...</div>
            ) : (
              <IncomeTable
                items={incomes ?? []}
                page={1}
                pageSize={5}
                total={expenses?.length ?? 0}
                onEdit={handleEditIncome}
                onDelete={(id) => deleteIncomeMutation.mutate(id)}
              />
            )}
          </div>
        </div>

      </div>

      {/* Modal para criar/editar categoria  de despesa*/}
      <ExpenseCategoryModal
        show={showCategoryExpenseModal}
        onClose={() => setShowCategoryExpenseModal(false)}
        onSaved={onCategoryExpenseSaved}
        id={editingCategoryExpenseId}
      />

      {/* Modal para criar/editar categoria  de renda*/}
      <IncomeCategoryModal
        show={showCategoryIncomeModal}
        onClose={() => setShowCategoryIncomeModal(false)}
        onSaved={onCategoryIncomeSaved}
        id={editingCategoryIncomeId}
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

            {/* Modal para criar/editar renda */}
      <IncomeModal
        show={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onSaved={handleIncomeSaved}
        editingIncomeId={editingIncomeId}
        createIncomeMutation={createIncomeMutation}
        initialData={initialIncomeData}
      />
    </div>
  );
}