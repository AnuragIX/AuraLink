export interface IslLetterSpec {
  letter: string;
  hands: 'Two-hand' | 'One-hand';
  postureNote: string;
}

export interface TranslationHistoryEntry {
  id: string;
  text: string;
  createdAtIso: string;
  characterCount: number;
  wordCount: number;
}

export interface TranslatorState {
  selectedLetter: string | null;
  outputText: string;
  history: TranslationHistoryEntry[];
  lastActionMessage: string;
}

export type TranslatorAction =
  | { type: 'SELECT_LETTER'; letter: string }
  | { type: 'APPEND_SPACE' }
  | { type: 'BACKSPACE' }
  | { type: 'CLEAR_TEXT' }
  | { type: 'COMMIT_TO_HISTORY'; id: string; createdAtIso: string }
  | { type: 'RESTORE_HISTORY_ENTRY'; id: string }
  | { type: 'REMOVE_HISTORY_ENTRY'; id: string }
  | { type: 'RESET_WORKSPACE' };

export const MAX_OUTPUT_LENGTH = 280;
export const MAX_HISTORY_ENTRIES = 20;

export const ISL_ALPHABET: readonly IslLetterSpec[] = [
  { letter: 'A', hands: 'Two-hand', postureNote: 'Two-handed finger-tip contact forming the letter peak.' },
  { letter: 'B', hands: 'Two-hand', postureNote: 'Curved fingers of both hands meeting to form twin loops.' },
  { letter: 'C', hands: 'One-hand', postureNote: 'Single hand curved into an open C arc.' },
  { letter: 'D', hands: 'Two-hand', postureNote: 'Curved right fingers resting against upright left index finger.' },
  { letter: 'E', hands: 'Two-hand', postureNote: 'Index fingertips touching in a compact two-hand posture.' },
  { letter: 'F', hands: 'Two-hand', postureNote: 'Two fingers of the right hand placed across two left fingers.' },
  { letter: 'G', hands: 'Two-hand', postureNote: 'Closed fists stacked vertically with relaxed alignment.' },
  { letter: 'H', hands: 'Two-hand', postureNote: 'Flat palm gliding lightly across the open opposite palm.' },
  { letter: 'I', hands: 'Two-hand', postureNote: 'Right index touching the middle fingertip of the left hand.' },
  { letter: 'J', hands: 'Two-hand', postureNote: 'Index finger tracing a subtle hook along the open palm.' },
  { letter: 'K', hands: 'Two-hand', postureNote: 'Curved index finger positioned against the vertical left index.' },
  { letter: 'L', hands: 'One-hand', postureNote: 'Index finger extended vertically with thumb at a right angle.' },
  { letter: 'M', hands: 'Two-hand', postureNote: 'Three fingers placed gently onto the open opposite palm.' },
  { letter: 'N', hands: 'Two-hand', postureNote: 'Two fingers placed flat across the open opposite palm.' },
  { letter: 'O', hands: 'One-hand', postureNote: 'Thumb and fingers curved inward to form a closed O.' },
  { letter: 'P', hands: 'Two-hand', postureNote: 'Thumb and index forming a circle touching the upright index tip.' },
  { letter: 'Q', hands: 'Two-hand', postureNote: 'Right index hooked into a closed left thumb-index ring.' },
  { letter: 'R', hands: 'Two-hand', postureNote: 'Curved right index resting across the open left palm.' },
  { letter: 'S', hands: 'Two-hand', postureNote: 'Little fingers interlocked gently at chest height.' },
  { letter: 'T', hands: 'Two-hand', postureNote: 'Right index tapping the base edge of the open left palm.' },
  { letter: 'U', hands: 'Two-hand', postureNote: 'Right index touching the tip of the extended little finger.' },
  { letter: 'V', hands: 'One-hand', postureNote: 'Index and middle fingers raised in an open V shape.' },
  { letter: 'W', hands: 'Two-hand', postureNote: 'Fingers of both hands interlaced upward in a W formation.' },
  { letter: 'X', hands: 'Two-hand', postureNote: 'Both index fingers crossed cleanly at the midpoint.' },
  { letter: 'Y', hands: 'Two-hand', postureNote: 'Right index placed into the angle between left thumb and index.' },
  { letter: 'Z', hands: 'Two-hand', postureNote: 'Flat fingertips angled against the vertical opposite palm.' },
];

