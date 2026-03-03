import React, { useState } from 'react';
import { ContentCopy, Check } from '@mui/icons-material';

/**
 * CopyButton - Copy to clipboard with visual feedback
 */
const CopyButton = ({ text, className = '' }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`
        px-4 py-2 
        rounded-lg 
        backdrop-blur-[14px] 
        bg-white/60 
        dark:bg-gray-700/60 
        border 
        border-white/20 
        dark:border-gray-600/30 
        hover:bg-white/80 
        dark:hover:bg-gray-600/60 
        transition-all 
        flex 
        items-center 
        gap-2
        ${className}
      `}
            aria-label="Copy to clipboard"
        >
            {copied ? (
                <>
                    <Check sx={{ fontSize: 18 }} className="text-green-600" />
                    <span className="text-sm font-medium text-green-600">Copied!</span>
                </>
            ) : (
                <>
                    <ContentCopy sx={{ fontSize: 18 }} className="text-gray-600 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Copy</span>
                </>
            )}
        </button>
    );
};

export default CopyButton;
