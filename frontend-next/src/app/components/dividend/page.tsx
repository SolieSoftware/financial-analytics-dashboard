"use client";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import DividendApp from "./DividendApp";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function Dividend() {
  return (
    <StrictMode>
      <Provider store={store}>
        <DividendApp />
      </Provider>
    </StrictMode>
  );
}
