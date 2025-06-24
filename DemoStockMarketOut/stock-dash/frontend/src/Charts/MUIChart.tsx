import { LineChart } from '@mui/x-charts';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { stockEntry, stockEntryCleaned, stockData } from '../types/chartTypes';
import dayjs from 'dayjs';

const MUIChart = () => {
  const selectedTicker = useSelector((state: any) => state.ticker.selectedTicker);
  console.log(selectedTicker);
  const [data, setData] = useState<stockEntryCleaned[]>([]);

  useEffect(() => {
    console.log("Selected Ticker:", selectedTicker); 
    if (!selectedTicker) return; 

    const fetchTickerData = async () => {
      try {
      console.log("Fetching data...")
      const res = await fetch(`http://localhost:8000/api/tickers/${selectedTicker}/`);
      const json: stockData = await res.json();
      json.history.forEach((item: stockEntry) => {
        console.log("Date: ", item.Close);  // Inspect the Date format
      });
      const cleanedData = json.history.map(item => ({
        ...item,
        Date: dayjs(item.Date).valueOf(), // Convert to timestamp
      }));

      setData(cleanedData);
      } catch (err) {
        console.log("Unable to fetch Ticker Historical Data: ", err)
      }
    }

    fetchTickerData()
  }, [selectedTicker])

  return (
    <LineChart
      width={900}
      height={500}
      xAxis={[{ data: data.map(d => d.Date), label:"Date" }]}
      series={[{ data: data.map(d => d.Close), label:"Close" }]}
    />
  );
};

export default MUIChart;