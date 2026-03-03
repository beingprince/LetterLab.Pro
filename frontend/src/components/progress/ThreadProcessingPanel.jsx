import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import ProgressHeader from "./ProgressHeader";
import ProgressBarRow from "./ProgressBarRow";
import StepsList from "./StepsList";
import LiveStreamPreview from "./LiveStreamPreview";
import SuccessTransition from "./SuccessTransition";
import RefreshIcon from "@mui/icons-material/Refresh";
import LockClockIcon from "@mui/icons-material/LockClock";

/**
 * ThreadProcessingPanel - Agentic progress UI for thread processing
 * Same design language as AnalysisProgressPanel: live status, mini stream, smooth progress.
 * Handles session_expired, error, and success states.
 */
export default function ThreadProcessingPanel({
  title = "System processing",
  providerLabel = null,
  percent = 0,
  elapsedSeconds = 0,
  steps = [],
  currentMessage = null,
  streamLines = [],
  state = "loading",
  errorMessage = null,
  onRetry = () => {},
  onSignIn = () => {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark ? "rgba(17,24,39,0.85)" : "rgba(255,255,255,0.85)";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const isSessionExpired = state === "session_expired";
  const isError = state === "error";
  const isSuccess = state === "success";

  if (isSuccess) return <SuccessTransition message="Ready" />;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 480,
        mx: "auto",
        p: 3,
        borderRadius: 3,
        background: glassBg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${borderColor}`,
        boxShadow: "0 10px 40px rgba(15,23,42,0.08)",
      }}
    >
      <ProgressHeader
        title={title}
        providerLabel={providerLabel}
        subtitle={currentMessage || undefined}
      />

      {isSessionExpired && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2, mb: 2 }}>
          <LockClockIcon sx={{ fontSize: 40, color: "text.secondary" }} />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Session expired — sign in again
          </Typography>
          <Button
            variant="contained"
            onClick={onSignIn}
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
          >
            Sign In
          </Button>
        </Box>
      )}

      {isError && errorMessage && (
        <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {state === "loading" && (
        <>
          <LiveStreamPreview lines={streamLines} />
          <ProgressBarRow percent={percent} elapsedSeconds={elapsedSeconds} />
          <StepsList steps={steps} />
        </>
      )}

      {(isSessionExpired || isError) && (
        <>
          <LiveStreamPreview lines={streamLines} />
          {isError && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={onRetry}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Retry
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
