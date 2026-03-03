import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * LogsList - Renders sanitized logs (no PII)
 * logs: [{ ts, level, message }]
 */
export default function LogsList({ logs = [] }) {
  if (logs.length === 0) return null;

  return (
    <Box
      component="pre"
      sx={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.7rem",
        lineHeight: 1.5,
        overflow: "auto",
        maxHeight: 120,
        p: 1.5,
        borderRadius: 1,
        bgcolor: "action.hover",
        border: "1px solid",
        borderColor: "divider",
        color: "text.secondary",
        m: 0,
      }}
    >
      {logs.map((log, i) => (
        <Box key={i} component="span" sx={{ display: "block" }}>
          <Typography component="span" variant="caption" color="text.secondary">
            [{log.ts || "-"}] [{log.level || "info"}]
          </Typography>{" "}
          {log.message}
        </Box>
      ))}
    </Box>
  );
}
