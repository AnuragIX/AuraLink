import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { isSafeHttpUrl, isValidContactEmail } from '../../utils/urlValidation';
import { AuraLinkMark, NAV_ITEMS } from '../navigation/Navbar';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { contact, socialLinks } = siteConfig;
  const trimmedEmail = contact.email.trim();
  const hasEmail = isValidContactEmail(trimmedEmail);
  const hasLocation = Boolean(contact.location.trim());
  const validSocialLinks = socialLinks.filter(
    (link) => Boolean(link.label.trim()) && isSafeHttpUrl(link.url),
  );

  return (
    <footer className="bg-[var(--bg-contrast)] text-[var(--text-on-contrast)] border-t contrast-border">
      {/* Subtle Chromatic Human Signal Accent Line */}
      <div aria-hidden="true" className="grid grid-cols-12 h-1 w-full">
        <div className="col-span-3 bg-[var(--accent-coral)]" />
        <div className="col-span-6 bg-[var(--accent-primary)]" />
        <div className="col-span-3 bg-[var(--accent-mint)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Editorial Closing Statement Row */}
        <div className="pb-12 border-b contrast-border flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-[var(--accent-mint)] mb-3">
              {siteConfig.tagline}
            </p>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.03em] leading-[1.1] text-[var(--text-on-contrast)]">
              Beyond words. Closer connections.
            </p>
          </div>
          <a
            href="#translator"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('translator');
            }}
            className="self-start lg:self-end inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-md bg-[var(--accent-primary)] text-white text-sm font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Open Translator Prototype</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Description */}
          <div className="md:col-span-5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="inline-flex items-center gap-2.5 text-[var(--text-on-contrast)]"
            >
              <AuraLinkMark onContrast />
              <span className="font-display text-lg font-bold tracking-[-0.02em]">
                {siteConfig.productName}
              </span>
            </a>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-on-contrast-muted)] max-w-md">
              An AI-powered accessibility and communication technology project exploring Indian Sign
              Language alphabet recognition, sign-to-text composition, and inclusive digital
              interfaces.
            </p>
          </div>

          {/* Site Navigation Links */}
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs font-medium text-[var(--accent-mint)]">Navigation</h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className="text-sm text-[var(--text-on-contrast-muted)] hover:text-[var(--text-on-contrast)] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#technology"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('technology');
                  }}
                  className="text-sm text-[var(--text-on-contrast-muted)] hover:text-[var(--text-on-contrast)] transition-colors"
                >
                  Technology
                </a>
              </li>
              <li>
                <a
                  href="#accessibility"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('accessibility');
                  }}
                  className="text-sm text-[var(--text-on-contrast-muted)] hover:text-[var(--text-on-contrast)] transition-colors"
                >
                  Accessibility &amp; Impact
                </a>
              </li>
            </ul>
          </div>

          {/* Configurable Contact & Social Section */}
          <div className="md:col-span-4">
            <h2 className="font-mono text-xs font-medium text-[var(--accent-mint)]">Contact</h2>
            <div className="mt-4 space-y-2.5 text-sm text-[var(--text-on-contrast-muted)]">
              <p className="font-medium text-[var(--text-on-contrast)]">{contact.organization}</p>
              {hasEmail ? (
                <p>
                  <a
                    href={`mailto:${trimmedEmail}`}
                    className="text-[var(--accent-mint)] hover:underline"
                  >
                    {trimmedEmail}
                  </a>
                </p>
              ) : null}
              {hasLocation ? <p>{contact.location}</p> : null}
              {!hasEmail && !hasLocation ? (
                <p className="text-xs leading-relaxed text-[var(--text-on-contrast-muted)]">
                  {contact.notes}
                </p>
              ) : null}
            </div>

            {validSocialLinks.length > 0 ? (
              <div className="mt-6">
                <h3 className="font-mono text-xs font-medium text-[var(--text-on-contrast)]">
                  Links
                </h3>
                <ul className="mt-2.5 flex flex-wrap gap-4">
                  {validSocialLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[var(--text-on-contrast-muted)] hover:text-[var(--accent-mint)] transition-colors"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom Legal Line */}
        <div className="mt-14 pt-6 border-t contrast-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-on-contrast-muted)]">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.copyrightHolder}. All rights reserved.
          </p>
          <p className="font-mono">
            Interactive Frontend Prototype · ISL Recognition Engine Planned
          </p>
        </div>
      </div>
    </footer>
  );
}
