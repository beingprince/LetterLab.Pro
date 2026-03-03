import React, { useState, useRef, useEffect } from 'react';
import { Edit, Email, Subject, Speed, Add } from '@mui/icons-material';

/**
 * ModeMenu - Dropdown menu for mode selection
 * Triggered by "+" button like Gemini
 */
const ModeMenu = ({ currentMode, onModeChange, onClose }) => {
    const modes = [
        {
            id: 'compose',
            label: 'Chat',
            icon: Edit,
            description: 'Write email from scratch'
        },
        {
            id: 'pull',
            label: 'Pull Email',
            icon: Email,
            description: 'Reply to existing thread'
        },
        {
            id: 'subject',
            label: 'Subject Line',
            icon: Subject,
            description: 'Generate subject ideas'
        }
    ];

    const handleSelect = (modeId) => {
        onModeChange(modeId);
        onClose();
    };

    return (
        <div className="
      absolute
      left-0 bottom-full mb-2
      w-[280px]
      backdrop-blur-[30px]
      bg-white/90
      dark:bg-gray-800/90
      border
      border-gray-200/60
      dark:border-gray-700/40
      rounded-2xl
      shadow-2xl
      shadow-black/10
      dark:shadow-black/40
      overflow-hidden
      animate-in
      fade-in
      slide-in-from-bottom-2
      duration-200
      z-50
    ">
            {/* Menu header */}
            <div className="px-4 py-3 border-b border-gray-200/40 dark:border-gray-700/30">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Select Mode
                </h3>
            </div>

            {/* Mode options */}
            <div className="py-2">
                {modes.map((mode) => {
                    const Icon = mode.icon;
                    const isActive = currentMode === mode.id;

                    return (
                        <button
                            key={mode.id}
                            onClick={() => handleSelect(mode.id)}
                            className={`
                w-full
                px-4 py-3
                flex items-start gap-3
                hover:bg-white/30
                dark:hover:bg-white/5
                transition-colors
                ${isActive ? 'bg-white/20 dark:bg-white/10' : ''}
              `}
                        >
                            {/* Icon */}
                            <Icon
                                sx={{ fontSize: 20 }}
                                className={`
                  mt-0.5
                  ${isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }
                `}
                            />

                            {/* Text */}
                            <div className="flex-1 text-left">
                                <div className={`
                  text-[14px] font-semibold
                  ${isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-900 dark:text-white'
                                    }
                `}>
                                    {mode.label}
                                </div>
                                <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                                    {mode.description}
                                </div>
                            </div>

                            {/* Active indicator */}
                            {isActive && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

/**
 * ModeSelector - "+" button with dropdown menu
 * Clean design like Gemini interface
 */
const ModeSelector = ({ currentMode, onModeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div ref={menuRef} className="relative">
            {/* Plus Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
          w-9 h-9
          rounded-xl
          flex items-center justify-center
          backdrop-blur-md
          bg-white/50
          dark:bg-gray-700/50
          border
          border-gray-200/60
          dark:border-gray-600/40
          hover:bg-gray-100/60
          dark:hover:bg-gray-600/40
          transition-all
          active:scale-95
        "
                title="Switch mode"
            >
                <Add
                    sx={{ fontSize: 20 }}
                    className={`
            text-gray-700 dark:text-gray-300 
            transition-transform duration-200
            ${isOpen ? 'rotate-45' : ''}
          `}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <ModeMenu
                    currentMode={currentMode}
                    onModeChange={onModeChange}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default ModeSelector;
