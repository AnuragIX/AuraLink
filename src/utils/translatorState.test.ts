import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TRANSLATOR_STATE,
  ISL_ALPHABET,
  MAX_HISTORY_ENTRIES,
  MAX_OUTPUT_LENGTH,
  countWords,
  getIslLetterSpec,
  translatorReducer,
} from './translatorState';

test('ISL alphabet includes all 26 letters A through Z', () => {
  assert.equal(ISL_ALPHABET.length, 26);
  const letters = ISL_ALPHABET.map((item) => item.letter).join('');
  assert.equal(letters, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
});

test('selecting letters appends uppercase characters and updates selectedLetter', () => {
  let state = INITIAL_TRANSLATOR_STATE;
  state = translatorReducer(state, { type: 'SELECT_LETTER', letter: 'h' });
  state = translatorReducer(state, { type: 'SELECT_LETTER', letter: 'I' });
  assert.equal(state.outputText, 'HI');
  assert.equal(state.selectedLetter, 'I');

  // Invalid characters are ignored safely
  const unchanged = translatorReducer(state, { type: 'SELECT_LETTER', letter: '9' });
  assert.equal(unchanged.outputText, 'HI');
});

test('space appending prevents leading or duplicate spaces', () => {
  let state = INITIAL_TRANSLATOR_STATE;
  state = translatorReducer(state, { type: 'APPEND_SPACE' });
  assert.equal(state.outputText, '');

  state = translatorReducer(state, { type: 'SELECT_LETTER', letter: 'A' });
  state = translatorReducer(state, { type: 'APPEND_SPACE' });
  state = translatorReducer(state, { type: 'APPEND_SPACE' });
  state = translatorReducer(state, { type: 'SELECT_LETTER', letter: 'B' });
  assert.equal(state.outputText, 'A B');
  assert.equal(countWords(state.outputText), 2);
});

test('backspace removes trailing character and updates selectedLetter', () => {
  let state = INITIAL_TRANSLATOR_STATE;
  for (const ch of ['I', 'S', 'L']) {
    state = translatorReducer(state, { type: 'SELECT_LETTER', letter: ch });
  }
  state = translatorReducer(state, { type: 'BACKSPACE' });
  assert.equal(state.outputText, 'IS');
  assert.equal(state.selectedLetter, 'S');

  state = translatorReducer(state, { type: 'BACKSPACE' });
  state = translatorReducer(state, { type: 'BACKSPACE' });
  assert.equal(state.outputText, '');
  assert.equal(state.selectedLetter, null);
});

test('committing, restoring, removing history entries and resetting workspace', () => {
  let state = INITIAL_TRANSLATOR_STATE;
  for (const ch of ['H', 'E', 'L', 'L', 'O']) {
    state = translatorReducer(state, { type: 'SELECT_LETTER', letter: ch });
  }
  state = translatorReducer(state, {
    type: 'COMMIT_TO_HISTORY',
    id: 'entry-1',
    createdAtIso: '2026-11-21T10:00:00.000Z',
  });
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].text, 'HELLO');
  assert.equal(state.history[0].characterCount, 5);
  assert.equal(state.history[0].wordCount, 1);

  // Duplicate top entry is skipped cleanly
  const dupState = translatorReducer(state, {
    type: 'COMMIT_TO_HISTORY',
    id: 'entry-dup',
    createdAtIso: '2026-11-21T10:01:00.000Z',
  });
  assert.equal(dupState.history.length, 1);

  // Clear text preserves history
  state = translatorReducer(state, { type: 'CLEAR_TEXT' });
  assert.equal(state.outputText, '');
  assert.equal(state.history.length, 1);

  // Restore history entry populates output
  state = translatorReducer(state, { type: 'RESTORE_HISTORY_ENTRY', id: 'entry-1' });
  assert.equal(state.outputText, 'HELLO');
  assert.equal(state.selectedLetter, 'O');

  // Remove entry deletes from history
  state = translatorReducer(state, { type: 'REMOVE_HISTORY_ENTRY', id: 'entry-1' });
  assert.equal(state.history.length, 0);

  // Reset workspace clears everything
  state = translatorReducer(state, {
    type: 'COMMIT_TO_HISTORY',
    id: 'entry-2',
    createdAtIso: '2026-11-21T10:02:00.000Z',
  });
  state = translatorReducer(state, { type: 'RESET_WORKSPACE' });
  assert.equal(state.outputText, '');
  assert.equal(state.selectedLetter, null);
  assert.equal(state.history.length, 0);
});

test('output length and history list respect upper bounds', () => {
  let state = INITIAL_TRANSLATOR_STATE;
  for (let i = 0; i < MAX_OUTPUT_LENGTH + 10; i++) {
    state = translatorReducer(state, { type: 'SELECT_LETTER', letter: 'A' });
  }
  assert.equal(state.outputText.length, MAX_OUTPUT_LENGTH);

  let histState = INITIAL_TRANSLATOR_STATE;
  for (let i = 0; i < MAX_HISTORY_ENTRIES + 5; i++) {
    const letter = ISL_ALPHABET[i % 26].letter;
    histState = translatorReducer(histState, { type: 'SELECT_LETTER', letter });
    histState = translatorReducer(histState, {
      type: 'COMMIT_TO_HISTORY',
      id: `h-${i}`,
      createdAtIso: '2026-11-21T10:00:00.000Z',
    });
  }
  assert.equal(histState.history.length, MAX_HISTORY_ENTRIES);
});

test('getIslLetterSpec returns matching spec or null', () => {
  const spec = getIslLetterSpec('a');
  assert.ok(spec);
  assert.equal(spec.letter, 'A');
  assert.equal(getIslLetterSpec(null), null);
  assert.equal(getIslLetterSpec('?'), null);
});
