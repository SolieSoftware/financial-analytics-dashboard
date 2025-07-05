// import ChartSelector from './Charts/RechartChart.tsx'
import MUIChart from "./Charts/MUIChart";
import SideBar from "./Sidebar/sidebar";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="muichart">
          <MUIChart />
        </div>
      </div>
    </>
  );
}

export default App;
