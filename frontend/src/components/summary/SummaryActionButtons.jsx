import React from "react";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";

/**
 * SummaryActionButtons - Premium CTA styling
 * Draft Reply: gradient primary with hover glow
 * Copy Summary: secondary ghost button
 */
export default function SummaryActionButtons({
  onCopy,
  onDraft,
  isEmbedded,
}) {
  const barSx = (theme) => {
    const isDark = theme.palette.mode === "dark";
    return {
      position: isEmbedded ? "relative" : "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      p: 2,
      background: isDark
        ? "rgba(17,24,39,0.92)"
        : "rgba(255,255,255,0.92)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
      boxShadow: isDark
        ? "0 -4px 20px rgba(0,0,0,0.15)"
        : "0 -4px 20px rgba(15,23,42,0.05)",
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "stretch", md: "center" },
      gap: 2,
      zIndex: 100,
      fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    };
  };

  return (
    <Box sx={barSx}>
      <Box
        sx={{
          maxWidth: 1160,
          mx: "auto",
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 1.25,
            width: { xs: "100%", md: "auto" },
            order: 1,
          }}
        >
          <Button
            variant="text"
            startIcon={<ContentCopyIcon />}
            onClick={onCopy}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
              flex: { xs: 1, md: "none" },
              "&:hover": {
                bgcolor: "action.hover",
                color: "text.primary",
              },
            }}
          >
            Copy Summary
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onDraft}
            sx={(theme) => ({
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || "#1D4ED8"} 100%)`,
              boxShadow: `0 2px 12px ${theme.palette.primary.main}40`,
              flex: { xs: 1, md: "none" },
              transition: "all 0.2s ease",
              "&:hover": {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark || "#1D4ED8"} 0%, #1E40AF 100%)`,
                boxShadow: `0 4px 20px ${theme.palette.primary.main}50`,
                transform: "translateY(-1px)",
              },
            })}
          >
            Draft Reply
          </Button>
        </Box>
        {!isEmbedded && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              fontWeight: 600,
              alignSelf: { xs: "flex-start", md: "center" },
              order: 2,
            }}
          >
            Back
          </Button>
        )}
      </Box>
    </Box>
  );
}
