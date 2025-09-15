import { Alert, AlertTitle, Box } from "@mui/material";


export const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <Box sx={{ width: "100%" }}>
    <Alert
      severity="error"
      sx={{
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      }}
    >
      <AlertTitle>Error</AlertTitle>
      Error loading market news: {error?.message || error?.toString()}
    </Alert>
  </Box>
  );
};

export default ErrorPage;