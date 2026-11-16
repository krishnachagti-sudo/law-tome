// Same-day wave alerts from Wikipedia's hourly pageview dumps.
//
//   node scripts/wave-hourly.mjs [--hours N]
//
// The daily API lags a day or more, and attention to an event decays at about
// 0.4 a day (half-life ~1.7 days, from arXiv 2209.07033's decay rate), so the
// daily detector sees a wave after a third or more of it is gone. The hourly
// dump files (dumps.wikimedia.org/other/pageviews) appear about three hours
// after the hour. This keeps the newest N of them (default 24) read, backfilling
// any it has not read before, keeps only the Tome's own articles, and alerts when a law's
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
import { readdirSync, readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { fillHours } from './hourly-dumps.mjs';

const args = process.argv.slice(2);
// --hours N: the window to keep filled (default 24). Every run backfills any
// hour in it that is not cached yet, so a late or skipped GitHub schedule
// leaves no gap (before 17 Nov 2026 each run read only the newest 3 hours, and
// half the hours of the day were never read).
const hours = args.includes('--hours') ? Number(args[args.indexOf('--hours') + 1]) : 24;

// Starting values, not findings: no source gives an hourly alert bar for concept
// articles. Same form as Lehmann et al.'s daily rule, p = (n - m)/max(m, floor).
export const HOURLY = { minViews: 50, minP: 10, floor: 5 };

const lawDir = new URL('../src/data/laws/', import.meta.url);
const laws = readdirSync(lawDir).filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(new URL(f, lawDir), 'utf8')));
const names = new Map(laws.map((l) => [l.slug, l.name]));

const outDir = new URL('../waves/out/', import.meta.url);
const writeAtomic = (url, data) => { const tmp = new URL(`${url.href}.tmp`); writeFileSync(tmp, data); renameSync(tmp, url); };
const readJson = (url) => { try { return JSON.parse(readFileSync(url, 'utf8')); } catch { return null; } };
const cacheDir = new URL('hourly/', outDir);
mkdirSync(cacheDir, { recursive: true });

const filled = await fillHours(cacheDir, laws, { hours });
if (!filled.listed) { console.error('hourly: could not list the dump directory'); process.exit(1); }
const newest = filled.keys;

// ---- compare the latest hour with each law's normal -------------------------
const dailyReports = readdirSync(outDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
// Newest full report that parses; test runs live in waves/out/test/ and never count.
const daily = [...dailyReports].reverse().map((f) => readJson(new URL(f, outDir))).find((r) => r?.baselines && !r.test) || null;
const baseline = new Map();
// The daily report keeps full Wikipedia stats only for ranked waves, so the
// baselines come from its per-law cache when present (see wave-detect.mjs).
for (const [slug, b] of Object.entries(daily?.baselines || {})) baseline.set(slug, b);

const lastKey = newest.at(-1);
const last = readJson(new URL(`${lastKey}.json`, cacheDir)) || {};
const alerts = Object.entries(last).map(([slug, n]) => {
  const m = (baseline.get(slug) ?? 0) / 24;
  const p = (n - m) / Math.max(m, HOURLY.floor);
  return { slug, name: names.get(slug), hour: lastKey, views: n, expected: +m.toFixed(1), p: +p.toFixed(1) };
}).filter((a) => baseline.has(a.slug) && a.views >= HOURLY.minViews && a.p >= HOURLY.minP)
  .sort((a, b) => b.p - a.p);

const md = [`# Hourly alerts, ${lastKey} UTC`, '',
  `Window: ${newest.length} hours (${filled.read} read this run${filled.failed ? `, ${filled.failed} failed` : ''}); baselines from the ${daily?.date || 'missing'} daily report.`, '',
  ...(!daily ? ['**⚠ No usable daily report, so nothing can be judged. Run wave-detect.mjs.**', ''] : []),
  'An alert means look now: the law\'s latest hour is far above its average hour. It ignores the daily cycle, so confirm with the cause before judging.', '',
  ...(alerts.length ? alerts.map((a) => `- **${a.name}**: ${a.views} views in the hour vs ~${a.expected} normal (p ${a.p}) https://conyso.com/lawtome/laws/${a.slug}/`) : ['_No alerts._']),
  ''].join('\n');
writeAtomic(new URL('hourly-latest.md', outDir), md);
writeAtomic(new URL('hourly-latest.json', outDir), JSON.stringify({ hour: lastKey, alerts }, null, 1) + '\n');
console.log(`hourly: ${alerts.length} alerts for ${lastKey} UTC → waves/out/hourly-latest.md`);
