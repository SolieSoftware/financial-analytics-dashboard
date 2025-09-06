"use client";
import { useState } from "react";
import { useStockProfile } from "@/utils/hooks/useStockProfile";
import { useAppSelector } from "../redux/store";
import { tickerType, tickerListType } from "@/utils/types/tickerTypes";
import MUIChart from "@/components/charts/MUIChart";

const MarketChartOverview = () => {
  const marketTickers = ["^GSPC", "^IXIC", "^DJI", "^VIX"];

  const marketData = Object.fromEntries(
    marketTickers.map((ticker) => [ticker, useStockProfile({ ticker })])
  );

  return (
    <div className="market-gallery">
      {marketTickers.map((ticker) => (
        <MUIChart
          key={ticker}
          ticker={ticker}
          stockData={marketData[ticker].data}
          isLoading={marketData[ticker].isLoading}
          error={marketData[ticker].error}
        />
      ))}
    </div>
  );
};

export default MarketChartOverview;
