import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Close, Person, Search, Add } from '@mui/icons-material';
import { apiRequest } from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ProfessorSelectorModal
 * Uses React Portal to render outside the sticky footer, ensuring it covers the whole screen.
 */

export default function ProfessorSelectorModal({ open, onClose, onSelect }) {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // Fetch on open
    useEffect(() => {
        if (open) {
            setLoading(true);
            apiRequest('/api/professors')
                .then((data) => setProfessors(Array.isArray(data) ? data : []))
                .catch(() => setProfessors([]))
                .finally(() => setLoading(false));
        }
    }, [open]);

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose?.(); };
        if (open) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open, onClose]);

    const filtered = professors.filter((p) => {
        const q = search.toLowerCase();
        return (
            p.name?.toLowerCase().includes(q) ||
            p.email?.toLowerCase().includes(q) ||
            p.department?.toLowerCase().includes(q)
        );
    });

    // Portal content to document.body
    return ReactDOM.createPortal(
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop - High Z-index to cover footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Container - Centered */}
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            className="
                                pointer-events-auto
                                w-full max-w-md 
                                max-h-[85vh] 
                                flex flex-col 
                                rounded-3xl
                                shadow-2xl
                                overflow-hidden
                                border border-white/20 dark:border-gray-700/30
                                bg-white/90 dark:bg-[#0f1115]/95
                                backdrop-blur-xl
                            "
                        >
                            {/* Header with Gradient Text */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100/50 dark:border-gray-800/50">
                                <div>
                                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 dark:from-white dark:to-gray-300">
                                        Select Professor
                                    </h2>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                        Who is this email for?
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="
                                        w-8 h-8 rounded-full 
                                        flex items-center justify-center 
                                        bg-gray-100 hover:bg-gray-200 
                                        dark:bg-white/5 dark:hover:bg-white/10 
                                        text-gray-500 dark:text-gray-400 
                                        transition-colors
                                    "
                                >
                                    <Close sx={{ fontSize: 18 }} />
                                </button>
                            </div>

                            {/* Search Bar - Floating Style */}
                            <div className="px-6 py-4">
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search sx={{ fontSize: 20, color: '#9ca3af' }} />
                                    </div>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name, email, or dept..."
                                        className="
                                            w-full pl-10 pr-4 py-3
                                            bg-gray-50 dark:bg-black/20
                                            border border-gray-200 dark:border-white/10
                                            rounded-xl
                                            text-sm text-gray-900 dark:text-gray-100
                                            placeholder-gray-400 dark:placeholder-gray-500
                                            outline-none
                                            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
                                            transition-all
                                        "
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Professor List */}
                            <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
                                        <span className="text-sm">Loading professors...</span>
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300 dark:text-gray-600">
                                            <Person sx={{ fontSize: 32 }} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {search ? 'No matches found' : 'No professors yet'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {search ? "Try a different search term" : "Add a professor to get started"}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => window.location.href = '/add-professor'}
                                            className="
                                                mt-2 px-5 py-2.5 
                                                rounded-xl 
                                                bg-gray-900 hover:bg-black 
                                                dark:bg-white dark:hover:bg-gray-100
                                                text-white dark:text-gray-900 
                                                text-sm font-semibold
                                                shadow-lg shadow-gray-500/20 
                                                transition-all active:scale-95
                                                flex items-center gap-2
                                            "
                                        >
                                            <Add sx={{ fontSize: 18 }} />
                                            Add New Professor
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filtered.map((prof) => (
                                            <button
                                                key={prof._id || prof.email}
                                                onClick={() => onSelect?.(prof)}
                                                style={{ backgroundImage: 'none', boxShadow: 'none' }}
                                                className="
                                                    w-full text-left
                                                    flex items-center gap-3.5 
                                                    p-3 rounded-xl
                                                    bg-white dark:bg-white/5
                                                    shadow-sm hover:shadow-md
                                                    hover:bg-gray-50 dark:hover:bg-white/10
                                                    transition-all duration-200 group
                                                    border-0
                                                "
                                            >
                                                {/* Avatar */}
                                                <div
                                                    className="
                                                        flex-shrink-0 w-10 h-10 
                                                        rounded-lg 
                                                        bg-white dark:bg-white/10
                                                        border border-gray-100 dark:border-white/5
                                                        flex items-center justify-center 
                                                        text-blue-600 dark:text-blue-400 font-bold text-lg
                                                        shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all
                                                    "
                                                >
                                                    {prof.name?.charAt(0)?.toUpperCase()}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                            {prof.name}
                                                        </h4>
                                                        {prof.university && (
                                                            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">
                                                                {prof.university.split(' ')[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <span className="truncate">{prof.email}</span>
                                                        {prof.department && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                                <span className="truncate opacity-75">{prof.department}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-3 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100/50 dark:border-white/5 flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                <span>{professors.length} professors stored</span>
                                <div>
                                    Press <kbd className="font-sans px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 mx-1">ESC</kbd> to close
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
