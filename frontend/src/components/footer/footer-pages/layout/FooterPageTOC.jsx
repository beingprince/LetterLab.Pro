import React from 'react';
import './FooterPageTOC.css';

export default function FooterPageTOC({ items, activeId, onSelect }) {
  return (
    <nav className="FooterPageTOC" aria-label="Table of contents">
      <h3 className="FooterPageTOC__title">Contents</h3>
      <ul className="FooterPageTOC__list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`FooterPageTOC__link ${activeId === item.id ? 'FooterPageTOC__link--active' : ''}`}
              onClick={(e) => {
                if (onSelect) {
                  e.preventDefault();
                  onSelect(item.id);
                }
              }}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
