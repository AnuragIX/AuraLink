import React, { useState } from 'react';
import { Reveal, SectionHeader } from '../ui/MotionPrimitives';

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
  const [selectedLayerId, setSelectedLayerId] = useState<string>(TECH_LAYERS[1].id);
  const selectedLayer =
    TECH_LAYERS.find((layer) => layer.id === selectedLayerId) ?? TECH_LAYERS[0];

  return (
    <section
      id="technology"
      aria-labelledby="technology-heading"
      className="py-20 sm:py-24 lg:py-32 border-t hairline-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
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

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Spatial Blueprint Diagram */}
          <Reveal className="lg:col-span-5 flex">
            <div className="w-full rounded-xl border hairline-border bg-[var(--bg-surface)] p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 pb-4 border-b hairline-border">
                <span className="font-display text-sm font-semibold text-[var(--text-primary)]">
                  Spatial Landmark Blueprint
                </span>
                <span className="font-mono text-xs text-[var(--accent-cyan)]">
                  Layer {selectedLayer.order}
                </span>
              </div>

              <div className="my-6 flex items-center justify-center">
                <svg
                  viewBox="0 0 360 300"
                  role="img"
                  aria-label={`Architectural diagram highlighting ${selectedLayer.name}`}
                  className="w-full max-w-[340px] h-auto"
                >
                  {/* Layer 01: Outer optical frame */}
                  <rect
                    x="22"
                    y="18"
                    width="316"
                    height="196"
                    rx="10"
                    fill="var(--bg-surface-subtle)"
                    fillOpacity="0.6"
                    stroke={
                      selectedLayer.highlightZone === 'frame'
                        ? 'var(--accent-primary)'
                        : 'var(--border-hairline)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'frame' ? '2' : '1'}
                  />

                  {/* Concentric spatial coordinate rings (Layer 03 / ML geometry) */}
                  <circle
                    cx="180"
                    cy="116"
                    r="78"
                    fill="none"
                    stroke={
                      selectedLayer.highlightZone === 'vectors'
                        ? 'var(--accent-primary)'
                        : 'var(--border-strong)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'vectors' ? '1.8' : '1'}
                    strokeDasharray="4 5"
                  />
                  <circle
                    cx="180"
                    cy="116"
                    r="48"
                    fill="none"
                    stroke={
                      selectedLayer.highlightZone === 'classifier'
                        ? 'var(--accent-primary)'
                        : 'var(--border-hairline)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'classifier' ? '1.8' : '1'}
                  />

                  {/* Hand Landmark Skeleton (Layer 02) */}
                  <g
                    stroke={
                      selectedLayer.highlightZone === 'landmarks' ||
                      selectedLayer.highlightZone === 'vectors'
                        ? 'var(--accent-primary)'
                        : 'var(--text-secondary)'
                    }
                    strokeOpacity={
                      selectedLayer.highlightZone === 'landmarks' ? '0.95' : '0.45'
                    }
                    strokeWidth="1.6"
                    fill="none"
                  >
                    <path d="M180 182 L148 144 L132 118 L124 98" />
                    <path d="M180 182 L162 128 L158 88 L156 62" />
                    <path d="M180 182 L180 122 L180 78 L180 50" />
                    <path d="M180 182 L198 128 L204 88 L208 66" />
                    <path d="M180 182 L214 142 L226 116 L236 98" />
                    <path d="M148 144 L162 128 L180 122 L198 128 L214 142" />
                  </g>

                  {[
                    [180, 182],
                    [148, 144], [132, 118], [124, 98],
                    [162, 128], [158, 88], [156, 62],
                    [180, 122], [180, 78], [180, 50],
                    [198, 128], [204, 88], [208, 66],
                    [214, 142], [226, 116], [236, 98],
                  ].map(([cx, cy], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={selectedLayer.highlightZone === 'landmarks' ? 4 : 2.8}
                      fill={
                        selectedLayer.highlightZone === 'landmarks' ||
                        selectedLayer.highlightZone === 'classifier'
                          ? 'var(--accent-primary)'
                          : 'var(--text-primary)'
                      }
                    />
                  ))}

                  {/* Output Bar (Layer 05 & 06) */}
                  <rect
                    x="22"
                    y="232"
                    width="190"
                    height="48"
                    rx="8"
                    fill="var(--bg-surface-subtle)"
                    stroke={
                      selectedLayer.highlightZone === 'text'
                        ? 'var(--accent-primary)'
                        : 'var(--border-hairline)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'text' ? '1.8' : '1'}
                  />
                  <text
                    x="38"
                    y="252"
                    fill="var(--text-muted)"
                    fontSize="9.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    TEXT LAYER
                  </text>
                  <text
                    x="38"
                    y="270"
                    fill="var(--text-primary)"
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    ISL → Readable Output
                  </text>

                  <rect
                    x="224"
                    y="232"
                    width="114"
                    height="48"
                    rx="8"
                    fill="var(--bg-surface-subtle)"
                    stroke={
                      selectedLayer.highlightZone === 'audio'
                        ? 'var(--accent-primary)'
                        : 'var(--border-hairline)'
                    }
                    strokeWidth={selectedLayer.highlightZone === 'audio' ? '1.8' : '1'}
                  />
                  <g transform="translate(244, 256)">
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
                            ? 'var(--accent-primary)'
                            : 'var(--text-muted)'
                        }
                      />
                    ))}
                  </g>
                </svg>
              </div>

              <div className="pt-4 border-t hairline-border">
                <p className="text-xs font-mono text-[var(--accent-cyan)]">
                  {selectedLayer.order} · {selectedLayer.phase}
                </p>
                <p className="mt-1 font-display text-base font-bold text-[var(--text-primary)]">
                  {selectedLayer.name}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {selectedLayer.engineeringFocus}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Interactive 6-Layer Technical Stack List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TECH_LAYERS.map((layer) => {
              const isSelected = layer.id === selectedLayer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayerId(layer.id)}
                  aria-pressed={isSelected}
                  className={`text-left rounded-xl border p-5 sm:p-6 transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-surface)]/70 hairline-border hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[var(--accent-cyan)]">
                        {layer.order}
                      </span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        {layer.phase}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold text-[var(--text-primary)]">
                      {layer.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {layer.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
