interface TickerListResponse {
    tickerList: { [key: string]: boolean };
    isLoading: boolean;
    error: string | null;
  }

  interface TickerEntry {
    Symbol: string;
    Selected: boolean;
  }

  export type { TickerListResponse, TickerEntry };