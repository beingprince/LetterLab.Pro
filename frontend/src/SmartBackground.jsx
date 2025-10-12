import React from 'react';
import { Box, keyframes, useTheme } from '@mui/material';

// The ONE-TIME "boot-up" animation.
// It fades in, holds briefly, and then fades out permanently.
const gridReveal = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`;

export const SmartBackground = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  // A 20x20 grid for a dense, high-tech look
  const items = Array.from({ length: 400 });

  return (
    <Box sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100vmin', // Creates a responsive square grid
      height: '100vmin',
      display: 'grid',
      gridTemplateColumns: 'repeat(20, 1fr)',
      gridTemplateRows: 'repeat(20, 1fr)',
      zIndex: -1,
      overflow: 'hidden',
    }}>
      {items.map((_, i) => {
        // Stagger the delay to create a cascading "reveal" effect
        const delay = (Math.random() * 0.8).toFixed(2);
        const color = mode === 'dark' ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.25)';

        return (
          <Box
            key={i}
            sx={{
              width: '100%',
              height: '100%',
              border: `1px solid ${color}`,
              opacity: 0, // Start invisible
              // The 'forwards' keyword is critical: it holds the final state (opacity: 0).
              // The animation plays ONCE and then stops, leaving the background clean.
              animation: `${gridReveal} 1.6s ${delay}s ease-out forwards`,
            }}
          />
        );
      })}
    </Box>
  );
};