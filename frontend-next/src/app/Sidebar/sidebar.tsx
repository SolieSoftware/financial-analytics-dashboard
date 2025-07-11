"use client";

import React, { useState, useEffect } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Divider,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  FormControl,
  FormControlLabel,
  TextField,
  RadioGroup,
  Radio,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setSelectedTickerState } from "../redux/tickerSlice";
import { fetchTickerList } from "../redux/tickerListSlice";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandIcon from "@mui/icons-material/ExpandMore";

import { TickerListResponse, TickerEntry } from "../types/tickerTypes";

interface SideBarProps {
  onToggle?: (isOpen: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onToggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");

  // Get tickers from Redux store
  const { tickers, isLoading, error } = useSelector(
    (state: any) => state.tickerList
  );

  // Get selected ticker from Redux store
  const selectedTicker = useSelector(
    (state: any) => state.ticker.selectedTicker
  );

  useEffect(() => {
    // Fetch ticker list if not already loaded
    if (Object.keys(tickers).length === 0) {
      dispatch(fetchTickerList());
    }
  }, [dispatch, tickers]);

  interface ActiveFilter {
    type: string;
    value: string;
  }

  const [openDrawer, setOpenDrawer] = useState(true);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const toggleDrawer = () => {
    const newState = !openDrawer;
    setOpenDrawer(newState);
    onToggle?.(newState);
  };

  const filteredTickers = Object.keys(tickers ?? {}).filter((ticker) =>
    ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateActiveFilters = (type: string, value: string) => {
    const filtered = activeFilters.filter(
      (filter) =>
        !(filter.type == type && (type !== "index" || filter.value === value))
    );

    setActiveFilters([...filtered, { type, value }]);
  };

  const removeActiveFilter = (type: string, value: string | null = null) => {
    setActiveFilters(
      activeFilters.filter((filter) => {
        if (type === "index" && value) {
          return !(filter.type === type && filter.value === value);
        }
        return filter.type !== type;
      })
    );
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSelectedTickerState(event.target.value));
    updateActiveFilters("ticker", event.target.value);
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const ticker = filteredTickers[index];
    const isSelected = selectedTicker === ticker;

    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          height: "100%",
          padding: "0 8px",
        }}
        key={ticker}
      >
        <FormControlLabel
          control={
            <Radio
              checked={isSelected}
              onChange={handleRadioChange}
              value={ticker}
              name={ticker}
              sx={{
                color: "#a0aec0",
                "&.Mui-checked": {
                  color: "#667eea",
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontSize: "0.85rem",
                fontWeight: isSelected ? "bold" : "normal",
                color: isSelected ? "#f7fafc" : "#a0aec0",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {ticker}
            </Typography>
          }
          sx={{
            width: "100%",
            margin: 0,
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: isSelected
              ? "rgba(102, 126, 234, 0.1)"
              : "transparent",
            border: isSelected
              ? "1px solid rgba(102, 126, 234, 0.3)"
              : "1px solid transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: isSelected
                ? "rgba(102, 126, 234, 0.15)"
                : "rgba(102, 126, 234, 0.05)",
            },
          }}
        />
      </div>
    );
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        color="primary"
        aria-label="toggle-sidebar"
        sx={{
          position: "fixed",
          left: openDrawer ? 290 : 300,
          top: 10,
          zIndex: 9999,
          transition: "left 0.3s ease",
          bgcolor: "rgba(26, 32, 44, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          minWidth: "48px",
          minHeight: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          "&:hover": {
            bgcolor: "rgba(26, 32, 44, 0.98)",
            transform: "scale(1.05)",
            borderColor: "rgba(102, 126, 234, 0.5)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "20px",
            color: "#f7fafc",
          },
        }}
      >
        {openDrawer ? <CloseIcon /> : <MenuIcon />}
      </IconButton>
      <Drawer
        open={openDrawer}
        anchor="left"
        variant="persistent"
        ModalProps={{
          keepMounted: false,
        }}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            position: "fixed",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: 1200,
          },
        }}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#f7fafc",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              Navigation
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                component="a"
                href="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  color: "#f7fafc",
                  textDecoration: "none",
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  border: "1px solid rgba(102, 126, 234, 0.2)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.2)",
                    borderColor: "rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "500" }}>
                  📊 Dashboard
                </Typography>
              </Box>

              <Box
                component="a"
                href="/dividend"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  color: "#a0aec0",
                  textDecoration: "none",
                  border: "1px solid rgba(74, 85, 104, 0.2)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    borderColor: "rgba(102, 126, 234, 0.3)",
                    color: "#f7fafc",
                  },
                }}
              >
                <Typography sx={{ fontSize: "0.9rem", fontWeight: "500" }}>
                  💰 Dividend Picks
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Ticker Selection Section */}
          <Accordion
            defaultExpanded
            sx={{
              backgroundColor: "rgba(26, 32, 44, 0.5)",
              borderRadius: "8px",
              "& .MuiAccordionSummary-root": {
                backgroundColor: "rgba(102, 126, 234, 0.1)",
                borderRadius: "8px 8px 0 0",
              },
              "& .MuiAccordionDetails-root": {
                backgroundColor: "rgba(26, 32, 44, 0.3)",
                borderRadius: "0 0 8px 8px",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandIcon />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  margin: "8px 0",
                },
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  width: "100%",
                  fontWeight: "bold",
                  color: "#f7fafc",
                  fontSize: "0.9rem",
                }}
              >
                📈 Stock Tickers
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2 }}>
              <FormControl component="fieldset" fullWidth>
                {/* Search Field */}
                <TextField
                  label="Search Tickers"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(26, 32, 44, 0.8)",
                      color: "#f7fafc",
                      "& fieldset": {
                        borderColor: "rgba(74, 85, 104, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(102, 126, 234, 0.5)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "rgba(102, 126, 234, 0.8)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#a0aec0",
                    },
                    "& .MuiInputBase-input": {
                      color: "#f7fafc",
                    },
                  }}
                />

                {/* Selected Ticker Display */}
                {selectedTicker && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 1,
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                      borderRadius: "6px",
                      border: "1px solid rgba(102, 126, 234, 0.3)",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "0.8rem", color: "#a0aec0", mb: 0.5 }}
                    >
                      Selected:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#f7fafc",
                      }}
                    >
                      {selectedTicker.toUpperCase()}
                    </Typography>
                  </Box>
                )}

                {/* Ticker List */}
                {isLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      color: "#a0aec0",
                    }}
                  >
                    <Typography>Loading tickers...</Typography>
                  </Box>
                ) : error ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      color: "#fc8181",
                    }}
                  >
                    <Typography>Error: {error}</Typography>
                  </Box>
                ) : (
                  <RadioGroup
                    value={selectedTicker}
                    onChange={handleRadioChange}
                  >
                    <Box
                      sx={{
                        maxHeight: "200px",
                        overflow: "auto",
                        "&::-webkit-scrollbar": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "rgba(26, 32, 44, 0.3)",
                          borderRadius: "3px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "rgba(102, 126, 234, 0.5)",
                          borderRadius: "3px",
                        },
                        "&::-webkit-scrollbar-thumb:hover": {
                          backgroundColor: "rgba(102, 126, 234, 0.7)",
                        },
                      }}
                    >
                      <List
                        height={200}
                        itemCount={filteredTickers.length}
                        itemSize={40}
                        width="100%"
                      >
                        {Row}
                      </List>
                    </Box>
                  </RadioGroup>
                )}

                {/* Results Count */}
                {!isLoading && !error && (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#a0aec0",
                      mt: 1,
                      textAlign: "center",
                    }}
                  >
                    {filteredTickers.length} tickers found
                  </Typography>
                )}
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;
