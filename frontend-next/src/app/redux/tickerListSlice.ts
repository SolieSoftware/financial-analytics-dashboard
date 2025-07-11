import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TickerListResponse, TickerEntry } from "../types/tickerTypes";

interface TickerListState {
  tickers: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: TickerListState = {
  tickers: {},
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Async thunk for fetching ticker list
export const fetchTickerList = createAsyncThunk(
  "tickerList/fetchTickerList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/api/tickers/");
      if (!response.ok) {
        throw new Error("Failed to fetch ticker list");
      }
      const data: TickerListResponse = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch ticker list"
      );
    }
  }
);

const tickerListSlice = createSlice({
  name: "tickerList",
  initialState,
  reducers: {
    setTickers: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.tickers = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickerList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickerList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.lastFetched = Date.now();

        // Convert the ticker list to the format we need
        const tickerSymbols: Record<string, boolean> = {};
        action.payload.nasdaq_ticker_list.forEach((ticker: TickerEntry) => {
          tickerSymbols[ticker["Symbol"]] = false;
        });
        state.tickers = tickerSymbols;
      })
      .addCase(fetchTickerList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTickers, clearError } = tickerListSlice.actions;
export default tickerListSlice.reducer;
