import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const NAV_ITEMS = [
  { id: 'account', label: 'Account' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'integrations', label: 'Connected Accounts' },
  { id: 'usage', label: 'Usage & Limits' },
  { id: 'security', label: 'Security' },
];

export const ProfileSidebar = ({ activeSection, setActiveSection }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{
      width: '100%',
      background: isDark ? 'rgba(17,24,39,0.55)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      p: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <Box
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            sx={{
              height: 44,
              minHeight: 44,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isActive ? 'rgba(37,99,235,0.15)' : 'transparent',
              color: isActive ? (isDark ? '#fff' : 'primary.main') : (isDark ? 'rgba(255,255,255,0.65)' : 'text.secondary'),
              '&:hover': {
                color: isActive ? (isDark ? '#fff' : 'primary.main') : (isDark ? '#fff' : 'text.primary'),
                background: isActive ? 'rgba(37,99,235,0.2)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
              },
              position: 'relative',
            }}
          >
            {isActive && (
              <Box sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                height: '20px',
                width: '3px',
                background: '#3B82F6',
                borderRadius: '0 4px 4px 0',
              }} />
            )}
            <Typography sx={{ fontSize: '14px', fontWeight: isActive ? 500 : 400 }}>
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProfileSidebar;
