import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchIndex, searchRows, rankRow, tokenize, contentTokens } from '../build/search-index.mjs';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
const laws = [{slug:'goodharts-law', no:'014', name:"Goodhart's Law", aliases:['Goodhart–Strathern'], statement:'When a measure becomes a target…', category:'economics'}];
const idx = buildSearchIndex(laws);
test('row carries slug/no/name/category + a lowercased search blob', () => {
  const r = idx.find(x=>x.slug==='goodharts-law');
  assert.equal(r.name, "Goodhart's Law");
  assert.match(r.blob, /strathern/);
  assert.match(r.blob, /measure/);
  assert.equal(r.blob, r.blob.toLowerCase());
});

// ---- added coverage ----------------------------------------------------
test('blob includes category and every alias', () => {
  const rows = buildSearchIndex([
    { slug: 's', no: '1', name: 'N', aliases: ['Alpha', 'Beta'], statement: 'St', category: 'Cat' },
  ]);
  const b = rows[0].blob;
  assert.match(b, /alpha/);
  assert.match(b, /beta/);
  assert.match(b, /cat/);
  assert.match(b, /st/);
});

test('display fields stay in original case, only blob is lowercased', () => {
  const rows = buildSearchIndex([
    { slug: 's', no: '1', name: 'CamelName', aliases: [], statement: 'MixedCase', category: 'Econ' },
  ]);
  assert.equal(rows[0].name, 'CamelName');
  assert.equal(rows[0].statement, 'MixedCase');
  assert.equal(rows[0].category, 'Econ');
  assert.equal(rows[0].blob, rows[0].blob.toLowerCase());
});

test('builds one row per law', () => {
  const rows = buildSearchIndex([
    { slug: 'a', no: '1', name: 'A', statement: 'x', category: 'c' },
    { slug: 'b', no: '2', name: 'B', statement: 'y', category: 'c' },
  ]);
  assert.equal(rows.length, 2);
  assert.deepEqual(rows.map((r) => r.slug), ['a', 'b']);
});

test('missing aliases is tolerated (defaults to [])', () => {
  const rows = buildSearchIndex([{ slug: 'a', no: '1', name: 'A', statement: 'x', category: 'c' }]);
  assert.deepEqual(rows[0].aliases, []);
});

const idx2 = buildSearchIndex([
  { slug: 'goodhart', no: '1', name: "Goodhart's Law", aliases: ['Strathern'], statement: 'a measure becomes a target', category: 'economics' },
  { slug: 'cobra', no: '2', name: 'Cobra Effect', aliases: [], statement: 'an incentive to measure the wrong thing', category: 'economics' },
]);

test('token-AND: every token must be a substring of the blob', () => {
  assert.deepEqual(searchRows(idx2, 'measure target').map((r) => r.slug), ['goodhart']);
  // "cobra" only appears in the cobra row's blob; combined with "measure" it must AND-fail on both
  assert.deepEqual(searchRows(idx2, 'measure cobra').map((r) => r.slug), ['cobra']);
  assert.deepEqual(searchRows(idx2, 'nonesuch').map((r) => r.slug), []);
});

test('empty / whitespace query returns no rows', () => {
  assert.deepEqual(searchRows(idx2, ''), []);
  assert.deepEqual(searchRows(idx2, '   '), []);
});

test('name/alias hits rank above statement-only hits', () => {
  // "measure": goodhart matches only in statement (score 1); make a name-hit outrank it.
  const rows = buildSearchIndex([
    { slug: 'stmt-only', no: '1', name: 'Zeta', aliases: [], statement: 'the measure of things', category: 'x' },
    { slug: 'name-hit', no: '2', name: 'Measure Law', aliases: [], statement: 'unrelated', category: 'x' },
  ]);
  const ranked = searchRows(rows, 'measure').map((r) => r.slug);
  assert.deepEqual(ranked, ['name-hit', 'stmt-only']);
});

test('rankRow scores: -1 miss, 1 statement-only, 2 name/alias', () => {
  const [g] = buildSearchIndex([{ slug: 'g', no: '1', name: "Goodhart", aliases: ['Strathern'], statement: 'a measure', category: 'econ' }]);
  assert.equal(rankRow(g, tokenize('goodhart')), 2);
  assert.equal(rankRow(g, tokenize('strathern')), 2);
  assert.equal(rankRow(g, tokenize('measure')), 1);
  assert.equal(rankRow(g, tokenize('absent')), -1);
});

