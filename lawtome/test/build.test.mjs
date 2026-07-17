import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

// Corpus-relative expectations: derive the law count from the data dir so adding a
// law never breaks these assertions (they encode relationships, not magic numbers).
const LAW_COUNT = readdirSync('src/data/laws').filter((f) => f.endsWith('.json')).length;
import { mkdtemp, rm, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';
test('build emits home + a page per law + copies assets', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com', publishedCount:null });
  assert.ok(existsSync(join(out, 'index.html')));
  assert.ok(existsSync(join(out, 'laws/goodharts-law/index.html')));
  assert.ok(existsSync(join(out, 'assets/styles.css')));
  await rm(out, { recursive:true, force:true });
});
test('build throws on validation failure', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await assert.rejects(buildSite({ dataDir:'test/fixtures/bad', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' }), /validation/i);
  await rm(out, { recursive:true, force:true });
});

const SEED_SLUGS = [
  'campbells-law','cobra-effect','conways-law','dunning-kruger-effect',
  'goodharts-law','hanlons-razor','hofstadters-law','occams-razor',
  'parkinsons-law','streisand-effect','the-peter-principle',
];

test('build emits a page for every seed slug', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  for (const slug of SEED_SLUGS) {
    assert.ok(existsSync(join(out, `laws/${slug}/index.html`)), `missing page for ${slug}`);
  }
  await rm(out, { recursive:true, force:true });
});

test('prev/next wired: goodharts links its corpus neighbours', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const html = await readFile(join(out, 'laws/goodharts-law/index.html'), 'utf8');
  // corpus order: dunning-kruger-effect (011) < goodharts-law (014) < hanlons-razor (017)
  assert.match(html, /href="\/lawtome\/laws\/dunning-kruger-effect\/"/);
  assert.match(html, /href="\/lawtome\/laws\/hanlons-razor\/"/);
  await rm(out, { recursive:true, force:true });
});

test('build returns a page count and home shows real published count', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  const r = await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.equal(r.pages, LAW_COUNT + 1); // home + one page per law
  const home = await readFile(join(out, 'index.html'), 'utf8');
  assert.match(home, new RegExp(`${LAW_COUNT} laws`));
  await rm(out, { recursive:true, force:true });
});

test('build emits browse + per-category listing pages', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  const r = await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.ok(existsSync(join(out, 'browse/index.html')), 'missing browse/index.html');
  assert.ok(existsSync(join(out, 'category/economics/index.html')), 'missing category/economics/index.html');
  const browse = await readFile(join(out, 'browse/index.html'), 'utf8');
  assert.match(browse, /href="\/lawtome\/laws\/goodharts-law\/"/);
  const cat = await readFile(join(out, 'category/economics/index.html'), 'utf8');
  assert.match(cat, /"BreadcrumbList"/);
  assert.ok(r.listings >= 2, 'listings count should include browse + present categories');
  await rm(out, { recursive:true, force:true });
});

// --- Task 8 code-quality gate: build robustness ---

test('validation failure writes no partial output', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await assert.rejects(buildSite({ dataDir:'test/fixtures/bad', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' }), /validation/i);
  assert.ok(!existsSync(join(out, 'index.html')), 'no partial dist should be written when validation fails');
  await rm(out, { recursive:true, force:true });
});

test('rebuild removes stale pages from a previous build', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  const opts = { dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' };
  await buildSite(opts);
  // Simulate a page left over from a prior build for a since-removed law.
  await mkdir(join(out, 'laws/ghost-law'), { recursive:true });
  await writeFile(join(out, 'laws/ghost-law/index.html'), 'stale');
  await buildSite(opts); // rebuild
  assert.ok(!existsSync(join(out, 'laws/ghost-law/index.html')), 'stale page should be cleaned on rebuild');
  assert.ok(existsSync(join(out, 'laws/goodharts-law/index.html')), 'real page should be rebuilt');
  await rm(out, { recursive:true, force:true });
});
