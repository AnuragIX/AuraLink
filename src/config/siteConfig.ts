/**
 * Configurable site contact and link settings for AuraLink AI.
 * Populate these fields with real, verified contact details and URLs prior to production deployment.
 * Empty values are intentionally omitted from the UI rather than inventing placeholder accounts.
 */
export interface SocialLinkConfig {
  label: string;
  url: string;
}

export interface SiteConfig {
  productName: string;
  tagline: string;
  copyrightHolder: string;
  copyrightYear: number;
  contact: {
    email: string;
    organization: string;
    location: string;
    notes: string;
  };
  socialLinks: SocialLinkConfig[];
}

export const siteConfig: SiteConfig = {
  productName: 'AuraLink AI',
  tagline: 'Beyond Words. Beyond Barriers.',
  copyrightHolder: 'AuraLink AI Project',
  copyrightYear: new Date().getFullYear(),
  contact: {
    // Configure real project contact details here before production deployment
    email: '',
    organization: 'AuraLink AI Accessibility Research Initiative',
    location: '',
    notes: 'Contact channels are configurable via site configuration prior to public deployment.',
  },
  // Add verified social or repository URLs here when available (only populated URLs render)
  socialLinks: [],
};
