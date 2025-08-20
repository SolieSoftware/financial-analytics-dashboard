import MUIChart from "../../../components/charts/MUIChart";
import LeftPanel from "../../../components/info/LeftPanel";
import BottomPanel from "../../../components/info/BottomPanel";
import Layout from "../layout";

function StockProfilePage() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default StockProfilePage;
