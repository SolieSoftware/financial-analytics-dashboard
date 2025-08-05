import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TickerState {
    selectedTicker: string
};

const initialState: TickerState = {
    selectedTicker: ''
};

const tickerSlice = createSlice({
    name: 'ticker',
    initialState,
    reducers: {
        setSelectedTickerState: (state, action: PayloadAction<string>) => {
            state.selectedTicker = action.payload;
        }
    }
});

export const { setSelectedTickerState } = tickerSlice.actions;

export default tickerSlice.reducer;