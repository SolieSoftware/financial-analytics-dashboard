import asyncio
from typing import Dict, List, Any
import logging
import os
import httpx
import json
from huggingface_hub import InferenceClient, HfApi, list_models
from dotenv import load_dotenv
import yfinance as yf
import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

HF_API_URL = "https://api-inference.huggingface.co/models/"

load_dotenv()


class YahooFinanceClient:
    def __init__(self, mcp_server_url: str = "http://localhost:8000/mcp/events"):
        self.mcp_server_url = mcp_server_url
        self.hf_token = os.getenv("Hf_TOKEN")
        self.models = {
            # Summarization models (no download required)
            "distilbart": "sshleifer/distilbart-cnn-12-6",  # 120MB - Fast summarization
            "bart_large": "facebook/bart-large-cnn",  # 400MB - High quality news/financial
            "pegasus": "google/pegasus-xsum",  # 570MB - Excellent summarization
            # Text generation models - use models that work with HF Inference API
            "gpt2": "gpt2",  # Small, reliable text generation
            "gpt2_medium": "gpt2-medium",  # Better quality
            "microsoft_dialo": "microsoft/DialoGPT-medium",  # Good for conversations
            # Financial domain specific
            "finbert": "ProsusAI/finbert",
            "zai-org": "zai-org/GLM-4.5",
            "HuggingFaceH4": "HuggingFaceH4/zephyr-7b-beta",
        }
        self.hf_client = InferenceClient(token=self.hf_token)

    async def get_stock_quote(self, ticker: str) -> str:
        """Get stock quote using yfinance library"""
        try:
            logger.info(f"Getting stock quote for {ticker} using yfinance")

            # Get stock info using yfinance
            ticker_obj = yf.Ticker(ticker)
            info = ticker_obj.info

            if not info:
                return json.dumps({"error": "No data found for ticker"})

            # Extract key information
            result = {
                "symbol": ticker,
                "company_name": info.get("longName", info.get("shortName", "")),
                "sector": info.get("sector", ""),
                "industry": info.get("industry", ""),
                "description": info.get("longBusinessSummary", "")[:500] + "..."
                if info.get("longBusinessSummary")
                else "",
                "website": info.get("website", ""),
                "country": info.get("country", ""),
                "employees": info.get("fullTimeEmployees", ""),
                # Financial metrics
                "market_cap": info.get("marketCap"),
                "enterprise_value": info.get("enterpriseValue"),
                "pe_ratio": info.get("trailingPE"),
                "forward_pe": info.get("forwardPE"),
                "peg_ratio": info.get("pegRatio"),
                "price_to_book": info.get("priceToBook"),
                "price_to_sales": info.get("priceToSalesTrailing12Months"),
                # Dividend info
                "dividend_yield": info.get("dividendYield"),
                "dividend_rate": info.get("dividendRate"),
                "payout_ratio": info.get("payoutRatio"),
                # Trading metrics
                "beta": info.get("beta"),
                "52_week_high": info.get("fiftyTwoWeekHigh"),
                "52_week_low": info.get("fiftyTwoWeekLow"),
                "avg_volume": info.get("averageVolume"),
                "avg_volume_10d": info.get("averageVolume10days"),
                # Financial health
                "total_cash": info.get("totalCash"),
                "total_debt": info.get("totalDebt"),
                "revenue": info.get("totalRevenue"),
                "gross_margins": info.get("grossMargins"),
                "operating_margins": info.get("operatingMargins"),
                "profit_margins": info.get("profitMargins"),
                "recommendation": info.get("recommendationKey", ""),
                "target_price": info.get("targetMeanPrice"),
                # Current price
                "current_price": info.get("currentPrice"),
                "previous_close": info.get("previousClose"),
                "open": info.get("open"),
                "day_low": info.get("dayLow"),
                "day_high": info.get("dayHigh"),
            }

            # Clean up None values
            result = {k: v for k, v in result.items() if v is not None and v != ""}

            logger.info(f"Successfully retrieved data for {ticker}")
            return json.dumps(result, indent=2)

        except Exception as e:
            logger.error(f"Error getting stock quote for {ticker}: {str(e)}")
            return json.dumps({"error": f"Error retrieving data: {str(e)}"})

    async def get_market_summary(self) -> str:
        """
        Get major market indices summary using yfinance
        """
        indices = [
            "^GSPC",  # S&P 500
            "^DJI",  # Dow Jones
            "^IXIC",  # NASDAQ
            "^RUT",  # Russell 2000
            "^VIX",  # VIX
        ]

        logger.info(f"Getting market summary for indices: {indices}")

        try:
            market_data = []

            for index in indices:
                try:
                    # Get index data using yfinance
                    ticker_obj = yf.Ticker(index)
                    info = ticker_obj.info

                    if info:
                        # Map index symbols to readable names
                        name_mapping = {
                            "^GSPC": "S&P 500",
                            "^DJI": "Dow Jones",
                            "^IXIC": "NASDAQ",
                            "^RUT": "Russell 2000",
                            "^VIX": "VIX",
                        }

                        index_data = {
                            "symbol": index,
                            "name": name_mapping.get(index, index),
                            "current_price": info.get("currentPrice"),
                            "previous_close": info.get("previousClose"),
                            "change": info.get("currentPrice", 0)
                            - info.get("previousClose", 0)
                            if info.get("currentPrice") and info.get("previousClose")
                            else None,
                            "change_percent": (
                                (
                                    info.get("currentPrice", 0)
                                    - info.get("previousClose", 0)
                                )
                                / info.get("previousClose", 1)
                                * 100
                            )
                            if info.get("currentPrice") and info.get("previousClose")
                            else None,
                            "day_low": info.get("dayLow"),
                            "day_high": info.get("dayHigh"),
                            "volume": info.get("volume"),
                        }

                        # Clean up None values
                        index_data = {
                            k: v for k, v in index_data.items() if v is not None
                        }
                        market_data.append(index_data)

                except Exception as e:
                    logger.error(f"Error getting data for {index}: {str(e)}")
                    continue

            response = {
                "market_summary": market_data,
                "timestamp": datetime.datetime.now().isoformat(),
                "count": len(market_data),
            }

            return json.dumps(response, indent=2)

        except Exception as e:
            logger.error(f"Error getting market summary: {str(e)}")
            return json.dumps({"error": f"Market summary failed: {str(e)}"})

    async def analyze_stock(self, ticker: str) -> str:
        """Get stock data and provide AI summary"""
        try:
            # Get detailed company info
            info_data = await self.get_stock_quote(ticker)

            # Generate summary
            context = f"Analysis for {ticker.upper()}"
            summary = self.summarize_with_llm(info_data, context)

            return f"=== {ticker.upper()} Analysis ===\n\n{summary}\n\n=== Raw Data ===\n{info_data}"

        except Exception as e:
            logger.error(f"Error analyzing {ticker}: {str(e)}")
            return f"Error analyzing {ticker}: {str(e)}"

    async def market_overview(self) -> str:
        """Get market summary with AI analysis"""
        try:
            market_data = await self.get_market_summary()

            context = "Overall market conditions and major indices analysis"
            summary = self.summarize_with_llm(market_data, context)

            return f"=== Market Overview ===\n\n{summary}\n\n=== Raw Data ===\n{market_data}"

        except Exception as e:
            logger.error(f"Error getting market overview: {str(e)}")
            return f"Error getting market overview: {str(e)}"

    def summarize_with_llm(self, data: str, context: str = "") -> str:
        """Use LLM to summarize the financial data"""

        # Check if HF token is available
        if not self.hf_token:
            return f"Financial Analysis Summary:\n\n{context}\n\nKey Data Points:\n{data[:500]}...\n\nNote: Hugging Face token not configured for AI analysis."

        model_name = self.models.get(
            "HuggingFaceH4"
        )  # Use GPT-2 which is reliable with HF API

        # Create a very simple prompt for GPT-2
        prompt = f"Financial analysis: {data[:500]}"

        print(f"Prompt: {prompt}")
        if model_name:
            try:
                print(f"Using model: {model_name}")
                print(f"Prompt length: {len(prompt)} characters")

                # Use instruction based model to generate a summary
                messages = [{"role": "user", "content": prompt}]

                response = self.hf_client.chat_completion(
                    messages=messages, model=model_name, max_tokens=100, temperature=0.7
                )
                print(f"Response: {response}")

                # Extract the text content from the ChatCompletionOutput object
                if hasattr(response, "choices") and len(response.choices) > 0:
                    choice = response.choices[0]
                    if hasattr(choice, "message") and hasattr(
                        choice.message, "content"
                    ):
                        return choice.message.content
                    elif hasattr(choice, "text"):
                        return choice.text

                # Fallback: return the string representation
                return str(response)

            except Exception as e:
                print(f"HF API Error: {str(e)}")
                import traceback

                traceback.print_exc()
                return f"Financial Analysis Summary:\n\n{context}\n\nKey Data Points:\n{data[:500]}...\n\nNote: AI analysis failed - {str(e)}"
        else:
            return {"Error": "No model found"}
