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

  useEffect(() => {
    if (!selectedTicker) return;
    dispatch(fetchStockData(selectedTicker) as any);
  }, [selectedTicker]);

  useEffect(() => {
    if (stockData?.history) {
      const cleanedData = stockData.history.map((item: stockEntry) => ({
        ...item,
        Date: dayjs(item.Date).valueOf(),
      }));
      setData(cleanedData);
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
        xAxis={[{ data: data.map((d) => d.Date), label: "Date" }]}
        series={[
          { data: data.map((d) => d.Close), label: "Close", showMark: false },
        ]}
        sx={{
          width: "100%",
          height: "100%",
          "& .MuiChartsAxis-root": {
            fontSize: "11px",
            color: "#a0aec0",
          },
          "& .MuiChartsAxis-label": {
            fontSize: "12px",
            color: "#e2e8f0",
            fontWeight: "500",
          },
          "& .MuiChartsLegend-root": {
            color: "#e2e8f0",
          },
          "& .MuiChartsLegend-label": {
            fontSize: "11px",
            color: "#a0aec0",
          },
          "& .MuiChartsTooltip-root": {
            backgroundColor: "rgba(26, 32, 44, 0.95)",
            border: "1px solid rgba(74, 85, 104, 0.3)",
            borderRadius: "8px",
            color: "#f7fafc",
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
        }}
      />
    </div>
  );
};

export default MUIChart;
