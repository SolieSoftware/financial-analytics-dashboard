"use client";
import React from "react";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/store";
import { stockEntryCleaned, stockEntry } from "@/utils/types/stockData";
import dayjs from "dayjs";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Skeleton,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  CalendarToday,
  AttachMoney,
  Speed,
  Warning,
} from "@mui/icons-material";

const MUIChart: React.FC = () => {
  const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);
  const { stockData, status, error } = useAppSelector((state) => state.stock);

  const [data, setData] = useState<stockEntryCleaned[]>([]);
  const [chartStats, setChartStats] = useState({
    priceChange: 0,
    priceChangePercent: 0,
    highPrice: 0,
    lowPrice: 0,
    currentPrice: 0,
  });

  useEffect(() => {
    if (stockData?.history_data) {
      const cleanedData = stockData.history_data.map((item: stockEntry) => ({
        ...item,
        Date: dayjs(item.Date).toDate(),
      }));

      setData(cleanedData);

      // Calculate chart statistics
      if (cleanedData.length > 0) {
        const prices = cleanedData.map((d) => d.Close);
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const priceChange = lastPrice - firstPrice;
        const priceChangePercent = (priceChange / firstPrice) * 100;

        setChartStats({
          priceChange,
          priceChangePercent,
          highPrice: Math.max(...prices),
          lowPrice: Math.min(...prices),
          currentPrice: lastPrice,
        });
      }
    } else {
      setData([]);
    }
  }, [stockData]);

  // Loading State
  if (status === "loading") {
    return (
      <Card
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          borderRadius: "20px",
          height: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ p: 3, flex: 1 }}>
          {/* Header Skeleton */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ mr: 2, bgcolor: "rgba(148, 163, 184, 0.1)" }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="60%"
                height={28}
                sx={{ bgcolor: "rgba(148, 163, 184, 0.1)" }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={20}
                sx={{ bgcolor: "rgba(148, 163, 184, 0.1)" }}
              />
            </Box>
          </Box>

          {/* Chart Loading Animation */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              minHeight: "300px",
            }}
          >
            <Speed sx={{ fontSize: 48, color: "#3b82f6", mb: 2 }} />
            <LinearProgress
              sx={{
                width: "200px",
                mb: 2,
                height: "6px",
                borderRadius: "3px",
                backgroundColor: "rgba(148, 163, 184, 0.1)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  borderRadius: "3px",
                },
              }}
            />
            <Typography
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Loading chart data for {selectedTicker}...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (status === "failed") {
    return (
      <Card
        sx={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "20px",
          height: "500px",
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Alert
            severity="error"
            icon={<Warning sx={{ fontSize: 20 }} />}
            sx={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              color: "#fecaca",
              "& .MuiAlert-icon": {
                color: "#ef4444",
              },
            }}
          >
            <AlertTitle sx={{ color: "#ef4444", fontWeight: 600 }}>
              Chart Loading Error
            </AlertTitle>
            <Typography sx={{ color: "#fca5a5" }}>
              {error || "Failed to load chart data"}
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (!data.length) {
    return (
      <Card
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          border: "1px solid rgba(148, 163, 184, 0.1)",
          borderRadius: "20px",
          height: "500px",
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <BarChart sx={{ fontSize: 64, color: "#94a3b8", mb: 2 }} />
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "1.125rem",
              fontWeight: 600,
              mb: 1,
            }}
          >
            No Chart Data Available
          </Typography>
          <Typography
            sx={{
              color: "#475569",
              fontSize: "0.875rem",
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            Select a ticker from the dashboard to view historical price data and
            trends
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const isPositive: boolean = chartStats.priceChangePercent > 0;
  const isNegative: boolean = chartStats.priceChangePercent < 0;

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        borderRadius: "20px",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: isPositive
            ? "linear-gradient(90deg, #22c55e, #16a34a)"
            : isNegative
            ? "linear-gradient(90deg, #ef4444, #dc2626)"
            : "linear-gradient(90deg, #3b82f6, #2563eb)",
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Chart Header */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                borderRadius: "16px",
                background: isPositive
                  ? "rgba(34, 197, 94, 0.1)"
                  : isNegative
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(59, 130, 246, 0.1)",
                mr: 3,
              }}
            >
              <BarChart
                sx={{
                  fontSize: 24,
                  color: isPositive
                    ? "#22c55e"
                    : isNegative
                    ? "#ef4444"
                    : "#3b82f6",
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  mb: 0.5,
                }}
              >
                {selectedTicker} Price Chart
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                }}
              >
                Historical price movement • {data.length} data points
              </Typography>
            </Box>
          </Box>

          {/* Price Statistics */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AttachMoney sx={{ fontSize: 16, color: "#94a3b8" }} />
              <Typography
                variant="h6"
                sx={{
                  color: "#f8fafc",
                  fontWeight: 700,
                  fontSize: "1.25rem",
                }}
              >
                ${chartStats.currentPrice.toFixed(2)}
              </Typography>
            </Box>

            <Chip
              icon={
                isPositive ? (
                  <TrendingUp sx={{ fontSize: 12 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 12 }} />
                )
              }
              label={`${isPositive ? "+" : ""}${chartStats.priceChange.toFixed(
                2
              )} (${chartStats.priceChangePercent.toFixed(2)}%)`}
              size="small"
              sx={{
                backgroundColor: isPositive
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(239, 68, 68, 0.15)",
                color: isPositive ? "#22c55e" : "#ef4444",
                border: `1px solid ${
                  isPositive
                    ? "rgba(34, 197, 94, 0.3)"
                    : "rgba(239, 68, 68, 0.3)"
                }`,
                fontWeight: 600,
                fontSize: "0.75rem",
                "& .MuiChip-icon": {
                  color: isPositive ? "#22c55e" : "#ef4444",
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.625rem",
                    display: "block",
                  }}
                >
                  HIGH
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#22c55e",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  ${chartStats.highPrice.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.625rem",
                    display: "block",
                  }}
                >
                  LOW
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#ef4444",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  ${chartStats.lowPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Chart Container */}
        <Box
          sx={{
            height: "400px",
            px: 2,
            pb: 2,
            background: "rgba(15, 23, 42, 0.5)",
            borderRadius: "0 0 20px 20px",
          }}
        >
          <LineChart
            xAxis={[
              {
                data: data.map((d) => d.Date),
                label: "Time Period",
                scaleType: "time",
                valueFormatter: (value) => dayjs(value).format("MMM DD"),
                tickLabelStyle: {
                  fill: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: 500,
                },
              },
            ]}
            yAxis={[
              {
                label: "Price ($)",
                tickLabelStyle: {
                  fill: "#94a3b8",
                  fontSize: "11px",
                  fontWeight: 500,
                },
              },
            ]}
            series={[
              {
                data: data.map((d) => d.Close),
                label: `${selectedTicker} Close Price`,
                showMark: false,
                color: isPositive
                  ? "#22c55e"
                  : isNegative
                  ? "#ef4444"
                  : "#3b82f6",
                curve: "linear",
              },
            ]}
            margin={{ left: 60, right: 20, top: 20, bottom: 60 }}
            sx={{
              width: "100%",
              height: "100%",
              "& .MuiChartsAxis-root": {
                "& .MuiChartsAxis-line": {
                  stroke: "rgba(148, 163, 184, 0.2)",
                  strokeWidth: 1,
                },
                "& .MuiChartsAxis-tick": {
                  stroke: "rgba(148, 163, 184, 0.3)",
                  strokeWidth: 1,
                },
              },
              "& .MuiChartsAxis-label": {
                fill: "#94a3b8 !important",
                fontSize: "12px !important",
                fontWeight: "600 !important",
              },
              "& .MuiChartsLegend-root": {
                "& .MuiChartsLegend-series": {
                  "& text": {
                    fill: "#e2e8f0 !important",
                    fontSize: "12px !important",
                    fontWeight: "500 !important",
                  },
                },
              },
              "& .MuiChartsTooltip-root": {
                backgroundColor: "rgba(15, 23, 42, 0.95) !important",
                border: "1px solid rgba(148, 163, 184, 0.2) !important",
                borderRadius: "12px !important",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3) !important",
                "& .MuiChartsTooltip-paper": {
                  backgroundColor: "transparent !important",
                  color: "#f8fafc !important",
                },
                "& .MuiChartsTooltip-table": {
                  "& td": {
                    color: "#f8fafc !important",
                    fontSize: "12px !important",
                    fontWeight: "500 !important",
                  },
                },
              },
              "& .MuiLineElement-root": {
                strokeWidth: 2.5,
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
              },
              "& .MuiChartsGrid-line": {
                stroke: "rgba(148, 163, 184, 0.08)",
                strokeDasharray: "2 4",
              },
            }}
            grid={{ vertical: true, horizontal: true }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MUIChart;
