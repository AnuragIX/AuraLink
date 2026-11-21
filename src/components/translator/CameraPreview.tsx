import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  CameraOff,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import {
  CameraLifecycleController,
  CameraLifecycleStatus,
  MinimalMediaStream,
} from '../../utils/cameraLifecycle';
import { EASE_SIGNAL } from '../ui/MotionPrimitives';

export type CameraStatus = CameraLifecycleStatus;

interface CameraPreviewProps {
  resetSignal: number;
  onStatusAnnouncement?: (message: string) => void;
}

const STATUS_LABELS: Record<CameraStatus, string> = {
  off: 'Camera Off',
  requesting: 'Requesting Permission',
  active: 'Camera Active (Preview Only)',
  denied: 'Permission Denied',
  unavailable: 'Camera Unavailable',
  disconnected: 'Camera Disconnected',
  error: 'Camera Error',
};

export function CameraPreview({ resetSignal, onStatusAnnouncement }: CameraPreviewProps) {
  const { reducedMotion } = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeStreamRef = useRef<MinimalMediaStream | null>(null);
  const controllerRef = useRef<CameraLifecycleController | null>(null);
  const announcementRef = useRef(onStatusAnnouncement);

  const [status, setStatus] = useState<CameraStatus>('off');
  const [errorDetail, setErrorDetail] = useState<string>('');

  useEffect(() => {
    announcementRef.current = onStatusAnnouncement;
  }, [onStatusAnnouncement]);

  // Instantiate race-safe lifecycle controller once and dispose strictly on unmount
  useEffect(() => {
    const controller = new CameraLifecycleController({
      onStatusChange: (nextStatus, detail) => {
        setStatus(nextStatus);
        setErrorDetail(detail ?? '');
      },
      onStreamChange: (stream) => {
        activeStreamRef.current = stream;
        if (!stream && videoRef.current) {
          videoRef.current.srcObject = null;
        }
      },
      onAnnouncement: (message) => {
        announcementRef.current?.(message);
      },
    });

    controllerRef.current = controller;

    // Release active camera tracks if the user navigates away or closes the page
    const handlePageHide = () => {
      controller.stop(false);
    };
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      controller.dispose();
      controllerRef.current = null;
      activeStreamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  // Stop camera and invalidate pending permission requests on Reset Workspace
  useEffect(() => {
    if (resetSignal > 0) {
      controllerRef.current?.stop(false);
    }
  }, [resetSignal]);

  // Attach active MediaStream once the video element mounts in the active view
  useEffect(() => {
    if (status === 'active' && videoRef.current && activeStreamRef.current) {
      videoRef.current.srcObject = activeStreamRef.current as MediaStream;
      videoRef.current.play().catch(() => {
        // Muted + playsInline allows playback; ignore benign autoplay rejections
      });
    }
  }, [status]);

  const handleStartCamera = useCallback(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    const getUserMedia =
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function'
        ? (constraints: MediaStreamConstraints) =>
            navigator.mediaDevices.getUserMedia(constraints)
        : null;

    void controller.start(getUserMedia);
  }, []);

  const handleStopCamera = useCallback(() => {
    controllerRef.current?.stop(true);
  }, []);

  const isErrorLike =
    status === 'denied' ||
    status === 'unavailable' ||
    status === 'disconnected' ||
    status === 'error';

  return (
    <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] overflow-hidden flex flex-col">
      {/* Studio Camera Panel Header */}
      <div className="px-5 py-4 border-b hairline-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-sm sm:text-base font-semibold text-[var(--text-primary)]">
            Camera Preview
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Local browser feed only · No frame inference in prototype
          </p>
        </div>

        <div
          data-testid="camera-permission-status"
          className={`text-xs font-mono flex items-center gap-1.5 ${
            status === 'active'
              ? 'text-[var(--status-success)]'
              : isErrorLike
                ? 'text-[var(--status-warning)]'
                : 'text-[var(--text-secondary)]'
          }`}
        >
          {status === 'active' ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : status === 'requesting' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
          ) : isErrorLike ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <CameraOff className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" aria-hidden="true" />
          )}
          <span>{STATUS_LABELS[status]}</span>
        </div>
      </div>

      {/* Studio Optical Viewport Frame */}
      <div className="relative aspect-[16/10] sm:aspect-video w-full bg-[var(--bg-contrast)] text-[var(--text-on-contrast)] flex items-center justify-center overflow-hidden">
        {/* Subtle Optical Framing Corner Brackets */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-4 z-10">
          <span
            className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 transition-colors duration-200 ${
              status === 'active'
                ? 'border-[var(--accent-mint)]'
                : isErrorLike
                  ? 'border-[var(--accent-coral)]'
                  : 'border-[var(--border-on-contrast-strong)]'
            }`}
          />
          <span
            className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 transition-colors duration-200 ${
              status === 'active'
                ? 'border-[var(--accent-mint)]'
                : isErrorLike
                  ? 'border-[var(--accent-coral)]'
                  : 'border-[var(--border-on-contrast-strong)]'
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 transition-colors duration-200 ${
              status === 'active'
                ? 'border-[var(--accent-mint)]'
                : isErrorLike
                  ? 'border-[var(--accent-coral)]'
                  : 'border-[var(--border-on-contrast-strong)]'
            }`}
          />
          <span
            className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 transition-colors duration-200 ${
              status === 'active'
                ? 'border-[var(--accent-mint)]'
                : isErrorLike
                  ? 'border-[var(--accent-coral)]'
                  : 'border-[var(--border-on-contrast-strong)]'
            }`}
          />
        </div>

        <AnimatePresence mode="wait">
          {status === 'active' ? (
            <motion.div
              key="active"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE_SIGNAL }}
              className="relative w-full h-full"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                aria-label="Live local camera preview"
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute bottom-3 left-3 right-3 z-20 px-3.5 py-2 rounded-md bg-[var(--bg-contrast)]/88 border contrast-border text-[var(--text-on-contrast)] text-xs flex flex-wrap items-center justify-between gap-2 backdrop-blur-sm">
                <span className="font-medium">Local camera preview active</span>
                <span className="font-mono text-[var(--accent-mint)]">
                  Preview Only · Recognition Coming Soon
                </span>
              </div>
            </motion.div>
          ) : status === 'requesting' ? (
            <motion.div
              key="requesting"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: EASE_SIGNAL }}
              className="px-6 py-8 text-center max-w-sm"
            >
              <Loader2
                className="w-8 h-8 mx-auto text-[var(--accent-mint)] animate-spin"
                aria-hidden="true"
              />
              <p className="mt-3.5 font-display text-base font-semibold text-[var(--text-on-contrast)]">
                Waiting for camera permission
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-on-contrast-muted)]">
                Respond to your browser’s permission prompt to preview your local camera feed.
              </p>
            </motion.div>
          ) : isErrorLike ? (
            <motion.div
              key="error"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: EASE_SIGNAL }}
              className="px-6 py-8 text-center max-w-md"
              role="alert"
            >
              <ShieldAlert className="w-8 h-8 mx-auto text-[var(--accent-coral)]" aria-hidden="true" />
              <p className="mt-3.5 font-display text-base font-semibold text-[var(--text-on-contrast)]">
                {STATUS_LABELS[status]}
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-on-contrast-muted)]">
                {errorDetail}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: EASE_SIGNAL }}
              className="px-6 py-8 text-center max-w-md"
            >
              <div className="w-12 h-12 mx-auto rounded-lg border contrast-border bg-[var(--bg-contrast-surface)] flex items-center justify-center text-[var(--text-on-contrast-muted)]">
                <CameraOff className="w-5 h-5" aria-hidden="true" />
              </div>
              <p className="mt-4 font-display text-base font-semibold text-[var(--text-on-contrast)]">
                Camera is currently off
              </p>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-on-contrast-muted)]">
                Select <span className="font-medium text-[var(--text-on-contrast)]">Start Camera</span>{' '}
                to test your device’s live preview. Camera frames remain strictly local and are not
                analysed in this prototype.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera Action Bar */}
      <div className="px-5 py-4 border-t hairline-border bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <motion.button
            type="button"
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            onClick={handleStartCamera}
            disabled={status === 'active' || status === 'requesting'}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] text-sm font-semibold hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Camera className="w-4 h-4" aria-hidden="true" />
            <span>Start Camera</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            onClick={handleStopCamera}
            disabled={status !== 'active' && status !== 'requesting'}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm font-medium hover:border-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <CameraOff className="w-4 h-4" aria-hidden="true" />
            <span>Stop Camera</span>
          </motion.button>
        </div>

        <span className="font-mono text-xs text-[var(--text-muted)]">
          User-initiated permission only
        </span>
      </div>
    </div>
  );
}
