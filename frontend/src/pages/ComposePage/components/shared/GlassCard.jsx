import React from 'react';

/**
 * GlassCard - Reusable glassmorphism card component
 * Ensures consistent glass styling across all components
 */
const GlassCard = ({
    children,
    className = '',
    onClick,
    padding = 'p-6'
}) => {
    return (
        <div
            className={`
        backdrop-blur-[18px] 
        bg-white/60 
        dark:bg-gray-800/60 
        border 
        border-white/20 
        dark:border-gray-700/30 
        rounded-[20px] 
        shadow-lg 
        ${padding}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default GlassCard;
