import React from 'react';
import { Box } from '@mui/material';
import { Github, Linkedin, Globe } from 'lucide-react';

const ICON_MAP = {
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
};

/**
 * Link icons row. Renders only when href exists.
 */
export default function TeamMemberLinks({ links }) {
  const valid = links?.filter((l) => l.href) ?? [];
  if (valid.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        mt: 'auto',
        pt: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {valid.map((link) => {
        const Icon = ICON_MAP[link.icon] ?? Globe;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': { transform: 'scale(1.05)' },
                transition: 'transform 0.2s',
              }}
            >
              <Icon size={18} />
            </Box>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{link.label}</span>
          </a>
        );
      })}
    </Box>
  );
}
