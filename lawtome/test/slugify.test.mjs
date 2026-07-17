import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../build/slugify.mjs';
test('strips apostrophes (straight + curly) then hyphenates', () => {
  assert.equal(slugify("Goodhart's Law"), 'goodharts-law');
  assert.equal(slugify('Ockham’s Razor'), 'ockhams-razor');
});
test('folds diacritics and en-dash', () => {
  assert.equal(slugify('Dunning–Kruger Effect'), 'dunning-kruger-effect');
  assert.equal(slugify('Gödel'), 'godel');
});
test('collapses and trims separators', () => {
  assert.equal(slugify('  The  Peter   Principle! '), 'the-peter-principle');
});
test('edge cases: pure separators, idempotent round-trip, digit preservation', () => {
  assert.equal(slugify('!!!'), '');
  assert.equal(slugify('already-clean-slug'), 'already-clean-slug');
  assert.equal(slugify('Rule 34'), 'rule-34');
});
