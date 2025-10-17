"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Gauge,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  stockEntryCleaned,
  stockEntry,
  stockDataResponse,
} from "@/utils/types/stockData";

interface StockPriceChartProps {
  ticker: string;
  stockData: stockDataResponse;
  isLoading: boolean;
  error: any;
  compact?: boolean;
}

interface ChartStats {
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  currentPrice: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-background-primary/95 border border-border rounded-xl p-3 backdrop-blur-sm shadow-lg">
        <p className="text-text-secondary text-xs mb-1">
          {dayjs(label).format("MMM DD, YYYY")}
        </p>
        <p className="text-text-primary font-bold text-sm">
          ${value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const StockPriceChart: React.FC<StockPriceChartProps> = ({
  ticker,
  stockData,
  isLoading,
  error,
  compact = false,
}) => {
  const [data, setData] = useState<stockEntryCleaned[]>([]);
  const [chartStats, setChartStats] = useState<ChartStats>({
    priceChange: 0,
    priceChangePercent: 0,
    highPrice: 0,
    lowPrice: 0,
    currentPrice: 0,
  });

  useEffect(() => {
    if (stockData?.history_data && stockData.history_data.length > 0) {
      const cleanedData = stockData.history_data.map((item: stockEntry) => ({
        ...item,
        Date: dayjs(item.Date).toDate(),
      }));

      setData(cleanedData);

      if (cleanedData.length > 0) {
        const prices = cleanedData.map((d: stockEntryCleaned) => d.Close);
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const priceChange = lastPrice - firstPrice;
        const priceChangePercent = (priceChange / firstPrice) * 100;

        setChartStats({
          priceChange,
          priceChangePercent,
          highPrice: Math.max(...prices),
          lowPrice: Math.min(...prices),
          currentPrice: lastPrice,
        });
      }
    } else {
      setData([]);
      setChartStats({
        priceChange: 0,
        priceChangePercent: 0,
        highPrice: 0,
        lowPrice: 0,
        currentPrice: 0,
      });
    }
  }, [stockData]);

  // Loading State
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-background-primary to-background-secondary border-0 h-full min-h-[300px] max-h-[400px] flex flex-col">
        <CardContent className="p-6 flex-1">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <div className="flex-1">
              <Skeleton className="h-7 w-3/5 mb-2" />
              <Skeleton className="h-5 w-2/5" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 h-full">
            <Gauge className="w-12 h-12 text-accent-blue mb-4 animate-pulse" />
            <div className="w-52 h-1.5 bg-background-tertiary/30 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-accent-blue to-accent-purple animate-[shimmer_1.5s_ease-in-out_infinite] w-1/2" />
            </div>
            <p className="text-text-secondary text-sm font-medium">
              Loading chart data for {ticker}...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No Ticker State
  if (!ticker) {
    return (
      <Card className="bg-gradient-to-br from-background-primary to-background-secondary border-0 h-full min-h-[300px] max-h-[400px] flex flex-col">
        <CardContent className="p-6 flex items-center justify-center flex-1">
          <div className="text-center">
            <p className="text-text-secondary text-lg font-semibold mb-2">
              No ticker selected
            </p>
            <p className="text-text-muted text-sm max-w-xs">
              Select a ticker from the dashboard to view historical price data
              and trends
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary border-bearish/20 h-full">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Chart Loading Error</AlertTitle>
            <AlertDescription>
              {error?.message ||
                error?.toString() ||
                "Failed to load chart data"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (!data.length) {
    return (
      <Card className="bg-gradient-to-br from-background-primary to-background-secondary border-0 h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
          <BarChart3 className="w-16 h-16 text-text-muted mb-4" />
          <p className="text-text-secondary text-lg font-semibold mb-2">
            No Chart Data Available
          </p>
          <p className="text-text-muted text-sm text-center max-w-xs">
            Select a ticker from the dashboard to view historical price data and
            trends
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPositive = chartStats.priceChangePercent > 0;
  const isNegative = chartStats.priceChangePercent < 0;
  const lineColor = isPositive ? "#00ff88" : isNegative ? "#ff4444" : "#4a9eff";

  return (
    <Card
      className={cn(
        "border-0",
        "bg-gradient-to-br from-background-primary to-background-secondary",
        "backdrop-blur-sm shadow-2xl",
        "h-full w-full max-h-full max-w-full flex flex-col",
        "relative",
        "before:absolute before:top-0 before:left-0 before:right-0 before:h-1",
        isPositive &&
          "before:bg-gradient-to-r before:from-bullish before:to-bullish-muted",
        isNegative &&
          "before:bg-gradient-to-r before:from-bearish before:to-bearish-muted",
        !isPositive &&
          !isNegative &&
          "before:bg-gradient-to-r before:from-accent-blue before:to-accent-cyan"
      )}
    >
      <CardContent className="p-0 h-full w-full flex flex-col flex-1">
        {/* Chart Header */}
        <div className={cn("p-4 flex-shrink-0", compact ? "p-2" : "p-4")}>
          <div
            className={cn("flex items-center gap-3", compact ? "mb-2" : "mb-4")}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-2xl",
                compact ? "w-6 h-6" : "w-8 h-8",
                isPositive && "bg-bullish-bg",
                isNegative && "bg-bearish-bg",
                !isPositive && !isNegative && "bg-accent-blue/10"
              )}
            >
              <BarChart3
                className={cn(
                  compact ? "w-3 h-3" : "w-5 h-5",
                  isPositive && "text-bullish",
                  isNegative && "text-bearish",
                  !isPositive && !isNegative && "text-accent-blue"
                )}
              />
            </div>
            <div className="flex-1">
              <h3
                className={cn(
                  "text-text-primary font-bold",
                  compact ? "text-sm" : "text-base"
                )}
              >
                {ticker}
              </h3>
              {!compact && (
                <p className="text-text-secondary text-xs mt-0.5">
                  Historical price movement • {data.length} data points
                </p>
              )}
            </div>
          </div>

          {/* Price Statistics */}
          <div className="flex flex-wrap items-center">
            <div className="flex items-center">
              <span className="text-text-primary font-bold text-sm">
                ${chartStats.currentPrice.toFixed(2)}
              </span>
            </div>

            <Badge variant={isPositive ? "bullish" : "bearish"}>
              {isPositive ? (
                <TrendingUp className="w-2 h-2" />
              ) : (
                <TrendingDown className="w-2 h-2" />
              )}
              {isPositive ? "+" : ""}
              {chartStats.priceChangePercent.toFixed(2)}%
            </Badge>
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex-1 w-full bg-background-primary/50 rounded-b-xl flex flex-col min-h-0">
          <div className="flex-1 w-full overflow-hidden relative min-h-0">
            <ResponsiveContainer width="90%" height="100%">
              <LineChart
                data={data}
                margin={{
                  left: compact ? 20 : 30,
                  right: compact ? 5 : 10,
                  top: compact ? 5 : 10,
                  bottom: compact ? 20 : 30,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148, 163, 184, 0.08)"
                  vertical={true}
                  horizontal={true}
                />
                <XAxis
                  dataKey="Date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                  tickFormatter={(value) => dayjs(value).format("MMM DD")}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                  tick={{ fill: "#94a3b8" }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Close"
                  stroke={lineColor}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: lineColor }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockPriceChart;
