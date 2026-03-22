import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Switch, FormControlLabel, Divider, Button, alpha, useTheme, Snackbar, Alert, CircularProgress } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const PreferencesSection = ({ data, loading, refetch }) => {
  const theme = useTheme();
  const [tone, setTone] = useState('formal');
  const [autoSave, setAutoSave] = useState(true);
  const [signature, setSignature] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (data?.user) {
      setTone(data.user.defaultTone || 'formal');
      setAutoSave(data.user.autoSaveDrafts ?? true);
      setSignature(data.user.defaultSignature || '');
    }
  }, [data]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const res = await fetch(`${apiBase}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          defaultTone: tone,
          defaultSignature: signature,
          autoSaveDrafts: autoSave
        })
      });

      if (!res.ok) throw new Error('Failed to update preferences');
      
      await refetch();
      setSnackbar({ open: true, message: 'Preferences saved successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress size={32} />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 1 }}>
        Preferences
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, opacity: 0.8 }}>
        Customize your drafting experience and default settings.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '600px' }}>
        {/* Drafting Tone */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Default Drafting Tone
          </Typography>
          <TextField
            select
            fullWidth
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          >
            <MenuItem value="formal">Formal & Professional</MenuItem>
            <MenuItem value="friendly">Friendly & Casual</MenuItem>
            <MenuItem value="concise">Concise & Direct</MenuItem>
            <MenuItem value="detailed">Detailed & Explanatory</MenuItem>
          </TextField>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This tone will be pre-selected when you start a new draft.
          </Typography>
        </Box>

        <Divider />

        {/* Email Signature */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Default Email Signature
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            variant="outlined"
            placeholder="e.g. Best regards, Prince"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Automatically appended to your generated drafts.
          </Typography>
        </Box>

        <Divider />

        {/* Behavior */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            App Behavior
          </Typography>
          <FormControlLabel
            control={
              <Switch 
                checked={autoSave} 
                onChange={(e) => setAutoSave(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>Auto-save drafts</Typography>
                <Typography variant="caption" color="text.secondary">Save changes locally as you type</Typography>
              </Box>
            }
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveOutlinedIcon />}
            sx={{
                borderRadius: '10px',
                textTransform: 'none',
                px: 4,
                py: 1.2,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' }
            }}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </Box>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PreferencesSection;
