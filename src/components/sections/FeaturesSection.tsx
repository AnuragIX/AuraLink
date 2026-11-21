import React from 'react';
import { Reveal, SectionHeader } from '../ui/MotionPrimitives';

const SECONDARY_FEATURES = [
  {
    index: '03',
    accentClass: 'text-[var(--accent-coral-text)]',
    title: 'Text-to-Speech Concept',
    capabilityStatus: 'Browser Demonstration · Speech API',
    description:
      'Transforms composed text into natural spoken audio so signers can bridge quick in-person conversations with listeners who do not read or know Indian Sign Language.',
    details:
      'Powered in this prototype by the browser’s native Web Speech synthesis API with graceful feedback when voices are unavailable.',
  },
  {
    index: '04',
    accentClass: 'text-[var(--accent-mint-text)]',
    title: 'Accessible Interface',
    capabilityStatus: 'Implemented · WCAG-Focused Design',
    description:
      'Keyboard-navigable controls, visible focus indicators, screen-reader status announcements, adaptive light/dark contrast, and full reduced-motion compliance.',
    details:
      'Every interaction—from navigation to character selection—respects minimum touch targets and clear visual hierarchy.',
  },
  {
    index: '05',
    accentClass: 'text-[var(--accent-ink)]',
    title: 'Real-Time Communication Vision',
    capabilityStatus: 'Long-Term Research Direction',
    description:
      'Looking beyond individual alphabet letters toward continuous gesture transitions, conversational phrase assembly, and low-latency on-device accessibility.',
    details:
      'Architected so future local inference modules can plug into the same calm, predictable interface without disrupting user ergonomics.',
  },
] as const;

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 sm:py-28 lg:py-32 border-t hairline-border bg-[var(--bg-canvas)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            index="03"
            headingId="features-heading"
            kicker="Core Capabilities"
            title="Purpose-built for clarity, honesty, and everyday usability."
            description="Each capability below is clearly distinguished between what works inside today’s interactive prototype and what belongs to the upcoming recognition engine."
          />
        </Reveal>

        {/* Row 1: Asymmetric Editorial Marquee Split (Signal Blue plane + Warm Porcelain Specimen) */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Feature 01 — Signature Signal Blue Architectural Block (7 cols) */}
          <Reveal className="lg:col-span-7 flex">
            <article className="w-full rounded-xl bg-[var(--accent-primary)] text-white p-7 sm:p-10 flex flex-col justify-between overflow-hidden relative">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-white/20">
                  <span className="font-mono text-xs text-white/85 tabular-nums">01</span>
                  <span className="font-mono text-xs text-white/85">
                    Planned Capability · Engine In Development
                  </span>
                </div>

                <h3 className="mt-7 font-display text-2xl sm:text-3xl lg:text-[2.1rem] font-bold tracking-[-0.025em] leading-[1.12] text-white max-w-lg">
                  ISL Alphabet Recognition
                </h3>

                <p className="mt-4 text-base leading-relaxed text-white/90 max-w-xl">
                  Designed specifically around the hand shapes and two-handed formations of the
                  Indian Sign Language alphabet (A–Z), rather than adapting foreign single-handed
                  sign datasets.
                </p>
              </div>

              <div className="mt-10 pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <p className="text-sm leading-relaxed text-white/85 max-w-md">
                  Currently represented via manual alphabet selection inside the interactive
                  prototype while dataset curation and model engineering proceed.
                </p>
                <span className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-[var(--accent-mint)] shrink-0 leading-none">
                  A–Z
                </span>
              </div>
            </article>
          </Reveal>

          {/* Feature 02 — Warm Porcelain Editorial Typography Specimen (5 cols) */}
          <Reveal delay={0.08} className="lg:col-span-5 flex">
            <article className="w-full rounded-xl border hairline-border bg-[var(--bg-surface)] p-7 sm:p-9 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b hairline-border">
                  <span className="font-mono text-xs text-[var(--accent-coral-text)] tabular-nums">
                    02
                  </span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    Prototype Workflow · Active UI
                  </span>
                </div>

                <h3 className="mt-7 font-display text-2xl sm:text-3xl font-bold tracking-[-0.025em] leading-[1.12] text-[var(--text-primary)]">
                  Sign-to-Text Conversion
                </h3>

                <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                  Converts sequential character inputs into clean, high-contrast readable text with
                  immediate editing, word spacing, backspace, and one-click clipboard copy.
                </p>
              </div>

              {/* Clean typographic transformation bar */}
              <div className="mt-8 pt-5 border-t hairline-border">
                <div
                  aria-hidden="true"
                  className="mb-4 px-4 py-3 rounded-lg bg-[var(--bg-surface-subtle)] flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]"
                >
                  <span>A · U · R · A</span>
                  <span className="text-[var(--accent-ink)]">→</span>
                  <span className="font-display text-sm font-bold text-[var(--text-primary)] tracking-[0.04em]">
                    AURA
                  </span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]">
                  Built to minimize visual fatigue with crisp typography and generous spatial
                  breathing room across phones and desktop displays.
                </p>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Row 2: Hairline-Ruled 3-Column Editorial Capability Ledger (No Repetitive Boxes) */}
        <div className="mt-14 pt-10 border-t hairline-border grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {SECONDARY_FEATURES.map((feature, idx) => (
            <Reveal key={feature.index} delay={idx * 0.06} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b hairline-border">
                  <span className={`font-mono text-xs font-medium tabular-nums ${feature.accentClass}`}>
                    {feature.index}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    {feature.capabilityStatus}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </div>

              <p className="mt-5 pt-4 border-t hairline-border text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]">
                {feature.details}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
