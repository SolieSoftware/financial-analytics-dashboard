import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import tickerReducer from "./slices/tickerSlice";
import tickerListReducer from "./slices/tickerListSlice";
import dividendReducer from "./slices/dividendSlice";
import sidebarReducer from "./slices/sidebarSlice";
import navigationReducer from "./slices/navigationSlice";

const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    tickerList: tickerListReducer,
    dividend: dividendReducer,
    sidebar: sidebarReducer,
    navigation: navigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
