import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tensionPairs, isTensionKind, comparePairs } from '../build/relations.mjs';
import { tensionPage } from '../src/templates/tension.mjs';

const LAWS = [
  { slug: 'a', no: '002', name: 'A Law', statement: 'Do more.', reliability: 'Empirical',
    related: [{ slug: 'b', kind: 'tension' }, { slug: 'c', kind: 'kindred' }] },
  { slug: 'b', no: '001', name: 'B Law', statement: 'Do less.', reliability: 'Contested',
    related: [{ slug: 'a', kind: 'tension' }] }, // reciprocal — must collapse to ONE pair
  { slug: 'c', no: '003', name: 'C Law', statement: 'Do it.', reliability: 'Heuristic',
    related: [{ slug: 'ghost', kind: 'tension' }] }, // dangling — must be skipped
];

test('isTensionKind matches the opposition vocabulary, not kindred', () => {
  assert.ok(isTensionKind('tension'));
  assert.ok(isTensionKind('opposes'));
  assert.ok(isTensionKind('counter'));
  assert.ok(!isTensionKind('kindred'));
  assert.ok(!isTensionKind(''));
});

test('collapses reciprocal edges to one undirected pair and drops dangling', () => {
  const pairs = tensionPairs(LAWS);
  assert.equal(pairs.length, 1, 'a<->b is one pair; a->ghost is dropped');
  // Ordered by `no`: b (001) before a (002).
  assert.equal(pairs[0].a.slug, 'b');
  assert.equal(pairs[0].b.slug, 'a');
});

test('empty / malformed input yields no pairs', () => {
  assert.deepEqual(tensionPairs([]), []);
  assert.deepEqual(tensionPairs(null), []);
  assert.deepEqual(tensionPairs([{ slug: 'x', no: '1' }]), []); // no related[]
});

test('page renders both statements, links, badges, and a CollectionPage', () => {
  const html = tensionPage(tensionPairs(LAWS), { base: '/lawtome/', origin: 'https://conyso.com', count: 3 });
  assert.match(html, /<h1>Laws in tension<\/h1>/);
  assert.match(html, /1 opposing pair<\/span>/);
  assert.match(html, /href="\/lawtome\/laws\/a\//);
  assert.match(html, /href="\/lawtome\/laws\/b\//);
  assert.match(html, /"Do more\."/);
  assert.match(html, /"Do less\."/);
  assert.match(html, /class="badge b-con"/); // B is Contested
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /canonical" href="https:\/\/conyso\.com\/lawtome\/tension\/"/);
});

test('page shows an empty state when there are no pairs', () => {
  const html = tensionPage([], { base: '/lawtome/' });
  assert.match(html, /class="empty"/);
  assert.match(html, /0 opposing pairs/);
});

// A kindred pair earns a comparison page on evidence, never on a guess. The
// corpus links ~1,500 pairs and marks only 163 as opposed or near-twin;
// publishing the rest would be a thousand thin permutations of writing that
// already exists. Two checkable gates let the real ones through.
test('a kindred pair whose names share an uncommon word gets a page', () => {
  const laws = [
    { no: '1', slug: 'change-blindness', name: 'Change Blindness', category: 'psychology',
      related: [{ slug: 'inattentional-blindness', kind: 'kindred' }] },
    { no: '2', slug: 'inattentional-blindness', name: 'Inattentional Blindness', category: 'psychology', related: [] },
  ];
  const p = comparePairs(laws);
  assert.equal(p.length, 1);
  assert.equal(p[0].evidence, 'shared-name');
  assert.equal(p[0].slug, 'change-blindness-vs-inattentional-blindness');
});

test('a kindred pair named in the other entry\'s prose gets a page', () => {
  const laws = [
    { no: '1', slug: 'a', name: 'Parkinson\'s Law', category: 'management',
      misreadings: "Often confused with Parkinson's Law of Triviality, which is a different claim.",
      related: [{ slug: 'b', kind: 'kindred' }] },
    { no: '2', slug: 'b', name: "Parkinson's Law of Triviality", category: 'management', related: [] },
  ];
  assert.equal(comparePairs(laws)[0].evidence, 'named-in-prose');
});

test('a merely kindred pair with no evidence gets no page', () => {
  const laws = [
    { no: '1', slug: 'a', name: 'Something Entirely', category: 'physics', related: [{ slug: 'b', kind: 'kindred' }] },
    { no: '2', slug: 'b', name: 'Wholly Different', category: 'physics', related: [] },
  ];
  assert.deepEqual(comparePairs(laws), []);
});

test('a genre word shared by two names is not evidence', () => {
  // Both contain "law" and "the"; neither is a distinguishing collision.
  const laws = [
    { no: '1', slug: 'a', name: "The First Law of Widgets", category: 'physics', related: [{ slug: 'b', kind: 'kindred' }] },
    { no: '2', slug: 'b', name: "The Law of Sprockets", category: 'physics', related: [] },
  ];
  assert.deepEqual(comparePairs(laws), []);
});

test('an opposed edge outranks kindred for the same pair', () => {
  const laws = [
    { no: '1', slug: 'a', name: 'Alpha Blindness', category: 'psychology',
      related: [{ slug: 'b', kind: 'kindred' }, { slug: 'b', kind: 'tension' }] },
    { no: '2', slug: 'b', name: 'Beta Blindness', category: 'psychology', related: [] },
  ];
  const p = comparePairs(laws);
  assert.equal(p.length, 1);
  assert.equal(p[0].relation, 'tension');
});
