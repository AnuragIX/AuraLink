import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { EASE_SIGNAL, Reveal, SectionHeader } from '../ui/MotionPrimitives';

interface TechLayer {
  id: string;
  order: string;
  name: string;
  phase: string;
  role: string;
  engineeringFocus: string;
  highlightZone: 'frame' | 'landmarks' | 'vectors' | 'classifier' | 'text' | 'audio';
}

const TECH_LAYERS: readonly TechLayer[] = [
  {
    id: 'cv',
    order: '01',
    name: 'Computer Vision',
    phase: 'Intended Architecture',
    role: 'Normalises incoming camera frames across varied lighting conditions, backgrounds, and mobile camera aspect ratios.',
    engineeringFocus: 'Focuses on privacy-preserving local preprocessing with low memory overhead.',
    highlightZone: 'frame',
  },
  {
    id: 'landmarks',
    order: '02',
    name: 'Hand Landmark Detection',
    phase: 'Intended Architecture',
    role: 'Extracts structured 3D joint coordinates across both hands—critical because most Indian Sign Language alphabet letters are two-handed.',
    engineeringFocus: 'Coordinates replace raw pixel dependency, improving robustness across skin tones and environments.',
    highlightZone: 'landmarks',
  },
  {
    id: 'ml',
    order: '03',
    name: 'Machine Learning',
    phase: 'Planned Training Pipeline',
    role: 'Learns invariant spatial relationships, relative joint angles, and inter-hand contact distances from curated ISL datasets.',
    engineeringFocus: 'Prioritizes compact model architectures suitable for real-time edge or browser execution.',
    highlightZone: 'vectors',
  },
  {
    id: 'classification',
    order: '04',
    name: 'Sign Classification',
    phase: 'Planned Inference Layer',
    role: 'Maps detected landmark configurations to discrete ISL alphabet tokens with temporal smoothing to prevent accidental duplicate letters.',
    engineeringFocus: 'Not active in this UI prototype; represented transparently via manual selection.',
    highlightZone: 'classifier',
  },
  {
    id: 'nlo',
    order: '05',
    name: 'Natural Language Output',
    phase: 'Prototype Workflow Active',
    role: 'Assembles recognised character tokens into clean, editable words and phrases with clear visual contrast and clipboard interoperability.',
    engineeringFocus: 'Future phases aim to explore optional word boundary suggestions without overriding user intent.',
    highlightZone: 'text',
  },
  {
    id: 'tts',
    order: '06',
    name: 'Speech Synthesis',
    phase: 'Browser API Demo Active',
    role: 'Converts composed text into intelligible audio output so signers can optionally voice messages in face-to-face settings.',
    engineeringFocus: 'Demonstrated today via standard Web Speech APIs with planned Indian English and regional voice support.',
    highlightZone: 'audio',
  },
];

