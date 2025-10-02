import { Typography } from "@mui/material";
import Layout from "../layout";
import TradingViewChart from "@/components/trading-view-widgets/TradingViewChart";
import TickerTape from "@/components/trading-view-widgets/TickerTape";

const TradingViewPage = () => {
  return (
    <Layout>
      <div className="width-full height-10vh text-center mb-10">
        <Typography variant="h1">Trading View</Typography>

      </div>

      <div style={{ height: "10vh", width: "80%" , margin: "50px auto" }}>
         <TickerTape />
      </div>
      <div style={{ height: "calc(100vh - 120px)", width: "80%" , margin: "0 auto" }}>
        <TradingViewChart />
      </div>
    </Layout>
  );
};

export default TradingViewPage;
