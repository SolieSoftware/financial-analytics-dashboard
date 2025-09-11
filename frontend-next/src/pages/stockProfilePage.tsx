"use client";
//Components
import MUIChart from "@/components/charts/MUIChart";
import LeftPanel from "@/components/info/LeftPanel";
import BottomPanel from "@/components/info/BottomPanel";
import { TickerSelector } from "@/components/selectors/TickerSelector";

//Utils
import { useStockProfile } from "@/utils/hooks/useStockProfile";
import { useParams } from "next/navigation";

//Types
import { NewsArticle } from "@/utils/types/newsTypes";
import { stockInfoData, stockEntry } from "@/utils/types/stockData";
      
function StockProfilePage() {
  const params  = useParams();
  const selectedTicker = params?.ticker as string;
  const { 
    data: stockData, 
    isLoading, 
    error, 
    stockMarketNewsData, 
    stockMarketNewsError, 
    stockMarketNewsLoading 
} = useStockProfile({ ticker: selectedTicker });
  
  return (
    <>
      <div className="flex flex-row flex justify-center">
        <div className="w-1/4">
          <TickerSelector />
        </div>
      </div>
      <div className="main-content">
        {/* Chart positioned top-right */}
        <div className="chart-container">
          <MUIChart 
            ticker={selectedTicker} 
            stockData={stockData || {
            info_data: {} as stockInfoData,
            history_data: [] as stockEntry[],
          }} isLoading={isLoading} error={error} />
        </div>

        {/* Left content area for company information */}
        <div className="content-area-left">
          <LeftPanel 
          ticker={selectedTicker}
          data={stockData || {
            info_data: {} as stockInfoData,
            history_data: [] as stockEntry[],
          }} 
          isLoading={isLoading} 
          error={error || error?.toString()} 
          stockMarketNewsData={stockMarketNewsData || {
            market_news: {
              items: "",
              sentiment_score_definition: "",
              relevance_score_definition: "",
              feed: [] as NewsArticle[],
            },
          }} 
          stockMarketNewsError={stockMarketNewsError || stockMarketNewsError?.toString()} 
          stockMarketNewsLoading={stockMarketNewsLoading} />
        </div>

        {/* Bottom content area for performance analytics */}
        <div className="content-area-bottom">
          <BottomPanel 
          ticker={selectedTicker}
          data={stockData || {
            info_data: {} as stockInfoData,
            history_data: [] as stockEntry[],
          }} 
          isLoading={isLoading} 
          error={error || error?.toString()} />
        </div>
      </div>
      </>
  );
}

export default StockProfilePage;