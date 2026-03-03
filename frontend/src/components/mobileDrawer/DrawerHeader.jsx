import React from "react";
import { Box, Avatar, Typography } from "@mui/material";

function initialsFromName(name) {
  if (!name || typeof name !== "string") return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase() || "";
}

export default function DrawerHeader({ authedUser }) {
  const name = authedUser?.name || "";
  const email = authedUser?.email || "";
  const initials = initialsFromName(name);
  const greeting = name ? `Hello, ${name.split(" ")[0] || name}` : "Hello,";
  const subtext = email || (name ? "" : "Sign in to continue");

  return (
    <Box
      sx={(theme) => ({
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        background:
          theme.palette.mode === "dark"
            ? "rgba(17,24,39,0.6)"
            : "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Avatar
        sx={{
          width: 48,
          height: 48,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        {initials || "?"}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, fontSize: "1rem" }}
          noWrap
        >
          {greeting}
        </Typography>
        {subtext && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.8rem" }}
            noWrap
          >
            {subtext}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
