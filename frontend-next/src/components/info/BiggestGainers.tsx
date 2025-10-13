"use client";

import { useBiggestGainers } from "@/utils/hooks/useBiggestGainers";
import { TrendingUp } from "lucide-react";
import { StockCard } from "@/components/cards/StockCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingPage from "@/components/default/LoadingPage";
import ErrorPage from "@/components/default/ErrorPage";
import NoData from "@/components/default/NoData";

export default function BiggestGainers() {
  const { data, error, isLoading } = useBiggestGainers();

  const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
        <CardTitle className="market-summary-main-title">
          <TrendingUp className="market-summary-main-icon" />
          <span className="market-summary-title-text">Biggest Gainers</span>
        </CardTitle>
      </CardHeader>
    );
  };

  if (isLoading) {
    return <LoadingPage title="Biggest Gainers" />;
  }

  if (!data) {
    return <NoData title="Biggest Gainers" />;
  }

  if (error) {
    return <ErrorPage error={error} title="Biggest Gainers" />;
  }

  const biggestGainers = data.biggest_gainers;

  return (
    <Card className="market-summary-container">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        {biggestGainers && biggestGainers.length > 0 ? (
          <div className="space-y-3">
            {biggestGainers.map((gainer) => (
              <StockCard
                key={gainer.symbol}
                ticker={gainer.symbol}
                name={gainer.name}
                price={gainer.price}
                change={gainer.change}
                changePercent={gainer.changesPercentage}
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
