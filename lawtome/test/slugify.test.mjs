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
// Characterization tests: pin the behavior slugify.mjs flags as likely to change
// at Plan B scale, so a silent regression turns into a failing test rather than
// a quietly different slug (permalinks are immutable — a slug shift is a bug).
test('pins documented non-folding letters (ø/ł/ß) vs the decomposing contrast', () => {
  assert.equal(slugify('Øresund'), 'resund');          // ø: non-decomposing -> dropped
  assert.equal(slugify('Łukasiewicz'), 'ukasiewicz');  // ł: non-decomposing -> dropped
  assert.equal(slugify('Straße'), 'stra-e');           // ß: non-decomposing -> separator
  assert.equal(slugify('Erdős'), 'erdos');             // ő DOES decompose under NFKD -> folds
});
test('is idempotent under double application', () => {
  const messy = '  Mëssy — Náme! ';
  assert.equal(slugify(slugify(messy)), slugify(messy));
});
