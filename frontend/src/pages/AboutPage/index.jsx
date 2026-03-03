
import React from 'react';
import { Box } from '@mui/material';
import { motion, useScroll, useSpring } from 'framer-motion';

// Modular Sections
import AboutHero from './sections/AboutHero';
import TeamSection from './sections/TeamSection';
import MissionSection from './sections/MissionSection';
import TechStack from './sections/TechStack';
import EndorsementRequest from './sections/EndorsementRequest'; // Keeping this as it might still be relevant

// Scroll progress bar (theme-aware)
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left bg-blue-600 dark:bg-blue-500"
      style={{ scaleX }}
    />
  );
};

export default function AboutPage() {
  return (
    <Box className="relative min-h-screen bg-white dark:bg-[#0F1117] text-slate-900 dark:text-white overflow-hidden">
      <ScrollProgressBar />

      <main>
        <AboutHero />

        <TeamSection />

        <MissionSection />

        <TechStack />

        {/* Optional: Keep the endorsement/feedback request if it fits the new vibe, otherwise remove. 
            I'll keep it for now as a bottom CTA but wrap it to ensure it matches. */}
        <EndorsementRequest />
      </main>
    </Box>
  );
}