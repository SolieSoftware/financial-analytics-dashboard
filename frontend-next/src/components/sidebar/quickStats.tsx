"use client";
import { Box, Typography } from "@mui/material";


export const QuickStats = () => {
    return (
        <>
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
      </>
    );
  };