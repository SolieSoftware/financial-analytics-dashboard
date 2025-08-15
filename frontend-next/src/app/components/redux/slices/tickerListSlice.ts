import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { endpoints } from "@/app/utils/endpoints";
import { TickerListResponse } from "@/app/utils/types/tickerTypes";

// Async thunk for fetching ticker list
export const fetchTickerList = createAsyncThunk(
  "tickerList/fetchTickerList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(endpoints.getTickers, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ticker list");
      }
      const { data: tickerList } = await response.json();

      console.log("This is the data", tickerList);

      return { tickerList, isLoading: false, error: null };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch ticker list"
      );
    }
  }
);

const initialState: TickerListResponse = {
  tickerList: {}, 
  isLoading: false,
  error: null
};

const tickerListSlice = createSlice({
  name: "tickerList",
  initialState,
  reducers: {
    setTickers: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.tickerList = action.payload;
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
        state.tickerList = action.payload.tickerList;
      })
      .addCase(fetchTickerList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTickers, clearError } = tickerListSlice.actions;
export default tickerListSlice.reducer;
