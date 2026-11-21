import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { AuraLinkMark, NAV_ITEMS } from '../navigation/Navbar';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { contact, socialLinks } = siteConfig;
  const hasEmail = Boolean(contact.email.trim());
  const hasLocation = Boolean(contact.location.trim());
  const validSocialLinks = socialLinks.filter(
    (link) => link.label.trim() && /^https?:\/\//i.test(link.url.trim()),
  );

  return (
    <footer className="border-t hairline-border bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Description */}
          <div className="md:col-span-5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('home');
              }}
              className="inline-flex items-center gap-2.5 text-[var(--text-primary)]"
            >
              <AuraLinkMark />
              <span className="font-display text-lg font-bold tracking-[-0.02em]">
                {siteConfig.productName}
              </span>
            </a>

            <p className="mt-3 text-xs font-mono text-[var(--accent-cyan)]">
              {siteConfig.tagline}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] max-w-md">
              An AI-powered accessibility and communication technology project exploring Indian Sign
              Language alphabet recognition, sign-to-text composition, and inclusive digital
              interfaces.
            </p>
          </div>

          {/* Site Navigation Links */}
          <div className="md:col-span-3">
            <h2 className="font-display text-sm font-semibold text-[var(--text-primary)]">
              Navigation
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
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
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
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
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  Accessibility & Impact
                </a>
              </li>
            </ul>
          </div>

          {/* Configurable Contact & Social Section */}
          <div className="md:col-span-4">
            <h2 className="font-display text-sm font-semibold text-[var(--text-primary)]">
              Contact
            </h2>
            <div className="mt-4 space-y-2.5 text-sm text-[var(--text-secondary)]">
              <p className="font-medium text-[var(--text-primary)]">{contact.organization}</p>
              {hasEmail ? (
                <p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[var(--accent-primary)] hover:underline"
                  >
                    {contact.email}
                  </a>
                </p>
              ) : null}
              {hasLocation ? <p>{contact.location}</p> : null}
              {!hasEmail && !hasLocation ? (
                <p className="text-xs leading-relaxed text-[var(--text-muted)]">{contact.notes}</p>
              ) : null}
            </div>

            {validSocialLinks.length > 0 ? (
              <div className="mt-6">
                <h3 className="font-display text-xs font-semibold text-[var(--text-primary)]">
                  Links
                </h3>
                <ul className="mt-2.5 flex flex-wrap gap-4">
                  {validSocialLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
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
        <div className="mt-12 pt-6 border-t hairline-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.copyrightHolder}. All rights reserved.
          </p>
          <p>
            Interactive Frontend Prototype · Indian Sign Language Recognition Engine Planned
          </p>
        </div>
      </div>
    </footer>
  );
}
