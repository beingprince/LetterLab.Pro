import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LockClockIcon from "@mui/icons-material/LockClock";

/**
 * SessionExpiredState
 * Centered card shown when session is expired or token invalid.
 * Used in Compose, Pull Email, etc. instead of blank screen.
 */
export default function SessionExpiredState({
  message = "Session expired. Please sign in again.",
  onSignIn,
  onBackToHome,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "min(400px, 60vh)",
        p: 3,
      }}
    >
      <Box
        sx={(theme) => ({
          width: "min(420px, 100%)",
          p: 4,
          borderRadius: 3,
          background:
            theme.palette.mode === "dark"
              ? "rgba(17,24,39,0.9)"
              : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        })}
      >
        <LockClockIcon sx={{ fontSize: 48, color: "text.secondary" }} />
        <Typography variant="h6" fontWeight={600} textAlign="center">
          {message}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", mt: 2 }}>
          {onSignIn && (
            <Button
              variant="contained"
              onClick={onSignIn}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Sign In
            </Button>
          )}
          {onBackToHome && (
            <Button
              variant="outlined"
              onClick={onBackToHome}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Back to Home
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
