import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface DividendStock {
  symbol: string;
  company_name: string;
  current_price: number;
  dividend_yield: number;
  dividend_rate: number;
  payout_ratio: number;
  dividend_growth_5y: number;
  dividend_growth_3y: number;
  dividend_growth_1y: number;
  pe_ratio: number;
  market_cap: number;
  sector: string;
  industry: string;
  beta: number;
  score: number;
  last_dividend_date?: string;
  ex_dividend_date?: string;
  dividend_frequency?: string;
}

export interface DividendState {
  topPicks: DividendStock[];
  sectorAnalysis: { [sector: string]: DividendStock[] };
  selectedStock: DividendStock | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  criteria: {
    min_market_cap: string;
    min_dividend_yield: string;
    max_payout_ratio: string;
    min_dividend_growth: string;
  } | null;
  totalAnalyzed: number;
}

const initialState: DividendState = {
  topPicks: [],
  sectorAnalysis: {},
  selectedStock: null,
  status: "idle",
  error: null,
  criteria: null,
  totalAnalyzed: 0,
};

// Async thunk for fetching top dividend picks
export const fetchTopDividendPicks = createAsyncThunk(
  "dividend/fetchTopPicks",
  async (topN: number = 10) => {
    const response = await fetch(
      `http://localhost:8000/api/dividend/top-picks?top_n=${topN}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch top dividend picks");
    }
    const data = await response.json();
    return data;
  }
);

// Async thunk for fetching dividend stocks by sector
export const fetchDividendStocksBySector = createAsyncThunk(
  "dividend/fetchBySector",
  async () => {
    const response = await fetch(
      "http://localhost:8000/api/dividend/by-sector"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch dividend stocks by sector");
    }
    const data = await response.json();
    return data;
  }
);

const dividendSlice = createSlice({
  name: "dividend",
  initialState,
  reducers: {
    setSelectedStock: (state, action: PayloadAction<DividendStock | null>) => {
      state.selectedStock = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetDividendState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Top picks reducers
      .addCase(fetchTopDividendPicks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTopDividendPicks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topPicks = action.payload.top_picks;
        state.criteria = action.payload.criteria;
        state.totalAnalyzed = action.payload.total_analyzed;
      })
      .addCase(fetchTopDividendPicks.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Failed to fetch top dividend picks";
      })
      // Sector analysis reducers
      .addCase(fetchDividendStocksBySector.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDividendStocksBySector.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sectorAnalysis = action.payload.sectors;
        state.totalAnalyzed = action.payload.total_analyzed;
      })
      .addCase(fetchDividendStocksBySector.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Failed to fetch dividend stocks by sector";
      });
  },
});

export const { setSelectedStock, clearError, resetDividendState } =
  dividendSlice.actions;
export default dividendSlice.reducer;
