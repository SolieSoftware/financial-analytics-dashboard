import { Box, Skeleton } from "@mui/material";
import { Card, CardContent } from "@mui/material"


export const LoadingPage = () => {
    return (
        <>
        <Box sx={{ width: "100%" }}>
        <Card
          sx={{
            backgroundColor: "rgba(26, 32, 44, 0.9)",
            border: "1px solid rgba(74, 85, 104, 0.3)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            {Array.from({ length: 3 }).map((_, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton
                  variant="rectangular"
                  height={120}
                  sx={{ mb: 1, borderRadius: 1 }}
                />
                <Skeleton variant="text" width="100%" height={24} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
      </>
    )
}