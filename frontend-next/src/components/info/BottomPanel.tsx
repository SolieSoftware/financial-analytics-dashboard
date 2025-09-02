"use client";
import React from "react";
import { useAppSelector } from "../redux/store";
import { useStockProfile } from "@/utils/hooks/useStockProfile";
import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Skeleton,
  Alert,
  AlertTitle,
  Chip
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShowChart,
  VolumeUp,
  Height,
  Speed,
  Assessment
} from "@mui/icons-material";

const BottomPanel: React.FC = () => {
  const { selectedTicker } = useAppSelector((state) => state.ticker);
  const { data: stockData, isLoading, error } = useStockProfile({ ticker: selectedTicker });

  const formatNumber = (num?: number): string => {
    if (!num) return "N/A";
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (volume?: number): string => {
    if (!volume) return "N/A";
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toLocaleString();
  };

  if (isLoading) {
    return (
      <Box>
        <Card sx={{ 
          backgroundColor: "rgba(26, 32, 44, 0.9)", 
          border: "1px solid rgba(74, 85, 104, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
        }}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Assessment sx={{ color: "#667eea" }} />
                <Typography variant="h6" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                  Performance Analytics
                </Typography>
              </Box>
            }
            sx={{ 
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              borderBottom: "1px solid rgba(74, 85, 104, 0.3)"
            }}
          />
          <CardContent>
            <Box sx={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 3
            }}>
              {Array.from({ length: 4 }).map((_, i: number) => (
                <Card key={i} sx={{ 
                  backgroundColor: "rgba(26, 32, 44, 0.8)", 
                  border: "1px solid rgba(74, 85, 104, 0.3)",
                  height: "100%"
                }}>
                  <CardContent>
                    <Skeleton variant="text" width={100} height={24} />
                    <Skeleton variant="text" width={80} height={32} />
                    <Skeleton variant="text" width={60} height={20} />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ 
          backgroundColor: "rgba(239, 68, 68, 0.1)", 
          border: "1px solid rgba(239, 68, 68, 0.3)" 
        }}>
          <AlertTitle>Error</AlertTitle>
          Error loading performance data: {error?.message || error?.toString()}
        </Alert>
      </Box>
    );
  }

  if (!selectedTicker) {
    return (
      <Box>
        <Card sx={{ 
          backgroundColor: "rgba(26, 32, 44, 0.9)", 
          border: "1px solid rgba(74, 85, 104, 0.3)",
          textAlign: "center",
          py: 6
        }}>
          <CardContent>
            <ShowChart sx={{ fontSize: 48, color: "#a0aec0", mb: 2 }} />
            <Typography variant="body1" sx={{ color: "#a0aec0" }}>
              Select a ticker to view performance analytics
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!stockData) {
    return (
      <Box>
        <Alert severity="info" sx={{ 
          backgroundColor: "rgba(59, 130, 246, 0.1)", 
          border: "1px solid rgba(59, 130, 246, 0.3)" 
        }}>
          No performance data available
        </Alert>
      </Box>
    );
  }

  function MetricCard({
    title,
    value,
    change,
    changePercent,
    icon,
    subtitle,
    showChange
  }: {
    title: string;
    value: string | number;
    change?: string | number;
    changePercent?: number;
    icon: React.ReactNode;
    subtitle?: string;
    showChange?: boolean;
  }) {
    const isPositive: boolean = (changePercent ?? 0) > 0;
    const isNegative: boolean = (changePercent ?? 0) < 0;
    const hasChange: boolean = changePercent !== undefined && changePercent !== null;

    return (
      <Card
        sx={{
          backgroundColor: "rgba(8, 10, 15, 0.9)",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          borderRadius: "12px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
          height: "100%",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
            borderColor: "rgba(102, 126, 234, 0.4)",
          },
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box sx={{ 
              color: "#667eea", 
              display: "flex", 
              alignItems: "center",
              fontSize: "1.25rem"
            }}>
              {icon}
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "#a0aec0",
                fontWeight: 650,
                fontSize: "1.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {title}
            </Typography>
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              color: "#f7fafc",
              fontWeight: 700,
              mb: 1,
              fontSize: "1.5rem",
              fontFamily: "monospace"
            }}
          >
            {typeof value === "number" ? value.toFixed(2) : value}
          </Typography>

          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: "#a0aec0",
                display: "block",
                mb: 1,
                fontSize: "0.7rem"
              }}
            >
              {subtitle}
            </Typography>
          )}

          {hasChange && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                color: isPositive ? "#68d391" : isNegative ? "#fc8181" : "#a0aec0"
              }}>
                {isPositive ? <TrendingUp sx={{ fontSize: 16 }} /> : 
                 isNegative ? <TrendingDown sx={{ fontSize: 16 }} /> : null}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: isPositive ? "#68d391" : isNegative ? "#fc8181" : "#a0aec0",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {typeof change === "number" ? change.toFixed(2) : change}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isPositive ? "#68d391" : isNegative ? "#fc8181" : "#a0aec0",
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
          )}
        </CardContent>
      </Card>
    );
  }

  const companyInfo = stockData?.info_data;

  return (
    <Box>
      <Card sx={{ 
        backgroundColor: "rgba(26, 32, 44, 0.9)", 
        border: "1px solid rgba(74, 85, 104, 0.3)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
      }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assessment sx={{ color: "#667eea" }} />
              <Typography variant="h6" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                Financial Profile
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)"
          }}
        />
        <CardContent>
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 3
          }}>
            <MetricCard
              title="Prev Close"
              value={companyInfo?.previousClose ?? "N/A"}
              icon={<AttachMoney />}
            />
            
            <MetricCard
              title="52W Range"
              value={
                companyInfo?.fiftyTwoWeekRange
                  ? `${companyInfo.fiftyTwoWeekRange} ${companyInfo.currency}`
                  : "N/A"
              }
              icon={<ShowChart />}
            />

            <MetricCard
              title="Market Cap"
              value={
                companyInfo?.marketCap
                  ? `${(formatNumber(companyInfo.marketCap))}`
                  : "N/A"
              }
              icon={<ShowChart />}
              subtitle="Total market value"
              showChange={false}
            />

          <MetricCard
              title="Open"
              value={companyInfo?.open ?? "N/A"}
              icon={<AttachMoney />}
            />

          <MetricCard
              title="P/E Ratio"
              value={companyInfo?.trailingPE || "N/A"}
              icon={<Assessment />}
              subtitle="Trailing P/E Ratio"
            />

          <MetricCard
                title="Dividend Yield"
                value={
                  companyInfo?.dividendYield 
                    ? `${(companyInfo.dividendYield * 100).toFixed(2)}%`
                    : "N/A"
                }
                icon={<AttachMoney />}
              />

          <MetricCard
              title="Day Range"
              value={
                companyInfo?.regularMarketDayRange
                  ? `${companyInfo.regularMarketDayRange} ${companyInfo.currency}`
                  : "N/A"
              }
              icon={<ShowChart />}
            />
            
            <MetricCard
              title="Volume"
              value={
                companyInfo?.volume
                  ? formatVolume(companyInfo.volume)
                  : "N/A"
              }
              icon={<VolumeUp />}
            />

            <MetricCard
              title="EPS"
              value={companyInfo?.trailingEps || "N/A"}
              icon={<TrendingUp />}
              subtitle="Trailing EPS"
            />

            
          
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BottomPanel;
