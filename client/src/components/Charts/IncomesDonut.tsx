import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Income } from "../../types/income";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF", "#FF6699"];

type Props = Readonly<{
  incomes: Income[];
}>;

export default function IncomesDonut({ incomes }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of incomes) {
      const key = e.incomeCategoryId != null ? String(e.incomeCategoryId) : "Sem categoria";
      const amount = Number(e.amount) || 0;
      map.set(key, (map.get(key) ?? 0) + amount);
    }
    return Array.from(map.entries()).map(([k, v]) => ({ name: k, value: v }));
  }, [incomes]);

  if (!data || data.length === 0) {
    return <div style={{ padding: 12 }}>Nenhuma despesa para mostrar</div>;
  }

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString(undefined, { style: "currency", currency: "BRL" })
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}