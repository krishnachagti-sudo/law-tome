import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eponymGroups } from '../build/eponyms.mjs';
import { eponymsPage } from '../src/templates/eponyms.mjs';

const LAWS = [
  { slug: 'parkinsons-law', no: '2', name: "Parkinson's Law", namedAfter: 'C. Northcote Parkinson' },
  { slug: 'parkinsons-law-of-triviality', no: '5', name: "Parkinson's Law of Triviality", namedAfter: 'C. Northcote Parkinson' },
  { slug: 'goodharts-law', no: '1', name: "Goodhart's Law", namedAfter: 'Charles Goodhart' },
  { slug: 'anon-effect', no: '9', name: 'Anon Effect' }, // no namedAfter -> excluded
];

test('groups by namesake, sorts each group by no, groups A–Z by surname', () => {
  const g = eponymGroups(LAWS);
  assert.equal(g.length, 2); // Parkinson (2 laws) + Goodhart; Anon excluded
  // Surname order: Goodhart before Parkinson.
  assert.equal(g[0].person, 'Charles Goodhart');
  assert.equal(g[1].person, 'C. Northcote Parkinson');
  // Parkinson's laws sorted by no: 2 before 5.
  assert.deepEqual(g[1].laws.map((l) => l.slug), ['parkinsons-law', 'parkinsons-law-of-triviality']);
});

test('page features multi-law namesakes and lists everyone with links', () => {
  const h = eponymsPage(eponymGroups(LAWS), { base: '/lawtome/', origin: 'https://conyso.com', count: 3 });
  assert.match(h, /<h1>Laws by their namesake<\/h1>/);
  assert.match(h, /Namesakes with more than one law/);
  assert.match(h, /href="\/lawtome\/laws\/parkinsons-law\/"/);
  assert.match(h, /href="\/lawtome\/laws\/goodharts-law\/"/);
  assert.match(h, /class="ep-badge">2</); // Parkinson has a 2-count badge
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/named-after\/"/);
});

test('empty input yields an empty-state page, not a crash', () => {
  const h = eponymsPage(eponymGroups([]), { base: '/lawtome/' });
  assert.match(h, /class="empty"/);
});
