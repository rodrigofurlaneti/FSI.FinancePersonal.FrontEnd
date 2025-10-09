import React from "react";
import ExpensesDonutResponsive from "../Responsive/ExpensesDonutResponsive";
import type { Expense } from "../../types/expense";

interface Props {
  expenses: Expense[];
  height?: number;
}

export default function ExpensesDonut({ expenses, height }: Props) {
  return <ExpensesDonutResponsive expenses={expenses} />;
}