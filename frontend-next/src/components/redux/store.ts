import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import tickerReducer from "./slices/tickerSlice";
import tickerListReducer from "./slices/tickerListSlice";
import dividendReducer from "./slices/dividendSlice";
import marketSummaryReducer from "./slices/marketSummarySlice";
import sidebarReducer from "./slices/sidebarSlice";

const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    tickerList: tickerListReducer,
    dividend: dividendReducer,
    marketSummary: marketSummaryReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
