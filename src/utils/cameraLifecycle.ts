export interface MinimalMediaTrack {
  stop: () => void;
  addEventListener?: (type: 'ended', listener: () => void) => void;
  removeEventListener?: (type: 'ended', listener: () => void) => void;
}

export interface MinimalMediaStream {
  getTracks: () => MinimalMediaTrack[];
}

export type CameraLifecycleStatus =
  | 'off'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'unavailable'
  | 'disconnected'
  | 'error';

export interface CameraErrorInfo {
  status: Extract<CameraLifecycleStatus, 'denied' | 'unavailable' | 'error'>;
  detail: string;
  announcement: string;
}

export interface CameraLifecycleCallbacks {
  onStatusChange: (status: CameraLifecycleStatus, detail?: string) => void;
  onStreamChange: (stream: MinimalMediaStream | null) => void;
  onAnnouncement?: (message: string) => void;
}

export type GetUserMediaFn = (constraints: MediaStreamConstraints) => Promise<MinimalMediaStream>;

export const CAMERA_VIDEO_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  audio: false,
};

export function stopAllStreamTracks(stream: MinimalMediaStream | null | undefined): void {
  if (!stream) return;
  for (const track of stream.getTracks()) {
    try {
      track.stop();
    } catch {
      // Ignore individual track stop errors during cleanup
    }
  }
}

export function classifyCameraError(err: unknown): CameraErrorInfo {
  const errorName =
    err && typeof err === 'object' && 'name' in err && typeof err.name === 'string'
      ? err.name
      : '';

  if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
    return {
      status: 'denied',
      detail:
        'Camera permission was declined. Allow camera access in your browser site settings and try again, or continue using the manual ISL alphabet selector.',
      announcement: 'Camera permission denied.',
    };
  }

  if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
    return {
      status: 'unavailable',
      detail:
        'No camera device was detected on this machine. You can still test the full sign-to-text, clipboard, and speech workflow manually.',
      announcement: 'No camera device found.',
    };
  }

  if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
    return {
      status: 'error',
      detail:
        'The camera appears to be in use by another application. Close other video apps and retry.',
      announcement: 'Camera is currently busy.',
    };
  }

  return {
    status: 'error',
    detail:
      'Unable to start camera preview in this environment. You can continue using manual ISL character selection below.',
    announcement: 'Unable to start camera preview.',
  };
}

/**
 * Race-safe camera lifecycle controller.
 * Uses a monotonic request generation counter so pending getUserMedia() promises that resolve
 * after Stop Camera, Reset Workspace, or component unmount immediately stop every track and
 * never attach an obsolete stream or emit stale state updates.
 */
export class CameraLifecycleController {
  private requestGeneration = 0;
  private activeStream: MinimalMediaStream | null = null;
  private isRequesting = false;
  private isDisposed = false;
  private trackCleanupFns: Array<() => void> = [];
  private readonly callbacks: CameraLifecycleCallbacks;

  constructor(callbacks: CameraLifecycleCallbacks) {
    this.callbacks = callbacks;
  }

  private detachTrackListeners(): void {
    for (const cleanup of this.trackCleanupFns) {
      cleanup();
    }
    this.trackCleanupFns = [];
  }

  private attachTrackEndedListeners(stream: MinimalMediaStream, generation: number): void {
    this.detachTrackListeners();
    const tracks = stream.getTracks();
    for (const track of tracks) {
      if (typeof track.addEventListener !== 'function') continue;
      const handleEnded = () => {
        if (this.isDisposed || generation !== this.requestGeneration) return;
        this.detachTrackListeners();
        stopAllStreamTracks(this.activeStream);
        this.activeStream = null;
        this.isRequesting = false;
        this.callbacks.onStreamChange(null);
        this.callbacks.onStatusChange(
          'disconnected',
          'The camera was disconnected or permission was revoked. Reconnect your device or click Start Camera to retry.',
        );
        this.callbacks.onAnnouncement?.('Camera disconnected.');
      };
      track.addEventListener('ended', handleEnded);
      this.trackCleanupFns.push(() => {
        track.removeEventListener?.('ended', handleEnded);
      });
    }
  }

  public async start(getUserMedia: GetUserMediaFn | null | undefined): Promise<void> {
    if (this.isDisposed || this.isRequesting || this.activeStream) {
      return;
    }

    if (typeof getUserMedia !== 'function') {
      this.callbacks.onStatusChange(
        'unavailable',
        'Your browser or current context does not expose camera media APIs. Ensure HTTPS or a supported browser to test the preview.',
      );
      this.callbacks.onAnnouncement?.('Camera unavailable in this browser.');
      return;
    }

    this.isRequesting = true;
    const currentGeneration = ++this.requestGeneration;
    this.callbacks.onStatusChange('requesting', '');
    this.callbacks.onAnnouncement?.('Requesting browser camera permission.');

    try {
      const stream = await getUserMedia(CAMERA_VIDEO_CONSTRAINTS);

      // If Stop Camera, Reset Workspace, or unmount happened while permission was pending,
      // immediately stop every track and discard the obsolete stream.
      if (this.isDisposed || currentGeneration !== this.requestGeneration) {
        stopAllStreamTracks(stream);
        return;
      }

      this.isRequesting = false;
      this.activeStream = stream;
      this.attachTrackEndedListeners(stream, currentGeneration);
      this.callbacks.onStreamChange(stream);
      this.callbacks.onStatusChange('active', '');
      this.callbacks.onAnnouncement?.(
        'Camera preview is now active. Frames are displayed locally and not analysed in this prototype.',
      );
    } catch (err) {
      if (this.isDisposed || currentGeneration !== this.requestGeneration) {
        return;
      }

      this.isRequesting = false;
      const classified = classifyCameraError(err);
      this.callbacks.onStreamChange(null);
      this.callbacks.onStatusChange(classified.status, classified.detail);
      this.callbacks.onAnnouncement?.(classified.announcement);
    }
  }

  public stop(announce: boolean): void {
    // Advance generation to invalidate any in-flight getUserMedia() request.
    this.requestGeneration += 1;
    this.isRequesting = false;
    this.detachTrackListeners();

    if (this.activeStream) {
      stopAllStreamTracks(this.activeStream);
      this.activeStream = null;
    }

    if (this.isDisposed) return;

    this.callbacks.onStreamChange(null);
    this.callbacks.onStatusChange('off', '');
    if (announce) {
      this.callbacks.onAnnouncement?.('Camera preview stopped.');
    }
  }

  public dispose(): void {
    this.isDisposed = true;
    this.requestGeneration += 1;
    this.isRequesting = false;
    this.detachTrackListeners();

    if (this.activeStream) {
      stopAllStreamTracks(this.activeStream);
      this.activeStream = null;
    }
  }

  public getActiveStream(): MinimalMediaStream | null {
    return this.activeStream;
  }

  public getIsRequesting(): boolean {
    return this.isRequesting;
  }
}
