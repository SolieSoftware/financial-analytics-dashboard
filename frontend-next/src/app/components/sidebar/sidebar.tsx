"use client";

import React, { useState, useEffect } from "react";
import { fetchTickerList } from "../redux/slices/tickerListSlice";
import { fetchStockData } from "../redux/slices/stockSlice";
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
  Badge,
  LinearProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Menu,
  Close,
  ExpandMore,
  Search,
  Star,
  FilterList,
  Speed,
  Settings,
  Flag,
} from "@mui/icons-material";

import { Navigation } from "../sidebar/navigation";

import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSelectedTickerState } from "../redux/slices/tickerSlice";

interface SideBarProps {
  onToggle?: (isOpen: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ onToggle }) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // Get tickers from Redux store
  const { tickerList, isLoading, error } = useAppSelector(
    (state) => state.tickerList
  );

  useEffect(() => {
    if (!tickerList) {
      dispatch(fetchTickerList());
    }
  }, [tickerList, dispatch]);

  // Get selected ticker from Redux store
  const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);

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

  const filteredTickers = Object?.keys(tickerList ?? {})?.filter((ticker) =>
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
    dispatch(fetchStockData(event.target.value));
    updateActiveFilters("ticker", event.target.value);
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const ticker = filteredTickers[index];
    const isSelected = selectedTicker === ticker;

    return (
      <div
        key={ticker}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          height: "100%",
          padding: "0 4px",
        }}
      >
        <FormControlLabel
          control={
            <Radio
              checked={isSelected}
              onChange={handleRadioChange}
              value={ticker}
              name={ticker}
              sx={{
                color: "#64748b",
                padding: "6px",
                "&.Mui-checked": {
                  color: "#3b82f6",
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "18px",
                },
              }}
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? "#f8fafc" : "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  flex: 1,
                }}
              >
                {ticker}
              </Typography>
              {isSelected && (
                <Star sx={{ fontSize: 12, color: "#3b82f6", ml: 1 }} />
              )}
            </Box>
          }
          sx={{
            width: "100%",
            margin: 0,
            padding: "6px 12px",
            borderRadius: "8px",
            backgroundColor: isSelected
              ? "rgba(59, 130, 246, 0.1)"
              : "transparent",
            border: isSelected
              ? "1px solid rgba(59, 130, 246, 0.2)"
              : "1px solid transparent",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: isSelected
                ? "rgba(59, 130, 246, 0.15)"
                : "rgba(59, 130, 246, 0.05)",
              borderColor: "rgba(59, 130, 246, 0.2)",
              transform: "translateX(2px)",
            },
          }}
        />
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          left: openDrawer ? 320 : 20,
          top: 20,
          zIndex: 9999,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          "&:hover": {
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            transform: "scale(1.05)",
            borderColor: "rgba(59, 130, 246, 0.4)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
          },
          "& .MuiSvgIcon-root": {
            color: "#f8fafc",
            fontSize: "20px",
          },
        }}
      >
        {openDrawer ? <Close /> : <Menu />}
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        open={openDrawer}
        anchor="left"
        variant="persistent"
        ModalProps={{
          keepMounted: false,
        }}
        sx={{
          width: 320,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 320,
            boxSizing: "border-box",
            position: "fixed",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: 1200,
            background:
              "linear-gradient(180deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
            border: "none",
            borderRight: "1px solid rgba(148, 163, 184, 0.1)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  mr: 2,
                }}
              >
                <Speed sx={{ color: "#ffffff", fontSize: "20px" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#f8fafc",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    lineHeight: 1.2,
                  }}
                >
                  Financial Analytics
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  Dashboard
                </Typography>
              </Box>
            </Box>

            {/* Quick Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mb: 0.5,
                  }}
                >
                  Market
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#22c55e",
                    fontWeight: 600,
                  }}
                >
                  +2.4%
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "8px",
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.625rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mb: 0.5,
                  }}
                >
                  Volume
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#3b82f6",
                    fontWeight: 600,
                  }}
                >
                  High
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

          <Box sx={{ p: 3, pb: 2 }}>
            <Navigation />
          </Box>

          {/* Ticker Selection */}
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Accordion
              defaultExpanded
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                "&:before": { display: "none" },
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMore sx={{ color: "#94a3b8", fontSize: 16 }} />
                }
                sx={{
                  px: 3,
                  py: 2,
                  minHeight: "auto",
                  "& .MuiAccordionSummary-content": {
                    margin: "0",
                    alignItems: "center",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <Flag sx={{ color: "#3b82f6", fontSize: 16, mr: 1 }} />
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    Stock Tickers
                  </Typography>
                  <Badge
                    badgeContent={filteredTickers.length}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        color: "#3b82f6",
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                      },
                    }}
                  >
                    <FilterList sx={{ color: "#64748b", fontSize: 12 }} />
                  </Badge>
                </Box>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  px: 3,
                  pb: 3,
                  pt: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <FormControl
                  component="fieldset"
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  {/* Search Field */}
                  <TextField
                    placeholder="Search tickers..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "#64748b", fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        fontSize: "0.875rem",
                        "& fieldset": {
                          borderColor: "rgba(148, 163, 184, 0.2)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "rgba(59, 130, 246, 0.6)",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: "#f8fafc",
                        "&::placeholder": {
                          color: "#64748b",
                          opacity: 1,
                        },
                      },
                    }}
                  />

                  {/* Selected Ticker Display */}
                  {selectedTicker && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        background:
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))",
                        borderRadius: "12px",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Star sx={{ color: "#3b82f6", fontSize: 16, mr: 1 }} />
                        <Typography
                          sx={{
                            fontSize: "0.625rem",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                          }}
                        >
                          Selected Ticker
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "1.125rem",
                          fontWeight: 700,
                          color: "#f8fafc",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {selectedTicker}
                      </Typography>
                    </Box>
                  )}

                  {/* Loading State */}
                  {isLoading && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 4,
                      }}
                    >
                      <LinearProgress
                        sx={{
                          width: "100%",
                          mb: 2,
                          height: "4px",
                          borderRadius: "2px",
                          backgroundColor: "rgba(148, 163, 184, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            background:
                              "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                            borderRadius: "2px",
                          },
                        }}
                      />
                      <Typography
                        sx={{ color: "#64748b", fontSize: "0.875rem" }}
                      >
                        Loading tickers...
                      </Typography>
                    </Box>
                  )}

                  {/* Error State */}
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "8px",
                        color: "#fca5a5",
                        "& .MuiAlert-icon": {
                          color: "#ef4444",
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        Error: {error}
                      </Typography>
                    </Alert>
                  )}

                  {/* Ticker List */}
                  {!isLoading && !error && (
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                      <RadioGroup
                        value={selectedTicker}
                        onChange={handleRadioChange}
                      >
                        <Box
                          sx={{
                            height: "300px",
                            borderRadius: "8px",
                            border: "1px solid rgba(148, 163, 184, 0.1)",
                            backgroundColor: "rgba(15, 23, 42, 0.3)",
                            overflow: "hidden",
                            "&::-webkit-scrollbar": {
                              width: "6px",
                            },
                            "&::-webkit-scrollbar-track": {
                              backgroundColor: "rgba(15, 23, 42, 0.5)",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "rgba(59, 130, 246, 0.5)",
                              borderRadius: "3px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              backgroundColor: "rgba(59, 130, 246, 0.7)",
                            },
                          }}
                        >
                          <List
                            height={300}
                            itemCount={filteredTickers.length}
                            itemSize={44}
                            width="100%"
                          >
                            {Row}
                          </List>
                        </Box>
                      </RadioGroup>

                      {/* Results Count */}
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          mt: 2,
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        {filteredTickers.length} of{" "}
                        {Object.keys(tickerList ?? {}).length} tickers
                      </Typography>
                    </Box>
                  )}
                </FormControl>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Footer */}
          <Box sx={{ p: 3, pt: 2 }}>
            <Divider sx={{ mb: 2, borderColor: "rgba(148, 163, 184, 0.1)" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                © 2024 Analytics Pro
              </Typography>
              <IconButton
                size="small"
                sx={{
                  color: "#64748b",
                  "&:hover": {
                    color: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                <Settings sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SideBar;
