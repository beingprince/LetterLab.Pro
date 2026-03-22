import React from 'react';
import { Box, Typography, Button, Container, Paper, useTheme, alpha } from '@mui/material';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const BillingPage = ({ navigate }) => {
    const theme = useTheme();

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
                    Billing & Plans
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Manage your subscription and view your current usage limits.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Subtle Background Decoration */}
                <Box sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    background: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    zIndex: 0
                }} />

                <Box sx={{ zIndex: 1, textAlign: 'center' }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 0.75,
                            borderRadius: '999px',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            mb: 3
                        }}
                    >
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'currentColor' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Free Plan
                        </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                        You're currently on the Free Tier
                    </Typography>

                    <Box sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                            LetterLab.Pro is currently a <strong>student project</strong> developed to streamline professional communication. 
                            As part of our early-stage development, access is currently free to help us refine the experience.
                        </Typography>
                        <Box sx={{ 
                            mt: 3, 
                            p: 2.5, 
                            borderRadius: '12px', 
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-start',
                            textAlign: 'left',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.info.main, 0.1)
                        }}>
                            <InfoOutlinedIcon sx={{ color: theme.palette.info.main, mt: 0.3 }} fontSize="small" />
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.info.main, mb: 0.5 }}>
                                    Usage & Limits
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, display: 'block' }}>
                                    This plan is <strong>not unlimited</strong>. We apply monthly usage limits to ensure stability. 
                                    To see your current consumption and exact limits, please visit your analytics dashboard.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AnalyticsOutlinedIcon />}
                            onClick={() => navigate('/analytics')}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.2)',
                            }}
                        >
                            View Usage Analytics
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            disabled
                            startIcon={<ReceiptLongOutlinedIcon />}
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: '12px',
                            }}
                        >
                            Billing History
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    Questions about your plan? <Button variant="text" size="small" sx={{ textTransform: 'none', fontWeight: 600 }} onClick={() => navigate('/contact')}>Contact Support</Button>
                </Typography>
            </Box>
        </Container>
    );
};

export default BillingPage;
