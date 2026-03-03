import React from 'react';

/**
 * SuggestionCard — Minimal navigation card.
 * Icon + Title inline. Styled by suggestion-theme.css.
 * On mobile: includes a "swipe ↓" tag sitting on the bottom border.
 */
const SuggestionCard = ({
    title,
    subtitle,
    Icon,
    onClick,
    isPopular,
    showSwipeTag = false
}) => {
    return (
        <button className="suggestion-card" onClick={onClick}>
            {isPopular && (
                <span className="suggestion-badge">Popular</span>
            )}

            <div className="suggestion-icon">
                {Icon && <Icon />}
            </div>

            <div className="suggestion-text">
                <span className="suggestion-title">{title}</span>
                <span className="suggestion-subtitle">{subtitle}</span>
            </div>

            {/* Swipe tag — sits on the bottom border, mobile only via CSS */}
            {showSwipeTag && (
                <span className="swipe-tag">
                    swipe <span className="swipe-tag-arrow">↓</span>
                </span>
            )}
        </button>
    );
};

export default SuggestionCard;
