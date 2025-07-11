"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchStockData } from "../redux/stockSlice";
import { Typography } from "@mui/material";

const LeftPanel = () => {
  const dispatch = useDispatch();
  const selectedTicker = useSelector(
    (state: any) => state.ticker.selectedTicker
  );
  const { stockInfo, status, error } = useSelector((state: any) => state.stock);

  useEffect(() => {
    if (!selectedTicker) return;
    dispatch(fetchStockData(selectedTicker) as any);
  }, [selectedTicker, dispatch]);



  if (status === "loading") {
    return (
      <div style={{ color: "#a0aec0", fontSize: "1rem" }}>
        Loading company info...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ color: "#fc8181", fontSize: "1rem" }}>
        Error loading company info: {error}
      </div>
    );
  }

  if (!selectedTicker) {
    return (
      <div style={{ color: "#a0aec0", fontSize: "1rem" }}>
        Select a ticker to view company information
      </div>
    );
  }

  if (!stockInfo) {
    return (
      <div style={{ color: "#a0aec0", fontSize: "1rem" }}>
        No company information available
      </div>
    );
  }

  return (
    <div className="left-panel">
      <div className="left-panel-header">
        <Typography variant="h6" component="h2" style={{ color: "#f7fafc" }}>
          Company Information
        </Typography>
      </div>
      <br />
      <div className="left-panel-content">
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem" }}>
            <Typography variant="body1" component="p" style={{ color: "#e2e8f0" }}>
              <strong>Name:</strong> {stockInfo.info?.shortName || "N/A"}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <Typography variant="body1" component="p" style={{ color: "#e2e8f0" }}>
              <strong>Sector:</strong> {stockInfo.info?.sector || "N/A"}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
            <Typography variant="body1" component="p" style={{ color: "#e2e8f0" }}>
              <strong>Industry:</strong> {stockInfo.info?.industry || "N/A"}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Full Time Employees:</strong>{" "}
                {stockInfo.info?.fullTimeEmployees || "Number of Employees not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Total Cash:</strong>{" "}
                {stockInfo.info?.totalCash || "Total Cash not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Total Cash per Share:</strong>{" "}
                {stockInfo.info?.totalCashPerShare || "Total Cash per Share not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>EBITDA:</strong>{" "}
                {stockInfo.info?.ebitda || "EBITDA not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Trailing P/E:</strong>{" "}
                {stockInfo.info?.trailingPE || "Trailing PE not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Forward P/E:</strong>{" "}
                {stockInfo.info?.forwardPE || "Forward PE not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Enterprise Value:</strong>{" "}
                {stockInfo.info?.enterpriseValue || "Enterprise Value not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Profit Margins:</strong>{" "}
                {stockInfo.info?.profitMargins || "Profit Margins not available."}
            </Typography>
          </li>
          <li style={{ marginBottom: "1rem" }}>
                <Typography
              variant="body2"
              component="p"
              style={{ color: "#cbd5e0", lineHeight: "1.5" }}
            >
              <strong>Description:</strong>{" "}
                {stockInfo.info?.longBusinessSummary || "No description available"}
            </Typography>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftPanel;

