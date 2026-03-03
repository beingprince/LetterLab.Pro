import React from 'react';
import { Box, Typography, Switch, FormControlLabel, TextField, MenuItem } from '@mui/material';

const PreferencesSection = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 600, mb: 4 }}>
                Preferences
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '500px' }}>
                {/* Default Tone */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Default Tone</Typography>
                    <TextField select fullWidth value="professional" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="casual">Casual</MenuItem>
                        <MenuItem value="friendly">Friendly</MenuItem>
                    </TextField>
                </Box>

                {/* Signature */}
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Email Signature</Typography>
                    <TextField
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Best regards, [Name]"
                        size="small"
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                </Box>

                {/* Toggles */}
                <Box>
                    <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Dark Mode (Auto)"
                    />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 7, mt: -0.5 }}>
                        Sync with system preferences
                    </Typography>
                </Box>

                <Box>
                    <FormControlLabel
                        control={<Switch />}
                        label="Compact Mode"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default PreferencesSection;
