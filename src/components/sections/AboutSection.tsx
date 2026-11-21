import React from 'react';
import { Reveal, SectionHeader } from '../ui/MotionPrimitives';

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-20 sm:py-24 lg:py-32 border-t hairline-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Editorial Narrative Column */}
          <Reveal className="lg:col-span-6">
            <SectionHeader
              headingId="about-heading"
              kicker="About AuraLink AI"
              title="Closing everyday friction between visual language and digital interfaces."
            />

            <div className="mt-8 space-y-5 text-base leading-relaxed text-[var(--text-secondary)] max-w-2xl">
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

          {/* Architectural Editorial Visual Diagram */}
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] p-6 sm:p-8">
              <div className="flex items-center justify-between pb-5 border-b hairline-border">
                <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                  The Communication Gap & Design Response
                </h3>
                <span className="font-mono text-xs text-[var(--text-muted)]">Architecture View</span>
              </div>

              {/* Custom Spatial Communication Flow SVG */}
              <div className="py-7">
                <svg
                  viewBox="0 0 520 210"
                  role="img"
                  aria-label="Diagram illustrating how Indian Sign Language visual expression connects through AuraLink AI to readable text and speech output"
                  className="w-full h-auto"
                >
                  {/* Subtle coordinate lines */}
                  <line
                    x1="24"
                    y1="105"
                    x2="496"
                    y2="105"
                    stroke="currentColor"
                    strokeOpacity="0.12"
                    strokeDasharray="3 5"
                  />

                  {/* Node 1: ISL Signer */}
                  <g transform="translate(82, 105)">
                    <circle
                      r="52"
                      fill="var(--bg-surface-subtle)"
                      stroke="var(--border-strong)"
                      strokeWidth="1.2"
                    />
                    <circle
                      r="36"
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeOpacity="0.45"
                      strokeWidth="1.2"
                    />
                    <circle cx="-10" cy="-8" r="3" fill="var(--accent-primary)" />
                    <circle cx="8" cy="-14" r="3" fill="var(--accent-primary)" />
                    <circle cx="15" cy="2" r="3" fill="var(--accent-primary)" />
                    <circle cx="2" cy="14" r="3" fill="var(--accent-primary)" />
                    <circle cx="-14" cy="9" r="3" fill="var(--accent-primary)" />
                    <path
                      d="M-10 -8 L8 -14 L15 2 L2 14 L-14 9 Z"
                      fill="none"
                      stroke="var(--accent-primary)"
                      strokeWidth="1.2"
                      strokeOpacity="0.7"
                    />
                  </g>
                  <text
                    x="82"
                    y="182"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    Visual Expression
                  </text>
                  <text
                    x="82"
                    y="198"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10.5"
                    fontFamily="DM Sans, sans-serif"
                  >
                    ISL Hand Signs
                  </text>

                  {/* Connecting Arcs */}
                  <path
                    d="M138 92 C185 52, 205 52, 232 92"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="1.6"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M138 118 C185 158, 205 158, 232 118"
                    fill="none"
                    stroke="var(--accent-cyan)"
                    strokeWidth="1.2"
                    strokeOpacity="0.5"
                  />

                  {/* Node 2: AuraLink Core */}
                  <g transform="translate(260, 105)">
                    <polygon
                      points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23"
                      fill="var(--bg-surface-subtle)"
                      stroke="var(--accent-primary)"
                      strokeWidth="1.5"
                    />
                    <circle r="10" fill="var(--accent-primary)" fillOpacity="0.2" />
                    <circle r="4" fill="var(--accent-primary)" />
                  </g>
                  <text
                    x="260"
                    y="182"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    AuraLink Interface
                  </text>
                  <text
                    x="260"
                    y="198"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10.5"
                    fontFamily="DM Sans, sans-serif"
                  >
                    Recognition Roadmap
                  </text>

                  {/* Outgoing Arcs */}
                  <path
                    d="M288 92 C335 52, 355 52, 382 92"
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="1.6"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M288 118 C335 158, 355 158, 382 118"
                    fill="none"
                    stroke="var(--accent-cyan)"
                    strokeWidth="1.2"
                    strokeOpacity="0.5"
                  />

                  {/* Node 3: Accessible Output */}
                  <g transform="translate(438, 105)">
                    <rect
                      x="-48"
                      y="-38"
                      width="96"
                      height="76"
                      rx="8"
                      fill="var(--bg-surface-subtle)"
                      stroke="var(--border-strong)"
                      strokeWidth="1.2"
                    />
                    <line
                      x1="-28"
                      y1="-14"
                      x2="26"
                      y2="-14"
                      stroke="var(--text-primary)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="-28"
                      y1="0"
                      x2="14"
                      y2="0"
                      stroke="var(--accent-primary)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M-28 16 Q-18 8 -8 16 T12 16 T28 16"
                      fill="none"
                      stroke="var(--accent-cyan)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </g>
                  <text
                    x="438"
                    y="182"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="12"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    Text & Speech
                  </text>
                  <text
                    x="438"
                    y="198"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="10.5"
                    fontFamily="DM Sans, sans-serif"
                  >
                    Shared Understanding
                  </text>
                </svg>
              </div>

              {/* Three Quiet Design Commitments */}
              <div className="pt-5 border-t hairline-border grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <p className="text-xs font-mono text-[var(--accent-cyan)]">Principle 01</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                    Dignity First
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Built as a mutual communication tool, never framing signers as passive recipients.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--accent-cyan)]">Principle 02</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                    ISL Specificity
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Respects Indian Sign Language conventions rather than reusing ASL assumptions.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[var(--accent-cyan)]">Principle 03</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                    Clear Boundaries
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    Explicitly separates working interface prototypes from planned ML capabilities.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
