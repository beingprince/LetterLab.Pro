import React from 'react';
import GlassCard from '../shared/GlassCard';
import { Person, Schedule } from '@mui/icons-material';

/**
 * ThreadPreview - Full thread conversation view
 */
const ThreadPreview = ({ thread, messages }) => {
    if (!thread) return null;

    return (
        <GlassCard className="w-full">
            {/* Thread Header */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {thread.subject}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Person sx={{ fontSize: 16 }} />
                        {thread.from}
                    </div>
                    <div className="flex items-center gap-1">
                        <Schedule sx={{ fontSize: 16 }} />
                        {new Date(thread.date).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-4" />

            {/* Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {messages && messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`
                p-4 rounded-lg
                ${message.isFromUser
                                    ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                                    : 'bg-gray-50 dark:bg-gray-800/50 mr-8'
                                }
              `}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {message.from}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(message.date).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                                {message.body}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                        {thread.snippet}
                    </div>
                )}
            </div>
        </GlassCard>
    );
};

export default ThreadPreview;
