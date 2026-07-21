import { test } from 'node:test';
import assert from 'node:assert/strict';
import { notFoundPage } from '../src/templates/static-pages.mjs';

const nf = notFoundPage({ base: '/lawtome/', origin: 'https://conyso.com' });

test('404 page is noindex, follow (an error page must never be indexed)', () => {
  assert.match(nf, /<meta name="robots" content="noindex, follow">/);
});

test('404 page has a title and no canonical/og:url (addresses no single resource)', () => {
  assert.match(nf, /<title>Not found — The Law Tome<\/title>/);
  assert.doesNotMatch(nf, /rel="canonical"/);
  assert.doesNotMatch(nf, /og:url/);
});

test('404 page links only real recovery routes (home, browse, graph, coin) — no dead /random/', () => {
  assert.match(nf, /href="\/lawtome\/"/);
  assert.match(nf, /href="\/lawtome\/browse\/"/);
  assert.match(nf, /href="\/lawtome\/graph\/"/);
  assert.match(nf, /href="\/lawtome\/coin\/"/);
  assert.doesNotMatch(nf, /\/lawtome\/random\//);
});

// --- build integration: 404.html, copied logo, publisher.logo on law + home ---
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';

test('build emits 404.html, copies the logo, and stamps publisher.logo into JSON-LD', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-seo-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });

  // 404 page written to the output root as 404.html (not under a directory).
  assert.ok(existsSync(join(out, '404.html')), 'missing 404.html');
  const nf404 = await readFile(join(out, '404.html'), 'utf8');
  assert.match(nf404, /noindex, follow/);

  // Brand logo asset copied with the rest of src/assets.
  assert.ok(existsSync(join(out, 'assets', 'logo.svg')), 'logo.svg not copied to dist/assets');

  // Article publisher carries an absolute ImageObject logo (Google rich-result reco).
  const lawHtml = await readFile(join(out, 'laws', 'goodharts-law', 'index.html'), 'utf8');
  assert.match(lawHtml, /"logo":\{"@type":"ImageObject","url":"https:\/\/conyso\.com\/lawtome\/assets\/logo\.svg"/);

  // Home Organization node also carries the logo.
  const homeHtml = await readFile(join(out, 'index.html'), 'utf8');
  assert.match(homeHtml, /"@type":"ImageObject","url":"https:\/\/conyso\.com\/lawtome\/assets\/logo\.svg"/);

  // FAQ is now VISIBLE (a <details> accordion), not JSON-LD-only — so the
  // FAQPage structured data matches on-page content (no spammy-markup risk).
  assert.match(lawHtml, /<details class="faq-item"/);
  assert.match(lawHtml, /<summary class="faq-q">What is Goodhart's Law\?<\/summary>/);
  assert.match(lawHtml, /"@type":"FAQPage"/);
  // The question string appears at least twice: once visibly, once in JSON-LD.
  assert.ok((lawHtml.match(/What is Goodhart's Law\?/g) || []).length >= 2, 'FAQ question should be visible AND in JSON-LD');

  await rm(out, { recursive: true, force: true });
});
