export type stockEntry = {
    "Date": string,
    "Open": number,
    "High":  number,
    "Low": number,
    "Close": number,
    "Volume": number,
    "Dividends": number,
    "Stock Splits": number
}
 
export type stockEntryCleaned = {
    "Date": number,
    "Open": number,
    "High":  number,
    "Low": number,
    "Close": number,
    "Volume": number,
    "Dividends": number,
    "Stock Splits": number
}

export type stockData = {
    history: stockEntry[]
}