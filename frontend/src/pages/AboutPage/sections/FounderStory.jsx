import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { TimelineItem } from '../components/TimelineItem';
import { fadeInUp, staggerContainer, scaleIn } from '../animationVariants';
import { IconLightbulb, IconBuild, IconRocket } from '../icons';

const storyEvents = [
  { year: '2023', title: 'The Frustration', description: 'Wasted an hour searching Outlook for a professor\'s email. Realized thousands of students face the same inefficiency daily.', Icon: IconLightbulb },
  { year: '2024', title: 'The Prototype', description: 'Built v1 beta that could authenticate and draft emails. Started showing it to classmates and gathering feedback.', Icon: IconBuild },
  { year: '2025', title: 'LetterLab Pro', description: 'Full-stack solution with context-aware email generation. Launched open-source with FERPA compliance.', Icon: IconRocket },
];

export default function FounderStory() {
  return (
    <Box
      component="section"
      className="py-16 md:py-20 my-8 md:my-16"
      sx={{
        background: 'var(--brand-card)',
        borderTop: '1px solid var(--brand-border)',
        borderBottom: '1px solid var(--brand-border)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} md={6} alignItems="center">
          {/* Founder Image - Mobile: center, Desktop: left */}
          <Grid item xs={12} md={4} className="flex justify-center md:justify-start">
            <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Box className="relative">
                <Box
                  component="img"
                  src="https://scontent-dfw5-2.xx.fbcdn.net/v/t39.30808-1/476152507_640321568374848_5505582188393463543_n.jpg"
                  alt="Prince Pudasaini"
                  className="w-36 h-36 md:w-48 md:h-48 rounded-full mx-auto md:mx-0"
                  sx={{
                    border: '4px solid var(--brand-border)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    objectFit: 'cover',
                  }}
                />
                <motion.div
                  className="absolute -bottom-1 -right-1 w-12 h-12 md:w-16 md:h-16 rounded-full glass-card flex items-center justify-center"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                >
                  <Typography sx={{ fontSize: { xs: 20, md: 24 } }}>✨</Typography>
                </motion.div>
              </Box>
              <Box className="text-center md:text-left mt-4">
                <Typography variant="h5" className="font-bold" sx={{ color: 'var(--brand-text)' }}>
                  Prince Pudasaini
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--brand-dim)' }}>
                  Founder, LetterLab Pro
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Timeline - Mobile: full width, Desktop: right side */}
          <Grid item xs={12} md={8}>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Typography
                variant="h3"
                className="text-center md:text-left font-bold mb-8 md:mb-12"
                sx={{
                  color: 'var(--brand-text)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                The Journey
              </Typography>

              <Box className="max-w-2xl mx-auto md:mx-0">
                {storyEvents.map((event, i) => (
                  <TimelineItem key={i} index={i} {...event} />
                ))}
              </Box>

              <motion.div variants={fadeInUp} className="mt-12 md:mt-16 p-4 md:p-6 rounded-xl glass-card">
                <Typography
                  variant="h6"
                  className="italic font-medium text-center md:text-left"
                  sx={{ color: 'var(--brand-text)' }}
                >
                  "My goal is simple: give students back their time so they can focus on what truly matters."
                </Typography>
                <Typography
                  variant="body2"
                  className="font-bold mt-3 text-center md:text-left"
                  sx={{ color: 'var(--brand-primary)' }}
                >
                  — Prince Pudasaini, Founder
                </Typography>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}