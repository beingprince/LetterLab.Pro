
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTestimonialsCarousel } from "./useTestimonialsCarousel";
import TestimonialCard from "./TestimonialCard";
import TestimonialNav from "./TestimonialNav";
import TestimonialDots from "./TestimonialDots"; // Missing import added

export default function TestimonialsCarousel({ items }) {
    const {
        activeIndex,
        count,
        next,
        prev,
        goTo,
        handlers
    } = useTestimonialsCarousel(items);

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-12 text-neutral-500">
                No testimonials available.
            </div>
        );
    }

    return (
        <div
            className="relative w-full px-4 md:px-12 py-4"
            {...handlers} // Bind mouse/touch/keyboard handlers
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            tabIndex={0} // Make focusable for keyboard
        >
            <div className="relative max-w-5xl mx-auto">
                {/* Navigation (Desktop) */}
                <TestimonialNav
                    onPrev={prev}
                    onNext={next}
                    disabled={count <= 1}
                />

                {/* Card Container */}
                <div className="overflow-hidden min-h-[400px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full"
                        >
                            <TestimonialCard testimonial={items[activeIndex]} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Dots (Mobile + Desktop) */}
                <TestimonialDots
                    count={count}
                    activeIndex={activeIndex}
                    onGoTo={goTo} // Dots use separate component
                />
            </div>
        </div>
    );
}
