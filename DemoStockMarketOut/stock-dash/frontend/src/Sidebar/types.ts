export type TickerEntry = {
    "Symbol": string
    "Security Name": string;
    "Market Category": string;
    "Test Issue": string;
    "Financial Status": string;
    "Round Lot Size": number;
    "ETF": string;
    "NextShares": string;
};

export type TickerListResponse ={
    "nasdaq_ticker_list": TickerEntry[]
};