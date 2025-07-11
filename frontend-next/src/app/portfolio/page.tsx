"use client";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import PortfolioApp from "./PortfolioApp";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function Portfolio() {
  return (
    <StrictMode>
      <Provider store={store}>
        <PortfolioApp />
      </Provider>
    </StrictMode>
  );
}
