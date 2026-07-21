import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { checkSources } from '../build/check-sources.mjs';

test('flags unsourced, malformed, and mistyped sources (hard problems)', () => {
  const bad = [
    { slug: 'no-src', sources: [] },
    { slug: 'unsourced', sources: [{ text: '  ', type: 'secondary' }] },       // no url AND no citation
    { slug: 'bad-url', sources: [{ text: 'A full citation, 1975.', url: 'not a url', type: 'primary' }] },
    { slug: 'bad-type', sources: [{ text: 'A full citation, 1975.', url: 'https://ok.example', type: 'tertiary' }] },
    { slug: 'bad-sameas', sources: [{ text: 'A full citation, 1975.', url: 'https://ok.example', type: 'secondary' }], sameAs: 'nope' },
  ];
  const p = checkSources(bad);
  assert.ok(p.some((x) => /no-src: no sources/.test(x)));
  assert.ok(p.some((x) => /unsourced.*no url and no citation/.test(x)));
  assert.ok(p.some((x) => /bad-url.*malformed url/.test(x)));
  assert.ok(p.some((x) => /bad-type.*invalid type/.test(x)));
  assert.ok(p.some((x) => /bad-sameas.*malformed sameAs/.test(x)));
});

test('a full bibliographic citation with no URL is sourced (not a hard problem)', () => {
  const cited = [{ slug: 'goodhart', sources: [{ text: 'Goodhart, C.A.E. (1975). Problems of Monetary Management.', type: 'primary' }] }];
  assert.deepEqual(checkSources(cited), []);
  // ...but it IS surfaced as an enrichment backlog under requireUrl.
  assert.ok(checkSources(cited, { requireUrl: true }).some((x) => /has no url/.test(x)));
});

test('clean sources produce no problems', () => {
  const good = [{ slug: 'ok', sources: [{ text: 'Ref', url: 'https://en.wikipedia.org/wiki/X', type: 'secondary' }], sameAs: 'https://en.wikipedia.org/wiki/X' }];
  assert.deepEqual(checkSources(good), []);
});

test('optional Canon-needs-primary policy', () => {
  const canon = [{ slug: 'c', reliability: 'Canon', sources: [{ text: 't ok citation', url: 'https://ok.example', type: 'secondary' }] }];
  assert.deepEqual(checkSources(canon), []);
  assert.ok(checkSources(canon, { requirePrimaryForCanon: true }).some((x) => /no primary source/.test(x)));
});

// The shipped corpus must have zero HARD source problems: every entry is either
// URL-linked or carries a real bibliographic citation, and none is malformed.
test('the shipped corpus has no unsourced or malformed sources', () => {
  const p = 'src/data/laws';
  const laws = readdirSync(p).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(p, f), 'utf8')));
  const problems = checkSources(laws);
  assert.deepEqual(problems, [], `source problems:\n${problems.slice(0, 20).join('\n')}`);
});
