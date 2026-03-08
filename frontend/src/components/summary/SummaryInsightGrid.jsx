import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

/**
 * SummaryInsightGrid - Stacked insight cards with uniform design
 * Premium AI SaaS intelligence dashboard style
 */
export default function SummaryInsightGrid({
  actionRequired,
  keyPoints,
  respondTo,
  tone,
  urgency,
}) {
  const intent = keyPoints?.[0] || "—";
  const keyDetailsText =
    keyPoints?.length > 1
      ? keyPoints.slice(1, 5).join(" • ")
      : keyPoints?.[0] || "—";
  const confidence = tone ? Math.round((tone.confidence || 0) * 100) : 0;
  const toneText = tone ? tone.sentiment : "—";
  const strategyText =
    respondTo?.length > 0 ? respondTo.join(" • ") : "—";

  const urgencyColor = {
    high: "error",
    medium: "warning",
    low: "success",
  };

  const items = [
    {
      title: "Action Required",
      icon: AssignmentOutlinedIcon,
      text: actionRequired || "—",
      highlight: true,
    },
    {
      title: "Key Details",
      icon: LightbulbOutlinedIcon,
      text: keyDetailsText,
      highlight: false
    },
    {
      title: "Tone Sensitivity",
      icon: WarningAmberOutlinedIcon,
      text: urgency === "high"
        ? "Highly sensitive or formal context detected. Proceed with caution."
        : "Standard professional context. No high-risk tone sensitivity identified.",
      highlight: false,
    },
    {
      title: "Context Certainty",
      icon: TimelineOutlinedIcon,
      text: `AI Sentiment Detection: ${toneText}`,
      confidence,
      highlight: false,
    },
    {
      title: "Proposed Strategy",
      icon: PsychologyOutlinedIcon,
      text: strategyText,
      highlight: false,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
      }}
    >
      {items.map((item, i) => (
        <Box
          key={i}
          sx={(theme) => {
            const isDark = theme.palette.mode === "dark";
            const baseBg = isDark ? "rgba(30,41,59,0.4)" : "rgba(255,255,255,0.7)";
            const highlightBg = isDark
              ? "rgba(37,99,235,0.08)"
              : "rgba(37,99,235,0.04)";
            return {
              p: 2.5,
              borderRadius: 2,
              background: item.highlight ? highlightBg : baseBg,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: `1px solid ${item.highlight ? (isDark ? "rgba(59,130,246,0.2)" : "rgba(37,99,235,0.12)") : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)")}`,
              boxShadow: isDark
                ? "0 2px 12px rgba(0,0,0,0.15)"
                : "0 2px 12px rgba(15,23,42,0.04)",
              transition: "all 0.2s ease",
              animation: "insightFadeIn 0.35s ease both",
              animationDelay: `${i * 50}ms`,
              "@keyframes insightFadeIn": {
                from: { opacity: 0, transform: "translateY(4px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: isDark
                  ? "0 4px 20px rgba(0,0,0,0.2)"
                  : "0 4px 20px rgba(15,23,42,0.08)",
              },
            };
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                minWidth: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                flexShrink: 0,
              }}
            >
              <item.icon sx={{ fontSize: 16 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                    fontFamily: "inherit",
                  }}
                >
                  {item.title}
                </Typography>

                {item.confidence != null && item.confidence > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      ml: "auto",
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 4,
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: "action.hover",
                      }}
                    >
                      <Box
                        sx={(t) => ({
                          height: "100%",
                          width: `${item.confidence}%`,
                          background: `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.dark || t.palette.primary.main})`,
                          borderRadius: 2,
                          transition: "width 0.6s ease",
                        })}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8125rem",
                  lineHeight: 1.55,
                  color: "text.primary",
                  fontFamily: "inherit",
                }}
              >
                {item.text}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
