import SideBar from "../sidebar/sidebar";
import "../App.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { fetchTickerList } from "../redux/slices/tickerListSlice";
import {
  fetchTopDividendPicks,
  setSelectedStock,
  DividendStock,
} from "../redux/slices/dividendSlice";

function DividendApp() {
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  const selectedTicker = useSelector(
    (state: any) => state.ticker.selectedTicker
  );

  // Get tickers from Redux store
  const { tickers, isLoading, error } = useSelector(
    (state: any) => state.tickerList
  );

  // Get dividend data from Redux store
  const {
    topPicks,
    selectedStock,
    status,
    error: dividendError,
    criteria,
    totalAnalyzed,
  } = useSelector((state: any) => state.dividend);

  useEffect(() => {
    // Fetch ticker list if not already loaded
    if (Object.keys(tickers).length === 0) {
      dispatch(fetchTickerList());
    }
  }, [dispatch, tickers]);

  useEffect(() => {
    // Fetch dividend picks if not already loaded
    if (topPicks.length === 0 && status === "idle") {
      dispatch(fetchTopDividendPicks(10));
    }
  }, [dispatch, topPicks.length, status]);

  const handleStockSelect = (stock: DividendStock) => {
    dispatch(setSelectedStock(stock));
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
        {/* Dividend Analysis Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">Dividend Analysis</h2>
              <p className="chart-subtitle">
                {selectedStock?.symbol} - {selectedStock?.company_name}
              </p>
            </div>
          </div>
          <div className="chart-content">
            {status === "loading" ? (
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
                Analyzing dividend stocks...
              </div>
            ) : dividendError ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#fc8181",
                  fontSize: "1.1rem",
                }}
              >
                Error: {dividendError}
              </div>
            ) : (
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
                Dividend yield chart will be displayed here
              </div>
            )}
          </div>
        </div>

        {/* Left content area for dividend stock list */}
        <div className="content-area-left">
          <h3>Top Dividend Picks</h3>
          <p>
            Best dividend-paying stocks based on yield, growth, and stability.
            {criteria && (
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#a0aec0",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                Criteria: Min Yield {criteria.min_dividend_yield}, Max Payout{" "}
                {criteria.max_payout_ratio}
              </span>
            )}
          </p>

          {status === "loading" ? (
            <div
              style={{
                textAlign: "center",
                color: "#a0aec0",
                marginTop: "2rem",
              }}
            >
              Analyzing {totalAnalyzed} stocks...
            </div>
          ) : dividendError ? (
            <div
              style={{
                textAlign: "center",
                color: "#fc8181",
                marginTop: "2rem",
              }}
            >
              Error: {dividendError}
            </div>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              {topPicks.map((stock: DividendStock) => (
                <div
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock)}
                  style={{
                    padding: "12px",
                    margin: "8px 0",
                    borderRadius: "8px",
                    backgroundColor:
                      selectedStock?.symbol === stock.symbol
                        ? "rgba(102, 126, 234, 0.15)"
                        : "rgba(26, 32, 44, 0.5)",
                    border:
                      selectedStock?.symbol === stock.symbol
                        ? "1px solid rgba(102, 126, 234, 0.4)"
                        : "1px solid rgba(74, 85, 104, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#f7fafc",
                          fontSize: "1rem",
                        }}
                      >
                        {stock.symbol}
                      </div>
                      <div style={{ color: "#a0aec0", fontSize: "0.8rem" }}>
                        {stock.company_name}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          color: "#10b981",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        {(stock.dividend_yield * 100).toFixed(1)}%
                      </div>
                      <div style={{ color: "#a0aec0", fontSize: "0.75rem" }}>
                        Yield
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "8px",
                      fontSize: "0.75rem",
                      color: "#a0aec0",
                    }}
                  >
                    <span>
                      Growth:{" "}
                      {(
                        ((stock.dividend_growth_1y +
                          stock.dividend_growth_3y +
                          stock.dividend_growth_5y) /
                          3) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <span>
                      Payout: {(stock.payout_ratio * 100).toFixed(1)}%
                    </span>
                    <span
                      style={{
                        color:
                          stock.score > 70
                            ? "#10b981"
                            : stock.score > 50
                            ? "#3b82f6"
                            : "#f59e0b",
                      }}
                    >
                      Score: {stock.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom content area for dividend metrics */}
        <div className="content-area-bottom">
          <h3>Dividend Metrics</h3>
          {selectedStock && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#a0aec0",
                    fontSize: "0.8rem",
                    marginBottom: "4px",
                  }}
                >
                  Current Yield
                </div>
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {(selectedStock.dividend_yield * 100).toFixed(2)}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#a0aec0",
                    fontSize: "0.8rem",
                    marginBottom: "4px",
                  }}
                >
                  Dividend Growth (Avg)
                </div>
                <div
                  style={{
                    color: "#3b82f6",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {(
                    ((selectedStock.dividend_growth_1y +
                      selectedStock.dividend_growth_3y +
                      selectedStock.dividend_growth_5y) /
                      3) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#a0aec0",
                    fontSize: "0.8rem",
                    marginBottom: "4px",
                  }}
                >
                  Payout Ratio
                </div>
                <div
                  style={{
                    color: "#f59e0b",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {(selectedStock.payout_ratio * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#a0aec0",
                    fontSize: "0.8rem",
                    marginBottom: "4px",
                  }}
                >
                  Current Price
                </div>
                <div
                  style={{
                    color: "#f7fafc",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  ${selectedStock.current_price?.toFixed(2) || "N/A"}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#a0aec0",
                    fontSize: "0.8rem",
                    marginBottom: "4px",
                  }}
                >
                  P/E Ratio
                </div>
                <div
                  style={{
                    color: "#f7fafc",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {selectedStock.pe_ratio?.toFixed(1) || "N/A"}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#a0aec0",
                    fontSize: "0.8rem",
                    marginBottom: "4px",
                  }}
                >
                  Dividend Score
                </div>
                <div
                  style={{
                    color:
                      selectedStock.score > 70
                        ? "#10b981"
                        : selectedStock.score > 50
                        ? "#3b82f6"
                        : "#f59e0b",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {selectedStock.score}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DividendApp;
