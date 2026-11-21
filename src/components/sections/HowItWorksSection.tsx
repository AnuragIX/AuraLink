import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, Cpu, MessageSquareText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { EASE_SIGNAL, Reveal, SectionHeader } from '../ui/MotionPrimitives';

interface WorkflowStage {
  id: 'capture' | 'recognise' | 'communicate';
  number: string;
  title: string;
  headline: string;
  summary: string;
  detail: string;
  prototypeNote: string;
}

const STAGES: readonly WorkflowStage[] = [
  {
    id: 'capture',
    number: '01',
    title: 'Capture',
    headline: 'A user presents an ISL hand sign.',
    summary:
      'In a standard browser or device viewport, the signer positions one or both hands within an accessible framing guide with clear visual confirmation of lighting and camera status.',
    detail:
      'Permission is strictly user-initiated. In this prototype, the camera module requests permission only on click and previews video locally without transmitting or analysing frames.',
    prototypeNote: 'Camera preview available in prototype · Frame inference not yet active',
  },
  {
    id: 'recognise',
    number: '02',
    title: 'Recognise',
    headline: 'A future recognition engine analyses the hand configuration.',
    summary:
      'The planned computer vision pipeline will detect spatial joint coordinates across one or both hands and classify static and transitional Indian Sign Language alphabet signs.',
    detail:
      'No live computer vision model runs in this prototype phase. Instead, the Translator workspace provides manual ISL A–Z selection so the downstream workflow can be tested accurately.',
    prototypeNote: 'Illustrative stage · ML recognition engine scheduled for a future phase',
  },
  {
    id: 'communicate',
    number: '03',
    title: 'Communicate',
    headline: 'Recognised output is converted into readable text and potentially speech.',
    summary:
      'Selected or recognised characters assemble immediately into legible, high-contrast text that can be edited, copied, saved to session history, or spoken aloud.',
    detail:
      'Text composition, clipboard copying, session history, and browser text-to-speech playback are fully interactive inside the Translator workspace today.',
    prototypeNote: 'Text composition & browser speech demo operational in workspace',
  },
];

