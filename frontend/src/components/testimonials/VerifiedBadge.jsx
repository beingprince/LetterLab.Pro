
import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function VerifiedBadge() {
    return (
        <div className="text-green-600 dark:text-green-500" title="Verified Review">
            <CheckIcon className="w-3.5 h-3.5" />
        </div>
    );
}
