"use client";
import { useAppSelector } from "../redux/store";
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
  AlertTitle
} from "@mui/material";
import { 
  Business, 
  People, 
  AttachMoney, 
  TrendingUp, 
  BarChart, 
  Info, 
  Public 
} from "@mui/icons-material";

const LeftPanel = () => {
  const selectedTicker = useAppSelector(
    (state) => state.ticker.selectedTicker
  );
  const { stockData, status, error } = useAppSelector((state) => state.stock);

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

  if (status === "loading") {
    return (
      <Box sx={{ spaceY: 3 }}>
        <Card sx={{ backgroundColor: "rgba(26, 32, 44, 0.9)", border: "1px solid rgba(74, 85, 104, 0.3)" }}>
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

  if (status === "failed") {
    return (
      <Box>
        <Alert severity="error" sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
          <AlertTitle>Error</AlertTitle>
          Error loading company info: {error}
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
            <Business sx={{ fontSize: 48, color: "#a0aec0", mb: 2 }} />
            <Typography variant="body1" sx={{ color: "#a0aec0" }}>
              Select a ticker to view company information
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!stockData) {
    return (
      <Box>
        <Alert severity="info" sx={{ backgroundColor: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
          <Info sx={{ mr: 1 }} />
          No company information available
        </Alert>
      </Box>
    );
  }

  const companyInfo = stockData.info_data;

  return (
    <Box sx={{ maxWidth: "md" }}>
      {/* Company Overview */}
      <Card sx={{ 
        mb: 3, 
        backgroundColor: "rgba(26, 32, 44, 0.9)", 
        border: "1px solid rgba(74, 85, 104, 0.3)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
      }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Business sx={{ color: "#667eea" }} />
              <Typography variant="h6" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                Company Overview
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)"
          }}
        />
        <CardContent sx={{ spaceY: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: "#f7fafc", fontWeight: 600, mb: 1 }}>
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
                    border: "1px solid rgba(102, 126, 234, 0.3)"
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
                    color: "#a0aec0"
                  }}
                />
              )}
            </Box>
          </Box>

          {companyInfo?.longBusinessSummary && (
            <Typography variant="body2" sx={{ color: "#cbd5e0", lineHeight: 1.6 }}>
              {companyInfo.longBusinessSummary}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card sx={{ 
        mb: 3, 
        backgroundColor: "rgba(26, 32, 44, 0.9)", 
        border: "1px solid rgba(74, 85, 104, 0.3)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
      }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BarChart sx={{ color: "#667eea" }} />
              <Typography variant="h6" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                Key Metrics
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)"
          }}
        />
        <CardContent>
          <Box sx={{ spaceY: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <People sx={{ color: "#a0aec0", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 500 }}>
                  Employees
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#f7fafc" }}>
                {companyInfo?.fullTimeEmployees?.toLocaleString() || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: "rgba(74, 85, 104, 0.3)" }} />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AttachMoney sx={{ color: "#a0aec0", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 500 }}>
                  Total Cash
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#f7fafc", fontFamily: "monospace" }}>
                {formatNumber(companyInfo?.totalCash)}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, ml: 3 }}>
              <Typography variant="body2" sx={{ color: "#a0aec0" }}>
                Per Share
              </Typography>
              <Typography variant="body2" sx={{ color: "#f7fafc", fontFamily: "monospace" }}>
                ${companyInfo?.totalCashPerShare?.toFixed(2) || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 2, borderColor: "rgba(74, 85, 104, 0.3)" }} />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp sx={{ color: "#a0aec0", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 500 }}>
                  EBITDA
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#f7fafc", fontFamily: "monospace" }}>
                {formatNumber(companyInfo?.ebitda)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Valuation Metrics */}
      <Card sx={{ 
        mb: 3, 
        backgroundColor: "rgba(26, 32, 44, 0.9)", 
        border: "1px solid rgba(74, 85, 104, 0.3)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
      }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BarChart sx={{ color: "#667eea" }} />
              <Typography variant="h6" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                Valuation
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)"
          }}
        />
        <CardContent>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="caption" sx={{ color: "#a0aec0", display: "block", mb: 0.5 }}>
                Trailing P/E
              </Typography>
              <Typography variant="h5" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                {companyInfo?.trailingPE?.toFixed(2) || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#a0aec0", display: "block", mb: 0.5 }}>
                Forward P/E
              </Typography>
              <Typography variant="h5" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                {companyInfo?.forwardPE?.toFixed(2) || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: "rgba(74, 85, 104, 0.3)" }} />

          <Box sx={{ spaceY: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 500 }}>
                Enterprise Value
              </Typography>
              <Typography variant="body2" sx={{ color: "#f7fafc", fontFamily: "monospace" }}>
                {formatNumber(companyInfo?.enterpriseValue)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ color: "#e2e8f0", fontWeight: 500 }}>
                Profit Margins
              </Typography>
              <Typography variant="body2" sx={{ color: "#f7fafc", fontFamily: "monospace" }}>
                {formatPercentage(companyInfo?.profitMargins)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Market Summary */}
      <Card sx={{ 
        backgroundColor: "rgba(26, 32, 44, 0.9)", 
        border: "1px solid rgba(74, 85, 104, 0.3)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)"
      }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Public sx={{ color: "#667eea" }} />
              <Typography variant="h6" sx={{ color: "#f7fafc", fontWeight: 600 }}>
                Market Summary
              </Typography>
            </Box>
          }
          sx={{ 
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)"
          }}
        />
        <CardContent>
          <Typography variant="body2" sx={{ color: "#cbd5e0", lineHeight: 1.6 }}>
            Markets are showing positive momentum with tech stocks leading the rally. 
            The overall market sentiment remains optimistic as investors continue to 
            focus on growth opportunities and innovation-driven companies.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeftPanel;
