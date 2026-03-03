/**
 * LetterLab Pro - Compose Page Type Definitions
 * Industry-grade TypeScript interfaces per design brief
 */

// ============================================================================
// Core Types
// ============================================================================

export type IntentType = "draft_email" | "pull_email" | "create_subject";

export type SystemStatus = "ready" | "degraded" | "offline";

export type Provider = "gmail" | "outlook" | "local";

export type ActivityType =
    | "thread_pulled"
    | "reply_generated"
    | "draft_created"
    | "subject_generated";

// ============================================================================
// Data Models
// ============================================================================

export interface RecentActivityItem {
    id: string;
    type: ActivityType;
    provider: Provider;
    threadId?: string;
    draftId?: string;
    subject: string;
    contact?: {
        name?: string;
        email?: string;
    };
    snippet?: string;
    createdAt: string;     // ISO 8601
    lastOpenedAt?: string; // ISO 8601
}

export interface DetectedIntent {
    intent: IntentType;
    confidence: number; // 0-1
}

export interface User {
    firstName?: string;
    fullName?: string;
    email?: string;
}

export interface SystemCredits {
    remaining: number;
    total: number;
    lastRefresh?: string; // ISO 8601
}

// ============================================================================
// Component Props
// ============================================================================

export interface ComposePageFixedProps {
    user: User;
    systemStatus: SystemStatus;
    creditsRemaining: number;
    activeIntent?: IntentType;

    recentActivity: RecentActivityItem[];
    isRecentActivityLoading: boolean;

    onSubmitComposer: (args: { text: string; intent: IntentType }) => Promise<void>;
    onOpenActivity: (item: RecentActivityItem) => void;

    onSetIntent: (intent: IntentType) => void;
    onQuickActionSelect: (intent: IntentType) => void;

    // Persistence hooks
    loadRecentActivity: () => Promise<RecentActivityItem[]>;
    persistRecentActivity: (items: RecentActivityItem[]) => void;

    // Feature flags / accessibility
    reduceTransparency?: boolean;
    reduceMotion?: boolean;
}

export interface InputPillProps {
    value: string;
    onChange: (next: string) => void;

    intent: IntentType;
    detectedIntent?: DetectedIntent;
    showDetectedIntentChip?: boolean;
    onChangeIntent: (intent: IntentType) => void;

    placeholder: string;
    disabled?: boolean;
    loading?: boolean;

    onSubmit: () => void;

    size?: "desktop" | "mobile";
    autoFocus?: boolean;

    ariaLabel?: string;
}

export interface QuickActionRowProps {
    intent: IntentType;
    title: string;
    description: string;
    icon: React.ReactNode;

    onSelect: (intent: IntentType) => void;

    disabled?: boolean;
    ariaLabel: string;
}

export interface ActionChipProps {
    intent: IntentType;
    label: string;
    icon: React.ReactNode;

    onSelect: (intent: IntentType) => void;

    isActive?: boolean;
    disabled?: boolean;
}

export interface RecentActivityListProps {
    items: RecentActivityItem[];
    loading?: boolean;

    onOpen: (item: RecentActivityItem) => void;

    emptyTitle?: string;
    emptySubtitle?: string;

    maxVisible?: number;
}

export interface RecentActivityItemProps {
    item: RecentActivityItem;
    onOpen: (item: RecentActivityItem) => void;
}

export interface WelcomeBlockProps {
    firstName?: string;
    fullName?: string;
}

export interface StatusAndCreditsPillProps {
    systemStatus: SystemStatus;
    creditsRemaining: number;
    onOpenDetails?: () => void;
}

export interface DetectedIntentChipProps {
    intent: IntentType;
    onChangeIntent: (intent: IntentType) => void;
}

export interface SuggestionChipsRowProps {
    suggestions: SuggestionChip[];
    onSelect: (prompt: string) => void;
}

export interface SuggestionChip {
    id: string;
    label: string;
    prompt: string;
}

// ============================================================================
// Local Storage Schema
// ============================================================================

export interface RecentActivityStorage {
    version: 1;
    items: RecentActivityItem[];
}

export const RECENT_ACTIVITY_STORAGE_KEY = "letterlab:recentActivity:v1";
export const MAX_RECENT_ACTIVITY_ITEMS = 30;
