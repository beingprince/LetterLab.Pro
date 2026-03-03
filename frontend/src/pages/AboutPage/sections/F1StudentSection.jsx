import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { IconSchool, IconSpeed, IconSecurity } from '../icons';
import { fadeInUp, staggerContainer } from '../animationVariants';

export default function F1StudentSection() {
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStudentCount(prev => Math.min(prev + 7, 1250));
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const benefits = [
    { title: 'Free for Students', description: 'Full access to all essential features. No credit card, no trial limits—just pure productivity.', Icon: IconSchool },
    { title: 'Lightning Fast', description: 'Pull professor emails and generate context-aware drafts in under 30 seconds.', Icon: IconSpeed },
    { title: 'FERPA Compliant', description: 'Your data stays private. Built with student privacy and institutional requirements in mind.', Icon: IconSecurity },
  ];

  return (
    <Box component="section" className="py-16 md:py-20" sx={{ background: 'var(--brand-card)' }}>
      <Container maxWidth="lg">
        {/* Animated Counter - Mobile: optimized spacing */}
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <Typography
            variant="h1"
            className="font-extrabold"
            sx={{
              color: 'var(--brand-primary)',
              fontFamily: 'var(--font-heading)',
              fontSize: { xs: '2.5rem', md: '4rem' },
              lineHeight: 1,
            }}
          >
            {studentCount.toLocaleString()}+
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--brand-dim)',
              letterSpacing: '0.1em',
              fontWeight: 600,
              fontSize: { xs: '0.75rem', md: '0.875rem' },
            }}
          >
            F1 STUDENTS TRUST LETTERLAB PRO
          </Typography>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Typography
            variant="h2"
            className="text-center font-bold mb-6 md:mb-12"
            sx={{
              color: 'var(--brand-text)',
              fontFamily: 'var(--font-heading)',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            Built for Your Academic Journey
          </Typography>

          <Grid container spacing={3} md={4}>
            {benefits.map((benefit, i) => (
              <Grid item xs={12} md={6} lg={4} key={i}>
                <motion.div variants={fadeInUp}>
                  <Box
                    className="h-full p-6 md:p-8 rounded-xl glass-card transition-all duration-300"
                    sx={{
                      '&:hover': {
                        transform: { xs: 'none', md: 'translateY(-8px)' },
                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <benefit.Icon
                      sx={{
                        fontSize: { xs: 36, md: 48 },
                        color: 'var(--brand-primary)',
                        marginBottom: 3,
                      }}
                    />
                    <Typography
                      variant="h5"
                      className="font-bold mb-2 md:mb-3"
                      sx={{
                        color: 'var(--brand-text)',
                        fontSize: { xs: '1.125rem', md: '1.25rem' },
                      }}
                    >
                      {benefit.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--brand-dim)',
                        lineHeight: 1.7,
                        fontSize: { xs: '0.875rem', md: '0.9375rem' },
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <motion.div variants={fadeInUp} className="text-center mt-8 md:mt-12">
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              href="https://letterlab.pro/signup"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-creative))',
                borderRadius: 3,
                px: { xs: 4, md: 6 },
                py: { xs: 1.5, md: 2 },
                fontWeight: 700,
                fontSize: { xs: '0.875rem', md: '1rem' },
                letterSpacing: '0.05em',
                color: 'white',
                boxShadow: '0 4px 24px rgba(99, 102, 241, 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                },
              }}
            >
              Start Free Today
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}