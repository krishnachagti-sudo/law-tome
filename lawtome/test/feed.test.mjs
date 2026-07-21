import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFeed } from '../build/feed.mjs';

const LAWS = [
  { slug: 'a-law', name: 'A Law', statement: 'First.', no: '002' },
  { slug: 'b-law', name: 'B & Co Law', statement: 'Second <em>x</em>.', no: '010' },
  { slug: 'c-law', name: 'C Law', statement: 'Third.', no: '001' },
];
const feed = buildFeed(LAWS, { baseUrl: 'https://conyso.com/lawtome/', updated: '2026-07-21T00:00:00Z' });

test('valid Atom document with self link and feed id', () => {
  assert.match(feed, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(feed, /<link rel="self" href="https:\/\/conyso\.com\/lawtome\/feed\.xml"\/>/);
  assert.match(feed, /<\/feed>\s*$/);
});

test('one <entry> per law with absolute id/link', () => {
  assert.equal((feed.match(/<entry>/g) || []).length, 3);
  assert.match(feed, /<id>https:\/\/conyso\.com\/lawtome\/laws\/a-law\/<\/id>/);
});

test('orders newest (highest no) first', () => {
  assert.ok(feed.indexOf('B & Co Law'.replace('&', '&amp;')) < feed.indexOf('>A Law<'), 'no=010 should precede no=002');
  assert.ok(feed.indexOf('>A Law<') < feed.indexOf('>C Law<'), 'no=002 should precede no=001');
});

test('XML-escapes titles and summaries', () => {
  assert.match(feed, /<title>B &amp; Co Law<\/title>/);
  assert.match(feed, /Second &lt;em&gt;x&lt;\/em&gt;\./);
  assert.doesNotMatch(feed, /<title>B & Co/);
});

test('respects the limit', () => {
  const many = Array.from({ length: 80 }, (_, i) => ({ slug: 's' + i, name: 'N' + i, statement: 'x', no: String(i) }));
  const f = buildFeed(many, { baseUrl: 'https://x/', limit: 50 });
  assert.equal((f.match(/<entry>/g) || []).length, 50);
});
