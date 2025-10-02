class CacheConfig:
    # Cache TTL in seconds
    TICKER_LIST_TTL = 3600  # 1 hour
    TICKER_INFO_TTL = 3600  # 1 hour
    TICKER_HISTORY_TTL = 3600  # 1 hour
    SUMMARY_TTL = 900  # 15 minutes
    MARKET_SUMMARY_TTL = 300  # 5 minutes
    ALPHA_VANTAGE_TTL = 1800  # 30 minutes (API has rate limits)
    MARKET_NEWS_TTL = 600  # 10 minutes
    COMPANY_OVERVIEW_TTL = 3600  # 1 hour (relatively static)