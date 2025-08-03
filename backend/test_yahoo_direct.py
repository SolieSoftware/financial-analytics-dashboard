import asyncio
import httpx
import json


async def test_yahoo_direct():
    ticker = "AAPL"
    url = f"https://query2.finance.yahoo.com/v10/finance/quoteSummary/{ticker}"
    params = {
        "modules": "summaryDetail, financialData, defaultKeyStatistics, assetProfile, summaryProfile"
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    print(f"Testing Yahoo Finance API for {ticker}")
    print(f"URL: {url}")
    print(f"Params: {params}")

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.get(url, params=params, headers=headers)
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")

            if response.status_code == 200:
                data = response.json()
                print(f"Response data keys: {list(data.keys()) if data else 'None'}")
                print(f"QuoteSummary exists: {'quoteSummary' in data}")
                if data and "quoteSummary" in data:
                    print(
                        f"QuoteSummary result length: {len(data['quoteSummary'].get('result', []))}"
                    )
            else:
                print(f"Error response: {response.text}")

        except Exception as e:
            print(f"Exception: {e}")


if __name__ == "__main__":
    asyncio.run(test_yahoo_direct())
