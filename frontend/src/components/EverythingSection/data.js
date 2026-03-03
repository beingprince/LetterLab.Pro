
import {
    Square3Stack3DIcon,
    FunnelIcon,
    PencilSquareIcon
} from "@heroicons/react/24/outline";

export const workflowSteps = [
    {
        id: "context",
        step: "01",
        title: "Context Intelligence",
        icon: Square3Stack3DIcon,
        summary: "Securely maps full thread history and metadata via OAuth 2.0, instantly retrieving participant context without permanent storage or manual forwarding.",
        // Enterprise detail for the visual panel
        benefits: [
            "OAuth 2.0 authorized retrieval",
            "Metadata & participant mapping",
            "Zero-retention processing",
        ],
        scenario: "Instant analysis of multi-reply threads.",
        label: "Enterprise-Ready Retrieval",
    },
    {
        id: "signal",
        step: "02",
        title: "Signal Extraction",
        icon: FunnelIcon,
        summary: "Filters noise using advanced NLP to isolate critical action items, sentiment, and deadlines from lengthy unstructured email chains.",
        benefits: [
            "Noise cancellation algorithms",
            "Sentiment & intent detection",
            "Structured bullet synthesis",
        ],
        scenario: "Turns 5-paragraph emails into 3 actionable points.",
        label: "Advanced NLP Processing",
    },
    {
        id: "response",
        step: "03",
        title: "Adaptive Response",
        icon: PencilSquareIcon,
        summary: "Generates context-aware, professionally toned drafts ready for one-click refinement, ensuring every reply feels personally crafted and precise.",
        benefits: [
            "Tone-matching engine",
            "One-click refinement",
            "Deep-link integration",
        ],
        scenario: "Drafts a polite decline or detailed approval.",
        label: "Context-Aware Generation",
    },
];
