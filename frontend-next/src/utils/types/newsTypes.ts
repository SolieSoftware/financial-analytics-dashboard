interface Topic {
    topic: string;
    relevance_score: string;
  }

  interface TickerSentiment{
    ticker: string;
    relevance_score: string;
    ticker_sentiment_score: string;
    ticker_sentiment_label: string;
  }
  
  interface NewsArticle {
    title: string;
    url: string;
    time_published: string;
    authors: string[];
    summary: string;
    banner_image: string;
    source: string;
    category_within_source: string;
    source_domain: string;
    topics: Topic[];
    overall_sentiment_score: number;
    overall_sentiment_label: string;
    ticker_sentiment: TickerSentiment[];
  }

  interface MarketNewsAPIResponse {
    items: string
    sentiment_score_definition: string
    relevance_score_definition: string
    feed: NewsArticle[];
  }

  interface stockMarketNewsResponse {
    market_news: MarketNewsAPIResponse;
  }

  interface generalMarketNewsResponse {
    general_market_news: MarketNewsAPIResponse;
  }



  export type { NewsArticle, Topic, MarketNewsAPIResponse, stockMarketNewsResponse, generalMarketNewsResponse };