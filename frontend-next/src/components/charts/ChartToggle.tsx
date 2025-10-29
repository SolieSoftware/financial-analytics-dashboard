"use client";
import React, { useState } from "react";
import StockPriceChart from "@/components/charts/StockPriceChart";
import TradingViewChart from "@/components/trading-view-widgets/TradingViewChart";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { stockDataResponse } from "@/utils/types/stockData";

interface ChartToggleProps {
  ticker: string;
  stockData: stockDataResponse;
  isLoading: boolean;
  error: any;
  compact?: boolean;
}

type ChartType = "custom" | "tradingview";

const ChartToggle: React.FC<ChartToggleProps> = ({
  ticker,
  stockData,
  isLoading,
  error,
  compact = false,
}) => {
  const [chartType, setChartType] = useState<ChartType>("custom");

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toggle Controls */}
      <div className="flex items-center justify-end gap-2 mb-3 px-2">
        <div className="flex items-center gap-1 bg-background-secondary rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChartType("custom")}
            className={cn(
              "text-xs px-3 py-1.5 transition-all",
              chartType === "custom"
                ? "bg-accent-blue text-white hover:bg-accent-blue/90"
                : "text-text-muted hover:text-text-primary hover:bg-background-tertiary"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Custom Chart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChartType("tradingview")}
            className={cn(
              "text-xs px-3 py-1.5 transition-all",
              chartType === "tradingview"
                ? "bg-accent-blue text-white hover:bg-accent-blue/90"
                : "text-text-muted hover:text-text-primary hover:bg-background-tertiary"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            TradingView
          </Button>
        </div>
      </div>

      {/* Chart Display */}
      <div className="flex-1 w-full min-h-0">
        {chartType === "custom" ? (
          <StockPriceChart
            ticker={ticker}
            stockData={stockData}
            isLoading={isLoading}
            error={error}
            compact={compact}
          />
        ) : (
          <div className="h-full w-full">
            <TradingViewChart
              ticker={ticker}
              height="100%"
              theme="dark"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartToggle;
