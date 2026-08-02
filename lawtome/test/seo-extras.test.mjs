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

  // The visible FAQ accordion stays gone: every answer was a verbatim corpus
  // field already rendered in the sections above it, which read as padding.
  assert.doesNotMatch(lawHtml, /faq-item/);
  // The FAQPage JSON-LD came BACK, on different grounds. It was dropped with the
  // accordion because markup without visible content is spam; what is emitted now
  // is built from the rendered sections themselves, so it can only ever say what
  // the page already says. It buys no Google rich result — those were restricted
  // to government and health sites in 2023 — and is not claimed to; it is here
  // for consistency with every other page type on the site.
  assert.match(lawHtml, /"@type":"FAQPage"/);
  assert.match(lawHtml, /"name":"What does Goodhart's Law mean\?"/);

  // Site identity + feed: favicon/apple-touch/manifest/feed head links, and the
  // files they point at, all emitted.
  assert.match(lawHtml, /<link rel="icon" href="\/lawtome\/assets\/logo\.svg" type="image\/svg\+xml">/);
  assert.match(lawHtml, /<link rel="apple-touch-icon" href="\/lawtome\/icon-512\.png">/);
  assert.match(lawHtml, /<link rel="manifest" href="\/lawtome\/site\.webmanifest">/);
  assert.match(lawHtml, /<link rel="alternate" type="application\/atom\+xml"[^>]*href="\/lawtome\/feed\.xml">/);
  assert.ok(existsSync(join(out, 'icon-512.png')), 'icon-512.png not emitted');
  assert.ok(existsSync(join(out, 'site.webmanifest')), 'site.webmanifest not emitted');
  const manifest = JSON.parse(await readFile(join(out, 'site.webmanifest'), 'utf8'));
  assert.equal(manifest.name, 'The Law Tome');
  assert.ok(manifest.icons.some((i) => i.sizes === '512x512'), 'manifest missing 512 icon');
  const feed = await readFile(join(out, 'feed.xml'), 'utf8');
  assert.match(feed, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/);
  assert.match(feed, /<link rel="self" href="https:\/\/conyso\.com\/lawtome\/feed\.xml"\/>/);

  // a11y: home and a law page each expose exactly one <h1>.
  assert.equal((homeHtml.match(/<h1[\s>]/g) || []).length, 1, 'home should have exactly one h1');
  assert.equal((lawHtml.match(/<h1[\s>]/g) || []).length, 1, 'law page should have exactly one h1');

  await rm(out, { recursive: true, force: true });
});
