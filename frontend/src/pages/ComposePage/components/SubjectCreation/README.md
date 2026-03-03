# Subject Creation Feature

Generate multiple subject line options for emails.

## Structure
```
SubjectCreation/
├── index.jsx                 # Main Subject Creator component
├── SubjectInput.jsx         # Input for email context
├── SubjectOptions.jsx       # Display generated options
├── SubjectCard.jsx          # Single subject option
└── hooks/
    └── useSubjectGeneration.js
```

## Features
- Input email context/summary
- Generate 3-5 subject line variations
- Different tones (formal, casual, urgent)
- Copy or select subject
- Regenerate options
