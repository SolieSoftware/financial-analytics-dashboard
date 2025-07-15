#!/usr/bin/env python3
"""
Test script for dividend analysis
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.dividend_top_picks import DividendAnalyzer


def test_dividend_analysis():
    """Test the dividend analysis with a few known dividend stocks"""

    # Test with some known dividend stocks
    test_tickers = ["AAPL", "MSFT", "JNJ", "PG", "KO", "PEP", "VZ", "T", "IBM", "INTC"]

    print(f"Testing dividend analysis with {len(test_tickers)} tickers...")
    print("Test tickers:", test_tickers)

    analyzer = DividendAnalyzer()

    # Test individual ticker analysis
    for ticker in test_tickers:
        print(f"\n--- Testing {ticker} ---")
        try:
            stock = analyzer._analyze_single_ticker(ticker)
            if stock:
                print(f"✓ Found dividend stock: {stock.symbol}")
                print(f"  Yield: {stock.dividend_yield:.2%}")
                print(f"  Market Cap: ${stock.market_cap / 1e9:.2f}B")
                print(f"  Payout Ratio: {stock.payout_ratio:.2%}")
                print(f"  Score: {stock.score}")
            else:
                print(f"✗ No dividend data for {ticker}")
        except Exception as e:
            print(f"✗ Error analyzing {ticker}: {str(e)}")

    # Test batch analysis
    print(f"\n--- Testing batch analysis ---")
    try:
        dividend_stocks = analyzer.get_dividend_stocks_from_tickers(test_tickers)
        print(f"Found {len(dividend_stocks)} dividend stocks in batch")

        if dividend_stocks:
            print("Top dividend stocks:")
            for i, stock in enumerate(dividend_stocks, 1):
                print(
                    f"{i}. {stock.symbol}: {stock.dividend_yield:.2%} yield, Score: {stock.score}"
                )
        else:
            print("No dividend stocks found in batch")

    except Exception as e:
        print(f"Error in batch analysis: {str(e)}")


if __name__ == "__main__":
    test_dividend_analysis()
