# Pull Email Feature

Search and pull email threads from Gmail/Outlook, then generate AI replies.

## Structure
```
PullEmail/
├── index.jsx                  # Main Pull Email component
├── SearchInput.jsx           # Search box for threads
├── ThreadList.jsx            # List of found threads
├── ThreadItem.jsx            # Individual thread display
├── ThreadPreview.jsx         # Preview selected thread
├── ReplyGenerator.jsx        # Generate reply UI
└── hooks/
    ├── usePullEmail.js       # Pull email logic
    └── useThreadSearch.js    # Search logic
```

## Features
- Search threads by contact, subject, or keyword
- Display thread list with previews
- Select thread to view full conversation
- Generate context-aware reply
- Save pulled threads to history
