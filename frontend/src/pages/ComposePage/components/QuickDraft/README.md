# Quick Draft Feature

Template-based quick email drafting.

## Structure
```
QuickDraft/
├── index.jsx                # Main Quick Draft component
├── TemplateGrid.jsx        # Grid of templates
├── TemplateCard.jsx        # Individual template
├── TemplateForm.jsx        # Fill template fields
├── templates/
│   └── templates.js        # Template definitions
└── hooks/
    └── useTemplates.js
```

## Features
- Preset templates (Extension Request, Thank You, Follow Up, etc.)
- Template categories
- Fill-in-the-blank forms
- Customize tone/formality
- Generate from template