export const INITIAL_TRANSLATOR_STATE: TranslatorState = {
  selectedLetter: null,
  outputText: '',
  history: [],
  lastActionMessage: 'Workspace ready. Select an ISL letter to compose text.',
};

export function getIslLetterSpec(letter: string | null): IslLetterSpec | null {
  if (!letter) return null;
  const normalized = letter.trim().toUpperCase();
  return ISL_ALPHABET.find((item) => item.letter === normalized) ?? null;
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function formatHistoryTimestamp(isoString: string): string {
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return 'Just now';
  }
  return parsed.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function translatorReducer(
  state: TranslatorState,
  action: TranslatorAction,
): TranslatorState {
  switch (action.type) {
    case 'SELECT_LETTER': {
      const normalized = action.letter.trim().toUpperCase();
      if (!/^[A-Z]$/.test(normalized)) {
        return state;
      }
      if (state.outputText.length >= MAX_OUTPUT_LENGTH) {
        return {
          ...state,
          selectedLetter: normalized,
          lastActionMessage: `Maximum output length (${MAX_OUTPUT_LENGTH} characters) reached.`,
        };
      }
      return {
        ...state,
        selectedLetter: normalized,
        outputText: state.outputText + normalized,
        lastActionMessage: `Added letter ${normalized} to output.`,
      };
    }

    case 'APPEND_SPACE': {
      if (
        state.outputText.length === 0 ||
        state.outputText.endsWith(' ') ||
        state.outputText.length >= MAX_OUTPUT_LENGTH
      ) {
        return state;
      }
      return {
        ...state,
        outputText: state.outputText + ' ',
        lastActionMessage: 'Added word space.',
      };
    }

    case 'BACKSPACE': {
      if (state.outputText.length === 0) {
        return state;
      }
      const nextOutput = state.outputText.slice(0, -1);
      const lastChar = nextOutput.trimEnd().slice(-1);
      return {
        ...state,
        outputText: nextOutput,
        selectedLetter: /^[A-Z]$/.test(lastChar) ? lastChar : null,
        lastActionMessage: 'Removed last character.',
      };
    }

    case 'CLEAR_TEXT': {
      if (state.outputText.length === 0 && state.selectedLetter === null) {
        return state;
      }
      return {
        ...state,
        outputText: '',
        selectedLetter: null,
        lastActionMessage: 'Cleared output text.',
      };
    }

    case 'COMMIT_TO_HISTORY': {
      const trimmed = state.outputText.trim();
      if (!trimmed) {
        return {
          ...state,
          lastActionMessage: 'Compose text before saving to session history.',
        };
      }
      const existingTop = state.history[0];
      if (existingTop && existingTop.text === trimmed) {
        return {
          ...state,
          lastActionMessage: 'This phrase is already the latest entry in session history.',
        };
      }
      const entry: TranslationHistoryEntry = {
        id: action.id,
        text: trimmed,
        createdAtIso: action.createdAtIso,
        characterCount: trimmed.length,
        wordCount: countWords(trimmed),
      };
      return {
        ...state,
        history: [entry, ...state.history].slice(0, MAX_HISTORY_ENTRIES),
        lastActionMessage: `Saved "${trimmed}" to session history.`,
      };
    }

    case 'RESTORE_HISTORY_ENTRY': {
      const target = state.history.find((item) => item.id === action.id);
      if (!target) return state;
      const lastChar = target.text.trimEnd().slice(-1);
      return {
        ...state,
        outputText: target.text,
        selectedLetter: /^[A-Z]$/.test(lastChar) ? lastChar : null,
        lastActionMessage: `Loaded "${target.text}" into output panel.`,
      };
    }

    case 'REMOVE_HISTORY_ENTRY': {
      const nextHistory = state.history.filter((item) => item.id !== action.id);
      if (nextHistory.length === state.history.length) return state;
      return {
        ...state,
        history: nextHistory,
        lastActionMessage: 'Removed item from session history.',
      };
    }

    case 'RESET_WORKSPACE': {
      return {
        ...INITIAL_TRANSLATOR_STATE,
        lastActionMessage: 'Workspace reset to initial state.',
      };
    }

    default:
      return state;
  }
}
