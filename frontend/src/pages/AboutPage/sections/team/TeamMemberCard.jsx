import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { CARD_BASE, MEDIA_ASPECT, INITIALS_GRADIENT } from './teamStyles';
import TeamMemberBadges from './TeamMemberBadges';
import TeamMemberLinks from './TeamMemberLinks';

/**
 * Single team member card: media/initials header, name, role chip, bio, contribution bullets, links.
 * Equal height via flex; links pinned at bottom.
 */
export default function TeamMemberCard({ member, index }) {
  const hasImage = Boolean(member.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ height: '100%' }}
    >
      <Card sx={CARD_BASE} elevation={0}>
        {/* Media / initials header */}
        <Box
          sx={{
            ...MEDIA_ASPECT,
            position: 'relative',
            bgcolor: 'action.hover',
            overflow: 'hidden',
          }}
        >
          {hasImage ? (
            <>
              <Box
                component="img"
                src={member.image}
                alt={`${member.name} profile photo`}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  zIndex: 1,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, lineHeight: 1.2 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
                  {member.role}
                </Typography>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                ...INITIALS_GRADIENT,
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'text.disabled',
                  letterSpacing: 1,
                  userSelect: 'none',
                }}
              >
                {member.initials || member.name.split(' ').map((n) => n[0]).join('')}
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            py: 2,
            px: 2.5,
          }}
        >
          {!hasImage && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {member.name}
              </Typography>
              <TeamMemberBadges role={member.role} />
            </>
          )}

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              mb: 2,
              '& p': { margin: 0, '& + p': { mt: 1.5 } },
            }}
          >
            {member.bio.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </Typography>

          {member.contributions && member.contributions.length > 0 && (
            <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 2, color: 'text.secondary' }}>
              {member.contributions.map((item, i) => (
                <Typography key={i} component="li" variant="body2" sx={{ mb: 0.5, lineHeight: 1.5 }}>
                  {item}
                </Typography>
              ))}
            </Box>
          )}

          <TeamMemberLinks links={member.links} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
