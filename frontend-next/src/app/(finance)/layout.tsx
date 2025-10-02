"use client";

import { fetchTickerList } from "@/components/redux/slices/tickerListSlice";
import { useAppDispatch, useAppSelector } from "@/components/redux/store";
import SideBar from "@/components/sidebar/sidebar";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const appDispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  useEffect(() => {
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
      <main className="main-layout">{children}</main>
    </div>
  );
}
