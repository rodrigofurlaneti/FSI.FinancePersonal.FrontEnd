import React from "react";
import type { TooltipProps } from "recharts";

interface PayloadItem {
  payload: {
    name: string;
    value: number;
    [key: string]: any;
  };
  value: number;
  name: string;
}

interface CustomTooltipProps extends TooltipProps<any, any> {
  total: number;
  payload?: PayloadItem[]; // tipagem explícita para payload
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percent = total > 0 ? ((Number(data.value) / total) * 100).toFixed(2) : "0.00";
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: 8,
          border: "1px solid #ccc",
          borderRadius: 6,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontWeight: 700 }}>{data.name}</div>
        <div>Valor: R$ {Number(data.value).toFixed(2)}</div>
        <div>Percentual: {percent}%</div>
      </div>
    );
  }
  return null;
};

export default React.memo(CustomTooltip);