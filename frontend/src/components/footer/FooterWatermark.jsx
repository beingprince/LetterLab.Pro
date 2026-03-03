
import React from "react";
import { FOOTER_CONSTANTS } from "./footer.constants";

export default function FooterWatermark() {
    return (
        <div
            className="absolute inset-x-0 bottom-0 pointer-events-none select-none z-0 overflow-hidden flex justify-center items-end"
            aria-hidden="true"
        >
            <span
                className={`
          ${FOOTER_CONSTANTS.watermark.size}
          ${FOOTER_CONSTANTS.watermark.opacity}
          font-extrabold leading-none tracking-tighter 
          text-center 
          bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-slate-500
          bg-clip-text text-transparent
          whitespace-nowrap
          transform translate-y-[25%] md:translate-y-[20%]
          blur-[1px] md:blur-[0.5px]
        `}
                style={{
                    // Adjusted mask to show more of the text (start fade higher up)
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)'
                }}
            >
                {FOOTER_CONSTANTS.watermark.text}
            </span>
        </div>
    );
}
