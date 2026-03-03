# Design Document: Suggestion Box Feature

## Overview
A "Quick Action" shelf located below the main header on the `ComposePage`. It provides users with one-click templates for common email scenarios (Research, Office Hours, Rec Letters).

## Requirements
1.  **Layout**: 3-Column Grid (Responsive).
2.  **Visuals**: Minimal glassmorphism, small SVG icons, clear text hierarchy (Title + Subtitle).
3.  **Functionality**: Clicking a card pre-fills the composer input with a structured prompt.
4.  **Intelligence**: One card must be highlighted or prioritized based on "High Frequency" usage.

## Wireframe

```
[ Header: "Good morning, Prince" ]
[ Subheader: "What's the agenda today?" ]

+-------------------------------------------------------+
|  [ GAP ]                                              |
+-------------------------------------------------------+

+--------------------+  +--------------------+  +--------------------+
|  [MICRO] Research  |  |  [CAL] Office Hrs  |  |  [DOC] Rec Letter  |
|  Join a lab        |  |  Request meeting   |  |  Grad school app   |
+--------------------+  +--------------------+  +--------------------+

+-------------------------------------------------------+
|  [ GAP ]                                              |
+-------------------------------------------------------+

[ Composer Input Pill (Fixed Bottom) ]
```

## Component Architecture

### 1. `SuggestionBox/index.jsx` (Container)
- **Props**: `onSelect(prompt)`
- **State**: `usageData` (from localStorage)
- **Logic**:
  - Loads usage stats on mount.
  - Sorts suggestions: Puts "Most Used" first (or highlights it).
  - Renders grid of `SuggestionCard`s.

### 2. `SuggestionBox/SuggestionCard.jsx` (Component)
- **Props**: `title`, `subtitle`, `icon`, `onClick`, `isPopular`
- **Visuals**:
  - `backdrop-blur-md bg-white/50 dark:bg-white/5`
  - Hover: `scale-105 shadow-lg`
  - Active: `scale-95`
  - **Popular Badge**: If `isPopular` is true, show a small "🔥" or "Recommended" badge.

### 3. `SuggestionBox/constants.js` (Data)
Defining the source of truth for templates.

```javascript
export const SUGGESTIONS = [
  {
    id: 'research',
    title: 'Research Inquiry',
    subtitle: 'Join a research lab',
    icon: 'microscope', // Lucide/MUI icon name
    prompt: "Draft a professional email to Professor [Name] expressing strong interest in joining their research lab. Mention I have read their recent paper on [Topic]..."
  },
  {
    id: 'office_hours',
    title: 'Office Hours',
    subtitle: 'Schedule a meeting',
    icon: 'calendar',
    prompt: "Draft an email to Professor [Name] requesting a meeting during office hours to discuss [Topic]..."
  },
  {
    id: 'rec_letter',
    title: 'Rec Letter',
    subtitle: 'Ask for recommendation',
    icon: 'file-signature',
    prompt: "Draft an email to Professor [Name] asking for a letter of recommendation for [Program/Job]..."
  }
];
```

## Frequency Logic (The "Smart" Feature)
To fulfill the requirement: *"one of the cards should have to able to show as per the user high frequency"*.

1.  **Storage**: Use `localStorage.setItem('suggestion_stats', JSON.stringify({ research: 5, office_hours: 2 }))`.
2.  **Algorithm**:
    - On load, read `suggestion_stats`.
    - Find `id` with max count.
    - Pass `isPopular={true}` to that card.
3.  **Update**:
    - On click, increment count for that `id`.
    - Save to `localStorage`.

## UI/UX Details
- **Icons**: Use `lucide-react` or `@mui/icons-material` (Size: 20px, subtle color).
- **Typography**:
  - Title: `font-semibold text-sm` (Graphite/White).
  - Subtitle: `text-xs text-gray-500` (Truncated).
- **Animation**: Staggered entry (Framer Motion) for a premium feel.

## Responsive Strategy (Viewport Analysis)

User Goal: *Ensure readability on phones without pushing the Composer input too far down.*

