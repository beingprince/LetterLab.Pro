import React from 'react';
import './FooterPageSection.css';

export default function FooterPageSection({ id, title, children, className = '', alternate }) {
  return (
    <section
      id={id || undefined}
      className={`FooterPageSection ${alternate ? 'FooterPageSection--alt' : ''} ${className}`}
      aria-labelledby={title ? `${id || 'section'}-heading` : undefined}
    >
      <div className="FooterPageSection__inner">
        {title && (
          <h2 id={`${id || 'section'}-heading`} className="FooterPageSection__title">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
