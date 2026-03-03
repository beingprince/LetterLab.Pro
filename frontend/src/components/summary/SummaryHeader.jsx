import React from "react";
import { Box, Typography, Chip, Avatar } from "@mui/material";

/**
 * SummaryHeader - Executive typography hierarchy
 * Stronger weight headings, softer secondary text
 */
export default function SummaryHeader({
  subject,
  from,
  cc = [],
  date,
  deadline,
  providerLabel = null,
  threadCount = null,
}) {
  const participants = [from, ...cc].filter(Boolean);
  const getInitial = (name) => (name || "?").charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        mb: 4,
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: 1.5, md: 2 },
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        {participants.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            {participants.slice(0, 4).map((p, i) => (
              <Avatar
                key={i}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                {getInitial(p?.name)}
              </Avatar>
            ))}
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{ fontSize: "0.75rem", color: "text.secondary", fontWeight: 500 }}
        >
          {date}
        </Typography>
        {deadline?.text && (
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{ fontSize: "0.75rem", color: "error.main" }}
          >
            {deadline.text}
          </Typography>
        )}
        {providerLabel && (
          <Chip
            label={providerLabel}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          />
        )}
        {threadCount != null && threadCount > 0 && (
          <Chip
            label={`${threadCount} messages`}
            size="small"
            variant="outlined"
            sx={{ height: 24, fontSize: "0.7rem" }}
          />
        )}
      </Box>

      <Typography
        component="h1"
        sx={{
          fontSize: { xs: "1.75rem", md: "2rem" },
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          color: "text.primary",
        }}
      >
        {subject}
      </Typography>

      <Box
        component="hr"
        sx={{
          mt: 3,
          border: "none",
          height: 1,
          background: (t) =>
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.06)",
        }}
      />
    </Box>
  );
}
