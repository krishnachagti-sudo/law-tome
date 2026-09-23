// Field hub titles are the question people search (backlog B1), and they must
// still fit the result slot. Law pages keep their name-first titles, which
// rest on Search Console evidence recorded in law.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { TITLE_MAX } from '../src/templates/partials.mjs';

const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

test('every field hub asks its question, title-cased, within the budget', (t) => {
  if (!existsSync('dist/category')) return t.skip('no dist/ — run `npm run build` first');
  const dirs = readdirSync('dist/category').filter((d) => statSync(join('dist/category', d)).isDirectory());
  assert.ok(dirs.length >= 15);
  for (const d of dirs) {
    const title = unescape(readFileSync(join('dist/category', d, 'index.html'), 'utf8').match(/<title>([^<]*)/)[1]);
    assert.match(title, /^What Are the Laws of [A-Z][^?]*\?/, `${d}: "${title}"`);
    assert.doesNotMatch(title, / [a-z]{4,}(?= |\?)(?<!\bof)(?<!\bthe)(?<!\band)/, `${d}: a field word left lower case in "${title}"`);
    assert.ok(title.length <= TITLE_MAX, `${d}: ${title.length} characters`);
  }
});

test('law pages keep the name first', (t) => {
  if (!existsSync('dist/laws/parkinsons-law/index.html')) return t.skip('no dist/');
  const title = unescape(readFileSync('dist/laws/parkinsons-law/index.html', 'utf8').match(/<title>([^<]*)/)[1]);
  assert.match(title, /^Parkinson's Law/);
});

// B8: a field too small for a sheet is named on the sheets hub, with its field
// page, so a reader looking for it is not left at a dead end.
import { smallFields, SHEET_MIN } from '../build/sheets.mjs';
test('fields below the sheet floor are listed, with their size', () => {
  const laws = [...Array(SHEET_MIN).keys()].map((i) => ({ slug: `a${i}`, category: 'big' }))
    .concat([{ slug: 'b1', category: 'tiny' }, { slug: 'b2', category: 'tiny' }]);
  assert.deepEqual(smallFields(laws, { tiny: 'Tiny field' }), [{ slug: 'tiny', count: 2, title: 'Tiny field' }]);
});
test('the built sheets hub names the missing field', (t) => {
  if (!existsSync('dist/sheets/index.html')) return t.skip('no dist/');
  assert.match(readFileSync('dist/sheets/index.html', 'utf8'), /<p class="sk-small"><a href="[^"]*category\/linguistics\/">/);
});
