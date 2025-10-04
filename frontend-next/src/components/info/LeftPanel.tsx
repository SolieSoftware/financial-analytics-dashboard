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
      <div>
        <Card className="bg-background-secondary/90 text-center py-12 border-0">
          <CardContent>
            <Building2 className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">
              Select a ticker to view company information
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-background-secondary/90 border-border/30">
          <CardHeader>
            <Skeleton className="w-52 h-8" />
          </CardHeader>
          <CardContent>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mb-4">
                <Skeleton className="w-24 h-5 mb-1" />
                <Skeleton className="w-full h-5" />
              </div>
            ))}
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
      <div key={label} className="key-metric-item">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-text-primary text-sm font-medium">
              {label}
            </span>
          </div>
          <span className="text-text-primary text-sm">{value || "N/A"}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl">
      {/* Company Overview */}
      <Card className="mb-6 bg-background-secondary/90 border-0 backdrop-blur-sm shadow-2xl">
        <CardHeader className="bg-accent-blue/10 border-b border-0">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="text-accent-blue w-5 h-5" />
            <span className="text-text-primary font-semibold">
              Company Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div>
            <h2 className="text-text-primary text-2xl font-semibold mb-2">
              {companyInfo?.shortName || "N/A"}
            </h2>
            <div className="flex gap-2 mb-4">
              {companyInfo?.sector && (
                <Badge
                  variant="default"
                  className="bg-accent-blue/20 text-accent-blue border-accent-blue/30"
                >
                  {companyInfo.sector}
                </Badge>
              )}
              {companyInfo?.industry && (
                <Badge variant="outline" className="border-border/50 text-text-secondary">
                  {companyInfo.industry}
                </Badge>
              )}
            </div>
          </div>

          {companyInfo?.longBusinessSummary && (
            <p className="text-text-secondary text-sm leading-relaxed">
              {companyInfo.longBusinessSummary}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="key-metrics-container">
        <CardHeader className="bg-accent-blue/10 border-b border-border/30">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-accent-blue w-5 h-5" />
            <span className="text-text-primary font-semibold pl-2">Key Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="key-metrics-content">
            {keyMetrics.map((metric) =>
              displayKeyMetrics(metric.label, metric.value, metric.icon)
            )}
        </CardContent>
      </Card>

      {/* Latest News */}
      {stockMarketNewsData && (
        <Card className="mb-6 bg-background-secondary/90 border-border/30 backdrop-blur-sm shadow-2xl">
          <CardHeader className="bg-accent-blue/10 border-b border-border/30">
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="text-accent-blue w-5 h-5" />
              <span className="text-text-primary font-semibold">News</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              {stockMarketNewsData["market_news"]["feed"]?.map(
                (news: NewsArticle, index: number) => {
                  const sentiment = formatSentiment(news.overall_sentiment_score);
                  return (
                    <div key={index}>
                      <Link
                        href={news.url}
                        target="news_link"
                        className="block transform transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5"
                      >
                        <div>
                          <p className="text-text-primary text-sm font-medium mb-2">
                            {news.title} -{" "}
                            <strong className={sentiment.color}>
                              {sentiment.label}
                            </strong>{" "}
                            -{" "}
                            {parseCustomTimestamp(news.time_published).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-text-secondary text-sm">
                            {news.summary}
                          </p>
                        </div>
                      </Link>
                      {index < stockMarketNewsData["market_news"]["feed"].length - 1 && (
                        <div className="h-px bg-border/30 my-4" />
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeftPanel;
