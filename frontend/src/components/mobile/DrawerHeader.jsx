import React from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function initialsFromName(name) {
  if (!name || typeof name !== "string") return "U";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  const ini = `${first}${last}`.toUpperCase();
  return ini || "U";
}

export default function DrawerHeader({ authedUser, onEdit }) {
  const initials = initialsFromName(authedUser?.name);
  const name = authedUser?.name || "User";
  const email = authedUser?.email || "user@example.com";

  return (
    <Box
      sx={(theme) => ({
        p: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || theme.palette.primary.main} 100%)`,
        borderRadius: "0 0 24px 0",
        color: theme.palette.primary.contrastText,
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "inherit",
              fontSize: "1.25rem",
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                lineHeight: 1.3,
                color: "inherit",
              }}
              noWrap
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.85rem",
                color: "inherit",
              }}
              noWrap
            >
              {email}
            </Typography>
          </Box>
        </Box>
        <Button
          size="small"
          variant="text"
          startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={onEdit}
          sx={{
            color: "inherit",
            opacity: 0.9,
            minWidth: "auto",
            px: 1.5,
            py: 0.5,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.15)",
            },
          }}
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
}
