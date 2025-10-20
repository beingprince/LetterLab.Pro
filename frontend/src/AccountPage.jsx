import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Container, Paper, Typography, Stack, Avatar, Button, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import { apiRequest } from './api';

const LS_KEY = 'letterlab_user';
const TOKEN_KEY = 'letterlab_token';

function loadUser() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch { return null; }
}
function saveUser(u) { localStorage.setItem(LS_KEY, JSON.stringify(u)); }

export default function AccountPage() {
  const [user, setUser] = useState(loadUser());
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
  const [isLogin, setIsLogin] = useState(true); // toggle login/register

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setUser(loadUser());
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const data = await apiRequest(endpoint, 'POST', form);
      // Save user and token
      localStorage.setItem(LS_KEY, JSON.stringify(data));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data);
      setToken(data.token);
      alert(isLogin ? 'Login successful!' : 'Registration successful!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken('');
  };

  const initials = useMemo(() => {
    const n = user?.name?.trim() || '';
    const parts = n.split(/\s+/).slice(0,2);
    return parts.map(p => p[0]?.toUpperCase() || '').join('') || 'U';
  }, [user]);

  // 🟩 LOGIN/REGISTER SCREEN
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <form onSubmit={handleAuth}>
            {!isLogin && (
              <TextField
                label="Name"
                name="name"
                fullWidth
                sx={{ mt: 2 }}
                value={form.name}
                onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
              />
            )}
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              sx={{ mt: 2 }}
              value={form.email}
              onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              fullWidth
              sx={{ mt: 2 }}
              value={form.password}
              onChange={(e) => setForm(s => ({ ...s, password: e.target.value }))}
            />
            <Stack spacing={2} direction="row" sx={{ mt: 3 }}>
              <Button variant="contained" type="submit">
                {isLogin ? 'Login' : 'Register'}
              </Button>
              <Button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account?' : 'Already have an account?'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    );
  }

  // 🟦 ACCOUNT SCREEN (after login)
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Account & Settings</Typography>

      <Paper sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <Avatar sx={{ width: 72, height: 72, fontWeight: 700 }}>{initials}</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name || 'Unnamed User'}</Typography>
            <Typography sx={{ color: 'text.secondary' }}>{user.email || 'no-email@unknown'}</Typography>
          </Box>
          <Button color="error" variant="contained" onClick={handleLogout}>Logout</Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>ACCOUNT INFO</Typography>
          <InfoRow label="Name" value={user.name || '—'} />
          <InfoRow label="Email" value={user.email || '—'} />
          <InfoRow label="Token" value={token ? `${token.slice(0, 15)}...` : '—'} />
        </Stack>
      </Paper>
    </Container>
  );
}

function InfoRow({ label, value }) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ py: 1 }}>
      <Box sx={{ width: { xs: '100%', sm: 200 }, color: 'text.secondary' }}>{label}</Box>
      <Typography>{value}</Typography>
    </Stack>
  );
}
