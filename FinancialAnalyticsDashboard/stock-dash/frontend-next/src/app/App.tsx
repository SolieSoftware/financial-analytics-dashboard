// import ChartSelector from './Charts/RechartChart.tsx'
import MUIChart from "./Charts/MUIChart";
import SideBar from "./Sidebar/sidebar";
import "./App.css";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div
      className={`dashboard-container ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <div className={`sidebar ${!sidebarOpen ? "closed" : ""}`}>
        <SideBar onToggle={handleSidebarToggle} />
      </div>
      <div className="main-content">
        {/* Chart positioned top-right */}
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Stock Analytics Dashboard</h2>
              <p className="chart-subtitle">Stock data visualization</p>
            </div>
          </div>
          <div className="chart-content">
            <MUIChart />
          </div>
        </div>

        {/* Left content area for additional information */}
        <div className="content-area-left">
          <h3 style={{ color: "white", marginBottom: "1rem" }}>
            Market Overview
          </h3>
          <div style={{ color: "rgba(255,255,255,0.8)" }}>
            <p>
              Add your market summary, key metrics, or other important
              information here.
            </p>
            <br />
            <p>This area can contain:</p>
            <ul style={{ textAlign: "left", marginTop: "1rem" }}>
              <li>Market indices</li>
              <li>Top gainers/losers</li>
              <li>News highlights</li>
              <li>Portfolio summary</li>
            </ul>
          </div>
        </div>

        {/* Bottom content area for additional information */}
        <div className="content-area-bottom">
          <h3 style={{ color: "white", marginBottom: "1rem" }}>
            Detailed Analytics
          </h3>
          <div style={{ color: "rgba(255,255,255,0.8)" }}>
            <p>
              Add detailed analytics, performance metrics, or additional charts
              here.
            </p>
            <br />
            <p>This area can contain:</p>
            <ul style={{ textAlign: "left", marginTop: "1rem" }}>
              <li>Technical indicators</li>
              <li>Risk metrics</li>
              <li>Historical comparisons</li>
              <li>Forecast data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
