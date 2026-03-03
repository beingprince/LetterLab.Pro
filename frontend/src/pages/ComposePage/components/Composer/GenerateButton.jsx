import React from 'react';
import { AutoAwesome } from '@mui/icons-material';
import LoadingSpinner from '../shared/LoadingSpinner';

/**
 * GenerateButton - Action button for email generation
 * Clean, modern design
 */
const GenerateButton = ({ onClick, isLoading = false, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="
        px-5 py-2.5
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        active:scale-[0.98]
        disabled:bg-gray-300
        dark:disabled:bg-gray-700
        disabled:cursor-not-allowed
        text-white
        font-semibold
        text-[14px]
        flex
        items-center
        gap-2
        shadow-lg
        shadow-blue-600/25
        transition-all
        duration-200
      "
        >
            {isLoading ? (
                <>
                    <LoadingSpinner size="sm" className="border-white border-t-transparent" />
                    <span>Generating...</span>
                </>
            ) : (
                <>
                    <AutoAwesome sx={{ fontSize: 18 }} />
                    <span>Generate</span>
                </>
            )}
        </button>
    );
};

export default GenerateButton;
