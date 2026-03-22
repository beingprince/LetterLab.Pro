import React from 'react';
import { Box, Typography, Container, Paper, alpha, Link, Stack } from '@mui/material';
import { Linkedin, Mail } from 'lucide-react';

const UnderConstructionPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F9FAFB', // Clean light gray background
        position: 'relative',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 6,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          {/* Brand Logo */}
          <Box sx={{ mb: 6 }}>
            <img 
              src="/brand/letterlab-logo.svg" 
              alt="LetterLab Pro Logo" 
              style={{ height: '50px', width: 'auto' }} 
            />
          </Box>

          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: '#111827',
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Under Construction
          </Typography>

          <Typography
            variant="body1"
            sx={{ 
              mb: 4, 
              color: '#4B5563', 
              fontSize: '1.1rem', 
              lineHeight: 1.8,
              textAlign: 'center'
            }}
          >
            We are fixing the **compose page direct access**, considering the closed environment and **form transfer** optimizations. 
            These upgrades are essential for the production phase.
          </Typography>

          <Box 
            sx={{ 
              height: '1px', 
              width: '60px', 
              backgroundColor: '#E5E7EB', 
              margin: '0 auto 40px' 
            }} 
          />

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center" 
            alignItems="center"
          >
            {/* Contact Email */}
            <Link 
              href="mailto:princepdsn@gmail.com"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#6B7280',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'color 0.2s',
                '&:hover': { color: '#2563EB' }
              }}
            >
              <Mail size={20} strokeWidth={2.5} />
              Contact Founder
            </Link>

            {/* LinkedIn */}
            <Link 
              href="https://www.linkedin.com/in/prince-pudasaini/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#6B7280',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'color 0.2s',
                '&:hover': { color: '#0077B5' }
              }}
            >
              <Linkedin size={20} strokeWidth={2.5} fill="currentColor" />
              Connect on LinkedIn
            </Link>
          </Stack>

          <Typography
            variant="caption"
            sx={{ 
              mt: 8, 
              display: 'block', 
              color: '#9CA3AF', 
              fontWeight: 700, 
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            LetterLab Pro • Coming Soon
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnderConstructionPage;
