// The per-language name indexes (/names/, /names/<lang>/).
//
// The rules these tests hold to are the ones the pages exist to respect: the
// names are quoted, never translated; a language appears only where we hold at
// least one name; and the foreign string reaches the page marked with its own
// `lang` so a browser and a screen reader treat it as that language rather than
// as English with odd letters in it.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LANGS, namesPath, namesFor, languagesPresent, namesHubPage, namesLangPage } from '../src/templates/names.mjs';
import { buildSite } from '../build/build.mjs';

const LAW = (slug, name) => ({ slug, name, no: 1, statement: 's', meaning: 'm', origin: 'o', example: 'e', category: 'economics', reliability: 'Empirical', provenance: 'canon' });

const LAWS = [LAW('b-law', 'B Law'), LAW('a-law', 'A Law'), LAW('c-law', 'C Law')];
const FACTS = {
  'a-law': { names: { labels: { fr: 'Loi de Zeta', de: 'Zeta-Gesetz' }, source: 'https://www.wikidata.org/wiki/Q1' } },
  'b-law': { names: { labels: { fr: 'Loi de Alpha', ar: 'قانون ألفا' }, source: 'https://www.wikidata.org/wiki/Q2' } },
  'c-law': {},
};

test('namesPath is the language index URL, base-relative', () => {
  assert.equal(namesPath('fr'), 'names/fr/');
  assert.equal(namesPath('zh'), 'names/zh/');
});

test('namesFor returns only entries with a name in that language', () => {
  assert.deepEqual(namesFor(LAWS, FACTS, 'de').map((r) => r.law.slug), ['a-law']);
  assert.deepEqual(namesFor(LAWS, FACTS, 'ar').map((r) => r.law.slug), ['b-law']);
  assert.deepEqual(namesFor(LAWS, FACTS, 'ja'), []);
});

test('namesFor sorts by the foreign name in that language, not by the English title', () => {
  // 'Loi de Alpha' before 'Loi de Zeta', though B Law sorts after A Law in English.
  assert.deepEqual(namesFor(LAWS, FACTS, 'fr').map((r) => r.name), ['Loi de Alpha', 'Loi de Zeta']);
});

test('languagesPresent lists only languages we hold a name in, with counts', () => {
  const present = languagesPresent(LAWS, FACTS);
  assert.deepEqual(present.map((l) => l.code).sort(), ['ar', 'de', 'fr']);
  assert.equal(present.find((l) => l.code === 'fr').count, 2);
  assert.ok(!present.some((l) => l.code === 'ja'), 'a language with no names must not get a page');
});

test('every indexed language declares an endonym and a writing direction', () => {
  for (const l of LANGS) {
    assert.ok(l.native && l.native !== l.name, `${l.code} needs a name in its own language`);
    assert.match(l.dir, /^(ltr|rtl)$/);
  }
  assert.equal(LANGS.find((l) => l.code === 'ar').dir, 'rtl');
});

test('a language page marks each foreign name with its own lang attribute', () => {
  const lang = { ...LANGS.find((l) => l.code === 'ar'), count: 1 };
  const html = namesLangPage(lang, namesFor(LAWS, FACTS, 'ar'), { base: '/', origin: 'https://e.com', count: 3, others: [] });
  assert.match(html, /<span class="nx-name" lang="ar" dir="rtl">قانون ألفا<\/span>/);
  assert.match(html, /href="\/laws\/b-law\/"/);
  assert.match(html, /<title>Named Laws in Arabic \(العربية\)/);
});

test('a language page promises an index of names, not a translated site', () => {
  const lang = { ...LANGS.find((l) => l.code === 'fr'), count: 2 };
  const html = namesLangPage(lang, namesFor(LAWS, FACTS, 'fr'), { base: '/', origin: 'https://e.com', count: 3 });
  assert.match(html, /index of names, not a French edition/);
  assert.match(html, /Wikidata/);
  // The FAQ answers the question a French reader actually arrives with.
  assert.match(html, /Is The Law Tome available in French\?/);
});

test('the hub links every present language and states the honest limit', () => {
  const html = namesHubPage(languagesPresent(LAWS, FACTS), { base: '/', origin: 'https://e.com', count: 3, lawsWithNames: 2 });
  for (const code of ['fr', 'de', 'ar']) assert.match(html, new RegExp(`href="/names/${code}/"`));
  assert.doesNotMatch(html, /href="\/names\/ja\/"/);
  assert.match(html, /No\. Each index gives the name an idea is already published under/);
});

// --- build integration ---

const PARSED = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
const REAL_FACTS = JSON.parse(readFileSync('src/data/facts.json', 'utf8'));
const PRESENT = languagesPresent(PARSED, REAL_FACTS);

test('build writes one index per language we hold names in', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-nm-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  const hub = await readFile(join(out, 'names', 'index.html'), 'utf8');
  assert.ok(PRESENT.length >= 5, `expected the harvested languages, got ${PRESENT.length}`);
  for (const l of PRESENT) {
    const page = await readFile(join(out, 'names', l.code, 'index.html'), 'utf8');
    const rows = (page.match(/class="nx-row"/g) || []).length;
    assert.equal(rows, l.count, `${l.code}: page lists ${rows} names, corpus holds ${l.count}`);
    // Every name is tagged as that language, and every row links a real page.
    assert.equal((page.match(new RegExp(`class="nx-name" lang="${l.code}"`, 'g')) || []).length, l.count);
    assert.match(hub, new RegExp(`href="/lawtome/names/${l.code}/"`));
  }
  await rm(out, { recursive: true, force: true });
});

test('the indexes quote names rather than translate the entries', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-nm2-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  const fr = await readFile(join(out, 'names', 'fr', 'index.html'), 'utf8');
  // Every name on the page is one we actually recorded — no page-side invention.
  const recorded = new Set(namesFor(PARSED, REAL_FACTS, 'fr').map((r) => r.name));
  const shown = [...fr.matchAll(/<span class="nx-name" lang="fr">([^<]*)<\/span>/g)]
    .map((m) => m[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  assert.ok(shown.length > 0);
  for (const n of shown) assert.ok(recorded.has(n), `name not in the corpus: ${n}`);
  await rm(out, { recursive: true, force: true });
});
