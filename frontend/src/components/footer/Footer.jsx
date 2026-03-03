
import React from "react";
import { FOOTER_CONSTANTS } from "./footer.constants";
import FooterCard from "./FooterCard";
import FooterBrandBlock from "./FooterBrandBlock";
import FooterColumns from "./FooterColumns";
import FooterBottomBar from "./FooterBottomBar";
import FooterWatermark from "./FooterWatermark";

export default function Footer() {
    return (
        <footer className={`relative w-full overflow-hidden ${FOOTER_CONSTANTS.sectionPadding}`}>

            {/* 1. Giant Faint Background Word Layer (Behind everything) */}
            <FooterWatermark />

            {/* 2. Floating Slab Card (Floats above watermark) */}
            <div className="px-4 md:px-6 relative z-10">
                <FooterCard>

                    {/* Main Grid: Brand + Links */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* Left Column: Brand & Social (Span 4) */}
                        <div className="lg:col-span-4 flex flex-col justify-start">
                            <FooterBrandBlock />
                        </div>

                        {/* Right Column: Links Grid (Span 8) */}
                        <div className="lg:col-span-8">
                            <FooterColumns />
                        </div>

                    </div>

                    {/* Bottom Bar (Inside Card) */}
                    <FooterBottomBar />

                </FooterCard>
            </div>

        </footer>
    );
}
