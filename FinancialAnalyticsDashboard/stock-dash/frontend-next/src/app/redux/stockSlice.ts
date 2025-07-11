import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { stockEntry, stockEntryCleaned, stockData } from "../types/chartTypes";

export const fetchStockData = createAsyncThunk(
  "stock/fetchStockData",
  async (selectedTicker: string) => {
    const responseData = await fetch(
      `http://localhost:8000/api/tickers/${selectedTicker}/history`
    );
    const responseInfo = await fetch(
      `http://localhost:8000/api/tickers/${selectedTicker}/info`
    );
    const data = await responseData.json();
    const info = await responseInfo.json();
    return { data, info };
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
