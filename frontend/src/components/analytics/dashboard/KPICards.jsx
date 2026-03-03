import React from 'react';
import { Box, Typography, Paper, useTheme, alpha, Tooltip, Grid } from '@mui/material';
import { Token, Email, Forum, Bolt, InfoOutlined } from '@mui/icons-material';

const MetricTooltip = ({ title, definition, calculation, limitations }) => (
    <Box sx={{ p: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>{title}</Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, opacity: 0.9 }}>{definition}</Typography>
        <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', opacity: 0.8 }}>
            <strong>How it's calculated:</strong> {calculation}
        </Typography>
        {limitations && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'warning.light' }}>
                <strong>Note:</strong> {limitations}
            </Typography>
        )}
    </Box>
);

const KPICards = ({ billing, totals }) => {
    const percentUsed = billing ? (billing.tokensUsed / billing.tokenLimit) * 100 : 0;
    const theme = useTheme();

    const metrics = [
        {
            title: "Quota Remaining",
            value: billing?.tokensRemaining || 0,
            subtitle: `of ${billing?.tokenLimit || 50} this cycle`,
            icon: Bolt,
            color: theme.palette.primary.main,
            tooltip: {
                definition: "How many tokens you can still use before the limit resets.",
                calculation: "Limit minus tokens used in this session.",
                limitations: "Local session estimate."
            }
        },
        {
            title: "Tokens Used",
            value: billing?.tokensUsed || 0,
            subtitle: `${Math.round(percentUsed)}% of quota`,
            icon: Token,
            color: percentUsed > 90 ? theme.palette.error.main : theme.palette.warning.main,
            warning: percentUsed > 70,
            tooltip: {
                definition: "How much AI usage you’ve consumed.",
                calculation: "Estimated tokens spent on drafts and summaries.",
                limitations: "Local session estimate."
            }
        },
        {
            title: "Emails Generated",
            value: (totals?.repliesGenerated || 0) + (totals?.subjectsCreated || 0),
            subtitle: "Total drafts created",
            icon: Email,
            color: theme.palette.success.main,
            tooltip: {
                definition: "Total drafts you created in LetterLab.",
                calculation: "Counts each time you generate a draft.",
                limitations: "Local session data."
            }
        },
        {
            title: "Threads Processed",
            value: totals?.threadsRead || 0,
            subtitle: "Email threads analyzed",
            icon: Forum,
            color: theme.palette.info.main,
            tooltip: {
                definition: "Email threads you analyzed with Pull Email.",
                calculation: "Counts threads successfully read and summarized.",
                limitations: "Local session data."
            }
        },
    ];

    return (
        <Grid container spacing={{ xs: 1.5, md: 2 }}> {/* 12px -> 16px gap */}
            {metrics.map((item, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}> {/* 4 columns on desktop */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 2.5 }, // 16px -> 20px padding
                            height: '140px', // Fixed height
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {item.title}
                                    </Typography>
                                    <Tooltip
                                        title={<MetricTooltip title={item.title} {...item.tooltip} />}
                                        arrow
                                        placement="top"
                                    >
                                        <InfoOutlined sx={{
                                            fontSize: 14,
                                            color: 'text.disabled',
                                            cursor: 'help',
                                            opacity: 0.6,
                                            '&:hover': { opacity: 1 }
                                        }} />
                                    </Tooltip>
                                </Stack>
                                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                                    {item.value}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: '8px',
                                    bgcolor: alpha(item.color || theme.palette.primary.main, 0.08),
                                    color: item.color || theme.palette.primary.main,
                                    display: 'flex'
                                }}
                            >
                                <item.icon sx={{ fontSize: 20 }} />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: item.warning ? 'warning.main' : 'text.secondary', opacity: 0.8 }}>
                                {item.subtitle}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

// Internal Import helper
function Stack({ children, direction, spacing, sx, alignItems }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: direction === 'row' ? 'row' : 'column', gap: spacing, alignItems, ...sx }}>
            {children}
        </Box>
    );
}

export default KPICards;
