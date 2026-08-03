import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findings, headline } from '../build/findings.mjs';
import { findingsPage } from '../src/templates/findings.mjs';
import { findingCardSvg } from '../build/quotecard.mjs';

// A miniature corpus where the answer is known by construction: the four
// best-known entries are all soft, the four least-known are all Empirical, so
// every band must show a higher soft share than the corpus as a whole.
const LAWS = [
  { slug: 'a', name: 'A', reliability: 'Folk-adage' },
  { slug: 'b', name: 'B', reliability: 'Contested' },
  { slug: 'c', name: 'C', reliability: 'Heuristic' },
  { slug: 'd', name: 'D', reliability: 'Contested' },
  { slug: 'e', name: 'E', reliability: 'Empirical' },
  { slug: 'f', name: 'F', reliability: 'Empirical' },
  { slug: 'g', name: 'G', reliability: 'Empirical' },
  { slug: 'h', name: 'H', reliability: 'Empirical' },
];
const RANKED = LAWS.map((law) => ({ law }));

test('findings counts the tiers and the soft share of the whole corpus', () => {
  const f = findings(LAWS, RANKED, [], [4]);
  assert.equal(f.total, 8);
  assert.deepEqual(f.tiers, { 'Folk-adage': 1, Contested: 2, Heuristic: 1, Empirical: 4 });
  assert.equal(f.softAll, 4);
  assert.equal(f.softAllShare, 0.5);
});

test('the curve reports the soft share of each fame band', () => {
  const f = findings(LAWS, RANKED, [], [4, 8]);
  assert.deepEqual(f.curve.map((c) => [c.n, c.soft, c.share]), [[4, 4, 1], [8, 4, 0.5]]);
});

test('a band larger than the ranking is dropped rather than reported short', () => {
  // Asking for the top 250 of an 8-entry ranking must not produce a band whose
  // denominator is 250 — that would understate the share by a factor of thirty.
  const f = findings(LAWS, RANKED, [], [4, 250]);
  assert.deepEqual(f.curve.map((c) => c.n), [4]);
});

test('the headline states both numbers and matches the curve', () => {
  const f = findings(LAWS, RANKED, [], [4]);
  const h = headline(f);
  assert.match(h, /100% of the 4 best-known/);
  assert.match(h, /50% of the index/);
});

test('headline degrades to a plain sentence when nothing is measured', () => {
  const f = findings(LAWS, [], [], [25]);
  assert.equal(f.curve.length, 0);
  assert.doesNotMatch(headline(f), /NaN|undefined|%/);
});

test('an unmeasured corpus still reports its tiers and its own share', () => {
  const f = findings(LAWS, [], [], [25]);
  assert.equal(f.measured, 0);
  assert.equal(f.softAllShare, 0.5);
});

test('adages and contested are sorted best-known first', () => {
  const laws = [
    { slug: 'obscure', name: 'Obscure', reliability: 'Folk-adage' },
    { slug: 'famous', name: 'Famous', reliability: 'Folk-adage' },
  ];
  const ranked = [{ law: laws[1] }, { law: laws[0] }];
  const f = findings(laws, ranked, [], [2]);
  assert.deepEqual(f.adages.map((l) => l.slug), ['famous', 'obscure']);
});

test('misattributed entries are ordered by fame, unranked ones last', () => {
  const mis = [
    { law: { slug: 'h', name: 'H' }, reason: 'r1' },
    { law: { slug: 'a', name: 'A' }, reason: 'r2' },
    { law: { slug: 'zz', name: 'Unranked' }, reason: 'r3' },
  ];
  const f = findings(LAWS, RANKED, mis, [4]);
  assert.deepEqual(f.misattributed.map((m) => m.law.slug), ['a', 'h', 'zz']);
  assert.equal(f.misattributed[2].at, Infinity);
});

// ---- the page ---------------------------------------------------------------

const PAGE = () => findingsPage(
  findings(LAWS, RANKED, [{ law: LAWS[0], reason: 'the entry says so', quote: 'not the first' }], [4]),
  { base: '/lawtome/', origin: 'https://conyso.com', count: 8 },
);

