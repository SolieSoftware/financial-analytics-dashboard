import { Box } from "@mui/material";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      component="div"
      sx={{
        display: "flex !important",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        padding: 2,
        margin: 0,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      <Box
        component="div"
        sx={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: 3,
          backgroundColor: "rgba(26, 32, 44, 0.9)",
          border: "1px solid rgba(74, 85, 104, 0.3)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          padding: 4,
          margin: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
