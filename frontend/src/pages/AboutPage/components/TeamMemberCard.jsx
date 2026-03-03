import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Globe,
  Dribbble,
} from 'lucide-react';
import {
  CARD,
  MEDIA_ASPECT,
  SOCIAL_BUTTON,
  INITIALS_GRADIENT,
} from '../styles/teamSectionStyles';

const ICON_MAP = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  portfolio: Globe,
  website: Globe,
  dribbble: Dribbble,
};

/**
 * Team member card: photo/initials header, social icons top-right,
 * content panel with name, role, location, bio (line-clamped).
 */
export default function TeamMemberCard({ member, index }) {
  const hasImage = Boolean(member.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{ height: '100%' }}
    >
      <Box sx={CARD}>
        {/* Photo / initials area */}
        <Box
          sx={{
            ...MEDIA_ASPECT,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {hasImage ? (
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

          {/* Social icons top-right */}
          {member.socials && member.socials.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                gap: 0.5,
                zIndex: 3,
              }}
            >
              {member.socials.map((social) => {
                const Icon = ICON_MAP[social.key] ?? Globe;
                return (
                  <IconButton
                    key={social.key}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    sx={
                      hasImage
                        ? SOCIAL_BUTTON
                        : {
                            ...SOCIAL_BUTTON,
                            bgcolor: 'rgba(0,0,0,0.06)',
                            borderColor: 'rgba(0,0,0,0.1)',
                            color: 'text.secondary',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.1)',
                              borderColor: 'rgba(0,0,0,0.15)',
                              transform: 'scale(1.05)',
                              color: 'text.primary',
                            },
                          }
                    }
                    size="small"
                  >
                    <Icon size={18} />
                  </IconButton>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Content panel */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 2.5,
            minHeight: 200,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {member.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.25 }}>
            {member.role}
          </Typography>
          {member.location && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ display: 'block', mb: 1.5 }}
            >
              {member.location}
            </Typography>
          )}
          <Box
            sx={{
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: { xs: 10, sm: 8, md: 6 },
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {member.bioParagraphs.map((paragraph, i) => (
              <Typography
                key={i}
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: i < member.bioParagraphs.length - 1 ? 1.5 : 0,
                  '&:last-of-type': { mb: 0 },
                }}
              >
                {paragraph}
              </Typography>
            ))}
          </Box>

          {/* Thin divider */}
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider',
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );
}
