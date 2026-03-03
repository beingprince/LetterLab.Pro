import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/**
 * ContactPickerModal
 * 
 * Search and select a contact to pull emails from.
 * Shows recent contacts and search results.
 */

const ContactPickerModal = ({ onSelectContact, provider = 'gmail' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Mock recent contacts (will be replaced with real data)
    const recentContacts = [
        {
            email: 'prof.smith@university.edu',
            name: 'Dr. John Smith',
            lastContact: '2024-02-15T10:30:00Z',
            threadCount: 5
        },
        {
            email: 'advisor@university.edu',
            name: 'Dr. Sarah Johnson',
            lastContact: '2024-02-14T14:20:00Z',
            threadCount: 3
        },
        {
            email: 'ta.assistant@university.edu',
            name: 'Mike Chen',
            lastContact: '2024-02-13T09:15:00Z',
            threadCount: 2
        }
    ];

    const handleSearch = useCallback((e) => {
        setSearchQuery(e.target.value);
        // TODO: Implement debounced search
    }, []);

    const handleSelectContact = (contact) => {
        onSelectContact(contact);
    };

    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="mb-6">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search by name or email..."
                        className="
              w-full pl-12 pr-4 py-4
              bg-white dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              rounded-xl
              text-gray-900 dark:text-white
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-all
            "
                        autoFocus
                    />
                </div>
            </div>

            {/* Recent Contacts */}
            <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 px-1">
                    Recent Contacts
                </h3>

                <div className="space-y-2">
                    {recentContacts.map((contact, index) => (
                        <motion.button
                            key={contact.email}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelectContact(contact)}
                            className="
                w-full p-4
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-xl
                hover:border-blue-300 dark:hover:border-blue-600
                hover:shadow-md
                transition-all
                text-left
                group
              "
                        >
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <PersonIcon className="text-blue-600 dark:text-blue-400" fontSize="small" />
                                </div>

                                {/* Contact Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {contact.name}
                                        </h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <AccessTimeIcon fontSize="inherit" />
                                            {formatRelativeTime(contact.lastContact)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {contact.email}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        {contact.threadCount} conversation{contact.threadCount !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Empty State (when searching with no results) */}
            {searchQuery && !isSearching && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                        No contacts found for "{searchQuery}"
                    </p>
                </div>
            )}
        </div>
    );
};

export default ContactPickerModal;
