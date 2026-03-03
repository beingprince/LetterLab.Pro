/**
 * Shared style constants for Team section.
 * Theme-aware; use with MUI sx or Box.
 */

export const SECTION_PADDING = {
  py: { xs: 6, md: 10 },
};

export const CARD_BASE = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 2,
  overflow: 'hidden',
  border: '1px solid',
  borderColor: 'divider',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: 2,
    transform: 'translateY(-2px)',
  },
};

export const MEDIA_ASPECT = {
  aspectRatio: '4/5',
  minHeight: 200,
  width: '100%',
  position: 'relative',
};

export const INITIALS_GRADIENT = {
  background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.12) 0%, rgba(71, 85, 105, 0.08) 100%)',
};
