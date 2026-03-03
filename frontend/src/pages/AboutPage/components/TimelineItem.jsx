import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { scaleIn } from '../animationVariants';

export const TimelineItem = ({ year, title, description, index, Icon }) => (
  <motion.div
    className="flex items-start gap-4 md:gap-6 mb-8 md:mb-10"
    variants={scaleIn}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
  >
    <motion.div
      className="w-12 h-12 md:w-16 md:h-16 rounded-full flex-shrink-0"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Box
        className="w-full h-full rounded-full flex items-center justify-center glass-card"
        sx={{
          background: 'var(--brand-icon-bg)',
          border: '2px solid var(--brand-border)',
        }}
      >
        <Icon sx={{ fontSize: { xs: 20, md: 24 }, color: 'var(--brand-primary)' }} />
      </Box>
    </motion.div>

    <Box className="flex-1 pt-1 md:pt-2 pr-2">
      <Typography
        variant="subtitle1"
        className="font-bold mb-1"
        sx={{
          color: 'var(--brand-text)',
          fontFamily: 'var(--font-heading)',
          fontSize: { xs: '0.875rem', md: '1rem' },
        }}
      >
        {year} — {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'var(--brand-dim)',
          lineHeight: 1.6,
          fontSize: { xs: '0.875rem', md: '0.9375rem' },
        }}
      >
        {description}
      </Typography>
    </Box>
  </motion.div>
);