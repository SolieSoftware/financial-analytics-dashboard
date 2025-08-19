import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@/app/utils/endpoints";
import { marketSummary } from "@/app/utils/types/marketSummary";

export const fetchMarketSummary = createAsyncThunk(
    "marketSummary/fetchMarketSummary",
    async () => {
        try {
            const response = await fetch(endpoints.getMarketSummary, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Market summary API failed: ${response.status}`);
            }

            const data = await response.json();
            return { data };

        } catch (error) {
            console.error("Error fetching market summary:", error);
            throw error;
        }
    }
)

const initialState = {
    marketSummary: null as marketSummary | null,
    status: "idle",
    error: null as string | null,
}

const marketSummarySlice = createSlice({
    name: "marketSummary",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarketSummary.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMarketSummary.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.marketSummary = action.payload.data;
            })
            .addCase(fetchMarketSummary.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "An error occurred";
            })
    }
})

export default marketSummarySlice.reducer;