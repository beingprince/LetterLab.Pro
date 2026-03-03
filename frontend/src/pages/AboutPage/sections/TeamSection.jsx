import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { TEAM_MEMBERS } from '../data/teamMembers';
import TeamMemberCard from '../components/TeamMemberCard';
import { SECTION } from '../styles/teamSectionStyles';

/**
 * Team section: "Meet the Team" + responsive grid of team cards.
 * Desktop ≥1200px: 3 cols; 900–1199px: 2 cols; ≤899px: 1 col.
 */
export default function TeamSection() {
  return (
    <Box id="team-section" sx={SECTION}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 700, letterSpacing: '-0.02em', mb: 1.5 }}
          >
            Meet the Team
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 560, mx: 'auto' }}
          >
            The engineering minds behind LetterLab, dedicated to building practical tools for academic workflows.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          {TEAM_MEMBERS.map((member, idx) => (
            <Box key={member.name} sx={{ minHeight: 0 }}>
              <TeamMemberCard member={member} index={idx} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
