import yfinance as yf
import pandas as pd
from fastapi import FastAPI, HTTPException
import httpx
from io import StringIO
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from contextlib import asynccontextmanager
import asyncio
import functools
import logging
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models.dividend_top_picks import DividendAnalyzer, dividend_stock_to_dict
from typing import List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global session for yfinance
yf_session = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global yf_session

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

    yield

    # Cleanup
    yf_session.close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/tickers/")
async def get_tickers():
    url = "https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt"

    async with httpx.AsyncClient(verify=False) as client:
        logger.info("Starting get_tickers endpoint")
        try:
            logger.info("Hitting endpoint...")
            response = await client.get(url, timeout=30.0)
            logger.info("Processing response...")
            response.raise_for_status()

            nasdaq = pd.read_csv(StringIO(response.text), sep="|")
            nasdaq = nasdaq[
                ~nasdaq["Symbol"].str.contains("File Creation Time", na=False)
            ]
            nasdaq = nasdaq.where(pd.notnull(nasdaq), None)
            nasdaq = nasdaq.replace([float("inf"), float("-inf")], None)
            logger.info("Tranformation to dicitinary post process")
            json_data = nasdaq.to_dict(orient="records")
            return {"nasdaq_ticker_list": json_data}

        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


# Helper function to run sync code in thread pool
async def run_in_threadpool(func, *args, **kwargs):
    """Run synchronous function in thread pool"""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, functools.partial(func, **kwargs), *args)


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


@app.get("/api/tickers/{ticker}/history")
async def get_ticker_historical_data(ticker: str):  # Fixed: Added ticker parameter
    try:
        history_data = await run_in_threadpool(get_ticker_history_sync, ticker)
        return {"history": history_data}

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch history for {ticker}: {str(e)}"
        )


@app.get("/api/tickers/{ticker}/info")
async def get_ticker_info_data(ticker: str):  # Fixed: Added ticker parameter
    try:
        info_data = await run_in_threadpool(get_ticker_info_sync, ticker)
        return {"info": info_data}

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch info for {ticker}: {str(e)}"
        )


# Optional: Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Trading API is running"}


@app.get("/api/dividend/top-picks")
async def get_top_dividend_picks(top_n: int = 10):
    """Get top dividend picks from available tickers"""
    try:
        # First get the list of available tickers
        tickers_response = await get_tickers()
        if not tickers_response or "nasdaq_ticker_list" not in tickers_response:
            raise HTTPException(status_code=500, detail="Failed to fetch ticker list")

        # Extract ticker symbols
        ticker_data = tickers_response["nasdaq_ticker_list"]
        ticker_symbols = [item["Symbol"] for item in ticker_data if item.get("Symbol")]

        # Limit to first 500 tickers for performance (can be adjusted)
        ticker_symbols = ticker_symbols[:500]

        logger.info(f"Analyzing {len(ticker_symbols)} tickers for dividend picks")

        # Create analyzer and get top picks
        analyzer = DividendAnalyzer()
        logger.info(f"Starting dividend analysis with {len(ticker_symbols)} tickers")
        top_picks = analyzer.get_top_dividend_picks(ticker_symbols, top_n)
        logger.info(f"Found {len(top_picks)} dividend picks")

        # Convert to dictionary format for JSON response
        picks_data = [dividend_stock_to_dict(stock) for stock in top_picks]
        logger.info(f"Converted {len(picks_data)} picks to dictionary format")

        return {
            "top_picks": picks_data,
            "total_analyzed": len(ticker_symbols),
            "criteria": {
                "min_market_cap": "100M",
                "min_dividend_yield": "1%",
                "max_payout_ratio": "90%",
                "min_dividend_growth": "0%",
            },
        }

    except Exception as e:
        logger.error(f"Error in dividend analysis: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Dividend analysis failed: {str(e)}"
        )


@app.get("/api/dividend/by-sector")
async def get_dividend_stocks_by_sector():
    """Get dividend stocks grouped by sector"""
    try:
        # First get the list of available tickers
        tickers_response = await get_tickers()
        if not tickers_response or "nasdaq_ticker_list" not in tickers_response:
            raise HTTPException(status_code=500, detail="Failed to fetch ticker list")

        # Extract ticker symbols
        ticker_data = tickers_response["nasdaq_ticker_list"]
        ticker_symbols = [item["Symbol"] for item in ticker_data if item.get("Symbol")]

        # Limit to first 300 tickers for performance
        ticker_symbols = ticker_symbols[:300]

        logger.info(f"Analyzing {len(ticker_symbols)} tickers by sector")

        # Create analyzer and get stocks by sector
        analyzer = DividendAnalyzer()
        sector_groups = analyzer.get_dividend_stocks_by_sector(ticker_symbols)

        # Convert to dictionary format for JSON response
        sector_data = {}
        for sector, stocks in sector_groups.items():
            sector_data[sector] = [dividend_stock_to_dict(stock) for stock in stocks]

        return {
            "sectors": sector_data,
            "total_analyzed": len(ticker_symbols),
            "total_dividend_stocks": sum(
                len(stocks) for stocks in sector_groups.values()
            ),
        }

    except Exception as e:
        logger.error(f"Error in sector analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Sector analysis failed: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
