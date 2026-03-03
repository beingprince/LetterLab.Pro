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
                flex items-center gap-4 py-3 px-4
                cursor-pointer transition-colors
                border-b border-gray-100 dark:border-gray-800
                hover:bg-gray-50 dark:hover:bg-gray-800/50
                ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
            `}
        >
            {/* Unread dot / Selection Indicator */}
            <div className={`
                w-2 h-2 rounded-full flex-shrink-0
                ${isUnread ? 'bg-blue-600' : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}
            `} />

            {/* From & Count */}
            <div className="w-48 flex-shrink-0 flex items-center gap-2">
                <span className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                    {thread.from || thread.participants?.[0] || 'Unknown'}
                </span>
                {thread.messageCount > 1 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md">
                        {thread.messageCount}
                    </span>
                )}
            </div>

            {/* Subject & Snippet */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className={`text-sm truncate max-w-[200px] ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-900 dark:text-gray-200'}`}>
                    {thread.subject}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500 truncate flex-1">
                    - {thread.snippet}
                </span>
            </div>

            {/* Date */}
            <div className="flex-shrink-0 text-xs text-gray-400 font-medium tabular-nums text-right w-20">
                {formatDate(thread.lastMessageDate || thread.date)}
            </div>

        </div>
    );
};

export default ThreadItem;
