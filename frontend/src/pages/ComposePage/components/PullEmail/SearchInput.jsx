import React, { useState } from 'react';
import { Search } from '@mui/icons-material';

/**
 * SearchInput - Search box for email threads
 * Superhuman/Gmail-style search
 */
const SearchInput = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search threads by contact, subject, or keyword..."
                    disabled={isLoading}
                    className="
            w-full 
            px-6 
            py-4
            pl-14
            text-[16px] 
            bg-white/60 
            dark:bg-gray-800/60 
            backdrop-blur-[18px] 
            border 
            border-white/20 
            dark:border-gray-700/30 
            rounded-[16px] 
            shadow-md
            focus:border-blue-300 
            dark:focus:border-blue-700 
            focus:ring-2 
            focus:ring-blue-500/20
            transition-all
            placeholder-gray-400
            dark:placeholder-gray-500
            text-gray-900
            dark:text-white
            disabled:opacity-50
          "
                />
                <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                    sx={{ fontSize: 20 }}
                />
            </div>
        </form>
    );
};

export default SearchInput;
