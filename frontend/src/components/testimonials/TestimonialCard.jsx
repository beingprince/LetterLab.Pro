
import React from "react";
import TestimonialStars from "./TestimonialStars";
import VerifiedBadge from "./VerifiedBadge";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function TestimonialCard({ testimonial }) {
    if (!testimonial) return null;

    const { quote, name, title, company, rating, avatarUrl, verified, tag } = testimonial;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-800/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-none border border-neutral-100 dark:border-neutral-700/50 relative overflow-hidden">

                {/* Optional Tag */}
                {tag && (
                    <div className="absolute top-6 right-6 md:top-8 md:right-8 opacity-50 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                        {tag}
                    </div>
                )}

                <div className="flex flex-col items-center text-center gap-6 md:gap-8">
                    {/* Rating */}
                    <TestimonialStars rating={rating} />

                    {/* Quote */}
                    <blockquote className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-white leading-relaxed max-w-2xl">
                        &ldquo;{quote}&rdquo;
                    </blockquote>

                    {/* Author Block */}
                    <div className="flex flex-col items-center gap-3">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={name}
                                className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                            />
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600" />
                        )}

                        <div className="flex flex-col items-center gap-1">
                            <div className="font-semibold text-neutral-900 dark:text-white">
                                {name}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 flex-wrap justify-center">
                                <span>{title}</span>
                                <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                                <span>{company}</span>
                            </div>
                        </div>

                        {/* Verified Badge */}
                        {verified && (
                            <div className="mt-1">
                                <VerifiedBadge />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
