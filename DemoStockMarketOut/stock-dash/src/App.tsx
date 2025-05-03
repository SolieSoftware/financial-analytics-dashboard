// import ChartSelector from './Charts/RechartChart.tsx'
import MUIChart from './Charts/MUIChart.tsx'
import SideBar from "./Sidebar/sidebar.tsx"
import './App.css'

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
  )
}

export default App
