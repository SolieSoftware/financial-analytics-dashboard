"use client";

import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { debounce } from "lodash";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { setSelectedTickerState } from "../redux/slices/tickerSlice";
import { useState, useEffect } from "react";
import { fetchStockData } from "@/components/redux/slices/stockSlice";
import { fetchTickerList } from "@/components/redux/slices/tickerListSlice";
import { useRouter } from "next/navigation";

export const TickerSelector = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Get data from Redux
  const { tickerList } = useAppSelector((state) => state.tickerList);
  const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);

  // Filter tickers based on search
  const filteredTickers = Object.keys(tickerList || {}).filter((ticker) =>
    ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const debouncedFetchTickerList = debounce((searchTerm: string) => {
    dispatch(fetchTickerList(searchTerm));
  }, 200);

  useEffect(() => {
    debouncedFetchTickerList(searchTerm);
  }, [searchTerm]);

  const handleTickerSelect = (ticker: string) => {
    dispatch(setSelectedTickerState(ticker));
    dispatch(fetchStockData({ ticker: ticker }));
    router.push(`/stock-profile/${ticker}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Search */}
      <TextField
        placeholder="Search tickers..."
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            color: "#f8fafc",
            "& fieldset": { borderColor: "rgba(148, 163, 184, 0.2)" },
            "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.4)" },
          },
          "& .MuiInputBase-input": { color: "#f8fafc" },
        }}
      />

      {/* Selected Ticker */}
      {selectedTicker && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: "rgba(59, 130, 246, 0.1)",
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: "#f8fafc" }}>
            {selectedTicker}
          </Typography>
        </Box>
      )}

      {/* Ticker List */}
      <Box sx={{ height: 300, overflow: "auto" }}>
        <RadioGroup
          value={selectedTicker}
          onChange={(e) => handleTickerSelect(e.target.value)}
        >
          {filteredTickers.map((ticker) => (
            <FormControlLabel
              key={ticker}
              control={<Radio size="small" />}
              label={ticker}
              value={ticker}
              sx={{
                color: selectedTicker === ticker ? "#3b82f6" : "#94a3b8",
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                  fontWeight: selectedTicker === ticker ? 600 : 400,
                },
              }}
            />
          ))}
        </RadioGroup>
      </Box>

      {/* Count */}
      <Typography
        variant="caption"
        sx={{ color: "#64748b", textAlign: "center", display: "block", mt: 1 }}
      >
        {filteredTickers.length} tickers
      </Typography>
    </Box>
  );
};
