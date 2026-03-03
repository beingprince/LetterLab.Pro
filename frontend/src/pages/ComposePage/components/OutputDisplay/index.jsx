import React from 'react';
import { Refresh } from '@mui/icons-material';
import GlassCard from '../shared/GlassCard';
import CopyButton from '../shared/CopyButton';

/**
 * OutputDisplay - Shows generated email
 * Subject + Body + Actions (Copy, Regenerate)
 */
const OutputDisplay = ({ email, onRegenerate, isRegenerating = false }) => {
    if (!email) return null;

    const fullText = `Subject: ${email.subject}\n\n${email.body}`;

    return (
        <GlassCard className="w-full max-w-4xl mx-auto mt-6">
            {/* Subject Line */}
            <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Subject
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {email.subject}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-4" />

            {/* Email Body */}
            <div className="mb-6">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Message
                </div>
                <div className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                    {email.body}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/20 dark:border-gray-700/30">
                <CopyButton text={fullText} />

                <button
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    className="
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
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
                    aria-label="Regenerate email"
                >
                    <Refresh
                        sx={{ fontSize: 18 }}
                        className={`text-gray-600 dark:text-gray-300 ${isRegenerating ? 'animate-spin' : ''}`}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                    </span>
                </button>
            </div>
        </GlassCard>
    );
};

export default OutputDisplay;
