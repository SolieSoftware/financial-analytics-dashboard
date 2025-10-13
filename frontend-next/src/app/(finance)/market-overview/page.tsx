import MarketChartOverview from "@/components/charts/MarketChartOverview";
import MarketSummary from "@/components/info/MarketSummary";
import BiggestGainers from "@/components/info/BiggestGainers";
import BiggestLosers from "@/components/info/BiggestLosers";
import MostActive from "@/components/info/MostActive";

const MarketOverviewPage = () => {
  return (
    <div className="market-overview-content-container">
      {/* Page Title */}
      <h1 className="market-overview-title">Market Overview</h1>

      {/* Charts Section */}
      <MarketChartOverview />

      {/* News Summary Section */}
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
  );
};

export default MarketOverviewPage;
