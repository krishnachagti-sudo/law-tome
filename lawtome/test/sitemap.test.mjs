import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemap } from '../build/sitemap.mjs';
const xml = buildSitemap(['laws/goodharts-law/','browse/'], 'https://conyso.com/lawtome/');
test('valid sitemap XML with absolute, trailing-slash URLs', () => {
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemap\.org|sitemaps\.org/);
  assert.match(xml, /<loc>https:\/\/conyso\.com\/lawtome\/laws\/goodharts-law\/<\/loc>/);
});

test('lists the home root as origin+base with trailing slash', () => {
  const home = buildSitemap([''], 'https://conyso.com/lawtome/');
  assert.match(home, /<loc>https:\/\/conyso\.com\/lawtome\/<\/loc>/);
});

test('every <loc> is an absolute URL', () => {
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(m => m[1]);
  assert.equal(locs.length, 2);
  for (const loc of locs) assert.match(loc, /^https:\/\//);
});

test('declares the correct XML prolog and sitemaps.org namespace', () => {
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<\/urlset>\s*$/);
});

test('one <url> element per path', () => {
  assert.equal((xml.match(/<url>/g) || []).length, 2);
});

test('XML-escapes an ampersand in a path', () => {
  const esc = buildSitemap(['browse/?a=1&b=2'], 'https://conyso.com/lawtome/');
  assert.match(esc, /<loc>https:\/\/conyso\.com\/lawtome\/browse\/\?a=1&amp;b=2<\/loc>/);
  assert.doesNotMatch(esc, /&b=2/);
});

// --- build integration: site files (sitemap.xml, robots.txt, _redirects) ---
import { existsSync } from 'node:fs';
import { readFile, writeFile, mkdtemp, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';

test('build emits a well-formed sitemap.xml listing crawlable pages only', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-sm-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const sm = await readFile(join(out, 'sitemap.xml'), 'utf8');
  assert.match(sm, /^<\?xml/);
  assert.match(sm, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(sm, /<\/urlset>/);
  // home + 11 laws + browse + 8 categories + graph = 22.
  assert.equal((sm.match(/<loc>/g) || []).length, 22);
  // Home root and a law are absolute base URLs.
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/laws\/goodharts-law\/<\/loc>/);
  // Data files and OG images are NOT listed.
  assert.doesNotMatch(sm, /search-index\.json|graph\.json|og\//);
  await rm(out, { recursive:true, force:true });
});

test('build emits robots.txt that allows crawling and references the sitemap', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-rb-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const robots = await readFile(join(out, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/conyso\.com\/lawtome\/sitemap\.xml/);
  await rm(out, { recursive:true, force:true });
});

test('build emits _redirects (empty header) when no law has redirectFrom', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-rd-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.ok(existsSync(join(out, '_redirects')), 'missing _redirects');
  const rd = await readFile(join(out, '_redirects'), 'utf8');
  assert.doesNotMatch(rd, /301/); // seed data has no redirects
  await rm(out, { recursive:true, force:true });
});

test('_redirects emits a 301 line for a law with redirectFrom', async () => {
  const data = await mkdtemp(join(tmpdir(), 'lt-data-'));
  await cp('src/data/laws', data, { recursive:true });
  const f = join(data, 'goodharts-law.json');
  const law = JSON.parse(await readFile(f, 'utf8'));
  law.redirectFrom = ['laws/goodhart-law/'];
  await writeFile(f, JSON.stringify(law));
  const out = await mkdtemp(join(tmpdir(), 'lt-rd2-'));
  await buildSite({ dataDir:data, catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const rd = await readFile(join(out, '_redirects'), 'utf8');
  assert.match(rd, /\/lawtome\/laws\/goodhart-law\/\s+\/lawtome\/laws\/goodharts-law\/\s+301/);
  await rm(out, { recursive:true, force:true });
  await rm(data, { recursive:true, force:true });
});

test('site files do not inflate the build return counts', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-cnt-'));
  const r = await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.equal(r.pages, 12); // home + 11 laws, unchanged
  await rm(out, { recursive:true, force:true });
});
