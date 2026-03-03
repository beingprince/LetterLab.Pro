import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", confirmColor = "bg-blue-600" }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-brand-card border border-brand-border rounded-2xl shadow-2xl overflow-hidden p-6"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-brand-dim hover:text-brand-text transition-colors">
                        <CloseIcon fontSize="small" />
                    </button>

                    <h3 className="text-xl font-heading font-bold text-brand-text mb-2">{title}</h3>
                    <p className="text-brand-dim mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-brand-dim hover:bg-brand-bg hover:text-brand-text font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`px-6 py-2 rounded-lg text-white font-bold shadow-lg transition-transform hover:scale-105 ${confirmColor}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
