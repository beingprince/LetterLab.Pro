
import React from "react";
import { footerLegalLinks } from "./footerData";
import FooterStatusBadge from "./FooterStatusBadge";

export default function FooterBottomBar() {
    const currentYear = new Date().getFullYear();

    return (
        <div className="
      mt-12 md:mt-16 pt-8 md:pt-10 
      border-t border-black/5 dark:border-white/5 
      flex flex-col md:flex-row justify-between items-center gap-6 
      text-xs font-medium text-slate-500 dark:text-slate-500
    ">

            {/* Zone 1: Copyright (Left) */}
            <div className="text-center md:text-left w-full md:w-auto order-2 md:order-1">
                &copy; {currentYear} LetterLab Pro. All rights reserved. <span className="opacity-50 text-[12px]">· vNext</span>
            </div>

            {/* Zone 2: Legal Links (Center) */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 order-3 md:order-2">
                {footerLegalLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        className="hover:text-slate-800 dark:hover:text-white transition-colors"
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            {/* Zone 3: System Status (Right) */}
            <div className="flex items-center justify-center md:justify-end w-full md:w-auto order-1 md:order-3">
                <FooterStatusBadge />
            </div>
        </div>
    );
}
