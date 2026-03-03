// frontend/src/components/analytics/StatsCard.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
    const colorMap = {
        primary: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
        purple: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
        green: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        orange: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            sx={{
                height: '100%',
                minHeight: 140,
                borderRadius: 3,
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
                        ? '0 8px 32px rgba(15,23,42,0.5)'
                        : '0 8px 24px rgba(15,23,42,0.06)',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                            ? '0 12px 40px rgba(15,23,42,0.7)'
                            : '0 12px 32px rgba(15,23,42,0.1)',
                },
                transition: 'all 0.3s ease',
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    background: colorMap[color] || colorMap.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    boxShadow: `0 4px 16px ${color === 'primary' ? 'rgba(37,99,235,0.3)' : 'rgba(168,85,247,0.3)'}`,
                }}
            >
                {Icon && <Icon sx={{ fontSize: 24, color: '#fff' }} />}
            </Box>

            {/* Content */}
            <Box>
                <Typography
                    variant="caption"
                    sx={{
                        opacity: 0.7,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontWeight: 600,
                        fontSize: 11,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        mt: 0.5,
                        background: colorMap[color] || colorMap.primary,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {value}
                </Typography>
                {trend && (
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 1,
                            display: 'block',
                            color: trend > 0 ? '#10B981' : '#EF4444',
                            fontWeight: 600,
                        }}
                    >
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default StatsCard;
