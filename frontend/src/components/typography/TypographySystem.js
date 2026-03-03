/**
 * Usage: wrap your app in MUI ThemeProvider using tokens below if desired,
 * and use Tailwind classes for runtime. Fonts: Outfit, Inter, Manrope, DM Sans.
 * Make sure they’re imported once in index.css or via <link> from Google Fonts.
 */
export const fontStack = {
  brand: "'Outfit', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  ui: "'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  action: "'Manrope', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  quote: "'DM Sans', 'Inter', ui-sans-serif, system-ui",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New'",
};

export const typeScale = {
  h1: "clamp(2.25rem, 5vw, 4.25rem)",
  h2: "clamp(1.75rem, 3.5vw, 3rem)",
  h3: "clamp(1.35rem, 2.2vw, 2rem)",
  body: "clamp(1rem, 1.2vw, 1.125rem)",
  small: "0.925rem",
};

export const typeColors = {
  dark: {
    primary: "#111827",  // Gunmetal
    secondary: "#1F2937", // Gray-800
    body: "#334155",      // Slate-700
    muted: "#64748B",     // Slate-500
    accent: "#0EA5E9",    // Sky-500
    success: "#10B981",   // Emerald-500
  },
  light: {
    primary: "#F3F4F6",
    secondary: "#E5E7EB",
    body: "#CBD5E1",
    muted: "#94A3B8",
    accent: "#38BDF8",
    success: "#34D399",
  },
};
