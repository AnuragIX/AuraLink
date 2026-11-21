import React, { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X, ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'translator', label: 'Translator', href: '#translator' },
  { id: 'about', label: 'About', href: '#about' },
];

export function AuraLinkMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle
        cx="14"
        cy="14"
        r="11.5"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="1.25"
      />
      <path
        d="M6.5 16.5C9.5 11.5 18.5 11.5 21.5 16.5"
        stroke="var(--accent-primary)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 12C11.8 8.8 16.2 8.8 18.5 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <circle cx="14" cy="18.2" r="2.1" fill="var(--accent-primary)" />
    </svg>
  );
}

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const { theme, toggleTheme, reducedMotion } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        isScrolled
          ? 'bg-[var(--bg-canvas)]/88 backdrop-blur-md border-b hairline-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single-line Brand Identity */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex items-center gap-2.5 text-[var(--text-primary)] whitespace-nowrap shrink-0 focus-visible:rounded-sm"
        >
          <AuraLinkMark />
          <span className="font-display text-base sm:text-lg font-bold tracking-[-0.02em]">
            AuraLink AI
          </span>
        </a>

        {/* Zone 2: Clean Desktop Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.id)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
                {isActive ? (
                  <motion.span
                    layoutId={reducedMotion ? undefined : 'nav-active-underline'}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--accent-primary)]"
                    aria-hidden="true"
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Switcher + Primary CTA + Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border hairline-border bg-[var(--bg-surface)]/80 text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <a
            href="#translator"
            onClick={(e) => handleLinkClick(e, 'translator')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Try AuraLink</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border hairline-border bg-[var(--bg-surface)]/90 text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            id="mobile-navigation-drawer"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b hairline-border bg-[var(--bg-surface)] shadow-lg"
          >
            <nav aria-label="Mobile navigation" className="px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`flex items-center justify-between min-h-[44px] px-3 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--bg-surface-subtle)] text-[var(--accent-primary)]'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive ? (
                      <span className="text-xs font-mono text-[var(--accent-cyan)]">Active</span>
                    ) : null}
                  </a>
                );
              })}

              <div className="pt-3 mt-2 border-t hairline-border">
                <a
                  href="#translator"
                  onClick={(e) => handleLinkClick(e, 'translator')}
                  className="flex items-center justify-center gap-2 min-h-[44px] w-full px-4 py-2.5 text-sm font-semibold rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] transition-colors"
                >
                  <span>Try AuraLink</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
