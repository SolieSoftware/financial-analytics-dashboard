"use client";
import { useMarketProfile } from "@/utils/hooks/useMarketProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, TrendingUp, TrendingDown } from "lucide-react";
import { NewsArticle } from "@/utils/types/newsTypes";
import LoadingPage from "@/components/default/LoadingPage";
import ErrorPage from "@/components/default/ErrorPage";
import NoData from "@/components/default/NoData";

const MarketSummary = () => {
  const { data, error, isLoading } = useMarketProfile();

  if (isLoading) {
    return (
      <div className="w-full">
        <LoadingPage title="Market Summary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full">
        <NoData title="Market Summary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <ErrorPage error={error} title="Market Summary" />
      </div>
    );
  }

  const formatSentiment = (sentimentScore?: number) => {
    if (!sentimentScore)
      return {
        label: "N/A",
        colorClass: "text-text-secondary",
        icon: null,
      };

    switch (true) {
      case sentimentScore > 0.35:
        return {
          label: "Bullish",
          colorClass: "text-bullish",
          icon: <TrendingUp className="w-4 h-4" />,
        };
      case sentimentScore > 0.15:
        return {
          label: "Somewhat Bullish",
          colorClass: "text-bullish-muted",
          icon: <TrendingUp className="w-4 h-4" />,
        };
      case sentimentScore > -0.15:
        return {
          label: "Neutral",
          colorClass: "text-text-secondary",
          icon: null,
        };
      case sentimentScore > -0.35:
        return {
          label: "Somewhat Bearish",
          colorClass: "text-bearish-muted",
          icon: <TrendingDown className="w-4 h-4" />,
        };
      case sentimentScore < -0.35:
        return {
          label: "Bearish",
          colorClass: "text-bearish",
          icon: <TrendingDown className="w-4 h-4" />,
        };
      default:
        return {
          label: "Neutral",
          colorClass: "text-text-secondary",
          icon: null,
        };
    }
  };

  const newCard = (article: NewsArticle) => {
    const sentiment = formatSentiment(article.overall_sentiment_score);

    return (
      <div key={article.summary} className="mb-3">
        <Card className="market-summary-card">
          <CardContent className="market-summary-content">
            <div className="market-summary-header">
              <div className="market-summary-title-section">
                <Newspaper className="market-summary-icon" />
                <h3 className="market-summary-title">{article.title}</h3>
              </div>
              {sentiment.icon && (
                <div
                  className={`${sentiment.colorClass} market-summary-sentiment-icon`}
                >
                  {sentiment.icon}
                </div>
              )}
            </div>

            <p className="market-summary-description">{article.summary}</p>

            <div className="market-summary-badges">
              <Badge
                variant={
                  sentiment.colorClass.includes("bullish")
                    ? "bullish"
                    : sentiment.colorClass.includes("bearish")
                    ? "bearish"
                    : "default"
                }
                className="market-summary-badge"
              >
                {sentiment.label}
              </Badge>
              {article.source && (
                <Badge variant="outline" className="market-summary-badge">
                  {article.source}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const newCards = (articles: NewsArticle[]) => {
    return articles.map((article: NewsArticle) => newCard(article));
  };

  const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
        <CardTitle className="market-summary-main-title">
          <Newspaper className="market-summary-main-icon" />
          <span className="market-summary-title-text">Market Summary</span>
        </CardTitle>
      </CardHeader>
    );
  };

  return (
    <Card className="market-summary-container">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        {data && data.general_market_news?.feed ? (
          newCards(data.general_market_news.feed)
        ) : (
          <p className="market-summary-no-data">No market news available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketSummary;
