"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  LineChart,
  Volume2,
  BarChart3,
  AlertCircle,
  Info,
} from "lucide-react";
import { stockDataResponse } from "@/utils/types/stockData";

const BottomPanel = ({
  ticker,
  data,
  isLoading,
  error,
}: {
  ticker: string;
  data: stockDataResponse;
  isLoading: boolean;
  error: string;
}) => {
  const stockData = data;

  const formatNumber = (num?: number): string => {
    if (!num) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (volume?: number): string => {
    if (!volume) return "N/A";
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toLocaleString();
  };

  if (!ticker) {
    return (
      <div>
        <Card className="bg-transparent border-0">
          <CardContent className="text-center py-12">
            <LineChart className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary text-sm">
              Select a ticker to view performance analytics
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Card className="bg-transparent border-0">
          <CardHeader className="border-b border-border/20 pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="text-text-muted w-4 h-4" />
              <span className="text-text-primary font-medium">
                Performance Analytics
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 4 }).map((_, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-background-tertiary/50 border border-border/20">
                  <Skeleton className="w-24 h-5 mb-2" />
                  <Skeleton className="w-20 h-7 mb-1" />
                  <Skeleton className="w-16 h-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error loading performance data: {error || error?.toString()}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div>
        <Alert variant="info">
          <Info className="h-4 w-4" />
          <AlertDescription>No performance data available</AlertDescription>
        </Alert>
      </div>
    );
  }

  function MetricCard({
    title,
    value,
    change,
    changePercent,
    icon,
    subtitle,
    showChange,
  }: {
    title: string;
    value: string | number;
    change?: string | number;
    changePercent?: number;
    icon: React.ReactNode;
    subtitle?: string;
    showChange?: boolean;
  }) {
    const isPositive: boolean = (changePercent ?? 0) > 0;
    const isNegative: boolean = (changePercent ?? 0) < 0;
    const hasChange: boolean =
      changePercent !== undefined && changePercent !== null;

    return (
      <div className="p-3 rounded-lg bg-background-tertiary/30 border-0 hover:border-border/40 transition-all pt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-text-muted flex items-center">
            {icon}
          </div>
          <p className="text-text-muted font-medium text-xs uppercase tracking-wide">
            {title}
          </p>
        </div>

        <p className="text-text-primary text-xl font-semibold mb-1">
          {typeof value === "number" ? value.toFixed(2) : value}
        </p>

        {subtitle && (
          <p className="text-text-muted text-xs mb-1">{subtitle}</p>
        )}

        {hasChange && (
          <div className="flex items-center gap-1.5">
            <div
              className={`flex items-center ${
                isPositive
                  ? "text-bullish"
                  : isNegative
                  ? "text-bearish"
                  : "text-text-secondary"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : isNegative ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
            </div>
            <span
              className={`text-xs font-medium ${
                isPositive
                  ? "text-bullish"
                  : isNegative
                  ? "text-bearish"
                  : "text-text-secondary"
              }`}
            >
              {typeof change === "number" ? change.toFixed(2) : change}
            </span>
            <span
              className={`text-xs font-medium ${
                isPositive
                  ? "text-bullish"
                  : isNegative
                  ? "text-bearish"
                  : "text-text-secondary"
              }`}
            >
              (
              {typeof changePercent === "number"
                ? changePercent.toFixed(2)
                : changePercent}
              %)
            </span>
          </div>
        )}
      </div>
    );
  }

  const companyInfo = stockData?.info_data;

  return (
    <div className="p-4 w-90% ml-2">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-text-muted w-4 h-4" />
          <h3 className="text-text-primary font-medium text-sm">
            Financial Profile
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <MetricCard
              title="Prev Close"
              value={companyInfo?.previousClose ?? "N/A"}
              icon={<DollarSign />}
            />

            <MetricCard
              title="52W Range"
              value={
                companyInfo?.fiftyTwoWeekRange
                  ? `${companyInfo.fiftyTwoWeekRange} ${companyInfo.currency}`
                  : "N/A"
              }
              icon={<LineChart />}
            />

            <MetricCard
              title="Market Cap"
              value={
                companyInfo?.marketCap
                  ? `${formatNumber(companyInfo.marketCap)}`
                  : "N/A"
              }
              icon={<LineChart />}
              subtitle="Total market value"
              showChange={false}
            />

            <MetricCard
              title="Open"
              value={companyInfo?.open ?? "N/A"}
              icon={<DollarSign />}
            />

            <MetricCard
              title="P/E Ratio"
              value={companyInfo?.trailingPE || "N/A"}
              icon={<BarChart3 />}
              subtitle="Trailing P/E Ratio"
            />

            <MetricCard
              title="Dividend Yield"
              value={
                companyInfo?.dividendYield
                  ? `${(companyInfo.dividendYield * 100).toFixed(2)}%`
                  : "N/A"
              }
              icon={<DollarSign />}
            />

            <MetricCard
              title="Day Range"
              value={
                companyInfo?.regularMarketDayRange
                  ? `${companyInfo.regularMarketDayRange} ${companyInfo.currency}`
                  : "N/A"
              }
              icon={<LineChart />}
            />

            <MetricCard
              title="Volume"
              value={
                companyInfo?.volume ? formatVolume(companyInfo.volume) : "N/A"
              }
              icon={<Volume2 />}
            />

            <MetricCard
              title="EPS"
              value={companyInfo?.trailingEps || "N/A"}
              icon={<TrendingUp />}
              subtitle="Trailing EPS"
            />
      </div>
    </div>
  );
};

export default BottomPanel;
