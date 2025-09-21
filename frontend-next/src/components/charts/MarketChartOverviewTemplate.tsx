import React from 'react'
import { Chart } from '../charts/Chart'
// Mock hook to simulate the stock data fetching
const useStockProfile = ({ ticker }: { ticker: string }) => {
  // This is a simplified version - in a real app, this would fetch actual data
  return {
    data: {
      info_data: {
        currentPrice: Math.random() * 1000 + 100,
        change: Math.random() * 20 - 10,
        changePercent: Math.random() * 5 - 2.5,
      },
      history_data: Array(30)
        .fill(0)
        .map((_, i) => ({
          date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000),
          close: Math.random() * 1000 + 100,
        })),
    },
    isLoading: false,
    error: null,
  }
}
export function MarketChartOverview() {
  const marketTickers = {
    '^GSPC': 'S&P 500',
    '^IXIC': 'NASDAQ',
    '^DJI': 'Dow Jones',
    '^VIX': 'VIX',
  }
  const marketData = Object.fromEntries(
    Object.entries(marketTickers).map(([ticker, name]) => [
      ticker,
      {
        ...useStockProfile({
          ticker,
        }),
        name,
      },
    ]),
  )
  return (
    <div className="w-full">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
        Market Indices
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(marketData).map(([ticker, data]) => (
          <div
            key={ticker}
            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-white/10"
          >
            <Chart
              ticker={data.name}
              stockData={data.data}
              isLoading={data.isLoading}
              error={data.error}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
