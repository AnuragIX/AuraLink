import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, Camera, CameraOff, Loader2, ShieldAlert } from 'lucide-react';

export type CameraStatus =
  | 'off'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'unavailable'
  | 'error';

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
  error: 'Camera Error',
};

export function CameraPreview({ resetSignal, onStatusAnnouncement }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('off');
  const [errorDetail, setErrorDetail] = useState<string>('');

  const stopStream = useCallback((announce: boolean) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStatus('off');
    setErrorDetail('');
    if (announce) {
      onStatusAnnouncement?.('Camera preview stopped.');
    }
  }, [onStatusAnnouncement]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resetSignal > 0) {
      stopStream(false);
    }
  }, [resetSignal, stopStream]);

  // Attach active MediaStream once the video element is mounted
  useEffect(() => {
    if (status === 'active' && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {
        // Autoplay restriction handled silently; muted + playsInline allows playback
      });
    }
  }, [status]);

  const handleStartCamera = async () => {
    if (status === 'requesting' || status === 'active') return;

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setStatus('unavailable');
      const msg =
        'Your browser or current context does not expose camera media APIs. Ensure HTTPS or a supported browser to test the preview.';
      setErrorDetail(msg);
      onStatusAnnouncement?.('Camera unavailable in this browser.');
      return;
    }

    setStatus('requesting');
    setErrorDetail('');
    onStatusAnnouncement?.('Requesting browser camera permission.');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setStatus('active');
      onStatusAnnouncement?.(
        'Camera preview is now active. Frames are displayed locally and not analysed in this prototype.',
      );
    } catch (err) {
      const errorName = err instanceof DOMException ? err.name : '';
      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        setStatus('denied');
        setErrorDetail(
          'Camera permission was declined. Allow camera access in your browser site settings and try again, or continue using the manual ISL alphabet selector.',
        );
        onStatusAnnouncement?.('Camera permission denied.');
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        setStatus('unavailable');
        setErrorDetail(
          'No camera device was detected on this machine. You can still test the full sign-to-text, clipboard, and speech workflow manually.',
        );
        onStatusAnnouncement?.('No camera device found.');
      } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
        setStatus('error');
        setErrorDetail(
          'The camera appears to be in use by another application. Close other video apps and retry.',
        );
        onStatusAnnouncement?.('Camera is currently busy.');
      } else {
        setStatus('error');
        setErrorDetail(
          'Unable to start camera preview in this environment. You can continue using manual ISL character selection below.',
        );
        onStatusAnnouncement?.('Unable to start camera preview.');
      }
    }
  };

  return (
    <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] overflow-hidden flex flex-col">
      {/* Camera Panel Header */}
      <div className="px-5 py-3.5 border-b hairline-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">
            Camera Preview
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Local browser feed only · No frame inference in prototype
          </p>
        </div>

        <div
          data-testid="camera-permission-status"
          className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-1.5"
        >
          {status === 'denied' || status === 'unavailable' || status === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
          ) : null}
          <span>{STATUS_LABELS[status]}</span>
        </div>
      </div>

      {/* Viewport Frame */}
      <div className="relative aspect-[16/10] sm:aspect-video w-full bg-[var(--bg-surface-subtle)] flex items-center justify-center overflow-hidden">
        {status === 'active' ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              aria-label="Live local camera preview"
              className="w-full h-full object-cover scale-x-[-1]"
            />
            {/* Minimalist framing corners (no fake bounding boxes or fake confidence readouts) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-5 border border-[var(--accent-primary)]/35 rounded-lg"
            />
            <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-md bg-slate-950/75 text-slate-100 text-xs flex flex-wrap items-center justify-between gap-2 backdrop-blur-sm">
              <span>Local camera preview active</span>
              <span className="font-mono text-cyan-300">Preview Only · Recognition Coming Soon</span>
            </div>
          </>
        ) : status === 'requesting' ? (
          <div className="px-6 py-8 text-center max-w-sm">
            <Loader2
              className="w-8 h-8 mx-auto text-[var(--accent-primary)] animate-spin"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
              Waiting for camera permission
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
              Respond to your browser’s permission prompt to preview your local camera feed.
            </p>
          </div>
        ) : status === 'denied' || status === 'unavailable' || status === 'error' ? (
          <div className="px-6 py-8 text-center max-w-md" role="alert">
            <ShieldAlert
              className="w-8 h-8 mx-auto text-amber-500"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
              {STATUS_LABELS[status]}
            </p>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              {errorDetail}
            </p>
          </div>
        ) : (
          <div className="px-6 py-8 text-center max-w-md">
            <div className="w-12 h-12 mx-auto rounded-lg border hairline-border bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)]">
              <CameraOff className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="mt-3.5 text-sm font-semibold text-[var(--text-primary)]">
              Camera is currently off
            </p>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              Select <span className="font-medium text-[var(--text-primary)]">Start Camera</span> to
              test your device’s live preview. Camera frames remain strictly local and are not
              analysed in this prototype.
            </p>
          </div>
        )}
      </div>

      {/* Camera Action Bar */}
      <div className="px-5 py-3.5 border-t hairline-border bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleStartCamera}
            disabled={status === 'active' || status === 'requesting'}
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] text-sm font-semibold hover:bg-[var(--accent-primary-hover)] disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Camera className="w-4 h-4" aria-hidden="true" />
            <span>Start Camera</span>
          </button>

          <button
            type="button"
            onClick={() => stopStream(true)}
            disabled={status !== 'active' && status !== 'requesting'}
            className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm font-medium hover:border-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <CameraOff className="w-4 h-4" aria-hidden="true" />
            <span>Stop Camera</span>
          </button>
        </div>

        <span className="text-xs text-[var(--text-muted)]">
          User-initiated permission only
        </span>
      </div>
    </div>
  );
}
