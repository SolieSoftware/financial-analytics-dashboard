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
from services.yfinance_client import YahooFinanceClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global session for yfinance
yf_session = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global yf_session, yfinance_client

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



# Optional: Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Trading API is running"}


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
    
@app.get("/api/tickers/{ticker}/data")
async def get_ticker_data(ticker: str):
    try:
        info_data = await run_in_threadpool(get_ticker_info_sync, ticker)
        history_data = await run_in_threadpool(get_ticker_history_sync, ticker)
        return {"info_data": info_data, "history_data": history_data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch data for {ticker}: {str(e)}")


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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
