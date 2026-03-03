
import React from "react";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";

export default function TestimonialStars({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-brand-primary/90 dark:text-brand-primary">
                    {star <= rating ? (
                        <StarIconSolid className="w-4 h-4" />
                    ) : (
                        <StarIconOutline className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
                    )}
                </span>
            ))}
        </div>
    );
}
