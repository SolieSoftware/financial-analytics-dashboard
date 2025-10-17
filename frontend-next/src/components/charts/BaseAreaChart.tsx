"use client";
import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "../../lib/utils";

interface BaseAreaChartProps {
  data: any[];
  xDataKey: string;
  yDataKey: string;
  fillColor?: string;
  strokeColor?: string;
  showGrid?: boolean;
  className?: string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any) => string;
  height?: number | string;
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

export const BaseAreaChart: React.FC<BaseAreaChartProps> = ({
  data,
  xDataKey,
  yDataKey,
  fillColor = "#4a9eff",
  strokeColor = "#4a9eff",
  showGrid = true,
  className,
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatter,
  height = "100%",
}) => {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id={`color${yDataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.08)"
              vertical={true}
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
            cursor={{ stroke: strokeColor, strokeWidth: 1, strokeOpacity: 0.3 }}
          />
          <Area
            type="monotone"
            dataKey={yDataKey}
            stroke={strokeColor}
            strokeWidth={2.5}
            fill={`url(#color${yDataKey})`}
            animationDuration={500}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
