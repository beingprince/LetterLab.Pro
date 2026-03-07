// src/theme.js
import { createTheme, alpha } from "@mui/material/styles";

const baseFont = "'Outfit', sans-serif";
const bodyFont = "'Outfit', sans-serif";
const radius = 14;

const palette = {
  mode: "light",
  primary: { main: "#2563EB", contrastText: "#fff" },
  secondary: { main: "#0EA5E9" },
  background: {
    default: "#F9FAFB",
    paper: alpha("#FFFFFF", 0.9),
  },
  text: {
    primary: "#111827",
    secondary: alpha("#111827", 0.7),
  },
  divider: alpha("#000", 0.08),
};

const typography = {
  fontFamily: baseFont,
  h1: { fontWeight: 800, fontSize: "2.8rem" },
  h2: { fontWeight: 700, fontSize: "2.2rem" },
  h3: { fontWeight: 700, fontSize: "1.8rem" },
  h4: { fontWeight: 600, fontSize: "1.5rem" },
  h5: { fontWeight: 600, fontSize: "1.25rem" },
  body1: { fontFamily: bodyFont, lineHeight: 1.7 },
  body2: { fontFamily: bodyFont, lineHeight: 1.6 },
  button: { textTransform: "none", fontWeight: 600 },
};

const components = {
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: radius,
        backgroundImage: "none",
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        border: "none",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 50,
        fontWeight: 600,
        paddingInline: "24px",
        paddingBlock: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease-out",
        textTransform: "none",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      },
      containedPrimary: {
        background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
        "&:hover": {
          boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
        },
      },
      outlined: {
        borderColor: "rgba(0,0,0,0.15)",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          backgroundColor: "rgba(0,0,0,0.02)",
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(0,0,0,0.06)",
        fontWeight: 500,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backdropFilter: "blur(16px)",
        backgroundColor: "rgba(255,255,255,0.8)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: "rgba(0,0,0,0.08)",
      },
    },
  },
};

export const lightTheme = createTheme({ palette, typography, components });

// Keep darkTheme as alias to lightTheme so any remaining imports don't break
export const darkTheme = lightTheme;
