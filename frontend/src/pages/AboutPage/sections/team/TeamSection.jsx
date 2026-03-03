import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { TEAM_MEMBERS } from './teamData';
import TeamMemberCard from './TeamMemberCard';
import { SECTION_PADDING } from './teamStyles';

/**
 * Team section: "Meet the Team" + responsive grid of team cards.
 * 1 col xs, 2 col sm, 3 col md+.
 */
export default function TeamSection() {
  return (
    <Box
      id="team-section"
      sx={{
        ...SECTION_PADDING,
        bgcolor: 'action.hover',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            Meet the Team
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, mx: 'auto' }}>
            The engineering minds behind LetterLab, dedicated to building practical tools for academic workflows.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {TEAM_MEMBERS.map((member, idx) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <TeamMemberCard member={member} index={idx} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
