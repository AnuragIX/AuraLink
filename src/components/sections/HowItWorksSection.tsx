import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, Cpu, MessageSquareText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Reveal, SectionHeader } from '../ui/MotionPrimitives';

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
      'The planned computer vision pipeline will detect 21-point hand joint landmarks across one or both hands and classify static and transitional Indian Sign Language alphabet signs.',
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
        viewBox="0 0 420 260"
        role="img"
        aria-label="Illustrative diagram of stage 01 Capture: hand positioned within an optical camera frame"
        className="w-full h-auto"
      >
        {/* Framing reticle corners */}
        <path d="M56 54 H90 M56 54 V88" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
        <path d="M364 54 H330 M364 54 V88" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
        <path d="M56 206 H90 M56 206 V172" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
        <path d="M364 206 H330 M364 206 V172" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />

        {/* Subtle horizon guide */}
        <line
          x1="80"
          y1="130"
          x2="340"
          y2="130"
          stroke="var(--border-strong)"
          strokeDasharray="4 6"
          strokeWidth="1"
        />

        {/* Stylized minimalist hand contour inside frame */}
        <g transform="translate(210, 134)">
          <circle
            r="62"
            fill="var(--bg-surface-subtle)"
            stroke="var(--border-hairline)"
            strokeWidth="1"
          />
          <path
            d="M-18 32 L-22 2 C-23 -4 -15 -6 -13 0 L-10 14 L-9 -24 C-9 -30 -1 -30 0 -24 L1 8 L4 -30 C4 -36 12 -36 12 -30 L12 10 L18 -18 C19 -24 26 -22 25 -16 L20 20 C18 34 6 42 -6 40 C-14 39 -17 36 -18 32 Z"
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        <text
          x="210"
          y="236"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="11"
          fontFamily="JetBrains Mono, monospace"
        >
          Stage 01 · Local Viewport Framing (Illustrative)
        </text>
      </svg>
    );
  }

  if (stageId === 'recognise') {
    return (
      <svg
        viewBox="0 0 420 260"
        role="img"
        aria-label="Illustrative diagram of stage 02 Recognise: hand joint landmarks connected by spatial vectors"
        className="w-full h-auto"
      >
        {/* Concentric analysis arcs */}
        <circle
          cx="210"
          cy="124"
          r="84"
          fill="none"
          stroke="var(--border-strong)"
          strokeDasharray="3 5"
        />
        <circle
          cx="210"
          cy="124"
          r="54"
          fill="none"
          stroke="var(--accent-cyan)"
          strokeOpacity="0.35"
        />

        {/* Illustrative 21-point hand skeleton graph */}
        <g stroke="var(--accent-primary)" strokeWidth="1.6" strokeOpacity="0.75" fill="none">
          {/* Wrist to knuckles */}
          <path d="M210 184 L178 148 L164 124 L158 106" />
          <path d="M210 184 L194 134 L190 96 L189 72" />
          <path d="M210 184 L211 130 L212 88 L213 62" />
          <path d="M210 184 L228 134 L234 98 L238 76" />
          <path d="M210 184 L244 146 L256 122 L264 104" />
          {/* Palm cross-links */}
          <path d="M178 148 L194 134 L211 130 L228 134 L244 146" strokeOpacity="0.45" />
        </g>

        {/* Joint landmark nodes */}
        {[
          [210, 184],
          [178, 148], [164, 124], [158, 106],
          [194, 134], [190, 96], [189, 72],
          [211, 130], [212, 88], [213, 62],
          [228, 134], [234, 98], [238, 76],
          [244, 146], [256, 122], [264, 104],
        ].map(([cx, cy], idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={idx === 0 ? 4.5 : 3.2}
            fill={idx % 3 === 0 ? 'var(--accent-primary)' : 'var(--text-primary)'}
          />
        ))}

        <text
          x="210"
          y="236"
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize="11"
          fontFamily="JetBrains Mono, monospace"
        >
          Stage 02 · Planned Spatial Landmark Mapping (Illustrative)
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 420 260"
      role="img"
      aria-label="Illustrative diagram of stage 03 Communicate: assembled readable text and speech waveform"
      className="w-full h-auto"
    >
      {/* Text surface representation */}
      <rect
        x="62"
        y="46"
        width="296"
        height="76"
        rx="8"
        fill="var(--bg-surface-subtle)"
        stroke="var(--border-strong)"
        strokeWidth="1.2"
      />
      <text
        x="84"
        y="76"
        fill="var(--text-muted)"
        fontSize="10.5"
        fontFamily="JetBrains Mono, monospace"
      >
        OUTPUT TEXT
      </text>
      <text
        x="84"
        y="104"
        fill="var(--text-primary)"
        fontSize="20"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="0.06em"
      >
        HELLO ISL
      </text>

      {/* Connector to acoustic wave */}
      <line
        x1="210"
        y1="122"
        x2="210"
        y2="148"
        stroke="var(--accent-primary)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />

      {/* Acoustic waveform bars */}
      <g transform="translate(88, 178)">
        {[14, 24, 38, 18, 44, 30, 50, 26, 40, 22, 34, 16, 28, 18, 12].map((h, i) => (
          <rect
            key={i}
            x={i * 16.5}
            y={-h / 2}
            width="6"
            height={h}
            rx="3"
            fill={i % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-cyan)'}
            fillOpacity={0.45 + (h / 50) * 0.55}
          />
        ))}
      </g>

      <text
        x="210"
        y="236"
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
      >
        Stage 03 · Legible Text & Browser Speech Output
      </text>
    </svg>
  );
}

