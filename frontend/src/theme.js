// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

// --- DARK THEME ---
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#9c27b0' },
    background: {
      default: '#1a1a2e',
      paper: 'rgba(255, 255, 255, 0.15)',
    },
    text: { primary: '#e0e0e0', secondary: '#c0c0c0' },
  },
  typography: { fontFamily: 'Outfit, sans-serif', h4: { fontWeight: 700 } },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px) saturate(180%)',
          webkitBackdropFilter: 'blur(10px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
          borderRadius: '16px',
        },
      },
    },
  },
});

// --- LIGHT THEME ---
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#673ab7' },
    background: {
      default: '#f4f6f8',
      paper: 'rgba(255, 255, 255, 0.7)',
    },
    text: { primary: '#212121', secondary: '#424242' },
  },
  typography: { fontFamily: 'Outfit, sans-serif', h4: { fontWeight: 700 } },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px) saturate(200%)',
          webkitBackdropFilter: 'blur(12px) saturate(200%)',
          border: '1px solid rgba(209, 213, 219, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});