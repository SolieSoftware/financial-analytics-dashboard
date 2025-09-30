import os
import logging
import asyncio
from functools import wraps, partial
import hashlib
import json
import gzip
import pickle
from io import StringIO
from typing import List, Any, Callable
from contextlib import asynccontextmanager

import yfinance as yf
import httpx
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import uvicorn

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

# Services
from services.yfinance_client import YahooFinanceClient
from services.redis_client import RedisClient
from services.supabase_client import SupabaseClient

# Load environment variables from .env file
load_dotenv()

# Get API keys from environment variables
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHAVANTAGE_API_KEY")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global Instances
yf_session = None
yfinance_client = None
redis_client = None
supabase_client = None


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


def generate_cache_key(prefix: str, *args, **kwargs) -> str:
    args_str = str(args) + str(sorted(kwargs.items()))
    args_hash = hashlib.md5(args_str.encode()).hexdigest()
    return f"{prefix}:{args_hash}"


async def serialize_data(data: dict) -> bytes:
    """Serialize data for Redis Storage with compression"""
    try:
        # Try pickle + gzip first
        pickled_data = pickle.dumps(data)
        compressed_data = gzip.compress(pickled_data)
        # Add a prefix to identify compressed data
        return b"COMPRESSED:" + compressed_data
    except Exception as e:
        logger.error(f"Error serializing data: {str(e)}")
        # Fallback to JSON without compression
        return b"JSON:" + json.dumps(data, default=str).encode()


async def deserialize_data(data: Any) -> dict:
    """Deserialize data from Redis Storage with decompression"""
    try:
        # Convert to bytes if it's a string
        if isinstance(data, str):
            data = data.encode()

        # Check if data has a prefix
        if data.startswith(b"COMPRESSED:"):
            # Remove prefix and decompress
            compressed_data = data[11:]  # Remove 'COMPRESSED:' prefix
            decompressed_data = gzip.decompress(compressed_data)
            return pickle.loads(decompressed_data)
        elif data.startswith(b"JSON:"):
            # Remove prefix and parse JSON
            json_data = data[5:]  # Remove 'JSON:' prefix
            return json.loads(json_data.decode())
        else:
            # Try legacy format (no prefix)
            try:
                decompressed_data = gzip.decompress(data)
                return pickle.loads(decompressed_data)
            except:
                # Fallback to JSON
                return json.loads(data.decode())
    except Exception as e:
        logger.error(f"Error deserializing data: {str(e)}")
        # Final fallback
        try:
            return json.loads(data.decode() if isinstance(data, bytes) else data)
        except:
            return None


def cache_result(ttl: int, key_prefix: str, *args, **kwargs):
    """Decorator to cache async function results in Redis"""

    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args, **kwargs):
            global redis_client
            if not redis_client:
                raise ValueError("Redis client not initialized")

            cache_key = generate_cache_key(key_prefix, *args, **kwargs)

            if redis_client.redis:
                try:
                    cached_data = await redis_client.redis.get(cache_key)
                    if cached_data:
                        logger.info(f"Cache hit for {cache_key}")
                        result = await deserialize_data(cached_data)
                        if result is not None:
                            return result

                except Exception as e:
                    logger.error(f"Error getting cached data: {str(e)}")

            logger.info(f"Cache miss for {cache_key}")
            result = await func(*args, **kwargs)

            if redis_client and redis_client.redis and result is not None:
                try:
                    serialized_data = await serialize_data(result)
                    await redis_client.redis.setex(cache_key, ttl, serialized_data)
                    logger.info(f"Cached result for {cache_key}")
                except Exception as e:
                    logger.error(f"Error caching result: {str(e)}")
            return result

        return wrapper

    return decorator


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Starting lifespance

    # Initializing services on global scope
    logger.info("Initializing services on global scope")
    global yf_session, yfinance_client, redis_client, supabase_client

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
    await redis_client.init_redis()

    logging.info("Starting up Supabase Client")
    supabase_client = SupabaseClient()
    await supabase_client.init_supabase()

    # Populate Redis Cache with initial data
    try:
        logger.info("Populating Redis Cache with Ticker List")
        tickers = await get_tickers()
        logger.info(f"Populating Redis Cache with {len(tickers['tickers'])} Tickers")
        logger.info(
            "Populating Redis Cache with Ticker Info and Historical Pricing Data"
        )

        # Only populate cache for first few tickers to avoid overwhelming the system on startup
        ticker_symbols = [
            ticker.get("Symbol", ticker) for ticker in tickers["tickers"][:10]
        ]

        for ticker in ticker_symbols:
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


"""Supabase API Endpoints"""


@cache_result(CacheConfig.TICKER_LIST_TTL, key_prefix="supabase_tickers")
@app.get("/api/supabase/tickers")
async def get_tickers():
    """Get tickers from Supabase"""
    try:
        response = (
            supabase_client.supabase.table("listings")
            .select("Symbol")
            .gt("Market Cap", 10000000000)
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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
