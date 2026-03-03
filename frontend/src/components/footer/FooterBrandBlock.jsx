
import React from "react";
import { footerSocialLinks } from "./footerData";

export default function FooterBrandBlock() {
    return (
        <div className="flex flex-col items-start gap-6 max-w-xs">
            {/* Brand / Logo Area */}
            <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                    LetterLab <span className="text-blue-500">Pro</span>
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium max-w-[240px]">
                    Crafting the future of professional communication.
                    Enterprise-grade email drafting for the modern workflow.
                </p>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3">
                {footerSocialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                        <a
                            key={social.platform}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                group flex items-center justify-center w-10 h-10 rounded-full
                border border-black/10 dark:border-white/10
                bg-transparent
                text-slate-500 dark:text-slate-400
                hover:border-slate-400 dark:hover:border-slate-500
                hover:bg-slate-50 dark:hover:bg-white/5
                hover:text-slate-900 dark:hover:text-white
                hover:-translate-y-0.5
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500/20
              "
                            aria-label={social.platform}
                        >
                            <Icon size={18} />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
