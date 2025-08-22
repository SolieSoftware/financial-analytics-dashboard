import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";

interface QueryParams {
  ticker: string;
}

export const useStockProfile = (queryParams: QueryParams) => {

  const url = `${endpoints.getTickerData}?ticker=${queryParams.ticker}`;
  console.log("url", url);
  const { data, error, isLoading } = useSWR(
    url,
    fetcher
  );

  console.log("data", data);

  return { data, error, isLoading };
};
