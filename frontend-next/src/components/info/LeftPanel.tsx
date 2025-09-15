"use client";

import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  Box,
  Chip,
  Divider,
  Skeleton,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Business,
  People,
  AttachMoney,
  TrendingUp,
  BarChart,
  Info,
  CorporateFare,
  Percent,
  Newspaper,
} from "@mui/icons-material";
import Link from "next/link";
import { NewsArticle } from "@/utils/types/newsTypes";
import { stockDataResponse } from "@/utils/types/stockData";  
import { stockMarketNewsResponse } from "@/utils/types/newsTypes";


const LeftPanel = ({
  ticker,
  data,
  isLoading,
  error,
  stockMarketNewsData,
  stockMarketNewsError,
  stockMarketNewsLoading,
}: {
  ticker: string,
  data: stockDataResponse,
  isLoading: boolean,
  error: string,
  stockMarketNewsData: stockMarketNewsResponse,
  stockMarketNewsError: string,
  stockMarketNewsLoading: boolean,
}) => {
  const selectedTicker = ticker;
  const stockData = data;

  const formatNumber = (num?: number) => {
    if (!num) return "N/A";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercentage = (num?: number) => {
    if (!num) return "N/A";
    return `${(num * 100).toFixed(2)}%`;
  };

  const formatSentiment = (sentimentScore?: number) => {
    if (!sentimentScore) return { label: "N/A", color: "#a0aec0" };

    switch (true) {
      case sentimentScore > 0.35:
        return { label: "Bullish", color: "#68d391" };
      case sentimentScore < 0.15:
        return { label: "Somewhat Bullish", color: "#68d3c7" };
      case sentimentScore > -0.15:
        return { label: "Neutral", color: "#a0aec0" };
      case sentimentScore > -0.35:
        return { label: "Somewhat Bearish", color: "#fcbf81" };
      case sentimentScore < -0.35:
        return { label: "Bearish", color: "#fc8181" };
      default:
        return { label: "Neutral", color: "#a0aec0" };
    }
  };

  const parseCustomTimestamp = (timestamp: string) => {
    if (!timestamp) return new Date();

    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(4, 6);
    const day = timestamp.slice(6, 8);
    const hour = timestamp.slice(9, 11);
    const minute = timestamp.slice(11, 13);
    const second = timestamp.slice(13, 15);

    const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    return new Date(isoString);
  };

  if (!selectedTicker) {
    return (
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
            <Business sx={{ fontSize: 48, color: "#a0aec0", mb: 2 }} />
            <Typography variant="body1" sx={{ color: "#a0aec0" }}>
              Select a ticker to view company information
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ spaceY: 3 }}>
        <Card
          sx={{
            backgroundColor: "rgba(26, 32, 44, 0.9)",
            border: "1px solid rgba(74, 85, 104, 0.3)",
          }}
        >
          <CardHeader>
            <Skeleton variant="text" width={200} height={32} />
          </CardHeader>
          <CardContent>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width="100%" height={20} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert
          severity="error"
          sx={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <AlertTitle>Error</AlertTitle>
          Error loading company info: {error || error?.toString()}
        </Alert>
      </Box>
    );
  }

  if (!stockData) {
    return (
      <Box>
        <Alert
          severity="info"
          sx={{
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
          }}
        >
          <Info sx={{ mr: 1 }} />
          No company information available
        </Alert>
      </Box>
    );
  }

  const companyInfo = stockData.info_data;

  const keyMetrics = [
    {
      label: "Employees",
      value: companyInfo?.fullTimeEmployees?.toLocaleString() || "N/A",
      icon: <People sx={{ color: "#a0aec0", fontSize: 20 }} />,
    },
    {
      label: "Total Cash",
      value: formatNumber(companyInfo?.totalCash),
      icon: <AttachMoney sx={{ color: "#a0aec0", fontSize: 20 }} />,
    },
    {
      label: "Per Share",
      value: `${companyInfo?.totalCashPerShare?.toFixed(2) || "N/A"}`,
      icon: <Percent sx={{ color: "#a0aec0", fontSize: 20 }} />,
    },
    {
      label: "EBITDA",
      value: formatNumber(companyInfo?.ebitda),
      icon: <TrendingUp sx={{ color: "#a0aec0", fontSize: 20 }} />,
    },
    {
      label: "Enterprise Value",
      value: formatNumber(companyInfo?.enterpriseValue),
      icon: <CorporateFare sx={{ color: "#a0aec0", fontSize: 20 }} />,
    },
    {
      label: "Profit Margins",
      value: formatPercentage(companyInfo?.profitMargins),
      icon: <Percent sx={{ color: "#a0aec0", fontSize: 20 }} />,
    }
  ]

  const displayKeyMetrics = (
    label: string,
    value: string,
    icon: React.ReactNode,
  ) => {
    return (
      <>
        <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {icon}
          <Typography
            variant="body2"
            sx={{ color: "#e2e8f0", fontWeight: 500 }}
          >
            {label}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#f7fafc" }}>
          {value || "N/A"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: "rgba(74, 85, 104, 0.3)" }} />
    </>
    );
  };

  return (
    <Box sx={{ maxWidth: "md" }}>
      {/* Company Overview */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: "rgba(26, 32, 44, 0.9)",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Business sx={{ color: "#667eea" }} />
              <Typography
                variant="h6"
                sx={{ color: "#f7fafc", fontWeight: 600 }}
              >
                Company Overview
              </Typography>
            </Box>
          }
          sx={{
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)",
          }}
        />
        <CardContent sx={{ spaceY: 2 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "#f7fafc", fontWeight: 600, mb: 1 }}
            >
              {companyInfo?.shortName || "N/A"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {companyInfo?.sector && (
                <Chip
                  label={companyInfo.sector}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(102, 126, 234, 0.2)",
                    color: "#667eea",
                    border: "1px solid rgba(102, 126, 234, 0.3)",
                  }}
                />
              )}
              {companyInfo?.industry && (
                <Chip
                  label={companyInfo.industry}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(74, 85, 104, 0.5)",
                    color: "#a0aec0",
                  }}
                />
              )}
            </Box>
          </Box>

          {companyInfo?.longBusinessSummary && (
            <Typography
              variant="body2"
              sx={{ color: "#cbd5e0", lineHeight: 1.6 }}
            >
              {companyInfo.longBusinessSummary}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card
        sx={{
          mb: 3,
          backgroundColor: "rgba(26, 32, 44, 0.9)",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BarChart sx={{ color: "#667eea" }} />
              <Typography
                variant="h6"
                sx={{ color: "#f7fafc", fontWeight: 600 }}
              >
                Key Metrics
              </Typography>
            </Box>
          }
          sx={{
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)",
          }}
        />

        {/* Key Metrics List */}
        <CardContent>
          <Box sx={{ spaceY: 2 }}>
            {keyMetrics.map((metric) => (
              displayKeyMetrics(metric.label, metric.value, metric.icon)
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Latest News */}
      {stockMarketNewsData && (
        <Card
          sx={{
            mb: 3,
            backgroundColor: "rgba(26, 32, 44, 0.9)",
            border: "1px solid rgba(74, 85, 104, 0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Newspaper sx={{ color: "#667eea" }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#f7fafc", fontWeight: 600 }}
                >
                  News
                </Typography>
              </Box>
            }
            sx={{
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              borderBottom: "1px solid rgba(74, 85, 104, 0.3)",
            }}
          />
          <CardContent>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 3,
                mt: 1,
              }}
            >
              {stockMarketNewsData["market_news"]["feed"]?.map((news: NewsArticle, index: number) => (
                <>
                  <Link
                    href={news.url}
                    target="news_link"
                    className="block transform transition-all duration-300 hover:scale-101 hover:-translate-y-1"
                  >
                    <Box key={index}>
                      <Typography
                        variant="body2"
                        sx={{ color: "#e2e8f0", fontWeight: 500 }}
                      >
                        {(() => {
                          const sentiment = formatSentiment(
                            news.overall_sentiment_score
                          );
                          return (
                            <>
                              {news.title} -{" "}
                              <strong style={{ color: sentiment.color }}>
                                {sentiment.label}
                              </strong>{" "}
                              -{" "}
                              {parseCustomTimestamp(
                                news.time_published
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </>
                          );
                        })()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#e2e8f0", fontWeight: 500 }}
                      >
                        {news.summary}
                      </Typography>
                    </Box>
                  </Link>
                  <Divider
                    sx={{ my: 2, borderColor: "rgba(74, 85, 104, 0.3)" }}
                  />
                </>
              ))}
            </Box>

            <Divider sx={{ my: 2, borderColor: "rgba(74, 85, 104, 0.3)" }} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LeftPanel;
