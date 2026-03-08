import React from 'react';
import { Box, Typography, CircularProgress, keyframes } from '@mui/material';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const WakingUpLoader = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999,
                textAlign: 'center',
                p: 3
            }}
        >
            <Box
                sx={{
                    animation: `${pulse} 2s infinite ease-in-out`,
                    mb: 4
                }}
            >
                <img
                    src="/brand/letterlab-logo.svg"
                    alt="LetterLab.Pro"
                    style={{ height: 60, width: 'auto' }}
                />
            </Box>

            <CircularProgress size={40} thickness={4} sx={{ mb: 3 }} />

            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
                Waking up our servers
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                This usually takes about 30 seconds on our free tier.
                We'll redirect you automatically as soon as we're ready.
            </Typography>
        </Box>
    );
};

export default WakingUpLoader;
