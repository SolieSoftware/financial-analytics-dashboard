"use client";
import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";
import { MarketNewsAPIResponse } from "../types/newsTypes";
import { stockDataResponse } from "../types/stockData";

interface QueryParams {
  ticker: string;
}

interface stockMarketNewsResponse {
  market_news: MarketNewsAPIResponse;
}

export const useStockProfile = (queryParams: QueryParams) => {
  const url = `${endpoints.getTickerData}?ticker=${queryParams.ticker}`;
  const { data, error, isLoading } = useSWR<stockDataResponse>(url, fetcher);

  const stockMarketNewsUrl = `${endpoints.getStockMarketNews}?symbol=${queryParams.ticker}`;
  
  const {
    data: stockMarketNewsData,
    error: stockMarketNewsError,
    isLoading: stockMarketNewsLoading,
  } = useSWR<stockMarketNewsResponse>(stockMarketNewsUrl, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return {
    data,
    error,
    isLoading,
    stockMarketNewsData,
    stockMarketNewsError,
    stockMarketNewsLoading,
  };
};
