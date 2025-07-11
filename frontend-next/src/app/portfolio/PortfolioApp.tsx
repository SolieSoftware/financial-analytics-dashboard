import SideBar from "../Sidebar/sidebar";
import "../App.css";
import { useState } from "react";
import { useSelector } from "react-redux";

function PortfolioApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  const selectedTicker = useSelector(
    (state: any) => state.ticker.selectedTicker
  );

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
        {/* Portfolio content positioned top-right */}
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Portfolio Analytics</h2>
              <p className="chart-subtitle">Portfolio Overview</p>
            </div>
          </div>
          <div className="chart-content">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#a0aec0",
                fontSize: "1.1rem",
              }}
            >
              Portfolio content will go here
            </div>
          </div>
        </div>

        {/* Left content area for portfolio details */}
        <div className="content-area-left">
          <h3>Portfolio Details</h3>
          <p>This is where portfolio-specific information will be displayed.</p>
          <ul>
            <li>Portfolio Performance</li>
            <li>Asset Allocation</li>
            <li>Risk Metrics</li>
            <li>Transaction History</li>
          </ul>
        </div>

        {/* Bottom content area for additional portfolio info */}
        <div className="content-area-bottom">
          <h3>Portfolio Actions</h3>
          <p>
            Quick actions and portfolio management tools will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PortfolioApp;
