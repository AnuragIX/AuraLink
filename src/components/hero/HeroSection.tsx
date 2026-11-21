import React, { useRef } from 'react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { EASE_SIGNAL, MaskedLine } from '../ui/MotionPrimitives';
import { SpatialCanvas } from './SpatialCanvas';

interface HeroSectionProps {
  onExploreTranslator: () => void;
  onDiscoverHowItWorks: () => void;
}

const HERO_PILLARS = [
  {
    index: '01',
    label: 'Language Scope',
    accentClass: 'text-[var(--accent-ink)]',
    title: 'Indian Sign Language Alphabet',
    description:
      'Designed around the two-handed and one-handed geometry of ISL manual fingerspelling.',
  },
  {
    index: '02',
    label: 'Interface',
    accentClass: 'text-[var(--accent-coral-text)]',
    title: 'Working Prototype Workspace',
    description:
      'Test local camera preview controls, manual ISL character composition, and clipboard tools now.',
  },
  {
    index: '03',
    label: 'Output',
    accentClass: 'text-[var(--accent-mint-text)]',
    title: 'Readable Text & Spoken Demo',
    description:
      'Construct phrases directly and play them aloud via native browser speech synthesis.',
  },
  {
    index: '04',
    label: 'Transparency',
    accentClass: 'text-[var(--text-muted)]',
    title: 'Honest Research Milestone',
    description:
      'Live computer vision inference is planned for a future phase and never simulated as live AI.',
  },
] as const;

export function HeroSection({
  onExploreTranslator,
  onDiscoverHowItWorks,
}: HeroSectionProps) {
  const { reducedMotion } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const sculptureY = useTransform(scrollYProgress, [0, 1], [0, 36]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="hero-heading"
      className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 overflow-x-clip"
    >
      {/* Subtle architectural editorial grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 editorial-grid-bg opacity-50 dark:opacity-35 [mask-image:radial-gradient(ellipse_75%_65%_at_65%_38%,#000_20%,transparent_100%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Editorial Split Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Editorial Statement Plane */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between py-2 lg:py-4">
            <div>
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE_SIGNAL }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[var(--text-muted)] mb-7"
              >
                <span className="text-[var(--accent-ink)] font-medium">AuraLink AI</span>
                <span aria-hidden="true">/</span>
                <span>Indian Sign Language Communication</span>
              </motion.div>

              <h1
                id="hero-heading"
                className="font-display text-[2.25rem] sm:text-[3.35rem] lg:text-[3.55rem] xl:text-[4.15rem] font-bold tracking-[-0.036em] leading-[1.03] text-[var(--text-primary)]"
              >
                <MaskedLine delay={0.05}>Beyond words.</MaskedLine>
                <MaskedLine delay={0.14}>
                  Closer{' '}
                  <span className="text-[var(--accent-ink)]">connections.</span>
                </MaskedLine>
              </h1>

              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.58, delay: 0.24, ease: EASE_SIGNAL }}
                className="mt-7 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl"
              >
                AuraLink AI is an accessibility and communication technology initiative exploring
                Indian Sign Language alphabet recognition, sign-to-text composition, and spoken
                output through a clear, human-centred interface.
              </motion.p>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, delay: 0.32, ease: EASE_SIGNAL }}
                className="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5"
              >
                <motion.button
                  type="button"
                  onClick={onExploreTranslator}
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3 rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] text-sm sm:text-base font-semibold hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Explore Translator</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={onDiscoverHowItWorks}
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm sm:text-base font-medium hover:border-[var(--accent-primary)] hover:text-[var(--accent-ink)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Discover How It Works</span>
                  <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </motion.div>
            </div>

            {/* Quiet Unboxed Editorial Metadata Footer */}
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="mt-10 lg:mt-14 pt-6 border-t hairline-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs font-mono text-[var(--text-muted)]"
            >
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span>ISL Alphabet Prototype</span>
                <span aria-hidden="true">·</span>
                <span>Local Camera Preview</span>
                <span aria-hidden="true">·</span>
                <span>Browser Speech Demo</span>
              </div>
              <span className="text-[var(--accent-coral-text)]">Beyond Barriers</span>
            </motion.div>
          </div>

          {/* Right Sculptural Midnight Ink Signal Stage */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.72, delay: 0.14, ease: EASE_SIGNAL }}
            className="lg:col-span-6 xl:col-span-5 flex"
          >
            <div className="relative w-full min-h-[360px] sm:min-h-[430px] lg:min-h-[520px] rounded-xl bg-[var(--bg-contrast)] text-[var(--text-on-contrast)] border contrast-border overflow-hidden flex flex-col justify-between">
              {/* Top Chromatic Signal Bar (Human Coral · Signal Blue · Soft Mint) */}
              <div
                aria-hidden="true"
                className="relative z-20 grid grid-cols-12 h-1.5 w-full shrink-0"
              >
                <div className="col-span-3 bg-[var(--accent-coral)]" />
                <div className="col-span-6 bg-[var(--accent-primary)]" />
                <div className="col-span-3 bg-[var(--accent-mint)]" />
              </div>

              {/* Top Coordinate Header */}
              <div className="relative z-10 px-5 pt-4 flex items-center justify-between gap-3 text-[11px] font-mono text-[var(--text-on-contrast-muted)]">
                <span>Human Signal Field</span>
                <span className="text-[var(--accent-mint)]">Gesture → Language</span>
              </div>

              {/* 3D Interactive Signal Sculpture */}
              <motion.div
                style={reducedMotion ? undefined : { y: sculptureY }}
                className="absolute inset-0 top-6 bottom-20"
              >
                <SpatialCanvas />
              </motion.div>

              {/* Bottom Anchored Architectural Statement Block */}
              <div className="relative z-10 mt-auto px-5 py-4 border-t contrast-border bg-[var(--bg-contrast-surface)]/92 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-sm sm:text-base font-semibold text-[var(--text-on-contrast)] leading-snug">
                      Visual expression translated into clear, shared language.
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-[var(--text-on-contrast-muted)]">
                      Interactive UI Prototype · Recognition Engine Planned
                    </p>
                  </div>
                  <div
                    aria-hidden="true"
                    className="hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] text-[var(--text-on-contrast-muted)] shrink-0"
                  >
                    <span className="text-[var(--accent-coral)]">01 Expression</span>
                    <span className="text-[#8aa4ff]">02 Signal</span>
                    <span className="text-[var(--accent-mint)]">03 Output</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Editorial Index Strip (Hairline-Ruled, Zero Nested Card Clutter) */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.36, ease: EASE_SIGNAL }}
          className="mt-14 lg:mt-20 pt-8 border-t hairline-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {HERO_PILLARS.map((pillar) => (
            <div key={pillar.index} className="flex flex-col">
              <div className="flex items-center gap-2 font-mono text-xs mb-2.5">
                <span className={`font-medium tabular-nums ${pillar.accentClass}`}>
                  {pillar.index}
                </span>
                <span aria-hidden="true" className="text-[var(--border-strong)]">
                  /
                </span>
                <span className="text-[var(--text-muted)]">{pillar.label}</span>
              </div>
              <h2 className="font-display text-base font-bold tracking-[-0.015em] text-[var(--text-primary)]">
                {pillar.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {pillar.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
