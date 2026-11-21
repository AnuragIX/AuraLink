import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';

export const EASE_SIGNAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, className = '', delay = 0, y = 24 }: RevealProps) {
  const { reducedMotion } = useTheme();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.62, delay, ease: EASE_SIGNAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MaskedLineProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function MaskedLine({ children, delay = 0, className = '' }: MaskedLineProps) {
  const { reducedMotion } = useTheme();

  if (reducedMotion) {
    return <span className={`block ${className}`}>{children}</span>;
  }

  return (
    <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
      <motion.span
        initial={{ y: '108%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.72, delay, ease: EASE_SIGNAL }}
        className={`block ${className}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

interface SectionHeaderProps {
  index?: string;
  kicker: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  headingId?: string;
  tone?: 'default' | 'contrast';
}

export function SectionHeader({
  index,
  kicker,
  title,
  description,
  align = 'left',
  headingId,
  tone = 'default',
}: SectionHeaderProps) {
  const isCentered = align === 'center';
  const isContrast = tone === 'contrast';

  return (
    <div className={isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <div
        className={`flex items-center gap-3 mb-4 ${isCentered ? 'justify-center' : ''}`}
      >
        {index ? (
          <span
            className={`font-mono text-xs font-medium tabular-nums ${
              isContrast ? 'text-[var(--accent-mint)]' : 'text-[var(--accent-ink)]'
            }`}
          >
            {index}
          </span>
        ) : null}
        {index ? (
          <span
            aria-hidden="true"
            className={`w-6 h-px ${
              isContrast ? 'bg-[var(--border-on-contrast-strong)]' : 'bg-[var(--border-strong)]'
            }`}
          />
        ) : null}
        <p
          className={`font-mono text-xs font-medium tracking-[0.08em] ${
            isContrast ? 'text-[var(--text-on-contrast-muted)]' : 'text-[var(--text-muted)]'
          }`}
        >
          {kicker}
        </p>
      </div>

      <h2
        id={headingId}
        className={`font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-bold tracking-[-0.03em] leading-[1.08] ${
          isContrast ? 'text-[var(--text-on-contrast)]' : 'text-[var(--text-primary)]'
        }`}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={`mt-5 text-base sm:text-lg leading-relaxed max-w-2xl ${
            isCentered ? 'mx-auto' : ''
          } ${isContrast ? 'text-[var(--text-on-contrast-muted)]' : 'text-[var(--text-secondary)]'}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ScrollProgressBar() {
  const { reducedMotion } = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  if (reducedMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="origin-left h-[2px] w-full bg-[var(--accent-primary)] pointer-events-none"
    />
  );
}
