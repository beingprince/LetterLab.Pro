import React, { useState } from 'react';
import { Box, Typography, TextField, Avatar, Button, CircularProgress } from '@mui/material';

const AccountSection = ({ data, loading, refetch }) => {
  const [displayName, setDisplayName] = useState(data?.user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const originalName = data?.user?.displayName || '';
  const isDirty = displayName !== originalName;

  React.useEffect(() => {
    if (data?.user?.displayName !== undefined) setDisplayName(data.user.displayName);
  }, [data?.user?.displayName]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const res = await fetch(`${apiBase}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ displayName })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update profile');
      }

      await refetch();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(originalName);
    setSaveError(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }
  if (!data?.user) return null;

  const user = data.user;
  const memberSince = user.memberSince
    ? new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 1 }}>
        Account
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, opacity: 0.8 }}>
        Manage your personal information.
      </Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
        gap: 4,
        alignItems: 'start',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user.avatarUrl}
            sx={{ width: 80, height: 80, fontSize: '32px' }}
          >
            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
          </Avatar>
          {/* Change photo disabled until we have avatar upload */}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: '400px' }}>
          <Box>
            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
              Display Name
            </Typography>
            <TextField
              fullWidth
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              variant="outlined"
              size="small"
              placeholder={user.email?.split('@')[0] || 'Name'}
              inputProps={{ maxLength: 50 }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
            {saveError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {saveError}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              value={user.email || ''}
              disabled
              variant="outlined"
              size="small"
              helperText="Managed by your connected provider"
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'rgba(0,0,0,0.02)' },
                '& .MuiFormHelperText-root': { ml: 0, opacity: 0.7 }
              }}
            />
          </Box>

          {isDirty && (
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' }
                }}
              >
                {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSaving}
                sx={{ borderRadius: '10px', textTransform: 'none' }}
              >
                Cancel
              </Button>
            </Box>
          )}

          {memberSince && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                Member since: {memberSince}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSection;
