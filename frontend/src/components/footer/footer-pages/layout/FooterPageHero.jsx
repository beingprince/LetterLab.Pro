import React from 'react';
import './FooterPageHero.css';

export default function FooterPageHero({ title, lead, lastUpdated, readingTime }) {
  return (
    <header className="FooterPageHero">
      <h1 className="FooterPageHero__title">{title}</h1>
      {lead && <p className="FooterPageHero__lead">{lead}</p>}
      {(lastUpdated || readingTime) && (
        <div className="FooterPageHero__meta">
          {lastUpdated && <span>Last updated: {lastUpdated}</span>}
          {lastUpdated && readingTime && ' · '}
          {readingTime && <span>{readingTime} min read</span>}
        </div>
      )}
    </header>
  );
}
