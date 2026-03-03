# Backend Setup Instructions

## 1. Add Review Models

Copy the following files to your backend:

### `backend/models/Review.js`
```javascript
// Copy the Review.js file content here
```

### `backend/models/OTP.js`
```javascript
// Copy the OTP.js file content here
```

## 2. Add Review Routes

### `backend/routes/reviews.js`
```javascript
// Copy the review-routes.js file content here
```

## 3. Update Main Server File

In your main server file (usually `server.js` or `app.js`), add:

```javascript
import reviewRoutes from "./routes/reviews.js";

// Add this line where you define other routes
app.use("/api/reviews", reviewRoutes);
```

## 4. Install Dependencies

If you haven't already:
```bash
npm install crypto
```

## 5. Environment Variables

Add to your `.env` file:
```env
# Email Configuration (for production)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: Admin key for review management
ADMIN_KEY=your-secure-admin-key
```

## 6. Database Setup

The system will automatically create the required collections when first used. No manual setup needed.

## 7. Testing

The system includes demo mode where OTPs are logged to console for testing:
```
OTP for user@example.com: 123456
```

## 8. Production Email Setup

For production, you'll need to:
1. Set up a Gmail account with 2FA
2. Generate an App Password
3. Update the email sending logic in `/send-otp` route

## API Endpoints

- `POST /api/reviews/send-otp` - Send OTP to email
- `POST /api/reviews/verify-otp` - Verify OTP code
- `POST /api/reviews/submit-review` - Submit verified review
- `GET /api/reviews/reviews` - Get approved reviews

## Frontend Integration

The frontend components are already configured to use these endpoints. Just ensure your backend is running on the same origin or configure CORS appropriately.

## Admin Features (Optional)

For admin review management, you can add admin routes that require the ADMIN_KEY header.



