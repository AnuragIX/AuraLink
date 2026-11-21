/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { TranslatorWorkspace } from './components/translator/TranslatorWorkspace';
import { TechnologySection } from './components/sections/TechnologySection';
import { AccessibilityImpactSection } from './components/sections/AccessibilityImpactSection';
import { Footer } from './components/layout/Footer';

const OBSERVED_SECTION_IDS = ['home', 'about', 'how-it-works', 'features', 'translator'];

function AuraLinkAppShell() {
  const { reducedMotion } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('home');

  const navigateToSection = useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId);
      if (!target) return;
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      if (OBSERVED_SECTION_IDS.includes(sectionId)) {
        setActiveSection(sectionId);
      }
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${sectionId}`);
      }
    },
    [reducedMotion],
  );

  useEffect(() => {
    const sections = OBSERVED_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-28% 0px -52% 0px',
        threshold: [0.1, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Skip to Main Content Link for Keyboard & Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-md focus:bg-[var(--accent-primary)] focus:text-[var(--accent-contrast-text)] focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} onNavigate={navigateToSection} />

      <main id="main-content" className="flex-1">
        <HeroSection
          onExploreTranslator={() => navigateToSection('translator')}
          onDiscoverHowItWorks={() => navigateToSection('how-it-works')}
        />
        <AboutSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TranslatorWorkspace />
        <TechnologySection />
        <AccessibilityImpactSection />
      </main>

      <Footer onNavigate={navigateToSection} />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AuraLinkAppShell />
      </ThemeProvider>
    </MotionConfig>
  );
}
