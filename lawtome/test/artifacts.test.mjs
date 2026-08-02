// The four things the index became besides a website: a diagnostic door, a
// printed edition, embeddable cards, and a machine-readable record per entry.
//
// The rule they share is the one the rest of the site is built on — none of
// them may state anything the corpus does not. /diagnose/ can only show
// sentences an editor wrote; /print/ carries the same text as the pages; a card
// quotes the entry and links home; the JSON is the same metadata as the bulk
// dataset plus the two things a single record cannot otherwise know.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { diagnoseData, diagnosePage, SETTINGS } from '../src/templates/diagnose.mjs';
import { printPage } from '../src/templates/print.mjs';
import { embedCard, embedToday, embedDocsPage } from '../src/templates/embed.mjs';
import { lawRecord, apiIndex } from '../build/dataset.mjs';
import { buildSite } from '../build/build.mjs';

const LAW = (slug, extra = {}) => ({
  slug, name: slug.replace(/-/g, ' '), no: '007', statement: 'S', meaning: 'M', origin: 'O',
  example: 'E', category: 'economics', reliability: 'Heuristic', provenance: 'canon', ...extra,
});

/* ------------------------------------------------------------- diagnose */

test('diagnose carries only situations an editor wrote, with their cues', () => {
  const a = LAW('a');
  const rows = diagnoseData(
    [{ situation: 'The metric got gamed', law: a }],
    [{ situation: 'The metric got gamed', law: 'a', cues: ['kpi', 'target'] }],
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].t, 'The metric got gamed');
  assert.equal(rows[0].s, 'a');
  assert.equal(rows[0].c, 'kpi target');
  // A law with no situation contributes nothing — the page cannot invent one.
  assert.deepEqual(diagnoseData([], []), []);
});

