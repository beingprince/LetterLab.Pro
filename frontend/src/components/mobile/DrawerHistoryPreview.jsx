import React from "react";
import { Box, Typography, List, ListItemButton } from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";

const PLACEHOLDER_ITEMS = [
  {
    primary: "Request for Extension...",
    secondary: "Professor, I've been dealing with...",
    path: "/chat",
  },
];

export default function DrawerHistoryPreview({ onItemClick, navigate }) {
  return (
    <Box sx={{ flex: 1, p: 2, pt: 0 }}>
      <Typography
        variant="subtitle2"
        sx={(theme) => ({
          fontWeight: 700,
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: theme.palette.text.secondary,
          mb: 1.5,
        })}
      >
        Recent
      </Typography>
      <List disablePadding>
        {PLACEHOLDER_ITEMS.map((item, idx) => (
          <ListItemButton
            key={idx}
            onClick={() => {
              navigate(item.path);
              onItemClick();
            }}
            sx={(theme) => ({
              borderRadius: 2,
              mb: 1,
              py: 1.5,
              px: 2,
              alignItems: "flex-start",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
              border: `1px solid ${theme.palette.divider}`,
              backdropFilter: "blur(8px)",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
              },
            })}
          >
            <HistoryIcon
              sx={{
                fontSize: 20,
                color: "text.secondary",
                mr: 1.5,
                mt: 0.25,
                flexShrink: 0,
              }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  lineHeight: 1.3,
                }}
                noWrap
              >
                {item.primary}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                noWrap
                display="block"
              >
                {item.secondary}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
