"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Info,
  Building,
  Percent,
  Newspaper,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { NewsArticle } from "@/utils/types/newsTypes";
import { stockDataResponse } from "@/utils/types/stockData";
import { stockMarketNewsResponse } from "@/utils/types/newsTypes";

const LeftPanel = ({
  ticker,
  data,
  isLoading,
  error,
  stockMarketNewsData,
  stockMarketNewsError,
  stockMarketNewsLoading,
}: {
  ticker: string;
  data: stockDataResponse;
  isLoading: boolean;
  error: string;
  stockMarketNewsData: stockMarketNewsResponse;
  stockMarketNewsError: string;
  stockMarketNewsLoading: boolean;
}) => {
  const selectedTicker = ticker;
  const stockData = data;

  const formatNumber = (num?: number) => {
    if (!num) return "N/A";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num?: number) => {
    if (!num) return "N/A";
    return `${(num * 100).toFixed(2)}%`;
  };

  const formatSentiment = (sentimentScore?: number) => {
    if (!sentimentScore) return { label: "N/A", color: "text-text-muted" };

    switch (true) {
      case sentimentScore > 0.35:
        return { label: "Bullish", color: "text-bullish" };
      case sentimentScore < 0.15:
        return { label: "Somewhat Bullish", color: "text-bullish-muted" };
      case sentimentScore > -0.15:
        return { label: "Neutral", color: "text-text-secondary" };
      case sentimentScore > -0.35:
        return { label: "Somewhat Bearish", color: "text-bearish-muted" };
      case sentimentScore < -0.35:
        return { label: "Bearish", color: "text-bearish" };
      default:
        return { label: "Neutral", color: "text-text-secondary" };
    }
  };

  const parseCustomTimestamp = (timestamp: string) => {
    if (!timestamp) return new Date();

    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hour = timestamp.slice(9, 11);
    const minute = timestamp.slice(11, 13);
    const second = timestamp.slice(13, 15);

    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    return new Date(isoString);
  };

  if (!selectedTicker) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <p className="text-text-secondary text-sm">
          Select a ticker to view company information
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div>
          <Skeleton className="w-40 h-6 mb-3" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="mb-3">
              <Skeleton className="w-24 h-4 mb-2" />
              <Skeleton className="w-full h-4" />
            </div>
          ))}
        </div>
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
            Error loading company info: {error || error?.toString()}
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
          <AlertDescription>No company information available</AlertDescription>
        </Alert>
      </div>
    );
  }

  const companyInfo = stockData.info_data;

  const keyMetrics = [
    {
      label: "Employees",
      value: companyInfo?.fullTimeEmployees?.toLocaleString() || "N/A",
      icon: <Users className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Total Cash",
      value: formatNumber(companyInfo?.totalCash),
      icon: <DollarSign className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Per Share",
      value: `${companyInfo?.totalCashPerShare?.toFixed(2) || "N/A"}`,
      icon: <Percent className="text-text-muted w-5 h-5" />,
    },
    {
      label: "EBITDA",
      value: formatNumber(companyInfo?.ebitda),
      icon: <TrendingUp className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Enterprise Value",
      value: formatNumber(companyInfo?.enterpriseValue),
      icon: <Building className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Profit Margins",
      value: formatPercentage(companyInfo?.profitMargins),
      icon: <Percent className="text-text-muted w-5 h-5" />,
    },
  ];

  const displayKeyMetrics = (
    label: string,
    value: string,
    icon: React.ReactNode
  ) => {
    return (
      <div key={label} className="flex items-center justify-between py-2 border-b border-border/10">
        <div className="flex items-center gap-2">
          <div className="text-text-muted">{icon}</div>
          <span className="text-text-secondary text-xs font-medium">
            {label}
          </span>
        </div>
        <span className="text-text-primary text-xs font-semibold">{value || "N/A"}</span>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Company Overview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="text-text-muted w-4 h-4" />
          <h3 className="text-text-primary font-medium text-sm">
            Company Overview
          </h3>
        </div>
        <div className="space-y-3">
          <div>
            <h2 className="text-text-primary text-xl font-semibold mb-2">
              {companyInfo?.shortName || "N/A"}
            </h2>
            <div className="flex gap-2 mb-3">
              {companyInfo?.sector && (
                <Badge
                  variant="default"
                  className="bg-background-tertiary/50 text-text-primary border-border/30 text-xs"
                >
                  {companyInfo.sector}
                </Badge>
              )}
              {companyInfo?.industry && (
                <Badge variant="outline" className="border-border/30 text-text-secondary text-xs">
                  {companyInfo.industry}
                </Badge>
              )}
            </div>
          </div>

          {companyInfo?.longBusinessSummary && (
            <p className="text-text-secondary text-xs leading-relaxed">
              {companyInfo.longBusinessSummary}
            </p>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="text-text-muted w-4 h-4" />
          <h3 className="text-text-primary font-medium text-sm">Key Metrics</h3>
        </div>
        <div className="space-y-1">
          {keyMetrics.map((metric) =>
            displayKeyMetrics(metric.label, metric.value, metric.icon)
          )}
        </div>
      </div>

      {/* Latest News */}
      {stockMarketNewsData && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="text-text-muted w-4 h-4" />
            <h3 className="text-text-primary font-medium text-sm">News</h3>
          </div>
          <div className="space-y-4">
            {stockMarketNewsData["market_news"]["feed"]?.map(
              (news: NewsArticle, index: number) => {
                const sentiment = formatSentiment(news.overall_sentiment_score);
                return (
                  <div key={index}>
                    <Link
                      href={news.url}
                      target="news_link"
                      className="block transition-all duration-200 hover:opacity-80"
                    >
                      <div>
                        <p className="text-text-primary text-xs font-medium mb-1">
                          {news.title}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-medium ${sentiment.color}`}>
                            {sentiment.label}
                          </span>
                          <span className="text-text-muted text-xs">
                            {parseCustomTimestamp(news.time_published).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-text-secondary text-xs line-clamp-2">
                          {news.summary}
                        </p>
                      </div>
                    </Link>
                    {index < stockMarketNewsData["market_news"]["feed"].length - 1 && (
                      <div className="h-px bg-border/10 my-3" />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
