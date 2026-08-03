// The things a search or answer engine reads, held to a budget.
//
// These are all regressions that already happened once. 619 law titles and
// 1,108 law descriptions were long enough to be truncated in a result; ten hub
// pages shipped an ItemList of names with no URLs on them, because the helper
// read `href` and most callers passed `url`; and the namesake of 900-odd
// entries existed only as a word in a sentence, resolvable by nobody.
//
// A whole-site build is expensive, so this file builds once and asserts against
// the output rather than re-rendering per case.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';
import { clampTitle, clampDescription, fitTitle, TITLE_MAX, DESC_MAX } from '../src/templates/partials.mjs';

/* ------------------------------------------------------------- pure units */

test('the title clamp spends the brand suffix before it spends a word', () => {
  const short = "Goodhart's Law: Meaning & Origin | The Law Tome";
  assert.equal(clampTitle(short), short);                       // fits, untouched
  // Too long with the brand, fine without it — so the brand goes and nothing is cut.
  const t = clampTitle('The Second Law of Thermodynamics: Meaning, Examples | The Law Tome');
  assert.equal(t, 'The Second Law of Thermodynamics: Meaning, Examples');
  assert.doesNotMatch(t, /…/);
  // Too long even bare: cut at a word boundary, never mid-word.
  const long = clampTitle(`${'Word '.repeat(30)}| The Law Tome`);
  assert.ok(long.length <= TITLE_MAX);
  assert.match(long, /…$/);
  assert.doesNotMatch(long, /\s…$/);
});

test('the description clamp prefers a full stop and never leaves a dangling comma', () => {
  const s = `${'x'.repeat(100)}. ${'y'.repeat(120)}`;
  assert.equal(clampDescription(s), `${'x'.repeat(100)}.`);
  const noStop = clampDescription(`${'alpha '.repeat(40)}`);
  assert.ok(noStop.length <= DESC_MAX);
  assert.doesNotMatch(noStop, /[\s,;:—–-]…$/);
  assert.equal(clampDescription('short'), 'short');
});

test('fitTitle takes the longest trimming that fits and never drops the core', () => {
  assert.equal(fitTitle('A', [': one | brand', ': one', '']), 'A: one | brand');
  const core = 'x'.repeat(58);
  assert.equal(fitTitle(core, [': a long tail here', '']), core);
  // Even a core over budget survives whole — clampTitle is what cuts, not this.
  const big = 'y'.repeat(80);
  assert.equal(fitTitle(big, ['']), big);
});

/* ------------------------------------------------------------ built output */

let out;
const pages = [];
const decode = (s) => String(s).replace(/&amp;/g, '&').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

before(async () => {
  out = await mkdtemp(join(tmpdir(), 'lt-seo-'));
  await buildSite({
    dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets',
    out, base: '/', origin: 'https://e.com',
  });
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'index.html') pages.push(p);
    }
  };
  walk(out);
}, { timeout: 600000 });

after(async () => { if (out) await rm(out, { recursive: true, force: true }); });

const indexable = () => pages
  .map((p) => ({ p, html: readFileSync(p, 'utf8') }))
  .filter(({ html }) => !/name="robots" content="noindex/.test(html));

test('no indexable page ships a title or description the engine will truncate', () => {
  const badT = []; const badD = [];
  for (const { p, html } of indexable()) {
    const t = decode((/<title>([^<]*)<\/title>/.exec(html) || [])[1] || '');
    const d = decode((/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || '');
    if (t.length > TITLE_MAX) badT.push(`${p} (${t.length})`);
    if (d.length > DESC_MAX) badD.push(`${p} (${d.length})`);
    assert.ok(t, `${p} has no title`);
    assert.ok(d, `${p} has no description`);
  }
  assert.deepEqual(badT.slice(0, 5), [], `${badT.length} over-long titles`);
  assert.deepEqual(badD.slice(0, 5), [], `${badD.length} over-long descriptions`);
});

test('every JSON-LD block on every page is valid JSON', () => {
  // 616 Person nodes were added at once. A single serialisation bug here would
  // silently void the structured data on a thousand pages.
  let blocks = 0;
  for (const { p, html } of indexable()) {
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      blocks += 1;
      try {
        const parsed = JSON.parse(m[1].replace(/\\u003c/g, '<'));
        assert.ok(parsed['@context'] || parsed['@type'], `${p}: JSON-LD with no @context`);
      } catch (e) {
        assert.fail(`${p}: unparseable JSON-LD — ${e.message}`);
      }
    }
  }
  assert.ok(blocks > 4000, `only ${blocks} JSON-LD blocks`);
});

test('a named namesake is an entity, not a string', () => {
  const html = readFileSync(join(out, 'laws', 'the-phillips-curve', 'index.html'), 'utf8');
  const article = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1].replace(/\\u003c/g, '<')))
    .find((o) => o['@type'] === 'Article');
  assert.ok(article, 'no Article');
  const person = (article.mentions || [])[0];
  assert.equal(person['@type'], 'Person');
  assert.equal(person.name, 'A. W. Phillips');
  assert.match(person.sameAs, /wikidata\.org\/wiki\/Q\d+$/);
  assert.equal(person.birthPlace['@type'], 'Place');
});

