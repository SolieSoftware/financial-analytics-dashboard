"use client";
import MUIChart from "@/components/charts/MUIChart";
import LeftPanel from "@/components/info/LeftPanel";
import BottomPanel from "@/components/info/BottomPanel";
import Layout from "../../layout";
import { TickerSelector } from "@/components/selectors/TickerSelector";
import { useStockProfile } from "@/utils/hooks/useStockProfile";
import { useAppSelector } from "@/components/redux/store";
      
function StockProfilePage() {
  const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);
  const { data: stockData, isLoading, error } = useStockProfile({ ticker: selectedTicker });
  return (
    <Layout>
      <div className="flex flex-row flex justify-center">
        <div className="w-1/4">
          <TickerSelector />
        </div>
      </div>
      <div className="main-content">
        {/* Chart positioned top-right */}
        <div className="chart-container">
          <MUIChart ticker={selectedTicker} stockData={stockData} isLoading={isLoading} error={error} />
        </div>

        {/* Left content area for company information */}
        <div className="content-area-left">
          <LeftPanel />
        </div>

        {/* Bottom content area for performance analytics */}
        <div className="content-area-bottom">
          <BottomPanel />
        </div>
      </div>
    </Layout>
  );
}

export default StockProfilePage;
