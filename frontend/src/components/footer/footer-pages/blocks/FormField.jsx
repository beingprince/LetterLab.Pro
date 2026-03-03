import React from 'react';
import './FormField.css';

export default function FormField({ id, name, label, type = 'text', required, options, value, onChange, error, minLength }) {
  const inputId = id || `form-${name}`;
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';

  return (
    <div className="FormField">
      <label htmlFor={inputId} className="FormField__label">
        {label}
        {required && <span className="FormField__required" aria-hidden> *</span>}
      </label>
      {isSelect && (
        <select
          id={inputId}
          name={name}
          className="FormField__input FormField__select"
          required={required}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        >
          <option value="">Select…</option>
          {options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {isTextarea && (
        <textarea
          id={inputId}
          name={name}
          className="FormField__input FormField__textarea"
          required={required}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          rows={4}
        />
      )}
      {!isSelect && !isTextarea && (
        <input
          id={inputId}
          name={name}
          type={type}
          className="FormField__input"
          required={required}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${inputId}-error`} className="FormField__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
