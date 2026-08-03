// /best-known/ — the only honest answer to "which are the most famous?".
//
// The page reports somebody else's measurement rather than a judgement of ours,
// and its whole defensibility rests on two things being true: the phrase that
// was counted is printed beside every entry, and single-word phrases are
// excluded. Drop either and the page becomes a ranking that says Substance is
// the best-known named law in the world.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { bestKnown, bestKnownPage, phraseWords } from '../src/templates/bestknown.mjs';

const CORPUS = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
const FACTS = JSON.parse(readFileSync('src/data/facts.json', 'utf8'));

test('the ngram tokeniser does not turn a possessive into two words', () => {
  // "Murphy's Law" is stored as "Murphy 's Law" and a hyphenated name splits
  // around the hyphen; both are two-word terms to any reader.
  assert.equal(phraseWords("Murphy 's Law"), 2);
  assert.equal(phraseWords('Navier - Stokes Equations'), 3);
  assert.equal(phraseWords('Substance'), 1);
  assert.equal(phraseWords('Habeas Corpus'), 2);
  assert.equal(phraseWords(''), 0);
});

test('single-word phrases are excluded, because they measure the ordinary word', () => {
  const laws = [
    { slug: 'a', name: 'Substance', no: '1' },
    { slug: 'b', name: 'Moore\'s Law', no: '2' },
  ];
  const facts = {
    a: { ngram: { phrase: 'Substance', peak: 9, from: 1800, series: [1, 9] } },
    b: { ngram: { phrase: "Moore 's Law", peak: 1, from: 1800, series: [1, 1] } },
  };
  const ranked = bestKnown(laws, facts);
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].law.slug, 'b');
  // The rule is a parameter, so the exclusion is inspectable rather than baked in.
  assert.equal(bestKnown(laws, facts, { minWords: 1 }).length, 2);
});

test('ranking is by peak, and the peak year is read off the series', () => {
  const laws = [{ slug: 'a', name: 'A B', no: '1' }, { slug: 'b', name: 'C D', no: '2' }];
  const facts = {
    a: { ngram: { phrase: 'A B', peak: 0.5, from: 1900, series: [1, 5, 2] } },
    b: { ngram: { phrase: 'C D', peak: 0.9, from: 1900, series: [4, 1, 1] } },
  };
  const ranked = bestKnown(laws, facts);
  assert.deepEqual(ranked.map((r) => r.law.slug), ['b', 'a']);
  assert.equal(ranked[0].peakYear, 1900);
  assert.equal(ranked[1].peakYear, 1901);
});

test('an entry with no reading is absent rather than ranked at zero', () => {
  const laws = [{ slug: 'a', name: 'A B', no: '1' }, { slug: 'b', name: 'C D', no: '2' }];
  const ranked = bestKnown(laws, { a: { ngram: { phrase: 'A B', peak: 0.5, from: 1800, series: [1] } }, b: {} });
  assert.deepEqual(ranked.map((r) => r.law.slug), ['a']);
});

test('every row shows the phrase that was actually counted', () => {
  const ranked = bestKnown(CORPUS, FACTS);
  assert.ok(ranked.length > 500, `only ${ranked.length} measured`);
  const html = bestKnownPage(ranked, { base: '/', origin: 'https://e.com', corpusTotal: CORPUS.length, limit: 40 });
  const shown = (html.match(/counted as “/g) || []).length;
  assert.equal(shown, 40, 'a row went out without its phrase');
  for (const r of ranked.slice(0, 40)) assert.match(html, new RegExp(`href="/laws/${r.law.slug}/"`));
});

test('the page refuses to claim it is measuring importance', () => {
  const html = bestKnownPage(bestKnown(CORPUS, FACTS), { base: '/', origin: '', corpusTotal: CORPUS.length, limit: 20 });
  assert.match(html, /not a measure of how important, how useful, or how true/);
  assert.match(html, /Google Books Ngrams/);
  // …and it owns the exclusion rather than hiding it.
  assert.match(html, /Substance/);
  assert.match(html, /Fermentation/);
  // The count it left out has to appear, so the ranking cannot read as complete.
  const missing = CORPUS.length - bestKnown(CORPUS, FACTS).length;
  assert.ok(html.includes(missing.toLocaleString('en-US')), 'the unmeasured count is not stated');
});

test('the sparkline is real data, scaled to its own maximum', () => {
  const laws = [{ slug: 'a', name: 'A B', no: '1', reliability: 'Heuristic' }];
  const facts = { a: { ngram: { phrase: 'A B', peak: 1, from: 1800, series: [0, 5, 10, 5, 0, 0, 0, 0] } } };
  const html = bestKnownPage(bestKnown(laws, facts), { base: '/', origin: '', corpusTotal: 1 });
  const m = /<polyline points="([^"]+)"/.exec(html);
  assert.ok(m, 'no sparkline');
  const ys = m[1].split(' ').map((p) => Number(p.split(',')[1]));
  // The maximum sits at the top of the box and the zeroes at the bottom.
  assert.equal(Math.min(...ys), ys[2]);
  assert.equal(Math.max(...ys), ys[0]);
});
