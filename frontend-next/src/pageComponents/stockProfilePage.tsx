"use client";
//Components
import StockPriceChart from "@/components/charts/StockPriceChart";
import CompanyOverview from "@/components/info/CompanyOverview";
import KeyMetrics from "@/components/info/KeyMetrics";
import LatestNews from "@/components/info/LatestNews";
import BottomPanel from "@/components/info/BottomPanel";
import TickerSelector from "@/components/selectors/TickerSelector";

//Utils
import { useStockProfile } from "@/utils/hooks/useStockProfile";
import { useParams } from "next/navigation";

//Types
import { NewsArticle } from "@/utils/types/newsTypes";
import { stockInfoData, stockEntry } from "@/utils/types/stockData";

function StockProfilePage() {
  const params = useParams();
  const selectedTicker = params?.ticker as string;
  const {
    data: stockData,
    isLoading,
    error,
    stockMarketNewsData,
    stockMarketNewsError,
    stockMarketNewsLoading,
  } = useStockProfile({ ticker: selectedTicker });

  return (
    <div className="stock-profile-page">
      <div className="stock-profile-selectors-container">
        <TickerSelector />
      </div>
      <div className="main-content">
        {/* Chart positioned top-right */}
        <div className="chart-container">
          <StockPriceChart
            ticker={selectedTicker}
            stockData={
              stockData || {
                info_data: {} as stockInfoData,
                history_data: [] as stockEntry[],
              }
            }
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Left Panel - Company Info */}
        <CompanyOverview
          data={stockData?.info_data}
          isLoading={isLoading}
          error={error}
        />

        {/* Left Panel - Key Metrics */}
        <KeyMetrics
          data={stockData?.info_data}
          isLoading={isLoading}
          error={error}
        />

        {/* Left Panel - Latest News */}
        <LatestNews
          stockMarketNewsData={
            stockMarketNewsData || {
              market_news: {
                items: "",
                sentiment_score_definition: "",
                relevance_score_definition: "",
                feed: [] as NewsArticle[],
              },
            }
          }
          stockMarketNewsError={stockMarketNewsError}
          stockMarketNewsLoading={stockMarketNewsLoading}
        />
        {/* Bottom content area for performance analytics */}
        <BottomPanel
          ticker={selectedTicker}
          data={
            stockData || {
              info_data: {} as stockInfoData,
              history_data: [] as stockEntry[],
            }
          }
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}

export default StockProfilePage;
