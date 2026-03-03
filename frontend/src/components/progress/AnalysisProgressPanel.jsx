import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import ProgressHeader from "./ProgressHeader";
import ProgressBarRow from "./ProgressBarRow";
import StepsList from "./StepsList";
import DetailsCollapse from "./DetailsCollapse";
import ProgressFooterActions from "./ProgressFooterActions";
import SuccessTransition from "./SuccessTransition";
import LiveStreamPreview from "./LiveStreamPreview";

/**
 * AnalysisProgressPanel - Composition container (props only, no business logic)
 * LetterLab glass styling, responsive. Live status line + mini stream always visible.
 */
export default function AnalysisProgressPanel({
  title = "Analyzing conversation",
  providerLabel = null,
  percent = null,
  etaSeconds = null,
  elapsedSeconds = 0,
  steps = [],
  detailsOpen = false,
  onToggleDetails = () => {},
  logs = [],
  currentMessage = null,
  streamLines = [],
  state = "loading",
  errorMessage = null,
  onRetry = () => {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const glassBg = isDark ? "rgba(17,24,39,0.85)" : "rgba(255,255,255,0.85)";
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  if (state === "success") {
    return <SuccessTransition />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 720,
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

      {state === "error" && errorMessage && (
        <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      <LiveStreamPreview lines={streamLines} />

      <ProgressBarRow
        percent={percent}
        etaSeconds={etaSeconds}
        elapsedSeconds={elapsedSeconds}
      />
      <StepsList steps={steps} />
      <DetailsCollapse open={detailsOpen} onToggle={onToggleDetails} logs={logs} />
      <ProgressFooterActions state={state} onRetry={onRetry} />
    </Box>
  );
}
