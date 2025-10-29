"use client";
import { useParams } from "next/navigation";
import TradingViewChart from "@/components/trading-view-widgets/TradingViewChart";
import TickerTape from "@/components/trading-view-widgets/TickerTape";
import TickerSelector from "@/components/selectors/TickerSelector";

const TradingViewTickerPage = () => {
  const params = useParams();
  const ticker = (params?.ticker as string) || "AAPL";

  return (
      <div className="trading-view-page-container">

        {/* Ticker Selector */}
        <div className="trading-view-selector">
          <TickerSelector routePrefix="/trading-view" />
        </div>

        {/* Page Title */}
        <div className="trading-view-header">
          <h1 className="trading-view-title">Trading View - {ticker}</h1>
        </div>

        {/* Ticker Tape */}
        <div className="trading-view-ticker-tape">
          <TickerTape />
        </div>

        {/* Main Chart */}
        <div className="trading-view-chart-container">
          <TradingViewChart ticker={ticker} />
        </div>
      </div>
  );
};

export default TradingViewTickerPage;
