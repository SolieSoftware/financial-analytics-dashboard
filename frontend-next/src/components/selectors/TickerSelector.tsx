"use client";

import { useAppSelector, useAppDispatch } from "../redux/store";
import { setSelectedTickerState } from "../redux/slices/tickerSlice";
import { useState, useEffect, useCallback } from "react";
import { fetchTickerList } from "@/components/redux/slices/tickerListSlice";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";

const TickerSelector = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const params = useParams();

  const { tickerList } = useAppSelector((state) => state.tickerList);
  const selectedTicker = params?.ticker as string;

  const filteredTickers = Object.keys(tickerList || {})
    .filter((ticker) => ticker.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10);

  const debouncedFetch = useCallback(
    (() => {
      let timeout: NodeJS.Timeout;
      return (term: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => dispatch(fetchTickerList(term)), 200);
      };
    })(),
    [dispatch]
  );

  useEffect(() => {
    if (searchTerm) debouncedFetch(searchTerm);
  }, [searchTerm, debouncedFetch]);

  const handleTickerSelect = (ticker: string) => {
    dispatch(setSelectedTickerState(ticker));
    router.push(`/stock-profile/${ticker}`);
    setIsFocused(false);
    setSearchTerm("");
  };

  return (
    <div className="w-1/4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search tickers"
          className="ticker-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />

        {/* Dropdown List */}
        {isFocused && searchTerm && (
          <div className="ticker-dropdown">
            {filteredTickers.length > 0 ? (
              filteredTickers.map((ticker, index) => (
                <button
                  key={ticker}
                  onClick={() => handleTickerSelect(ticker)}
                  className={`ticker-dropdown-item ${
                    selectedTicker === ticker
                      ? "ticker-dropdown-item-active"
                      : "ticker-dropdown-item-inactive"
                  } ${index === 0 ? "rounded-t-lg" : ""} ${
                    index === filteredTickers.length - 1 ? "rounded-b-lg" : ""
                  }`}
                >
                  {ticker}
                </button>
              ))
            ) : (
              <div className="ticker-dropdown-empty">
                <p className="ticker-dropdown-empty-text">
                  No tickers found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default TickerSelector;