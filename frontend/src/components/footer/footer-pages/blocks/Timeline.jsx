import React from 'react';
import './Timeline.css';

export default function Timeline({ items }) {
  return (
    <ol className="FooterTimeline" role="list">
      {items.map((item, i) => (
        <li key={i} className="FooterTimeline__item">
          <div className="FooterTimeline__marker" aria-hidden>
            <span className="FooterTimeline__dot" />
          </div>
          <div className="FooterTimeline__content">
            {item.version && <span className="FooterTimeline__version">{item.version}</span>}
            {item.date && <time className="FooterTimeline__date">{item.date}</time>}
            {item.title && <h3 className="FooterTimeline__title">{item.title}</h3>}
            {item.summary && <p className="FooterTimeline__summary">{item.summary}</p>}
            {item.body && <p className="FooterTimeline__body">{item.body}</p>}
            {item.details && item.details.length > 0 && (
              <ul className="FooterTimeline__details">
                {item.details.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
