import os
import logging
import asyncio
from functools import wraps, partial
from typing import Any, Callable
from contextlib import asynccontextmanager

import yfinance as yf
import httpx
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import uvicorn

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

# Services
from services.yfinance_client import YahooFinanceClient
from services.redis_client import RedisClient
from services.supabase_client import SupabaseClient
from services.cache_service import CacheService

# Core
# Config
from core.config import CacheConfig

# Serializers
from utils.serializers import CacheSerializer


# Load environment variables from .env file
load_dotenv()

# Get API keys from environment variables
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")
FINANCIAL_MODELLING_API_KEY = os.getenv("FINANCIAL_MODELLING_API_KEY")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global Instances
yf_session = None
yfinance_client = None
redis_client = None
supabase_client = None
cache_service = None


def get_cache_service():
    """Get or create cache service instance"""
    global cache_service
    if cache_service is None:
        raise RuntimeError("Cache service not initialized. Call lifespan first.")
    return cache_service


def cache_result(ttl: int, key_prefix: str):
    """Cache decorator that works with the global cache service"""

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_svc = get_cache_service()
            return await cache_svc.cache.cache_result(ttl, key_prefix)(func)(
                *args, **kwargs
            )

        return wrapper

    return decorator


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Starting lifespance

    # Initializing services on global scope
    logger.info("Initializing services on global scope")
    global yf_session, yfinance_client, redis_client, supabase_client, cache_service

    # Configure session for yfinance
    yf_session = requests.Session()

    retry_strategy = Retry(
        total=3, backoff_factor=1, status_forcelist=[429, 500, 502, 503, 504]
    )

    adapter = HTTPAdapter(
        pool_connections=10, pool_maxsize=20, max_retries=retry_strategy
    )

    yf_session.mount("http://", adapter)
    yf_session.mount("https://", adapter)

    logging.info("Starting up Yahoo Finance Client")
    yfinance_client = YahooFinanceClient()

    logging.info("Starting up Redis Client")
    redis_client = RedisClient()
    try:
        await redis_client.init_redis()
    except Exception as e:
        logging.warning(f"Redis connection failed: {e}. Running without cache.")

    logging.info("Starting up Cache Service")
    try:
        cache_service = CacheService(
            redis_client=redis_client, serializer=CacheSerializer
        )
    except Exception as e:
        logging.warning(f"Cache service failed: {e}. Running without cache.")

    logging.info("Starting up Supabase Client")
    supabase_client = SupabaseClient()
    await supabase_client.init_supabase()

    logging.info("Clearing Redis Cache")
    await clear_cache()

    # Populate Redis Cache with initial data
    try:
        logger.info("Populating Redis Cache with Ticker List")
        tickers = await get_tickers(market_cap=1000000000000)
        logger.info(f"Populating Redis Cache with {len(tickers['tickers'])} Tickers")
        logger.info(
            "Populating Redis Cache with Ticker Info and Historical Pricing Data"
        )

        # Only populate cache for first few tickers to avoid overwhelming the system on startup
        ticker_symbols = [
            ticker.get("Symbol", ticker) for ticker in tickers["tickers"]
        ] + ["^GSPC", "^VIX", "^DJI", "^IXIC"]

        for ticker in ticker_symbols:
            logger.info(f"Caching data for ticker {ticker}")
            try:
                await get_ticker_info_cached(ticker)
                await get_ticker_history_cached(ticker)
            except Exception as e:
                logger.warning(f"Failed to cache data for ticker {ticker}: {str(e)}")

        logger.info("Initial cache population completed")
    except Exception as e:
        logger.error(f"Failed to populate initial cache: {str(e)}")

    yield

    # Cleanup
    yf_session.close()
    if redis_client:
        await redis_client.close_redis()
    if supabase_client:
        await supabase_client.close_supabase()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Optional: Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Trading API is running"}


"""Redis Endpoints"""


@app.get("/health/redis")
async def redis_health():
    """Check Redis connection health"""
    try:
        if redis_client and redis_client.redis:
            await redis_client.redis.ping()
            return {
                "status": "healthy",
                "redis": "connected",
                "message": "Redis is working correctly",
            }
        else:
            return {
                "status": "unhealthy",
                "redis": "not_initialized",
                "message": "Redis client not initialized",
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "redis": "error",
            "message": f"Redis error: {str(e)}",
        }


@app.post("/admin/clear-cache")
async def clear_cache():
    """Clear all cached data (admin endpoint)"""
    try:
        if redis_client and redis_client.redis:
            await redis_client.redis.flushdb()
            logger.info("Cache cleared successfully")
            return {"status": "success", "message": "Cache cleared successfully"}
        else:
            return {"status": "error", "message": "Redis client not initialized"}
    except Exception as e:
        logger.error(f"Error clearing cache: {str(e)}")
        return {"status": "error", "message": f"Failed to clear cache: {str(e)}"}


@app.get("/admin/redis/stats")
async def get_redis_stats():
    """Get Redis stats"""
    return await redis_client.get_stats()


"""Supabase API Endpoints"""


@cache_result(CacheConfig.TICKER_LIST_TTL, key_prefix="supabase_tickers")
@app.get("/api/supabase/tickers/{market_cap}")
async def get_tickers(market_cap: int):
    """Get tickers from Supabase"""
    try:
        response = (
            supabase_client.supabase.table("listings")
            .select("Symbol")
            .gt("market_cap", market_cap)
            .execute()
        )
        tickers = response.data
        return {"tickers": tickers}
    except Exception as e:
        logging.error(f"Failed to fetch tickers: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch tickers")


