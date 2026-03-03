
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function TestimonialNav({ onPrev, onNext, disabled }) {
    // STRICT MATH-BASED CENTERING
    // w-12 h-12 fixed square
    // flex items-center justify-center
    // icon: block w-5 h-5

    const btnClass = `
    inline-flex items-center justify-center
    w-12 h-12 rounded-full
    bg-white/70 backdrop-blur-md
    border border-black/10 dark:border-white/10
    shadow-[0_10px_30px_rgba(15,23,42,0.10)]
    text-slate-600 dark:text-slate-400
    hover:border-slate-300 dark:hover:border-slate-600
    hover:bg-white dark:hover:bg-white/10
    hover:-translate-y-0.5
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
  `;

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={onPrev}
                disabled={disabled}
                className={btnClass}
                aria-label="Previous testimonial"
            >
                <ChevronLeftIcon className="w-5 h-5 block" strokeWidth={1.5} />
            </button>

            <button
                onClick={onNext}
                disabled={disabled}
                className={btnClass}
                aria-label="Next testimonial"
            >
                <ChevronRightIcon className="w-5 h-5 block" strokeWidth={1.5} />
            </button>
        </div>
    );
}
