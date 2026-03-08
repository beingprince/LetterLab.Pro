import React, { useEffect } from 'react';
import { Box, Container, Typography, Divider, Stack } from '@mui/material';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{
      pt: { xs: 12, md: 16 },
      pb: 12,
      background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
      minHeight: '100vh',
    }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 1, color: '#0F172A' }}>
          Privacy Policy
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748B', mb: 6 }}>
          Effective Date: {new Date().toLocaleDateString()}
        </Typography>

        <Stack spacing={4} sx={{
          color: '#334155',
          fontSize: '1.05rem',
          lineHeight: 1.8,
          '& h3': {
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0F172A',
            mt: 4,
            mb: 2,
          },
          '& ul': {
            pl: 3,
            mb: 0
          },
          '& li': {
            mb: 1
          }
        }}>

          <Box>
            <Typography variant="h3">Introduction</Typography>
            <Typography paragraph>
              LetterLab Pro is committed to protecting user privacy and maintaining transparency about how personal data is processed. This privacy policy explains what data we collect, how it is used, and how it is protected.
            </Typography>
            <Typography paragraph>
              LetterLab Pro is an academic AI email drafting tool developed as a technical project and does not sell or distribute personal data.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">Data We Collect</Typography>
            <Typography paragraph>
              LetterLab may process the following types of information:
            </Typography>
            <ul>
              <li>User email address used for authentication</li>
              <li>Email thread content retrieved through Gmail or Outlook APIs</li>
              <li>Basic account profile information (name and email)</li>
            </ul>
            <Typography paragraph sx={{ mt: 2 }}>
              This data is only accessed when the user actively connects their email account.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">How We Use Data</Typography>
            <Typography paragraph>
              The data accessed through Gmail or Outlook APIs is used only for the following purposes:
            </Typography>
            <ul>
              <li>Extracting email thread context</li>
              <li>Generating AI draft replies</li>
              <li>Improving response relevance within the current session</li>
            </ul>
            <Typography paragraph sx={{ mt: 2, fontWeight: 600 }}>
              LetterLab does not use email data for advertising or marketing.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">Data Storage</Typography>
            <Typography paragraph>
              LetterLab does not permanently store the content of email messages. Email content retrieved through API access is processed temporarily during draft generation.
            </Typography>
            <Typography paragraph>
              Authentication tokens are stored securely and used only for authorized API requests.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">Third-Party Services</Typography>
            <Typography paragraph>
              LetterLab integrates with:
            </Typography>
            <ul>
              <li>Google Gmail API</li>
              <li>Microsoft Outlook API</li>
              <li>AI language processing services</li>
            </ul>
            <Typography paragraph sx={{ mt: 2 }}>
              These services are used solely to provide email drafting functionality.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">Data Sharing</Typography>
            <Typography paragraph>
              LetterLab does not sell, rent, or trade user data.
            </Typography>
            <Typography paragraph>
              User information is never shared with third parties except when required to operate the core service (for example Gmail or Outlook API access).
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">Security</Typography>
            <Typography paragraph>
              We implement standard security practices including:
            </Typography>
            <ul>
              <li>OAuth2 authentication</li>
              <li>Encrypted API communication</li>
              <li>Secure token handling</li>
            </ul>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">User Control</Typography>
            <Typography paragraph>
              Users may disconnect their email account at any time.
            </Typography>
            <Typography paragraph>
              Disconnecting the account immediately revokes access to Gmail or Outlook APIs.
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h3">Contact</Typography>
            <Typography paragraph>
              If you have questions about privacy or data usage, contact:<br />
              <a href="mailto:princepdsn@gmail.com" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 600 }}>princepdsn@gmail.com</a>
            </Typography>
          </Box>

        </Stack>
      </Container>
    </Box>
  );
}
