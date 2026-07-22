import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveCollections } from '../build/collections.mjs';
import { collectionsIndexPage, collectionPage } from '../src/templates/collections.mjs';

const BYSLUG = {
  a: { slug: 'a', no: '1', name: 'A Law', statement: 'sa', category: 'economics', reliability: 'Empirical', related: [] },
  b: { slug: 'b', no: '2', name: 'B Law', statement: 'sb', category: 'psychology', reliability: 'Contested', related: [] },
};

test('resolveCollections drops unknown slugs, de-dupes, and skips empty collections', () => {
  const raw = [
    { slug: 'good', title: 'Good', blurb: 'bl', laws: ['a', 'b', 'a', 'ghost'] }, // 'a' twice, 'ghost' unknown
    { slug: 'empty', title: 'Empty', blurb: 'bl', laws: ['nope1', 'nope2'] },      // all unknown -> skipped
  ];
  const { collections, dropped } = resolveCollections(raw, BYSLUG);
  assert.equal(collections.length, 1);
  assert.deepEqual(collections[0].laws.map((l) => l.slug), ['a', 'b']); // de-duped, order kept
  assert.ok(dropped.includes('good: ghost'));
  assert.ok(dropped.some((d) => d.startsWith('empty:')));
});

test('hub lists each collection with a count and a link, plus CollectionPage JSON-LD', () => {
  const { collections } = resolveCollections([{ slug: 'good', title: 'Good Set', blurb: 'why', laws: ['a', 'b'] }], BYSLUG);
  const h = collectionsIndexPage(collections, { base: '/lawtome/', origin: 'https://conyso.com', count: 2 });
  assert.match(h, /<h1>Collections<\/h1>/);
  assert.match(h, /href="\/lawtome\/collections\/good\/"/);
  assert.match(h, />Good Set</);
  assert.match(h, /2 laws/);
  assert.match(h, /"@type":"CollectionPage"/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/collections\/"/);
});

test('collection page renders the crumb, blurb, member cards, and an ItemList', () => {
  const { collections } = resolveCollections([{ slug: 'good', title: 'Good Set', blurb: 'the blurb', laws: ['a', 'b'] }], BYSLUG);
  const h = collectionPage(collections[0], { base: '/lawtome/', origin: 'https://conyso.com', count: 2 });
  assert.match(h, /class="crumb"/);
  assert.match(h, /the blurb/);
  assert.match(h, /href="\/lawtome\/laws\/a\/"/);
  assert.match(h, /href="\/lawtome\/laws\/b\/"/);
  assert.match(h, /"@type":"ItemList"/);
  assert.match(h, /"@type":"BreadcrumbList"/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/collections\/good\/"/);
});

// The shipped collections file must resolve cleanly against the real corpus:
// every collection keeps at least one member (no all-dangling collection ships).
test('the shipped collections all resolve against the corpus', async () => {
  const { readFileSync, readdirSync } = await import('node:fs');
  const { join } = await import('node:path');
  const dir = 'src/data/laws';
  const byslug = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8'))).map((l) => [l.slug, l]));
  const raw = JSON.parse(readFileSync('src/data/collections.json', 'utf8'));
  const { collections } = resolveCollections(raw, byslug);
  assert.equal(collections.length, raw.length, 'every authored collection should resolve to >=1 real law');
});
