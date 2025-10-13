"use client";

import {
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Percent,
  Building,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stockInfoData } from "@/utils/types/stockData";

import LoadingPage from "@/components/default/LoadingPage";
import ErrorPage from "@/components/default/ErrorPage";
import NoData from "@/components/default/NoData";

interface KeyMetricsProps {
  data: stockInfoData | undefined;
  isLoading: boolean;
  error: Error;
}

const KeyMetrics = ({ data, isLoading, error }: KeyMetricsProps) => {

   const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
      <CardTitle className="market-summary-main-title">
        <BarChart3 className="market-summary-main-icon" />
        <span className="market-summary-title-text">Key Metrics</span>
      </CardTitle>
    </CardHeader> 
    )
   }
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

  if (isLoading) {
    return <LoadingPage title={displayTitle()} />;
  }

  if (!data) {
    return <NoData title={displayTitle()} />;
  }

  if (error) {
    return <ErrorPage error={error} title={displayTitle()} />;
  }

  const keyMetrics = [
    {
      label: "Employees",
      value: data?.fullTimeEmployees?.toLocaleString() || "N/A",
      icon: <Users className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Total Cash",
      value: formatNumber(data?.totalCash),
      icon: <DollarSign className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Per Share",
      value: `${data?.totalCashPerShare?.toFixed(2) || "N/A"}`,
      icon: <Percent className="text-text-muted w-5 h-5" />,
    },
    {
      label: "EBITDA",
      value: formatNumber(data?.ebitda),
      icon: <TrendingUp className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Enterprise Value",
      value: formatNumber(data?.enterpriseValue),
      icon: <Building className="text-text-muted w-5 h-5" />,
    },
    {
      label: "Profit Margins",
      value: formatPercentage(data?.profitMargins),
      icon: <Percent className="text-text-muted w-5 h-5" />,
    },
  ];

  const metricCard = (label: string, value: string, icon: React.ReactNode) => {
    return (
      <div key={label} className="mb-3">
        <Card className="market-summary-card">
          <CardContent className="market-summary-content">
            <div className="market-summary-header">
              <div className="market-summary-title-section">
                {icon}
                <h3 className="market-summary-title">{label}</h3>
              </div>
            </div>

            <div className="market-summary-badges">
              <Badge variant="default" className="market-summary-badge">
                {value || "N/A"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Card className="market-summary-container key-metrics">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        {keyMetrics.map((metric) =>
          metricCard(metric.label, metric.value, metric.icon)
        )}
      </CardContent>
    </Card>
  );
};

export default KeyMetrics;
