import React from 'react';

/**
 * SubjectInput - Micro input for email subject
 * Separate from main prompt for better UX
 */
const SubjectInput = ({ value, onChange, placeholder = "Subject (optional)" }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="
        w-full
        px-4 py-2.5
        text-[15px] font-medium
        bg-white/40
        dark:bg-gray-800/40
        backdrop-blur-md
        border
        border-gray-200/60
        dark:border-gray-700/40
        rounded-xl
        focus:outline-none
        focus:border-blue-400
        dark:focus:border-blue-500
        focus:ring-2
        focus:ring-blue-500/20
        transition-all
        placeholder-gray-400
        dark:placeholder-gray-500
        text-gray-900
        dark:text-white
      "
        />
    );
};

export default SubjectInput;
