import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import { formatDuration } from "./sessionUtils";

/**
 * SessionTimeoutDialog
 * Supports two variants:
 * - warning: about to expire (countdown)
 * - expired: already expired (401), shows logged-in and inactive durations
 */
export default function SessionTimeoutDialog({
  open,
  countdownSeconds = 0,
  onContinue,
  onLogOff,
  continueLoading = false,
  variant = "warning",
  loggedInDurationMs = 0,
  inactiveDurationMs = 0,
}) {
  const theme = useTheme();
  const mm = Math.floor(countdownSeconds / 60);
  const ss = countdownSeconds % 60;
  const display = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;

  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark
    ? "rgba(17,24,39,0.92)"
    : "rgba(255,255,255,0.9)";
  const borderColor = isDark
    ? "rgba(255,255,255,0.12)"
    : "rgba(0,0,0,0.08)";

  const isExpired = variant === "expired";

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      aria-labelledby="session-timeout-title"
      PaperProps={{
        sx: {
          maxWidth: 400,
          width: "calc(100% - 32px)",
          mx: 2,
          borderRadius: 3,
          background: glassBg,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${borderColor}`,
          boxShadow: theme.shadows[12],
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <DialogTitle id="session-timeout-title" sx={{ fontWeight: 700, fontSize: "1.25rem", pt: 3, pb: 1, px: 3 }}>
        Session Timeout
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {isExpired
            ? "Your session expired. Please continue to keep working."
            : "Your session is about to expire due to inactivity. You will be logged out in:"}
        </Typography>
        {isExpired ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box
              sx={{
                py: 1.5,
                px: 2,
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">Logged in for</Typography>
              <Typography variant="body1" fontWeight={600}>{formatDuration(loggedInDurationMs)}</Typography>
            </Box>
            <Box
              sx={{
                py: 1.5,
                px: 2,
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">Inactive for</Typography>
              <Typography variant="body1" fontWeight={600}>{formatDuration(inactiveDurationMs)}</Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 2,
              bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              component="span"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: countdownSeconds <= 10 ? "error.main" : "text.primary",
              }}
            >
              {display}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onLogOff}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          Log Off
        </Button>
        <Button
          variant="contained"
          onClick={onContinue}
          disabled={continueLoading}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          {continueLoading ? "Refreshing..." : isExpired ? "Continue" : "Continue Session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
