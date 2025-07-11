import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { stockEntry, stockEntryCleaned, stockData } from "../types/chartTypes";

export const fetchStockData = createAsyncThunk(
  "stock/fetchStockData",
  async (selectedTicker: string) => {
    console.log("Fetching stock data for ticker:", selectedTicker);
    try {
      const responseData = await fetch(
        `http://localhost:8000/api/tickers/${selectedTicker}/history`
      );
      const responseInfo = await fetch(
        `http://localhost:8000/api/tickers/${selectedTicker}/info`
      );

      if (!responseData.ok) {
        throw new Error(`History API failed: ${responseData.status}`);
      }
      if (!responseInfo.ok) {
        throw new Error(`Info API failed: ${responseInfo.status}`);
      }

      const data = await responseData.json();
      const info = await responseInfo.json();
      console.log("Stock data fetched successfully:", { data, info });
      return { data, info };
    } catch (error) {
      console.error("Error fetching stock data:", error);
      throw error;
    }
  }
);

interface StockState {
  stockData: stockData | null;
  stockInfo: any | null; // You can replace 'any' with a proper type when you have it
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: StockState = {
  stockData: null,
  stockInfo: null,
  status: "idle",
  error: null,
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stockData = action.payload.data;
        state.stockInfo = action.payload.info;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch stock data";
      });
  },
});

export default stockSlice.reducer;
