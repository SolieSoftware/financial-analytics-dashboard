import { configureStore } from "@reduxjs/toolkit";
import tickerReducer from "./tickerSlice";
import stockReducer from "./stockSlice";
import tickerListReducer from "./tickerListSlice";
import dividendReducer from "./dividendSlice";

const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    stock: stockReducer,
    tickerList: tickerListReducer,
    dividend: dividendReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export default store;
