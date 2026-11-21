import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  BookmarkPlus,
  Check,
  Copy,
  Delete,
  Eraser,
  History,
  Info,
  RotateCcw,
  Space,
  Square,
  Trash2,
  Volume2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import {
  INITIAL_TRANSLATOR_STATE,
  ISL_ALPHABET,
  MAX_OUTPUT_LENGTH,
  countWords,
  formatHistoryTimestamp,
  getIslLetterSpec,
  translatorReducer,
} from '../../utils/translatorState';
import { EASE_SIGNAL, Reveal, SectionHeader } from '../ui/MotionPrimitives';
import { CameraPreview } from './CameraPreview';

export function TranslatorWorkspace() {
  const { reducedMotion } = useTheme();
  const [state, dispatch] = useReducer(translatorReducer, INITIAL_TRANSLATOR_STATE);
  const [resetCounter, setResetCounter] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFeedbackError, setCopyFeedbackError] = useState<string>('');
  const [speechState, setSpeechState] = useState<'idle' | 'speaking' | 'unsupported' | 'error'>(
    'idle',
  );
  const [speechMessage, setSpeechMessage] = useState<string>('');
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const copyTimerRef = useRef<number | null>(null);
  const speechTimerRef = useRef<number | null>(null);
  const speechSessionRef = useRef<number>(0);

  const selectedSpec = getIslLetterSpec(state.selectedLetter);
  const trimmedOutput = state.outputText.trim();
  const wordCount = countWords(state.outputText);

  const announce = useCallback((message: string) => {
    setLiveAnnouncement(message);
  }, []);

  const clearSpeechTimer = useCallback(() => {
    if (speechTimerRef.current !== null) {
      window.clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state.lastActionMessage) {
      announce(state.lastActionMessage);
    }
  }, [state.lastActionMessage, announce]);

  useEffect(() => {
    return () => {
      speechSessionRef.current += 1;
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
        copyTimerRef.current = null;
      }
      clearSpeechTimer();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [clearSpeechTimer]);

  const handleCopyText = async (textToCopy: string, targetId: string) => {
    const clean = textToCopy.trim();
    if (!clean) return;
    setCopyFeedbackError('');

    let copied = false;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(clean);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = clean;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedId(targetId);
      announce(`Copied "${clean}" to clipboard.`);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } else {
      setCopyFeedbackError(
        'Clipboard access was blocked by the browser. Select the text manually to copy.',
      );
      announce('Unable to copy automatically.');
    }
  };

  const handleSpeakText = (textToSpeak: string) => {
    const clean = textToSpeak.trim();
    if (!clean) return;

    clearSpeechTimer();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechState('unsupported');
      setSpeechMessage('Browser text-to-speech is not supported in this environment.');
      announce('Text-to-speech is not supported in this browser.');
      return;
    }

    try {
      if (speechState === 'speaking') {
        speechSessionRef.current += 1;
        window.speechSynthesis.cancel();
        setSpeechState('idle');
        setSpeechMessage('Speech playback stopped.');
        announce('Speech playback stopped.');
        return;
      }

      const sessionId = ++speechSessionRef.current;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-IN';
      utterance.rate = 0.96;

      utterance.onstart = () => {
        if (sessionId !== speechSessionRef.current) return;
        setSpeechState('speaking');
        setSpeechMessage(`Speaking "${clean}" via browser speech synthesis.`);
      };
      utterance.onend = () => {
        if (sessionId !== speechSessionRef.current) return;
        clearSpeechTimer();
        setSpeechState('idle');
        setSpeechMessage('Speech demonstration completed.');
      };
      utterance.onerror = () => {
        if (sessionId !== speechSessionRef.current) return;
        clearSpeechTimer();
        setSpeechState('error');
        setSpeechMessage(
          'Browser speech playback could not start (no system voice available or audio restricted).',
        );
      };

      setSpeechState('speaking');
      setSpeechMessage(`Speaking "${clean}" via browser speech synthesis.`);
      announce(`Speaking ${clean}`);
      window.speechSynthesis.speak(utterance);

      // Guard for headless environments where onend/onerror may not fire without audio hardware
      speechTimerRef.current = window.setTimeout(() => {
        speechTimerRef.current = null;
        if (sessionId !== speechSessionRef.current) return;
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          setSpeechState((current) => (current === 'speaking' ? 'idle' : current));
        }
      }, 1600);
    } catch {
      setSpeechState('error');
      setSpeechMessage('Speech synthesis encountered a browser error.');
      announce('Speech synthesis failed.');
    }
  };

  const handleSaveToHistory = () => {
    if (!trimmedOutput) return;
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `hist-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    dispatch({
      type: 'COMMIT_TO_HISTORY',
      id,
      createdAtIso: new Date().toISOString(),
    });
  };

  const handleResetWorkspace = () => {
    speechSessionRef.current += 1;
    clearSpeechTimer();
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechState('idle');
    setSpeechMessage('');
    setCopyFeedbackError('');
    setCopiedId(null);
    setResetCounter((c) => c + 1);
    dispatch({ type: 'RESET_WORKSPACE' });
  };

  return (
    <section
      id="translator"
      aria-labelledby="translator-heading"
      className="py-20 sm:py-28 lg:py-32 border-t hairline-border bg-[var(--bg-surface-subtle)]/55"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <SectionHeader
              index="04"
              headingId="translator-heading"
              kicker="Translator Workspace"
              title="Interactive ISL Communication Prototype"
              description="Test local camera preview permissions, manually compose Indian Sign Language alphabet sequences into readable text, manage session history, copy output, and preview browser speech synthesis."
            />

            <motion.button
              type="button"
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              onClick={handleResetWorkspace}
              className="self-start lg:self-end inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-ink)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Reset Workspace</span>
            </motion.button>
          </div>
        </Reveal>

        {/* Honest Product Scope Notice */}
        <div
          role="note"
          className="mt-9 px-5 py-4 rounded-xl border hairline-border-strong bg-[var(--bg-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <Info
              className="w-4 h-4 text-[var(--accent-coral-text)] shrink-0 mt-0.5 sm:mt-0"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Interactive Prototype — Recognition Engine Coming Soon
            </p>
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] sm:text-right">
            Manual alphabet selection simulates sign input · No live ML inference runs in this build
          </p>
        </div>

        {/* Screen-reader polite status announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveAnnouncement}
        </div>

        {/* Workspace Main Two-Column Studio Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Camera Preview + Manual ISL Alphabet Selector */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <CameraPreview resetSignal={resetCounter} onStatusAnnouncement={announce} />

            {/* Manual ISL Alphabet Selector */}
            <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b hairline-border">
                <div>
                  <h3 className="font-display text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                    Manual ISL Alphabet Selector
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Select letters A–Z to compose output text directly
                  </p>
                </div>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  26 Characters · Prototype Input
                </span>
              </div>

              <div
                role="group"
                aria-label="Indian Sign Language alphabet letters A through Z"
                className="mt-4 grid grid-cols-6 sm:grid-cols-9 gap-2"
              >
                {ISL_ALPHABET.map((item) => {
                  const isActive = state.selectedLetter === item.letter;
                  return (
                    <motion.button
                      key={item.letter}
                      type="button"
                      whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                      onClick={() => dispatch({ type: 'SELECT_LETTER', letter: item.letter })}
                      aria-label={`Select ISL letter ${item.letter}`}
                      aria-pressed={isActive}
                      className={`min-h-[44px] rounded-md border font-display text-base font-bold transition-colors cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] border-[var(--accent-primary)]'
                          : 'bg-[var(--bg-canvas)] text-[var(--text-primary)] hairline-border hover:border-[var(--accent-primary)] hover:text-[var(--accent-ink)]'
                      }`}
                    >
                      {item.letter}
                    </motion.button>
                  );
                })}
              </div>

              {/* Editing Controls Row */}
              <div className="mt-4 pt-4 border-t hairline-border flex flex-wrap items-center gap-2.5">
                <motion.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  onClick={() => dispatch({ type: 'APPEND_SPACE' })}
                  disabled={!state.outputText || state.outputText.endsWith(' ')}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Space className="w-4 h-4" aria-hidden="true" />
                  <span>Add Space</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  onClick={() => dispatch({ type: 'BACKSPACE' })}
                  disabled={!state.outputText}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Delete className="w-4 h-4" aria-hidden="true" />
                  <span>Backspace</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  onClick={() => dispatch({ type: 'CLEAR_TEXT' })}
                  disabled={!state.outputText && !state.selectedLetter}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-coral)] hover:text-[var(--accent-coral-text)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Eraser className="w-4 h-4" aria-hidden="true" />
                  <span>Clear Text</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Selected Character Display + Output Panel + Translation History */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Selected Character Display */}
            <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 pb-3 border-b hairline-border">
                <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">
                  Selected Character Display
                </h3>
                <span className="font-mono text-xs text-[var(--text-muted)]">Manual Input</span>
              </div>

              <div className="mt-4 flex items-center gap-5">
                <div
                  data-testid="selected-character-value"
                  className="w-20 h-20 rounded-lg bg-[var(--bg-contrast)] border contrast-border flex items-center justify-center shrink-0"
                >
                  <motion.span
                    key={selectedSpec ? selectedSpec.letter : 'empty'}
                    initial={reducedMotion ? false : { opacity: 0.35, scale: 0.86 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.16, ease: EASE_SIGNAL }}
                    className={`font-display text-4xl font-bold ${
                      selectedSpec
                        ? 'text-[var(--accent-mint)]'
                        : 'text-[var(--text-on-contrast-muted)]'
                    }`}
                  >
                    {selectedSpec ? selectedSpec.letter : '—'}
                  </motion.span>
                </div>

                <div className="min-w-0 flex-1">
                  {selectedSpec ? (
                    <>
                      <p className="text-xs font-mono text-[var(--accent-ink)]">
                        ISL Alphabet · {selectedSpec.hands} Sign
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {selectedSpec.postureNote}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        No letter selected yet
                      </p>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                        Choose a character from the ISL alphabet grid to inspect its hand-formation
                        note and append it to the output panel.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Text Output Panel */}
            <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b hairline-border">
                <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">
                  Text Output Panel
                </h3>
                <div className="font-mono text-xs text-[var(--text-muted)] tabular-nums flex items-center gap-2.5">
                  <span>
                    {state.outputText.length}/{MAX_OUTPUT_LENGTH} chars
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                </div>
              </div>

              <div
                data-testid="translator-output-text"
                aria-label="Constructed translation text"
                className="mt-4 min-h-[120px] p-4 sm:p-5 rounded-lg border hairline-border bg-[var(--bg-canvas)] flex flex-col justify-between"
              >
                {state.outputText ? (
                  <p className="font-display text-2xl sm:text-[1.85rem] font-bold tracking-[0.04em] leading-snug text-[var(--text-primary)] break-words">
                    {state.outputText}
                  </p>
                ) : (
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    Your constructed text will appear here immediately as you select Indian Sign
                    Language letters.
                  </p>
                )}
              </div>

              {/* Output Action Controls */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <motion.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  onClick={() => handleSpeakText(state.outputText)}
                  disabled={!trimmedOutput}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-md bg-[var(--accent-primary)] text-[var(--accent-contrast-text)] text-xs sm:text-sm font-semibold hover:bg-[var(--accent-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  {speechState === 'speaking' ? (
                    <>
                      <Square className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Stop Speech</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Speak Output</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  onClick={() => handleCopyText(state.outputText, 'main-output')}
                  disabled={!trimmedOutput}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-xs sm:text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedId === 'main-output' ? (
                    <>
                      <Check
                        className="w-4 h-4 text-[var(--status-success)] shrink-0"
                        aria-hidden="true"
                      />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Copy Output</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={reducedMotion ? undefined : { scale: 0.97 }}
                  onClick={handleSaveToHistory}
                  disabled={!trimmedOutput}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-2 rounded-md border hairline-border-strong bg-[var(--bg-surface)] text-xs sm:text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookmarkPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Save History</span>
                </motion.button>
              </div>

              {/* Speech & Clipboard Feedback */}
              {speechMessage ? (
                <p
                  data-testid="speech-status-message"
                  className={`mt-3 text-xs leading-relaxed ${
                    speechState === 'error' || speechState === 'unsupported'
                      ? 'text-[var(--status-warning)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {speechMessage}
                </p>
              ) : null}

              {copyFeedbackError ? (
                <p role="alert" className="mt-2 text-xs text-[var(--status-warning)]">
                  {copyFeedbackError}
                </p>
              ) : null}
            </div>

            {/* Session Translation History Panel */}
            <div className="rounded-xl border hairline-border bg-[var(--bg-surface)] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 pb-3 border-b hairline-border">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[var(--accent-ink)]" aria-hidden="true" />
                  <h3 className="font-display text-sm font-semibold text-[var(--text-primary)]">
                    Session Translation History
                  </h3>
                </div>
                <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums">
                  {state.history.length} {state.history.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {state.history.length === 0 ? (
                <div data-testid="history-empty-state" className="py-8 text-center">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    No saved phrases in this session
                  </p>
                  <p className="mt-1.5 text-xs text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
                    Compose text using the ISL alphabet selector and choose Save History to keep
                    phrases handy during your session.
                  </p>
                </div>
              ) : (
                <ul
                  data-testid="history-list"
                  aria-label="Session translation history"
                  className="mt-3 divide-y divide-[var(--border-hairline)] max-h-[280px] overflow-y-auto pr-1"
                >
                  <AnimatePresence initial={false}>
                    {state.history.map((entry) => (
                      <motion.li
                        key={entry.id}
                        initial={reducedMotion ? false : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: EASE_SIGNAL }}
                        className="py-3 first:pt-1 last:pb-0 flex items-start justify-between gap-3"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: 'RESTORE_HISTORY_ENTRY', id: entry.id })
                          }
                          className="text-left min-w-0 flex-1 group cursor-pointer"
                          title={`Load "${entry.text}" back into output`}
                        >
                          <p className="font-display text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-ink)] transition-colors break-words">
                            {entry.text}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
                            {formatHistoryTimestamp(entry.createdAtIso)} · {entry.characterCount}{' '}
                            chars
                          </p>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleSpeakText(entry.text)}
                            aria-label={`Speak history entry "${entry.text}"`}
                            className="w-9 h-9 rounded-md border hairline-border flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-ink)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyText(entry.text, entry.id)}
                            aria-label={`Copy history entry "${entry.text}"`}
                            className="w-9 h-9 rounded-md border hairline-border flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-ink)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                          >
                            {copiedId === entry.id ? (
                              <Check
                                className="w-3.5 h-3.5 text-[var(--status-success)]"
                                aria-hidden="true"
                              />
                            ) : (
                              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({ type: 'REMOVE_HISTORY_ENTRY', id: entry.id })
                            }
                            aria-label={`Remove history entry "${entry.text}"`}
                            className="w-9 h-9 rounded-md border hairline-border flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-coral-text)] hover:border-[var(--accent-coral)] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
