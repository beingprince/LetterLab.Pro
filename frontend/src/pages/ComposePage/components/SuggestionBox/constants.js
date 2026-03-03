import {
    School,
    CalendarMonth,
    Science,
    HelpOutline
} from '@mui/icons-material';

export const SUGGESTIONS = [
    {
        id: 'research_inquiry',
        title: 'Research Inquiry',
        subtitle: 'Join a research lab',
        icon: Science,
        prompt: "Draft a professional email to Professor [Name] expressing strong interest in joining their research lab. Mention I have read their recent paper on [Topic] and attach my transcript/CV."
    },
    {
        id: 'office_hours',
        title: 'Office Hours',
        subtitle: 'Request a meeting',
        icon: CalendarMonth,
        prompt: "Draft an email to Professor [Name] requesting a brief meeting during office hours to discuss [Topic/Question]. Suggest 2-3 available time slots."
    },
    {
        id: 'rec_letter',
        title: 'Rec Letter',
        subtitle: 'Ask for recommendation',
        icon: School,
        prompt: "Draft a polite email to Professor [Name] asking if they would be willing to write a strong letter of recommendation for my application to [Program/Job]. Mention the deadline is [Date]."
    }
];

export const STORAGE_KEY = 'prof_email_drafter_suggestion_stats';
