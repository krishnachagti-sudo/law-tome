// The sister-index panel, and the one property it has to hold.
//
// The panel is a claim that a reader who follows it lands on the same idea,
// treated by a second site. If the two sites each worked out the pairing for
// themselves they would eventually disagree, and the failure would be the
// quiet kind: a link across that does not link back. So this side does not
// compute the pairing — it inverts the Atlas's committed crosswalk, and these
// tests check the inversion rather than trusting it.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

import { invert, ATLAS_BASE } from '../build/atlas.mjs';
import { lawPage } from '../src/templates/law.mjs';

const doc = JSON.parse(readFileSync('src/data/atlas.json', 'utf8'));
const BUILT = existsSync('dist/index.html');

test('the Atlas base is absolute and ends in a slash', () => {
  // The panel builds its href as `${ATLAS_BASE}bias/<slug>/`. A missing
  // trailing slash silently yields .../biasesbias/<slug>/.
  assert.match(ATLAS_BASE, /^https:\/\/[^/]+\/.*\/$/);
  assert.equal(doc.base, ATLAS_BASE);
});

test('every pair carries a slug on both sides, and none is claimed twice', () => {
  const here = new Set();
  const there = new Set();
  for (const p of doc.pairs) {
    assert.ok(p.slug, 'a pair with no law slug');
    assert.ok(p.atlas && p.atlas.slug, `${p.slug} carries no Atlas slug`);
    assert.ok(!here.has(p.slug), `${p.slug} paired twice`);
    assert.ok(!there.has(p.atlas.slug), `Atlas ${p.atlas.slug} claimed by two laws`);
    here.add(p.slug);
    there.add(p.atlas.slug);
  }
  assert.equal(doc.counts.pairs, doc.pairs.length);
});

test('a pair whose law no longer exists here is dropped, not published', () => {
  // The Atlas cannot know a law was renamed or removed on this side. If the
  // inversion kept the row anyway, the panel would point at a 404 here while
  // the Atlas went on linking in. The filter is the whole reason invert()
  // takes the corpus at all.
  const fake = { pairs: [
    { slug: 'a', name: 'A', no: '001', matchedBy: 'name', tome: { slug: 'kept' } },
    { slug: 'b', name: 'B', no: '002', matchedBy: 'name', tome: { slug: 'renamed-away' } },
  ] };
  const out = invert(fake, [{ slug: 'kept' }]);
  assert.deepEqual(out.map((p) => p.slug), ['kept']);
});

test('the same law claimed by two Atlas entries keeps only the first', () => {
  const fake = { pairs: [
    { slug: 'a', name: 'A', no: '001', matchedBy: 'name', tome: { slug: 'x' } },
    { slug: 'b', name: 'B', no: '002', matchedBy: 'alias-to-name', tome: { slug: 'x' } },
  ] };
  const out = invert(fake, [{ slug: 'x' }]);
  assert.equal(out.length, 1);
  assert.equal(out[0].atlas.slug, 'a');
});

test('the Atlas verdict is not copied into this side\'s data', () => {
  // Deliberate. A verdict stored here is a figure this site cannot check, and
  // it goes stale silently the moment the Atlas revises an entry. The panel
  // says the other treatment exists and what question it answers; the link is
  // the depth.
  for (const p of doc.pairs) {
    assert.deepEqual(Object.keys(p.atlas).sort(), ['name', 'no', 'slug']);
  }
});

test('a paired law renders the panel, an unpaired one renders nothing', () => {
  const law = { no: '014', slug: 'goodharts-law', name: "Goodhart's Law", statement: 'S', meaning: 'M',
    example: 'E', origin: 'O', whyItMatters: 'W', category: 'economics', reliability: 'Heuristic',
    provenance: 'canon', sources: [{ text: 'G (1975)', url: 'https://x', type: 'primary' }] };
  const ctx = { byslug: {}, categories: { economics: 'Economics' }, base: '/lawtome/', origin: 'https://conyso.com' };

  assert.doesNotMatch(lawPage(law, ctx), /Also in the Bias Atlas/);

  const paired = lawPage(law, { ...ctx, atlas: { slug: 'goodharts-law', matchedBy: 'name', atlas: { slug: 'x-bias', name: 'X', no: '001' } } });
  assert.match(paired, /Also in the Bias Atlas/);
  assert.match(paired, new RegExp(`href="${ATLAS_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}bias/x-bias/"`));
  // Off-site, so it opens without handing the Atlas a window reference.
  assert.match(paired, /class="at-go"[^>]*rel="noopener"/);
});

test('the panel escapes the law name it quotes', () => {
  const nasty = { no: '001', slug: 's', name: 'A & <b>', statement: 'S', meaning: 'M', example: 'E',
    origin: 'O', whyItMatters: 'W', category: 'economics', reliability: 'Heuristic', provenance: 'canon', sources: [] };
  const html = lawPage(nasty, { byslug: {}, categories: {}, base: '/lawtome/', origin: 'https://conyso.com',
    atlas: { slug: 's', matchedBy: 'name', atlas: { slug: 'y', name: 'Y', no: '002' } } });
  assert.match(html, /how far A &amp; &lt;b&gt; can be trusted/);
});

test('the built site carries the panel on exactly the paired laws', (t) => {
  if (!BUILT) return t.skip('no dist/ — run `npm run build` first');
  const paired = new Set(doc.pairs.map((p) => p.slug));
  let seen = 0;
  for (const p of doc.pairs) {
    const html = readFileSync(`dist/laws/${p.slug}/index.html`, 'utf8');
    assert.match(html, /Also in the Bias Atlas/, `${p.slug} is paired but has no panel`);
    assert.ok(html.includes(`${ATLAS_BASE}bias/${p.atlas.slug}/`), `${p.slug} links elsewhere`);
    seen++;
  }
  assert.equal(seen, doc.pairs.length);
  assert.ok(!paired.has('goodharts-law'), 'fixture assumption: Goodhart is not in the Atlas');
  assert.doesNotMatch(readFileSync('dist/laws/goodharts-law/index.html', 'utf8'), /Also in the Bias Atlas/);
});
