"use client";

import React, { useState, useEffect } from "react";
import { Drawer, Box, IconButton, Typography, Divider } from "@mui/material";
import { Menu, Close, Speed, Settings } from "@mui/icons-material";
import { Navigation } from "./Navigation";
import { QuickStats } from "./QuickStats";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSidebarOpen } from "../redux/slices/sidebarSlice";

function SideBar() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sidebar.isOpen);

  const toggleDrawer = () => {
    dispatch(setSidebarOpen(!isOpen));
  };

  return (
    <>
      <IconButton
        aria-label="Toggle Sidebar"
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          left: isOpen ? 320 : 290,
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
        {isOpen ? <Close /> : <Menu />}
      </IconButton>

      <Drawer
        open={isOpen ? true : false}
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
          </Box>

          <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

          <Box sx={{ p: 3, pb: 2 }}>
            <Navigation />
          </Box>

          <Box sx={{ p: 3, pb: 2 }}>
            <QuickStats />
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
}

export default SideBar;
