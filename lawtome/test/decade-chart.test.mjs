// The per-decade rate chart on /timeline/ (backlog B5). Every column must be a
// count of real entries, and nothing undated may be placed by guess.
import test from 'node:test';
import assert from 'node:assert/strict';
import { decadeChart } from '../src/templates/charts.mjs';

const law = (slug, y, category = 'economics') => ({ slug, coinedYear: y, category });

test('columns count entries by decade, and the undated are counted, not placed', () => {
  const laws = [
    ...[1901, 1905, 1909, 1911, 1950, 1951, 1952, 1953, 1954, 1955].map((y, i) => law(`a${i}`, y)),
    { slug: 'u1', category: 'economics' }, { slug: 'u2', coinedYear: 'unknown', category: 'economics' },
  ];
  const html = decadeChart(laws, { economics: 'Economics' });
  assert.match(html, /<title>1900s: 3 laws named<\/title>/);
  assert.match(html, /<title>1910s: 1 law named<\/title>/);
  assert.match(html, /<title>1930s: 0 laws named<\/title>/, 'an empty decade is drawn as empty, not skipped');
  assert.match(html, /<title>1950s: 6 laws named<\/title>/);
  assert.match(html, /10 of them\. 2 entries have no year and are left out/);
  assert.match(html, /busiest decade is the 1950s, with 6/);
});

test('the field table orders by median year and skips fields too small to say much', () => {
  const laws = [
    ...[1800, 1810, 1820, 1830, 1840].map((y, i) => law(`o${i}`, y, 'physics')),
    ...[1960, 1970, 1970, 1980, 1990].map((y, i) => law(`n${i}`, y, 'economics')),
    law('s1', 1900, 'logic'), law('s2', 1901, 'logic'),
  ];
  const html = decadeChart(laws, { physics: 'Physics', economics: 'Economics', logic: 'Logic' });
  assert.ok(html.indexOf('>Physics<') < html.indexOf('>Economics<'), 'older field first');
  assert.doesNotMatch(html, />Logic</, 'a field under five dated entries is left out');
  assert.match(html, /<td>1970s \(2\)<\/td>/);
});
