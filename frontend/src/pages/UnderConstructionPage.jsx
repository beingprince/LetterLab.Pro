import React from 'react';
import { Box, Typography, Container, Link, Stack } from '@mui/material';
import { Linkedin, Mail } from 'lucide-react';

const UnderConstructionPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        position: 'relative',
        p: 4,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        {/* Brand Logo - Centered */}
        <Box sx={{ mb: 8, display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/brand/letterlab-logo.svg" 
            alt="LetterLab Pro Logo" 
            style={{ height: '60px', width: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }} 
          />
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            color: '#111827',
            mb: 3,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            letterSpacing: '-0.02em',
          }}
        >
          System Optimization in Progress
        </Typography>

        <Typography
          variant="body1"
          sx={{ 
            mb: 6, 
            color: '#4B5563', 
            fontSize: { xs: '1.1rem', md: '1.25rem' }, 
            lineHeight: 1.6,
            maxWidth: '700px',
            margin: '0 auto 48px',
          }}
        >
          We are currently enhancing the <strong>compose page architecture</strong> and streamlining the 
          <strong> form transfer layers</strong> to ensure a more robust and secure environment for our users. 
          For that reason, we are under construction; we will be back as soon as possible.
        </Typography>

        <Box 
          sx={{ 
            height: '1px', 
            width: '60px', 
            backgroundColor: '#E5E7EB', 
            margin: '0 auto 40px' 
          }} 
        />

        {/* Connect Section */}
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 800, 
            color: '#111827', 
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Connect with founder
        </Typography>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={4} 
          justifyContent="center" 
          alignItems="center"
          sx={{ mb: 8 }}
        >
          {/* Contact Email */}
          <Link 
            href="mailto:princepdsn@gmail.com"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'all 0.2s',
              '&:hover': { color: '#2563EB', transform: 'translateY(-1px)' }
            }}
          >
            <Mail size={22} strokeWidth={2.5} />
            princepdsn@gmail.com
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
              color: '#374151',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              transition: 'all 0.2s',
              '&:hover': { color: '#0077B5', transform: 'translateY(-1px)' }
            }}
          >
            <Linkedin size={22} strokeWidth={2.5} fill="currentColor" />
            Connect on LinkedIn
          </Link>
        </Stack>

        <Typography
          variant="caption"
          sx={{ 
            color: '#9CA3AF', 
            fontWeight: 800, 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.75rem'
          }}
        >
          copyright letterlab.pro 2025-26
        </Typography>
      </Container>
    </Box>
  );
};

export default UnderConstructionPage;
