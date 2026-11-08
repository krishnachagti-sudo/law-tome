// Same-day wave alerts from Wikipedia's hourly pageview dumps.
//
//   node scripts/wave-hourly.mjs [--hours N]
//
// The daily API lags a day or more, and attention to an event decays at about
// 0.4 a day (half-life ~1.7 days, from arXiv 2209.07033's decay rate), so the
// daily detector sees a wave after a third or more of it is gone. The hourly
// dump files (dumps.wikimedia.org/other/pageviews) appear about three hours
// after the hour. This reads the newest N of them (default 3) that it has not
// read before, keeps only the Tome's own articles, and alerts when a law's
// latest hour is far above its normal hourly rate.
//
// Each dump is ~30-130 MB gzipped and is streamed, never written to disk; only
// the counts for our ~1,100 articles are cached, in waves/out/hourly/.
//
// The "normal hourly rate" is the law's daily median from the latest daily
// report divided by 24. The two counts are close but not identical: the daily
// API (agent=user) excludes all automated traffic, while the hourly dumps drop
// "as many spiders and bots as we can detect" (Wikitech), so hourly numbers can
// run slightly high. The alert bar is wide enough that this does not matter much. That ignores the daily cycle (night hours run below the
// average, evening hours above), so treat an alert as "look now", not a wave.
// The daily detector still decides what enters the queue.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { Readable } from 'node:stream';
import { createInterface } from 'node:readline';

const args = process.argv.slice(2);
const hours = args.includes('--hours') ? Number(args[args.indexOf('--hours') + 1]) : 3;
const UA = { 'user-agent': 'LawTome-wave-detector/0.2 (https://conyso.com/lawtome/)' };
const BASE = 'https://dumps.wikimedia.org/other/pageviews';

// Starting values, not findings: no source gives an hourly alert bar for concept
// articles. Same form as Lehmann et al.'s daily rule, p = (n - m)/max(m, floor).
export const HOURLY = { minViews: 50, minP: 10, floor: 5 };

const lawDir = new URL('../src/data/laws/', import.meta.url);
const laws = readdirSync(lawDir).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(new URL(f, lawDir), 'utf8')));
const titleToSlug = new Map();
for (const l of laws) {
  const s = [l.sameAs].flat().find((u) => /en\.wikipedia\.org\/wiki\//.test(u || ''));
  if (s) titleToSlug.set(decodeURIComponent(s.split('/wiki/')[1]), l.slug);
}
const names = new Map(laws.map((l) => [l.slug, l.name]));

const outDir = new URL('../waves/out/', import.meta.url);
const writeAtomic = (url, data) => { const tmp = new URL(`${url.href}.tmp`); writeFileSync(tmp, data); renameSync(tmp, url); };
const readJson = (url) => { try { return JSON.parse(readFileSync(url, 'utf8')); } catch { return null; } };
const cacheDir = new URL('hourly/', outDir);
mkdirSync(cacheDir, { recursive: true });

// ---- which hourly files exist ---------------------------------------------
const pad = (n) => String(n).padStart(2, '0');
const months = [0, 1].map((back) => { const d = new Date(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - back); return `${d.getUTCFullYear()}/${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`; });
const files = [];
for (const m of months) {
  const html = await fetch(`${BASE}/${m}/`, { headers: UA }).then((r) => (r.ok ? r.text() : '')).catch(() => '');
  for (const [, f] of html.matchAll(/href="(pageviews-\d{8}-\d{6}\.gz)"/g)) files.push(`${m}/${f}`);
}
const newest = [...new Set(files)].sort().slice(-hours);
if (!newest.length) { console.error('hourly: could not list the dump directory'); process.exit(1); }

// ---- read the ones not cached yet -------------------------------------------
const key = (f) => f.match(/pageviews-(\d{8}-\d{2})/)[1];
for (const f of newest) {
  const cached = new URL(`${key(f)}.json`, cacheDir);
  if (existsSync(cached)) continue;
  const t0 = Date.now();
  const res = await fetch(`${BASE}/${f}`, { headers: UA });
  if (!res.ok) { console.error(`hourly: ${f} returned ${res.status}`); continue; }
  const counts = {};
  const lines = createInterface({ input: Readable.fromWeb(res.body).pipe(createGunzip()), crlfDelay: Infinity });
  for await (const line of lines) {
    // "en Title views bytes" (desktop) and "en.m Title views bytes" (mobile).
    if (!(line.startsWith('en ') || line.startsWith('en.m '))) continue;
    const [, title, views] = line.split(' ');
    const slug = titleToSlug.get(title);
    if (slug) counts[slug] = (counts[slug] || 0) + Number(views);
  }
  writeAtomic(cached, JSON.stringify(counts) + '\n');
  console.error(`hourly: ${key(f)} read in ${Math.round((Date.now() - t0) / 1000)}s, ${Object.keys(counts).length} laws with views`);
}

// ---- compare the latest hour with each law's normal -------------------------
const dailyReports = readdirSync(outDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
// Newest full report that parses; test runs live in waves/out/test/ and never count.
const daily = [...dailyReports].reverse().map((f) => readJson(new URL(f, outDir))).find((r) => r?.baselines && !r.test) || null;
const baseline = new Map();
// The daily report keeps full Wikipedia stats only for ranked waves, so the
// baselines come from its per-law cache when present (see wave-detect.mjs).
for (const [slug, b] of Object.entries(daily?.baselines || {})) baseline.set(slug, b);

const lastKey = key(newest.at(-1));
const last = readJson(new URL(`${lastKey}.json`, cacheDir)) || {};
const alerts = Object.entries(last).map(([slug, n]) => {
  const m = (baseline.get(slug) ?? 0) / 24;
  const p = (n - m) / Math.max(m, HOURLY.floor);
  return { slug, name: names.get(slug), hour: lastKey, views: n, expected: +m.toFixed(1), p: +p.toFixed(1) };
}).filter((a) => baseline.has(a.slug) && a.views >= HOURLY.minViews && a.p >= HOURLY.minP)
  .sort((a, b) => b.p - a.p);

const md = [`# Hourly alerts, ${lastKey} UTC`, '',
  `Read ${newest.length} hourly file(s); baselines from the ${daily?.date || 'missing'} daily report.`, '',
  ...(!daily ? ['**⚠ No usable daily report, so nothing can be judged. Run wave-detect.mjs.**', ''] : []),
  'An alert means look now: the law\'s latest hour is far above its average hour. It ignores the daily cycle, so confirm with the cause before judging.', '',
  ...(alerts.length ? alerts.map((a) => `- **${a.name}**: ${a.views} views in the hour vs ~${a.expected} normal (p ${a.p}) https://conyso.com/lawtome/laws/${a.slug}/`) : ['_No alerts._']),
  ''].join('\n');
writeAtomic(new URL('hourly-latest.md', outDir), md);
writeAtomic(new URL('hourly-latest.json', outDir), JSON.stringify({ hour: lastKey, alerts }, null, 1) + '\n');
console.log(`hourly: ${alerts.length} alerts for ${lastKey} UTC → waves/out/hourly-latest.md`);
