import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * SummaryHeroCard - Featured hero panel with subtle glassmorphism
 * Premium AI SaaS intelligence dashboard style
 */
export default function SummaryHeroCard({ threadSummary }) {
  return (
    <Box
      sx={(theme) => {
        const isDark = theme.palette.mode === "dark";
        return {
          p: 3,
          borderRadius: 2,
          position: "relative",
          overflow: "hidden",
          background: isDark ? "rgba(30,41,59,0.5)" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.2)"
            : "0 4px 24px rgba(15,23,42,0.06)",
          borderLeft: "2px solid",
          borderLeftColor: "primary.main",
          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
          animation: "heroFadeIn 0.4s ease both",
          "@keyframes heroFadeIn": {
            from: { opacity: 0, transform: "translateY(6px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        };
      }}
    >
      <Typography
        variant="overline"
        sx={{
          display: "block",
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "primary.main",
          mb: 1.5,
          fontSize: "0.7rem",
          fontFamily: "inherit",
        }}
      >
        Summary
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "0.9375rem",
          lineHeight: 1.7,
          color: "text.primary",
          fontFamily: "inherit",
        }}
      >
        {threadSummary}
      </Typography>
    </Box>
  );
}
