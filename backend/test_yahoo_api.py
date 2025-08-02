import asyncio
import httpx
import json

async def test_yahoo_api():
    ticker = "AAPL"
    url = f"https://query2.finance.yahoo.com/v10/finance/quoteSummary/{ticker}"
    params = {
        "modules": "summaryDetail, financialData, defaultKeyStatistics, assetProfile, summaryProfile"
    }
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            print(f"Response status: {response.status_code}")
            print(f"Data keys: {list(data.keys())}")
            print(f"QuoteSummary: {data.get('quoteSummary', {}).get('result', [])[:1]}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_yahoo_api()) 