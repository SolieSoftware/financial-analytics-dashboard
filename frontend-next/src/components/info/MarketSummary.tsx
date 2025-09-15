"use client";
import { useMarketProfile } from "@/utils/hooks/useMarketProfile";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
} from "@mui/material";
import { Newspaper, TrendingUp, TrendingDown } from "@mui/icons-material";
import { NewsArticle } from "@/utils/types/newsTypes";

import { LoadingPage } from "@/components/default/LoadingPage";
import { ErrorPage } from "@/components/default/ErrorPage";

const MarketSummary = () => {
  const { data, error, isLoading } = useMarketProfile();

  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LoadingPage />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%" }}>
        <ErrorPage error={error} />
      </Box>
    );
  }

  const formatSentiment = (sentimentScore?: number) => {
    if (!sentimentScore) return { label: "N/A", color: "#a0aec0", icon: null };

    switch (true) {
      case sentimentScore > 0.35:
        return { label: "Bullish", color: "#68d391", icon: <TrendingUp /> };
      case sentimentScore > 0.15:
        return {
          label: "Somewhat Bullish",
          color: "#68d3c7",
          icon: <TrendingUp />,
        };
      case sentimentScore > -0.15:
        return { label: "Neutral", color: "#a0aec0", icon: null };
      case sentimentScore > -0.35:
        return {
          label: "Somewhat Bearish",
          color: "#fcbf81",
          icon: <TrendingDown />,
        };
      case sentimentScore < -0.35:
        return { label: "Bearish", color: "#fc8181", icon: <TrendingDown /> };
      default:
        return { label: "Neutral", color: "#a0aec0", icon: null };
    }
  };

  const newCard = (article: NewsArticle) => {
    const sentiment = formatSentiment(article.overall_sentiment_score);

    return (
      <Box key={article.title} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Card
          sx={{
            backgroundColor: "rgba(26, 32, 44, 0.9)",
            border: "1px solid rgba(74, 85, 104, 0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            overflow: "hidden",
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          {article.banner_image && (
            <CardMedia
              component="img"
              image={article.banner_image}
              alt={article.title}
              sx={{
                height: { xs: 200, sm: 250, md: 300 }, // Responsive height in sx
                objectFit: 'cover'
              }}
            />
          )}
          <CardContent sx={{ padding: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                mb: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
              >
                <Newspaper
                  sx={{ color: "#667eea", fontSize: { xs: 18, sm: 20 } }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#f7fafc",
                    fontWeight: 600,
                    flex: 1,
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {article.title}
                </Typography>
              </Box>
              {sentiment.icon && (
                <Box
                  sx={{
                    color: sentiment.color,
                    alignSelf: { xs: "flex-start", sm: "center" },
                  }}
                >
                  {sentiment.icon}
                </Box>
              )}
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#cbd5e0",
                lineHeight: 1.6,
                mb: 2,
                fontSize: { xs: "0.875rem", sm: "0.9rem" },
              }}
            >
              {article.summary}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                label={sentiment.label}
                size="small"
                sx={{
                  backgroundColor: `${sentiment.color}20`,
                  color: sentiment.color,
                  border: `1px solid ${sentiment.color}40`,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                }}
              />
              {article.source && (
                <Chip
                  label={article.source}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(74, 85, 104, 0.5)",
                    color: "#a0aec0",
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const newCards = (articles: NewsArticle[]) => {
    return articles.map((article: NewsArticle) => newCard(article));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          mb: 3,
          backgroundColor: "rgba(26, 32, 44, 0.9)",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardContent
          sx={{
            backgroundColor: "rgba(102, 126, 234, 0.1)",
            borderBottom: "1px solid rgba(74, 85, 104, 0.3)",
            padding: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Newspaper
              sx={{ color: "#667eea", fontSize: { xs: 20, sm: 24 } }}
            />
            <Typography
              variant="h5"
              sx={{
                color: "#f7fafc",
                fontWeight: 600,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              }}
            >
              Market Summary
            </Typography>
          </Box>
        </CardContent>
        <CardContent sx={{ padding: { xs: 2, sm: 3 } }}>
          {data && data.general_market_news?.feed ? (
            newCards(data.general_market_news.feed)
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "#a0aec0",
                textAlign: "center",
                py: 4,
              }}
            >
              No market news available
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MarketSummary;
