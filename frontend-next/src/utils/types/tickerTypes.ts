interface TickerListResponse {
    tickerList: { [key: string]: boolean };
    isLoading: boolean;
    error: string | null;
  }

interface TickerEntry {
    Symbol: string;
    Selected: boolean;
  }

interface tickerType {
  ticker: string;
}

interface tickerListType {
  tickerList: tickerType[];
}


export type { TickerListResponse, TickerEntry, tickerType, tickerListType };