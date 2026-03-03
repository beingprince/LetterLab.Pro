import React from 'react';
import './TagRow.css';

export default function TagRow({ tags }) {
  return (
    <div className="TagRow" role="list">
      {tags.map((tag, i) => (
        <span key={i} className="TagRow__tag" role="listitem">{tag}</span>
      ))}
    </div>
  );
}