"""Yahoo Finance API Endpoints"""


# Helper function to run sync code in thread pool
async def run_in_threadpool(func, *args, **kwargs):
    """Run synchronous function in thread pool"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(func, **kwargs), *args)


def get_ticker_history_sync(ticker: str):
    """Synchronous function to be run in thread pool"""
    ticker_obj = yf.Ticker(ticker)
    hist_df = ticker_obj.history(period="1y")

    if hist_df.empty:
        raise ValueError(f"No data found for ticker {ticker}")

    hist_df.index = hist_df.index.map(lambda x: x.isoformat())
    hist_df = hist_df.reset_index()
    return hist_df.to_dict(orient="records")


def get_ticker_info_sync(ticker: str):
    """Synchronous function to be run in thread pool"""
    ticker_obj = yf.Ticker(ticker)
    info_data = ticker_obj.info

    if not info_data:
        raise ValueError(f"No info found for ticker {ticker}")

    return info_data


@cache_result(CacheConfig.TICKER_INFO_TTL, key_prefix="ticker_info")
async def get_ticker_info_cached(ticker: str):
    """Cached async wrapper for ticker info"""
    return await run_in_threadpool(get_ticker_info_sync, ticker)


@cache_result(CacheConfig.TICKER_HISTORY_TTL, key_prefix="ticker_history")
async def get_ticker_history_cached(ticker: str):
    """Cached async wrapper for ticker history"""
    return await run_in_threadpool(get_ticker_history_sync, ticker)


@app.get("/api/tickers/{ticker}/data")
async def get_ticker_data(ticker: str):
    try:
        print("ticker", ticker)
        info_data = await get_ticker_info_cached(ticker)
        history_data = await get_ticker_history_cached(ticker)
        return {"info_data": info_data, "history_data": history_data}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch data for {ticker}: {str(e)}"
        )


@app.get("/api/summary/{ticker}")
async def get_summary(ticker: str):
    """Get summary of a stock"""
    try:
        ticker_summary = await yfinance_client.analyze_stock(ticker)

        return {"ticker_summary": ticker_summary}
    except Exception as e:
        logger.error(f"Error in summary generation: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Summary generation failed: {str(e)}"
        )


@app.get("/api/summary/market")
async def get_market_summary():
    """Get market summary"""
    try:
        market_summary = await yfinance_client.market_overview()
        return {"market_summary": market_summary}
    except Exception as e:
        logger.error(f"Error in market summary generation: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Market summary generation failed: {str(e)}"
        )


"""Alpha Vantage API Endpoints"""


@app.get("/api/market-daily/{symbol}/data")
async def get_market_data(symbol: str):
    """Get market data"""
    if not ALPHA_VANTAGE_API_KEY:
        raise HTTPException(
            status_code=500, detail="Alpha Vantage API key not configured"
        )

    url = f"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&outputsize=full&apikey={ALPHA_VANTAGE_API_KEY}"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            market_data = response.json()
            return {"market_data": market_data}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch market data: {str(e)}"
        )


@app.get("/api/company-overview/{symbol}")
async def get_company_overview(symbol: str):
    """Get company overview"""
    url = f"https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            company_overview = response.json()
            return {"company_overview": company_overview}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch company overview: {str(e)}"
        )


@app.get("/api/market-status")
async def get_market_status():
    """Get market status"""
    url = f"https://www.alphavantage.co/query?function=MARKET_STATUS&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            market_status = response.json()
            return {"market_status": market_status}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch market status: {str(e)}"
        )


@cache_result(CacheConfig.MARKET_NEWS_TTL, key_prefix="market_news")
@app.get("/api/market-news/{symbol}")
async def get_market_news(symbol: str):
    """Get market news"""
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={symbol}&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            market_news = response.json()
            return {"market_news": market_news}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch market news: {str(e)}"
        )


@app.get("/api/general-market-news")
async def get_general_market_news():
    """Get general market news"""
    url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey={ALPHA_VANTAGE_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            general_market_news = response.json()
            return {"general_market_news": general_market_news}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch general market news: {str(e)}"
        )


# financial modelling prep api endpoints
@app.get("/api/financial-modelling-prep/biggest-gainers")
async def get_biggest_gainers():
    """Get biggest gainers"""
    url = f"https://financialmodelingprep.com/stable/biggest-gainers?apikey={FINANCIAL_MODELLING_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            biggest_gainers = response.json()
            return {"biggest_gainers": biggest_gainers}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch biggest gainers: {str(e)}"
        )


@app.get("/api/financial-modelling-prep/biggest-losers")
async def get_biggest_losers():
    """Get biggest losers"""
    url = f"https://financialmodelingprep.com/stable/biggest-losers?apikey={FINANCIAL_MODELLING_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            biggest_losers = response.json()
            return {"biggest_losers": biggest_losers}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch biggest losers: {str(e)}"
        )


@app.get("/api/financial-modelling-prep/most-active")
async def get_most_active():
    """Get most active"""
    url = f"https://financialmodelingprep.com/stable/most-actives?apikey={FINANCIAL_MODELLING_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            most_active = response.json()
            return {"most_active": most_active}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch most active: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
