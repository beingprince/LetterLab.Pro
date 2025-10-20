// frontend/src/theme.js
import { createTheme, alpha } from '@mui/material/styles';

const fonts = {
  display: `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
  body: `'Source Serif Pro', Georgia, 'Times New Roman', serif`,
  mono: `Consolas, Menlo, Monaco, 'Courier New', monospace`,
};

const radius = 16;

const commonGlass = (mode) => {
  const isDark = mode === 'dark';
  return {
    glass: {
      // surface tints
      card: isDark ? alpha('#FFFFFF', 0.06) : alpha('#FFFFFF', 0.6),
      panel: isDark ? alpha('#FFFFFF', 0.04) : alpha('#FFFFFF', 0.5),
      chip: isDark ? alpha('#FFFFFF', 0.10) : alpha('#000000', 0.06),
      border: isDark ? alpha('#FFFFFF', 0.16) : alpha('#000000', 0.12),
      // brand accent (LetterLabs blue)
      accent: '#00A3FF',
    },
    shape: { borderRadius: radius },
    shadows: [
      'none',
      '0 6px 16px rgba(0,0,0,0.08)',
      '0 10px 26px rgba(0,0,0,0.10)',
      ...Array(22).fill('0 20px 60px rgba(0,0,0,0.18)'),
    ],
  };
};

const light = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#00A3FF' },
    background: {
      default: '#ffffff',
      paper: alpha('#FFFFFF', 0.65),
    },
    divider: alpha('#000000', 0.08),
    text: {
      primary: '#0B1220',
      secondary: alpha('#0B1220', 0.64),
    },
  },
  typography: {
    fontFamily: fonts.display,
    h1: { fontWeight: 800, letterSpacing: -0.5 },
    h2: { fontWeight: 800, letterSpacing: -0.3 },
    body1: { fontFamily: fonts.body, fontSize: 16, lineHeight: 1.6 },
    code: { fontFamily: fonts.mono },
  },
  ...commonGlass('light'),
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.glass.panel,
          backdropFilter: 'blur(14px) saturate(120%)',
          WebkitBackdropFilter: 'blur(14px) saturate(120%)',
          borderBottom: `1px solid ${theme.glass.border}`,
          boxShadow: '0 10px 26px rgba(0,0,0,0.06)',
        }),
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.glass.card,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${theme.glass.border}`,
          borderRadius: radius,
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.glass.card,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${theme.glass.border}`,
          borderRadius: radius,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
        }),
        containedPrimary: ({ theme }) => ({
          background: `linear-gradient(180deg, ${alpha(theme.glass.accent, 0.95)} 0%, ${theme.glass.accent} 100%)`,
          boxShadow: '0 10px 30px rgba(0,163,255,0.35)',
          ':hover': { transform: 'translateY(-1px)', boxShadow: '0 14px 36px rgba(0,163,255,0.45)' },
          transition: 'transform .15s ease, box-shadow .15s ease',
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.glass.border,
        }),
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          background: alpha('#FFFFFF', 0.6),
          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.glass.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
        }),
        input: { padding: '12px 14px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.glass.chip,
          border: `1px solid ${theme.glass.border}`,
          backdropFilter: 'blur(6px)',
        }),
      },
    },
  },
});

const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00A3FF' },
    background: {
      default: '#0D1117',
      paper: alpha('#1A2230', 0.4),
    },
    divider: alpha('#FFFFFF', 0.12),
    text: {
      primary: '#E6EEF9',
      secondary: alpha('#E6EEF9', 0.72),
    },
  },
  typography: light.typography,
  ...commonGlass('dark'),
  components: {
    ...light.components,
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          background: alpha('#0B1220', 0.45),
          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.glass.border },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
        }),
        input: { padding: '12px 14px' },
      },
    },
  },
});

export const lightTheme = light;
export const darkTheme = dark;
