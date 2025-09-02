import useSWR from "swr";
import { fetcher } from "../fetchers/fetchers";
import { endpoints } from "../endpoints";

interface QueryParams {
  ticker: string;
}

export const useStockProfile = (queryParams: QueryParams) => {

  const url = `${endpoints.getTickerData}?ticker=${queryParams.ticker}`;
  const { data, error, isLoading } = useSWR(
    url,
    fetcher
  );
  
  const companyOverviewUrl = `${endpoints.getCompanyOverview}?symbol=${queryParams.ticker}`;
  const { data: companyOverviewData, error: companyOverviewError, isLoading: companyOverviewLoading } = useSWR(
    companyOverviewUrl,
    fetcher
  );
  
  const stockMarketNewsUrl = `${endpoints.getStockMarketNews}?symbol=${queryParams.ticker}`;
  const { data: stockMarketNewsData, error: stockMarketNewsError, isLoading: stockMarketNewsLoading } = useSWR(
    stockMarketNewsUrl,
    fetcher
  );
  

  return { data, error, isLoading, companyOverviewData, companyOverviewError, companyOverviewLoading, stockMarketNewsData, stockMarketNewsError, stockMarketNewsLoading };
};
