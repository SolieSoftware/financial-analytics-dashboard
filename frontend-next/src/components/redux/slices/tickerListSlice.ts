import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { endpoints } from "@/utils/endpoints";
import { TickerListResponse } from "@/utils/types/tickerTypes";

export const fetchTickerList = createAsyncThunk(
  "tickerList/fetchTickerList",
  async (searchQuery: string = "", { rejectWithValue }) => {
    try {
      const response = await fetch(endpoints.getTickers, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ticker list");
      }
      const { data: tickerList } = await response.json();

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
  error: null,
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
