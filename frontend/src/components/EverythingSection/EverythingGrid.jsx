
import React from "react";
import EverythingCard from "./EverythingCard";
import { cards } from "./data";

export default function EverythingGrid() {
    return (
        <div className="mt-12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-7">
            {cards.map((card, index) => (
                <EverythingCard key={card.title} card={card} index={index} />
            ))}
        </div>
    );
}