function StageVisual({ stageId }: { stageId: WorkflowStage['id'] }) {
  if (stageId === 'capture') {
    return (
      <svg
        viewBox="0 0 460 272"
        role="img"
        aria-label="Abstract optical framing diagram for Stage 01 Capture: local camera viewport boundaries and spatial focal plane"
        className="w-full h-auto"
      >
        {/* Optical viewport reticle corners */}
        <path d="M54 44 H94 M54 44 V84" stroke="#FF725E" strokeWidth="2.2" fill="none" />
        <path d="M406 44 H366 M406 44 V84" stroke="#FF725E" strokeWidth="2.2" fill="none" />
        <path d="M54 216 H94 M54 216 V176" stroke="#FF725E" strokeWidth="2.2" fill="none" />
        <path d="M406 216 H366 M406 216 V176" stroke="#FF725E" strokeWidth="2.2" fill="none" />

        {/* Subtle horizon & vertical alignment axes */}
        <line
          x1="82"
          y1="130"
          x2="378"
          y2="130"
          stroke="rgba(244,241,234,0.16)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />
        <line
          x1="230"
          y1="56"
          x2="230"
          y2="204"
          stroke="rgba(244,241,234,0.16)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />

        {/* Sculptural geometric optical aperture (abstract, no inaccurate gesture art) */}
        <g transform="translate(230, 130)">
          <circle
            r="68"
            fill="rgba(49, 91, 255, 0.1)"
            stroke="rgba(244, 241, 234, 0.22)"
            strokeWidth="1.2"
          />
          <circle
            r="46"
            fill="none"
            stroke="#315BFF"
            strokeWidth="1.8"
            strokeDasharray="16 8"
          />
          <rect
            x="-22"
            y="-22"
            width="44"
            height="44"
            rx="10"
            fill="rgba(255, 114, 94, 0.14)"
            stroke="#FF725E"
            strokeWidth="1.8"
          />
          <circle r="5" fill="#B7E5D1" />
        </g>

        <text
          x="230"
          y="248"
          textAnchor="middle"
          fill="#A6B6C5"
          fontSize="11"
          fontFamily="IBM Plex Mono, monospace"
        >
          Stage 01 · Local Viewport Framing (Illustrative)
        </text>
      </svg>
    );
  }

  if (stageId === 'recognise') {
    return (
      <svg
        viewBox="0 0 460 272"
        role="img"
        aria-label="Abstract spatial vector diagram for Stage 02 Recognise: dual coordinate lattices representing planned two-handed ISL spatial analysis"
        className="w-full h-auto"
      >
        {/* Concentric analysis orbits */}
        <circle
          cx="230"
          cy="128"
          r="86"
          fill="none"
          stroke="rgba(244,241,234,0.18)"
          strokeDasharray="3 6"
        />
        <circle
          cx="230"
          cy="128"
          r="54"
          fill="none"
          stroke="rgba(183,229,209,0.34)"
          strokeWidth="1.2"
        />

        {/* Left & Right geometric coordinate constellations (two-handed ISL spatial topology) */}
        <g stroke="#315BFF" strokeWidth="1.6" strokeOpacity="0.88" fill="none">
          <path d="M138 156 L166 106 L196 130 L172 164 Z" />
          <path d="M166 106 L230 92 L294 106" stroke="#B7E5D1" strokeOpacity="0.6" />
          <path d="M196 130 L264 130" stroke="#FF725E" strokeOpacity="0.85" />
          <path d="M322 156 L294 106 L264 130 L288 164 Z" />
          <path d="M172 164 L230 172 L288 164" strokeOpacity="0.55" />
        </g>

        {/* Coordinate nodes */}
        {[
          { x: 138, y: 156, c: '#FF725E', r: 4.5 },
          { x: 166, y: 106, c: '#F4F1EA', r: 3.8 },
          { x: 196, y: 130, c: '#FF725E', r: 4.2 },
          { x: 172, y: 164, c: '#F4F1EA', r: 3.4 },
          { x: 230, y: 92, c: '#B7E5D1', r: 4.8 },
          { x: 230, y: 172, c: '#315BFF', r: 4.5 },
          { x: 264, y: 130, c: '#B7E5D1', r: 4.2 },
          { x: 294, y: 106, c: '#F4F1EA', r: 3.8 },
          { x: 322, y: 156, c: '#B7E5D1', r: 4.5 },
          { x: 288, y: 164, c: '#F4F1EA', r: 3.4 },
        ].map((pt, idx) => (
          <circle key={idx} cx={pt.x} cy={pt.y} r={pt.r} fill={pt.c} />
        ))}

        <text
          x="230"
          y="248"
          textAnchor="middle"
          fill="#A6B6C5"
          fontSize="11"
          fontFamily="IBM Plex Mono, monospace"
        >
          Stage 02 · Planned Two-Handed Spatial Topology (Illustrative)
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 460 272"
      role="img"
      aria-label="Illustrative diagram of Stage 03 Communicate: assembled readable text and speech waveform"
      className="w-full h-auto"
    >
      {/* Text surface representation */}
      <rect
        x="68"
        y="42"
        width="324"
        height="82"
        rx="10"
        fill="#182534"
        stroke="rgba(244,241,234,0.22)"
        strokeWidth="1.2"
      />
      <text
        x="92"
        y="72"
        fill="#B7E5D1"
        fontSize="10.5"
        fontFamily="IBM Plex Mono, monospace"
      >
        OUTPUT TEXT
      </text>
      <text
        x="92"
        y="104"
        fill="#F4F1EA"
        fontSize="22"
        fontWeight="700"
        fontFamily="Space Grotesk, sans-serif"
        letterSpacing="0.04em"
      >
        HELLO ISL
      </text>

      {/* Connector to acoustic wave */}
      <line
        x1="230"
        y1="124"
        x2="230"
        y2="152"
        stroke="#315BFF"
        strokeWidth="1.8"
        strokeDasharray="3 3"
      />

      {/* Acoustic waveform bars */}
      <g transform="translate(104, 184)">
        {[14, 24, 40, 20, 48, 32, 54, 28, 42, 22, 36, 18, 30, 20, 14].map((h, i) => (
          <rect
            key={i}
            x={i * 17}
            y={-h / 2}
            width="6.5"
            height={h}
            rx="3.25"
            fill={i % 3 === 0 ? '#FF725E' : i % 2 === 0 ? '#315BFF' : '#B7E5D1'}
            fillOpacity={0.55 + (h / 54) * 0.45}
          />
        ))}
      </g>

      <text
        x="230"
        y="248"
        textAnchor="middle"
        fill="#A6B6C5"
        fontSize="11"
        fontFamily="IBM Plex Mono, monospace"
      >
        Stage 03 · Legible Text &amp; Browser Speech Output
      </text>
    </svg>
  );
}

export function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { reducedMotion } = useTheme();
  const activeStage = STAGES[activeIndex];

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (index + 1) % STAGES.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + STAGES.length) % STAGES.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = STAGES.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      const nextButton = document.getElementById(`stage-tab-${STAGES[nextIndex].id}`);
      nextButton?.focus();
    }
  };

  const getIcon = (id: WorkflowStage['id']) => {
    if (id === 'capture') return <Camera className="w-4 h-4" aria-hidden="true" />;
    if (id === 'recognise') return <Cpu className="w-4 h-4" aria-hidden="true" />;
    return <MessageSquareText className="w-4 h-4" aria-hidden="true" />;
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative py-20 sm:py-28 lg:py-32 bg-[var(--bg-contrast)] text-[var(--text-on-contrast)] border-t contrast-border overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 contrast-grid-bg opacity-45 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_25%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              index="02"
              tone="contrast"
              headingId="how-it-works-heading"
              kicker="How AuraLink Works"
              title="Three stages from visual sign to shared language."
              description="Explore the intended end-to-end communication architecture. The sequence below illustrates how AuraLink AI is designed to operate once the recognition engine is integrated."
            />
            <p className="text-xs font-mono text-[var(--accent-mint)] lg:text-right shrink-0">
              Illustrative Workflow · Prototype Phase
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Interactive Stage Selector List */}
          <div
            role="tablist"
            aria-label="How AuraLink AI works stages"
            className="lg:col-span-5 flex flex-col divide-y divide-[var(--border-on-contrast)] border-y contrast-border"
          >
            {STAGES.map((stage, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  id={`stage-tab-${stage.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  aria-selected={isSelected}
                  aria-controls={`stage-panel-${stage.id}`}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`relative text-left py-6 px-4 sm:px-5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-contrast-surface)]'
                      : 'hover:bg-[var(--bg-contrast-surface)]/45'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`font-mono text-xs font-medium tabular-nums ${
                        isSelected
                          ? 'text-[var(--accent-mint)]'
                          : 'text-[var(--text-on-contrast-muted)]'
                      }`}
                    >
                      {stage.number} / {stage.title}
                    </span>
                    <span
                      className={
                        isSelected
                          ? 'text-[var(--accent-coral)]'
                          : 'text-[var(--text-on-contrast-muted)]'
                      }
                    >
                      {getIcon(stage.id)}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-display text-lg sm:text-xl font-bold tracking-[-0.02em] text-[var(--text-on-contrast)]">
                    {stage.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-on-contrast-muted)]">
                    {stage.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Interactive Stage Visualizer Stage */}
          <div className="lg:col-span-7 flex">
            <div
              role="tabpanel"
              id={`stage-panel-${activeStage.id}`}
              aria-labelledby={`stage-tab-${activeStage.id}`}
              className="w-full rounded-xl border contrast-border bg-[var(--bg-contrast-surface)] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b contrast-border">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-on-contrast)]">
                  <span className="font-mono text-[var(--accent-coral)] tabular-nums">
                    {activeStage.number}
                  </span>
                  <span>{activeStage.title} Stage</span>
                </div>

                <div className="flex items-center gap-2">
                  {STAGES.map((st, idx) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`View stage ${st.number} ${st.title}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex
                          ? 'w-8 bg-[var(--accent-mint)]'
                          : 'w-2.5 bg-[var(--border-on-contrast-strong)] hover:bg-[var(--text-on-contrast-muted)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="my-6 flex-1 flex items-center justify-center min-h-[250px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStage.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.24, ease: EASE_SIGNAL }}
                    className="w-full max-w-lg mx-auto"
                  >
                    <StageVisual stageId={activeStage.id} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pt-5 border-t contrast-border space-y-2">
                <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text-on-contrast)]/90">
                  {activeStage.detail}
                </p>
                <p className="font-mono text-xs text-[var(--accent-mint)]">
                  {activeStage.prototypeNote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
