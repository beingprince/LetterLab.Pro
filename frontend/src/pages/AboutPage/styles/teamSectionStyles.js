/**
 * Shared styles for Team section. Theme-aware; neutral grayscale.
 */

export const SECTION = {
  py: { xs: 6, md: 10 },
  bgcolor: 'action.hover',
  position: 'relative',
  overflow: 'hidden',
};

export const CARD = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 3,
  overflow: 'hidden',
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transform: 'translateY(-2px)',
    borderColor: 'grey.400',
  },
};

export const MEDIA_ASPECT = {
  aspectRatio: '4/5',
  minHeight: 220,
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  bgcolor: 'grey.200',
};

export const LINE_ART_OVERLAY = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(128,128,128,0.06) 2px,
    rgba(128,128,128,0.06) 4px
  ), repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(128,128,128,0.06) 2px,
    rgba(128,128,128,0.06) 4px
  )`,
  pointerEvents: 'none',
  zIndex: 1,
};

export const WAVE_SVG = (theme) => {
  const fill = theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(248,250,252,0.98)';
  return {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    width: '100%',
    height: '40%',
    minHeight: 80,
    zIndex: 2,
    pointerEvents: 'none',
    fill,
  };
};

export const SOCIAL_BUTTON = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  bgcolor: 'rgba(255,255,255,0.15)',
  border: '1px solid rgba(255,255,255,0.25)',
  backdropFilter: 'blur(8px)',
  color: 'white',
  '&:hover': {
    bgcolor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease',
};

export const INITIALS_GRADIENT = {
  background: 'linear-gradient(135deg, rgba(100,116,139,0.12) 0%, rgba(71,85,105,0.08) 100%)',
};
