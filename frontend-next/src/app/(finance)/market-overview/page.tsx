import Layout from "../layout";
import MarketChartOverview from "@/components/charts/MarketChartOverview";
import MarketSummary from "@/components/info/MarketSummary";

const MarketOverviewPage = () => {
  return (
    <Layout>
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 w-full">
        <div className="flex flex-col w-full">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h1 className="text-text-primary font-bold text-3xl sm:text-4xl md:text-5xl mb-2">
              Market Overview
            </h1>
            <p className="text-text-secondary text-sm sm:text-base md:text-lg">
              Real-time market data and analysis
            </p>
          </div>

          {/* Charts Section */}
          <div className="market-overview-content-container">
          <div>
            <MarketChartOverview />
          </div>

          {/* News Summary Section */}
          <div className="w-full max-h-[50vh] overflow-y-auto">
            <MarketSummary />
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketOverviewPage;
