import React from 'react';

export default function FeatureBullet({ children, icon: Icon }) {
  return (
    <li className="FeatureBullet">
      {Icon && (
        <span className="FeatureBullet__icon" aria-hidden>
          <Icon />
        </span>
      )}
      <span className="FeatureBullet__text">{children}</span>
    </li>
  );
}
