import test from 'node:test';
import assert from 'node:assert/strict';
import { isSafeHttpUrl, isValidContactEmail } from './urlValidation';

test('isSafeHttpUrl accepts valid http and https URLs', () => {
  assert.equal(isSafeHttpUrl('https://github.com/AnuragIX/AuraLink'), true);
  assert.equal(isSafeHttpUrl('http://localhost:3000'), true);
});

test('isSafeHttpUrl rejects dangerous schemes, credentials, and malformed inputs', () => {
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);
  assert.equal(isSafeHttpUrl('JAVASCRIPT:alert(1)'), false);
  assert.equal(isSafeHttpUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isSafeHttpUrl('vbscript:msgbox(1)'), false);
  assert.equal(isSafeHttpUrl('https://user:pass@example.com'), false);
  assert.equal(isSafeHttpUrl(''), false);
  assert.equal(isSafeHttpUrl('not-a-url'), false);
});

test('isValidContactEmail validates standard email addresses and blocks mailto injection', () => {
  assert.equal(isValidContactEmail('team@example.org'), true);
  assert.equal(isValidContactEmail(''), false);
  assert.equal(isValidContactEmail('team@example.org?subject=Injected'), false);
  assert.equal(isValidContactEmail('team@example.org\r\nBcc:evil@example.com'), false);
  assert.equal(isValidContactEmail('<script>@example.com'), false);
});
