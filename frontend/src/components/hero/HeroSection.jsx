import React from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Stack,
    Grid,
    Divider,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import OutlookIcon from '../../assets/Microsoft-outlook-icon.svg.png';

/**
 * SplitRevealHero.jsx
 * - Preserves original Left Side content/style
 * - Implements new Minimal Square Comparison Card (Right Side)
 * - Uses 'Outfit' / 'Inter' fonts via TOKENS
 */

const TOKENS = {
    blue: "#2641F5",
    blueHover: "#1a30d4",
    blueLight: "#EEF0FE",
    blueMid: "#C7CDFB",
    blueGlow: "rgba(38, 65, 245, 0.45)",
    ink: "#0D0F1A",
    inkSoft: "#4A4E6B",
    inkMuted: "#8B90AB",
    surface: "#FFFFFF",
    bg: "#F3F5FC",
    border: "#E2E5F0",
    green: "#16A34A",
    greenLight: "#DCFCE7",
    red: "#DC2626",
    redLight: "#FEF2F2",
    shadowCard: "0 24px 64px rgba(38,65,245,.12), 0 4px 16px rgba(13,15,26,.08)",
    shadowMD: "0 8px 32px rgba(13,15,26,.10)",
};

function GmailMini() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

function OutlookMini() {
    return (
        <img src={OutlookIcon} alt="Outlook" width="15" height="15" style={{ display: 'block' }} />
    );
}

