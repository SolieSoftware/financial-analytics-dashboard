"use client";

import Layout from "./layout";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Finance() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/stock-profile");
  };

  return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          px: 4,
        }}
      >
        <Typography variant="h2" sx={{ mb: 3, fontWeight: 700 }}>
          Financial Analytics Dashboard
        </Typography>

        <Typography
          variant="h5"
          sx={{ mb: 4, color: "#94a3b8", maxWidth: 600 }}
        >
          Welcome to your financial analysis platform. Track stocks, analyze
          market data, and manage your portfolio with real-time insights.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            background: "#3b82f6",
            color: "#ffffff",
            px: 4,
            py: 2,
            fontSize: "1.1rem",
            fontWeight: 600,
            borderRadius: 2,
            "&:hover": {
              background: "#2563eb",
            },
          }}
        >
          Get Started
        </Button>
      </Box>
  );
}
