import React from 'react';
import { Box, Typography } from '@mui/material';

const GreetingHeader = ({ userName, mode, hasMessages = false }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const modeLabels = {
        'chat': 'Chat with LetterLab assistant',
        'pull': 'Summarize and reply to email threads',
        'subject': 'Find the perfect subject lines',
        'compose': 'Draft a professional email'
    };

    return (
        <Box sx={{
            textAlign: 'center',
            pt: { xs: 6, md: 10 },
            pb: 4,
            position: 'relative',
            zIndex: 10,
            maxWidth: '800px',
            mx: 'auto',
            display: hasMessages ? { xs: 'none', md: 'block' } : 'block' // ✅ Hide on mobile if interaction started
        }}>
            <Typography variant="h3" sx={{
                fontWeight: 800,
                color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#1a1a1a',
                mb: 1.5,
                fontSize: { xs: '2.2rem', md: '3rem' },
                letterSpacing: '-0.02em'
            }}>
                {getGreeting()}, {userName || 'there'}
            </Typography>
            <Typography variant="h6" sx={{
                color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                fontWeight: 500,
                fontSize: { xs: '1rem', md: '1.25rem' }
            }}>
                {modeLabels[mode] || "What's on your mind today?"}
            </Typography>
        </Box>
    );
};

export default GreetingHeader;
