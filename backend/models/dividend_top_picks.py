import yfinance as yf
import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Tuple
import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
import asyncio
from concurrent.futures import ThreadPoolExecutor
import time

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


@dataclass
class DividendStock:
    """Data class for dividend stock information"""

    symbol: str
    company_name: str
    current_price: float
    dividend_yield: float
    dividend_rate: float
    payout_ratio: float
    dividend_growth_5y: float
    dividend_growth_3y: float
    dividend_growth_1y: float
    pe_ratio: float
    market_cap: float
    sector: str
    industry: str
    beta: float
    score: float
    last_dividend_date: Optional[str] = None
    ex_dividend_date: Optional[str] = None
    dividend_frequency: Optional[str] = None


class DividendAnalyzer:
    """Analyzes dividend stocks and calculates top picks"""

    def __init__(self):
        self.dividend_stocks = []
        self.screening_criteria = {
            "min_market_cap": 1e8,  # $100M minimum market cap (reduced from $1B)
            "min_dividend_yield": 0.01,  # 1% minimum yield (reduced from 2%)
            "max_payout_ratio": 0.9,  # 90% maximum payout ratio (increased from 80%)
            "min_dividend_growth": 0.0,  # 0% minimum growth (reduced from 5%)
        }

    def get_dividend_stocks_from_tickers(
        self, tickers: List[str]
    ) -> List[DividendStock]:
        """Process a list of tickers and return dividend stocks"""
        logger.info(f"Processing {len(tickers)} tickers for dividend analysis")

        dividend_stocks = []

        # Process tickers in batches to avoid overwhelming the API
        batch_size = 50
        for i in range(0, len(tickers), batch_size):
            batch = tickers[i : i + batch_size]
            logger.info(f"Processing batch {i // batch_size + 1}: {len(batch)} tickers")

            batch_stocks = self._process_ticker_batch(batch)
            dividend_stocks.extend(batch_stocks)

            # Add delay between batches to be respectful to the API
            if i + batch_size < len(tickers):
                time.sleep(1)

        logger.info(f"Found {len(dividend_stocks)} dividend stocks")
        return dividend_stocks

    def _process_ticker_batch(self, tickers: List[str]) -> List[DividendStock]:
        """Process a batch of tickers"""
        dividend_stocks = []

        for ticker in tickers:
            try:
                stock = self._analyze_single_ticker(ticker)
                if stock:
                    dividend_stocks.append(stock)
                    logger.info(f"Found dividend stock: {ticker}")
            except Exception as e:
                logger.warning(f"Error analyzing {ticker}: {str(e)}")
                continue

        logger.info(f"Batch processed: {len(dividend_stocks)} dividend stocks found")
        return dividend_stocks

    def _analyze_single_ticker(self, ticker: str) -> Optional[DividendStock]:
        """Analyze a single ticker for dividend characteristics"""
        try:
            ticker_obj = yf.Ticker(ticker)
            info = ticker_obj.info

            # Check if stock pays dividends
            dividend_yield = info.get("dividendYield", 0)
            logging.info(f"Ticker: {ticker}; Dividend Yield: {dividend_yield}")
            if not dividend_yield or dividend_yield <= 0:
                logging.info(f"Ticker {ticker} rejected: No dividend yield")
                return None

            # Get dividend history for growth calculation
            logging.info(f"Ticker: {ticker}; Dividends: {ticker_obj.dividends}")
            dividends = ticker_obj.dividends
            if dividends.empty:
                return None

            # Calculate dividend growth rates
            dividend_growth_rates = self._calculate_dividend_growth(dividends)

            # Get additional metrics
            current_price = info.get("currentPrice", 0)
            dividend_rate = info.get("dividendRate", 0)
            payout_ratio = info.get("payoutRatio", 0)
            pe_ratio = info.get("trailingPE", 0)
            market_cap = info.get("marketCap", 0)
            beta = info.get("beta", 1.0)

            # Apply screening criteria
            if not self._passes_screening_criteria(
                dividend_yield, payout_ratio, dividend_growth_rates, market_cap
            ):
                logging.info(f"Ticker {ticker} rejected: Failed screening criteria")
                return None

            # Calculate composite score
            score = self._calculate_dividend_score(
                dividend_yield,
                payout_ratio,
                dividend_growth_rates,
                pe_ratio,
                beta,
                market_cap,
            )

            stock = DividendStock(
                symbol=ticker,
                company_name=info.get("longName", ticker),
                current_price=current_price,
                dividend_yield=dividend_yield,
                dividend_rate=dividend_rate,
                payout_ratio=payout_ratio,
                dividend_growth_5y=dividend_growth_rates.get("5y", 0),
                dividend_growth_3y=dividend_growth_rates.get("3y", 0),
                dividend_growth_1y=dividend_growth_rates.get("1y", 0),
                pe_ratio=pe_ratio,
                market_cap=market_cap,
                sector=info.get("sector", "Unknown"),
                industry=info.get("industry", "Unknown"),
                beta=beta,
                score=score,
                last_dividend_date=info.get("lastDividendDate"),
                ex_dividend_date=info.get("exDividendDate"),
                dividend_frequency=info.get("dividendRate", "Quarterly"),
            )

            return stock

        except Exception as e:
            logger.warning(f"Error analyzing {ticker}: {str(e)}")
            return None

    def _calculate_dividend_growth(self, dividends: pd.Series) -> Dict[str, float]:
        """Calculate dividend growth rates over different periods"""
        if dividends.empty:
            return {"1y": 0, "3y": 0, "5y": 0}

        # Sort by date and get recent dividends
        dividends = dividends.sort_index()

        # Convert timezone-aware datetime to timezone-naive for comparison
        if dividends.index.tz is not None:
            dividends.index = dividends.index.tz_localize(None)

        # Calculate growth rates for different periods
        growth_rates = {}

        # 1 year growth
        one_year_ago = datetime.now() - timedelta(days=365)
        recent_dividends = dividends[dividends.index >= one_year_ago]
        if len(recent_dividends) >= 2:
            growth_rates["1y"] = self._calculate_growth_rate(recent_dividends)
        else:
            growth_rates["1y"] = 0

        # 3 year growth
        three_years_ago = datetime.now() - timedelta(days=3 * 365)
        three_year_dividends = dividends[dividends.index >= three_years_ago]
        if len(three_year_dividends) >= 4:
            growth_rates["3y"] = self._calculate_growth_rate(three_year_dividends)
        else:
            growth_rates["3y"] = 0

        # 5 year growth
        five_years_ago = datetime.now() - timedelta(days=5 * 365)
        five_year_dividends = dividends[dividends.index >= five_years_ago]
        if len(five_year_dividends) >= 6:
            growth_rates["5y"] = self._calculate_growth_rate(five_year_dividends)
        else:
            growth_rates["5y"] = 0

        return growth_rates

    def _calculate_growth_rate(self, dividends: pd.Series) -> float:
        """Calculate compound annual growth rate for dividends"""
        if len(dividends) < 2:
            return 0

        # Get first and last dividend amounts
        first_dividend = dividends.iloc[0]
        last_dividend = dividends.iloc[-1]

        # Calculate time period in years
        # Handle timezone-aware datetime objects
        start_date = dividends.index[0]
        end_date = dividends.index[-1]

        # Convert to timezone-naive if needed
        if start_date.tz is not None:
            start_date = start_date.tz_localize(None)
        if end_date.tz is not None:
            end_date = end_date.tz_localize(None)

        time_period = (end_date - start_date).days / 365.25

        if time_period <= 0 or first_dividend <= 0:
            return 0

        # Calculate CAGR
        cagr = (last_dividend / first_dividend) ** (1 / time_period) - 1
        return max(0, cagr)  # Ensure non-negative

    def _passes_screening_criteria(
        self,
        dividend_yield: float,
        payout_ratio: float,
        growth_rates: Dict[str, float],
        market_cap: float,
    ) -> bool:
        """Check if stock passes basic screening criteria"""
        logging.info(
            f"Screening criteria check - Yield: {dividend_yield:.2%}, Payout: {payout_ratio:.2%}, Market Cap: {market_cap / 1e9:.2f}B, Growth: {growth_rates}"
        )

        criteria_checks = [
            dividend_yield >= self.screening_criteria["min_dividend_yield"],
            payout_ratio <= self.screening_criteria["max_payout_ratio"],
            market_cap >= self.screening_criteria["min_market_cap"],
        ]

        if not all(criteria_checks):
            logging.info(
                f"Failed basic criteria: Yield check: {dividend_yield >= self.screening_criteria['min_dividend_yield']}, Payout check: {payout_ratio <= self.screening_criteria['max_payout_ratio']}, Market cap check: {market_cap >= self.screening_criteria['min_market_cap']}"
            )
            return False

        # Check for positive dividend growth
        avg_growth = (
            growth_rates.get("1y", 0)
            + growth_rates.get("3y", 0)
            + growth_rates.get("5y", 0)
        ) / 3
        if avg_growth < self.screening_criteria["min_dividend_growth"]:
            logging.info(
                f"Failed growth criteria: Average growth {avg_growth:.2%} < {self.screening_criteria['min_dividend_growth']:.2%}"
            )
            return False

        logging.info("Passed all screening criteria")
        return True

    def _calculate_dividend_score(
        self,
        dividend_yield: float,
        payout_ratio: float,
        growth_rates: Dict[str, float],
        pe_ratio: float,
        beta: float,
        market_cap: float,
    ) -> float:
        """Calculate a composite dividend score (0-100)"""
        score = 0

        # Dividend yield score (0-25 points)
        yield_score = min(25, dividend_yield * 1000)  # Scale yield to points
        score += yield_score

        # Payout ratio score (0-20 points) - lower is better
        if payout_ratio > 0:
            payout_score = max(
                0, 20 - (payout_ratio * 25)
            )  # Penalize high payout ratios
            score += payout_score

        # Growth score (0-25 points)
        avg_growth = (
            growth_rates.get("1y", 0)
            + growth_rates.get("3y", 0)
            + growth_rates.get("5y", 0)
        ) / 3
        growth_score = min(25, avg_growth * 100)  # Scale growth to points
        score += growth_score

        # Valuation score (0-15 points) - lower P/E is better
        if pe_ratio > 0:
            pe_score = max(0, 15 - (pe_ratio / 2))  # Penalize high P/E ratios
            score += pe_score

        # Stability score (0-15 points) - lower beta is better
        beta_score = max(0, 15 - (beta * 5))  # Penalize high beta
        score += beta_score

        return round(score, 2)

    def get_top_dividend_picks(
        self, tickers: List[str], top_n: int = 10
    ) -> List[DividendStock]:
        """Get the top N dividend stocks from a list of tickers"""
        logger.info(f"Analyzing {len(tickers)} tickers for top {top_n} dividend picks")

        # Get all dividend stocks
        dividend_stocks = self.get_dividend_stocks_from_tickers(tickers)

        if not dividend_stocks:
            logger.warning("No dividend stocks found")
            return []

        # Sort by score (highest first)
        dividend_stocks.sort(key=lambda x: x.score, reverse=True)

        # Return top N
        top_picks = dividend_stocks[:top_n]

        logger.info(f"Found {len(top_picks)} top dividend picks")
        for i, stock in enumerate(top_picks, 1):
            logger.info(
                f"{i}. {stock.symbol}: Score {stock.score}, Yield {stock.dividend_yield:.2%}"
            )

        return top_picks

    def get_dividend_stocks_by_sector(
        self, tickers: List[str]
    ) -> Dict[str, List[DividendStock]]:
        """Get dividend stocks grouped by sector"""
        dividend_stocks = self.get_dividend_stocks_from_tickers(tickers)

        sector_groups = {}
        for stock in dividend_stocks:
            sector = stock.sector
            if sector not in sector_groups:
                sector_groups[sector] = []
            sector_groups[sector].append(stock)

        # Sort stocks within each sector by score
        for sector in sector_groups:
            sector_groups[sector].sort(key=lambda x: x.score, reverse=True)

        return sector_groups


# Utility function to convert DividendStock to dictionary for JSON serialization
def dividend_stock_to_dict(stock: DividendStock) -> Dict:
    """Convert DividendStock to dictionary for JSON serialization"""
    return {
        "symbol": stock.symbol,
        "company_name": stock.company_name,
        "current_price": stock.current_price,
        "dividend_yield": stock.dividend_yield,
        "dividend_rate": stock.dividend_rate,
        "payout_ratio": stock.payout_ratio,
        "dividend_growth_5y": stock.dividend_growth_5y,
        "dividend_growth_3y": stock.dividend_growth_3y,
        "dividend_growth_1y": stock.dividend_growth_1y,
        "pe_ratio": stock.pe_ratio,
        "market_cap": stock.market_cap,
        "sector": stock.sector,
        "industry": stock.industry,
        "beta": stock.beta,
        "score": stock.score,
        "last_dividend_date": stock.last_dividend_date,
        "ex_dividend_date": stock.ex_dividend_date,
        "dividend_frequency": stock.dividend_frequency,
    }