----3.26pm 11/17/25:
Backend Documentation for LetterLab Pro
1. Overview
Your backend is structured to handle OAuth authentication for Google and Outlook, manage user sessions, and provide API endpoints for email-related operations. It also includes routes for managing professors and user data.
2. Key Components
2.1 Authentication
Google OAuth:
Routes:
/auth/google: Redirects user to Google OAuth consent page.
/auth/google/callback: Handles the callback from Google, exchanges code for tokens, and creates/updates user profile.
Outlook OAuth:
Routes:
/outlook/login: Initiates OAuth login.
/outlook/callback: Handles the callback, exchanges code for tokens, and fetches user profile from Microsoft Graph.
/outlook/exchange: Exchanges session code for tokens.
/outlook/status: Checks connection status.
Unified JWT Session:
Routes:
/auth/jwt-login: Generates JWT for authenticated user.
/auth/status: Verifies and returns user details.
/auth/logout: Invalidates the session.
2.2 Email Operations
Email Service:
Routes:
/api/pull-subjects-once: Pulls email subjects using a one-time access token.
/api/summarize-thread/:threadId: Placeholder for summarizing email threads (not yet implemented).
Conversations Management:
Routes:
/api/conversations: Lists conversations.
/api/conversations/:id: Gets a specific conversation.
/api/conversations/:id/pin and /api/conversations/:id/unpin: Pins/unpins conversations.
/api/conversations/:id: Deletes a conversation.
2.3 User and Professor Management
User Management:
Model:
User.js: Stores user details including OAuth tokens and profile data.
Professor Management:
Routes:
/api/professors/add: Adds a new professor.
/api/professors: Lists all professors.
3. Detailed Breakdown
3.1 Google OAuth (googleAuth.js)
Key Functions:
/auth/google: Redirects user to Google OAuth consent page.
/auth/google/callback: Handles the callback, exchanges code for tokens, and creates/updates user profile.
3.2 Outlook OAuth (outlookOAuth.js)
Key Functions:
/outlook/login: Initiates OAuth login.
/outlook/callback: Handles the callback, exchanges code for tokens, and fetches user profile from Microsoft Graph.
/outlook/exchange: Exchanges session code for tokens.
/outlook/status: Checks connection status.
3.3 Unified JWT Session (authUnified.js)
Key Functions:
/auth/jwt-login: Generates JWT for authenticated user.
/auth/status: Verifies and returns user details.
/auth/logout: Invalidates the session.
3.4 Email Operations (api.js)
Key Functions:
/api/pull-subjects-once: Pulls email subjects using a one-time access token.
/api/summarize-thread/:threadId: Placeholder for summarizing email threads (not yet implemented).
3.5 Conversations Management (conversations.js)
Key Functions:
/api/conversations: Lists conversations.
/api/conversations/:id: Gets a specific conversation.
/api/conversations/:id/pin and /api/conversations/:id/unpin: Pins/unpins conversations.
/api/conversations/:id: Deletes a conversation.
3.6 User and Professor Management
User Management (User.js):
Stores user details including OAuth tokens and profile data.
Professor Management (professors.js):
/api/professors/add: Adds a new professor.
/api/professors: Lists all professors.
4. Environment Variables (backend env.txt)
Google OAuth:
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
GOOGLE_EMAIL_REDIRECT_URI
Outlook OAuth:
OUTLOOK_CLIENT_ID
OUTLOOK_TENANT_ID
OUTLOOK_CLIENT_SECRET
OUTLOOK_REDIRECT_URI
OUTLOOK_EMAIL_REDIRECT_URI
General:
PORT
MONGO_URI
NODE_ENV
APP_ENV
ENABLE_CHAT
ENABLE_EMAIL
CORS_ORIGINS
FRONTEND_URL
JWT_SECRET
CRYPTO_SECRET
5. Server Setup (server.js)
Key Components:
Middleware:
CORS, Helmet, Rate Limiting, Cookie Parser
Routes:
Google OAuth, Unified JWT, Professors, Outlook OAuth, Conversations, Users, Sessions
Health Checks:
/healthz, /api/health
Email Generation:
/api/generate-email
Chat:
/api/chat
Production:
Serves frontend in production
6. Next Steps
Implement Thread Summarization:
Complete the /api/summarize-thread/:threadId route to fetch full email bodies and call Gemini for summarization.
Contact Limit Enforcement:
Add middleware to check contact limits before pulling emails.
AI Writing Integration:
Integrate Gemini for email drafting and ensure conversational tone.
Security Enhancements:
Add FERPA compliance checks and data sanitization.
Performance Optimization:
Memoize components, lazy load templates, and ensure efficient API calls.
7. Conclusion
This documentation provides a comprehensive overview of your backend setup. It includes detailed descriptions of each route, key functionalities, and environment variables. Use this as a reference to ensure smooth development and deployment.






gemini 5.55.11.17.2025

################################################################################

LetterLab Pro: ComposePage v2.0

Architectural Blueprint & Implementation Plan

DATE: 2025-11-17

STATUS: Final

################################################################################

CONTENTS

1. EXECUTIVE SUMMARY

2. CURRENT STATE AUDIT (YOUR "WHAT'S WORKING NOW")

3. NEW ARCHITECTURE - GUIDING PRINCIPLES

4. BACKEND REFACTOR - DETAILED IMPLEMENTATION PLAN (STEP 1)

5. FRONTEND ARCHITECTURE - DETAILED IMPLEMENTATION PLAN (STEP 2)

6. STEP-BY-STEP EXECUTION ROADMAP

7. FILE & ASSET STATUS

==============================================================================

1. EXECUTIVE SUMMARY

==============================================================================

This document details the complete plan to transition LetterLab Pro's email

composition feature from its current state (a high-fidelity mock frontend

disconnected from a single-step backend) to a production-grade, modular,

and interactive system.

THE CORE CONFLICT: Your 2,000-line ComposePage.jsx is engineered with a

complex, multi-step user experience (state machine, animations, mock flows).

Your backend (EmailService.js) is a simple, single-transaction service that

does not support this interactivity.

THE SOLUTION: We will abandon the monolithic ComposePage.jsx file. We will

build a new, fully modular frontend architecture from scratch. Simultaneously,

we will refactor the backend API, breaking its single transaction into a

multi-step, conversational API that services the new frontend's

state machine.

This plan implements your two-flow system:

1. Flow 1: New Email Generation (No Context)

