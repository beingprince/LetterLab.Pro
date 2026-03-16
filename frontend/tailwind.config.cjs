/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // Only activate dark: classes when .dark is on <html> — never added, so dark mode is fully off
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "hsl(var(--brand))",
          text: "var(--brand-text)",
          dim: "var(--brand-dim)",
          card: "var(--brand-card)",
          iconBg: "var(--brand-icon-bg)",
          border: "var(--brand-border)",
          bg: "var(--brand-bg)",
        },
      },
      // Industry-grade spacing tokens (8pt grid system)
      spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '24px',
        6: '32px',
        7: '40px',
        8: '48px',
        9: '64px',
      },
      // Elevation and focus shadow tokens
      boxShadow: {
        glass: '0 10px 40px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(255,255,255,0.10)',
        elev1: 'var(--elev-1)',
        elev2: 'var(--elev-2)',
        focus: 'var(--elev-focus)',
      },
      // Border radius tokens
      borderRadius: {
        glass: '1.25rem',
        md: '12px',
        lg: '16px',
        pill: '9999px',
      },
      backdropBlur: {
        30: '30px',
      },
      // --- HERE ARE THE MISSING ANIMATION BLOCKS ---
      keyframes: {
        'bg-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        'bg-pan': 'bg-pan 4s ease-in-out infinite',
      },
      backgroundSize: {
        '200%': '200% 200%',
      }
      // --- END OF MISSING BLOCKS ---
    },
  },
  plugins: [],
};