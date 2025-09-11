"use client";
import MUIChart from "@/components/charts/MUIChart";
import { Box, Grid, Typography } from "@mui/material";

import { useStockProfile } from "@/utils/hooks/useStockProfile";
import { stockInfoData, stockEntry } from "@/utils/types/stockData";

const MarketChartOverview = () => {
  const marketTickers = {
    "^GSPC": "S&P 500",
    "^IXIC": "NASDAQ",
    "^DJI": "Dow Jones",
    "^VIX": "VIX",
  };

  const marketData = Object.fromEntries(
    Object.entries(marketTickers).map(([ticker, name]) => [
      ticker,
      { ...useStockProfile({ ticker }), name },
    ])
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          color: "#f7fafc",
          fontWeight: 600,
          mb: { xs: 2, sm: 3, md: 4 },
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
        }}
      >
        Market Indices
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }} sx={{ width: "100%" }}>
        {Object.entries(marketData).map(([ticker, data]) => (
          <Grid
            key={ticker}
            item
            xs={12}
            sm={6}
            md={6}
            lg={3}
            xl={3}
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MUIChart
              ticker={data.name}
              stockData={
                marketData[ticker].data || {
                  info_data: {} as stockInfoData,
                  history_data: [] as stockEntry[],
                }
              }
              isLoading={marketData[ticker].isLoading || false}
              error={marketData[ticker].error || null}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default MarketChartOverview;
