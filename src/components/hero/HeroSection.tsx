import React from 'react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { SpatialCanvas } from './SpatialCanvas';

interface HeroSectionProps {
  onExploreTranslator: () => void;
  onDiscoverHowItWorks: () => void;
}

export function HeroSection({
  onExploreTranslator,
  onDiscoverHowItWorks,
}: HeroSectionProps) {
  const { reducedMotion } = useTheme();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative min-h-[calc(100vh-1rem)] pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 flex flex-col justify-between overflow-x-clip"
    >
      {/* Subtle architectural coordinate backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 spatial-grid-bg opacity-45 dark:opacity-35 [mask-image:radial-gradient(ellipse_78%_68%_at_58%_42%,#000_25%,transparent_100%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-medium tracking-[0.14em] text-[var(--accent-cyan)] mb-5"
            >
              Beyond Words. Beyond Barriers.
            </motion.p>

            <motion.h1
              id="hero-heading"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-[-0.03em] leading-[1.06] text-[var(--text-primary)] max-w-xl"
            >
              Communication Beyond Words.
            </motion.h1>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl"
            >
              AuraLink AI is an accessibility and communication technology initiative exploring
              Indian Sign Language alphabet recognition, sign-to-text composition, and spoken output
              through a clear, human-centred spatial interface.
            </motion.p>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <button
                type="button"
                onClick={onExploreTranslator}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] text-sm sm:text-base font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Explore Translator</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onDiscoverHowItWorks}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-md border hairline-border-strong bg-[var(--bg-surface)]/80 text-[var(--text-primary)] text-sm sm:text-base font-medium hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Discover How It Works</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </motion.div>

            {/* Unboxed Metadata Bar */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-10 pt-6 border-t hairline-border flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--text-muted)]"
            >
              <span>Indian Sign Language</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Interactive UI Prototype</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>Browser Speech Demo</span>
            </motion.div>
          </div>

          {/* Right Spatial Dimension Visual Stage */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex"
          >
            <div className="relative w-full min-h-[300px] sm:min-h-[380px] lg:min-h-[470px] rounded-xl border hairline-border bg-[var(--bg-surface)]/75 overflow-hidden flex flex-col justify-between">
              {/* Top Spatial Coordinate Caption */}
              <div className="relative z-10 px-5 pt-4 flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                <span>Spatial Signal Bridge</span>
                <span>Gesture ↔ Language</span>
              </div>

              {/* 3D Perspective Canvas */}
              <div className="absolute inset-0">
                <SpatialCanvas />
              </div>

              {/* Bottom Quiet Architectural Legend */}
              <div className="relative z-10 px-5 pb-4 pt-3 mt-auto border-t hairline-border bg-[var(--bg-surface)]/70 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">
                  Visual Expression to Readable Text
                </span>
                <span className="font-mono text-[var(--text-muted)]">
                  Prototype Stage · Recognition Engine Planned
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Conceptual Pillars Strip below the Hero Split */}
        <div className="mt-14 lg:mt-20 pt-8 border-t hairline-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div>
            <p className="font-mono text-xs text-[var(--accent-cyan)] mb-1.5">01 · Language Scope</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Indian Sign Language Alphabet
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Designed around the two-handed and one-handed geometry of ISL manual fingerspelling.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--accent-cyan)] mb-1.5">02 · Interface</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Working Prototype Workspace
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Test camera preview controls, manual ISL character composition, and clipboard tools now.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--accent-cyan)] mb-1.5">03 · Output</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Readable Text & Spoken Demo
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Construct phrases directly and play them aloud via native browser speech synthesis.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs text-[var(--accent-cyan)] mb-1.5">04 · Transparency</p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Honest Research Milestone
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Live computer vision inference is planned for a future phase and never simulated as live AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
