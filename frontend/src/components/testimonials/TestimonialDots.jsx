
import React from "react";

export default function TestimonialDots({ count, activeIndex, onGoTo }) {
    if (count <= 1) return null;

    return (
        <div className="inline-flex items-center gap-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    onClick={() => onGoTo(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onGoTo(i);
                        }
                    }}
                    className={`
                        rounded-full transition-all duration-200 cursor-pointer
                        ${i === activeIndex
                            ? "w-2.5 h-2.5 bg-[#245BFF]" // Active: Primary blue
                            : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600"} // Inactive: Neutral gray
                    `}
                />
            ))}
        </div>
    );
}
