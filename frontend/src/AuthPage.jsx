// =============================================
// File: frontend/src/AuthPage.jsx
// Description: Glassmorphism auth with Signup/Login/OTP.
// - Theme-aware colors (works in light & dark)
// - Aurora background does not intercept clicks.
// - Writes user to localStorage and notifies App via custom event.
// =============================================

import React, { useMemo, useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Link as MuiLink,
  IconButton, InputAdornment, Divider, keyframes
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
// import AuroraBackground from './AuroraBackground'; // ❌ REMOVED
import MicrosoftIcon from './components/icons/MicrosoftIcon'; // ✅ ADDED

const LS_KEY = 'letterlab_user';

const fadeSlide = keyframes`
  0%   { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;
const shakeCard = keyframes`
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
`;

function strengthScore(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4); // 0..4
}

// --- helper: mark user authed, notify App, and go Home ---
function completeLogin(userLike) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(userLike)); } catch { }
  // tell App.jsx to resync auth immediately in this tab
  window.dispatchEvent(new Event('llp_auth_changed'));
  // navigate to Home and update in-app router
  window.history.pushState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// ✅ HELPER: Get Backend URL
// Use environment variables for your API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


export default function AuthPage() {
  const [reasonMessage, setReasonMessage] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get('reason');
    if (reason === 'expired' || reason === 'user' || reason === 'refresh_failed') {
      setReasonMessage('Your session expired. Please sign in again.');
    } else if (reason) {
      setReasonMessage('Please sign in to continue.');
    }
  }, []);

  // ✅ START OAUTH HANDLERS
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleOutlookLogin = () => {
    window.location.href = `${API_BASE_URL}/api/oauth/outlook/login`;
  };
  // ✅ END OAUTH HANDLERS

  return (
    <Box sx={{
      minHeight: 'calc(100dvh - 80px)', // Centered in the remaining viewport
      display: 'grid',
      placeItems: 'center',
      px: 2,
    }}>
      <Box component="section" aria-label="Auth Card" sx={(t) => ({
        width: 'min(420px, 92vw)', // Tighter width for focus
        // ✅ No Border, Just Depth
        background: t.palette.mode === 'dark'
          ? 'rgba(30, 41, 59, 0.4)' // Subtle dark glass
          : 'rgba(255, 255, 255, 0.6)', // Subtle light glass
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 6, // 24px radius
        boxShadow: t.palette.mode === 'dark'
          ? '0 24px 48px -12px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1)' // Deep shadow + subtle inner rim
          : '0 24px 48px -12px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.05)', // Soft shadow
        p: { xs: 4, sm: 5 },
        textAlign: 'center',
        color: t.palette.text.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      })}>

        {/* Logo / Brand Icon - Floating */}
        <Box sx={(t) => ({
          width: 56, height: 56, mb: 4,
          background: `linear-gradient(135deg, ${t.palette.primary.main} 0%, #7C3AED 100%)`, // Vibrant gradient
          borderRadius: 3, // 12px radius
          boxShadow: '0 8px 24px -4px rgba(124, 58, 237, 0.4)', // Colored glow
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        })}>
          <EmailIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>

        {reasonMessage && (
          <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
            {reasonMessage}
          </Typography>
        )}

        <Typography variant="h4" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.03em', fontSize: '1.75rem' }}>
          Connect your email
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: '280px', lineHeight: 1.5, fontSize: '0.95rem' }}>
          Sign in to LetterLab to start drafting professional emails in seconds.
        </Typography>

        {/* OAuth Buttons - Soft Filled & Elevated */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, width: '100%' }}>
          <Button
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={(t) => ({
              py: 1.75,
              borderRadius: 3, // 12px
              fontSize: '0.95rem',
              fontWeight: 600,
              color: t.palette.text.primary,
              backgroundColor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 1px 0 rgba(0,0,0,0.06)',
              border: '1px solid transparent', // reserve space
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              '&:hover': {
                backgroundColor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : '#FFFFFF',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.04), 0 1px 0 rgba(0,0,0,0.06)',
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: 'none',
                opacity: 0.9
              }
            })}
          >
            Continue with Google
          </Button>

          <Button
            fullWidth
            size="large"
            startIcon={<MicrosoftIcon />}
            onClick={handleOutlookLogin}
            sx={(t) => ({
              py: 1.75,
              borderRadius: 3, // 12px
              fontSize: '0.95rem',
              fontWeight: 600,
              color: t.palette.text.primary,
              backgroundColor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.8)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 1px 0 rgba(0,0,0,0.06)',
              border: '1px solid transparent',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              '&:hover': {
                backgroundColor: t.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : '#FFFFFF',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.04), 0 1px 0 rgba(0,0,0,0.06)',
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: 'none',
                opacity: 0.9
              }
            })}
          >
            Continue with Outlook
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, opacity: 0.6, fontSize: '0.8rem' }}>
          By continuing, you acknowledge that LetterLab securely processes your data via OAuth.
        </Typography>

      </Box>
    </Box>
  );
}