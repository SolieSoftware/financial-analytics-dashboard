"use client";
import MUIChart from "@/components/charts/MUIChart";
import LeftPanel from "@/components/info/LeftPanel";
import BottomPanel from "@/components/info/BottomPanel";
import Layout from "../layout";
import { TickerSelector } from "@/components/selectors/TickerSelector";
import { useStockProfile } from "@/utils/hooks/useStockProfile";
import { useAppSelector } from "@/components/redux/store";
import { CardContent, Typography, Card, Box } from "@mui/material";
import { ShowChart } from "@mui/icons-material";

function StockProfilePage() {
  const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);

  const {
    data: stockData,
    isLoading,
    error,
  } = useStockProfile({ ticker: selectedTicker });


  return (
    <Layout>
      <div className="flex flex-row flex justify-center">
        <div className="w-1/4">
          <TickerSelector />
        </div>
      </div>
      {!selectedTicker && ( 
      <Box>
      <Card
        sx={{
          backgroundColor: "rgba(26, 32, 44, 0.9)",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          textAlign: "center",
          py: 6,
        }}
      >
        <CardContent>
          <ShowChart sx={{ fontSize: 48, color: "#a0aec0", mb: 2 }} />
          <Typography variant="body1" sx={{ color: "#a0aec0" }}>
            Select a ticker to view the price chart
          </Typography>
        </CardContent>
      </Card>
    </Box>
      )}

      <div className="main-content">
        {/* Chart positioned top-right */}
        {selectedTicker && <div className="chart-container">
          <MUIChart
            ticker={selectedTicker}
            stockData={stockData}
            isLoading={isLoading}
            error={error}
          />
        </div>}

        {/* Left content area for company information */}
        {selectedTicker && <div className="content-area-left">
          <LeftPanel />
        </div>} 

        {/* Bottom content area for performance analytics */}
        {selectedTicker && <div className="content-area-bottom">
          <BottomPanel />
        </div>}
      </div>
    </Layout>
  );
}

export default StockProfilePage;
