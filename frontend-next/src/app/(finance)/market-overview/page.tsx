import Layout from "../layout";
import MarketChartOverview from "@/components/charts/MarketChartOverview";
import MarketSummary from "@/components/info/MarketSummary";
import { Box, Typography, Container } from "@mui/material";

const MarketOverviewPage = () => {
  return (
    <Layout>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3, md: 4 },
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "#f7fafc",
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
                mb: 1,
              }}
            >
              Market Overview
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#a0aec0",
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              }}
            >
              Real-time market data and analysis
            </Typography>
          </Box>

          {/* Charts Section */}
          <Box
            sx={{
              width: "100%",
              mb: { xs: 3, sm: 4, md: 6 },
            }}
          >
            <MarketChartOverview />
          </Box>

          {/* News Summary Section */}
          <Box
            sx={{
              width: "100%",
              maxHeight: "100vh",
              overflowY: "auto",
            }}
          >
            <MarketSummary />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default MarketOverviewPage;
