"use client";
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

interface BaseBarChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  barColor?: string;
  showGrid?: boolean;
  className?: string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any) => string;
  height?: number | string;
  colorByValue?: boolean;
}

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background-primary/95 border border-border rounded-lg p-3 backdrop-blur-sm shadow-lg">
        <p className="text-text-secondary text-xs mb-1">{label}</p>
        <p className="text-text-primary font-semibold">
          {formatter ? formatter(payload[0].value) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const BaseBarChart: React.FC<BaseBarChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  barColor = "#4a9eff",
  showGrid = true,
  className,
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatter,
  height = "100%",
  colorByValue = false,
}) => {
  const getBarColor = (value: number) => {
    if (!colorByValue) return barColor;
    return value >= 0 ? "#00ff88" : "#ff4444";
  };

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.08)"
              vertical={false}
              horizontal={true}
            />
          )}
          <XAxis
            dataKey={xDataKey}
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
            tickFormatter={xAxisFormatter}
            tick={{ fill: "#94a3b8" }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
            tickFormatter={yAxisFormatter}
            tick={{ fill: "#94a3b8" }}
          />
          <Tooltip
            content={<CustomTooltip formatter={tooltipFormatter} />}
            cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
          />
          <Bar dataKey={yDataKey} radius={[4, 4, 0, 0]} animationDuration={500}>
            {colorByValue &&
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry[yDataKey])} />
              ))}
            {!colorByValue && <Cell fill={barColor} />}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
