import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SuggestionCard from './SuggestionCard';
import { SUGGESTIONS, STORAGE_KEY } from './constants';
import './suggestion-theme.css';

/**
 * SuggestionBox
 * Desktop: 3-column grid.
 * Mobile: 1 card, swipe down/up within this area to cycle.
 * Touch events are ONLY captured within this component, not globally.
 */
const SuggestionBox = ({ onSelect }) => {
    const [counts, setCounts] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const touchStartRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setCounts(JSON.parse(stored));
        } catch (e) { /* fallback */ }
    }, []);

    // Touch handlers — only prevent scroll DURING active vertical swipe
    useEffect(() => {
        if (!isMobile) return;
        const el = containerRef.current;
        if (!el) return;

        const onStart = (e) => {
            touchStartRef.current = {
                y: e.touches[0].clientY,
                x: e.touches[0].clientX
            };
        };

        const onMove = (e) => {
            if (!touchStartRef.current) return;

            const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
            const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);

            // Only prevent scroll if this is clearly a vertical swipe (not horizontal or tap)
            if (deltaY > 15 && deltaY > deltaX) {
                e.preventDefault();
            }
        };

        const onEnd = (e) => {
            if (!touchStartRef.current) return;
            const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

            if (deltaY > 30) {
                // Swipe down → next
                setActiveIndex(prev => (prev + 1) % SUGGESTIONS.length);
            } else if (deltaY < -30) {
                // Swipe up → previous
                setActiveIndex(prev => (prev - 1 + SUGGESTIONS.length) % SUGGESTIONS.length);
            }
            touchStartRef.current = null;
        };

        el.addEventListener('touchstart', onStart, { passive: true });
        el.addEventListener('touchmove', onMove, { passive: false });
        el.addEventListener('touchend', onEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', onStart);
            el.removeEventListener('touchmove', onMove);
            el.removeEventListener('touchend', onEnd);
        };
    }, [isMobile]);

    const popularId = Object.keys(counts).reduce((a, b) =>
        (counts[a] || 0) > (counts[b] || 0) ? a : b, null
    );

    const handleSelect = (suggestion) => {
        const newCounts = {
            ...counts,
            [suggestion.id]: (counts[suggestion.id] || 0) + 1
        };
        setCounts(newCounts);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newCounts));
        } catch (e) { /* privacy mode */ }
        onSelect(suggestion.prompt);
    };

    const activeSuggestion = SUGGESTIONS[activeIndex];

    return (
        <div
            ref={containerRef}
            className="suggestion-area"
        >
            <p className="suggestion-label">Suggestions for you</p>

            {/* Desktop: 3-col grid */}
            {!isMobile && (
                <div className="suggestion-grid">
                    {SUGGESTIONS.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.25 }}
                        >
                            <SuggestionCard
                                title={s.title}
                                subtitle={s.subtitle}
                                Icon={s.icon}
                                isPopular={popularId ? popularId === s.id : i === 0}
                                onClick={() => handleSelect(s)}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Mobile: 1 card, swipe to cycle */}
            {isMobile && (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSuggestion.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                    >
                        <SuggestionCard
                            title={activeSuggestion.title}
                            subtitle={activeSuggestion.subtitle}
                            Icon={activeSuggestion.icon}
                            isPopular={popularId ? popularId === activeSuggestion.id : activeIndex === 0}
                            onClick={() => handleSelect(activeSuggestion)}
                            showSwipeTag={true}
                        />
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default SuggestionBox;
