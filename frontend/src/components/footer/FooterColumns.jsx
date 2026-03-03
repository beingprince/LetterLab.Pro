
import React from "react";
import { footerColumnLinks } from "./footerData";

export default function FooterColumns() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 md:gap-x-12 w-full">
            {footerColumnLinks.map((group) => (
                <div key={group.title} className="flex flex-col">
                    <h4 className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500 dark:text-slate-500 mb-5 md:mb-6">
                        {group.title}
                    </h4>
                    <ul className="flex flex-col gap-3">
                        {group.links.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className="
                    text-[14px] font-medium
                    text-slate-500 dark:text-slate-400
                    hover:text-blue-600 dark:hover:text-blue-400
                    transition-colors duration-200
                  "
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
