# Pull Email Feature — Research & Implementation Plan

## Overview
The "Pull Email" feature allows users to search their Gmail or Outlook inbox for specific contacts and select from a list of relevant conversation subjects. Once a subject is chosen, the AI analyzes the entire email thread to provide a concise summary. The user then provides additional context or instructions, which the AI integrates with the thread history to generate a tailored response. The final result can be edited, copied, or sent directly as a reply or a new message via the respective email provider.

---

## 🧠 Core UX Philosophy

**Guided AI Workflow** — The user should feel:
- "I am just selecting something"
- "AI is doing the heavy work"
- "I only approve and refine"

**Design Principles:**
- ✅ Wizard Model (Linear but flexible)
- ✅ Progressive Disclosure
- ✅ Single Main Focus Area
- ✅ Optional Advanced Panels
- ✅ No clutter, no 20 buttons, no 5 sidebars

---

## 🔄 State Machine Architecture

Instead of messy page routing, we use a **single state-driven wizard**:

```javascript
const PullEmailStates = {
  PICK_CONTACT: "pick_contact",
  LOADING_SUBJECTS: "loading_subjects",
  PICK_THREAD: "pick_thread",
  LOADING_ANALYSIS: "loading_analysis",
  SHOW_SUMMARY: "show_summary",
  ENTER_PROMPT: "enter_prompt",
  LOADING_DRAFT: "loading_draft",
  SHOW_DRAFT: "show_draft"
};
```

**Benefits:**
- No chaos
- Easy back navigation
- Easy mobile adaptation
- No accidental feature explosion

---

## 🌊 User Flow (Simplified)

1. **Pick Contact** → Contact search modal
2. **Loading Subjects** → AI activity overlay
3. **Pick Thread** → Subject list with snippets
4. **Loading Analysis** → AI activity overlay
5. **Show Summary** → AI-generated thread summary
6. **Enter Prompt** → User adds context/instructions
7. **Loading Draft** → AI activity overlay
8. **Show Draft** → Final email composer with send options

---

## 🖥 Desktop Layout (Premium SaaS Feel)

### Adaptive 3-Zone Layout (When in Draft Mode)

```
------------------------------------------------------
| Header: Contact → Subject → Summary → Draft       |
------------------------------------------------------
| Left Panel | Main Panel (Focus) | Right Panel     |
| (History)  |                    | (Insights)      |
------------------------------------------------------
```

### Zone A — Header (72px height)
- Breadcrumb navigation
- Back arrow
- Exit to Compose
- Provider badge (Gmail/Outlook)
- Minimal progress step indicator

### Zone B — Main Focus Panel (Center)
**Changes based on state:**

| State | What shows in center |
|-------|---------------------|
| Pick Contact | Contact search modal |
| Pick Thread | Subject list |
| Show Summary | Summary card |
| Enter Prompt | Prompt input |
| Show Draft | Email composer |

**Only one main thing at a time.**

### Zone C — Right Panel (Collapsible)
Visible only in:
- Summary state
- Draft state

**Tabs:**
- Summary
- Thread
- AI Insights

On smaller screens: collapses automatically.

---

## 📱 Mobile Layout (Clean & Comfortable)

Mobile cannot use 3 zones. Convert to **Single Vertical Flow**:

```
[Step 2 of 5]
Pick Thread

(thread list)
(thread list)
(thread list)

[Continue]
```

**Features:**
- Sticky top step indicator
- Sticky bottom action button
- Thread + Summary become bottom sheet modal (swipe up panel)

**When Draft:**
```
Subject
To
Body editor

[Regenerate]  [Send]
```

---

## 🧱 Component Architecture (Production Ready)

```
PullEmail/
├── index.jsx                      # Main wizard orchestrator (state machine)
├── ContactPickerModal.jsx         # Step 1: Search & select contact
├── ThreadListPanel.jsx            # Step 2: Select subject/thread
├── ActivityOverlay.jsx            # Reusable AI loading component
├── SummaryScreen.jsx              # Step 3: AI-generated summary
├── PromptInputScreen.jsx          # Step 4: User context input
├── DraftComposer.jsx              # Step 5: Final email editor
├── SendOptionsModal.jsx           # Send configuration (reply/new)
├── hooks/
│   ├── usePullEmailState.js      # State machine logic
│   ├── useContactSearch.js       # Contact search with debounce
│   ├── useThreadFetch.js         # Fetch threads for contact
│   └── useReplyGeneration.js     # AI reply generation
└── RESEARCH.md                    # This file
```

---

## 📦 Component Details

### 1️⃣ ContactPickerModal
- Search input
- Recent contacts
- Provider badge
- Auto-proceed on select

### 2️⃣ ThreadListPanel
- Subject list
- Snippet preview
- Date (relative: "2 hours ago")
- Search within threads
- Infinite scroll

### 3️⃣ ActivityOverlay (Reusable AI Loader)
ChatGPT-style loader with task progress:

```javascript
tasks = [
  { label: "Connecting to Gmail...", status: "done" },
  { label: "Fetching threads...", status: "loading" },
  { label: "Analyzing content...", status: "pending" }
]
```

**Features:**
- Spinner → checkmark animation
- Smooth fade transitions
- Optional expandable log

**Used in:**
- Loading subjects
- Loading thread analysis
- Loading draft

### 4️⃣ SummaryScreen
Card layout:
- AI Summary
- Key Points
- Detected Tone
- Pending Actions

**Buttons:**
- Proceed
- Pick another thread

### 5️⃣ PromptInputScreen
- Instruction textarea
- Example placeholder
- Tone selector (optional)
- **Button:** Generate Draft

