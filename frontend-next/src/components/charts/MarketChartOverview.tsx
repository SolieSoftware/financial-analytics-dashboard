"use client";
import MUIChart from "@/components/charts/MUIChart";

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
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
        Market Indices
      </h2>
      <div className="grid grid-cols-2 gap-4 h-[600px]">
        {Object.entries(marketData).map(([ticker, data]) => (
          <div
            key={ticker}
            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/10 h-full"
          >
            <MUIChart
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
