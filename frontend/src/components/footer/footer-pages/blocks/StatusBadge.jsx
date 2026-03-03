import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({ status, updatedAt, href = '/status' }) {
  const state = status?.overall || 'operational';
  const label =
    state === 'operational'
      ? 'All systems normal'
      : state === 'degraded'
        ? 'Partial disruption'
        : 'Major outage';
  const variant = state === 'operational' ? 'ok' : state === 'degraded' ? 'warn' : 'error';

  return (
    <a
      href={href}
      className={`StatusBadge StatusBadge--${variant}`}
      aria-label={`System status: ${label}. View status page.`}
    >
      <span className="StatusBadge__dot" aria-hidden />
      <span className="StatusBadge__label">{label}</span>
    </a>
  );
}
