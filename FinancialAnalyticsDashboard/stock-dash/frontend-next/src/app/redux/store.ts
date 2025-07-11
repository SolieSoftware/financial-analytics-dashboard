import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from './tickerSlice';
import stockReducer from './stockSlice';

const store = configureStore({
    reducer: {
        ticker: tickerReducer,
        stock: stockReducer
    }
});

export default store;