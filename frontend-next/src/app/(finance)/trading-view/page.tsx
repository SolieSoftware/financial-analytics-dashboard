import Layout from "../layout";
import TradingViewChart from "@/components/trading-view-widgets/TradingViewChart";
import TickerTape from "@/components/trading-view-widgets/TickerTape";

const TradingViewPage = () => {
  return (
    <Layout>
      <div className="w-full h-20 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
          Trading View
        </h1>
      </div>

      <div className="h-24 w-4/5 mx-auto my-12">
        <TickerTape />
      </div>
      <div className="h-[calc(100vh-120px)] w-4/5 mx-auto">
        <TradingViewChart />
      </div>
    </Layout>
  );
};

export default TradingViewPage;
