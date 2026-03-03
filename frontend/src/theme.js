// src/theme.js
import { createTheme, alpha } from "@mui/material/styles";

const baseFont = "'Outfit', sans-serif";
const bodyFont = "'Outfit', sans-serif";
const radius = 14;

// Soft color palette — balanced neutrals & blue accents
const paletteLight = {
  mode: "light",
  primary: { main: "#2563EB", contrastText: "#fff" },
  secondary: { main: "#0EA5E9" },
  background: {
    default: "#F9FAFB", // ✅ Fixed: Solid color, no gradient
    paper: alpha("#FFFFFF", 0.9),
  },
  text: {
    primary: "#111827",
    secondary: alpha("#111827", 0.7),
  },
  divider: alpha("#000", 0.08),
};

const paletteDark = {
  mode: "dark",
  primary: { main: "#3B82F6", contrastText: "#fff" },
  secondary: { main: "#06B6D4" },
  background: {
    default: "#0B1120", // ✅ Fixed: Solid color
    paper: alpha("#1E293B", 0.85),
  },
  text: {
    primary: "#F9FAFB",
    secondary: alpha("#F9FAFB", 0.7),
  },
  divider: alpha("#FFF", 0.08),
};

// Shared typography
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

// Shared component overrides
const components = (isDark) => ({
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: radius,
        backgroundImage: "none",
        // ✅ Removed global backdropFilter to avoid blurry dialogs/menus
        // backdropFilter: "blur(12px)", 
        boxShadow: isDark
          ? "0 4px 16px rgba(0,0,0,0.3)"
          : "0 4px 18px rgba(0,0,0,0.08)",
        // ✅ Removed global border (opt-in only now)
        border: "none",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 50, // Pill shape
        fontWeight: 600,
        paddingInline: "24px",
        paddingBlock: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)", // ✅ Neutral, subtle shadow
        transition: "all 0.2s ease-out",
        textTransform: "none",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: isDark
            ? "0 4px 12px rgba(0,0,0,0.3)" // Dark mode lift
            : "0 4px 12px rgba(0,0,0,0.1)", // Light mode lift
        },
      },
      containedPrimary: {
        background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)", // Blue glow only for primary
        "&:hover": {
          boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
        }
      },
      outlined: {
        borderColor: isDark
          ? "rgba(255,255,255,0.15)"
          : "rgba(0,0,0,0.15)",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"
        }
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8, // Slightly squared for chips
        backdropFilter: "blur(6px)",
        backgroundColor: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.7)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.1)" // ✅ Fixed: Visible border in dark mode
          : "1px solid rgba(0,0,0,0.06)",
        fontWeight: 500,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backdropFilter: "blur(16px)",
        backgroundColor: isDark
          ? "rgba(17,24,39,0.8)"
          : "rgba(255,255,255,0.8)",
        borderBottom: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.08)",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.08)",
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: paletteLight,
  typography,
  components: components(false),
});

export const darkTheme = createTheme({
  palette: paletteDark,
  typography,
  components: components(true),
});
