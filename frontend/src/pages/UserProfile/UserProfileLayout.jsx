import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProfileSidebar from './ProfileSidebar';
import AccountSection from './sections/AccountSection';
import SecuritySection from './sections/SecuritySection';
import UsageSection from './sections/UsageSection';
import IntegrationsSection from './sections/IntegrationsSection';
import PreferencesSection from './sections/PreferencesSection'; // ✅ NEW
import { useAccountMe } from './hooks/useAccountMe';

const CARD_GAP = 2;
const CARD_PADDING = 2;

const Card = ({ children }) => (
  <Box sx={{
    p: CARD_PADDING,
    borderRadius: '16px',
    bgcolor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
    border: '1px solid',
    borderColor: (t) => t.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  }}>
    {children}
  </Box>
);

const UserProfileLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState('account');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data, loading, error, refetch } = useAccountMe();

  const renderContent = () => {
    switch (activeSection) {
      case 'account': return <AccountSection data={data} loading={loading} refetch={refetch} />;
      case 'preferences': return <PreferencesSection />;
      case 'integrations': return <IntegrationsSection data={data} loading={loading} />;
      case 'usage': return <UsageSection data={data} loading={loading} />;
      case 'security': return <SecuritySection />;
      default: return <AccountSection data={data} loading={loading} />;
    }
  };

  const handleSignOut = () => {
    window.location.href = '/account';
  };

  return (
    <Box sx={{
      maxWidth: '1000px',
      mx: 'auto',
      mt: { xs: 2, md: 6 },
      mb: { xs: 4, md: 10 },
      px: { xs: 2, md: 0 },
    }}>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            pt: 2,
            px: 2,
            background: theme.palette.mode === 'dark' ? 'rgba(17,24,39,0.98)' : 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(16px)',
          },
        }}
      >
        <ProfileSidebar
          activeSection={activeSection}
          setActiveSection={(id) => {
            setActiveSection(id);
            setDrawerOpen(false);
          }}
        />
      </Drawer>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
        gap: { xs: 3, md: 5 },
        alignItems: 'start',
      }}>
        {/* Desktop sidebar */}
        {!isMobile && (
          <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        )}

        {/* Content panel */}
        <Box sx={{
          background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          p: { xs: 3, md: 4 },
          minHeight: { xs: 'auto', md: 400 },
        }}>
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Open account menu"
                sx={{ minWidth: 44, minHeight: 44 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          {error && (
            <Box sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
              {error}
            </Box>
          )}
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileLayout;
