import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Node3D {
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  radius: number;
  group: 'gesture' | 'bridge' | 'signal';
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
 * Custom 3D-projected spatial communication sculpture for AuraLink AI.
 * Visualizes two communicating dimensions (human gesture constellations & luminous language waves)
 * connected by resonant light trails in perspective space.
 * Adapts to dark/light themes, throttles on mobile, and renders a crisp static frame under reduced motion.
 */
export function SpatialCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, reducedMotion } = useTheme();
  const themeRef = useRef(theme);
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

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
    let pointerX = 0;
    let pointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;

    // Build deterministic 3D communication nodes:
    // Left cluster: organic gesture landmarks
    // Center filaments: bridging wave trajectory
    // Right cluster: structured acoustic/text resonance sphere
    const buildNodes = (compact: boolean): Node3D[] => {
      const nodes: Node3D[] = [];
      const gestureCount = compact ? 14 : 24;
      const bridgeCount = compact ? 16 : 28;
      const signalCount = compact ? 14 : 24;

      for (let i = 0; i < gestureCount; i++) {
        const angle = (i / gestureCount) * Math.PI * 2;
        const ring = 0.5 + (i % 3) * 0.24;
        nodes.push({
          baseX: -1.15 + Math.cos(angle) * 0.58 * ring,
          baseY: Math.sin(angle) * 0.72 * ring,
          baseZ: Math.sin(angle * 2 + i) * 0.52,
          phase: i * 0.45,
          radius: i % 4 === 0 ? 3.2 : 2.1,
          group: 'gesture',
        });
      }

      for (let i = 0; i < bridgeCount; i++) {
        const t = i / (bridgeCount - 1);
        const x = -0.85 + t * 1.7;
        const strand = i % 2 === 0 ? 1 : -1;
        nodes.push({
          baseX: x,
          baseY: Math.sin(t * Math.PI * 2.5) * 0.26 * strand,
          baseZ: Math.cos(t * Math.PI * 2.5) * 0.34 * strand,
          phase: t * Math.PI * 4,
          radius: 1.9,
          group: 'bridge',
        });
      }

      for (let i = 0; i < signalCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / signalCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = 0.62;
        nodes.push({
          baseX: 1.12 + r * Math.sin(phi) * Math.cos(theta),
          baseY: r * Math.sin(phi) * Math.sin(theta),
          baseZ: r * Math.cos(phi),
          phase: i * 0.38,
          radius: i % 5 === 0 ? 3.1 : 2.0,
          group: 'signal',
        });
      }

      return nodes;
    };

    let nodes: Node3D[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      isMobile = width < 640;
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

    const drawFrame = (timeSec: number) => {
      const dark = themeRef.current === 'dark';
      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric depth illumination
      const cx = width * 0.5;
      const cy = height * 0.5;
      const unit = Math.min(width * 0.34, height * 0.44);

      const radial = ctx.createRadialGradient(cx, cy, unit * 0.1, cx, cy, unit * 1.9);
      if (dark) {
        radial.addColorStop(0, 'rgba(34, 211, 238, 0.14)');
        radial.addColorStop(0.55, 'rgba(37, 99, 235, 0.08)');
        radial.addColorStop(1, 'rgba(4, 8, 20, 0)');
      } else {
        radial.addColorStop(0, 'rgba(2, 132, 199, 0.12)');
        radial.addColorStop(0.55, 'rgba(8, 145, 178, 0.05)');
        radial.addColorStop(1, 'rgba(246, 248, 252, 0)');
      }
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, width, height);

      // Smooth pointer parallax easing
      smoothPointerX += (pointerX - smoothPointerX) * 0.06;
      smoothPointerY += (pointerY - smoothPointerY) * 0.06;

      const rotY = Math.sin(timeSec * 0.28) * 0.24 + smoothPointerX * 0.28;
      const rotX = Math.cos(timeSec * 0.22) * 0.12 - smoothPointerY * 0.18;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Draw orbital perspective rings
      const drawOrbitRing = (rx: number, ry: number, tilt: number, alpha: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = dark
          ? `rgba(148, 197, 255, ${alpha})`
          : `rgba(12, 42, 84, ${alpha * 0.85})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      };

      drawOrbitRing(unit * 1.62, unit * 0.62, -0.18 + rotX * 0.35, 0.16);
      drawOrbitRing(unit * 1.38, unit * 0.46, 0.24 - rotX * 0.25, 0.12);

      // Draw flowing spatial communication wave ribbons
      const ribbonCount = isMobile ? 2 : 3;
      for (let r = 0; r < ribbonCount; r++) {
        ctx.beginPath();
        const steps = isMobile ? 42 : 72;
        for (let s = 0; s <= steps; s++) {
          const u = s / steps;
          const x3 = (u - 0.5) * 3.1;
          const freq = 2.6 + r * 0.6;
          const amp = (0.22 + r * 0.09) * Math.sin(u * Math.PI);
          const y3 = Math.sin(x3 * freq - timeSec * (0.9 + r * 0.22) + r * 1.4) * amp;
          const z3 = Math.cos(x3 * freq - timeSec * (0.85 + r * 0.18) + r) * amp * 0.85;

          const xr = x3 * cosY - z3 * sinY;
          const zr = x3 * sinY + z3 * cosY;
          const yr = y3 * cosX - zr * sinX;
          const zFinal = y3 * sinX + zr * cosX;

          const persp = 3.6 / (3.6 - zFinal);
          const px = cx + xr * unit * 0.9 * persp;
          const py = cy + yr * unit * 0.9 * persp;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        const grad = ctx.createLinearGradient(cx - unit * 1.5, cy, cx + unit * 1.5, cy);
        if (dark) {
          grad.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
          grad.addColorStop(0.5, r === 0 ? 'rgba(34, 211, 238, 0.55)' : 'rgba(96, 165, 250, 0.32)');
          grad.addColorStop(1, 'rgba(241, 246, 252, 0.12)');
        } else {
          grad.addColorStop(0, 'rgba(29, 78, 216, 0.08)');
          grad.addColorStop(0.5, r === 0 ? 'rgba(2, 132, 199, 0.52)' : 'rgba(8, 145, 178, 0.28)');
          grad.addColorStop(1, 'rgba(10, 20, 41, 0.1)');
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = r === 0 ? 1.75 : 1.1;
        ctx.stroke();
      }

      // Project 3D nodes
      const projected: ProjectedPoint[] = nodes.map((node) => {
        const wave = Math.sin(timeSec * 1.05 + node.phase) * 0.065;
        const x0 = node.baseX;
        const y0 = node.baseY + wave;
        const z0 = node.baseZ + Math.cos(timeSec * 0.8 + node.phase) * 0.05;

        const xr = x0 * cosY - z0 * sinY;
        const zr = x0 * sinY + z0 * cosY;
        const yr = y0 * cosX - zr * sinX;
        const zFinal = y0 * sinX + zr * cosX;

        const scale = 3.6 / (3.6 - zFinal);
        return {
          x: cx + xr * unit * 0.88 * scale,
          y: cy + yr * unit * 0.88 * scale,
          scale,
          z: zFinal,
          radius: node.radius,
          group: node.group,
        };
      });

      // Draw luminous spatial connections between nearby nodes
      const maxDist = isMobile ? unit * 0.44 : unit * 0.5;
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
            const alpha = strength * (dark ? 0.34 : 0.24);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle =
              a.group === 'bridge' || b.group === 'bridge'
                ? dark
                  ? `rgba(34, 211, 238, ${alpha * 1.25})`
                  : `rgba(2, 132, 199, ${alpha * 1.25})`
                : dark
                  ? `rgba(96, 165, 250, ${alpha})`
                  : `rgba(15, 39, 78, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Sort back-to-front for crisp depth layering
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const r = Math.max(1.2, p.radius * p.scale);
        const depthAlpha = Math.max(0.32, Math.min(0.95, 0.55 + p.z * 0.35));

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        if (p.group === 'bridge') {
          ctx.fillStyle = dark
            ? `rgba(34, 211, 238, ${depthAlpha})`
            : `rgba(2, 132, 199, ${depthAlpha})`;
        } else if (p.group === 'gesture') {
          ctx.fillStyle = dark
            ? `rgba(241, 246, 252, ${depthAlpha * 0.9})`
            : `rgba(10, 20, 41, ${depthAlpha * 0.8})`;
        } else {
          ctx.fillStyle = dark
            ? `rgba(96, 165, 250, ${depthAlpha})`
            : `rgba(8, 145, 178, ${depthAlpha})`;
        }
        ctx.fill();
      }
    };

    if (reducedMotionRef.current) {
      drawFrame(1.4);
      return () => {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerleave', handlePointerLeave);
      };
    }

    let startMs = performance.now();
    let lastDrawMs = 0;

    const tick = (nowMs: number) => {
      // Cap mobile frame rate gently (~30fps) to keep devices cool and responsive
      const minInterval = isMobile ? 32 : 16;
      if (nowMs - lastDrawMs >= minInterval) {
        lastDrawMs = nowMs;
        const elapsedSec = (nowMs - startMs) * 0.001;
        drawFrame(elapsedSec);
      }
      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [theme, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      data-testid="hero-spatial-canvas"
      aria-hidden="true"
      className="w-full h-full block"
    />
  );
}
