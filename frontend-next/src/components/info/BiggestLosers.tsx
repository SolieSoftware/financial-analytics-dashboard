"use client";

import { useBiggestLosers } from "@/utils/hooks/useBiggestLosers";
import { TrendingDown } from "lucide-react";
import { StockCard } from "@/components/cards/StockCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingPage from "@/components/default/LoadingPage";
import ErrorPage from "@/components/default/ErrorPage";
import NoData from "@/components/default/NoData";

export default function BiggestLosers() {
  const { data, error, isLoading } = useBiggestLosers();

  const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
        <CardTitle className="market-summary-main-title">
          <TrendingDown className="market-summary-main-icon" />
          <span className="market-summary-title-text">Biggest Losers</span>
        </CardTitle>
      </CardHeader>
    );
  };

  if (isLoading) {
    return <LoadingPage title="Biggest Losers" />;
  }

  if (!data) {
    return <NoData title="Biggest Losers" />;
  }

  if (error) {
    return <ErrorPage error={error} title="Biggest Losers" />;
  }

  const biggestLosers = data.biggest_losers;

  return (
    <Card className="market-summary-container">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        {biggestLosers && biggestLosers.length > 0 ? (
          <div className="space-y-3">
            {biggestLosers.map((loser) => (
              <StockCard
                key={loser.symbol}
                ticker={loser.symbol}
                name={loser.name}
                price={loser.price}
                change={loser.change}
                changePercent={loser.changesPercentage}
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
