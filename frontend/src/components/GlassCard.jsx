import React from 'react';
import { Box } from '@mui/material';

const GlassBubble = ({ children, typing = false, sx = {}, ...rest }) => {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        display: 'inline-flex',
        maxWidth: 'min(920px, 90vw)',
        padding: typing ? '10px 14px' : '14px 18px',
        gap: 1,
        borderRadius: 18,
        lineHeight: 1.55,
        // Real glass:
        background:
          theme.palette.mode === 'dark'
            ? 'rgba(20, 26, 34, 0.50)'
            : 'rgba(255, 255, 255, 0.60)',
        backdropFilter: 'blur(14px) saturate(120%)',
        WebkitBackdropFilter: 'blur(14px) saturate(120%)',
        border: `1px solid ${
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.16)'
            : 'rgba(0,0,0,0.12)'
        }`,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 12px 36px rgba(0,0,0,0.35)'
            : '0 10px 26px rgba(0,0,0,0.10)',
        color: theme.palette.text.primary,
        // Prevent outside content from “showing through” inside text:
        isolation: 'isolate',
        // Make sure long content wraps nicely
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        ...sx,
      })}
      {...rest}
    >
      {children}
    </Box>
  );
};

export const TypingDots = ({ sx = {} }) => (
  <GlassBubble typing sx={{ alignItems: 'center', ...sx }}>
    <Dot /><Dot delay={120} /><Dot delay={240} />
  </GlassBubble>
);

const Dot = ({ delay = 0 }) => (
  <Box
    sx={{
      width: 6, height: 6, borderRadius: '50%',
      // Visible on any background: solid fill + subtle stroke/glow
      background: 'currentColor',
      boxShadow: '0 0 0 2px rgba(255,255,255,0.85) inset, 0 0 6px rgba(0,0,0,0.25)',
      opacity: 0.9,
      animation: 'llpDot 900ms ease-in-out infinite',
      animationDelay: `${delay}ms`,
      '@keyframes llpDot': {
        '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.6 },
        '40%': { transform: 'translateY(-3px)', opacity: 1 },
      }
    }}
  />
);

export default GlassBubble;
