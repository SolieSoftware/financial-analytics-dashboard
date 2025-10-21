import os
import logging
import datetime
import pandas as pd

from supabase import create_client, Client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SupabaseClient:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.supabase: Client = None
        self.price_history_api_to_supabase_mapping = {
            "Date": "date",
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
            "Volume": "volume",
            "Dividends": "dividends",
            "Stock Splits": "stock_splits",
        }
        self.price_history_supabase_to_api_mapping = {v: k for k, v in self.price_history_api_to_supabase_mapping.items()}
    async def init_supabase(self):
        """Initialize the Supabase client"""
        try:
            self.supabase = create_client(self.supabase_url, self.supabase_key)
            logger.info("Supabase client initialized")
        except Exception as e:
            logger.error(f"Error initializing Supabase client: {str(e)}")
            raise e

    def _get_last_stored_date(self, ticker: str):
        """Get the last stored date for a ticker"""
        response = self.supabase.table("stock_price_history").select("date").eq("symbol", ticker).order("date", desc=True).limit(1).execute()
        if response.data:
            return response.data[0]["date"]
        return None

    def prepare_ticker_data(self, ticker: str, data: dict):
        """Prepare ticker data for storage in supabase"""
        ticker_data = pd.DataFrame(data)
        ticker_data = ticker_data.rename(columns=self.price_history_api_to_supabase_mapping)
        ticker_data["symbol"] = ticker
        latest_date = self._get_last_stored_date(ticker)
        if latest_date: 
            ticker_data = ticker_data[ticker_data["date"] > latest_date]
            if not ticker_data.empty:
                return ticker_data.to_dict(orient="records")
            else:
                return []
        else:
            return ticker_data.to_dict(orient="records")
    
    async def store_ticker_data(self, ticker: str, data: dict):
        """Store ticker data in supabase"""
        logger.info(f"Storing ticker data in supabase for ticker {ticker}")
        ticker_data = self.prepare_ticker_data(ticker, data)
        logger.info(f"Prepared ticker data for storage in supabase for ticker {ticker}")
        if ticker_data:
            try:
                response = self.supabase.table("stock_price_history").upsert(ticker_data, on_conflict="symbol,date").execute()
                logger.info(f"Ticker data stored in supabase for ticker {ticker}")
            except Exception as e:
                logger.error(f"Error storing ticker data in supabase: {str(e)} - Type: {type(e).__name__}")
                raise e

    async def get_ticker_data(self, ticker: str):
        """Get ticker data from supabase"""
        response = self.supabase.table("stock_price_history").select("date, open, high, low, close, volume, dividends, stock_splits").eq("symbol", ticker).execute()
        if response.data:
            return pd.DataFrame(response.data).rename(columns=self.price_history_supabase_to_api_mapping).to_dict(orient="records")
            return response.data
        return None

    async def close_supabase(self):
        """Close the Supabase client"""
        if self.supabase:
            # Supabase client doesn't have a close method
            self.supabase = None
            logger.info("Supabase client closed")