function IconArrowRight() {
    return (
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function IconPlay() {
    return (
        <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
            <path d="M4 2.5l6 3.5-6 3.5V2.5z" fill={TOKENS.blue} />
        </svg>
    );
}

function IconStarGreen() {
    return (
        <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <path d="M8 2L10 7H15L11 10L12.5 15L8 12L3.5 15L5 10L1 7H6L8 2Z" fill={TOKENS.green} />
        </svg>
    );
}

function MinimalComparisonCard() {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                border: `1px solid ${TOKENS.border}`,
                boxShadow: TOKENS.shadowCard,
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 480,
                width: '100%',
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {/* Left: Raw Thread */}
                <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, borderRight: `1px solid ${TOKENS.border}`, display: 'flex', flexDirection: 'column', gap: 2.5, justifyContent: 'center' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 800,
                            color: TOKENS.inkMuted,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontSize: '0.7rem',
                            mb: 0.5
                        }}
                    >
                        RAW THREAD
                    </Typography>

                    <Stack spacing={2.5}>
                        {[
                            "Long multi-email chain",
                            "Unclear priorities",
                            "Hidden action items"
                        ].map((text, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <CancelRoundedIcon
                                    sx={{
                                        fontSize: 20,
                                        color: TOKENS.inkMuted,
                                        opacity: 0.6,
                                        mt: 0.1
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: TOKENS.inkSoft,
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        lineHeight: 1.4,
                                        textAlign: 'left'
                                    }}
                                >
                                    {text}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                {/* Right: AI Draft */}
                <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5, justifyContent: 'center' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 800,
                            color: TOKENS.blue,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontSize: '0.7rem',
                            mb: 0.5
                        }}
                    >
                        LETTERLAB
                    </Typography>

                    <Stack spacing={2.5}>
                        {[
                            "3 key decisions extracted",
                            "Clear next steps",
                            "Tone-matched reply ready"
                        ].map((text, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                <CheckCircleRoundedIcon
                                    sx={{
                                        fontSize: 20,
                                        color: TOKENS.blue,
                                        mt: 0.1
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: TOKENS.ink,
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        lineHeight: 1.4,
                                        textAlign: 'left'
                                    }}
                                >
                                    {text}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
}

export default function SplitRevealHero({
    onGoToChat,
    onExplore,
}) {
    const theme = useTheme();

    return (
        <Box sx={{ background: TOKENS.bg, minHeight: { xs: "100dvh", md: "100vh" }, overflowX: "hidden", pt: { xs: 12, md: 15 }, pb: { xs: 8, md: 12 } }}>

            <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
                <Box
                    sx={{
                        position: "relative",
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, // Equal columns as requested
                        gap: { xs: 6, md: 10 },
                        alignItems: "center",
                    }}
                >
                    {/* LEFT SIDE - PRESERVED EXACTLY */}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {/* H1 */}
                        <Typography
                            sx={{
                                fontFamily: '"Outfit", "Inter", sans-serif',
                                fontSize: { xs: 34, md: "clamp(38px, 4.2vw, 58px)" },
                                fontWeight: 900,
                                lineHeight: 1.06,
                                letterSpacing: "-.03em",
                                color: TOKENS.ink,
                                mb: 2.7,
                                animation: "llFadeUp .5s .08s ease both",
                            }}
                        >
                            Email replies
                            <br />
                            that feel{" "}
                            <Box
                                component="em"
                                sx={{
                                    fontStyle: "normal",
                                    color: TOKENS.blue,
                                    position: "relative",
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: 2,
                                        left: 0,
                                        right: 0,
                                        height: 3,
                                        borderRadius: 2,
                                        background: `linear-gradient(90deg, ${TOKENS.blue}, rgba(38,65,245,.3))`,
                                    },
                                }}
                            >
                                effortless.
                            </Box>
                        </Typography>

                        {/* Sub */}
                        <Typography
                            sx={{
                                fontSize: 16.5,
                                lineHeight: 1.68,
                                color: TOKENS.inkSoft,
                                maxWidth: 420,
                                mb: 5,
                                animation: "llFadeUp .5s .16s ease both",
                            }}
                        >
                            LetterLab pulls the right context from your threads, summarizes what matters, and drafts a reply
                            that sounds exactly like you — so you spend more time deciding, not typing.
                        </Typography>

                        {/* Actions */}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            sx={{ mb: 6.5, animation: "llFadeUp .5s .24s ease both" }}
                        >
                            <Button
                                onClick={onGoToChat}
                                variant="contained"
                                disableElevation
                                endIcon={<IconArrowRight />}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 15,
                                    fontWeight: 900,
                                    background: TOKENS.blue,
                                    borderRadius: "13px",
                                    px: 3.4,
                                    py: 1.7,
                                    boxShadow: "0 4px 20px rgba(38,65,245,.38)",
                                    "&:hover": {
                                        background: TOKENS.blueHover,
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 8px 28px rgba(38,65,245,.48)",
                                    },
                                    transition: "background .15s, transform .12s, box-shadow .15s",
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                Go to Chat
                            </Button>

                            <Button
                                onClick={onExplore}
                                variant="outlined"
                                sx={{
                                    textTransform: "none",
                                    fontSize: 15,
                                    fontWeight: 800,
                                    color: TOKENS.inkSoft,
                                    borderColor: TOKENS.border,
                                    borderWidth: "1.5px",
                                    background: "#fff",
                                    borderRadius: "13px",
                                    px: 2.6,
                                    py: 1.6,
                                    "&:hover": {
                                        borderColor: TOKENS.blueMid,
                                        color: TOKENS.blue,
                                        transform: "translateY(-1px)",
                                        background: "#fff",
                                    },
                                    transition: "border-color .15s, color .15s, transform .12s",
                                    width: { xs: "100%", sm: "auto" },
                                    justifyContent: "center",
                                }}
                            >
                                See How LetterLab Works &rarr;
                            </Button>
                        </Stack>

                        {/* Trust bar */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                gap: { xs: 2.2, sm: 2.2 },
                                flexWrap: "wrap",
                                animation: "llFadeUp .5s .32s ease both",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.9 }}>
                                <IconStarGreen />
                                <Typography
                                    sx={{
                                        fontSize: 12.5,
                                        fontWeight: 700,
                                        color: TOKENS.inkMuted,
                                    }}
                                >
                                    OAuth2 secured
                                </Typography>
                            </Box>



                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
                                <Typography
                                    sx={{
                                        fontSize: 12.5,
                                        fontWeight: 700,
                                        color: TOKENS.inkMuted,
                                        mr: 0.5,
                                    }}
                                >
                                    Works with
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                        background: "#fff",
                                        border: `1px solid ${TOKENS.border}`,
                                        borderRadius: "7px",
                                        px: 1.3,
                                        py: 0.7,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: TOKENS.inkSoft,
                                    }}
                                >
                                    <GmailMini /> Gmail
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                        background: "#fff",
                                        border: `1px solid ${TOKENS.border}`,
                                        borderRadius: "7px",
                                        px: 1.3,
                                        py: 0.7,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: TOKENS.inkSoft,
                                    }}
                                >
                                    <OutlookMini /> Outlook
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* RIGHT SIDE - NEW MINIMAL CARD */}
                    <Box
                        sx={{
                            position: "relative",
                            animation: "llFadeUp .5s .1s ease both",
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {/* Background Glow - Simplified/Optional but nice to keep a little depth */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "80%",
                                height: "60%",
                                background: "radial-gradient(ellipse, rgba(38,65,245,.10) 0%, transparent 70%)",
                                filter: "blur(40px)",
                                pointerEvents: "none",
                                zIndex: 0,
                            }}
                        />

                        <MinimalComparisonCard />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

