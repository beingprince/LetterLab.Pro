// frontend/src/components/analytics/TokenDisplay.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Bolt as BoltIcon } from '@mui/icons-material';

const TokenDisplay = ({ tokensRemaining = 0, tokensTotal = 50, resetIn = '24h 0m 0s', plan = 'free' }) => {
    const percentage = (tokensRemaining / tokensTotal) * 100;
    const isLow = tokensRemaining < 10;

    // Animated token count
    const animatedTokens = useSpring(0, {
        damping: 20,
        stiffness: 150,
    });

    useEffect(() => {
        animatedTokens.set(tokensRemaining);
    }, [tokensRemaining, animatedTokens]);

    const roundedTokens = useTransform(animatedTokens, (val) => Math.round(val));

    // Parse resetIn to get countdown
    const [countdown, setCountdown] = useState(resetIn);

    useEffect(() => {
        setCountdown(resetIn);
    }, [resetIn]);

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                position: 'relative',
                height: '100%',
                minHeight: 280,
                borderRadius: 4,
                overflow: 'hidden',
                backdropFilter: 'blur(18px)',
                background: (theme) =>
                    theme.palette.mode === 'dark'
                        ? 'rgba(15, 23, 42, 0.55)'
                        : 'rgba(255, 255, 255, 0.72)',
                border: (theme) =>
                    `1px solid ${theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.10)'
                        : 'rgba(15,23,42,0.08)'
                    }`,
                boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                        ? '0 10px 40px rgba(15,23,42,0.75)'
                        : '0 10px 35px rgba(15,23,42,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
            }}
        >
            {/* Gradient overlay for low tokens */}
            {isLow && (
                <Box
                    component={motion.div}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(168,85,247,0.1) 100%)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Icon */}
            <Box
                sx={{
                    mb: 2,
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 40%, #A855F7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 24px rgba(37,99,235,0.4)',
                }}
            >
                <BoltIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 3,
                    background: 'linear-gradient(90deg, #2563EB 0%, #A855F7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Tokens Remaining
            </Typography>

            {/* Circular Progress */}
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                {/* Background circle */}
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={160}
                    thickness={4}
                    sx={{
                        color: (theme) =>
                            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)',
                    }}
                />
                {/* Progress circle */}
                <CircularProgress
                    variant="determinate"
                    value={percentage}
                    size={160}
                    thickness={4}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        background: 'linear-gradient(135deg, #2563EB 0%, #A855F7 100%)',
                        borderRadius: '50%',
                        '.MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                            stroke: isLow
                                ? 'url(#lowTokenGradient)'
                                : 'url(#tokenGradient)',
                            transition: 'stroke-dashoffset 0.5s ease-out',
                        },
                    }}
                />
                {/* SVG Gradients */}
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563EB" />
                            <stop offset="50%" stopColor="#0EA5E9" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                        <linearGradient id="lowTokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#EF4444" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Animated number */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        component={motion.span}
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            background: isLow
                                ? 'linear-gradient(90deg, #EF4444 0%, #A855F7 100%)'
                                : 'linear-gradient(90deg, #2563EB 0%, #A855F7 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {roundedTokens}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5 }}>
                        of {tokensTotal}
                    </Typography>
                </Box>
            </Box>

            {/* Reset countdown */}
            <Box
                sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: (theme) =>
                        theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(15,23,42,0.03)',
                }}
            >
                <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mb: 0.5 }}>
                    Resets in
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: (theme) => theme.palette.primary.main,
                    }}
                >
                    {countdown}
                </Typography>
            </Box>

            {/* Plan badge */}
            {plan === 'pro' && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        px: 2,
                        py: 0.5,
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #2563EB 0%, #A855F7 100%)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                    }}
                >
                    Pro
                </Box>
            )}
        </Box>
    );
};

export default TokenDisplay;