2. Flow 2: Interactive Contextual Crawler (Multi-Step)

It also integrates your specific requirements: professor-only email matching,

a 20-contact limit, and seamless integration with your website's existing

visual theme.

==============================================================================

2. CURRENT STATE AUDIT (YOUR "WHAT'S WORKING NOW")

==============================================================================

Based on the files you provided (server.js, api.js, outlookOAuth.js,

EmailService.js, professors.js, Professor.js), here is the exact

status of your current system.

2.1. AUTHENTICATION FLOW (File: outlookOAuth.js)

- STATUS: 100% Functional.

- PROCESS:

1. User clicks "Login with Outlook."

2. User is redirected to Microsoft and authenticates.

3. Microsoft redirects to /outlook/callback.

4. Your backend successfully exchanges the code for a short-lived

Microsoft Access Token.

5. Your backend creates its own JWT (a "LetterLab JWT") for your user.

6. It uses a sessionCode to bridge the gap to the frontend.

7. The frontend calls /outlook/exchange with the sessionCode.

8. The frontend successfully receives BOTH the outlookAccessToken

(for Microsoft) and the jwtToken (for your API).

2.2. API & DATA FLOW (Files: api.js, EmailService.js)

- STATUS: 50% Functional (but 100% Monolithic).

- PROCESS:

1. The frontend calls POST /api/pull-subjects-once.

2. It sends the outlookAccessToken in the request body.

3. The route calls emailService.pullSubjectsWithAccessToken.

4. This one function does everything in a single, slow, "blocking"

request:

a. Connects to Microsoft Graph API.

b. Fetches ALL 100 messages (top(100)).

c. Downloads all headers and subjects.

d. Groups all 100 messages by conversationId.

e. Analyzes all threads to count user/target replies.

5. Only after all this is complete does it return a single, large

JSON array to the frontend.

- CRITICAL FLAW: This is not a "crawler." It is a "blocking report."

It does not support your interactive flow (Step 1: List, Step 2: Select,

Step 3: Summarize). It's all or nothing.

2.3. PROFESSOR MANAGEMENT (Files: professors.js, Professor.js)

- STATUS: 25% Functional (but logically flawed).

- FLAW 1 (SECURITY): The routes in professors.js (/add, /) are

not protected by your auth middleware. Any user (or non-user) can

currently see all professors added by all other users.

- FLAW 2 (DATA): The Professor.js model is missing a userId field.

There is no way to know which user added which professor.

- FLAW 3 (LOGIC): Your requirements for a "20-contact limit" and

"professor email matching" are not implemented.

2.4. FRONTEND (File: ComposePage.jsx)

- STATUS: 100% Functional as a high-fidelity mock.

- ANALYSIS: This 2,084-line file is a reference for all the features you

want. It contains a brilliant, self-contained state machine (pageState)

that drives a "fake" interactive flow using setTimeout and hard-coded

mock data (e.g., fetchMockConversations, fetchMockAiSummary).

2.5. AUDIT CONCLUSION

Your backend and frontend are not connected. They are two separate systems

that mock the same idea. The plan is to refactor the backend to replace

the frontend's mock data with real, live data, step-by-step.

==============================================================================

3. NEW ARCHITECTURE - GUIDING PRINCIPLES

==============================================================================

3.1. MODULARITY FIRST (Your Requirement)

We are building a new, clean folder: src/pages/ComposePage/.

- index.jsx: The central "orchestrator." It holds the master state

(pageState, draftText, etc.) and imports all components. It is

logically clean.

- components/: Dumb UI components.

- ComposeInput.jsx: The text area, "Send" button, and attachments.

- ResultModal.jsx: The glassmorphism card displaying the final draft.

- SuggestionArea.jsx: The "prompt suggestions" UI.

- HistoryDrawer.jsx: Your requested slide-out history panel.

- CrawlerTimeline.jsx: The new UI for Flow 2, showing the list of

subjects with checkboxes.

- Iconography.jsx: As requested, a file for your "sharp geometric"

custom SVG icons.

- hooks/: Smart logic, state, and API calls.

- useProfessor.js: Manages all professor logic (limit, check, add).

- useCrawler.js: Manages the entire Flow 2 state and API calls.

