// Century and decade pages (/timeline/<slug>/).
//
// The rules under test are the ones that keep the pages honest and non-thin:
// an undated entry lands in no period, a decade earns a page only once it has
// enough entries to say something, and every period's own URL is the one the
// sitemap and the law pages point at.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { periods, periodPath, decadesIn, centurySlug, centuryLabel, decadeOf, MIN_DECADE } from '../build/periods.mjs';
import { periodPage } from '../src/templates/period.mjs';
import { buildSite } from '../build/build.mjs';

const LAW = (slug, year) => ({
  slug, name: slug.replace(/-/g, ' '), no: 1, statement: 's', meaning: 'm', origin: 'o',
  example: 'e', category: 'economics', reliability: 'Empirical', provenance: 'canon',
  ...(year == null ? {} : { coinedYear: year }),
});

test('centuryLabel and centurySlug agree, with correct ordinals', () => {
  assert.equal(centuryLabel(20), '20th century');
  assert.equal(centuryLabel(21), '21st century');
  assert.equal(centuryLabel(22), '22nd century');
  assert.equal(centuryLabel(23), '23rd century');
  assert.equal(centurySlug(20), '20th-century');
});

test('decadeOf floors to the decade', () => {
  assert.equal(decadeOf(1974), 1970);
  assert.equal(decadeOf(1970), 1970);
  assert.equal(decadeOf(1979), 1970);
});

test('an undated entry lands in no period at all', () => {
  const laws = [LAW('a', 1974), LAW('b', null), LAW('c', 0)];
  const all = periods(laws, { minDecade: 1 });
  const slugs = new Set(all.flatMap((p) => p.laws.map((l) => l.slug)));
  assert.ok(slugs.has('a'));
  assert.ok(!slugs.has('b'), 'undated entry was placed in a period');
  assert.ok(!slugs.has('c'), 'year 0 was treated as datable');
});

test('a decade earns a page only at the threshold', () => {
  const nine = Array.from({ length: 9 }, (_, i) => LAW(`x${i}`, 1971));
  assert.ok(!periods(nine, { minDecade: 10 }).some((p) => p.kind === 'decade'));
  const ten = [...nine, LAW('x9', 1972)];
  const dec = periods(ten, { minDecade: 10 }).filter((p) => p.kind === 'decade');
  assert.equal(dec.length, 1);
  assert.equal(dec[0].slug, '1970s');
  assert.equal(dec[0].laws.length, 10);
  // The century page exists either way — a century is never too thin.
  assert.ok(periods(nine, { minDecade: 10 }).some((p) => p.kind === 'century'));
});

test('periods come out chronological by first year, centuries and decades interleaved', () => {
  const laws = [LAW('a', 1901), LAW('b', 1974), LAW('c', 1830)];
  const all = periods(laws, { minDecade: 1 });
  // The 19th century opens in 1801, before its own 1830s; the 1900s decade
  // opens in 1900, a year before the 20th century it mostly belongs to.
  assert.deepEqual(all.map((p) => p.slug), ['19th-century', '1830s', '1900s', '20th-century', '1970s']);
  assert.deepEqual(all.map((p) => p.from), [1801, 1830, 1900, 1901, 1970]);
});

test('century boundaries follow the calendar, not the leading digits', () => {
  const all = periods([LAW('a', 1900), LAW('b', 1901)], { minDecade: 99 });
  const cents = all.filter((p) => p.kind === 'century');
  assert.deepEqual(cents.map((c) => c.slug), ['19th-century', '20th-century']);
  assert.equal(cents[0].from, 1801);
  assert.equal(cents[0].to, 1900);
  assert.equal(cents[1].from, 1901);
});

