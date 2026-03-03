
import React from "react";
import VerifiedBadge from "./VerifiedBadge";
import TestimonialStars from "./TestimonialStars";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function TestimonialQuote({ testimonial }) {
    if (!testimonial) return null;

    const { quote, name, title, company, rating, avatarUrl, verified } = testimonial;

    // Helper for initials
    const getInitials = (n) => {
        return n ? n.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <div className="flex flex-col gap-4 md:gap-6 max-w-3xl">
            {/* Quote Block */}
            <div className="relative pl-1">
                {/* Quote Icon */}
                <svg
                    className="w-6 h-6 text-neutral-200 dark:text-neutral-800 mb-3 ml-[-2px]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.63 14.932 14.207C15.586 12.75 16.591 11.238 17.947 9.67301C19.349 8.05501 20.891 6.84001 22.573 6.02801L22.573 9.02801C21.602 9.54401 20.803 10.297 20.176 11.287C19.549 12.235 19.235 13.376 19.235 14.71V21H14.017ZM3.812 21L3.812 18C3.812 16.896 4.116 15.63 4.727 14.207C5.381 12.75 6.386 11.238 7.742 9.67301C9.144 8.05501 10.686 6.84001 12.368 6.02801L12.368 9.02801C11.397 9.54401 10.598 10.297 9.971 11.287C9.344 12.235 9.03 13.376 9.03 14.71V21H3.812Z" />
                </svg>

                <p className="text-xl md:text-2xl font-medium leading-[1.6] text-neutral-900 dark:text-neutral-50 tracking-tight">
                    {quote}
                </p>
            </div>

            {/* Author + Stars Row */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-2">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="shrink-0">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={name}
                                className="w-10 h-10 rounded-full object-cover border border-neutral-100 dark:border-neutral-800"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
                                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                                    {getInitials(name)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {name}
                            </span>
                            {verified && <VerifiedBadge />}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-500 font-medium">
                            {title}, {company}
                        </div>
                    </div>
                </div>

                {/* Stars - Under meta on Mobile (via flex-col), Right side on Desktop */}
                <div className="lg:ml-4 lg:pl-4 lg:border-l lg:border-neutral-200 dark:lg:border-neutral-800">
                    <TestimonialStars rating={rating} />
                </div>
            </div>
        </div>
    );
}