### 6️⃣ DraftComposer
Final output area with:
- To
- Subject
- Body

**Buttons:**
- Regenerate
- Change Tone
- Shorten
- Expand
- Send

### 7️⃣ SendOptionsModal (CLEAN SOLUTION)
When user clicks Send, modal appears:

```
Send as:
● Reply to thread
○ New email (same recipient)
○ New email (custom recipient)

Subject:
[ Editable field ]

If new subject:
[ Generate Subject Ideas ]
```

**Subject suggestions:**
- Display as chips
- Click to auto-fill

**Then:** `[ Confirm & Send ]`

---

## 🔄 Navigation Logic (Back System)

| Action | Result |
|--------|--------|
| Back | Go to previous state |
| Back from Draft | Go to Summary |
| Back from Summary | Go to Subject list |
| Exit | Go to Compose mode |
| Send success | Show success toast |

---

## 🎨 Design System

### Visual Style
- Soft glassmorphism
- Neutral colors + accent (blue gradient)
- Clear section titles
- Subtle progress indicator

### Layout Principles
- **Desktop:** 3-zone adaptive layout
- **Mobile:** Single vertical flow
- **Focus:** One main action per screen
- **Disclosure:** Advanced options in collapsible panels

---

## 🔌 API Requirements

### Backend Endpoints Needed

#### 1. Search Contacts
```
GET /api/contacts/search?q={query}&provider={gmail|outlook}
```
**Response:**
```json
{
  "contacts": [
    {
      "email": "prof@university.edu",
      "name": "Dr. Smith",
      "lastContact": "2024-02-16T10:30:00Z",
      "threadCount": 5
    }
  ]
}
```

#### 2. Get Threads for Contact
```
GET /api/threads/by-contact?email={email}&provider={gmail|outlook}&limit=20
```
**Response:**
```json
{
  "threads": [
    {
      "id": "thread_abc123",
      "subject": "Re: Research Opportunity",
      "snippet": "Thank you for your interest...",
      "lastMessageDate": "2024-02-16T10:30:00Z",
      "messageCount": 3,
      "unread": false
    }
  ]
}
```

#### 3. Analyze Thread
```
POST /api/threads/{threadId}/analyze
Body: { "provider": "gmail" }
```
**Response:**
```json
{
  "summary": "This thread is about a research opportunity...",
  "keyPoints": [
    "Student expressed interest in AI research",
    "Professor responded positively",
    "Waiting for student to send CV"
  ],
  "tone": "professional",
  "pendingActions": ["Send CV", "Schedule meeting"],
  "messages": [
    {
      "from": "student@university.edu",
      "date": "2024-02-15T09:00:00Z",
      "body": "Dear Professor Smith...",
      "isFromUser": true
    }
  ]
}
```

#### 4. Generate Reply
```
POST /api/threads/{threadId}/reply
Body: {
  "userPrompt": "I want to send my CV and request a meeting",
  "tone": "professional",
  "context": "thread summary from analyze endpoint"
}
```
**Response:**
```json
{
  "draft": {
    "subject": "Re: Research Opportunity - CV and Meeting Request",
    "body": "Dear Professor Smith,\n\nThank you for your response..."
  }
}
```

---

## 🔒 Security Considerations

### 1. Token Management
- OAuth tokens in httpOnly cookies
- Refresh tokens before expiry
- Never expose tokens client-side

### 2. Data Privacy
- Don't store email content in localStorage
- Clear sensitive data on logout
- HTTPS for all API calls

### 3. XSS Prevention
- Sanitize email body HTML with DOMPurify
- Escape user input in search queries
- No `dangerouslySetInnerHTML`

---

## 🧪 Testing Strategy

### Unit Tests
- State machine transitions
- Contact search debouncing
- Thread list rendering

### Integration Tests
- Full wizard flow: contact → thread → summary → draft
- OAuth token refresh
- Error states

### Manual Testing
- Test with real Gmail/Outlook accounts
- Verify AI summary quality
- Check reply generation accuracy

---

## 📋 Implementation Phases

### Phase 1: Foundation ✅
- [x] Create folder structure
- [x] Research & planning document
- [ ] Create state machine hook
- [ ] Set up basic component files

### Phase 2: Contact & Thread Selection
- [ ] Implement ContactPickerModal
- [ ] Build ThreadListPanel
- [ ] Create ActivityOverlay
- [ ] Wire up backend endpoints

### Phase 3: AI Analysis & Summary
- [ ] Build SummaryScreen
- [ ] Implement thread analysis API
- [ ] Display key points and tone

### Phase 4: Prompt & Draft Generation
- [ ] Implement PromptInputScreen
- [ ] Build DraftComposer
- [ ] Connect to AI reply endpoint
- [ ] Add regeneration options

### Phase 5: Send & Polish
- [ ] Implement SendOptionsModal
- [ ] Add subject generation for new emails
- [ ] Error handling & empty states
- [ ] Mobile responsive layout
- [ ] Accessibility (keyboard nav, ARIA)

---

## 🎯 Key Decisions

1. **State Machine > Page Routing** — Single component with state-driven UI
2. **Progressive Disclosure** — Show only what's needed at each step
3. **Reusable ActivityOverlay** — Consistent loading experience
4. **Collapsible Right Panel** — Advanced info without clutter
5. **SendOptionsModal** — Clean send configuration without extra pages

---

## 🚀 Next Steps

1. Create `usePullEmailState.js` hook with state machine
2. Build `ActivityOverlay.jsx` (reusable loader)
3. Implement `ContactPickerModal.jsx`
4. Create `ThreadListPanel.jsx` with mock data
5. Design `SummaryScreen.jsx` layout
6. Build `DraftComposer.jsx` with send options
