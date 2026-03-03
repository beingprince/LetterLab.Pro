// frontend/src/components/analytics/UsageChart.jsx
import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const UsageChart = ({ data = [] }) => {
    // Ensure we have 7 days of data
    const chartData = [...data];
    while (chartData.length < 7) {
        chartData.push({ date: new Date(), tokensUsed: 0 });
    }

    const maxUsage = Math.max(...chartData.map((d) => d.tokensUsed || 0), 1);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const barVariants = {
        hidden: { height: '0%', opacity: 0 },
        visible: (height) => ({
            height: `${height}%`,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 15 },
        }),
    };

    const getDayLabel = (date) => {
        const d = new Date(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()];
    };

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
                height: '100%',
                minHeight: 320,
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
                p: 4,
            }}
        >
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
                7-Day Usage History
            </Typography>

            <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    height: 200,
                    borderBottom: (theme) =>
                        `2px solid ${theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(15,23,42,0.1)'
                        }`,
                }}
            >
                {chartData.map((day, index) => {
                    const barHeight = (day.tokensUsed / maxUsage) * 100 || 5;
                    const isToday = index === chartData.length - 1;

                    return (
                        <Tooltip
                            key={index}
                            title={
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                                        {getDayLabel(day.date)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                                        {day.tokensUsed || 0} tokens
                                    </Typography>
                                    {day.emailsGenerated > 0 && (
                                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                                            {day.emailsGenerated} emails
                                        </Typography>
                                    )}
                                </Box>
                            }
                            arrow
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '12%',
                                    cursor: 'pointer',
                                }}
                            >
                                <Box
                                    component={motion.div}
                                    custom={barHeight}
                                    variants={barVariants}
                                    whileHover={{ scale: 1.05 }}
                                    sx={{
                                        width: '100%',
                                        borderTopLeftRadius: 8,
                                        borderTopRightRadius: 8,
                                        background: isToday
                                            ? 'linear-gradient(180deg, #2563EB 0%, #A855F7 100%)'
                                            : (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? 'linear-gradient(180deg, rgba(37,99,235,0.6) 0%, rgba(168,85,247,0.6) 100%)'
                                                    : 'linear-gradient(180deg, rgba(37,99,235,0.4) 0%, rgba(168,85,247,0.4) 100%)',
                                        boxShadow: isToday
                                            ? '0 4px 16px rgba(37,99,235,0.4)'
                                            : 'none',
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 1.5,
                                        fontWeight: isToday ? 700 : 500,
                                        opacity: isToday ? 1 : 0.7,
                                        fontSize: 11,
                                    }}
                                >
                                    {getDayLabel(day.date)}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>

            {/* Legend */}
            <Box
                sx={{
                    mt: 3,
                    display: 'flex',
                    gap: 3,
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: 1,
                            background: 'linear-gradient(135deg, #2563EB 0%, #A855F7 100%)',
                        }}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Today
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: 1,
                            background: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? 'rgba(37,99,235,0.6)'
                                    : 'rgba(37,99,235,0.4)',
                        }}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Previous Days
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default UsageChart;
