import React from "react";
import { Box, Typography, Chip } from "@mui/material";

/**
 * ProgressHeader - Title + optional provider chip + optional subtitle
 */
export default function ProgressHeader({ title, providerLabel, subtitle }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        {providerLabel && (
          <Chip
            label={providerLabel}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 600,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "& .MuiChip-label": { px: 1.25 },
            }}
          />
        )}
      </Box>
      {subtitle && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
