"use client";

import { Newspaper, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { NewsArticle } from "@/utils/types/newsTypes";
import { stockMarketNewsResponse } from "@/utils/types/newsTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingPage from "../default/LoadingPage";
import NoData from "../default/NoData";
import ErrorPage from "../default/ErrorPage";

interface LatestNewsProps {
  stockMarketNewsData: stockMarketNewsResponse;
  stockMarketNewsError: Error;
  stockMarketNewsLoading: boolean;
}

const LatestNews = ({
  stockMarketNewsData,
  stockMarketNewsError,
  stockMarketNewsLoading,
}: LatestNewsProps) => {
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

  const displayTitle = () => {
    return (
      <CardHeader className="market-summary-header-container">
        <CardTitle className="market-summary-main-title">
          <Newspaper className="market-summary-main-icon" />
          <span className="market-summary-title-text">Latest News</span>
        </CardTitle>
      </CardHeader>
    );
  };

  if (stockMarketNewsLoading) {
    return <LoadingPage title="Latest News" />;
  }

  if (!stockMarketNewsData) {
    return <NoData title="Latest News" />;
  }

  if (stockMarketNewsError) {
    return <ErrorPage error={stockMarketNewsError} title="Latest News" />;
  }

  const newsCard = (article: NewsArticle, index: number) => {
    const sentiment = formatSentiment(article.overall_sentiment_score);

    return (
      <div key={index} className="mb-3">
        <Link
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
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
                <Badge variant="outline" className="market-summary-badge">
                  {parseCustomTimestamp(
                    article.time_published
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    );
  };

  const newsCards = (articles: NewsArticle[]) => {
    return articles.map((article: NewsArticle, index: number) =>
      newsCard(article, index)
    );
  };

  return (
    <Card className="market-summary-container latest-news">
      {displayTitle()}
      <CardContent className="market-summary-content-container">
        {stockMarketNewsData &&
        stockMarketNewsData["market_news"]["feed"]?.length > 0 ? (
          newsCards(stockMarketNewsData["market_news"]["feed"])
        ) : (
          <p className="market-summary-no-data">No news available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestNews;
