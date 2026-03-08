import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

/**
 * StepRow - Compact step chip with icon, label, optional meta
 * status: pending | active | done | error
 */
const iconMap = {
  pending: RadioButtonUncheckedIcon,
  active: HourglassEmptyIcon,
  done: CheckCircleIcon,
  error: ErrorIcon,
};

export default function StepRow({ id, label, status = "pending", meta }) {
  const Icon = iconMap[status] || RadioButtonUncheckedIcon;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor:
          status === "active"
            ? "primary.main"
            : status === "done"
              ? "success.main"
              : status === "error"
                ? "error.main"
                : "divider",
        bgcolor:
          status === "active"
            ? "action.selected"
            : status === "done"
              ? "action.hover"
              : "transparent",
      }}
    >
      <Icon
        sx={(theme) => ({
          fontSize: 16,
          flexShrink: 0,
          color:
            status === "done"
              ? "success.main"
              : status === "error"
                ? "error.main"
                : status === "active"
                  ? "primary.main"
                  : "action.disabled",
          animation: status === "active" ? "stepPulse 1.5s ease-in-out infinite" : "none",
          "@keyframes stepPulse": {
            "0%, 100%": { opacity: 1, transform: "scale(1)" },
            "50%": { opacity: 0.5, transform: "scale(0.85)" },
          },
        })}
      />
      <Typography
        variant="caption"
        fontWeight={status === "active" ? 600 : 400}
        color={
          status === "active"
            ? "primary.main"
            : status === "done"
              ? "text.secondary"
              : status === "error"
                ? "error.main"
                : "text.disabled"
        }
      >
        {label}
        {meta && ` · ${meta}`}
      </Typography>
    </Box>
  );
}
