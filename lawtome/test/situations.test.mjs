import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveSituations, situationsBySlug } from '../build/situations.mjs';
import { situationsPage } from '../src/templates/situations.mjs';
import { buildSearchIndex, searchRows } from '../build/search-index.mjs';

const LAWS = {
  'goodharts-law': { slug: 'goodharts-law', no: '1', name: "Goodhart's Law", statement: 'A measure that becomes a target stops being a good measure.', category: 'economics', reliability: 'Heuristic' },
  'brooks-law': { slug: 'brooks-law', no: '2', name: "Brooks's Law", statement: 'Adding manpower to a late project makes it later.', category: 'software', reliability: 'Heuristic' },
};

test('resolveSituations keeps known laws, drops unknown slugs', () => {
  const raw = [
    { situation: 'targets get gamed', law: 'goodharts-law' },
    { situation: 'nope', law: 'does-not-exist' },
  ];
  const { situations, dropped } = resolveSituations(raw, LAWS);
  assert.equal(situations.length, 1);
  assert.equal(situations[0].law.name, "Goodhart's Law");
  assert.deepEqual(dropped, ['does-not-exist']);
});

test('situationsBySlug groups phrases by law slug', () => {
  const m = situationsBySlug([
    { situation: 'A', law: 'goodharts-law' },
    { situation: 'B', law: 'goodharts-law' },
    { situation: 'C', law: 'brooks-law' },
  ]);
  assert.deepEqual(m['goodharts-law'], ['A', 'B']);
  assert.deepEqual(m['brooks-law'], ['C']);
});

test('situation phrasing folded into the blob makes a described query hit the mapped law', () => {
  const laws = Object.values(LAWS);
  const sitMap = situationsBySlug([
    { situation: 'you keep hiring people onto a project that is already running behind and it slips further', law: 'brooks-law' },
  ]);
  const withSit = buildSearchIndex(laws, sitMap);
  const noSit = buildSearchIndex(laws);
  const q = 'we keep hiring people onto a project running behind and it slips further';
  // With the situation folded in, Brooks tops the results…
  assert.equal(searchRows(withSit, q)[0].slug, 'brooks-law');
  // …and the mapped brooks blob actually gained the situation words.
  const b = withSit.find((r) => r.slug === 'brooks-law');
  assert.match(b.blob, /hiring/);
  assert.match(b.blob, /slips/);
  assert.doesNotMatch(noSit.find((r) => r.slug === 'brooks-law').blob, /hiring/);
});

test('page renders each situation → law link, plus FAQPage JSON-LD', () => {
  const { situations } = resolveSituations([{ situation: 'a target gets gamed', law: 'goodharts-law' }], LAWS);
  const h = situationsPage(situations, { base: '/lawtome/', origin: 'https://conyso.com', count: 2 });
  assert.match(h, /What's the law for/);
  assert.match(h, /a target gets gamed/);
  assert.match(h, /href="\/lawtome\/laws\/goodharts-law\/"/);
  assert.match(h, /"@type":"FAQPage"/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/situations\/"/);
});

// The shipped situations file must resolve cleanly against the real corpus —
// every mapped slug exists (no dropped rows, no dead links).
test('the shipped situations all resolve against the corpus', () => {
  const dir = 'src/data/laws';
  const byslug = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8'))).map((l) => [l.slug, l]));
  const raw = JSON.parse(readFileSync('src/data/situations.json', 'utf8'));
  const { situations, dropped } = resolveSituations(raw, byslug);
  assert.deepEqual(dropped, [], `unknown situation slugs: ${dropped.join(', ')}`);
  assert.equal(situations.length, raw.length);
});
