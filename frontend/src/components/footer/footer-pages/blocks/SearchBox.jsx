import React, { useState, useCallback } from 'react';
import './SearchBox.css';

export default function SearchBox({ placeholder = 'Search help articles…', onFilter }) {
  const [value, setValue] = useState('');
  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      setValue(v);
      onFilter?.(v);
    },
    [onFilter]
  );
  return (
    <div className="SearchBox">
      <label htmlFor="footer-search" className="SearchBox__label">
        Search
      </label>
      <input
        id="footer-search"
        type="search"
        className="SearchBox__input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label="Search help articles"
        autoComplete="off"
      />
    </div>
  );
}
