import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { EASE_SIGNAL, ScrollProgressBar } from '../ui/MotionPrimitives';

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

export function AuraLinkMark({ onContrast = false }: { onContrast?: boolean }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1.5"
        y="1.5"
        width="25"
        height="25"
        rx="6"
        stroke="currentColor"
        strokeOpacity={onContrast ? '0.26' : '0.2'}
        strokeWidth="1.25"
      />
      <path
        d="M6.5 17.5C9.5 11.8 18.5 11.8 21.5 17.5"
        stroke="var(--accent-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.75 12.2C12 8.8 16 8.8 18.25 12.2"
        stroke={onContrast ? 'var(--accent-mint)' : 'currentColor'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity={onContrast ? '0.95' : '0.82'}
      />
      <circle cx="14" cy="18.6" r="2.3" fill="var(--accent-coral)" />
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
      setIsScrolled(window.scrollY > 20);
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
          ? 'bg-[var(--bg-canvas)]/92 backdrop-blur-md border-b hairline-border'
          : 'bg-[var(--bg-canvas)]/75 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className="flex items-center gap-2.5 text-[var(--text-primary)] whitespace-nowrap shrink-0 focus-visible:rounded-sm group"
        >
          <AuraLinkMark />
          <span className="font-display text-base sm:text-lg font-bold tracking-[-0.03em]">
            AuraLink AI
          </span>
        </a>

        {/* Zone 2: Primary Single-Line Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
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
                    transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--accent-primary)]"
                    aria-hidden="true"
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle + Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md border hairline-border bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer shrink-0"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={reducedMotion ? false : { opacity: 0, rotate: -35, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, rotate: 35, scale: 0.8 }}
                transition={{ duration: 0.16, ease: EASE_SIGNAL }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.a
            href="#translator"
            onClick={(e) => handleLinkClick(e, 'translator')}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] hover:bg-[var(--accent-primary-hover)] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Try AuraLink</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </motion.a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border hairline-border bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Subtle Scroll Progress Hairline */}
      <div className="h-[2px] w-full overflow-hidden">
        <ScrollProgressBar />
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            id="mobile-navigation-drawer"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: EASE_SIGNAL }}
            className="md:hidden border-b hairline-border bg-[var(--bg-surface)] shadow-xl"
          >
            <nav aria-label="Mobile navigation" className="px-4 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03, ease: EASE_SIGNAL }}
                    onClick={(e) => handleLinkClick(e, item.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`flex items-center justify-between min-h-[44px] px-3.5 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--bg-surface-subtle)] text-[var(--accent-ink)]'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-subtle)]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {isActive ? 'Current' : `0${idx + 1}`}
                    </span>
                  </motion.a>
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