export function TechnologySection() {
  const { reducedMotion } = useTheme();
  const [selectedLayerId, setSelectedLayerId] = useState<string>(TECH_LAYERS[1].id);
  const selectedLayer =
    TECH_LAYERS.find((layer) => layer.id === selectedLayerId) ?? TECH_LAYERS[0];

  return (
    <section
      id="technology"
      aria-labelledby="technology-heading"
      className="py-20 sm:py-28 lg:py-32 border-t hairline-border bg-[var(--bg-canvas)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              index="05"
              headingId="technology-heading"
              kicker="Technology Direction"
              title="Architectural blueprint for Indian Sign Language recognition."
              description="AuraLink AI is engineered around a six-layer modular pipeline. Select any layer below to inspect its intended role in the platform roadmap."
            />
            <p className="font-mono text-xs text-[var(--text-muted)] lg:text-right shrink-0">
              Architectural Roadmap · Not All Modules Live
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Spatial Blueprint Diagram */}
          <Reveal className="lg:col-span-5 flex">
            <div className="w-full rounded-xl bg-[var(--bg-contrast)] text-[var(--text-on-contrast)] border contrast-border p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 pb-4 border-b contrast-border">
                <span className="font-display text-sm font-semibold text-[var(--text-on-contrast)]">
                  Spatial Pipeline Blueprint
                </span>
                <span className="font-mono text-xs text-[var(--accent-mint)] tabular-nums">
                  Layer {selectedLayer.order} / 06
                </span>
              </div>

              <div className="my-6 flex items-center justify-center">
                <svg
                  viewBox="0 0 360 300"
                  role="img"
                  aria-label={`Architectural blueprint highlighting ${selectedLayer.name}`}
                  className="w-full max-w-[340px] h-auto"
                >
                  {/* Layer 01: Outer optical frame */}
                  <rect
                    x="22"
                    y="18"
                    width="316"
                    height="196"
                    rx="10"
                    fill="#182534"
                    stroke={
                      selectedLayer.highlightZone === 'frame'
                        ? '#FF725E'
                        : 'rgba(244,241,234,0.16)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'frame' ? '2.2' : '1'}
                  />

                  {/* Layer 03 & 04: Spatial coordinate rings */}
                  <circle
                    cx="180"
                    cy="116"
                    r="76"
                    fill="none"
                    stroke={
                      selectedLayer.highlightZone === 'vectors'
                        ? '#315BFF'
                        : 'rgba(244,241,234,0.2)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'vectors' ? '2' : '1'}
                    strokeDasharray="4 5"
                  />
                  <circle
                    cx="180"
                    cy="116"
                    r="44"
                    fill="none"
                    stroke={
                      selectedLayer.highlightZone === 'classifier'
                        ? '#B7E5D1'
                        : 'rgba(244,241,234,0.14)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'classifier' ? '2' : '1'}
                  />

                  {/* Layer 02: Abstract dual-cluster spatial coordinate lattice */}
                  <g
                    stroke={
                      selectedLayer.highlightZone === 'landmarks' ||
                      selectedLayer.highlightZone === 'vectors'
                        ? '#315BFF'
                        : 'rgba(244,241,234,0.4)'
                    }
                    strokeWidth="1.6"
                    fill="none"
                  >
                    <path d="M112 142 L134 94 L162 114 L142 152 Z" />
                    <path d="M134 94 L180 82 L226 94" />
                    <path d="M162 114 L198 114" />
                    <path d="M248 142 L226 94 L198 114 L218 152 Z" />
                    <path d="M142 152 L180 158 L218 152" />
                  </g>

                  {[
                    [112, 142],
                    [134, 94],
                    [162, 114],
                    [142, 152],
                    [180, 82],
                    [180, 158],
                    [198, 114],
                    [226, 94],
                    [248, 142],
                    [218, 152],
                  ].map(([cx, cy], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={selectedLayer.highlightZone === 'landmarks' ? 4.4 : 3}
                      fill={
                        selectedLayer.highlightZone === 'landmarks'
                          ? '#FF725E'
                          : selectedLayer.highlightZone === 'classifier'
                            ? '#B7E5D1'
                            : '#F4F1EA'
                      }
                    />
                  ))}

                  {/* Layer 05: Text Output Layer */}
                  <rect
                    x="22"
                    y="232"
                    width="190"
                    height="50"
                    rx="8"
                    fill="#182534"
                    stroke={
                      selectedLayer.highlightZone === 'text'
                        ? '#315BFF'
                        : 'rgba(244,241,234,0.16)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'text' ? '2' : '1'}
                  />
                  <text
                    x="38"
                    y="252"
                    fill="#A6B6C5"
                    fontSize="9.5"
                    fontFamily="IBM Plex Mono, monospace"
                  >
                    TEXT LAYER
                  </text>
                  <text
                    x="38"
                    y="271"
                    fill="#F4F1EA"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Space Grotesk, sans-serif"
                  >
                    ISL → Readable Output
                  </text>

                  {/* Layer 06: Speech Output Layer */}
                  <rect
                    x="224"
                    y="232"
                    width="114"
                    height="50"
                    rx="8"
                    fill="#182534"
                    stroke={
                      selectedLayer.highlightZone === 'audio'
                        ? '#B7E5D1'
                        : 'rgba(244,241,234,0.16)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'audio' ? '2' : '1'}
                  />
                  <g transform="translate(244, 257)">
                    {[8, 18, 12, 24, 14, 20, 10, 16].map((h, i) => (
                      <rect
                        key={i}
                        x={i * 9.5}
                        y={-h / 2}
                        width="4"
                        height={h}
                        rx="2"
                        fill={
                          selectedLayer.highlightZone === 'audio'
                            ? '#B7E5D1'
                            : 'rgba(244,241,234,0.45)'
                        }
                      />
                    ))}
                  </g>
                </svg>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedLayer.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE_SIGNAL }}
                  className="pt-4 border-t contrast-border"
                >
                  <p className="text-xs font-mono text-[var(--accent-coral)]">
                    {selectedLayer.order} · {selectedLayer.phase}
                  </p>
                  <p className="mt-1 font-display text-base font-bold text-[var(--text-on-contrast)]">
                    {selectedLayer.name}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-on-contrast-muted)]">
                    {selectedLayer.engineeringFocus}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Interactive 6-Layer Technical Stack Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TECH_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayer.id;
              return (
                <motion.button
                  key={layer.id}
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                  onClick={() => setSelectedLayerId(layer.id)}
                  aria-pressed={isSelected}
                  className={`text-left rounded-xl border p-5 sm:p-6 transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-surface)]/55 hairline-border hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-xs font-medium tabular-nums ${
                          isSelected ? 'text-[var(--accent-ink)]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {layer.order}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        {layer.phase}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold tracking-[-0.015em] text-[var(--text-primary)]">
                      {layer.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {layer.role}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
