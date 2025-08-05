import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@/app/utils/endpoints";
import { stockDataResponse  } from "@/app/utils/types/stockData";

export const fetchStockData = createAsyncThunk(
  "stock/fetchStockData",
  async (selectedTicker: string) => {
    console.log("Fetching stock data foxr ticker:", selectedTicker);
    try {
      const response = await fetch(endpoints.getTickerData, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker: selectedTicker }),
      })

      if (!response.ok) {
        throw new Error(`Ticker Data API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Stock data fetched successfully:", { data });
      return { data };
    } catch (error) {
      console.error("Error fetching stock data:", error);
      throw error;
    }
  }
);


const initialState: stockDataResponse = {
  stockData: null,
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
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch stock data";
      });
  },
});

export default stockSlice.reducer;
