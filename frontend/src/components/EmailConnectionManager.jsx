import { useState, useEffect } from 'react';
import { Button, Box, Alert, CircularProgress, Typography, Paper, Tooltip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MailOutlineIcon from "@mui/icons-material/MailOutline";      // Gmail style
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";  // Outlook style

export default function EmailConnectionManager() {
  const [outlookStatus, setOutlookStatus] = useState({ loading: true, connected: false });
  const [gmailStatus, setGmailStatus] = useState({ loading: true, connected: false });

  useEffect(() => {
    checkConnectionStatus();

    // Check for connection success in URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('outlook_connected') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
      checkConnectionStatus(); // Refresh status
    }
    if (params.get('gmail_connected') === 'true') {
      window.history.replaceState({}, '', window.location.pathname);
      checkConnectionStatus(); // Refresh status
    }
  }, []);

  const checkConnectionStatus = async () => {
    const outlookToken = localStorage.getItem('letterlab_outlook_token');
    // We use the main app token for Gmail now, as the backend handles the Google token
    const appToken = localStorage.getItem('authToken');

    if (!outlookToken && !appToken) {
      setOutlookStatus({ connected: false, loading: false });
      setGmailStatus({ connected: false, loading: false });
      return;
    }

    try {
      // Check Outlook
      if (outlookToken) {
        try {
          const outlookRes = await fetch('http://localhost:5000/api/oauth/outlook/status', {
            headers: { 'Authorization': `Bearer ${outlookToken}` }
          });
          const outlookData = await outlookRes.json();
          setOutlookStatus({ ...outlookData, loading: false });
        } catch (e) {
          console.error("Outlook status check failed", e);
          setOutlookStatus({ connected: false, loading: false });
        }
      } else {
        setOutlookStatus({ connected: false, loading: false });
      }

      // Check Gmail
      if (appToken) {
        try {
          const gmailRes = await fetch('http://localhost:5000/api/gmail/status', {
            headers: { 'Authorization': `Bearer ${appToken}` }
          });
          const gmailData = await gmailRes.json();
          setGmailStatus({ ...gmailData, loading: false });
        } catch (e) {
          console.error("Gmail status check failed", e);
          setGmailStatus({ connected: false, loading: false });
        }
      } else {
        setGmailStatus({ connected: false, loading: false });
      }

    } catch (error) {
      console.error('Failed to check connection status:', error);
      setOutlookStatus({ connected: false, loading: false });
      setGmailStatus({ connected: false, loading: false });
    }
  };

  const connectOutlook = () => {
    window.location.href = `http://localhost:5000/api/oauth/outlook/connect`;
  };

  const connectGmail = () => {
    window.location.href = `http://localhost:5000/auth/google`;
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 100,
        right: 35,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 1.2,
        zIndex: 2000,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {[
        { name: "Outlook", icon: "/src/assets/Microsoft-outlook-icon.svg.png", color: "#0078D4", connected: outlookStatus.connected, action: connectOutlook },
        { name: "Gmail", icon: "/src/assets/Gmail-logo.png", color: "#D93025", connected: gmailStatus.connected, action: connectGmail },
      ].map(({ name, icon, color, connected, action }) => (
        <Tooltip key={name} title={connected ? `${name} Connected` : `Connect ${name}`} arrow>
          <Box
            onClick={!connected ? action : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.2,
              py: 0.5,
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.6)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              backdropFilter: "blur(4px)",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              },
            }}
          >
            <img src={icon} alt={`${name} icon`} style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: "0.85rem", color: color, fontWeight: 500 }}>{name}</span>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: connected ? "#00C853" : "#FF1744",
                boxShadow: connected
                  ? "0 0 5px rgba(0,200,83,0.6)"
                  : "0 0 5px rgba(255,23,68,0.5)",
              }}
            />
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}