import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from './tickerSlice';

const store = configureStore(
    {reducer: 
        {ticker: tickerReducer}
    }
)

export default store;