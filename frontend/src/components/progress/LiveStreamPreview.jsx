import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const MAX_LINES = 6;
const TYPEWRITER_MS_PER_CHAR = 28;

/**
 * LiveStreamPreview - Always-visible mini activity feed (last 3-6 lines)
 * Typewriter effect on newest line only. Fade/slide for new lines.
 */
export default function LiveStreamPreview({ lines = [] }) {
  const lastLines = lines.slice(-MAX_LINES);
  const newestLine = lastLines[lastLines.length - 1] || "";
  const olderLines = lastLines.slice(0, -1);
  const [typed, setTyped] = useState("");

  // Typewriter for newest line
  useEffect(() => {
    if (!newestLine) {
      setTyped("");
      return;
    }
    setTyped("");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(newestLine.slice(0, i));
      if (i >= newestLine.length) clearInterval(t);
    }, TYPEWRITER_MS_PER_CHAR);
    return () => clearInterval(t);
  }, [newestLine]);

  if (lastLines.length === 0) return null;

  return (
    <Box
      sx={{
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
        fontSize: "0.72rem",
        lineHeight: 1.6,
        color: "text.secondary",
        mt: 1,
        mb: 1.5,
        "@keyframes streamLineIn": {
          "0%": { opacity: 0, transform: "translateY(-4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {olderLines.map((line, idx) => (
        <Box
          key={`${idx}-${line}`}
          sx={{ opacity: 0.85, animation: "streamLineIn 0.2s ease" }}
        >
          <Typography
            component="span"
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          >
            {line}
          </Typography>
        </Box>
      ))}
      {newestLine && (
        <Box sx={{ animation: "streamLineIn 0.2s ease" }}>
          <Typography
            component="span"
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          >
            {typed}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 6,
                height: "1em",
                ml: 0.25,
                bgcolor: "primary.main",
                animation: "blink 1s step-end infinite",
                "@keyframes blink": {
                  "0%, 50%": { opacity: 1 },
                  "51%, 100%": { opacity: 0 },
                },
              }}
            />
          </Typography>
        </Box>
      )}
    </Box>
  );
}
