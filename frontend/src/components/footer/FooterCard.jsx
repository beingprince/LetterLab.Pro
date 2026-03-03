
import React from "react";
import { FOOTER_CONSTANTS } from "./footer.constants";

export default function FooterCard({ children }) {
    return (
        <div
            className={`
        relative z-10 w-full mx-auto
        ${FOOTER_CONSTANTS.maxWidth}
        ${FOOTER_CONSTANTS.card.bg}
        ${FOOTER_CONSTANTS.card.border}
        ${FOOTER_CONSTANTS.card.radius}
        ${FOOTER_CONSTANTS.card.shadow}
        ${FOOTER_CONSTANTS.card.padding}
        overflow-hidden
        transition-all duration-500 ease-out
      `}
        >
            {children}
        </div>
    );
}