- useGeneration.js: Manages the Flow 1 state and API calls.

- useAnimation.js: As requested, a file exporting Framer Motion

variants for all components to share.

3.2. THEME INTEGRATION (Your Requirement)

The new ComposePage will not remove your existing theme. It will

inherit and extend it.

- NO createTheme: We will not use createTheme inside the new

ComposePage/index.jsx.

- useTheme(): The index.jsx orchestrator will call `const theme =

useTheme();` (from MUI) to get the existing theme you have defined

at the top level of your app.

- CSS VARIABLES: We will continue using the CSS variable pattern

from your 2,000-line file (e.g., var(--brand-primary)). The index.jsx

can pass these as props: <ComposeInput primaryColor={theme.palette.primary.main} />.

- styled(): For new components, we will use MUI's styled() API,

which automatically receives the existing theme. This ensures all

new components are "theme-aware" from birth.

3.3. THE TWO-FLOW STATE MACHINE

The pageState in index.jsx will manage these two distinct flows.

- Flow 1 (New Email):

- pageState: 'flow1_idle'

- User types a prompt.

- pageState: 'flow1_generating'

- API call to /api/generate-email (which you already have).

- pageState: 'flow1_complete' (Draft appears in ResultModal.jsx).

- Flow 2 (Contextual Crawler):

- pageState: 'flow2_idle'

- User types a professor's email and clicks "Analyze Context."

- pageState: 'flow2_checking_professor'

- API call to /api/professors/check.

- pageState: 'flow2_listing_threads'

- API call to new endpoint /api/crawler/list-threads.

- CrawlerTimeline.jsx is shown with the subject list.

- pageState: 'flow2_summarizing'

- User checks boxes and clicks "Analyze."

- API call to new endpoint /api/crawler/summarize-threads.

- pageState: 'flow2_ready_to_draft'

- The summary appears in SuggestionArea.jsx. The user can now

write a prompt.

