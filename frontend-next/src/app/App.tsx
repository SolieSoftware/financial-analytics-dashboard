// import ChartSelector from './Charts/RechartChart.tsx'
import MUIChart from "./components/charts/MUIChart";
import SideBar from "./components/sidebar/sidebar";
import LeftPanel from "./components/info/LeftPanel";
import BottomPanel from "./components/info/BottomPanel";
import { fetchMarketSummary } from "./components/redux/slices/marketSummarySlice";
import { fetchTickerList } from "./components/redux/slices/tickerListSlice";
import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./components/redux/store";

function App() {
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
      <div className="main-content">
        {/* Chart positioned top-right */}
        <div className="chart-container">
          <MUIChart />
        </div>

        {/* Left content area for company information */}
        <div className="content-area-left">
          <LeftPanel />
        </div>

        {/* Bottom content area for performance analytics */}
        <div className="content-area-bottom">
          <BottomPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
