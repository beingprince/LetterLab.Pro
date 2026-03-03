import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

/**
 * SummaryFooterMeta - AI Confidence horizontal status bar
 * Animated progress fill 0 → value
 */
export default function SummaryFooterMeta({
  confidence,
  generatedAt,
  providerLabel,
  modelIndicator,
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const targetValue = confidence != null ? Math.round(confidence * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(targetValue), 100);
    return () => clearTimeout(timer);
  }, [targetValue]);

  const items = [generatedAt, providerLabel, modelIndicator].filter(Boolean);

  return (
    <Box
      sx={(theme) => {
        const isDark = theme.palette.mode === "dark";
        return {
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          py: 2,
          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        };
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "text.secondary",
            mb: 1,
          }}
        >
          AI Confidence Level
        </Typography>
        <Box
          sx={(theme) => ({
            height: 8,
            borderRadius: 4,
            overflow: "hidden",
            background: theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
            maxWidth: 200,
          })}
        >
          <Box
            sx={(theme) => ({
              height: "100%",
              width: `${animatedValue}%`,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark || theme.palette.primary.main})`,
              borderRadius: 4,
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            })}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {items.map((item, i) => (
          <Typography
            key={i}
            variant="caption"
            sx={{ fontSize: "0.75rem", color: "text.secondary" }}
            component="span"
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
