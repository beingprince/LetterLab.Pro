import React from "react";
import { Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

/**
 * ProgressFooterActions - Retry button (error state), etc.
 */
export default function ProgressFooterActions({ onRetry, state }) {
  if (state !== "error" || !onRetry) return null;

  return (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={onRetry}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Retry
      </Button>
    </Box>
  );
}
