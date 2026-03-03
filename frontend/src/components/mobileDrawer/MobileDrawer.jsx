import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  useTheme,
  useMediaQuery,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DrawerHeader from "./DrawerHeader";
import DrawerNavList from "./DrawerNavList";
import DrawerHistoryPreview from "./DrawerHistoryPreview";
import { clearSession } from "../session/sessionUtils";

const paperSx = (theme) => ({
  width: 320,
  maxWidth: "85vw",
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
  borderLeft: "none",
  borderRight: `1px solid ${theme.palette.divider}`,
  borderTop: "none",
  borderBottom: "none",
  background:
    theme.palette.mode === "dark"
      ? "rgba(17,24,39,0.92)"
      : "rgba(255,255,255,0.9)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "0 10px 40px rgba(15,23,42,0.15)",
  overflow: "hidden",
});

export default function MobileDrawer({
  open,
  onClose,
  path,
  navigate,
  authedUser,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    clearSession();
    onClose();
    window.location.href = "/account";
  };

  useEffect(() => {
    if (open && !isMobile) onClose();
  }, [isMobile, open, onClose]);

  if (!isMobile) return null;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      aria-label="Mobile navigation menu"
      PaperProps={{
        sx: {
          ...paperSx(theme),
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        },
      }}
      ModalProps={{
        slotProps: {
          backdrop: {
            sx: {
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
            },
          },
        },
        keepMounted: true,
        onKeyDown: (e) => {
          if (e.key === "Escape") onClose();
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
        }}
      >
        <DrawerHeader authedUser={authedUser} />
        <DrawerNavList
          path={path}
          navigate={navigate}
          onItemClick={onClose}
        />
        <DrawerHistoryPreview />
        <Box sx={{ flex: 1 }} />
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <LogoutOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
}
