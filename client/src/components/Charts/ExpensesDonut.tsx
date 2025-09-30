import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Expense } from "../../api/expenseService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF", "#FF6699"];

type Props = Readonly<{
  expenses: Expense[];
}>;

export default function ExpensesDonut({ expenses }: Props) {
  const data = useMemo(() => {
    const map = new Map<number | string, number>();
    for (const e of expenses) {
      const key = e.categoryId ?? "Sem categoria";
      map.set(key, (map.get(key) ?? 0) + e.amount);
    }
    return Array.from(map.entries()).map(([k, v]) => ({ name: String(k), value: v }));
  }, [expenses]);

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
            {data.map((d) => (
              // use `d.name` como key para evitar usar índice
              <Cell key={d.name} fill={COLORS[data.indexOf(d) % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value.toLocaleString(undefined, { style: "currency", currency: "BRL" })} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}