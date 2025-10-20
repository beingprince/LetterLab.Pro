// =============================================
// File: frontend/src/AuthPage.jsx
// Description: Glassmorphism auth with Signup/Login/OTP.
// - Theme-aware colors (works in light & dark)
// - Aurora background does not intercept clicks.
// - Writes user to localStorage and notifies App via custom event.
// =============================================

import React, { useMemo, useState } from 'react';
import {
  Box, Button, TextField, Typography, Link as MuiLink,
  IconButton, InputAdornment, Divider, keyframes
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import AuroraBackground from './AuroraBackground';

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
  try { localStorage.setItem(LS_KEY, JSON.stringify(userLike)); } catch {}
  // tell App.jsx to resync auth immediately in this tab
  window.dispatchEvent(new Event('llp_auth_changed'));
  // navigate to Home and update in-app router
  window.history.pushState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function AuthPage() {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login' | 'otp'
  const [shake, setShake] = useState(false);

  // signup state
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [middle, setMiddle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  // login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  const pwScore = useMemo(() => strengthScore(pw), [pw]);
  const pwLabel = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'][pwScore];
  const pwColor = ['#ef4444', '#ef4444', '#f59e0b', '#84cc16', '#22c55e'][pwScore];

  const validateEmail = (v) => /.+@.+\..+/.test(v);

  const onSubmitSignup = (e) => {
    e.preventDefault();
    const eMap = {};
    if (!first) eMap.first = 'First name is required';
    if (!last) eMap.last = 'Last name is required';
    if (!email) eMap.email = 'Email is required';
    else if (!validateEmail(email)) eMap.email = 'Enter a valid email';
    if (!pw) eMap.pw = 'Password is required';

    if (Object.keys(eMap).length) {
      setErrors(eMap);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    setMode('otp'); // simulate OTP step; we "completeLogin" in OTP verify
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    const eMap = {};
    if (!loginEmail || !validateEmail(loginEmail)) eMap.loginEmail = 'Valid email is required';
    if (!loginPw) eMap.loginPw = 'Password is required';
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    // Simulate success → persist user and go Home
    completeLogin({
      name: 'User',
      email: loginEmail,
    });
  };

  return (
    <>
      <AuroraBackground />
      <Box sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        isolation: 'isolate', // keep above the Aurora layer
        position: 'relative',
        zIndex: 1,
      }}>
        <Box component="section" aria-label="Auth Card" sx={(t) => ({
          width: 'min(840px, 92vw)',
          background: t.palette.mode === 'dark' ? 'rgba(30,35,45,0.55)' : 'rgba(255,255,255,0.8)',
          border: `1px solid ${t.palette.divider}`,
          borderRadius: 3,
          boxShadow: t.palette.mode === 'dark' ? '0 20px 80px rgba(0,0,0,0.45)' : '0 20px 70px rgba(0,0,0,0.10)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          p: { xs: 3, sm: 4.5 },
          animation: `${shake ? shakeCard : fadeSlide} 400ms ease-out`,
          color: t.palette.text.primary,
        })}>

          {/* Logo + Heading */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={(t) => ({
              width: 52, height: 52, mx: 'auto', mb: 1,
              background: `linear-gradient(135deg, ${t.palette.primary.main} 0%, #8B5CF6 100%)`,
              borderRadius: '14px',
              boxShadow: t.palette.mode === 'dark'
                ? '0 8px 30px rgba(0,163,255,0.35)'
                : '0 8px 26px rgba(0,163,255,0.25)'
            })} />
            {mode !== 'login' && mode !== 'otp' && (
              <>
                <Typography variant="h5" fontWeight={600}>Create Your Account</Typography>
                <Typography variant="body2" color="text.secondary">Join us and start your journey.</Typography>
              </>
            )}
            {mode === 'login' && (
              <>
                <Typography variant="h5" fontWeight={600}>Welcome Back!</Typography>
                <Typography variant="body2" color="text.secondary">Sign in to continue.</Typography>
              </>
            )}
            {mode === 'otp' && (
              <>
                <Typography variant="h5" fontWeight={600}>Check your email/phone!</Typography>
                <Typography variant="body2" color="text.secondary">Enter the 6-digit code to verify your account.</Typography>
              </>
            )}
          </Box>

          {/* Forms */}
          {mode === 'signup' && (
            <Box component="form" onSubmit={onSubmitSignup} noValidate>
              {/* Name group */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="First Name" value={first} onChange={(e) => setFirst(e.target.value)}
                  error={!!errors.first} helperText={errors.first}
                  fullWidth
                />
                <TextField
                  label="Last Name" value={last} onChange={(e) => setLast(e.target.value)}
                  error={!!errors.last} helperText={errors.last}
                  fullWidth
                />
              </Box>
              <TextField sx={{ mt: 2 }} label="Middle Name (Optional)" value={middle}
                onChange={(e) => setMiddle(e.target.value)} fullWidth />

              {/* Contact */}
              <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email} helperText={errors.email}
                  fullWidth InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Phone (Optional)" value={phone} onChange={(e) => setPhone(e.target.value)}
                  fullWidth InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><PhoneIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Birthdate */}
              <TextField sx={{ mt: 2 }} type="date" label="Birthdate" value={birth}
                onChange={(e) => setBirth(e.target.value)} fullWidth
                InputLabelProps={{ shrink: true }} />

              {/* Password */}
              <TextField sx={{ mt: 2 }}
                type={showPw ? 'text' : 'password'} label="Password" value={pw}
                onChange={(e) => setPw(e.target.value)}
                error={!!errors.pw} helperText={errors.pw}
                fullWidth InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw((v) => !v)} edge="end" aria-label="toggle password visibility" sx={{ color: 'text.secondary' }}>
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Strength meter */}
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                  flex: 1, height: 6, borderRadius: 6, overflow: 'hidden',
                  backgroundColor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
                }}>
                  <Box sx={{ height: '100%', width: `${(pwScore/4)*100}%`, background: pwColor, transition: 'width .25s ease' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">{pwLabel}</Typography>
              </Box>

              {/* CTA */}
              <Button type="submit" fullWidth sx={{ mt: 3, py: 1.4, fontWeight: 600 }} variant="contained">
                Create Account
              </Button>

              {/* Footer toggle */}
              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">
                Already have an account?{' '}
                <MuiLink component="button" onClick={() => setMode('login')}>Log In</MuiLink>
              </Typography>
            </Box>
          )}

          {mode === 'login' && (
            <Box component="form" onSubmit={onSubmitLogin} noValidate>
              <TextField
                type="email" label="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                error={!!errors.loginEmail} helperText={errors.loginEmail}
                fullWidth sx={{ mb: 2 }} InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary' }} /></InputAdornment>
                  ),
                }}
              />
              <TextField
                type={showLoginPw ? 'text' : 'password'} label="Password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)}
                error={!!errors.loginPw} helperText={errors.loginPw}
                fullWidth InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowLoginPw(v => !v)} edge="end" aria-label="toggle password visibility" sx={{ color: 'text.secondary' }}>
                        {showLoginPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <MuiLink component="button">Forgot Password?</MuiLink>
              </Box>

              <Button type="submit" fullWidth sx={{ mt: 2, py: 1.2, fontWeight: 600 }} variant="contained">Login</Button>

              <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="caption" color="text.secondary">OR</Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
                Sign in with Google
              </Button>

              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }} color="text.secondary">
                Don't have an account?{' '}
                <MuiLink component="button" onClick={() => setMode('signup')}>Create one</MuiLink>
              </Typography>
            </Box>
          )}

          {mode === 'otp' && (
            <OtpStep
              onDone={() => {
                // simulate verified signup → persist user and go Home
                const name = `${first} ${last}`.trim() || 'User';
                completeLogin({ name, email: email || 'user@example.com' });
              }}
              onBack={() => setMode('signup')}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

function OtpStep({ onDone, onBack }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const filled = code.every((c) => c && /\d/.test(c));
  const handleChange = (i, v) => {
    if (v.length > 1) v = v.slice(-1);
    if (!/\d?/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
  };
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.2 }}>
        {code.map((c, i) => (
          <TextField key={i} value={c}
            onChange={(e) => handleChange(i, e.target.value)}
            inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 20, width: 40 } }} />
        ))}
      </Box>
      <Button disabled={!filled} onClick={onDone} fullWidth sx={{ mt: 2 }} variant="contained">Verify</Button>
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <MuiLink component="button" onClick={onBack}>Back</MuiLink>
      </Box>
    </Box>
  );
}
