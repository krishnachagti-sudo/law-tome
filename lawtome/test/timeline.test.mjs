import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eraGroups } from '../build/timeline.mjs';
import { timelinePage } from '../src/templates/timeline.mjs';

const LAWS = [
  { slug: 'a', no: '1', name: 'A', coinedYear: 1962 },
  { slug: 'b', no: '2', name: 'B', coinedYear: 1911 },
  { slug: 'c', no: '3', name: 'C', coinedYear: 1776 },
  { slug: 'd', no: '4', name: 'D', coinedYear: 0 },      // -> Undated
  { slug: 'e', no: '5', name: 'E' },                     // no year -> Undated
];

test('buckets by century in chronological order, undated last', () => {
  const eras = eraGroups(LAWS);
  assert.deepEqual(eras.map((e) => e.label), ['18th century', '20th century', 'Undated']);
  // 1962 and 1911 both land in the 20th century, sorted by year ascending.
  const c20 = eras.find((e) => e.label === '20th century');
  assert.deepEqual(c20.laws.map((l) => l.slug), ['b', 'a']); // 1911 before 1962
  const undated = eras.find((e) => e.label === 'Undated');
  assert.deepEqual(undated.laws.map((l) => l.slug).sort(), ['d', 'e']);
});

test('page renders era headings, years, and law links', () => {
  const h = timelinePage(eraGroups(LAWS), { base: '/lawtome/', origin: 'https://conyso.com', count: 5 });
  assert.match(h, /<h1>A timeline of named laws<\/h1>/);
  assert.match(h, /20th century/);
  assert.match(h, /18th century/);
  assert.match(h, /class="tl-year">1962</);
  assert.match(h, /href="\/lawtome\/laws\/a\/"/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/timeline\/"/);
});

test('all-undated corpus still renders (no NaN century)', () => {
  const h = timelinePage(eraGroups([{ slug: 'x', no: '1', name: 'X' }]), { base: '/lawtome/' });
  assert.match(h, /Undated/);
  assert.doesNotMatch(h, /NaN/);
});
