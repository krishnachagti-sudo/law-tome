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

// A variant NAME is a search term in its own right — someone looks up
// "mutational meltdown", not "Muller's Ratchet". It goes in the base blob, not
// the concept bag, so the multi-word phrase survives intact rather than being
// shredded into two capped, deduplicated words. The variant TEXT stays out.
test('variant names are searchable, variant prose is not', () => {
  const rows = buildSearchIndex([{
    slug: 'mr', no: '001', name: "Muller's Ratchet", statement: 'Harmful mutations build up.',
    category: 'biology', reliability: 'Empirical',
    variants: [{ name: 'Mutational meltdown', text: 'An accelerating spiral of shrinking population size.' }],
  }]);
  assert.match(rows[0].blob, /mutational meltdown/);
  assert.doesNotMatch(rows[0].blob, /accelerating spiral/);
});

// --- fold: apostrophes, accents, dashes and run-together names -------------
//
// Every one of these was a real miss. "murphys" returned nothing because the
// index held the apostrophe and the match is a substring test; "godel" and
// "poincare" missed for the accent; "dunning-kruger" missed because the corpus
// spells it with an en dash.
import { fold } from '../build/search-index.mjs';
import { readFileSync as _rfs } from 'node:fs';

test('fold deletes apostrophes and folds accents, dashes and case', () => {
  assert.equal(fold("Murphy's Law"), 'murphys law');
  assert.equal(fold('Murphy’s Law'), 'murphys law');      // curly
  assert.equal(fold('Gödel'), 'godel');
  assert.equal(fold('Poincaré Recurrence'), 'poincare recurrence');
  assert.equal(fold('Dunning–Kruger'), 'dunning kruger');       // en dash
  assert.equal(fold('  P vs. NP  '), 'p vs np');
  assert.equal(fold(null), '');
  assert.equal(fold(undefined), '');
});

const FOLD_LAWS = [
  { slug: 'murphys-law', no: '1', name: "Murphy's Law", statement: 'Anything that can go wrong will go wrong', category: 'planning', aliases: ["Sod's Law"] },
  { slug: 'godels', no: '2', name: "Gödel's Incompleteness Theorems", statement: 'No consistent system proves its own consistency', category: 'mathematics' },
  { slug: 'dk', no: '3', name: 'The Dunning–Kruger Effect', statement: 'The unskilled overrate themselves', category: 'psychology' },
];
const FOLD_ROWS = buildSearchIndex(FOLD_LAWS);

test('a query finds a name whatever the reader does with its punctuation', () => {
  for (const q of ['murphys', "murphy's", 'MURPHYS', 'murphys law', "sod's law", 'sods law']) {
    assert.deepEqual(searchRows(FOLD_ROWS, q).map((r) => r.slug), ['murphys-law'], `query: ${q}`);
  }
});

test('a query finds an accented name typed without the accent', () => {
  for (const q of ['godel', 'Gödel', 'godels incompleteness']) {
    assert.deepEqual(searchRows(FOLD_ROWS, q).map((r) => r.slug), ['godels'], `query: ${q}`);
  }
});

test('a hyphen, an en dash and a space are the same separator', () => {
  for (const q of ['dunning kruger', 'dunning-kruger', 'Dunning–Kruger']) {
    assert.deepEqual(searchRows(FOLD_ROWS, q).map((r) => r.slug), ['dk'], `query: ${q}`);
  }
});

test('a run-together query matches the names, but not two words of a statement', () => {
  assert.deepEqual(searchRows(FOLD_ROWS, 'murphyslaw').map((r) => r.slug), ['murphys-law']);
  assert.deepEqual(searchRows(FOLD_ROWS, 'dunningkruger').map((r) => r.slug), ['dk']);
  // "can go wrong" lives in a statement; squashing the whole blob would make
  // "cangowrong" a hit, and every adjacent word pair with it.
  assert.deepEqual(searchRows(FOLD_ROWS, 'cangowrong'), []);
});

test('the browser twin of fold is byte-identical to this one', () => {
  // Two copies exist because search.js cannot import from build/. They must not
  // drift: a difference here is invisible until a reader types an apostrophe.
  const js = _rfs('src/assets/search.js', 'utf8');
  const body = (src, name) => {
    const i = src.indexOf(`function ${name}(s)`);
    assert.ok(i !== -1, `${name} not found`);
    const open = src.indexOf('{', i);
    let depth = 0, end = open;
    for (let k = open; k < src.length; k++) {
      if (src[k] === '{') depth++;
      else if (src[k] === '}') { depth--; if (!depth) { end = k; break; } }
    }
    return src.slice(open + 1, end).replace(/\s+/g, ' ').replace(/^var /, 'const ').trim();
  };
  assert.equal(body(js, 'fold'), body(_rfs('build/search-index.mjs', 'utf8'), 'fold'));
});
