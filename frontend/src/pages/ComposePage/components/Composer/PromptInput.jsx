import React from 'react';

/**
 * PromptInput - Main textarea for email description
 * ChatGPT/Claude style clean design
 */
const PromptInput = ({
    value,
    onChange,
    onKeyDown,
    placeholder = "Describe what you want to write...",
    disabled = false
}) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={2}
            className="
        w-full
        px-4 py-2.5
        text-[14px]
        bg-transparent
        border-0
        focus:outline-none
        resize-none
        placeholder-gray-400
        dark:placeholder-gray-500
        text-gray-900
        dark:text-white
        disabled:opacity-50
      "
        />
    );
};

export default PromptInput;
