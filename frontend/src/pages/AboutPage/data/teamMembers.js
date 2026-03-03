/**
 * Team member data for About page Team section.
 * Single source of truth. Photo: Prince uses /images/prince_profile.jpg; Rohan and Solida use initials.
 */

export const TEAM_MEMBERS = [
  {
    name: 'Prince Pudasaini',
    role: 'Full Stack Engineer & Founder',
    location: 'McNeese State University • Louisiana, USA',
    initials: 'PP',
    image: '/images/prince_profile.jpg',
    bioParagraphs: [
      'I build end-to-end systems that turn messy communication into structured, reliable workflows. LetterLab Pro started as a practical solution for academic email—pulling thread context, generating accurate summaries, and drafting replies that still sound human.',
      'My focus is software architecture and secure API integrations: designing clear data flows, minimizing dependency risk, and keeping auth + privacy boundaries explicit. I care about shipping production-ready features that are testable, auditable, and fast—especially under real demo pressure.',
    ],
    socials: [
      { key: 'facebook', url: '#', label: 'Facebook' },
      { key: 'instagram', url: '#', label: 'Instagram' },
      { key: 'linkedin', url: 'https://linkedin.com/in/princepudasaini', label: 'LinkedIn' },
      { key: 'github', url: 'https://github.com/princepudasaini', label: 'GitHub' },
      { key: 'portfolio', url: 'https://princepudasaini.com', label: 'Portfolio' },
    ],
  },
  {
    name: 'Rohan Kunwar',
    role: 'Graphic Designer (Brand Identity)',
    location: 'Nepal',
    initials: 'RK',
    image: '/images/rohan.jpg',
    bioParagraphs: [
      'Rohan is a professional graphic designer with 5+ years of experience focused on brand identity systems. For LetterLab Pro, he designed key visual assets like the logo and favicon—translating Prince\'s product vision into a clean, consistent brand language that works across web and marketing.',
    ],
    socials: [
      { key: 'dribbble', url: '#', label: 'Dribbble' },
      { key: 'website', url: '#', label: 'Website' },
    ],
  },
  {
    name: 'Solida Tan',
    role: 'Project Support (ACM Outreach)',
    location: 'McNeese State University • Louisiana, USA',
    initials: 'ST',
    image: '/images/Solida Tan.webp',
    bioParagraphs: [
      'Solida is a Computer Science undergraduate at McNeese State University who helped bring LetterLab Pro into the ACM community. She coordinated outreach with ACM leadership, introduced the project during ACM Expo Day, and supported the early narrative that explains what LetterLab is and why it matters for students.',
    ],
    socials: [
      { key: 'linkedin', url: '#', label: 'LinkedIn' },
      { key: 'github', url: '#', label: 'GitHub' },
    ],
  },
];
