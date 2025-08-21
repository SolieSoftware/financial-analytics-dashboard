"use client";

import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Paper,
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
  const [isFocused, setIsFocused] = useState(false);

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
    setIsFocused(false);
    setSearchTerm("");
  };

  // Determine if the list should be expanded
  const shouldExpand =
    isFocused || searchTerm.length > 0 || filteredTickers.length > 0;

  return (
    <Box
      sx={{
        p: 1,
        position: "relative",
        width: "100%",
        maxWidth: "300px",
      }}
    >
      {/* Search and Selected Ticker Container */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
          mb: 0,
          mt: 2

        }}
      >
        {/* Search */}
        <TextField
          placeholder="Search tickers..."
          size="small"
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(15, 23, 42, 0.5)",
              color: "#f8fafc",
              "& fieldset": { borderColor: "rgba(148, 163, 184, 0.2)" },
              "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.4)" },
              "&.Mui-focused fieldset": {
                borderColor: "rgba(59, 130, 246, 0.6)",
              },
            },
            "& .MuiInputBase-input": { color: "#f8fafc" },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200);
          }}
        />

        {/* Selected Ticker */}
        {selectedTicker && (
          <Box
            sx={{
              p: 0.5,
              bgcolor: "rgba(59, 130, 246, 0.1)",
              borderRadius: 1,
              border: "1px solid rgba(59, 130, 246, 0.2)",
              minWidth: "fit-content",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#f8fafc", fontWeight: 600 }}
            >
              {selectedTicker}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Ticker List */}
      {isFocused && shouldExpand && filteredTickers.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 9999,
            maxHeight: "250px",
            overflow: "auto",
            backgroundColor: "#1e293b",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            borderRadius: 1,
          }}
        >
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
                  px: 2,
                  py: 1,
                  m: 0,
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  },
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    fontWeight: selectedTicker === ticker ? 600 : 400,
                  },
                  "& .MuiRadio-root": {
                    color: selectedTicker === ticker ? "#3b82f6" : "#64748b",
                    "&.Mui-checked": {
                      color: "#3b82f6",
                    },
                  },
                }}
              />
            ))}
          </RadioGroup>
        </Paper>
      )}

      {/* No results message */}
      {isFocused &&
        shouldExpand &&
        searchTerm.length > 0 &&
        filteredTickers.length === 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              p: 2,
              backgroundColor: "#1e293b",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: 1,
            }}
          >
            <Typography sx={{ color: "#64748b", textAlign: "center" }}>
              No tickers found
            </Typography>
          </Paper>
        )}
    </Box>
  );
};
