import React, { useState } from "react";
import { Box, Typography, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import IconButton from "@mui/material/IconButton";

const borderSoft = "rgba(15, 23, 42, 0.08)";

/**
 * SummarySectionBlock - Collapsible section (Key Details, Context, etc.)
 */
export default function SummarySectionBlock({
  title,
  children,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          py: 1,
          borderBottom: `1px solid ${borderSoft}`,
          opacity: 0.9,
        }}
        onClick={() => setOpen((o) => !o)}
        role="button"
        aria-expanded={open}
      >
        <Typography className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </Typography>
        <IconButton size="small" sx={{ p: 0.5 }}>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 20 }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Box>
      <Collapse in={open} timeout={200}>
        <Box
          sx={{
            pt: 2,
            pb: 1,
            "& ul": {
              pl: 2,
              m: 0,
              listStylePosition: "outside",
            },
            "& li": {
              mb: 1,
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "text.primary",
            },
            "& li::marker": { color: "primary.main" },
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
