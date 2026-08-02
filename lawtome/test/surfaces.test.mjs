// /equations/, /pronunciation/ and /sources/ — three collected views over data
// the corpus already held one item at a time.
//
// What these tests hold: nothing appears that the data does not carry (no
// formula without a recorded formula, no clip without a recorded clip), the
// bibliography counts what is actually cited, and the pages ship.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { equations, pronunciations, bibliography, hostOf } from '../build/surfaces.mjs';
import { equationsPage, pronunciationPage, sourcesPage } from '../src/templates/surfaces.mjs';
import { buildSite } from '../build/build.mjs';

const LAW = (slug, extra = {}) => ({
  slug, name: slug.replace(/-/g, ' '), no: 1, statement: 's', meaning: 'm', origin: 'o',
  example: 'e', category: 'physics', reliability: 'Empirical', provenance: 'canon', ...extra,
});

const FACTS = {
  _people: {
    'ada-one': { person: 'Ada One', audio: { file: 'One.ogg', ext: '.ogg', artist: 'Speaker', licence: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/x' } },
    'bo-two': { person: 'Bo Two' }, // no clip
  },
  'a-law': { formula: { tex: 'E = mc^2', source: 'https://www.wikidata.org/wiki/Q1' } },
  'b-law': {},
};

const LAWS = [
  LAW('b-law', { namedAfter: 'Ada One', namesakeKind: 'person', sources: [{ url: 'https://en.wikipedia.org/wiki/B' }, { url: 'https://en.wikipedia.org/wiki/B2' }] }),
  LAW('a-law', { namedAfter: 'Bo Two', namesakeKind: 'person', sources: [{ url: 'https://www.nature.com/x' }] }),
  LAW('c-law'),
];

test('hostOf drops the www and survives a non-URL', () => {
  assert.equal(hostOf('https://www.nature.com/a/b'), 'nature.com');
  assert.equal(hostOf('https://en.wikipedia.org/wiki/X'), 'en.wikipedia.org');
  assert.equal(hostOf('not a url'), '');
  assert.equal(hostOf(undefined), '');
});

test('only entries with a recorded formula reach the equations page', () => {
  const rows = equations(LAWS, FACTS);
  assert.deepEqual(rows.map((r) => r.law.slug), ['a-law']);
  assert.equal(rows[0].tex, 'E = mc^2');
});

test('only namesakes with a recorded clip reach the pronunciation page', () => {
  const rows = pronunciations(LAWS, FACTS);
  assert.deepEqual(rows.map((r) => r.person), ['Ada One']);
  assert.deepEqual(rows[0].laws.map((l) => l.slug), ['b-law']);
  // A person recorded in facts but with no audio is absent, not shown silent.
  assert.ok(!rows.some((r) => r.person === 'Bo Two'));
});

test('a namesake who is not a confirmed person is never given a voice', () => {
  // Muphry's Law is "named after" a misspelling; the clip harvested against it
  // says "Murphy". An unconfirmed namesake is unknown, not a person.
  const joke = [LAW('m-law', { namedAfter: 'Ada One' })];              // no namesakeKind
  const notPerson = [LAW('h-law', { namedAfter: 'Ada One', namesakeKind: 'place' })];
  assert.deepEqual(pronunciations(joke, FACTS), []);
  assert.deepEqual(pronunciations(notPerson, FACTS), []);
});

test('the bibliography counts sources, domains and sourced entries', () => {
  const bib = bibliography(LAWS);
  assert.equal(bib.sources, 3);
  assert.equal(bib.cited, 2);
  assert.deepEqual(bib.domains.map((d) => [d.host, d.n]), [['en.wikipedia.org', 2], ['nature.com', 1]]);
  // Two citations from ONE entry count as one entry relying on that domain.
  assert.deepEqual(bib.domains[0].laws.map((l) => l.slug), ['b-law']);
});

test('each page states its own scale and links its entries', () => {
  const eq = equationsPage(equations(LAWS, FACTS), { base: '/', origin: 'https://e.com', count: 3, categories: { physics: 'Physics' } });
  assert.match(eq, /1 of the named laws/);
  assert.match(eq, /href="\/laws\/a-law\/"/);
  assert.match(eq, /E = mc\^2/);

  const pr = pronunciationPage(pronunciations(LAWS, FACTS), { base: '/', origin: 'https://e.com', count: 3 });
  assert.match(pr, /data-audio="\/assets\/audio\/ada-one\.ogg"/);
  assert.match(pr, /CC BY-SA 4\.0/);   // the licence the clip obliges us to show

  const sr = sourcesPage(bibliography(LAWS), { base: '/', origin: 'https://e.com', count: 3, total: 3 });
  assert.match(sr, /cites 3 sources across 2 domains/);
  assert.match(sr, /en\.wikipedia\.org/);
  // Coverage short of the whole corpus is stated as a fraction, not rounded up.
  assert.match(sr, /covering 2 of its 3 entries/);
});

test('total coverage is phrased as total, not as "N of N"', () => {
  const all = [LAW('x', { sources: [{ url: 'https://a.com/1' }] }), LAW('y', { sources: [{ url: 'https://a.com/2' }] })];
  const sr = sourcesPage(bibliography(all), { base: '/', origin: '', count: 2, total: 2 });
  assert.match(sr, /covering every one of its 2 entries/);
  assert.doesNotMatch(sr, /2 of its 2 entries/);
});

// --- build integration ---

const PARSED = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
const REAL_FACTS = JSON.parse(readFileSync('src/data/facts.json', 'utf8'));

test('build ships all three, and every asset they point at exists', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-sf-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });

  const eqRows = equations(PARSED, REAL_FACTS);
  assert.ok(eqRows.length > 50, `expected the harvested formulas, got ${eqRows.length}`);
  const eq = await readFile(join(out, 'equations', 'index.html'), 'utf8');
  assert.equal((eq.match(/class="eq-row"/g) || []).length, eqRows.length);
  for (const r of eqRows) {
    assert.ok(existsSync(join(out, 'assets', 'img', 'formula', `${r.law.slug}.svg`)), `missing formula svg: ${r.law.slug}`);
  }

  const prRows = pronunciations(PARSED, REAL_FACTS);
  assert.ok(prRows.length > 100, `expected the harvested clips, got ${prRows.length}`);
  const pr = await readFile(join(out, 'pronunciation', 'index.html'), 'utf8');
  assert.equal((pr.match(/class="pr-row"/g) || []).length, prRows.length);
  for (const r of prRows) {
    assert.ok(existsSync(join(out, 'assets', 'audio', `${r.slug}${r.audio.ext || '.ogg'}`)), `missing clip: ${r.slug}`);
  }

  const bib = bibliography(PARSED);
  const sr = await readFile(join(out, 'sources', 'index.html'), 'utf8');
  assert.equal((sr.match(/class="sr-row"/g) || []).length, bib.domains.length);
  assert.ok(bib.sources > 1000, `expected the corpus bibliography, got ${bib.sources}`);

  await rm(out, { recursive: true, force: true });
});
