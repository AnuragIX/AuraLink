import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { EASE_SIGNAL, Reveal, SectionHeader } from '../ui/MotionPrimitives';

const IMPACT_IMAGE_SRC = '/src/assets/images/accessibility_impact_dialogue_1795267910229.jpg';

const ACCESSIBILITY_PILLARS = [
  {
    index: '01',
    accentClass: 'text-[var(--accent-coral-text)]',
    title: 'Shared Responsibility in Communication',
    body: 'Communication barriers do not reside in signers—they emerge when institutions and software ignore visual languages. AuraLink AI treats sign language as a primary, equal modality.',
  },
  {
    index: '02',
    accentClass: 'text-[var(--accent-ink)]',
    title: 'Autonomy in Public & Everyday Spaces',
    body: 'Whether collaborating in a studio, checking in at a clinic, or navigating university offices, accessible sign-to-text tools are intended to support direct independence without requiring an intermediary for routine interactions.',
  },
  {
    index: '03',
    accentClass: 'text-[var(--accent-mint-text)]',
    title: 'Inclusive Interface Engineering Today',
    body: 'Before any machine learning model ships, the web platform itself practices accessible engineering: semantic landmarks, full keyboard operation, high-contrast dual themes, screen-reader announcements, and reduced-motion support.',
  },
] as const;

export function AccessibilityImpactSection() {
  const { reducedMotion } = useTheme();
  const [imageError, setImageError] = useState(false);

  return (
    <section
      id="accessibility"
      aria-labelledby="accessibility-heading"
      className="py-20 sm:py-28 lg:py-32 border-t hairline-border bg-[var(--bg-surface-subtle)]/55"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            index="06"
            headingId="accessibility-heading"
            kicker="Accessibility & Human Impact"
            title="Technology built for autonomy, reciprocity, and inclusion."
            description="Deaf and hard-of-hearing communities already communicate with fluency and precision. AuraLink AI is designed as a practical bridge so everyday environments can meet signers halfway."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Editorial Documentary Photograph with Smooth Reveal & Resilient Fallback */}
          <Reveal className="lg:col-span-7 flex">
            <figure className="w-full rounded-xl border hairline-border bg-[var(--bg-surface)] overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:flex-1 min-h-[280px] w-full bg-[var(--bg-contrast)] overflow-hidden">
                {!imageError ? (
                  <motion.img
                    src={IMPACT_IMAGE_SRC}
                    alt="Two colleagues in a sunlit contemporary studio conversing naturally using Indian Sign Language"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    initial={reducedMotion ? false : { scale: 1.05, opacity: 0.85 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.85, ease: EASE_SIGNAL }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-[var(--text-on-contrast)]">
                    <p className="font-display text-lg font-semibold">
                      Human-Centred Visual Communication
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-on-contrast-muted)] max-w-sm">
                      Supporting direct, respectful communication across workplaces, campuses, and
                      civic spaces.
                    </p>
                  </div>
                )}
              </div>

              <figcaption className="px-5 sm:px-6 py-4 border-t hairline-border bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] flex flex-wrap items-center justify-between gap-2">
                <span>
                  Designed to support mutual communication in workplaces, classrooms, and public
                  services.
                </span>
                <span className="font-mono text-[var(--accent-ink)]">
                  Human-Centred Accessibility
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Editorial Hairline-Divided Essays (Zero Repetitive Cards) */}
          <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-[var(--border-hairline)] border-y hairline-border">
            {ACCESSIBILITY_PILLARS.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.08} className="py-6 sm:py-7">
                <p className={`font-mono text-xs font-medium tabular-nums ${pillar.accentClass}`}>
                  {pillar.index}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {pillar.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