### Option A: Vertical Stack (Standard)
- **Layout**: Cards stack one on top of another.
- **Pros**: Maximum readability. width is 100%.
- **Cons**: Takes up ~400px of vertical space. Pushes content down, requiring scroll to see input.
- **Verdict**: ❌ Too tall for this "quick action" context.

### Option B: 2-Column Grid
- **Layout**: 2 cards per row.
- **Pros**: Balanced height (~200px).
- **Cons**: With 3 items, the last one leaves an awkward gap.
- **Verdict**: ⚠️ Acceptable but not ideal.

### Option C: Horizontal Scroll / Carousel (Recommended)
- **Layout**: Cards remain side-by-side but off-screen. User swipes left/right.
- **Pros**:
  - **Height Efficient**: Only takes ~120px height.
  - **UX**: Natural "swipe" gesture on mobile.
  - **Focus**: Keeps the "Compose" input visible.
- **Cons**: Requires clear visual cue (peeking card) to show more exists.
- **Verdict**: ✅ **Strongly Recommended**.

### Implementation Plan
- **Mobile (< 768px)**: `flex overflow-x-auto snap-x snap-mandatory` with `w-[85vw]` cards.
- **Desktop (≥ 768px)**: `grid grid-cols-3 gap-4`.

## Security & Reliability Analysis

User Requirement: *Ensure the "Heart of the System" (Compose Page) is secure and robust.*

### 1. Security Risks & Mitigations
- **XSS (Script Injection)**: 
  - *Risk*: Malicious code masquerading as a prompt template.
  - *Mitigation*: Templates are **hardcoded constants** on the client-side, not fetched from an unverified external source. Input sanitization will be applied if API fetching is added later.
- **Data Privacy (LocalStorage)**:
  - *Risk*: Storing sensitive user data (e.g., draft content) in browser storage.
  - *Mitigation*: We **ONLY** store anonymous usage counts (e.g., `research: 5`). No PII or email content is ever saved to localStorage by this feature.
- **Accidental Data Loss**:
  - *Risk*: Clicking a card overwrites an existing draft.
  - *Mitigation*: If the composer input is not empty, **show a confirmation dialog** ("Replace current text?") before applying the template.

### 2. Failure Modes (Reliability)
- **Storage Disabled/Full**:
  - *Scenario*: User is in Incognito Mode or disk is full.
  - *Behavior*: `localStorage.setItem` throws an error.
  - *Fallback*: Catch the error silently. The feature works, but "Frequency Sorting" is temporarily disabled.
- **Corrupted Data**:
  - *Scenario*: `suggestion_stats` contains invalid JSON.
  - *Behavior*: `JSON.parse` fails.
  - *Fallback*: Reset stats to default (`{}`) and continue.

## Visual Aesthetics & Theming

User Goal: *Ensure the visuals "Pop" while strictly following the Central Theme (Aurora/Graphite).*

### 1. Shape & Structure
- **Geometry**: "Squircle" cards (`rounded-2xl`) to match the Professor Cards.
- **Glassmorphism**: High blur (`backdrop-blur-md`) with variable opacity to blend with the animated background.

### 2. Light Mode ("Aurora")
- **Concept**: *Crystalline & Airy*.
- **Background**: `bg-white/60` (Milky glass).
- **Border**: `border border-white/40` (Frost edge).
- **Shadow**: `shadow-sm hover:shadow-lg hover:shadow-blue-500/10` (Subtle blue lift).
- **Typography**: Dark graphite (`text-gray-900`) for readability, Blue-600 for icons.
- **Interaction**: Slight translateY on hover.

### 3. Dark Mode ("Graphite")
- **Concept**: *Stealth & Premium*.
- **Background**: `bg-white/5` (Deep charcoal glass).
- **Border**: `border border-white/10` (Subtle metallic edge).
- **Shadow**: `shadow-none` (Flat aesthetics).
- **Typography**: Silver/White (`text-gray-100`), Gray-400 subtitles.
- **Icon Style**: **Monochrome** (White/Gray). *Explicitly NO BLUE* in dark mode to match user preference.

### 4. Special "Recommended" Badge
- **Light Mode**: `bg-blue-100 text-blue-700` pill.
- **Dark Mode**: `bg-white/10 text-white` pill (Graphite style).

---
**Status**: Design Complete - Ready for Code
