import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Node3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  radius: number;
  group: 'human' | 'signal' | 'language';
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  z: number;
  radius: number;
  group: Node3D['group'];
}

/**
 * Custom 3D-projected "Human Signal" sculptural canvas for AuraLink AI.
 * Visualizes human expression (Human Coral #FF725E), resonant bridging waves (Signal Blue #315BFF),
 * and structured shared language (Soft Mint #B7E5D1) on a deep Midnight Ink (#101923) stage.
 * Automatically pauses off-screen via IntersectionObserver, throttles gently on mobile,
 * and renders a crisp static art-directed sculpture under prefers-reduced-motion.
 */
export function SpatialCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { reducedMotion } = useTheme();
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let isMobile = false;
    let isInView = true;
    let pointerX = 0;
    let pointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;

    const buildNodes = (compact: boolean): Node3D[] => {
      const nodes: Node3D[] = [];
      const humanCount = compact ? 16 : 26;
      const signalCount = compact ? 18 : 30;
      const languageCount = compact ? 16 : 26;

      // Left sculptural cluster: Human expression torus-arc (Human Coral)
      for (let i = 0; i < humanCount; i++) {
        const u = (i / humanCount) * Math.PI * 2;
        const v = (i % 4) * 1.1;
        const major = 0.56;
        const minor = 0.22;
        nodes.push({
          baseX: -0.92 + (major + minor * Math.cos(v)) * Math.cos(u) * 0.85,
          baseY: (major + minor * Math.cos(v)) * Math.sin(u),
          baseZ: minor * Math.sin(v) + Math.sin(u * 2) * 0.28,
          phase: i * 0.42,
          radius: i % 4 === 0 ? 3.8 : 2.3,
          group: 'human',
        });
      }

      // Center braided signal filaments (Signal Blue)
      for (let i = 0; i < signalCount; i++) {
        const t = i / (signalCount - 1);
        const x = -0.82 + t * 1.64;
        const strand = i % 2 === 0 ? 1 : -1;
        nodes.push({
          baseX: x,
          baseY: Math.sin(t * Math.PI * 2.4) * 0.3 * strand,
          baseZ: Math.cos(t * Math.PI * 2.4) * 0.36 * strand,
          phase: t * Math.PI * 4.2,
          radius: i % 5 === 0 ? 3.2 : 2.1,
          group: 'signal',
        });
      }

      // Right geodesic language resonance sphere (Soft Mint)
      for (let i = 0; i < languageCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / languageCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = 0.6;
        nodes.push({
          baseX: 0.96 + r * Math.sin(phi) * Math.cos(theta),
          baseY: r * Math.sin(phi) * Math.sin(theta),
          baseZ: r * Math.cos(phi),
          phase: i * 0.35,
          radius: i % 5 === 0 ? 3.6 : 2.2,
          group: 'language',
        });
      }

      return nodes;
    };

    let nodes: Node3D[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      isMobile = width < 520;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = buildNodes(isMobile);
    };

    resize();

    const handlePointerMove = (event: PointerEvent) => {
      if (isMobile || reducedMotionRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
      pointerX = Math.max(-1, Math.min(1, nx));
      pointerY = Math.max(-1, Math.min(1, ny));
    };

    const handlePointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
    canvas.addEventListener('pointerleave', handlePointerLeave);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          isInView = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.02 },
      );
      observer.observe(canvas);
    }

    const drawFrame = (timeSec: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const unit = Math.min(width * 0.34, height * 0.42);

      // Subtle sculpted studio key lighting on Midnight Ink
      const keyBlue = ctx.createRadialGradient(
        cx,
        cy,
        unit * 0.08,
        cx,
        cy,
        unit * 1.9,
      );
      keyBlue.addColorStop(0, 'rgba(49, 91, 255, 0.24)');
      keyBlue.addColorStop(0.5, 'rgba(38, 55, 70, 0.14)');
      keyBlue.addColorStop(1, 'rgba(16, 25, 35, 0)');
      ctx.fillStyle = keyBlue;
      ctx.fillRect(0, 0, width, height);

      const coralRim = ctx.createRadialGradient(
        cx - unit * 0.85,
        cy - unit * 0.25,
        unit * 0.05,
        cx - unit * 0.85,
        cy - unit * 0.25,
        unit * 1.1,
      );
      coralRim.addColorStop(0, 'rgba(255, 114, 94, 0.16)');
      coralRim.addColorStop(1, 'rgba(16, 25, 35, 0)');
      ctx.fillStyle = coralRim;
      ctx.fillRect(0, 0, width, height);

      const mintRim = ctx.createRadialGradient(
        cx + unit * 0.85,
        cy + unit * 0.2,
        unit * 0.05,
        cx + unit * 0.85,
        cy + unit * 0.2,
        unit * 1.05,
      );
      mintRim.addColorStop(0, 'rgba(183, 229, 209, 0.14)');
      mintRim.addColorStop(1, 'rgba(16, 25, 35, 0)');
      ctx.fillStyle = mintRim;
      ctx.fillRect(0, 0, width, height);

      // Smooth pointer parallax easing
      smoothPointerX += (pointerX - smoothPointerX) * 0.055;
      smoothPointerY += (pointerY - smoothPointerY) * 0.055;

      const rotY = Math.sin(timeSec * 0.3) * 0.28 + smoothPointerX * 0.34;
      const rotX = Math.cos(timeSec * 0.24) * 0.15 - smoothPointerY * 0.22;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Architectural orbital meridian rings
      const drawOrbitRing = (
        rx: number,
        ry: number,
        tilt: number,
        color: string,
        lineWidth = 1,
      ) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.restore();
      };

      drawOrbitRing(
        unit * 1.62,
        unit * 0.56,
        -0.22 + rotX * 0.35,
        'rgba(244, 241, 234, 0.14)',
        1,
      );
      drawOrbitRing(
        unit * 1.32,
        unit * 0.44,
        0.28 - rotX * 0.25,
        'rgba(183, 229, 209, 0.16)',
        1,
      );
      drawOrbitRing(
        unit * 0.92,
        unit * 0.92,
        rotY * 0.4,
        'rgba(49, 91, 255, 0.2)',
        1.1,
      );

      // Sculpted 3D signal wave ribbons bridging Human Coral -> Signal Blue -> Soft Mint
      const ribbonCount = isMobile ? 3 : 4;
      for (let r = 0; r < ribbonCount; r++) {
        ctx.beginPath();
        const steps = isMobile ? 44 : 76;
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const x3 = (u - 0.5) * 2.85;
          const freq = 2.5 + r * 0.52;
          const amp = (0.24 + r * 0.08) * Math.sin(u * Math.PI);
          const y3 = Math.sin(x3 * freq - timeSec * (0.95 + r * 0.2) + r * 1.35) * amp;
          const z3 = Math.cos(x3 * freq - timeSec * (0.85 + r * 0.18) + r) * amp * 0.9;

          const xr = x3 * cosY - z3 * sinY;
          const zr = x3 * sinY + z3 * cosY;
          const yr = y3 * cosX - zr * sinX;
          const zFinal = y3 * sinX + zr * cosX;

          const persp = 3.5 / (3.5 - zFinal);
          const px = cx + xr * unit * 0.92 * persp;
          const py = cy + yr * unit * 0.92 * persp;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }

        const grad = ctx.createLinearGradient(cx - unit * 1.4, cy, cx + unit * 1.4, cy);
        grad.addColorStop(0, r === 0 ? 'rgba(255, 114, 94, 0.78)' : 'rgba(255, 114, 94, 0.28)');
        grad.addColorStop(0.5, r === 0 ? 'rgba(49, 91, 255, 0.92)' : 'rgba(138, 164, 255, 0.42)');
        grad.addColorStop(1, r === 0 ? 'rgba(183, 229, 209, 0.85)' : 'rgba(183, 229, 209, 0.3)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = r === 0 ? 2.1 : 1.15;
        ctx.stroke();
      }

      // Project 3D nodes
      const projected: ProjectedPoint[] = nodes.map((node) => {
        const wave = Math.sin(timeSec * 1.1 + node.phase) * 0.065;
        const x0 = node.baseX;
        const y0 = node.baseY + wave;
        const z0 = node.baseZ + Math.cos(timeSec * 0.85 + node.phase) * 0.055;

        const xr = x0 * cosY - z0 * sinY;
        const zr = x0 * sinY + z0 * cosY;
        const yr = y0 * cosX - zr * sinX;
        const zFinal = y0 * sinX + zr * cosX;

        const scale = 3.5 / (3.5 - zFinal);
        return {
          x: cx + xr * unit * 0.9 * scale,
          y: cy + yr * unit * 0.9 * scale,
          scale,
          z: zFinal,
          radius: node.radius,
          group: node.group,
        };
      });

      // Harmonic spatial connections
      const maxDist = isMobile ? unit * 0.45 : unit * 0.5;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) {
            const strength = 1 - Math.sqrt(distSq) / maxDist;
            const alpha = strength * 0.34;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            if (a.group === 'human' && b.group === 'human') {
              ctx.strokeStyle = `rgba(255, 114, 94, ${alpha * 1.15})`;
            } else if (a.group === 'language' && b.group === 'language') {
              ctx.strokeStyle = `rgba(183, 229, 209, ${alpha * 1.15})`;
            } else {
              ctx.strokeStyle = `rgba(110, 142, 255, ${alpha * 1.25})`;
            }
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Depth-sorted nodes
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const r = Math.max(1.3, p.radius * p.scale);
        const depthAlpha = Math.max(0.38, Math.min(0.98, 0.6 + p.z * 0.34));

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (p.group === 'human') {
          ctx.fillStyle = `rgba(255, 114, 94, ${depthAlpha})`;
        } else if (p.group === 'signal') {
          ctx.fillStyle = `rgba(122, 152, 255, ${depthAlpha})`;
        } else {
          ctx.fillStyle = `rgba(183, 229, 209, ${depthAlpha})`;
        }
        ctx.fill();
      }
    };

    if (reducedMotionRef.current) {
      drawFrame(1.6);
      return () => {
        observer?.disconnect();
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerleave', handlePointerLeave);
      };
    }

    const startMs = performance.now();
    let lastDrawMs = 0;

    const tick = (nowMs: number) => {
      const minInterval = isMobile ? 32 : 16;
      if (isInView && nowMs - lastDrawMs >= minInterval) {
        lastDrawMs = nowMs;
        const elapsedSec = (nowMs - startMs) * 0.001;
        drawFrame(elapsedSec);
      }
      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="hero-spatial-canvas"
      aria-hidden="true"
      className="w-full h-full block"
    />
  );
}
