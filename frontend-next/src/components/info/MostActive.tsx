"use client";

import { useMostActive } from "@/utils/hooks/useMostActive";
import { StockCard } from "@/components/cards/StockCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingPage from "@/components/default/LoadingPage";
import ErrorPage from "@/components/default/ErrorPage";
import NoData from "@/components/default/NoData";
import { Users } from "lucide-react";

export default function MostActive() {
  const { data, error, isLoading } = useMostActive();

  const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
        <CardTitle className="market-summary-main-title">
          <Users className="market-summary-main-icon" />
          <span className="market-summary-title-text">Most Active</span>
        </CardTitle>
      </CardHeader>
    );
  };

  if (isLoading) {
    return <LoadingPage title="Most Active" />;
  }

  if (!data) {
    return <NoData title="Most Active" />;
  }

  if (error) {
    return <ErrorPage error={error} title="Most Active" />;
  }

  const mostActive = data.most_active;

  return (
    <Card className="market-summary-container">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        {mostActive && mostActive.length > 0 ? (
          <div className="space-y-3">
            {mostActive.map((stock) => (
              <StockCard
                key={stock.symbol}
                ticker={stock.symbol}
                name={stock.name}
                price={stock.price}
                change={stock.change}
                changePercent={stock.changesPercentage}
              />
            ))}
          </div>
        ) : (
          <p className="market-summary-no-data">No data available</p>
        )}
      </CardContent>
    </Card>
  );
}
