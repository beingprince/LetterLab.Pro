import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Chip, Container, Stack } from '@mui/material';
import FeaturePreviewCard from '../../../../../components/footer/footer-pages/FeaturePreviewCard';

const heroVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
      staggerChildren: 0.1
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const CHIPS = ['Student-built demo', 'Privacy-first approach', 'Control over tone'];

export default function HeroFeatures({ title, lead }) {
  return (
    <Box
      component={motion.section}
      variants={heroVariants}
      initial="hidden"
      animate="visible"
      sx={{
        pt: { xs: 8, md: 12 },
        pb: { xs: 8, md: 10 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 6, md: 10 },
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <Stack spacing={3} variants={itemVariants} component={motion.div}>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontWeight: 800,
                color: 'primary.main'
              }}
            >
              Product · Features
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '32px', md: '56px' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '16px', md: '18px' },
                color: 'text.secondary',
                maxWidth: 480,
                lineHeight: 1.6
              }}
            >
              {lead}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {CHIPS.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  variant="outlined"
                  sx={{ borderRadius: '8px', fontWeight: 500 }}
                />
              ))}
            </Stack>
          </Stack>

          {/* Right Stage */}
          <Box
            component={motion.div}
            variants={itemVariants}
            sx={{
              position: 'relative',
              height: { xs: 300, md: 400 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Background Decorative Element */}
            <Box sx={{
              position: 'absolute',
              width: '120%',
              height: '120%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: 0
            }} />

            {/* Layered Cards Stage */}
            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                position: 'relative',
                zIndex: 1,
                perspective: '1000px'
              }}
            >
              {/* Back Card */}
              <motion.div
                initial={{ opacity: 0, rotateY: -10, x: -40, z: -100 }}
                animate={{ opacity: 1, rotateY: -10, x: -40, z: -100 }}
                transition={{ delay: 0.4, duration: 1 }}
                style={{ position: 'absolute', top: -20, left: 0, width: '100%', opacity: 0.4 }}
              >
                <FeaturePreviewCard type="tone" />
              </motion.div>

              {/* Middle Card */}
              <motion.div
                initial={{ opacity: 0, rotateY: 5, x: 20, z: -50 }}
                animate={{ opacity: 1, rotateY: 5, x: 20, z: -50 }}
                transition={{ delay: 0.3, duration: 1 }}
                style={{ position: 'absolute', top: 20, left: 0, width: '100%', opacity: 0.6 }}
              >
                <FeaturePreviewCard type="structure" />
              </motion.div>

              {/* Front Card (Main) */}
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 0, z: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'relative', zIndex: 10 }}
              >
                <FeaturePreviewCard type="draft" />
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
