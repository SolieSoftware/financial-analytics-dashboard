import MarketChartOverview from "@/components/charts/MarketChartOverview";
import MarketSummary from "@/components/info/MarketSummary";
import BiggestGainers from "@/components/info/BiggestGainers";
import BiggestLosers from "@/components/info/BiggestLosers";
import MostActive from "@/components/info/MostActive";
import EconomicsCalendar from "@/components/trading-view-widgets/EconomicsCalendar";
import MarketData from "@/components/trading-view-widgets/MarketData";

const MarketOverviewPage = () => {
  return (
    <div className="market-overview-content-container">
    <div className="market-indices-section">
      {/* Page Title */}
      <h1 className="market-overview-title">Market Overview</h1>
      {/* Charts Section */}
      <MarketChartOverview />
    </div>

      {/* Summary Section */}
      <div className="market-summary-section">        
        <h2 className="tradingview-widgets-title">Latest News & Significant Movers</h2>
        <div className="market-content-container">
          <div className="market-summary-inner-container">
            <MarketSummary />
          </div>
          <div className="biggest-gainers-inner-container">
            <BiggestGainers />
          </div>
          <div className="biggest-losers-inner-container">
            <BiggestLosers />
          </div>
          <div className="most-active-inner-container">
            <MostActive />
          </div>
        </div>
      </div>
      {/* TradingView Widgets Section */}
      <div className="tradingview-widgets-section">
        <h2 className="tradingview-widgets-title">Live Market Data & Economic Calendar</h2>
        <div className="tradingview-widgets-container">
          <div className="market-data-widget-container">
            <MarketData height={650} />
          </div>
          <div className="economic-calendar-widget-container">
            <EconomicsCalendar height={650} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverviewPage;
