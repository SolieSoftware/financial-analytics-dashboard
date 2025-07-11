"use client";

import { LineChart } from "@mui/x-charts";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { stockEntry, stockEntryCleaned, stockData } from "../types/chartTypes";
import { fetchStockData } from "../redux/stockSlice";
import dayjs from "dayjs";

const MUIChart = () => {
  const dispatch = useDispatch();
  const selectedTicker = useSelector(
    (state: any) => state.ticker.selectedTicker
  );
  const { stockData, status, error } = useSelector((state: any) => state.stock);
  const [data, setData] = useState<stockEntryCleaned[]>([]);

  console.log(
    "MUIChart: Current state - status:",
    status,
    "error:",
    error,
    "stockData:",
    stockData
  );

  useEffect(() => {
    console.log("MUIChart: selectedTicker changed to:", selectedTicker);
    if (!selectedTicker) {
      console.log("MUIChart: No ticker selected, skipping API call");
      return;
    }
    console.log("MUIChart: Dispatching fetchStockData for:", selectedTicker);
    dispatch(fetchStockData(selectedTicker) as any);
  }, [selectedTicker, dispatch]);

  useEffect(() => {
    console.log("MUIChart: stockData changed:", stockData);
    if (stockData?.history) {
      console.log(
        "MUIChart: Processing stock data history:",
        stockData.history.length,
        "items"
      );
      const cleanedData = stockData.history.map((item: stockEntry) => ({
        ...item,
        Date: dayjs(item.Date).toDate(), // Convert to Date object instead of timestamp
      }));
      setData(cleanedData);
      console.log(
        "MUIChart: Data cleaned and set:",
        cleanedData.length,
        "items"
      );
    } else {
      console.log("MUIChart: No stock data history available");
    }
  }, [stockData]);

  if (status === "loading") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#a0aec0", fontSize: "1.1rem" }}>
          Loading chart data...
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ color: "#fc8181", fontSize: "1.1rem", textAlign: "center" }}
        >
          Error: {error}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#a0aec0", fontSize: "1.1rem" }}>
          Select a ticker to view chart data
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <LineChart
        xAxis={[
          {
            data: data.map((d) => d.Date),
            label: "Date",
            scaleType: "time",
            valueFormatter: (value) => dayjs(value).format("MMM DD"),
          },
        ]}
        series={[
          { data: data.map((d) => d.Close), label: "Close", showMark: false },
        ]}
        sx={{
          width: "100%",
          height: "100%",
          "& .MuiChartsAxis-root": {
            fontSize: "12px",
            color: "#ffffff",
            fontWeight: "bold",
          },
          "& .MuiChartsAxis-label": {
            fontSize: "14px",
            color: "#ffffff",
            fontWeight: "bold",
          },
          "& .MuiChartsLegend-root": {
            color: "#ffffff",
          },
          "& .MuiChartsLegend-label": {
            fontSize: "12px",
            color: "#ffffff",
            fontWeight: "bold",
          },
          "& .MuiChartsTooltip-root": {
            backgroundColor: "rgba(26, 32, 44, 0.95)",
            border: "1px solid rgba(74, 85, 104, 0.3)",
            borderRadius: "8px",
            color: "#ffffff",
            fontWeight: "bold",
          },
          "& .MuiChartsLine-mark": {
            display: "none",
          },
          "& .MuiChartsLine-markGroup": {
            display: "none",
          },
          "& .MuiChartsLine-markElement": {
            display: "none",
          },
          "& .MuiChartsLine-markLabel": {
            display: "none",
          },
          "& .MuiChartsAxis-tick": {
            color: "#ffffff",
            fontWeight: "bold",
          },
          "& .MuiChartsAxis-tickLabel": {
            color: "#ffffff !important",
            fontWeight: "bold",
            fontSize: "12px",
          },
          "& .MuiChartsAxis-tickLabel text": {
            fill: "#ffffff !important",
            fontWeight: "bold",
          },
          "& .MuiChartsAxis-tickLabel tspan": {
            fill: "#ffffff !important",
            fontWeight: "bold",
          },
          "& .MuiChartsAxis-tickLabel *": {
            fill: "#ffffff !important",
            color: "#ffffff !important",
          },
          "& .MuiChartsAxis-tick text": {
            fill: "#ffffff !important",
          },
          "& .MuiChartsAxis-tick tspan": {
            fill: "#ffffff !important",
          },
          "& .MuiChartsAxis-line": {
            stroke: "#ffffff",
            strokeWidth: 1,
          },
          "& .MuiChartsAxis-label text": {
            fill: "#ffffff !important",
            fontWeight: "bold",
          },
          "& .MuiChartsAxis-label tspan": {
            fill: "#ffffff !important",
            fontWeight: "bold",
          },
          "& .MuiChartsAxis-label *": {
            fill: "#ffffff !important",
            color: "#ffffff !important",
          },
        }}
      />
    </div>
  );
};

export default MUIChart;
