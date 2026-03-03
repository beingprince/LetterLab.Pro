import React from 'react';

const strokeProps = { strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function SparkIcon({ size = 20, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden {...strokeProps}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 16l2-6 2 6M19 16l2-6 2 6M12 18v2" />
    </svg>
  );
}

export function SliderIcon({ size = 20, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden {...strokeProps}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function StructureIcon({ size = 20, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden {...strokeProps}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 20, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden {...strokeProps}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

const PREVIEW_ICONS = {
  draft: SparkIcon,
  tone: SliderIcon,
  structure: StructureIcon,
  review: CheckCircleIcon,
};

export function getIconForPreviewType(type) {
  return PREVIEW_ICONS[type] || CheckCircleIcon;
}
