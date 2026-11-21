import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextTheme, isValidTheme, resolveInitialTheme } from './theme';

test('resolveInitialTheme honors valid stored preference over system default', () => {
  assert.equal(resolveInitialTheme('light', true), 'light');
  assert.equal(resolveInitialTheme('dark', false), 'dark');
});

test('resolveInitialTheme falls back to system preference when storage is empty or invalid', () => {
  assert.equal(resolveInitialTheme(null, true), 'dark');
  assert.equal(resolveInitialTheme(null, false), 'light');
  assert.equal(resolveInitialTheme('invalid', true), 'dark');
});

test('getNextTheme toggles cleanly between dark and light', () => {
  assert.equal(getNextTheme('dark'), 'light');
  assert.equal(getNextTheme('light'), 'dark');
  assert.equal(isValidTheme('dark'), true);
  assert.equal(isValidTheme('system'), false);
});
