import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * SummaryInsightCard - Single intelligence block with strong glassmorphism
 */
export default function SummaryInsightCard({
  title,
  children,
  icon: Icon = null,
  delayMs = 0,
}) {
  return (
    <Box
      sx={(theme) => {
        const isDark = theme.palette.mode === "dark";
        return {
          p: 3,
          borderRadius: 2.5,
          position: "relative",
          overflow: "hidden",
          background: isDark
            ? "linear-gradient(135deg, rgba(30,41,59,0.4) 0%, rgba(17,24,39,0.5) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(248,250,252,0.75) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.5)"}`,
          boxShadow: isDark
            ? "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)"
            : "0 4px 24px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
          borderLeft: "3px solid",
          borderLeftColor: "primary.main",
          transition: "all 0.25s ease",
          animation: "cardFadeIn 0.35s ease both",
          animationDelay: `${delayMs}ms`,
          "@keyframes cardFadeIn": {
            from: { opacity: 0, transform: "translateX(12px)" },
            to: { opacity: 1, transform: "translateX(0)" },
          },
          "&:hover": {
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "0 8px 32px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
            transform: "translateY(-2px)",
          },
        };
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
        {Icon && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        )}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: "0.8125rem",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "text.primary",
            pt: 0.5,
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: "text.secondary",
          pl: Icon ? 5.5 : 0,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
