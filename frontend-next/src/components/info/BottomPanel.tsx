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
        <Card className="bg-background-secondary/90 text-center mt-4 border-0">
          <CardContent>
            <LineChart className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">
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
        <Card className="bg-background-secondary/90 border-border/30 backdrop-blur-sm shadow-2xl">
          <CardHeader className="bg-accent-blue/10 border-b border-border/30">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-accent-blue w-5 h-5" />
              <span className="text-text-primary font-semibold">
                Performance Analytics
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, i: number) => (
                <Card
                  key={i}
                  className="bg-background-primary/80 border-border/30 h-full"
                >
                  <CardContent className="p-4">
                    <Skeleton className="w-24 h-6 mb-2" />
                    <Skeleton className="w-20 h-8 mb-1" />
                    <Skeleton className="w-16 h-5" />
                  </CardContent>
                </Card>
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
      <Card className="financial-profile-metric-card">
        <CardContent className="ml-4">
          <div className="flex items-center ml-4">
            <div className="text-accent-blue flex items-center text-sm pr-4">
              {icon}
            </div>
            <p className="text-text-secondary font-semibold text-sm uppercase tracking-wider">
              {title}
            </p>
          </div>

          <p className="text-text-primary text-2xl font-bold mb-2 font-mono">
            {typeof value === "number" ? value.toFixed(2) : value}
          </p>

          {subtitle && (
            <p className="text-text-muted text-xs block mb-2">{subtitle}</p>
          )}

          {hasChange && (
            <div className="flex items-center gap-2">
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
                  <TrendingUp className="w-4 h-4" />
                ) : isNegative ? (
                  <TrendingDown className="w-4 h-4" />
                ) : null}
              </div>
              <span
                className={`text-sm font-medium ${
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
        </CardContent>
      </Card>
    );
  }

  const companyInfo = stockData?.info_data;

  return (
    <div>
      <Card className="financial-profile-container">
        <CardHeader className="bg-accent-blue/10 border-b border-border/30 pl-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-accent-blue w-5 h-5" />
            <span className="text-text-primary font-semibold pl-2">
              Financial Profile
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="financial-profile-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default BottomPanel;
