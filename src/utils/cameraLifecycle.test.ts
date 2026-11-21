import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMERA_VIDEO_CONSTRAINTS,
  CameraLifecycleController,
  CameraLifecycleStatus,
  MinimalMediaStream,
  MinimalMediaTrack,
} from './cameraLifecycle';

function createMockStream() {
  let stopCount = 0;
  const endedListeners = new Set<() => void>();

  const track: MinimalMediaTrack = {
    stop: () => {
      stopCount += 1;
    },
    addEventListener: (_type, listener) => {
      endedListeners.add(listener);
    },
    removeEventListener: (_type, listener) => {
      endedListeners.delete(listener);
    },
  };

  const stream: MinimalMediaStream = {
    getTracks: () => [track],
  };

  return {
    stream,
    getStopCount: () => stopCount,
    getListenerCount: () => endedListeners.size,
    triggerEnded: () => {
      for (const listener of Array.from(endedListeners)) {
        listener();
      }
    },
  };
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

test('camera requests video only and never requests microphone audio', async () => {
  let receivedConstraints: MediaStreamConstraints | null = null;
  const mock = createMockStream();
  const statuses: CameraLifecycleStatus[] = [];

  const controller = new CameraLifecycleController({
    onStatusChange: (status) => statuses.push(status),
    onStreamChange: () => {},
  });

  await controller.start(async (constraints) => {
    receivedConstraints = constraints;
    return mock.stream;
  });

  assert.deepEqual(receivedConstraints, CAMERA_VIDEO_CONSTRAINTS);
  assert.equal(CAMERA_VIDEO_CONSTRAINTS.audio, false);
  assert.deepEqual(statuses, ['requesting', 'active']);

  controller.stop(true);
  assert.equal(mock.getStopCount(), 1);
  assert.equal(mock.getListenerCount(), 0);
  assert.equal(controller.getActiveStream(), null);
});

test('Case 1: start camera then stop immediately cancels late-resolving stream', async () => {
  const deferred = createDeferred<MinimalMediaStream>();
  const mock = createMockStream();
  const statuses: CameraLifecycleStatus[] = [];
  const attachedStreams: Array<MinimalMediaStream | null> = [];

  const controller = new CameraLifecycleController({
    onStatusChange: (status) => statuses.push(status),
    onStreamChange: (stream) => attachedStreams.push(stream),
  });

  const startPromise = controller.start(() => deferred.promise);
  assert.equal(controller.getIsRequesting(), true);

  // User clicks Stop Camera while browser permission prompt is still pending
  controller.stop(true);
  assert.equal(controller.getIsRequesting(), false);

  // Permission prompt resolves later with an active hardware stream
  deferred.resolve(mock.stream);
  await startPromise;

  // Track must be immediately stopped and stream must never become active
  assert.equal(mock.getStopCount(), 1);
  assert.equal(controller.getActiveStream(), null);
  assert.equal(statuses[statuses.length - 1], 'off');
  assert.equal(attachedStreams.includes(mock.stream), false);
});

test('Case 2 & 3 & 4: start camera then reset or unmount disposes late stream with zero post-unmount callbacks', async () => {
  const deferred = createDeferred<MinimalMediaStream>();
  const mock = createMockStream();
  let callbacksAfterDispose = 0;
  let disposed = false;

  const controller = new CameraLifecycleController({
    onStatusChange: () => {
      if (disposed) callbacksAfterDispose += 1;
    },
    onStreamChange: () => {
      if (disposed) callbacksAfterDispose += 1;
    },
    onAnnouncement: () => {
      if (disposed) callbacksAfterDispose += 1;
    },
  });

  const startPromise = controller.start(() => deferred.promise);

  // Simulate component unmount / navigation away while prompt is pending
  disposed = true;
  controller.dispose();

  deferred.resolve(mock.stream);
  await startPromise;

  assert.equal(mock.getStopCount(), 1);
  assert.equal(callbacksAfterDispose, 0);
  assert.equal(controller.getActiveStream(), null);
});

test('Case 5: denying camera permission transitions cleanly to denied state', async () => {
  let finalStatus: CameraLifecycleStatus = 'off';
  let finalDetail = '';

  const controller = new CameraLifecycleController({
    onStatusChange: (status, detail) => {
      finalStatus = status;
      finalDetail = detail ?? '';
    },
    onStreamChange: () => {},
  });

  await controller.start(async () => {
    const err = new Error('Permission denied by user');
    err.name = 'NotAllowedError';
    throw err;
  });

  assert.equal(finalStatus, 'denied');
  assert.match(finalDetail, /Camera permission was declined/i);
  assert.equal(controller.getActiveStream(), null);
  assert.equal(controller.getIsRequesting(), false);
});

test('Case 6: physical camera disconnect (track ended) releases stream and sets disconnected status', async () => {
  const mock = createMockStream();
  const statuses: CameraLifecycleStatus[] = [];
  let latestStream: MinimalMediaStream | null = null;

  const controller = new CameraLifecycleController({
    onStatusChange: (status) => statuses.push(status),
    onStreamChange: (stream) => {
      latestStream = stream;
    },
  });

  await controller.start(async () => mock.stream);
  assert.equal(latestStream, mock.stream);
  assert.equal(mock.getListenerCount(), 1);

  // Simulate hardware camera unplugged mid-session
  mock.triggerEnded();

  assert.equal(statuses[statuses.length - 1], 'disconnected');
  assert.equal(latestStream, null);
  assert.equal(controller.getActiveStream(), null);
  assert.equal(mock.getStopCount(), 1);
  assert.equal(mock.getListenerCount(), 0);
});

test('Case 7 & 8: rapid duplicate start clicks issue only one getUserMedia call and repeated start/stop cycles remain clean', async () => {
  let callCount = 0;
  const deferred1 = createDeferred<MinimalMediaStream>();
  const mock1 = createMockStream();
  const mock2 = createMockStream();

  const controller = new CameraLifecycleController({
    onStatusChange: () => {},
    onStreamChange: () => {},
  });

  const p1 = controller.start(() => {
    callCount += 1;
    return deferred1.promise;
  });
  // Rapid duplicate clicks while request 1 is in flight
  const p2 = controller.start(async () => {
    callCount += 1;
    return mock2.stream;
  });
  const p3 = controller.start(async () => {
    callCount += 1;
    return mock2.stream;
  });

  assert.equal(callCount, 1);

  deferred1.resolve(mock1.stream);
  await Promise.all([p1, p2, p3]);
  assert.equal(controller.getActiveStream(), mock1.stream);

  // Stop cycle 1
  controller.stop(true);
  assert.equal(mock1.getStopCount(), 1);
  assert.equal(controller.getActiveStream(), null);

  // Start cycle 2
  await controller.start(async () => {
    callCount += 1;
    return mock2.stream;
  });
  assert.equal(callCount, 2);
  assert.equal(controller.getActiveStream(), mock2.stream);

  // Stop cycle 2
  controller.stop(true);
  assert.equal(mock2.getStopCount(), 1);
  assert.equal(controller.getActiveStream(), null);
});
