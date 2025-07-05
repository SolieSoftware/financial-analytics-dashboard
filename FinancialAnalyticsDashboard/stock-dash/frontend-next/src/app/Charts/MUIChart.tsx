"use client";

import { LineChart } from "@mui/x-charts";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { stockEntry, stockEntryCleaned, stockData } from "../types/chartTypes";
import dayjs from "dayjs";

const MUIChart = () => {
  const selectedTicker = useSelector(
    (state: any) => state.ticker.selectedTicker
  );
  console.log(selectedTicker);
  const [data, setData] = useState<stockEntryCleaned[]>([]);

  useEffect(() => {
    console.log("Selected Ticker:", selectedTicker);
    if (!selectedTicker) return;

    const fetchTickerData = async () => {
      try {
        console.log("Fetching data...");
        const res = await fetch(
          `http://localhost:8000/api/tickers/${selectedTicker}/history`
        );
        const json: stockData = await res.json();
        json.history.forEach((item: stockEntry) => {
          console.log("Date: ", item.Close); // Inspect the Date format
        });
        const cleanedData = json.history.map((item) => ({
          ...item,
          Date: dayjs(item.Date).valueOf(), // Convert to timestamp
        }));

        setData(cleanedData);
      } catch (err) {
        console.log("Unable to fetch Ticker Historical Data: ", err);
      }
    };

    fetchTickerData();
  }, [selectedTicker]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <LineChart
        width={400}
        height={300}
        xAxis={[{ data: data.map((d) => d.Date), label: "Date" }]}
        series={[{ data: data.map((d) => d.Close), label: "Close" }]}
        sx={{
          width: "100%",
          height: "100%",
          "& .MuiChartsAxis-root": {
            fontSize: "12px",
          },
          "& .MuiChartsAxis-label": {
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
};

export default MUIChart;
