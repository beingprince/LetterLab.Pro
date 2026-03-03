import React from 'react';
import ThreadItem from './ThreadItem';
import LoadingSpinner from '../shared/LoadingSpinner';

/**
 * ThreadList - List of search results
 */
const ThreadList = ({ threads, onSelectThread, selectedThreadId, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Searching threads...
                </p>
            </div>
        );
    }

    if (!threads || threads.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                    No threads found. Try a different search term.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                {threads.length} {threads.length === 1 ? 'Thread' : 'Threads'} Found
            </div>

            {threads.map((thread) => (
                <ThreadItem
                    key={thread.id}
                    thread={thread}
                    onClick={onSelectThread}
                    isSelected={thread.id === selectedThreadId}
                />
            ))}
        </div>
    );
};

export default ThreadList;
