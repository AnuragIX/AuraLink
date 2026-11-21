import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

const EASE_SPATIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, className = '', delay = 0, y = 20 }: RevealProps) {
  const { reducedMotion } = useTheme();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, delay, ease: EASE_SPATIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeaderProps {
  kicker: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  headingId?: string;
}

export function SectionHeader({
  kicker,
  title,
  description,
  align = 'left',
  headingId,
}: SectionHeaderProps) {
  const isCentered = align === 'center';

  return (
    <div className={isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs font-medium tracking-[0.14em] text-[var(--accent-cyan)] mb-3">
        {kicker}
      </p>
      <h2
        id={headingId}
        className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-[-0.025em] leading-[1.12] text-[var(--text-primary)]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function SpatialDivider({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`w-full h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent ${className}`}
    />
  );
}
