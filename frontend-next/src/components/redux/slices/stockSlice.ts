import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stockDataResponse } from "@/utils/types/stockData";
import { endpoints } from "@/utils/endpoints";

interface QueryParams {
  ticker: string;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  ticker: string;
}

export const fetchStockData = createAsyncThunk(
  "stock/fetchStockData",
  async (queryParams: QueryParams, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const cache = state.stock.cache;
      const cacheKey = queryParams.ticker;
      const cacheEntry = cache[cacheKey];

      // Check if we have cached data that's less than 5 minutes old
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      const now = Date.now();

      if (cacheEntry && now - cacheEntry.timestamp < CACHE_DURATION) {
        return { data: cacheEntry.data, fromCache: true };
      }

      const response = await fetch(endpoints.getTickerData, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryParams),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();

      return { data, fromCache: false };
    } catch (error) {
      console.error("❌ Error for:", queryParams.ticker, error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const initialState: stockDataResponse & { cache: Record<string, CacheEntry> } =
  {
    stockData: null,
    status: "idle",
    error: null,
    cache: {},
  };

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    clearCache: (state) => {
      state.cache = {};
    },
    clearCacheForTicker: (state, action) => {
      delete state.cache[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stockData = action.payload.data;

        // Cache the data if it's not from cache
        if (!action.payload.fromCache) {
          const tickerKey = action.payload.data?.info_data?.symbol || "unknown";
          state.cache[tickerKey] = {
            data: action.payload.data,
            timestamp: Date.now(),
            ticker: tickerKey,
          };
        }
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch stock data";
      });
  },
});

export const { clearCache, clearCacheForTicker } = stockSlice.actions;
export default stockSlice.reducer;
