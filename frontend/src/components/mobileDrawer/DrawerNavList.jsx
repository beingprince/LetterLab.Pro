import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DRAWER_NAV_ITEMS } from "./drawerConfig";

export default function DrawerNavList({ path, navigate, onItemClick }) {
  return (
    <List sx={{ py: 2, px: 1.5 }}>
      {DRAWER_NAV_ITEMS.map((item) => {
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
              height: 50,
              borderRadius: 2,
              mb: 0.5,
              bgcolor: isActive
                ? (theme.palette.mode === "dark"
                    ? "rgba(37,99,235,0.15)"
                    : "rgba(37,99,235,0.08)")
                : "transparent",
              color: isActive ? "primary.main" : "text.primary",
              "&:hover": {
                bgcolor: isActive
                  ? (theme.palette.mode === "dark"
                      ? "rgba(37,99,235,0.2)"
                      : "rgba(37,99,235,0.1)")
                  : (theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)"),
              },
            })}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <Icon sx={{ fontSize: 22 }} />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.95rem",
              }}
            />
            <ChevronRightIcon sx={{ fontSize: 20, opacity: isActive ? 1 : 0.5 }} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