test('decadesIn covers the whole century, counting the empty decades too', () => {
  const laws = [LAW('a', 1974), LAW('b', 1975), LAW('c', 1903)];
  const rows = decadesIn(20, laws, { minDecade: 2 });
  assert.equal(rows.length, 10);
  assert.deepEqual(rows.map((r) => r.label)[0], '1900s');
  assert.equal(rows.find((r) => r.label === '1970s').count, 2);
  assert.equal(rows.find((r) => r.label === '1970s').slug, '1970s');
  // Below the threshold there is a count but no link.
  assert.equal(rows.find((r) => r.label === '1900s').count, 1);
  assert.equal(rows.find((r) => r.label === '1900s').slug, null);
  assert.equal(rows.find((r) => r.label === '1940s').count, 0);
});

test('the page states its span, its busiest field and its endpoints', () => {
  const laws = [LAW('early', 1971), LAW('late', 1978)];
  const [p] = periods(laws, { minDecade: 1 }).filter((x) => x.kind === 'decade');
  const html = periodPage(p, {
    base: '/', origin: 'https://e.com', count: 2,
    categories: { economics: 'Economics & incentives' },
    siblings: periods(laws, { minDecade: 1 }),
  });
  assert.match(html, /110|2 of the named laws/);
  assert.match(html, /1970–1979/);
  assert.match(html, /Economics &amp; incentives/);
  assert.match(html, /from early in 1971 to late in 1978/);
  // The list is chronological and every row links its entry.
  assert.ok(html.indexOf('/laws/early/') < html.indexOf('/laws/late/'));
});

test('the decade strip appears on a century page and not on a decade page', () => {
  const laws = Array.from({ length: 12 }, (_, i) => LAW(`x${i}`, 1970 + (i % 8)));
  const all = periods(laws);
  const century = all.find((p) => p.kind === 'century');
  const decade = all.find((p) => p.kind === 'decade');
  const cHtml = periodPage(century, { base: '/', siblings: all, decades: decadesIn(20, laws) });
  const dHtml = periodPage(decade, { base: '/', siblings: all, decades: [] });
  assert.match(cHtml, /Decade by decade/);
  assert.doesNotMatch(dHtml, /Decade by decade/);
  // A decade page points up at the century it sits inside.
  assert.match(dHtml, /rel="up"/);
  assert.match(dHtml, /href="\/timeline\/20th-century\/"/);
});

// --- build integration ---

const PARSED = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
const REAL = periods(PARSED);

test('build writes a page for every period, and nothing thinner than the threshold', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-pr-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  assert.ok(REAL.length > 20, `expected the corpus to fill many periods, got ${REAL.length}`);
  for (const p of REAL) {
    const file = join(out, ...periodPath(p).split('/').filter(Boolean), 'index.html');
    assert.ok(existsSync(file), `missing period page: ${periodPath(p)}`);
    if (p.kind === 'decade') assert.ok(p.laws.length >= MIN_DECADE, `${p.slug} is below the threshold`);
  }
  // The timeline links the centuries it lists.
  const tl = await readFile(join(out, 'timeline', 'index.html'), 'utf8');
  for (const c of REAL.filter((p) => p.kind === 'century')) {
    assert.match(tl, new RegExp(`href="/lawtome/timeline/${c.slug}/"`));
  }
  await rm(out, { recursive: true, force: true });
});

test('a law page links the period its coinage actually falls in', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-pr2-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  const slugs = new Set(REAL.map((p) => p.slug));
  // Sample across the corpus rather than all 1,100 — the rule is uniform.
  const sample = PARSED.filter((l) => Number(l.coinedYear) >= 1).slice(0, 40);
  for (const l of sample) {
    const html = await readFile(join(out, 'laws', l.slug, 'index.html'), 'utf8');
    const dec = `${Math.floor(Number(l.coinedYear) / 10) * 10}s`;
    const cent = centurySlug(Math.floor((Number(l.coinedYear) - 1) / 100) + 1);
    const want = slugs.has(dec) ? dec : cent;
    assert.match(html, new RegExp(`href="/lawtome/timeline/${want}/"`), `${l.slug} (${l.coinedYear}) should link ${want}`);
  }
  await rm(out, { recursive: true, force: true });
});
