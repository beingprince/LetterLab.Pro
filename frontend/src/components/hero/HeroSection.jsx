import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Stack,
    Grid,
    Divider,
    Avatar,
    AvatarGroup,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import OutlookIcon from '../../assets/Microsoft-outlook-icon.svg.png';
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

/**
 * SplitRevealHero.jsx
 * - Implements AI feedback: Copy updates, Staggered Animations, Social Proof
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

const MotionButton = motion(Button);

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
    const shouldReduce = useReducedMotion();

    // Framer Motion Variants
    const dimVariants = shouldReduce ? {} : {
        hidden: { opacity: 1 },
        visible: { opacity: 0.4, transition: { delay: 1.0, duration: 0.8 } }
    };

    const scanVariants = shouldReduce ? { hidden: { display: 'none' } } : {
        hidden: { top: "-10%", opacity: 0 },
        visible: {
            top: "110%",
            opacity: [0, 1, 1, 0],
            transition: { delay: 1.2, duration: 1.2, ease: "linear" }
        }
    };

    const listVariants = shouldReduce ? {} : {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
                delayChildren: 2.0
            }
        }
    };

    const checkItemVariants = shouldReduce ? {} : {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200 }
        }
    };

    return (
        <Paper
            component={motion.div}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            elevation={0}
            sx={{
                borderRadius: '20px',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                border: `1px solid rgba(255, 255, 255, 0.4)`,
                boxShadow: TOKENS.shadowCard,
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 540, // Expanded 10-15%
                width: '100%',
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Scanning Light Effect */}
            <Box
                component={motion.div}
                variants={scanVariants}
                sx={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: TOKENS.blue,
                    boxShadow: `0 0 16px 4px ${TOKENS.blueGlow}`,
                    zIndex: 10,
                }}
            />

            <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100%' }}>
                {/* Left: Raw Thread */}
                <Box
                    component={motion.div}
                    variants={dimVariants}
                    sx={{ flex: 1, p: { xs: 2, md: 4 }, borderRight: `1px solid ${TOKENS.border}`, display: 'flex', flexDirection: 'column', gap: 2.5, justifyContent: 'center' }}
                >
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

                    <Stack component={motion.div} variants={listVariants} spacing={2.5}>
                        {[
                            "3 key decisions extracted",
                            "Clear next steps",
                            "Tone-matched reply ready"
                        ].map((text, i) => (
                            <Box key={i} component={motion.div} variants={checkItemVariants} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
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
    const shouldReduce = useReducedMotion();

    const { isAuthenticated } = useAuth();
    const [userStats, setUserStats] = useState({ count: 12, initials: ['A', 'P', 'J', 'S'] });

    // ✅ Track if user is already "in" the app flow
    const isReturning = isAuthenticated() || !!localStorage.getItem('letterlab_user') || localStorage.getItem('llp_chat_active') === 'true';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Adjust URL based on your backend environment if needed, but relative should work in Vite proxy
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/stats`);
                const data = await res.json();
                if (data.success) {
                    // Fallback to minimal sensible defaults if DB is too small or fresh
                    setUserStats({
                        count: Math.max(data.count, 12),
                        initials: data.initials?.length > 0 ? data.initials : ['A', 'P', 'J', 'S']
                    });
                }
            } catch (err) {
                console.error("Failed to fetch user stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <section className="w-full py-24 md:py-32 relative min-h-[100dvh] md:min-h-screen overflow-x-hidden flex items-center" style={{ backgroundColor: TOKENS.bg }}>

            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* LEFT SIDE - PRESERVED EXACTLY */}
                    <div className="md:col-span-6 lg:col-span-6 flex flex-col">
                        {/* H1 */}
                        <Typography
                            sx={{
                                fontFamily: '"Outfit", "Inter", sans-serif',
                                fontSize: { xs: 34, md: "clamp(38px, 4.2vw, 58px)" },
                                fontWeight: 900,
                                lineHeight: 1.06,
                                letterSpacing: "-.05em",
                                color: TOKENS.ink,
                                mb: 2.7,
                                animation: shouldReduce ? "none" : "llFadeUp .5s .08s ease both",
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
                                animation: shouldReduce ? "none" : "llFadeUp .5s .16s ease both",
                            }}
                        >
                            LetterLab reads your thread, extracts what matters, and drafts a reply that sounds like you — so you spend more time deciding, not typing.
                        </Typography>

                        {/* Actions */}
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            sx={{ mb: 4.5, animation: shouldReduce ? "none" : "llFadeUp .5s .24s ease both" }}
                        >
                            <MotionButton
                                onClick={onGoToChat}
                                variant="contained"
                                disableElevation
                                endIcon={<IconArrowRight />}
                                {...(!shouldReduce && {
                                    whileHover: { y: -2, boxShadow: "0 8px 28px rgba(38,65,245,.48)" },
                                    whileTap: { scale: 0.97 }
                                })}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 15,
                                    fontWeight: 900,
                                    background: TOKENS.blue,
                                    borderRadius: "13px",
                                    px: 3.4,
                                    py: 1.7,
                                    boxShadow: "0 4px 20px rgba(38,65,245,.38)",
                                    transition: "background .15s",
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                {isReturning ? "Compose New Email" : "Draft My First Email"}
                            </MotionButton>

                            <MotionButton
                                onClick={onExplore}
                                variant="text"
                                disableRipple
                                {...(!shouldReduce && {
                                    whileHover: { scale: 1.03 },
                                    whileTap: { scale: 0.97 }
                                })}
                                endIcon={<span style={{ marginLeft: 4 }}>&rarr;</span>}
                                sx={{
                                    textTransform: "none",
                                    fontSize: 15,
                                    fontWeight: 700,
                                    color: TOKENS.inkSoft,
                                    py: 1.6,
                                    "&:hover": {
                                        color: TOKENS.blue,
                                        background: "transparent",
                                    },
                                    transition: "color .15s",
                                    width: { xs: "100%", sm: "auto" },
                                    justifyContent: "flex-start",
                                }}
                            >
                                See How LetterLab Works
                            </MotionButton>
                        </Stack>
                        
                        {/* Social Proof Stack */}
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2, 
                                mb: 6,
                                animation: shouldReduce ? "none" : "llFadeUp .5s .28s ease both" 
                            }}
                        >
                            <AvatarGroup 
                                max={4} 
                                sx={{ 
                                    '& .MuiAvatar-root': { 
                                        width: 32, 
                                        height: 32, 
                                        fontSize: 12,
                                        fontWeight: 600,
                                        border: `2px solid ${TOKENS.bg}`,
                                        bgcolor: TOKENS.blueMid,
                                        color: TOKENS.blue,
                                    } 
                                }}
                            >
                                {userStats.initials.map((init, idx) => (
                                    <Avatar key={idx}>{init}</Avatar>
                                ))}
                            </AvatarGroup>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: TOKENS.inkSoft }}>
                                Join {userStats.count}+ early adopters
                            </Typography>
                        </Box>

                        {/* Trust bar */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                gap: { xs: 2.2, sm: 2.2 },
                                flexWrap: "wrap",
                                animation: shouldReduce ? "none" : "llFadeUp .5s .32s ease both",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.9 }}>
                                <IconStarGreen />
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 12.5,
                                            fontWeight: 700,
                                            color: TOKENS.inkMuted,
                                        }}
                                    >
                                        OAuth2 secured
                                    </Typography>
                                    <Typography sx={{ fontSize: 11, color: TOKENS.inkMuted }}>
                                        We never store your emails
                                    </Typography>
                                </Box>
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
                                        background: "transparent",
                                        px: 1.0,
                                        py: 0.7,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: TOKENS.inkSoft,
                                        filter: "grayscale(100%)",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            filter: "grayscale(0%)",
                                            transform: "translateY(-1px)",
                                        }
                                    }}
                                >
                                    <GmailMini /> Gmail
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.8,
                                        background: "transparent",
                                        px: 1.0,
                                        py: 0.7,
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: TOKENS.inkSoft,
                                        filter: "grayscale(100%)",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            filter: "grayscale(0%)",
                                            transform: "translateY(-1px)",
                                        }
                                    }}
                                >
                                    <OutlookMini /> Outlook
                                </Box>
                            </Box>
                        </Box>
                    </div>

                    {/* RIGHT SIDE - NEW MINIMAL CARD */}
                    <div
                        className="md:col-span-6 lg:col-span-6 relative w-full flex justify-center"
                        style={{
                            animation: shouldReduce ? "none" : "llFadeUp .5s .1s ease both",
                        }}
                    >
                        {/* Background Glow - Static radial glow (4-6% opacity) */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "80%",
                                height: "60%",
                                background: "radial-gradient(ellipse, rgba(38,65,245,.06) 0%, transparent 70%)",
                                filter: "blur(40px)",
                                pointerEvents: "none",
                                zIndex: 0,
                            }}
                        />

                        <MinimalComparisonCard />
                    </div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <Box 
                sx={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    opacity: 0,
                    animation: shouldReduce ? "none" : "llFadeIn 1s 1.5s forwards",
                    color: TOKENS.inkMuted,
                }}
            >
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>See how LetterLab works</Typography>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    &darr;
                </motion.div>
            </Box>
            
            {/* Global Keyframes for initial load */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes llFadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes llFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}} />
        </section>
    );
}
