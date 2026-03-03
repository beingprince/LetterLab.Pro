import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Stack, Button } from '@mui/material';
import FeaturePreviewCard from './FeaturePreviewCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircleIcon from '@mui/icons-material/Circle';

export default function FeatureSection({
  label,
  title,
  paragraph,
  bullets = [],
  cta,
  previewType = 'draft',
  ctaHref = '#',
  index = 0,
}) {
  const isAlt = index % 2 === 1;

  return (
    <Box
      component={motion.section}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isAlt ? (theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)') : 'transparent',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 6, md: 10 },
          alignItems: 'center',
          direction: isAlt ? 'rtl' : 'ltr'
        }}>
          {/* Content Column */}
          <Stack
            spacing={3}
            sx={{
              direction: 'ltr', // Reset direction for text
              textAlign: { xs: 'center', md: 'left' },
              alignItems: { xs: 'center', md: 'flex-start' }
            }}
          >
            {label && (
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontWeight: 800,
                  color: 'primary.main',
                  fontSize: '12px'
                }}
              >
                {label}
              </Typography>
            )}
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '28px', md: '36px' },
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.01em'
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '16px', md: '17px' },
                lineHeight: 1.6,
                maxWidth: 520
              }}
            >
              {paragraph}
            </Typography>

            {bullets && bullets.length > 0 && (
              <Stack spacing={2} sx={{ mt: 1, width: '100%', maxWidth: 500 }}>
                {bullets.map((text, i) => (
                  <Stack key={i} direction="row" spacing={2} alignItems="flex-start">
                    <CircleIcon sx={{ fontSize: 8, mt: 1, color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {text}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}

            {cta && (
              <Button
                component="a"
                href={ctaHref}
                endIcon={<ArrowForwardIcon />}
                variant="text"
                sx={{
                  mt: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '16px',
                  p: 0,
                  '&:hover': { background: 'none', gap: '8px' },
                  transition: 'all 0.2s'
                }}
              >
                {cta}
              </Button>
            )}
          </Stack>

          {/* Preview Column */}
          <Box
            sx={{
              direction: 'ltr',
              width: '100%',
              maxWidth: { xs: 480, md: 'none' },
              mx: 'auto'
            }}
          >
            <FeaturePreviewCard type={previewType} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
