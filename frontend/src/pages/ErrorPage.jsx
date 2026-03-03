import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import HomeIcon from '@mui/icons-material/Home';

/**
 * ErrorPage
 * Displays full-screen error states (404, 500, 502)
 */
const ErrorPage = ({ code = 404, message, onRetry }) => {

    const getErrorContent = () => {
        switch (code) {
            case 404:
                return {
                    title: "Page Not Found",
                    desc: "The page you are looking for doesn't exist or has been moved.",
                    icon: <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ef4444' }} />
                };
            case 502:
                return {
                    title: "Bad Gateway",
                    desc: "The server received an invalid response from an upstream server.",
                    icon: <CloudOffIcon sx={{ fontSize: 80, color: '#f59e0b' }} />
                };
            case 500:
                return {
                    title: "Server Error",
                    desc: "Something went wrong on our end. Please try again later.",
                    icon: <ErrorOutlineIcon sx={{ fontSize: 80, color: '#ef4444' }} />
                };
            default:
                return {
                    title: "An Error Occurred",
                    desc: message || "Something unexpected happened.",
                    icon: <ErrorOutlineIcon sx={{ fontSize: 80, color: '#64748b' }} />
                };
        }
    };

    const content = getErrorContent();

    return (
        <Box sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 3
        }}>
            <Container maxWidth="sm">
                <Box sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: 'center',
                    animation: 'float 6s ease-in-out infinite'
                }}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                        {content.icon}
                    </div>
                </Box>

                <Typography variant="h1" sx={{
                    fontSize: { xs: '4rem', md: '6rem' },
                    fontWeight: 800,
                    color: 'text.primary',
                    lineHeight: 1,
                    mb: 2,
                    background: 'linear-gradient(135deg, #1e293b 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    '.dark &': {
                        background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                    }
                }}>
                    {code}
                </Typography>

                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: 'text.primary'
                }}>
                    {content.title}
                </Typography>

                <Typography variant="body1" sx={{
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                    mb: 4,
                    maxWidth: '400px',
                    mx: 'auto'
                }}>
                    {content.desc}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<HomeIcon />}
                        href="/"
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 4
                        }}
                    >
                        Go Home
                    </Button>

                    {onRetry && (
                        <Button
                            variant="contained"
                            size="large"
                            onClick={onRetry}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 4,
                                bgcolor: '#2563EB',
                                '&:hover': { bgcolor: '#1D4ED8' }
                            }}
                        >
                            Try Again
                        </Button>
                    )}
                </Box>
            </Container>

            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </Box>
    );
};

export default ErrorPage;
