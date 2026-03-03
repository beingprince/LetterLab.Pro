import { TwitterIcon, LinkedInIcon, GitHubIcon, MailIcon } from '../../assets/icons/footer';

export const footerColumnLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/product/features" },
      { label: "Use Cases", href: "/product/use-cases" },
      { label: "Updates", href: "/product/updates" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/company/contact" },
      { label: "Status", href: "/status" },
    ],
  },
];

export const footerSocialLinks = [
  { platform: "Twitter", href: "https://twitter.com/letterlabpro", icon: TwitterIcon },
  { platform: "LinkedIn", href: "https://linkedin.com/company/letterlabpro", icon: LinkedInIcon },
  { platform: "GitHub", href: "https://github.com/letterlabpro", icon: GitHubIcon },
  { platform: "Email", href: "mailto:support@letterlab.pro", icon: MailIcon },
];

export const footerLegalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Cookies Settings", href: "/legal/cookies-settings" },
];
