import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listingPage } from '../src/templates/listing.mjs';
import { reliabilityHubPage } from '../src/templates/reliability.mjs';

const CONTESTED = [
  { slug: 'dk', no: '001', name: 'Dunning-Kruger', statement: 'The unskilled overrate themselves.', category: 'psychology', reliability: 'Contested', related: [] },
  { slug: 'bp', no: '002', name: "Berkson's Paradox", statement: 'Selection fakes a correlation.', category: 'statistics', reliability: 'Contested', related: [] },
];

test('reliability tier page stamps data-reliability so the client keeps the subset', () => {
  const h = listingPage(CONTESTED, { title: 'Contested laws', base: '/lawtome/', kind: 'reliability', origin: 'https://conyso.com', reliabilityKey: 'Contested' });
  assert.match(h, /<div class="grid" id="grid" data-reliability="Contested">/);
  assert.match(h, /<h1>Contested laws<\/h1>/);
  // The tier gloss (shared with the law page) explains the facet.
  assert.match(h, /rated <b>Contested<\/b> — disputed/);
  // Path/canonical uses the slugged tier value.
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/reliability\/contested\/"/);
  // Breadcrumb goes Home > Browse > Reliability > tier.
  assert.match(h, /"BreadcrumbList"/);
  assert.match(h, /"name":"Reliability"/);
});

test("'Folk-adage' slugs to a hyphenated path", () => {
  const h = listingPage([{ slug: 'x', no: '9', name: 'X', statement: 'S', category: 'philosophy', reliability: 'Folk-adage', related: [] }],
    { title: 'Folk-adage laws', base: '/lawtome/', kind: 'reliability', origin: 'https://conyso.com', reliabilityKey: 'Folk-adage' });
  assert.match(h, /data-reliability="Folk-adage"/);
  assert.match(h, /reliability\/folk-adage\/"/);
});

test('hub lists tiers in canonical order with counts and links', () => {
  const h = reliabilityHubPage(
    [{ value: 'Contested', count: 227 }, { value: 'Empirical', count: 519 }], // supplied out of order
    { base: '/lawtome/', origin: 'https://conyso.com', count: 948 },
  );
  // Canonical order: Empirical must render before Contested regardless of input order.
  assert.ok(h.indexOf('>Empirical<') < h.indexOf('>Contested<'), 'Empirical should precede Contested');
  assert.match(h, /href="\/lawtome\/reliability\/empirical\/"/);
  assert.match(h, /href="\/lawtome\/reliability\/contested\/"/);
  assert.match(h, />519</);
  assert.match(h, />227</);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/reliability\/"/);
});

test('a normal browse/category page carries NO data-reliability', () => {
  const h = listingPage(CONTESTED, { title: 'Browse', base: '/lawtome/', kind: 'browse' });
  assert.doesNotMatch(h, /data-reliability/);
});
