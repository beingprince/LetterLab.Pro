import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

function getEtaText(etaSeconds, elapsedSeconds) {
  if (etaSeconds != null && etaSeconds > 0) return `~${etaSeconds}s remaining`;
  if (elapsedSeconds >= 10) return "Taking longer than usual… still working.";
  return "Usually takes ~10–20 seconds";
}

/**
 * ProgressBarRow - LinearProgress + percent + ETA
 * percent/eta null = indeterminate
 */
export default function ProgressBarRow({ percent, etaSeconds, elapsedSeconds = 0 }) {
  const isIndeterminate = percent == null;
  const etaText = getEtaText(etaSeconds, elapsedSeconds);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {isIndeterminate ? "In progress…" : `${Math.round(percent)}%`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {etaText}
        </Typography>
      </Box>
      <LinearProgress
        variant={isIndeterminate ? "indeterminate" : "determinate"}
        value={isIndeterminate ? 0 : Math.min(100, Math.max(0, percent))}
        sx={{
          height: 6,
          borderRadius: 1,
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": {
            borderRadius: 1,
          },
        }}
      />
    </Box>
  );
}
