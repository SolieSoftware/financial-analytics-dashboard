"use client";
import StockPriceChart from "@/components/charts/StockPriceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

import { useStockProfile } from "@/utils/hooks/useStockProfile";
import { stockInfoData, stockEntry } from "@/utils/types/stockData";

const MarketChartOverview = () => {
  const marketTickers = {
    "^GSPC": "S&P 500",
    "^IXIC": "NASDAQ",
    "^DJI": "Dow Jones",
    "^VIX": "VIX",
  };

  const marketData = Object.fromEntries(
    Object.entries(marketTickers).map(([ticker, name]) => [
      ticker,
      { ...useStockProfile({ ticker }), name },
    ])
  );

  return (
    <div className="market-charts-container">
      <h2 className="market-charts-title">Market Indices</h2>
      <div className="market-charts-grid">
        {Object.entries(marketData).map(([ticker, data]) => (
          <div key={ticker} className="market-chart-card">
            <StockPriceChart
              ticker={data.name}
              stockData={
                marketData[ticker].data || {
                  info_data: {} as stockInfoData,
                  history_data: [] as stockEntry[],
                }
              }
              isLoading={marketData[ticker].isLoading || false}
              error={marketData[ticker].error || null}
              compact={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default MarketChartOverview;
