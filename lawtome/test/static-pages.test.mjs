import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coinPage, aboutPage, coinedIndex, privacyPage } from '../src/templates/static-pages.mjs';
test('coin form has name/statement/mode inputs, a rights-grant + consent linking to privacy', () => {
  const h = coinPage({ base:'/lawtome/' });
  assert.match(h, /name="statement"/);
  assert.match(h, /type="checkbox"[^>]*required/);
  assert.match(h, /grant/i);              // rights-grant wording
  assert.match(h, /href="\/lawtome\/privacy\/"/);
});
test('about states the verification method + licence + a named curator', () => {
  const h = aboutPage({ base:'/lawtome/' });
  assert.match(h, /adversarial|source-resolution|verify/i);
  assert.match(h, /CC BY/);
});
test('coined wing lists only coined entries', () => {
  const h = coinedIndex([{slug:'x', name:'X', provenance:'coined', statement:'S', reliability:'Heuristic'}], { base:'/lawtome/' });
  assert.match(h, /href="\/lawtome\/laws\/x\/"/);
});
test('coined wing EXCLUDES non-coined entries (exercises the provenance filter)', () => {
  const h = coinedIndex([
    { slug:'x', name:'X', provenance:'coined', statement:'S', reliability:'Heuristic' },
    { slug:'z', name:'Z', provenance:'canon',  statement:'T', reliability:'Empirical' },
  ], { base:'/lawtome/' });
  assert.match(h, /href="\/lawtome\/laws\/x\/"/);       // coined shown
  assert.doesNotMatch(h, /href="\/lawtome\/laws\/z\/"/); // canon excluded
});
test('privacy page exists for the consent link', () => assert.match(privacyPage({base:'/lawtome/'}), /consent|data|privacy/i));

// --- added tests (implementer) ---

test('about attributes curation to the org/team, NOT a fabricated person', () => {
  const h = aboutPage({ base:'/lawtome/' });
  assert.match(h, /editorial team|Conyso/i);           // role/org curator
  assert.doesNotMatch(h, /Dr\.\s+[A-Z][a-z]+\s+[A-Z][a-z]+/); // no invented "Dr. Firstname Lastname"
});

test('coin form targets the repo issue tracker (no dead endpoint) and offers suggest|coin modes', () => {
  const h = coinPage({ base:'/lawtome/' });
  // There is no server behind this static site: the old action="/api/submit"
  // 404'd and silently discarded every submission. The form now targets the
  // repo's new-issue endpoint, which works with JS off (GitHub reads ?title=)
  // and is upgraded by common.js into a fully pre-filled issue body.
  assert.doesNotMatch(h, /api\/submit/);
  assert.match(h, /action="https:\/\/github\.com\/[^"]+\/issues\/new"/);
  assert.match(h, /method="get"/i);
  assert.match(h, /id="coin-form"/);
  assert.match(h, /data-repo="[^"]+\/[^"]+"/);
  assert.match(h, /name="mode"/);
  assert.match(h, /value="suggest"/);
  assert.match(h, /value="coin"/);
});

test('coined wing shows an empty-state when there are no coined entries', () => {
  const h = coinedIndex([], { base:'/lawtome/' });
  assert.match(h, /class="empty"/);
  assert.doesNotMatch(h, /href="\/lawtome\/laws\//); // no cards when empty
});

test('coinedIndex escapes a name containing < and &', () => {
  const h = coinedIndex([{ slug:'y', name:'A<b>&c', provenance:'coined', statement:'S<t>&u', reliability:'Heuristic' }], { base:'/lawtome/' });
  assert.match(h, /A&lt;b&gt;&amp;c/);
  assert.doesNotMatch(h, /A<b>&c/);
  assert.match(h, /S&lt;t&gt;&amp;u/);
});

// --- build integration ---
import { existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';

test('build emits coin/about/coined/privacy pages and lists them in the sitemap', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-sp-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.ok(existsSync(join(out, 'coin/index.html')), 'missing coin/index.html');
  assert.ok(existsSync(join(out, 'about/index.html')), 'missing about/index.html');
  assert.ok(existsSync(join(out, 'coined/index.html')), 'missing coined/index.html');
  assert.ok(existsSync(join(out, 'privacy/index.html')), 'missing privacy/index.html');
  // seed corpus has zero coined entries -> empty state
  const coined = await readFile(join(out, 'coined/index.html'), 'utf8');
  assert.match(coined, /class="empty"/);
  const sm = await readFile(join(out, 'sitemap.xml'), 'utf8');
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/coin\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/about\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/coined\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/privacy\/<\/loc>/);
  await rm(out, { recursive:true, force:true });
});
