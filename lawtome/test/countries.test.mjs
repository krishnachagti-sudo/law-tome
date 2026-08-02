// Country-of-birth pages (/origins/<country>/).
//
// The claim these pages make is narrow and the tests hold them to it: the
// country comes from the recorded birthplace and nowhere else, a namesake who
// is not a person never appears, and a country too thin to say anything about
// gets no page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { countryGroups, countriesWithPages, countrySlug, countryPath, MIN_LAWS } from '../build/countries.mjs';
import { countryPage } from '../src/templates/country.mjs';
import { buildSite } from '../build/build.mjs';

const LAW = (slug, namedAfter, extra = {}) => ({
  slug, name: slug.replace(/-/g, ' '), no: 1, statement: 's', meaning: 'm', origin: 'o',
  example: 'e', category: 'economics', reliability: 'Empirical', provenance: 'canon',
  namedAfter, ...extra,
});

const FACTS = {
  _people: {
    'ada-one': { origin: { place: 'Budapest', country: 'Hungary', countryQid: 'Q28', source: 'https://www.wikidata.org/wiki/Q1' } },
    'bela-two': { origin: { place: 'Szeged', country: 'Hungary', countryQid: 'Q28', source: 'https://www.wikidata.org/wiki/Q2' } },
    'carl-three': { origin: { place: 'Bonn', country: 'Germany', countryQid: 'Q183', source: 'https://www.wikidata.org/wiki/Q3' } },
    'dot-four': { origin: { place: 'Nowhere', source: 'https://www.wikidata.org/wiki/Q4' } }, // no country
    'hawthorne-works': { origin: { place: 'Cicero', country: 'United States', source: 'https://www.wikidata.org/wiki/Q5' } },
  },
};

const LAWS = [
  LAW('a1', 'Ada One'), LAW('a2', 'Ada One'), LAW('b1', 'Bela Two'),
  LAW('c1', 'Carl Three'),
  LAW('d1', 'Dot Four'),
  LAW('h1', 'Hawthorne Works', { namesakeKind: 'place' }),
  LAW('n1', null),
];

test('countrySlug folds accents and punctuation', () => {
  assert.equal(countrySlug('Czech Republic'), 'czech-republic');
  assert.equal(countrySlug('Côte d’Ivoire'), 'cote-d-ivoire');
  assert.equal(countrySlug(''), '');
});

test('countryPath is the page URL, base-relative', () => {
  assert.equal(countryPath('hungary'), 'origins/hungary/');
});

test('a law is filed only under a recorded birthplace country', () => {
  const groups = countryGroups(LAWS, FACTS);
  const by = Object.fromEntries(groups.map((g) => [g.country, g]));
  assert.deepEqual(Object.keys(by).sort(), ['Germany', 'Hungary']);
  assert.deepEqual(by.Hungary.laws.map((l) => l.slug), ['a1', 'a2', 'b1']);
  // No country recorded, no namesake at all, and a namesake that is a place:
  // none of the three lands anywhere.
  const placed = new Set(groups.flatMap((g) => g.laws.map((l) => l.slug)));
  assert.ok(!placed.has('d1'), 'a birthplace with no country was still filed');
  assert.ok(!placed.has('n1'), 'a law with no namesake was filed');
  assert.ok(!placed.has('h1'), 'a law named after a place was treated as a person');
});

test('a group carries its people, their towns and its own qid', () => {
  const [hu] = countryGroups(LAWS, FACTS).filter((g) => g.country === 'Hungary');
  assert.equal(hu.slug, 'hungary');
  assert.equal(hu.qid, 'Q28');
  // People ranked by how many laws they carry.
  assert.deepEqual(hu.people.map((p) => p.person), ['Ada One', 'Bela Two']);
  assert.deepEqual(hu.people[0].laws.map((l) => l.slug), ['a1', 'a2']);
  assert.deepEqual(hu.places.map((p) => p.place).sort(), ['Budapest', 'Szeged']);
});

test('groups come out biggest first', () => {
  assert.deepEqual(countryGroups(LAWS, FACTS).map((g) => g.country), ['Hungary', 'Germany']);
});

test('a country earns a page only at the threshold', () => {
  const groups = countryGroups(LAWS, FACTS);
  assert.deepEqual(countriesWithPages(groups, { min: 3 }).map((g) => g.country), ['Hungary']);
  assert.deepEqual(countriesWithPages(groups, { min: 1 }).map((g) => g.country), ['Hungary', 'Germany']);
  assert.equal(MIN_LAWS, 3);
});

test('the page says birthplace, not nationality, above the fold', () => {
  const [hu] = countriesWithPages(countryGroups(LAWS, FACTS), { min: 3 });
  const html = countryPage(hu, { base: '/', origin: 'https://e.com', count: 7, categories: { economics: 'Economics & incentives' } });
  assert.match(html, /Named laws from Hungary/);
  assert.match(html, /Filed by <em>birthplace<\/em>/);
  assert.match(html, /not nationality, not citizenship, and not where the work was done/);
  // It links the country's Wikidata item rather than asserting the fact bare.
  assert.match(html, /https:\/\/www\.wikidata\.org\/wiki\/Q28/);
  // Every namesake row shows the town it is claiming.
  assert.match(html, /Budapest/);
  assert.match(html, /Szeged/);
  assert.match(html, /href="\/laws\/a1\/"/);
});

// --- build integration ---

const PARSED = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
const REAL_FACTS = JSON.parse(readFileSync('src/data/facts.json', 'utf8'));
const REAL = countriesWithPages(countryGroups(PARSED, REAL_FACTS));

test('every birthplace in the harvest carries a sourced country', () => {
  const people = REAL_FACTS._people || {};
  const withOrigin = Object.values(people).filter((r) => r.origin);
  const withCountry = withOrigin.filter((r) => r.origin.country);
  assert.ok(withOrigin.length > 400, `expected the harvested birthplaces, got ${withOrigin.length}`);
  // Not a demand that every one resolve — it is a demand that the ones that
  // did resolve carry the Wikidata item they resolved against, so the claim on
  // the page is checkable.
  for (const r of withCountry) {
    assert.ok(r.origin.countryQid, `${r.origin.place}: country without a qid`);
    assert.match(r.origin.countryQid, /^Q\d+$/);
  }
});

test('build writes a page per qualifying country, linked from the map', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-cy-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  assert.ok(REAL.length >= 10, `expected many countries, got ${REAL.length}`);
  const map = await readFile(join(out, 'origins', 'index.html'), 'utf8');
  for (const g of REAL) {
    assert.ok(existsSync(join(out, 'origins', g.slug, 'index.html')), `missing country page: ${g.slug}`);
    assert.match(map, new RegExp(`href="/lawtome/origins/${g.slug}/"`), `map does not link ${g.slug}`);
    assert.ok(g.laws.length >= MIN_LAWS);
  }
  // No page for a country below the threshold.
  const thin = countryGroups(PARSED, REAL_FACTS).filter((g) => g.laws.length < MIN_LAWS);
  for (const g of thin) {
    assert.ok(!existsSync(join(out, 'origins', g.slug, 'index.html')), `thin country got a page: ${g.slug}`);
  }
  await rm(out, { recursive: true, force: true });
});
