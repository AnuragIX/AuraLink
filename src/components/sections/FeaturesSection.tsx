import React from 'react';
import { Reveal, SectionHeader } from '../ui/MotionPrimitives';

interface FeatureItem {
  index: string;
  title: string;
  capabilityStatus: string;
  description: string;
  details: string;
  spanClass: string;
}

const FEATURES: readonly FeatureItem[] = [
  {
    index: '01',
    title: 'ISL Alphabet Recognition',
    capabilityStatus: 'Planned Capability · Engine In Development',
    description:
      'Designed specifically around the hand shapes and two-handed formations of the Indian Sign Language alphabet (A–Z), rather than adapting foreign single-handed sign datasets.',
    details:
      'Currently represented via manual alphabet selection inside the interactive prototype while dataset curation and model engineering proceed.',
    spanClass: 'lg:col-span-7',
  },
  {
    index: '02',
    title: 'Sign-to-Text Conversion',
    capabilityStatus: 'Prototype Workflow · Active UI',
    description:
      'Converts sequential character inputs into clean, high-contrast readable text with immediate editing, word spacing, backspace, and one-click clipboard copy.',
    details:
      'Built to minimize visual fatigue with crisp typography and generous spatial breathing room across phones and desktop displays.',
    spanClass: 'lg:col-span-5',
  },
  {
    index: '03',
    title: 'Text-to-Speech Concept',
    capabilityStatus: 'Browser Demonstration · Speech API',
    description:
      'Transforms composed text into natural spoken audio so signers can bridge quick in-person conversations with listeners who do not read or know Indian Sign Language.',
    details:
      'Powered in this prototype by the browser’s native Web Speech synthesis API with graceful feedback when voices are unavailable.',
    spanClass: 'lg:col-span-4',
  },
  {
    index: '04',
    title: 'Accessible Interface',
    capabilityStatus: 'Implemented · WCAG-Focused Design',
    description:
      'Keyboard-navigable controls, visible focus indicators, screen-reader status announcements, adaptive light/dark contrast, and full reduced-motion compliance.',
    details:
      'Every interaction—from navigation to character selection—respects minimum touch targets and clear visual hierarchy.',
    spanClass: 'lg:col-span-4',
  },
  {
    index: '05',
    title: 'Real-Time Communication Vision',
    capabilityStatus: 'Long-Term Research Direction',
    description:
      'Looking beyond individual alphabet letters toward continuous gesture transitions, conversational phrase assembly, and low-latency on-device accessibility.',
    details:
      'Architected so future local inference modules can plug into the same calm, predictable interface without disrupting user ergonomics.',
    spanClass: 'lg:col-span-4',
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-20 sm:py-24 lg:py-32 border-t hairline-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            headingId="features-heading"
            kicker="Core Capabilities"
            title="Purpose-built for clarity, honesty, and everyday usability."
            description="Each capability below is clearly distinguished between what works inside today’s interactive prototype and what belongs to the upcoming recognition engine."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {FEATURES.map((feature, idx) => (
            <Reveal key={feature.index} delay={idx * 0.05} className={feature.spanClass}>
              <article className="h-full rounded-xl border hairline-border bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between transition-colors duration-200 hover:border-[var(--accent-primary)]/60">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b hairline-border">
                    <span className="font-mono text-xs text-[var(--accent-cyan)]">
                      {feature.index}
                    </span>
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {feature.capabilityStatus}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                    {feature.description}
                  </p>
                </div>

                <p className="mt-6 pt-4 border-t hairline-border text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]">
                  {feature.details}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
