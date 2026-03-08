import React from 'react';
import { Email, CalendarToday } from '@mui/icons-material';

/**
 * ThreadItem - Individual thread in search results
 */
const ThreadItem = ({ thread, onClick, isSelected }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const isUnread = thread.unread;

    return (
        <div
            onClick={() => onClick(thread)}
            className={`
                group
                flex items-start gap-3 py-3 px-4
                cursor-pointer transition-colors
                border-b border-gray-100 dark:border-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-800/50
                ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
            `}
        >
            {/* Selection Indicator / Unread Dot */}
            <div className={`
                w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                ${isUnread ? 'bg-blue-600' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}
            `} />

            {/* Content Container */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                {/* Line 1: Subject & Mobile Date */}
                <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm truncate sm:overflow-visible sm:whitespace-normal ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-900 dark:text-gray-100'}`}>
                        {thread.subject}
                    </span>
                    <span className="sm:hidden flex-shrink-0 text-[10px] text-gray-400 font-medium tabular-nums mt-0.5">
                        {formatDate(thread.lastMessageDate || thread.date)}
                    </span>
                </div>

                {/* Line 2: Meta (From, Count, Snippet on Desktop) */}
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-1.5 min-w-0 sm:w-48 sm:flex-shrink-0">
                        <span className={`text-xs sm:text-sm truncate ${isUnread ? 'font-semibold text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {(thread.from || thread.participants?.[0] || 'Unknown').split('<')[0].trim().replace(/"/g, '')}
                        </span>
                        {thread.messageCount > 1 && (
                            <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                                {thread.messageCount}
                            </span>
                        )}
                    </div>

                    {/* Desktop Snippet */}
                    <span className="hidden sm:block text-sm text-gray-400 dark:text-gray-500 truncate flex-1">
                        - {thread.snippet}
                    </span>
                </div>
            </div>

            {/* Desktop Date */}
            <div className="hidden sm:block flex-shrink-0 text-xs text-gray-400 font-medium tabular-nums text-right w-20 mt-1">
                {formatDate(thread.lastMessageDate || thread.date)}
            </div>
        </div>
    );
};

export default ThreadItem;
