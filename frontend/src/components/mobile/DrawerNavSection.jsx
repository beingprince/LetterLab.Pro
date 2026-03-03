import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: HomeIcon },
  { label: "Chat", path: "/chat", icon: EditIcon },
  { label: "Docs", path: "/docs", icon: DescriptionIcon },
  { label: "Analytics", path: "/analytics", icon: AnalyticsIcon },
  { label: "Professors", path: "/add-professor", icon: PeopleIcon },
  { label: "Profile", path: "/profile", icon: PersonIcon },
];

export default function DrawerNavSection({ path, navigate, onItemClick }) {
  return (
    <List sx={{ py: 2, px: 1 }}>
      {NAV_ITEMS.map((item) => {
        const isActive = path === item.path;
        const Icon = item.icon;
        return (
          <ListItemButton
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onItemClick();
            }}
            sx={(theme) => ({
              height: 56,
              borderRadius: 2,
              mb: 0.5,
              bgcolor: isActive
                ? theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)"
                : "transparent",
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.text.primary,
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.03)",
              },
            })}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "inherit",
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.95rem",
              }}
            />
            <ChevronRightIcon
              sx={{ fontSize: 20, opacity: isActive ? 1 : 0.5 }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}
