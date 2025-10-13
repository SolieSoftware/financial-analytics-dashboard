"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { stockInfoData } from "@/utils/types/stockData";
import LoadingPage from "@/components/default/LoadingPage";
import ErrorPage from "@/components/default/ErrorPage";
import NoData from "@/components/default/NoData";

interface CompanyOverviewProps {
  data: stockInfoData | undefined;
  isLoading: boolean;
  error: Error;
}

const CompanyOverview = ({ data, isLoading, error }: CompanyOverviewProps) => {
  const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
        <CardTitle className="market-summary-main-title">
          <Building2 className="market-summary-main-icon" />
          <span className="market-summary-title-text">Company Overview</span>
        </CardTitle>
      </CardHeader>
    );
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

  return (
    <Card className="market-summary-container company-info">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        <div className="mb-3">
          <Card className="market-summary-card">
            <CardContent className="market-summary-content">
              <div className="market-summary-header">
                <div className="market-summary-title-section">
                  <Building2 className="market-summary-icon" />
                  <h3 className="market-summary-title">
                    {data?.shortName || "N/A"}
                  </h3>
                </div>
              </div>

              {data?.longBusinessSummary && (
                <p className="market-summary-description">
                  {data?.longBusinessSummary}
                </p>
              )}

              <div className="market-summary-badges">
                {data?.sector && (
                  <Badge variant="default" className="market-summary-badge">
                    {data?.sector}
                  </Badge>
                )}
                {data?.industry && (
                  <Badge variant="outline" className="market-summary-badge">
                    {data?.industry}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyOverview;
