import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

/**
 * SuccessTransition - Success check + smooth fade (before next view)
 */
export default function SuccessTransition({ message = "Draft ready" }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        opacity: 0,
        animation: "fadeIn 0.35s ease forwards",
        "@keyframes fadeIn": {
          to: { opacity: 1 },
        },
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 48, color: "success.main", mb: 1 }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
