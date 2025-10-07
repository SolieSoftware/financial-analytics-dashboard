import MarketChartOverview from "@/components/charts/MarketChartOverview";
import MarketSummary from "@/components/info/MarketSummary";

const MarketOverviewPage = () => {
  return (
    <div className="market-overview-content-container">
      {/* Charts Section */}
      <MarketChartOverview />

      {/* News Summary Section */}
      <div className="market-content-container">
        <MarketSummary />
      </div>
    </div>
  );
};

export default MarketOverviewPage;
