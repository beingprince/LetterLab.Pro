import React, { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Switch, FormControlLabel, Divider, Button, alpha, useTheme } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const PreferencesSection = () => {
  const theme = useTheme();
  const [tone, setTone] = useState('formal');
  const [autoSave, setAutoSave] = useState(true);
  const [signature, setSignature] = useState('Best regards,\n[Your Name]');

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
            startIcon={<SaveOutlinedIcon />}
            sx={{
                borderRadius: '10px',
                textTransform: 'none',
                px: 4,
                py: 1.2,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' }
            }}
          >
            Save Preferences
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PreferencesSection;
