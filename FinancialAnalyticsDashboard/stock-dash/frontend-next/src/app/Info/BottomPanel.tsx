"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchStockData } from "../redux/stockSlice";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Container,
} from "@mui/material";

const BottomPanel = () => {
  const dispatch = useDispatch();
  const selectedTicker = useSelector(
    (state: any) => state.ticker.selectedTicker
  );
  const { stockInfo, status, error } = useSelector((state: any) => state.stock);

  useEffect(() => {
    if (!selectedTicker) return;
    dispatch(fetchStockData(selectedTicker) as any);
  }, [selectedTicker, dispatch]);

  if (status === "loading") {
    return (
      <div style={{ color: "#a0aec0", fontSize: "1rem" }}>
        Loading company info...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ color: "#fc8181", fontSize: "1rem" }}>
        Error loading company info: {error}
      </div>
    );
  }

  if (!selectedTicker) {
    return (
      <div style={{ color: "#a0aec0", fontSize: "1rem" }}>
        Select a ticker to view company information
      </div>
    );
  }

  if (!stockInfo) {
    return (
      <div style={{ color: "#a0aec0", fontSize: "1rem" }}>
        No company information available
      </div>
    );
  }

  function MetricCard({
    title,
    value,
    change,
    changePercent,
  }: {
    title: string;
    value: any;
    change: any;
    changePercent: any;
  }) {
    const isPositive = changePercent > 0;
    const isNegative = changePercent < 0;

    return (
      <Card
        sx={{
          backgroundColor: "rgba(26, 32, 44, 0.9)",
          color: "#e2e8f0",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          borderRadius: "12px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
            borderColor: "rgba(102, 126, 234, 0.4)",
          },
        }}
      >
        <CardContent sx={{ padding: "1.5rem" }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              color: "#f7fafc",
              fontWeight: 600,
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            component="p"
            sx={{
              color: "#f7fafc",
              fontWeight: 700,
              marginBottom: "0.5rem",
              fontSize: "1.5rem",
            }}
          >
            {typeof value === "number" ? value.toFixed(2) : value}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: isPositive
                  ? "#68d391"
                  : isNegative
                  ? "#fc8181"
                  : "#a0aec0",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {typeof change === "number" ? change.toFixed(2) : change}
            </Typography>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: isPositive
                  ? "#68d391"
                  : isNegative
                  ? "#fc8181"
                  : "#a0aec0",
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            >
              (
              {typeof changePercent === "number"
                ? changePercent.toFixed(2)
                : changePercent}
              %)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bottom-panel">
      <div className="bottom-panel-header">
        <Typography
          variant="h6"
          component="h2"
          sx={{
            color: "#f7fafc",
            fontWeight: 600,
            marginBottom: "1.5rem",
            fontSize: "1.25rem",
            letterSpacing: "-0.025em",
          }}
        >
          Performance Analytics
        </Typography>
      </div>
      <div className="bottom-panel-content">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 3,
          }}
        >
          <MetricCard
            title="Current Price"
            value={stockInfo.info?.regularMarketPrice || "N/A"}
            change={stockInfo.info?.regularMarketChange || "N/A"}
            changePercent={stockInfo.info?.regularMarketChangePercent || 0}
          />
          <MetricCard
            title="Market Cap"
            value={
              stockInfo.info?.marketCap
                ? `${(stockInfo.info.marketCap / 1e9).toFixed(2)}B`
                : "N/A"
            }
            change={0}
            changePercent={0}
          />
          <MetricCard
            title="Volume"
            value={
              stockInfo.info?.volume
                ? `${(stockInfo.info.volume / 1e6).toFixed(2)}M`
                : "N/A"
            }
            change={0}
            changePercent={0}
          />
          <MetricCard
            title="52W High"
            value={stockInfo.info?.fiftyTwoWeekHigh || "N/A"}
            change={0}
            changePercent={0}
          />
        </Box>
      </div>
    </div>
  );
};

export default BottomPanel;
