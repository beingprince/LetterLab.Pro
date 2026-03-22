import React from 'react';
import { Box, Typography, Container, Paper, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const UnderConstructionPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F7FAFF 0%, #E0E7FF 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background Animated Shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -120, 0],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              backgroundColor: alpha('#FFFFFF', 0.6),
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* Logo/Icon Animation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{
                width: 80,
                height: 80,
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                borderRadius: '22px',
                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)',
              }}
            >
              <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, mt: -0.5 }}>
                L
              </Typography>
            </motion.div>

            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #111827 0%, #2563EB 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Under Construction
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}
            >
              We are currently working on optimizing our system hierarchy to provide you with a better experience.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                  }}
                />
              ))}
            </Box>

            <Typography
              variant="caption"
              sx={{ mt: 4, display: 'block', color: alpha('#111827', 0.4), fontWeight: 600, letterSpacing: 1 }}
            >
              LETTERLAB PRO • COMING SOON
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UnderConstructionPage;
