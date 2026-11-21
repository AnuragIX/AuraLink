import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { EASE_SIGNAL, Reveal, SectionHeader } from '../ui/MotionPrimitives';

const DESIGN_COMMITMENTS = [
  {
    number: '01',
    accentClass: 'text-[var(--accent-coral-text)]',
    title: 'Dignity First',
    body: 'Built as a mutual communication tool, never framing signers as passive recipients.',
  },
  {
    number: '02',
    accentClass: 'text-[var(--accent-ink)]',
    title: 'ISL Specificity',
    body: 'Respects Indian Sign Language conventions—including two-handed manual forms—rather than reusing ASL assumptions.',
  },
  {
    number: '03',
    accentClass: 'text-[var(--accent-mint-text)]',
    title: 'Clear Boundaries',
    body: 'Explicitly separates working interface prototypes from planned machine learning capabilities.',
  },
] as const;

export function AboutSection() {
  const { reducedMotion } = useTheme();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-20 sm:py-28 lg:py-32 border-t hairline-border bg-[var(--bg-canvas)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetric Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Narrative Column (5 cols) */}
          <Reveal className="lg:col-span-5">
            <SectionHeader
              index="01"
              headingId="about-heading"
              kicker="Mission & Purpose"
              title="Closing everyday friction between visual language and digital interfaces."
            />

            <div className="mt-8 space-y-5 text-base leading-[1.72] text-[var(--text-secondary)]">
              <p>
                Indian Sign Language is a rich, complete visual-spatial language used across India,
                yet most everyday digital systems—public kiosks, classrooms, clinics, and workplace
                software—still assume spoken or typed input as the default.
              </p>
              <p>
                AuraLink AI is being built to reduce that gap with clarity and respect. The project
                envisions an accessible bridge where recognised Indian Sign Language hand signs can
                translate into legible text and optional speech output, enabling smoother everyday
                exchanges between signers and non-signers.
              </p>
              <p>
                In this initial engineering phase, we are establishing the complete product
                architecture and an interactive translator prototype so the communication workflow,
                accessibility ergonomics, and user experience can be evaluated and refined before
                connecting a dedicated recognition model.
              </p>
            </div>
          </Reveal>

          {/* Sculptural Architecture Composition (7 cols) */}
          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] overflow-hidden">
              <div className="px-6 py-4 border-b hairline-border flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                  The Communication Gap &amp; Design Response
                </h3>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  Human Signal Architecture
                </span>
              </div>

              {/* Expressive Geometric Signal Flow Diagram */}
              <div className="px-4 sm:px-8 py-8 sm:py-10 bg-[var(--bg-surface)]">
                <svg
                  viewBox="0 0 560 236"
                  role="img"
                  aria-label="Diagram illustrating how Indian Sign Language visual expression connects through AuraLink AI to readable text and speech output"
                  className="w-full h-auto"
                >
                  {/* Baseline coordinate axis */}
                  <line
                    x1="28"
                    y1="108"
                    x2="532"
                    y2="108"
                    stroke="var(--border-strong)"
                    strokeDasharray="3 6"
                    strokeWidth="1"
                  />

                  {/* Node 1: Visual Expression (Human Coral) */}
                  <g transform="translate(92, 108)">
                    <circle
                      r="56"
                      fill="var(--bg-surface-subtle)"
                      stroke="var(--border-strong)"
                      strokeWidth="1.2"
                    />
                    <circle
                      r="39"
                      fill="none"
                      stroke="var(--accent-coral)"
                      strokeOpacity="0.6"
                      strokeWidth="1.4"
                    />
                    <circle cx="-13" cy="-10" r="3.6" fill="var(--accent-coral)" />
                    <circle cx="9" cy="-16" r="3.6" fill="var(--accent-coral)" />
                    <circle cx="17" cy="4" r="3.6" fill="var(--accent-coral)" />
                    <circle cx="2" cy="17" r="3.6" fill="var(--accent-coral)" />
                    <circle cx="-16" cy="11" r="3.6" fill="var(--accent-coral)" />
                    <path
                      d="M-13 -10 L9 -16 L17 4 L2 17 L-16 11 Z"
                      fill="none"
                      stroke="var(--accent-coral)"
                      strokeWidth="1.4"
                      strokeOpacity="0.78"
                    />
                  </g>
                  <text
                    x="92"
                    y="194"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="12.5"
                    fontWeight="600"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    Visual Expression
                  </text>
                  <text
                    x="92"
                    y="212"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10.5"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    ISL Signer Input
                  </text>

                  {/* Signal Paths 1 -> 2 */}
                  <motion.path
                    d="M152 92 C196 48, 218 48, 240 92"
                    fill="none"
                    stroke="var(--accent-coral)"
                    strokeWidth="1.8"
                    initial={reducedMotion ? false : { pathLength: 0, opacity: 0.3 }}
                    whileInView={{ pathLength: 1, opacity: 0.9 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.85, ease: EASE_SIGNAL }}
                  />
                  <motion.path
                    d="M152 124 C196 168, 218 168, 240 124"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="1.5"
                    initial={reducedMotion ? false : { pathLength: 0, opacity: 0.25 }}
                    whileInView={{ pathLength: 1, opacity: 0.72 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.85, delay: 0.12, ease: EASE_SIGNAL }}
                  />

                  {/* Node 2: AuraLink Core (Signal Blue) */}
                  <g transform="translate(280, 108)">
                    <polygon
                      points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26"
                      fill="var(--bg-contrast)"
                      stroke="var(--accent-primary)"
                      strokeWidth="2"
                    />
                    <polygon
                      points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
                      fill="none"
                      stroke="var(--accent-mint)"
                      strokeOpacity="0.48"
                      strokeWidth="1.1"
                    />
                    <circle r="11" fill="var(--accent-primary)" fillOpacity="0.28" />
                    <circle r="4.5" fill="#ffffff" />
                  </g>
                  <text
                    x="280"
                    y="194"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="12.5"
                    fontWeight="600"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    AuraLink Interface
                  </text>
                  <text
                    x="280"
                    y="212"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10.5"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    Recognition Roadmap
                  </text>

                  {/* Signal Paths 2 -> 3 */}
                  <motion.path
                    d="M320 92 C342 48, 364 48, 408 92"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="1.8"
                    initial={reducedMotion ? false : { pathLength: 0, opacity: 0.3 }}
                    whileInView={{ pathLength: 1, opacity: 0.9 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.85, delay: 0.2, ease: EASE_SIGNAL }}
                  />
                  <motion.path
                    d="M320 124 C342 168, 364 168, 408 124"
                    fill="none"
                    stroke="var(--accent-mint-text)"
                    strokeWidth="1.5"
                    initial={reducedMotion ? false : { pathLength: 0, opacity: 0.25 }}
                    whileInView={{ pathLength: 1, opacity: 0.78 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.85, delay: 0.3, ease: EASE_SIGNAL }}
                  />

                  {/* Node 3: Accessible Output (Soft Mint) */}
                  <g transform="translate(468, 108)">
                    <rect
                      x="-52"
                      y="-42"
                      width="104"
                      height="84"
                      rx="10"
                      fill="var(--bg-surface-subtle)"
                      stroke="var(--border-strong)"
                      strokeWidth="1.2"
                    />
                    <line
                      x1="-30"
                      y1="-16"
                      x2="28"
                      y2="-16"
                      stroke="var(--text-primary)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="-30"
                      y1="-1"
                      x2="14"
                      y2="-1"
                      stroke="var(--accent-primary)"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-30 18 Q-19 8 -8 18 T14 18 T30 18"
                      fill="none"
                      stroke="var(--accent-mint-text)"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                    />
                  </g>
                  <text
                    x="468"
                    y="194"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="12.5"
                    fontWeight="600"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    Text &amp; Speech
                  </text>
                  <text
                    x="468"
                    y="212"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10.5"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    Shared Understanding
                  </text>
                </svg>
              </div>

              {/* Editorial Summary Footnote */}
              <div className="px-6 py-4 border-t hairline-border bg-[var(--bg-surface-subtle)]/55 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                <span>Human-centred communication bridge built around ISL ergonomics.</span>
                <span className="font-mono text-[var(--text-muted)]">
                  Prototype UI Live · Vision Model Planned
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Full-Width Hairline-Ruled Design Commitments (Zero Box-in-Box Clutter) */}
        <Reveal delay={0.18} className="mt-16 lg:mt-20 pt-10 border-t hairline-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {DESIGN_COMMITMENTS.map((item) => (
              <div key={item.number} className="flex flex-col">
                <p className={`font-mono text-xs font-medium tabular-nums ${item.accentClass}`}>
                  Principle {item.number}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
