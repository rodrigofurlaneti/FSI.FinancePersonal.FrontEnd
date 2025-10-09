import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
} from "recharts";
import type { Expense } from "../../types/expense";
import type { ExpenseCategory } from "../../types/expenseCategory";
import type { Icon } from "../../types/icon";
import { CategoryExpenseService } from "../../service/categoryExpenseService";
import { IconService } from "../../service/iconService";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28BFF",
  "#FF6699",
];

type Props = Readonly<{
  expenses: Expense[];
}>;

function CustomTooltip({
  active,
  payload,
  total,
}: {
  active?: boolean;
  payload?: any[];
  total: number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  const value = Number(p.value ?? 0);
  const percent = total > 0 ? (value / total) * 100 : 0;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #eee",
        padding: 8,
        borderRadius: 6,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontWeight: 600 }}>{p.name}</div>
      <div>
        {value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}{" "}
        • {percent.toFixed(2)}%
      </div>
    </div>
  );
}

function renderActiveShape(props: any) {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 12) * cos;
  const sy = cy + (outerRadius + 12) * sin;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy} dy={6} textAnchor="middle" fill="#333" fontSize={12}>
        {payload.name}
      </text>
      <text
        x={sx}
        y={sy}
        textAnchor={cos >= 0 ? "start" : "end"}
        fill="#666"
        fontSize={11}
      >
        {value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </text>
    </g>
  );
}

export default function ExpensesDonutResponsive({ expenses }: Props) {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [cats, iconsResult] = await Promise.all([
          CategoryExpenseService.getAll(),
          IconService.getAll(),
        ]);
        if (!mounted) return;
        setCategories(cats ?? []);
        setIcons(iconsResult ?? []);
      } catch (e) {
        console.error("Erro ao carregar categorias ou ícones:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        setContainerWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const data = useMemo(() => {
    const map = new Map<string, number>();
    const categoriesMap = new Map<string, string>(
      categories.map((c) => [String(c.id), c.name ?? `Categoria #${c.id}`])
    );

    for (const e of expenses ?? []) {
      const name =
        e.expenseCategoryId != null
          ? categoriesMap.get(String(e.expenseCategoryId)) ??
            `Categoria #${e.expenseCategoryId}`
          : "Sem categoria";

      const amount = Number(e.amount) || 0;
      map.set(name, (map.get(name) ?? 0) + amount);
    }

    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [expenses, categories]);

  const total = useMemo(
    () => data.reduce((acc, cur) => acc + Number(cur.value || 0), 0),
    [data]
  );

  if (!data || data.length === 0 || total === 0) {
    return <div style={{ padding: 12 }}>Nenhuma despesa para mostrar</div>;
  }

    const wrapperStyle: React.CSSProperties = {
        width: "80%",
        maxWidth: "400px",
        height: 300,          // altura fixa para o contêiner pai
        overflow: "visible",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

  const { innerRadius, outerRadius } = useMemo(() => {
    const w = containerWidth || 300;
    const i = Math.round(Math.max(20, Math.min(60, w * 0.3)));
    const o = Math.round(Math.max(i + 10, Math.min(100, i + w * 0.4)));
    return { innerRadius: i, outerRadius: o };
  }, [containerWidth]);

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  return (
    <div ref={containerRef} style={wrapperStyle}>
      <ResponsiveContainer width="100%" height="100%" aspect={1}>
        <PieChart margin={{ top: 40, right: 60, bottom: 40, left: 60 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={4}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            activeShape={activeIndex !== null ? renderActiveShape : undefined}
               label={({
                        cx,
                        cy,
                        midAngle,
                        outerRadius,
                        index,
                        name,
                        percent,
                        }: any) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 20;
                        const offset = -15; 
                        const x = cx + (radius + offset) * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        const maxLength = 30; // pode aumentar para evitar truncar nomes curtos
                        const displayName = name.length > maxLength ? name.slice(0, maxLength) + "..." : name;

                        return (
                            <text
                            x={x}
                            y={y}
                            fill={COLORS[index % COLORS.length]}
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize={12}
                            >
                            <tspan x={x} dy="0">{displayName}</tspan>
                            <tspan x={x} dy="1.2em">{(percent * 100).toFixed(1)}%</tspan>
                            </text>
                        );
                        }}
            labelLine={false}
            cx="50%"
            cy="50%"
          >
            {data.map((d, i) => (
              <Cell
                key={d.name}
                fill={COLORS[i % COLORS.length]}
                stroke={activeIndex === i ? "#000" : undefined}
                strokeWidth={activeIndex === i ? 2 : 0}
              />
            ))}
          </Pie>

          <Tooltip
            content={<CustomTooltip total={total} />}
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}