test('the page leads with the finding, in the same numbers as the module', () => {
  const h = PAGE();
  assert.match(h, /<h1>How solid is any of this\?<\/h1>/);
  assert.match(h, /100% of the 4 best-known/);
  assert.match(h, /50% of the index as a whole/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/how-solid\/"/);
});

test('the page renders a bar per band plus one for the whole index', () => {
  const h = findingsPage(findings(LAWS, RANKED, [], [2, 4, 8]), { base: '/', origin: '' });
  assert.equal((h.match(/class="fx-bar"/g) || []).length, 4, 'three bands + the corpus');
  // No bar may overflow its track.
  for (const [, w] of h.matchAll(/class="fx-bf" style="width:([\d.]+)%/g)) {
    assert.ok(Number(w) <= 100, `bar width ${w}% overflows`);
  }
});

test('the page states its own limits rather than footnoting them', () => {
  const h = PAGE();
  assert.match(h, /Where this could be wrong/);
  assert.match(h, /The ratings are ours/);
  assert.match(h, /counts printing/i);
  // The correlation must not be dressed as a cause.
  assert.match(h, /no cause|does not claim to know/i);
});

test('the page never claims the famous laws are false', () => {
  const h = PAGE();
  assert.doesNotMatch(h, /are wrong\b(?![^<]*\?)/i);
  assert.match(h, /Does this mean the famous laws are wrong\?/);
  assert.match(h, /No, and the page would be worthless if it said so/);
});

test('every entry named in the argument links to its own page', () => {
  const h = PAGE();
  for (const l of LAWS.slice(0, 4)) {
    assert.match(h, new RegExp(`/lawtome/laws/${l.slug}/`), `${l.name} is not linked`);
  }
});

test('the page carries CollectionPage and FAQPage structured data', () => {
  const h = PAGE();
  assert.match(h, /"@type":"CollectionPage"/);
  assert.match(h, /"@type":"FAQPage"/);
  assert.match(h, /"@type":"BreadcrumbList"/);
});

test('a corpus with no fame ranking still renders a page', () => {
  const h = findingsPage(findings(LAWS, [], [], [25]), { base: '/', origin: '' });
  assert.match(h, /<h1>How solid is any of this\?<\/h1>/);
  assert.doesNotMatch(h, /NaN/);
});

test('the bar axis runs 0–100%, not 0–max', () => {
  // A truncated axis would make an 11-point spread look fourfold. On a page
  // arguing that people repeat claims without checking them, that is
  // self-refuting — so the widths must equal the percentages they print.
  const h = findingsPage(findings(LAWS, RANKED, [], [4, 8]), { base: '/', origin: '' });
  const widths = [...h.matchAll(/class="fx-bf" style="width:([\d.]+)%/g)].map((m) => Number(m[1]));
  assert.deepEqual(widths, [100, 50, 50], 'top-4 is 100% soft, top-8 and the corpus are 50%');
});

test('the finding card keeps the same honest axis as the page', () => {
  const rows = [{ label: 'Top 25', share: 0.56 }, { label: 'All entries', share: 0.45 }];
  const svg = findingCardSvg({ rows, origin: 'https://x.test', base: '/' });
  assert.match(svg, />56%</);
  assert.match(svg, />45%</);
  // Two tracks and two fills; each fill is that fraction of the 450px track, so
  // a 56/45 split cannot be drawn as a landslide.
  // Each fill is its share of the full track, not of the largest value: on a
  // truncated axis the 45% bar would be a sliver next to the 56% one.
  const TRACK = 450;
  const fills = [...svg.matchAll(/width="(\d+)" height="22" rx="3" fill="#e0a43f"/g)].map((m) => Number(m[1]));
  assert.deepEqual(fills, rows.map((r) => Math.round(TRACK * r.share)));
});

test('the finding card states what the bars measure', () => {
  const svg = findingCardSvg({ rows: [{ label: 'Top 25', share: 0.56 }], origin: '', base: '/' });
  assert.match(svg, /share NOT resting on measurement/);
});