test('the namesake entity is emitted broadly, and never for a non-person', () => {
  const corpus = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
  let people = 0;
  for (const { html } of indexable()) people += (html.match(/"@type":"Person"/g) || []).length;
  assert.ok(people > 400, `only ${people} Person nodes across the site`);

  // The Law of Demeter is named after a goddess. It must not claim a Person.
  const dem = readFileSync(join(out, 'laws', 'the-law-of-demeter', 'index.html'), 'utf8');
  const art = [...dem.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1].replace(/\\u003c/g, '<')))
    .find((o) => o['@type'] === 'Article');
  assert.ok(!art.mentions, 'a non-person namesake was emitted as a Person');
  assert.ok(corpus.some((l) => l.slug === 'the-law-of-demeter'));
});

test('a hub ItemList carries links, not just names', () => {
  for (const rel of [['kinds'], ['situations'], ['also-known-as']]) {
    const f = join(out, ...rel, 'index.html');
    if (!existsSync(f)) continue;
    const list = [...readFileSync(f, 'utf8').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1].replace(/\\u003c/g, '<')))
      .find((o) => o['@type'] === 'CollectionPage' && o.mainEntity);
    assert.ok(list, `${rel} has no ItemList`);
    const items = list.mainEntity.itemListElement;
    assert.ok(items.length, `${rel} ItemList is empty`);
    for (const it of items) assert.match(it.url || '', /^https:\/\/e\.com\//, `${rel}: ListItem without a URL`);
    assert.ok(list.dateModified, `${rel} declares no dateModified`);
  }
});

test('an entry declares its sources, its licence and its standing to a machine', () => {
  const html = readFileSync(join(out, 'laws', 'goodharts-law', 'index.html'), 'utf8');
  const article = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1].replace(/\\u003c/g, '<')))
    .find((o) => o['@type'] === 'Article');
  assert.ok(Array.isArray(article.citation) && article.citation.length, 'no citations declared');
  for (const c of article.citation) {
    assert.equal(c['@type'], 'CreativeWork');
    assert.ok(c.name, 'a citation with no name');
  }
  assert.equal(article.license, 'https://creativecommons.org/licenses/by/4.0/');
  // Reliability is an additionalProperty, NOT creativeWorkStatus — that field
  // means a lifecycle stage, and bending it to fit is the structured-data
  // version of the flattening this index refuses to do in prose.
  assert.equal(article.creativeWorkStatus, undefined);
  assert.equal(article.additionalProperty.name, 'Reliability');
  assert.equal(article.additionalProperty.value, 'Heuristic');
  assert.match(article.additionalProperty.url, /is-it-real\/$/);
});

test('a hub says who stands behind it', () => {
  const html = readFileSync(join(out, 'kinds', 'index.html'), 'utf8');
  const page = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1].replace(/\\u003c/g, '<')))
    .find((o) => o['@type'] === 'CollectionPage');
  assert.equal(page.publisher['@type'], 'Organization');
  assert.match(page.publisher.publishingPrinciples, /about\/$/);
  assert.match(page.publisher.correctionsPolicy, /about\/$/);
  assert.equal(page.inLanguage, 'en');
  assert.equal(page.license, 'https://creativecommons.org/licenses/by/4.0/');
});

test('the machine-readable files state the terms and the reliability scale', async () => {
  const [idx, full, api] = await Promise.all([
    readFile(join(out, 'llms.txt'), 'utf8'),
    readFile(join(out, 'llms-full.txt'), 'utf8'),
    readFile(join(out, 'api.json'), 'utf8'),
  ]);
  for (const [label, text] of [['llms.txt', idx], ['llms-full.txt', full]]) {
    // The single most valuable block in either file: what a model may do with
    // the text, and how the credit should read.
    assert.match(text, /creativecommons\.org\/licenses\/by\/4\.0\//, `${label}: no licence URL`);
    assert.match(text, /Cite an entry as:/, `${label}: no citation form`);
    assert.match(text, /Last updated: \d{4}-\d{2}-\d{2}\./, `${label}: no date`);
    // Both label entries Empirical/Heuristic/Folk-adage/Contested; both must
    // say what those words mean, or the caveat cannot travel with the quote.
    for (const t of ['Empirical —', 'Heuristic —', 'Folk-adage —', 'Contested —']) {
      assert.ok(text.includes(t), `${label}: reliability scale not defined (${t})`);
    }
  }
  // The differentiating field. An entry quoted without its limits is the
  // listicle version of itself.
  assert.ok(full.split('\nLimits: ').length > 900, 'llms-full.txt carries almost no limits');
  assert.match(idx, /api\.json/);
  assert.match(idx, /feed\.xml/);

  // A dead licence URL in the machine-readable manifest is the one link an
  // ingester is most likely to follow. This one was missing its /by/ segment.
  const meta = JSON.parse(api).meta;
  assert.equal(meta.licenseUrl, 'https://creativecommons.org/licenses/by/4.0/');
  assert.ok(meta.attribution && meta.generated && meta.endpoints.entry);
});

test('robots.txt names the answer engines instead of relying on the wildcard', async () => {
  const robots = await readFile(join(out, 'robots.txt'), 'utf8');
  for (const a of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot', 'CCBot']) {
    assert.match(robots, new RegExp(`User-agent: ${a}\\nAllow: /`), `${a} is not named`);
  }
  assert.match(robots, /Sitemap: https:\/\/e\.com\/sitemap\.xml/);
  // Nothing is disallowed: a Disallow would stop a crawler ever reading the
  // noindex that keeps /print/ and /embed/ out of the index.
  assert.doesNotMatch(robots, /^Disallow: \S/m);
});
