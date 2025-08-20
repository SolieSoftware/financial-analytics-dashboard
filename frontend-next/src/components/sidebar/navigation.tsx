"use client";

import {
  BarChart,
  Business,
  AttachMoney,
  TrendingUp,
  Star,
  PieChart,
} from "@mui/icons-material";
import { Box, Typography, Chip, Divider } from "@mui/material";
import Link from "next/link";
import { useAppSelector } from "../redux/store";

export const Navigation = () => {
  const selectedTicker = useAppSelector((state) => state.ticker.selectedTicker);

  const navigationItems = [
    {
      label: "Dashboard",
      href: selectedTicker
        ? `/stock-profile/${selectedTicker}`
        : "/stock-profile",
      icon: BarChart,
      active: true,
      badge: null,
    },
    {
      label: "Portfolio",
      href: "/portfolio",
      icon: Business,
      active: false,
      badge: "3",
    },
    {
      label: "Dividend Picks",
      href: "/dividend",
      icon: AttachMoney,
      active: false,
      badge: "New",
    },
    {
      label: "Market Analysis",
      href: "/analysis",
      icon: TrendingUp,
      active: false,
      badge: null,
    },
    {
      label: "Watchlist",
      href: "/watchlist",
      icon: Star,
      active: false,
      badge: "12",
    },
    {
      label: "Reports",
      href: "/reports",
      icon: PieChart,
      active: false,
      badge: null,
    },
  ];

  return (
    <div>
      {/* Navigation */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 600,
            mb: 2,
          }}
        >
          Navigation
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link href={item.href} key={item.label}>
                <Box
                  key={item.label}
                  component="a"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    color: item.active ? "#f8fafc" : "#94a3b8",
                    textDecoration: "none",
                    backgroundColor: item.active
                      ? "rgba(59, 130, 246, 0.1)"
                      : "transparent",
                    border: item.active
                      ? "1px solid rgba(59, 130, 246, 0.2)"
                      : "1px solid transparent",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    "&:hover": {
                      backgroundColor: item.active
                        ? "rgba(59, 130, 246, 0.15)"
                        : "rgba(59, 130, 246, 0.05)",
                      borderColor: "rgba(59, 130, 246, 0.2)",
                      color: "#f8fafc",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <IconComponent sx={{ fontSize: 16, mr: 1.5 }} />
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: item.active ? 600 : 500,
                      flex: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: "20px",
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        backgroundColor:
                          item.badge === "New"
                            ? "rgba(34, 197, 94, 0.2)"
                            : "rgba(148, 163, 184, 0.2)",
                        color: item.badge === "New" ? "#22c55e" : "#94a3b8",
                        border: `1px solid ${
                          item.badge === "New"
                            ? "rgba(34, 197, 94, 0.3)"
                            : "rgba(148, 163, 184, 0.3)"
                        }`,
                      }}
                    />
                  )}
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />
    </div>
  );
};
