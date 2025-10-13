"use client";
import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";
import { MarketNewsAPIResponse } from "../types/newsTypes";

interface generalMarketNewsResponse {
  general_market_news: MarketNewsAPIResponse;
}

export const useMarketProfile = () => {
  const url = `${endpoints.getGeneralMarketNews}`
  const { data, error, isLoading } = useSWR<generalMarketNewsResponse>(url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return {
    data,
    error,
    isLoading,
  };
};

