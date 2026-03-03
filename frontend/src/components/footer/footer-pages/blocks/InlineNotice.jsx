import React from 'react';
import './InlineNotice.css';

export default function InlineNotice({ body }) {
  const text = Array.isArray(body) ? body.join(' ') : body;
  return (
    <div className="InlineNotice" role="status">
      <p className="InlineNotice__text">{text}</p>
    </div>
  );
}
