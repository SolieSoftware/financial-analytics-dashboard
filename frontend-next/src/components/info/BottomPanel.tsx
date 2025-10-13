"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

import LoadingPage from "@/components/default/LoadingPage";
import ErrorPage from "@/components/default/ErrorPage";
import NoData from "@/components/default/NoData";

const BottomPanel = ({
  ticker,
  data,
  isLoading,
  error,
}: {
  ticker: string;
  data: stockDataResponse;
  isLoading: boolean;
  error: Error;
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

  const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
        <CardTitle className="market-summary-main-title">
          <BarChart3 className="market-summary-main-icon" />
          <span className="market-summary-title-text">Financial Profile</span>
        </CardTitle>
      </CardHeader>
    );
  };

  if (!ticker) {
    return <NoData title={displayTitle()} />;
  }

  if (isLoading) {
    return <LoadingPage title={displayTitle()} />;
  }

  if (!stockData) {
    return <NoData title={displayTitle()} />;
  }

  if (error) {
    return <ErrorPage error={error} title={displayTitle()} />;
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
      <Card className="market-summary-card">
        <CardContent className="market-summary-content">
          <div className="market-summary-header">
            <div className="market-summary-title-section">
              <div className="market-summary-icon">{icon}</div>
              <h3 className="market-summary-title">{title}</h3>
            </div>
            {hasChange && (
              <div
                className={`market-summary-sentiment-icon ${
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
            )}
          </div>

          {subtitle && <p className="market-summary-description">{subtitle}</p>}

          <div className="market-summary-badges">
            <Badge variant="default" className="market-summary-badge">
              {typeof value === "number" ? value.toFixed(2) : value}
            </Badge>
            {hasChange && (
              <Badge
                variant={
                  isPositive ? "bullish" : isNegative ? "bearish" : "default"
                }
                className="market-summary-badge"
              >
                {typeof changePercent === "number"
                  ? changePercent.toFixed(2)
                  : changePercent}
                %
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const companyInfo = stockData?.info_data;

  const metricCards = [
    {
      title: "Prev Close",
      value: companyInfo?.previousClose ?? "N/A",
      icon: <DollarSign />,
    },
    {
      title: "52W Range",
      value: companyInfo?.fiftyTwoWeekRange
        ? `${companyInfo.fiftyTwoWeekRange} ${companyInfo.currency}`
        : "N/A",
      icon: <LineChart />,
    },
    {
      title: "Market Cap",
      value: companyInfo?.marketCap
        ? `${formatNumber(companyInfo.marketCap)}`
        : "N/A",
      icon: <LineChart />,
      subtitle: "Total market value",
      showChange: false,
    },
    {
      title: "Open",
      value: companyInfo?.open ?? "N/A",
      icon: <DollarSign />,
    },
    {
      title: "P/E Ratio",
      value: companyInfo?.trailingPE || "N/A",
      icon: <BarChart3 />,
      subtitle: "Trailing P/E Ratio",
    },
    {
      title: "Dividend Yield",
      value: companyInfo?.dividendYield
        ? `${(companyInfo.dividendYield * 100).toFixed(2)}%`
        : "N/A",
      icon: <DollarSign />,
    },
    {
      title: "Day Range",
      value: companyInfo?.regularMarketDayRange
        ? `${companyInfo.regularMarketDayRange} ${companyInfo.currency}`
        : "N/A",
      icon: <LineChart />,
    },
    {
      title: "Volume",
      value: companyInfo?.volume ? formatVolume(companyInfo.volume) : "N/A",
      icon: <Volume2 />,
    },
    {
      title: "EPS",
      value: companyInfo?.trailingEps || "N/A",
      icon: <TrendingUp />,
      subtitle: "Trailing EPS",
    },
  ];

  return (
    <Card className="market-summary-container content-area-bottom">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {metricCards.map((metric, index) => (
            <MetricCard
              key={`${metric.title}-${index}`}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              subtitle={metric.subtitle}
              showChange={metric.showChange}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BottomPanel;
