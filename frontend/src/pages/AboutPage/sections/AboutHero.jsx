
import React from 'react';
import { Box, Container, Typography, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 16 }, // 16px (2 units)
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

export default function AboutHero() {
    return (
        <Box
            component="section"
            className="relative text-center overflow-hidden"
            sx={{
                py: { xs: 10, md: 15 }, // 80px / 120px strict vertical padding
            }}
        >
            {/* Background decoration - Engineered Radial Gradient */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] dark:bg-blue-500/10" />
            </div>

            <Container maxWidth="lg" className="relative z-10 px-6 md:px-8">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col items-center">

                    <motion.div variants={fadeInUp} className="mb-6"> {/* 24px */}
                        <Chip
                            label="Built Independently • Developed as a Technical Engineering Project"
                            variant="outlined"
                            sx={{
                                borderColor: 'rgba(59, 130, 246, 0.2)',
                                background: 'rgba(59, 130, 246, 0.05)',
                                color: '#3b82f6',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                letterSpacing: '0.05em',
                                px: 1,
                                height: 32, // Fixed height for rhythm
                            }}
                        />
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-6"> {/* 24px */}
                        <Typography
                            variant="h1"
                            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
                            sx={{
                                lineHeight: 1.1, // Tightened line-height
                                background: 'linear-gradient(to right, #0f172a, #334155)', // Slate-900 to Slate-700
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                // Dark mode override
                                '.dark &': {
                                    background: 'linear-gradient(to right, #f8fafc, #cbd5e1)',
                                }
                            }}
                        >
                            Engineering Practical Tools for <br className="hidden md:block" />
                            <span className="text-blue-600 dark:text-blue-400">Academic Communication</span>
                        </Typography>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-8 max-w-3xl"> {/* 32px */}
                        <Typography
                            variant="body1"
                            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed"
                        >
                            LetterLab is an independently developed software system designed to demonstrate applied system architecture, secure API integrations, and responsible AI usage.
                            <br /><br />
                            At this stage, it is provided freely for testing and learning purposes. Public expansion will only be considered after stable releases and further evaluation.
                        </Typography>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                        <Button
                            variant="outlined"
                            endIcon={<ChevronRight size={16} />}
                            sx={{
                                borderRadius: '9999px',
                                textTransform: 'none',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                color: 'text.primary',
                                borderColor: 'divider',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'action.hover',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-out',
                            }}
                            onClick={() => document.getElementById('founder-profile')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Meet the Engineer
                        </Button>
                    </motion.div>

                </motion.div>
            </Container>
        </Box>
    );
}