test('every setting names real corpus categories, and none is empty', () => {
  const cats = new Set(readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')).category));
  for (const g of SETTINGS) {
    assert.ok(g.fields.length, `${g.key} has no fields`);
    for (const f of g.fields) assert.ok(cats.has(f), `${g.key} names a category the corpus does not have: ${f}`);
  }
});

test('the diagnose page ships its data inline and refuses to call itself a diagnosis', () => {
  const rows = diagnoseData([{ situation: 'X happened', law: LAW('a') }], []);
  const html = diagnosePage(rows, { base: '/', origin: 'https://e.com', count: 1 });
  assert.match(html, /This is a filter, not a diagnosis/);
  assert.match(html, /id="dg-data"/);
  assert.match(html, /X happened/);
  // No JavaScript, no page — so it says so and points at the plain list.
  assert.match(html, /<noscript>[\s\S]*situations\/[\s\S]*<\/noscript>/);
});

/* ---------------------------------------------------------------- print */

test('the printed edition contains every entry, once, with its number', () => {
  const laws = [LAW('a', { no: '001' }), LAW('b', { no: '002', category: 'psychology' })];
  const html = printPage(laws, { base: '/', origin: 'https://e.com', categories: { economics: 'Economics', psychology: 'Psychology' }, buildDate: '2026-08-02' });
  assert.equal((html.match(/class="e"/g) || []).length, 2);
  assert.match(html, /<span class="e-no">001<\/span>/);
  // Each entry prints its own URL, so a photocopy still points home.
  assert.match(html, /https:\/\/e\.com\/laws\/a\//);
  // …and the whole document is noindex: it duplicates pages that are indexed.
  assert.match(html, /name="robots" content="noindex/);
});

test('the printed edition indexes aliases as cross-references', () => {
  const laws = [LAW('a', { name: 'Alpha Law', aliases: ['The Beta Rule'] })];
  const html = printPage(laws, { base: '/', origin: '', categories: {} });
  assert.match(html, /The Beta Rule — see <b>Alpha Law<\/b>/);
});

test('the printed edition is self-contained', () => {
  const html = printPage([LAW('a')], { base: '/', origin: '' });
  // No stylesheet, script or image request: it has to survive being emailed.
  assert.doesNotMatch(html, /<link rel="stylesheet"/);
  assert.doesNotMatch(html, /<script/);
  assert.doesNotMatch(html, /<img/);
  assert.match(html, /@page/);
});

/* --------------------------------------------------------------- embeds */

test('a card is small, self-contained and absolutely linked', () => {
  const html = embedCard(LAW('a', { name: 'Alpha Law', coinedYear: 1975 }), { base: '/lawtome/', origin: 'https://e.com' });
  assert.ok(html.length < 4096, `card is ${html.length} bytes`);
  assert.doesNotMatch(html, /<script/);
  assert.doesNotMatch(html, /<link rel="stylesheet"/);
  // An iframe has no base to resolve against, so the link must be absolute.
  assert.match(html, /href="https:\/\/e\.com\/lawtome\/laws\/a\/"/);
  assert.match(html, /name="robots" content="noindex/);
  assert.match(html, /Alpha Law/);
  assert.match(html, /1975/);
});

test("the day's card names itself as one", () => {
  const html = embedToday(LAW('a', { name: 'Alpha Law' }), { base: '/', origin: 'https://e.com' });
  assert.match(html, /law of the day/i);
  assert.match(html, /Alpha Law/);
});

test('the embed page gives a snippet that matches the card it demonstrates', () => {
  const html = embedDocsPage(LAW('goodharts-law'), { base: '/', origin: 'https://e.com', count: 1101 });
  assert.match(html, /src="https:\/\/e\.com\/embed\/goodharts-law\/"/);      // the live demo
  // …and the copyable code, with its quotes escaped for display.
  assert.match(html, /&lt;iframe src=&quot;https:\/\/e\.com\/embed\/goodharts-law\/&quot;/);
  assert.match(html, /CC BY 4\.0/);
});

/* ------------------------------------------------------------- json api */

test('a record carries the two things a single entry cannot otherwise know', () => {
  const a = LAW('a', { related: [{ slug: 'b', kind: 'kindred' }] });
  const r = lawRecord(a, {
    baseUrl: 'https://e.com/',
    categories: { economics: 'Economics & incentives' },
    situations: ['X happened'],
    inbound: [{ slug: 'z', kind: 'opposed' }],
    generated: '2026-08-02',
  });
  assert.equal(r.categoryLabel, 'Economics & incentives');
  assert.deepEqual(r.citedBy, [{ slug: 'z', kind: 'opposed' }]);   // the other direction
  assert.deepEqual(r.situations, ['X happened']);                   // the human phrasing
  assert.equal(r.url, 'https://e.com/laws/a/');
  assert.equal(r.license, 'CC BY 4.0');
  // Same moat as the bulk dataset: the long-form prose stays on the page.
  for (const k of ['mechanism', 'whyItMatters', 'working', 'limits', 'misreadings', 'examples']) {
    assert.ok(!(k in r), `record leaks ${k}`);
  }
});

test('the api index points at every entry and names its endpoints', () => {
  const idx = apiIndex([LAW('a'), LAW('b')], { baseUrl: 'https://e.com/', generated: '2026-08-02' });
  assert.equal(idx.meta.count, 2);
  assert.equal(idx.meta.endpoints.entry, 'https://e.com/laws/{slug}.json');
  assert.deepEqual(idx.laws.map((l) => l.json), ['https://e.com/laws/a.json', 'https://e.com/laws/b.json']);
});

/* --------------------------------------------------------- build wiring */

const PARSED = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));

test('build ships all four, sized to the corpus', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-art-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });

  // A JSON record beside every page, and an index that resolves to all of them.
  const idx = JSON.parse(await readFile(join(out, 'api.json'), 'utf8'));
  assert.equal(idx.laws.length, PARSED.length);
  for (const l of PARSED.slice(0, 25)) {
    const f = join(out, 'laws', `${l.slug}.json`);
    assert.ok(existsSync(f), `missing record: ${l.slug}`);
    const rec = JSON.parse(await readFile(f, 'utf8'));
    assert.equal(rec.slug, l.slug);
    assert.equal(rec.name, l.name);
  }

  // One card per entry, plus the day's card and the how-to.
  for (const l of PARSED.slice(0, 10)) {
    assert.ok(existsSync(join(out, 'embed', l.slug, 'index.html')), `missing card: ${l.slug}`);
  }
  assert.ok(existsSync(join(out, 'embed', 'today', 'index.html')));
  assert.ok(existsSync(join(out, 'embed', 'index.html')));

  // The book: every entry, in one document.
  const book = await readFile(join(out, 'print', 'index.html'), 'utf8');
  assert.equal((book.match(/class="e"/g) || []).length, PARSED.length);

  // And the diagnostic door, carrying the curated situations and nothing else.
  const dg = await readFile(join(out, 'diagnose', 'index.html'), 'utf8');
  const raw = JSON.parse(readFileSync('src/data/situations.json', 'utf8'));
  const m = /<script id="dg-data" type="application\/json">([\s\S]*?)<\/script>/.exec(dg);
  assert.ok(m, 'diagnose data not inlined');
  assert.equal(JSON.parse(m[1].replace(/\\u003c/g, '<')).length, raw.length);

  await rm(out, { recursive: true, force: true });
});
