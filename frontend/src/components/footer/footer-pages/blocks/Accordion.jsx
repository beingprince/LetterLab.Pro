import React, { useState } from 'react';
import './Accordion.css';

export default function Accordion({ items, title }) {
  return (
    <div className="FooterAccordion">
      {title && <h3 className="FooterAccordion__group-title">{title}</h3>}
      <div className="FooterAccordion__list" role="list">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            id={`accordion-${index}`}
            title={item.title}
            body={item.body}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ id, title, body, description }) {
  const [open, setOpen] = useState(false);
  const contentId = `${id}-content`;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="FooterAccordion__item" role="listitem">
      <h4>
        <button
          type="button"
          className="FooterAccordion__trigger"
          aria-expanded={open}
          aria-controls={contentId}
          id={`${id}-trigger`}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{title}</span>
          <span className="FooterAccordion__icon" aria-hidden>
            <ChevronDown reduced={prefersReducedMotion} />
          </span>
        </button>
      </h4>
      <div
        id={contentId}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="FooterAccordion__panel"
        data-open={open}
      >
        <div className="FooterAccordion__content">
          {description && <p className="FooterAccordion__description">{description}</p>}
          {Array.isArray(body) ? body.map((p, i) => <p key={i}>{p}</p>) : body}
        </div>
      </div>
    </div>
  );
}

function ChevronDown({ reduced }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
