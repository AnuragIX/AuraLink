import React, { useState } from 'react';
import { Reveal, SectionHeader } from '../ui/MotionPrimitives';

const IMPACT_IMAGE_SRC = '/src/assets/images/accessibility_impact_dialogue_1795267910229.jpg';

const ACCESSIBILITY_PILLARS = [
  {
    title: 'Shared Responsibility in Communication',
    body: 'Communication barriers do not reside in signers—they emerge when institutions and software ignore visual languages. AuraLink AI treats sign language as a primary, equal modality.',
  },
  {
    title: 'Autonomy in Public & Everyday Spaces',
    body: 'Whether collaborating in a studio, checking in at a clinic, or navigating university offices, accessible sign-to-text tools are intended to support direct independence without requiring an intermediary for routine interactions.',
  },
  {
    title: 'Inclusive Interface Engineering Today',
    body: 'Before any machine learning model ships, the web platform itself practices accessible engineering: semantic landmarks, full keyboard operation, high-contrast dual themes, screen-reader announcements, and reduced-motion support.',
  },
];

export function AccessibilityImpactSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="accessibility"
      aria-labelledby="accessibility-heading"
      className="py-20 sm:py-24 lg:py-32 border-t hairline-border bg-[var(--bg-surface-subtle)]/45"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            headingId="accessibility-heading"
            kicker="Accessibility & Human Impact"
            title="Technology built for autonomy, reciprocity, and inclusion."
            description="Deaf and hard-of-hearing communities already communicate with fluency and precision. AuraLink AI is designed as a practical bridge so everyday environments can meet signers halfway."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Documentary Editorial Photograph with Resilient Fallback */}
          <Reveal className="lg:col-span-7 flex">
            <figure className="w-full rounded-xl border hairline-border bg-[var(--bg-surface)] overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:flex-1 min-h-[260px] w-full bg-[var(--bg-surface-subtle)] overflow-hidden">
                {!imageError ? (
                  <img
                    src={IMPACT_IMAGE_SRC}
                    alt="Two colleagues in a sunlit contemporary studio conversing naturally using Indian Sign Language"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                    <p className="font-display text-lg font-semibold text-[var(--text-primary)]">
                      Human-Centred Visual Communication
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-sm">
                      Supporting direct, respectful communication across workplaces, campuses, and
                      civic spaces.
                    </p>
                  </div>
                )}
              </div>
              <figcaption className="px-5 py-3.5 border-t hairline-border text-xs text-[var(--text-muted)] flex flex-wrap items-center justify-between gap-2">
                <span>
                  Designed to support mutual communication in workplaces, classrooms, and public
                  services.
                </span>
                <span className="font-mono">Human-Centred Accessibility</span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Editorial Principles Stack */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            {ACCESSIBILITY_PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.08}>
                <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] p-6">
                  <p className="font-mono text-xs text-[var(--accent-cyan)]">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-[var(--text-primary)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
