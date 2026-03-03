import { TwitterIcon, LinkedInIcon, GitHubIcon, MailIcon } from '../../assets/icons/footer';

// Column links (Product, Resources, Company) — used by FooterColumns
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

// Legal links (bottom bar) — used by FooterBottomBar
export const footerLegalLinks = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Cookies Settings", href: "/legal/cookies-settings" },
];

// Social icons — used by FooterBrandBlock
export const footerSocialLinks = [
  { platform: "Twitter", href: "https://twitter.com/letterlabpro", icon: TwitterIcon },
  { platform: "LinkedIn", href: "https://linkedin.com/company/letterlabpro", icon: LinkedInIcon },
  { platform: "GitHub", href: "https://github.com/letterlabpro", icon: GitHubIcon },
  { platform: "Email", href: "mailto:support@letterlab.pro", icon: MailIcon },
];

// Legacy alias (if anything still uses footerLinks)
export const footerLinks = footerColumnLinks;