- pageState: 'flow1_generating' (reuses Flow 1's generation)

- API call to /api/generate-email (but with the summary as context).

- pageState: 'flow1_complete'

==============================================================================

4. BACKEND REFACTOR - DETAILED IMPLEMENTATION PLAN (STEP 1)

==============================================================================

This is the first set of code changes we will make. We are modifying the

backend to support the new modular frontend.

4.1. FILE: models/Professor.js (MODIFICATION)

- ACTION: We must link professors to users.

- CHANGE: Add userId and update email to be unique per user.

```javascript

import mongoose from "mongoose";

const professorSchema = new mongoose.Schema({

userId: {

type: mongoose.Schema.Types.ObjectId,

ref: 'User',

required: true,

},

name: { type: String, required: true },

email: { type: String, required: true },

department: { type: String },

university: { type: String },

createdAt: { type: Date, default: Date.now },

});

// Ensure one user cannot add the same email twice

professorSchema.index({ userId: 1, email: 1 }, { unique: true });

const Professor = mongoose.model("Professor", professorSchema);

export default Professor;

```

4.2. FILE: routes/professors.js (MODIFICATION)

- ACTION: Add auth, add the 20-contact limit, and add the /check route.

```javascript

import express from "express";

import Professor from "../models/Professor.js";

import { auth } from "../middleware/auth.js"; // <-- IMPORT AUTH

const router = express.Router();

const PROFESSOR_LIMIT = 20;

// PROTECT ALL ROUTES IN THIS FILE

router.use(auth);

// Route to add a new professor (NOW SECURE)

router.post("/add", async (req, res) => {

try {

// 1. Check contact limit

const count = await Professor.countDocuments({ userId: req.user.id });

if (count >= PROFESSOR_LIMIT) {

return res.status(403).json({

error: You have reached the ${PROFESSOR_LIMIT}-contact limit.,

});

}

// 2. Add userId to the new professor

const { name, email, department, university } = req.body;

const newProf = new Professor({

name, email, department, university,

userId: req.user.id, // <-- LINK TO USER

});

await newProf.save();

res.status(201).json({ message: "Professor added", professor: newProf });

} catch (err) {

if (err.code === 11000) { // Handle duplicate email

return res.status(409).json({ error: "This email is already in your contact list." });

}

res.status(500).json({ error: err.message });

}

});

// GET professors (NOW SECURE)

router.get("/", async (req, res) => {

try {

// Find only professors belonging to the logged-in user

const professors = await Professor.find({ userId: req.user.id })

.sort({ createdAt: -1 });

res.json(professors);

} catch (err) {

res.status(500).json({ message: "Server error fetching professors." });

}

});

// *** NEW ROUTE ***

// POST /api/professors/check (The "Gate" for Flow 2)

router.post("/check", async (req, res) => {

try {

const { email } = req.body;

if (!email) {

return res.status(400).json({ error: "Email is required." });

}

const found = await Professor.findOne({

email: email.toLowerCase(),

userId: req.user.id,

});

if (found) {

res.json({ isProfessor: true, professor: found });

} else {

res.json({ isProfessor: false, message: "Email not in professor list." });

}

} catch (err) {

res.status(500).json({ message: "Server error checking professor." });

}

});

export default router;

```

4.3. FILE: services/EmailService.js (MAJOR REFACTOR)

- ACTION: Split the monolithic pullSubjectsWithAccessToken into two

new, fast, targeted functions.

```javascript

// ... imports at top ...

// *** DEPRECATED FUNCTION ***

// We are no longer using pullSubjectsWithAccessToken.

// It is too slow and monolithic.

// *** NEW FUNCTION 1 (FOR FLOW 2, STEP 2) ***

export async function listThreads(accessToken, targetEmail) {

console.log(🔍 Listing threads for ${targetEmail});

if (!accessToken) throw new Error("Access Token is missing.");

const client = outlookClient(accessToken);

const searchCriteria = (from/emailAddress/address eq '${targetEmail}') or (toRecipients/any(r:r/emailAddress/address eq '${targetEmail}'));

// Only get the minimum data needed for the list.

// This will be extremely fast.

const response = await client.api('/me/messages')

.filter(searchCriteria)

.select('subject,sender,receivedDateTime,conversationId') // <-- Minimal select

.orderBy('receivedDateTime desc')

.top(25) // <-- Only get 25, not 100

.get();

const messages = response.value || [];

// Group by conversationId to get unique threads

const threads = messages.reduce((acc, msg) => {

if (msg.conversationId && !acc[msg.conversationId]) {

acc[msg.conversationId] = {

id: msg.conversationId,

subject: msg.subject || '(No Subject)',

latestDate: msg.receivedDateTime,

sender: msg.sender.emailAddress.address,

};

}

return acc;

}, {});

// Return as an array, sorted by date

return Object.values(threads).sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate));

}

// *** NEW FUNCTION 2 (FOR FLOW 2, STEP 3) ***

export async function getAndSummarizeThreads(accessToken, conversationIds) {

console.log(📚 Summarizing ${conversationIds.length} thread(s));

if (!accessToken) throw new Error("Access Token is missing.");

const client = outlookClient(accessToken);

let fullContext = "";

for (const id of conversationIds) {

const response = await client.api('/me/messages')

.filter(conversationId eq '${id}')

.select('body,from,receivedDateTime') // <-- Get the body

.get();

const messages = response.value || [];

for (const msg of messages) {

fullContext += ---EMAIL START---\nFROM: ${msg.from?.emailAddress?.address}\nDATE: ${msg.receivedDateTime}\nBODY:\n${msg.body.content}\n---EMAIL END---\n\n;

}

}

if (fullContext.length === 0) {

return { summary: "No content found in the selected threads." };

}

// Call the Gemini API (logic from server.js)

// We need to import ai and safeStitch from server.js,

// or move them to a new utils/gemini.js file.

// *** Placeholder for Gemini call ***

// const client = ai();

// const r = await client.models.generateContent(...);

// const summary = safeStitch(r);

//

// For now, we'll return a mock summary:

const summary = AI summary of ${conversationIds.length} thread(s) complete. The total context was ${fullContext.length} characters long.;

return { summary: summary, context: fullContext };

}

// ... keep analyzeAndGroupThreads for now, but it's deprecated ...

```

4.4. FILE: routes/crawler.js (NEW FILE)

- ACTION: Create the new API endpoints for Flow 2.

```javascript

import express from "express";

import { auth } from "../middleware/auth.js";

import * as emailService from "../services/EmailService.js";

const router = express.Router();

// This entire file is protected by auth

router.use(auth);

// Endpoint for Flow 2, Step 2

router.post("/list-threads", async (req, res) => {

const { targetEmail, outlookAccessToken } = req.body;

if (!targetEmail || !outlookAccessToken) {

return res.status(400).json({ error: "Missing targetEmail or outlookAccessToken." });

}

try {

const threads = await emailService.listThreads(outlookAccessToken, targetEmail);

res.json(threads);

} catch (err) {

console.error("Error listing threads:", err.message);

res.status(500).json({ error: "Failed to list email threads." });

}

});

// Endpoint for Flow 2, Step 3

router.post("/summarize-threads", async (req, res) => {

const { conversationIds, outlookAccessToken } = req.body;

if (!conversationIds || !Array.isArray(conversationIds) || conversationIds.length === 0) {

return res.status(400).json({ error: "Missing conversationIds array." });

}

try {

const summary = await emailService.getAndSummarizeThreads(outlookAccessToken, conversationIds);

res.json(summary);

} catch (err) {

console.error("Error summarizing threads:", err.message);

res.status(500).json({ error: "Failed to summarize threads." });

}

});

export default router;

```

4.5. FILE: server.js (MODIFICATION)

- ACTION: Import and mount the new crawler routes.

- ADD:

```javascript

// ... other imports ...

import professorRoutes from "./routes/professors.js";

import apiRouter from "./routes/api.js";

import crawlerRoutes from "./routes/crawler.js"; // <-- ADD THIS

// ...

// ... app.use ...

app.use("/auth", authUnifiedRoutes);

app.use("/api/professors", professorRoutes); // This is now protected by auth

app.use("/api/oauth", outlookOAuthRoutes);

// ... rate limiters ...

// ... health checks ...

// ... protected routes ...

app.use("/api/conversations", conversationRoutes);

app.use("/api/crawler", crawlerRoutes); // <-- ADD THIS

app.use("/api", apiRouter);

app.use("/api/usage", auth, usageRouter);

// ...

```

==============================================================================

5. FRONTEND ARCHITECTURE - DETAILED IMPLEMENTATION PLAN (STEP 2)

==============================================================================

This is the plan for building the new modular frontend.

5.1. FOLDER: src/pages/ComposePage/

- We create this new folder.

- We create the sub-folders: components/, hooks/, styles/.

5.2. FILE: index.jsx (The Orchestrator)

- ROLE: Manages all state and renders components.

- STATE:

- [pageState, setPageState]

- [draftText, setDraftText]

- [subjectList, setSubjectList]

- [summary, setSummary]

- [targetProfessor, setTargetProfessor]

- [error, setError]

- LOGIC:

- Imports useTheme() to pass colors to children.

- Imports all hooks (useProfessor, useCrawler, useGeneration).

- Contains the master handleSubmit function that:

- Checks pageState.

- If Flow 1, calls useGeneration.generateNewEmail().

- If Flow 2, calls useCrawler.startCrawler().

5.3. FILE: hooks/useProfessor.js (New Hook)

- ROLE: Manages all professor API calls.

- EXPORTS:

- checkProfessor(email):

- fetch('/api/professors/check', ...)

- Returns { isProfessor: true, professor: ... } or { isProfessor: false }.

- addProfessor(name, email):

- fetch('/api/professors/add', ...)

- Handles 403 (limit) and 409 (duplicate) errors.

- getProfessors():

- fetch('/api/professors/', ...)

- Returns list of professors for the HistoryDrawer.jsx.

5.4. FILE: hooks/useCrawler.js (New Hook - Flow 2 Engine)

- ROLE: Manages the interactive Flow 2.

- EXPORTS:

- listThreads(email, token):

- fetch('/api/crawler/list-threads', ...)

- Returns the array of subject threads.

- summarizeThreads(ids, token):

- fetch('/api/crawler/summarize-threads', ...)

- Returns the { summary: "..." } object.

5.5. FILE: hooks/useGeneration.js (New Hook - Flow 1 Engine)

- ROLE: Manages simple generation.

- EXPORTS:

- generateNewEmail(prompt, context):

- fetch('/api/generate-email', ...)

- Passes both the user's prompt and the (optional) summary

from useCrawler as context.

5.6. FILE: components/ResultModal.jsx (New Component)

- ROLE: Renders the final draft and the triple-dot menu.

- PROPS: draftText, targetProfessor, onClose.

- LOGIC: This implements your "Send To" edge case.

- const toEmail = targetProfessor ? targetProfessor.email : '';

- const gmailLink = gmailHref(toEmail, subject, draftText);

- const outlookLink = outlookHref(toEmail, subject, draftText);

- The toEmail will be blank if no professor was targeted,

exactly as you specified.

5.7. FILES: useAnimation.js & Iconography.jsx

- These will be created as "utility" files.

- useAnimation.js will export framer-motion variant objects.

- Iconography.jsx will export custom React SVG components.

==============================================================================

6. STEP-BY-STEP EXECUTION ROADMAP

==============================================================================

This is the sequential order of operations.

--- PHASE 1: BACKEND REFACTOR ---

[ ] Step 1: Modify models/Professor.js (Add userId and index).

[ ] Step 2: Modify routes/professors.js (Add auth, limit logic, and /check route).

[ ] Step 3: Modify services/EmailService.js (Deprecate old function, add new listThreads and getAndSummarizeThreads).

[ ] Step 4: Create new file routes/crawler.js (Add /list-threads and /summarize-threads endpoints).

[ ] Step 5: Modify server.js (Import and app.use the new crawlerRoutes).

--- PHASE 2: FRONTEND MODULAR BUILD ---

[ ] Step 6: Create the new folder src/pages/ComposePage/ with components/, hooks/, styles/.

[ ] Step 7: Create all new, empty component files (ComposeInput.jsx, ResultModal.jsx, etc.) and hook files (useProfessor.js, etc.).

[ ] Step 8: Build ComposePage/index.jsx to import and lay out the empty components.

[ ] Step 9: Implement hooks/useProfessor.js and test it.

[ ] Step 10: Implement hooks/useGeneration.js (Flow 1).

[ ] Step 11: Wire Flow 1: Connect ComposeInput.jsx to index.jsx's handleSubmit, which calls useGeneration.generateNewEmail(). The result should appear in ResultModal.jsx.

[ ] Step 12: Implement hooks/useCrawler.js (Flow 2).

[ ] Step 13: Wire Flow 2 (Part A): Connect a new "Analyze Context" button to useProfessor.checkProfessor(), which then calls useCrawler.listThreads().

[ ] Step 14: Wire Flow 2 (Part B): Render the results in CrawlerTimeline.jsx.

[ ] Step 15: Wire Flow 2 (Part C): Connect the "Analyze" button in CrawlerTimeline.jsx to call useCrawler.summarizeThreads().

[ ] Step 16: Wire Flow 2 (Part D): The summary appears in SuggestionArea.jsx. The main ComposeInput.jsx is now ready for the final prompt.

[ ] Step 17: Implement your "Send To" logic in ResultModal.jsx.

[ ] Step 18: Implement HistoryDrawer.jsx by calling useProfessor.getProfessors().

--- PHASE 3: POLISH & ANIMATION ---

[ ] Step 19: Build Iconography.jsx and useAnimation.js.

[ ] Step 20: Import animations and icons into all components, replacing placeholders.

==============================================================================

7. FILE & ASSET STATUS

==============================================================================

I can confirm I have all the files I need from you to begin this plan.

- server.js (Provides Gemini logic, middleware setup)

- api.js (Provides base for Flow 1)

- outlookOAuth.js (Confirms auth token flow)

- EmailService.js (Provides the Microsoft Graph logic to be refactored)

- professors.js (Provides the base routes to be secured)

- Professor.js (Provides the base model to be modified)

- ComposePage.jsx (Provides the 2,000-line feature and theme reference)

I do not need any more files. We are ready to begin Step 1.

################################################################################