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

test('XML-escapes <, > and " in a path (not just &)', () => {
  const esc = buildSitemap(['x/?q=<a>"b"&c'], 'https://conyso.com/lawtome/');
  assert.match(esc, /q=&lt;a&gt;&quot;b&quot;&amp;c/);
  assert.doesNotMatch(esc, /q=<a>"b"/);   // no raw <, >, " survive inside the loc
});

// --- image extension (sitemaps.org image/1.1) ---

test('omits the image namespace entirely when no page declares an image', () => {
  assert.doesNotMatch(xml, /xmlns:image/);
  assert.doesNotMatch(xml, /<image:/);
  // An empty map is the same as no map: still no namespace, still no children.
  const none = buildSitemap(['browse/'], 'https://conyso.com/lawtome/', '', { 'browse/': [] });
  assert.doesNotMatch(none, /xmlns:image/);
});

test('declares each page\'s images as <image:image> children of its <url>', () => {
  const withImgs = buildSitemap(
    ['laws/goodharts-law/', 'browse/'],
    'https://conyso.com/lawtome/',
    '2026-08-02',
    {
      'laws/goodharts-law/': [
        { loc: 'https://conyso.com/lawtome/assets/img/people/charles-goodhart.webp', title: 'Charles Goodhart', caption: 'Someone · CC BY-SA 4.0' },
      ],
    },
  );
  assert.match(withImgs, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.equal((withImgs.match(/<image:image>/g) || []).length, 1);
  assert.match(withImgs, /<image:loc>https:\/\/conyso\.com\/lawtome\/assets\/img\/people\/charles-goodhart\.webp<\/image:loc>/);
  assert.match(withImgs, /<image:title>Charles Goodhart<\/image:title>/);
  assert.match(withImgs, /<image:caption>Someone · CC BY-SA 4\.0<\/image:caption>/);
  // The image belongs to the law's <url>, not to /browse/.
  const browseUrl = withImgs.split('\n').find((l) => l.includes('/browse/'));
  assert.doesNotMatch(browseUrl, /image:/);
});

test('image title and caption are optional and XML-escaped', () => {
  const bare = buildSitemap(['x/'], 'https://e.com/', '', { 'x/': [{ loc: 'https://e.com/a&b.webp' }] });
  assert.match(bare, /<image:loc>https:\/\/e\.com\/a&amp;b\.webp<\/image:loc><\/image:image>/);
  assert.doesNotMatch(bare, /image:title|image:caption/);
  const esc = buildSitemap(['x/'], 'https://e.com/', '', {
    'x/': [{ loc: 'https://e.com/a.webp', title: 'Tom & "Jerry"', caption: '<b>x</b>' }],
  });
  assert.match(esc, /<image:title>Tom &amp; &quot;Jerry&quot;<\/image:title>/);
  assert.match(esc, /<image:caption>&lt;b&gt;x&lt;\/b&gt;<\/image:caption>/);
});

// --- build integration: site files (sitemap.xml, robots.txt, _redirects) ---
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { readFile, writeFile, mkdtemp, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';
import { comparePairs } from '../build/relations.mjs';
import { eponymGroups } from '../build/eponyms.mjs';
import { namesakesWithPages } from '../src/templates/namesake.mjs';
import { languagesPresent } from '../src/templates/names.mjs';
import { periods, fieldPeriods } from '../build/periods.mjs';
import { countryGroups, countriesWithPages } from '../build/countries.mjs';
import { kinds, kindOf } from '../build/kinds.mjs';
import { sheets } from '../build/sheets.mjs';
import { problems } from '../build/problems.mjs';
import { verdicts } from '../build/verdicts.mjs';
import { bestKnown } from '../src/templates/bestknown.mjs';

// Corpus-relative sitemap expectations, so adding a law (or a law in a new
// category / reliability tier) never breaks the count. Locs = home + one per law
// + browse + one per present category + graph + 5 static pages
// (coin/about/coined/privacy/tension) + reliability hub + one per present tier.
const LAW_FILES = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'));
const LAW_COUNT = LAW_FILES.length;
const PARSED = LAW_FILES.map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
const CAT_COUNT = new Set(PARSED.map((l) => l.category)).size;
// Reliability facet: a hub page + one page per distinct reliability tier present.
const TIER_COUNT = new Set(PARSED.map((l) => l.reliability).filter(Boolean)).size;
// Collections: a hub page + one page per collection that resolves to >=1 real law.
const SLUGS = new Set(PARSED.map((l) => l.slug));
const RAW_COLL = JSON.parse(readFileSync('src/data/collections.json', 'utf8'));
const COLL_COUNT = RAW_COLL.filter((c) => (c.laws || []).some((s) => SLUGS.has(s))).length;
// Audiences ("for …"): a hub page + one page per audience that resolves.
const RAW_AUD = JSON.parse(readFileSync('src/data/audiences.json', 'utf8'));
const AUD_COUNT = RAW_AUD.filter((a) => (a.laws || []).some((s) => SLUGS.has(s))).length;
// + quiz + situations + named-after + timeline + data (the /saved/ page is
// noindex and the .json/.csv downloads are data files, so none are in the sitemap)
// + marketing: the /for/ hub + one per audience + features + manifesto.
// + /credits/: the image sources and licences (indexable, and the attribution
//   the CC-licensed portraits oblige us to publish).
// + /origins/: the namesakes' birthplaces on a map.
// Compare: the /compare/ hub + one page per pair that earns one — opposed,
//   near-twin, or a kindred pair with evidence (see build/relations.mjs).
// + one page per namesake with more than one law. Only those: a page for a
//   one-law namesake would restate the law under a second URL.
// Name indexes: the /names/ hub + one page per language that has at least one
// recorded Wikidata label anywhere in the corpus.
const FACTS = JSON.parse(readFileSync('src/data/facts.json', 'utf8'));
const NAMES_LANG_COUNT = languagesPresent(PARSED, FACTS).length;
// Periods: one page per century, plus one per decade that clears the threshold.
const PERIOD_COUNT = periods(PARSED).length;
// …plus one per field x period bucket holding at least ten entries.
const FIELD_PERIOD_COUNT = fieldPeriods(PARSED).length;
// Countries: one page per country with enough entries born in it.
const COUNTRY_COUNT = countriesWithPages(countryGroups(PARSED, FACTS)).length;
const COMPARE_COUNT = comparePairs(PARSED).length;
const NAMESAKE_COUNT = namesakesWithPages(eponymGroups(PARSED)).length;
// Kinds: the /kinds/ hub + one page per kind of named thing above the floor —
// razors, paradoxes, theorems, fallacies, read off the entries' own names.
const KIND_COUNT = kinds(PARSED).length;
// Sheets: the /sheets/ hub plus one per field big enough to fill a page.
const SHEET_COUNT = sheets(PARSED, [], {}).length;
// Problem themes: /situations/{theme}/ for each theme above the floor. The
// assignment is computed from the situations file, so the count is read from the
// same function the build uses rather than typed here.
const RAW_SIT = JSON.parse(readFileSync('src/data/situations.json', 'utf8'));
const BY_SLUG = Object.fromEntries(PARSED.map((l) => [l.slug, l]));
const PROBLEM_COUNT = problems(Array.isArray(RAW_SIT) ? RAW_SIT : RAW_SIT.situations, BY_SLUG).themes.length;
// Verdicts: one "is X real?" per entry that is well known, softly rated, and the
// kind of claim that can turn out not to hold.
const VERDICT_COUNT = verdicts(PARSED, bestKnown(PARSED, FACTS), { kindOf }).length;
// The trailing + 1 is /calculators/, the index of entries that compute, solve
// or demonstrate rather than only stating. Adding a page class to the sitemap
// has to be declared here, which is the point of counting it this way.
const EXPECTED_LOCS = 1 + LAW_COUNT + 1 + CAT_COUNT + 1 + 5 + 1 + COMPARE_COUNT + 1 + TIER_COUNT + 1 + COLL_COUNT + 1 + 1 + 3 + NAMESAKE_COUNT + (1 + AUD_COUNT + 1 + 1) + 1 + 1 + (1 + NAMES_LANG_COUNT) + PERIOD_COUNT + COUNTRY_COUNT + 1
  // + /equations/, /pronunciation/, /sources/, /is-it-real/, /misattributed/,
  // /diagnose/, /embed/. (/print/ and the per-entry cards are noindex, and the
  // .json records are data files, so none of those are listed.)
  + 7 + FIELD_PERIOD_COUNT
  + (1 + KIND_COUNT)
  // + /also-known-as/ (every alias, cross-referenced) and /quotes/ (every
  // statement, as it is quoted), and /best-known/ (ranked by printed frequency).
  + 3
  // + /how-solid/ — the corpus-level finding. The /quiz/score/N/ pages are
  // noindex landing places for a shared result, so they are deliberately absent.
  + 1
  // + /sheets/ and one printable sheet per field above the floor.
  + (1 + SHEET_COUNT)
  // + one page per problem theme, and one verdict page per testable entry.
  // (/situations/ itself is already counted among the seven hubs above.)
  + PROBLEM_COUNT + VERDICT_COUNT;

test('build emits a well-formed sitemap.xml listing crawlable pages only', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-sm-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const sm = await readFile(join(out, 'sitemap.xml'), 'utf8');
  assert.match(sm, /^<\?xml/);
  // The real corpus carries images, so the urlset also declares the image
  // extension namespace (see the image-sitemap tests below).
  assert.match(sm, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9" xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1">/);
  assert.match(sm, /<\/urlset>/);
  // home + one per law + browse + one per present category + graph + 5 static pages
  // (coin, about, coined, privacy, tension).
  assert.equal((sm.match(/<loc>/g) || []).length, EXPECTED_LOCS);
  // Home root and a law are absolute base URLs.
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/<\/loc>/);
  assert.match(sm, /<loc>https:\/\/conyso\.com\/lawtome\/laws\/goodharts-law\/<\/loc>/);
  // Data files and OG images are NOT listed.
  assert.doesNotMatch(sm, /search-index\.json|graph\.json|og\//);
  await rm(out, { recursive:true, force:true });
});

test('build declares real, on-disk images against the pages that carry them', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-smi-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const sm = await readFile(join(out, 'sitemap.xml'), 'utf8');
  const imgs = [...sm.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);
  assert.ok(imgs.length > 500, `expected the curated imagery to be declared, got ${imgs.length}`);
  // Every declared image must be a file the build actually shipped — a sitemap
  // pointing at a 404 is worse than one that stays quiet.
  const prefix = 'https://conyso.com/lawtome/';
  for (const loc of imgs) {
    assert.ok(loc.startsWith(prefix), `not an absolute site URL: ${loc}`);
    const rel = loc.slice(prefix.length);
    assert.ok(existsSync(join(out, ...rel.split('/'))), `declared image missing on disk: ${rel}`);
  }
  // Images are attached to law and namesake pages only, never to hub pages
  // whose thumbnail strips merely borrow them.
  for (const m of sm.matchAll(/<url><loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g)) {
    if (!m[0].includes('<image:')) continue;
    const rel = m[1].slice(prefix.length);
    assert.match(rel, /^(laws|named-after)\//, `unexpected page carries images: ${rel}`);
  }
  // Every declared image names its licence credit as the caption.
  const caps = [...sm.matchAll(/<image:caption>([^<]*)<\/image:caption>/g)].map((m) => m[1]);
  assert.equal(caps.length, imgs.length);
  for (const c of caps) assert.ok(c.trim().length > 0, 'empty image caption');
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

test('build emits a well-formed _redirects map from law.redirectFrom', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-rd-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.ok(existsSync(join(out, '_redirects')), 'missing _redirects');
  const rd = await readFile(join(out, '_redirects'), 'utf8');
  // Two kinds of line live here: permalink redirects seeded from duplicate-slug
  // cleanup (laws → laws), and retirements of whole pages (the collection that
  // duplicated a reading list). Both must be well-formed `from  to  301`
  // triples rooted at the base, and every target must stay inside the site.
  const lines = rd.split('\n').filter(l => l.trim() && !l.startsWith('#'));
  assert.ok(lines.length, 'no redirect lines emitted');
  for (const l of lines)
    assert.match(l, /^\/lawtome\/\S+\/\s+\/lawtome\/\S+\/\s+301$/, `malformed redirect line: ${l}`);
  const lawLines = lines.filter(l => l.startsWith('/lawtome/laws/'));
  for (const l of lawLines)
    assert.match(l, /^\/lawtome\/laws\/\S+\/\s+\/lawtome\/laws\/\S+\/\s+301$/, `law permalink must point at a law: ${l}`);
  // The retired collection must keep pointing at the reading list that
  // superseded it, or an indexed URL 404s.
  assert.ok(
    lines.some(l => l.startsWith('/lawtome/collections/laws-every-engineer-learns/  /lawtome/for/engineers/')),
    'missing the retired-collection redirect',
  );
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
  assert.equal(r.pages, LAW_COUNT + 1); // home + one page per law
  await rm(out, { recursive:true, force:true });
});

// GitHub Pages ignores _redirects entirely — it serves static files and nothing
// else — so every line in that map was a live 404, which is the exact failure a
// redirect map exists to prevent. Each retirement is therefore ALSO a stub page
// at the old path. The stub must never bury a real page.
test('every redirect also exists as a stub page a static host can serve', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-stub-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const rd = await readFile(join(out, '_redirects'), 'utf8');
  const lines = rd.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  assert.ok(lines.length >= 40, `expected the seeded permalink redirects, got ${lines.length}`);
  for (const line of lines) {
    const [from, to] = line.trim().split(/\s+/);
    const rel = from.replace('/lawtome/', '');
    const stub = join(out, ...rel.split('/').filter(Boolean), 'index.html');
    assert.ok(existsSync(stub), `no stub page for ${from}`);
    const html = await readFile(stub, 'utf8');
    // Instant refresh for a reader, canonical for a crawler, a real link for
    // anyone whose browser blocks the refresh.
    assert.match(html, new RegExp(`http-equiv="refresh" content="0; url=${to.replace(/[/]/g, '\\/')}"`));
    assert.match(html, new RegExp(`rel="canonical" href="https:\\/\\/conyso\\.com${to.replace(/[/]/g, '\\/')}"`));
    assert.match(html, new RegExp(`<a href="${to.replace(/[/]/g, '\\/')}"`));
    // A stub is a signpost, not a destination: it must not carry the full page
    // chrome, or it would compete with the page it points at.
    assert.doesNotMatch(html, /<header|class="sec"/);
  }
  await rm(out, { recursive:true, force:true });
});

test('a redirect whose old path is a live law is dropped, not written over it', async () => {
  const data = await mkdtemp(join(tmpdir(), 'lt-coll-'));
  await cp('src/data/laws', data, { recursive:true });
  // Point goodhart's redirectFrom at a slug that IS a live law.
  const f = join(data, 'goodharts-law.json');
  const law = JSON.parse(await readFile(f, 'utf8'));
  law.redirectFrom = ['laws/campbells-law/'];
  await writeFile(f, JSON.stringify(law));
  const out = await mkdtemp(join(tmpdir(), 'lt-coll-out-'));
  await buildSite({ dataDir:data, catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  const victim = await readFile(join(out, 'laws', 'campbells-law', 'index.html'), 'utf8');
  assert.doesNotMatch(victim, /http-equiv="refresh"/, 'a stub buried a real law page');
  assert.match(victim, /Campbell's Law/);
  const rd = await readFile(join(out, '_redirects'), 'utf8');
  assert.doesNotMatch(rd, /laws\/campbells-law\/\s+\/lawtome\/laws\/goodharts-law\//);
  await rm(data, { recursive:true, force:true });
  await rm(out, { recursive:true, force:true });
});