// Consumer-contract: the client card (search.js buildCard) renders a reliability
// badge + "N related" line, so the index must carry those display-only fields —
// and they must NOT leak into the search blob.
test('rows carry display-only reliability + related count, excluded from blob', () => {
  const [r] = buildSearchIndex([{ slug:'x', no:'001', name:'X', statement:'S', category:'economics', reliability:'Folk-adage', related:[{slug:'y'},{slug:'z'}] }]);
  assert.equal(r.reliability, 'Folk-adage');
  assert.equal(r.rels, 2);
  assert.doesNotMatch(r.blob, /folk-adage/); // reliability is display-only, not searchable
});

// ---- situation / symptom search ---------------------------------------------

test('blob gains concept keywords from meaning + examples (not whyItMatters)', () => {
  const [r] = buildSearchIndex([{
    slug: 'g', no: '1', name: 'G', aliases: [], statement: 'St', category: 'c',
    meaning: 'targets stop measuring what matters', whyItMatters: 'incentives corrode metrics',
    examples: [{ tag: 'Schools', text: 'teaching to the test' }],
  }]);
  // Content words from meaning + example text are present…
  assert.match(r.blob, /\btargets\b/);
  assert.match(r.blob, /\bmeasuring\b/);
  assert.match(r.blob, /\bteaching\b/);
  assert.match(r.blob, /\bschools\b/);
  // …whyItMatters is deliberately NOT indexed (bulkiest, least discriminating)…
  assert.doesNotMatch(r.blob, /incentives|corrode/);
  // …and stopwords are dropped.
  assert.doesNotMatch(r.blob, /\bwhat\b/);
});

test('contentTokens drops stopwords and short words', () => {
  assert.deepEqual(contentTokens('we hit our sales target but it got worse'),
    ['hit', 'sales', 'target', 'worse']);
});

const SIT = buildSearchIndex([
  { slug: 'goodhart', no: '1', name: "Goodhart's Law", aliases: [], statement: 'a measure that becomes a target stops being good', category: 'economics',
    // Situational vocabulary lives in meaning + examples (the indexed concept fields).
    meaning: 'reward a sales metric and people optimise the number while product quality gets worse',
    examples: [{ tag: 'Sales', text: 'teams chase the target and the product suffers' }] },
  { slug: 'unrelated', no: '2', name: 'Boyle', aliases: [], statement: 'pressure times volume is constant', category: 'science',
    meaning: 'a gas law about pressure and volume' },
]);

test('a described situation with no exact match finds the law via the fallback', () => {
  // No single blob contains ALL these tokens, so token-AND yields nothing; the
  // >=4-content-word fallback scores Goodhart top on "target/metric/product/worse".
  const hits = searchRows(SIT, 'we hit our sales target but the product got worse').map((r) => r.slug);
  assert.equal(hits[0], 'goodhart');
  assert.ok(!hits.includes('unrelated'), 'the gas law should not match a metrics complaint');
});

test('the fallback never fires for short/keyword queries (Phase-1 behaviour preserved)', () => {
  // 1-3 content words: if token-AND misses, we return nothing rather than fuzzy-match.
  assert.deepEqual(searchRows(SIT, 'zzzznomatch'), []);
  assert.deepEqual(searchRows(SIT, 'product elephant'), []); // 2 words, AND misses on 'elephant' -> []
  // And an exact keyword still works via Phase 1.
  assert.deepEqual(searchRows(SIT, 'goodhart').map((r) => r.slug), ['goodhart']);
});

// The client fetches search-index.json on load, so its size is a real budget.
// The concept keywords roughly double the base; guard against silent bloat.
test('the shipped search index stays within the client-fetch budget', () => {
  const dir = 'src/data/laws';
  const laws = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const gz = gzipSync(JSON.stringify(buildSearchIndex(laws))).length;
  assert.ok(gz < 260 * 1024, `search index is ${(gz / 1024).toFixed(0)}KB gzipped, over the 260KB budget`);
});
