"use client";

import { fetchMarketSummary } from "@/components/redux/slices/marketSummarySlice";
import { fetchTickerList } from "@/components/redux/slices/tickerListSlice";
import { useAppDispatch, useAppSelector } from "@/components/redux/store";
import SideBar from "@/components/sidebar/sidebar";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const appDispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  useEffect(() => {
    appDispatch(fetchMarketSummary());
    appDispatch(fetchTickerList(""));
  }, []);

  return (
    <div
      className={`dashboard-container ${
        isOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <div className={`sidebar ${!isOpen ? "closed" : ""}`}>
        <SideBar />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
