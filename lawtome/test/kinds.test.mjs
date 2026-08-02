// What kind of thing is it — /kinds/.
//
// The whole value of these pages rests on one promise: the classification is
// read off the name and nothing else. If that ever becomes "read off the name,
// except when we thought we knew better", the pages stop being checkable and
// become an unsourced editorial judgement about 1,101 entries. These tests pin
// the rule, the fallback, and the refusal to guess.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KINDS, kindOf, kindOfName, kinds, kindPath } from '../build/kinds.mjs';
import { kindsHubPage, kindPage } from '../src/templates/kinds.mjs';

const CORPUS = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));

test('the head noun decides, not the first word it finds', () => {
  assert.equal(kindOfName("Betteridge's Law of Headlines"), 'law');
  assert.equal(kindOfName('The Base Rate Fallacy'), 'fallacy');
  assert.equal(kindOfName("Occam's Razor"), 'razor');
  assert.equal(kindOfName("The Prisoner's Dilemma"), 'dilemma');
  // Plurals file with their singular.
  assert.equal(kindOfName("Clarke's Three Laws"), 'law');
  assert.equal(kindOfName("Chargaff's Rules"), 'rule');
  // Possessives and punctuation are not word boundaries the scan can trip on.
  assert.equal(kindOfName("Hitchens's Razor"), 'razor');
});

test('a name that says nothing says nothing — no guessing', () => {
  for (const n of ['Anomie', 'Cognitive Dissonance', "Chesterton's Fence", 'Brownian Motion', '']) {
    assert.equal(kindOfName(n), null, `${n} was classified`);
  }
  assert.equal(kindOf(null), null);
  assert.equal(kindOf({ name: 'Anomie' }), null);
});

test('an alias can file an entry, but can never overrule its own name', () => {
  // The only reason the Flaming Laser Sword is a razor: it is also Alder's Razor.
  assert.equal(kindOf({ name: "Newton's Flaming Laser Sword", aliases: ["Alder's Razor"] }), 'razor');
  // …and an alias does NOT get to reclassify a name that already spoke.
  assert.equal(kindOf({ name: "Gauss's Law", aliases: ["Gauss's flux theorem"] }), 'law');
  assert.equal(kindOf({ name: "Pascal's Law", aliases: ["Pascal's principle"] }), 'law');
});

test('grouping keeps corpus order and drops the kinds too small to be a page', () => {
  const g = kinds(CORPUS);
  assert.ok(g.length >= 15, `only ${g.length} kinds`);
  for (const k of g) {
    assert.ok(k.count >= 4, `${k.slug} has ${k.count}`);
    assert.equal(k.count, k.laws.length);
    const nos = k.laws.map((l) => Number(l.no));
    assert.deepEqual(nos, [...nos].sort((a, b) => a - b), `${k.slug} is out of order`);
    // Every member really does carry the word.
    for (const l of k.laws) assert.equal(kindOf(l), k.key, `${l.slug} is not a ${k.key}`);
  }
  // A raised floor removes pages, never members from the pages that remain.
  assert.ok(kinds(CORPUS, { min: 40 }).length < g.length);
});

test('no entry is filed under two kinds', () => {
  const seen = new Map();
  for (const k of kinds(CORPUS)) {
    for (const l of k.laws) {
      assert.ok(!seen.has(l.slug), `${l.slug} is in both ${seen.get(l.slug)} and ${k.slug}`);
      seen.set(l.slug, k.slug);
    }
  }
});

test('every kind has a distinct slug, path and gloss', () => {
  const slugs = new Set(); const keys = new Set();
  for (const k of KINDS) {
    assert.ok(!slugs.has(k.slug) && !keys.has(k.key), `duplicate kind ${k.key}`);
    slugs.add(k.slug); keys.add(k.key);
    assert.ok(k.gloss.length > 40, `${k.key} has no real gloss`);
    assert.equal(kindPath(k), `kinds/${k.slug}/`);
  }
  // /kinds/laws/ and not /laws/ — the latter is where the entries themselves live.
  assert.ok(!KINDS.some((k) => kindPath(k) === 'laws/'));
});

test('the hub states the rule and counts what it left out', () => {
  const g = kinds(CORPUS);
  const html = kindsHubPage(g, { base: '/', origin: 'https://e.com', count: CORPUS.length, total: CORPUS.length });
  assert.match(html, /Membership here is read off the name/);
  const filed = g.reduce((n, k) => n + k.count, 0);
  assert.ok(html.includes(String(CORPUS.length - filed)), 'the unclassified count is not on the page');
  for (const k of g) assert.match(html, new RegExp(`href="/kinds/${k.slug}/"`), `hub does not link ${k.slug}`);
});

test('a kind page carries the rule above the list, and the whole list', () => {
  const g = kinds(CORPUS).find((k) => k.key === 'razor');
  const html = kindPage(g, { base: '/', origin: 'https://e.com', categories: {}, byslug: {} });
  assert.match(html, /Membership here is read off the name/);
  for (const l of g.laws) assert.match(html, new RegExp(`href="/laws/${l.slug}/"`), `missing ${l.slug}`);
  assert.match(html, /<h1[^>]*>Razors<\/h1>/);
});

test('the date clause never speaks for entries that carry no date', () => {
  const dated = { slug: 'a', name: 'A Law', no: '1', statement: 'S', category: 'logic', reliability: 'Heuristic', coinedYear: 1900 };
  const undated = { slug: 'b', name: 'B Law', no: '2', statement: 'S', category: 'logic', reliability: 'Heuristic' };
  const both = kindPage({ ...KINDS.find((k) => k.key === 'law'), laws: [dated, undated], count: 2 },
    { base: '/', origin: '', categories: {} });
  // One of the two has a year, so the sentence must say so rather than claim a span.
  assert.match(both, /1 carry a recorded date/);
  assert.doesNotMatch(both, /named between/);

  const all = kindPage({ ...KINDS.find((k) => k.key === 'law'), laws: [dated, { ...undated, coinedYear: 1950 }], count: 2 },
    { base: '/', origin: '', categories: {} });
  assert.match(all, /named between 1900 and 1950/);
});
