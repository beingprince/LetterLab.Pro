
import {
    Square3Stack3DIcon,
    FunnelIcon,
    PencilSquareIcon
} from "@heroicons/react/24/outline";

export const workflowSteps = [
    {
        id: "context",
        step: "01",
        title: "Understand the thread",
        icon: Square3Stack3DIcon,
        summary: "LetterLab securely reads the full conversation and maps participants, history, and context without storing your emails.",
        benefits: [
            "OAuth-secured email retrieval",
            "Participant and message mapping",
            "Zero-retention processing",
        ],
        scenario: "Instant context from multi-reply threads.",
        label: "SECURE CONTEXT MAPPING",
    },
    {
        id: "signal",
        step: "02",
        title: "Find what matters",
        icon: FunnelIcon,
        summary: "LetterLab scans long threads and extracts deadlines, action items, and key points automatically.",
        benefits: [
            "Deadlines and urgency detected",
            "Action items clearly identified",
            "Important points summarized instantly",
        ],
        scenario: "Key insights from messy conversations.",
        label: "SMART SIGNAL EXTRACTION",
    },
    {
        id: "response",
        step: "03",
        title: "Write the reply",
        icon: PencilSquareIcon,
        summary: "Give a short instruction and LetterLab drafts a complete, professional email tailored to the conversation.",
        benefits: [
            "Context-aware email drafting",
            "Tone matched to conversation",
            "Ready-to-send professional response",
        ],
        scenario: "From intent to polished reply.",
        label: "ADAPTIVE RESPONSE ENGINE",
    },
];
