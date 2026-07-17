import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchIndex, searchRows, rankRow, tokenize } from '../build/search-index.mjs';
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