export function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { reducedMotion } = useTheme();
  const activeStage = STAGES[activeIndex];

  const getIcon = (id: WorkflowStage['id']) => {
    if (id === 'capture') return <Camera className="w-4 h-4" aria-hidden="true" />;
    if (id === 'recognise') return <Cpu className="w-4 h-4" aria-hidden="true" />;
    return <MessageSquareText className="w-4 h-4" aria-hidden="true" />;
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-20 sm:py-24 lg:py-32 border-t hairline-border bg-[var(--bg-surface-subtle)]/45"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              headingId="how-it-works-heading"
              kicker="How AuraLink Works"
              title="Three stages from visual sign to shared language."
              description="Explore the intended end-to-end communication architecture. The visual sequence below is illustrative of how AuraLink AI will operate once the recognition engine is integrated."
            />
            <p className="text-xs font-mono text-[var(--text-muted)] lg:text-right shrink-0">
              Illustrative Workflow · Prototype Phase
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Stage Selector List */}
          <div
            role="tablist"
            aria-label="How AuraLink AI works stages"
            className="lg:col-span-5 flex flex-col gap-3"
          >
            {STAGES.map((stage, index) => {
              const isSelected = index === activeIndex;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  id={`stage-tab-${stage.id}`}
                  aria-selected={isSelected}
                  aria-controls={`stage-panel-${stage.id}`}
                  onClick={() => setActiveIndex(index)}
                  className={`text-left p-5 sm:p-6 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-surface)]/55 hairline-border hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-medium text-[var(--accent-cyan)]">
                      {stage.number} — {stage.title}
                    </span>
                    <span
                      className={
                        isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'
                      }
                    >
                      {getIcon(stage.id)}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-[var(--text-primary)]">
                    {stage.headline}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {stage.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Interactive Stage Visualizer Panel */}
          <div className="lg:col-span-7 flex">
            <div
              role="tabpanel"
              id={`stage-panel-${activeStage.id}`}
              aria-labelledby={`stage-tab-${activeStage.id}`}
              className="w-full rounded-xl border hairline-border bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b hairline-border">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                  <span className="font-mono text-[var(--accent-primary)]">
                    {activeStage.number}
                  </span>
                  <span>{activeStage.title} Stage</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {STAGES.map((st, idx) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`View stage ${st.number} ${st.title}`}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex
                          ? 'w-7 bg-[var(--accent-primary)]'
                          : 'w-2.5 bg-[var(--border-strong)] hover:bg-[var(--text-muted)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="my-6 flex-1 flex items-center justify-center min-h-[240px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStage.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md mx-auto"
                  >
                    <StageVisual stageId={activeStage.id} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pt-5 border-t hairline-border space-y-2">
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {activeStage.detail}
                </p>
                <p className="font-mono text-xs text-[var(--text-muted)]">
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
