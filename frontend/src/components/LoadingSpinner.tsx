// frontend/src/components/LoadingSpinner.tsx
import React from "react";
import { CircularProgress, Box } from "@mui/material";

const LoadingSpinner: React.FC = () => {
  return (
    <Box className="flex justify-center items-center py-4">
      <CircularProgress color="primary" />
    </Box>
  );
};

export default LoadingSpinner;
