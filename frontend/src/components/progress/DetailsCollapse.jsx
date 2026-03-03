import React from "react";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LogsList from "./LogsList";

/**
 * DetailsCollapse - "Show details" toggle + collapsible logs
 */
export default function DetailsCollapse({ open, onToggle, logs = [] }) {
  return (
    <Box sx={{ mt: 2 }}>
      <IconButton
        size="small"
        onClick={onToggle}
        sx={{
          color: "text.secondary",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      </IconButton>
      <Typography
        component="span"
        variant="caption"
        color="text.secondary"
        sx={{ cursor: "pointer", userSelect: "none" }}
        onClick={onToggle}
      >
        {open ? "Hide details" : "Show details"}
      </Typography>
      <Collapse in={open}>
        <Box sx={{ mt: 1 }}>
          <LogsList logs={logs} />
        </Box>
      </Collapse>
    </Box>
  );
}
