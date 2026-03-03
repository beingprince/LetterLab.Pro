import React from 'react';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThreadItem from './ThreadItem';

/**
 * ThreadListPanel
 * 
 * Displays list of email threads for selected contact.
 * User selects a thread to analyze and generate reply.
 */

const ThreadListPanel = ({ threads = [], onSelectThread, selectedProfessor }) => {
    // ... helper formatRelativeTime same as before ...
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const displayThreads = threads;

    return (
        <div className="w-full flex-1 flex flex-col h-full min-h-0">
            {/* Sidebar / Header Context (Minimal) */}
            {selectedProfessor && (
                <div className="mb-2 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900 dark:text-gray-200">Inbox</span>
                        <span>/</span>
                        <span>{selectedProfessor.email}</span>
                    </div>
                </div>
            )}

            {/* Compact Thread List */}
            <div className="flex-1 overflow-y-auto px-2">
                <div className="flex flex-col">
                    {displayThreads.map((thread, index) => (
                        <ThreadItem
                            key={thread.id}
                            thread={thread}
                            onClick={onSelectThread}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {displayThreads.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <EmailIcon sx={{ fontSize: 48, opacity: 0.2 }} className="mb-4" />
                    <p className="text-sm">No threads found</p>
                </div>
            )}
        </div>
    );
};

export default ThreadListPanel;
