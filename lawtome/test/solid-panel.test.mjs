// The "how solid" figures in every law page's "Is it real?" section (B7).
//
// Three rules the panel has to keep, because each is the kind of thing that
// looks fine on the page while being wrong:
//   - the fame rank appears only where print frequency was measured;
//   - the field figure counts the same field and the same rating, nothing else;
//   - the verdict link appears only where a verdict page exists.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

import { lawPage } from '../src/templates/law.mjs';

const base = {
  no: 1, slug: 'x-law', name: 'X Law', category: 'management', reliability: 'Heuristic',
  statement: 'Something expands.', meaning: 'It means something expands to fill what is there.',
  sources: [{ text: 'A source.', type: 'primary' }],
};
const byslug = {
  'x-law': base,
  'y-law': { ...base, no: 2, slug: 'y-law', reliability: 'Heuristic' },
  'z-law': { ...base, no: 3, slug: 'z-law', reliability: 'Empirical' },
  'w-law': { ...base, no: 4, slug: 'w-law', category: 'physics', reliability: 'Heuristic' },
};
const categories = { management: 'Management & organisations', physics: 'Physics' };
const render = (ctx = {}) => lawPage(base, { byslug, categories, base: '/lawtome/', origin: 'https://conyso.com', ...ctx });

test('the field figure counts the same field and the same rating', () => {
  // Two of the three management entries are Heuristic; the physics one is not
  // in the field at all.
  assert.match(render(), /2 of 3<\/span><span class="vd-cl">entries in <a href="\/lawtome\/category\/management\/">management &amp; organisations<\/a> carry the same rating/);
});

test('a fame rank appears only where one was measured', () => {
  assert.doesNotMatch(render(), /measurable names/);
  assert.match(render({ fame: { rank: 43, of: 904 } }), /#43<\/span><span class="vd-cl">of 904 measurable names/);
});

test('the verdict link appears only where a verdict page exists', () => {
  assert.doesNotMatch(render(), /the full verdict on/);
  assert.match(render({ hasVerdict: true }), /href="\/lawtome\/is-it-real\/x-law\/">the full verdict on X Law/);
});

test('every built law page that asks "Is it real?" carries the figures', (t) => {
  if (!existsSync('dist/index.html')) return t.skip('no dist/ — run `npm run build` first');
  const html = readFileSync('dist/laws/parkinsons-law/index.html', 'utf8');
  assert.match(html, /class="vd-cmp vd-cmp--law"/);
  assert.match(html, /measurable names, by how often it appears in printed books/);
});
