// import ChartSelector from './Charts/RechartChart.tsx'
import MUIChart from "./Charts/MUIChart";
import SideBar from "./Sidebar/sidebar";
import LeftPanel from "./Info/LeftPanel";
import BottomPanel from "./Info/BottomPanel";
import "./App.css";
import { useState } from "react";
import { useSelector } from "react-redux";

function App() {
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
        {/* Chart positioned top-right */}
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Financial Analytics Dashboard</h2>
              <p className="chart-subtitle">{selectedTicker}</p>
            </div>
          </div>
          <div className="chart-content">
            <MUIChart />
          </div>
        </div>

        {/* Left content area for additional information */}
        <div className="content-area-left">
          <LeftPanel />
        </div>

        {/* Bottom content area for additional information */}
        <div className="content-area-bottom">
          <BottomPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
