// Everything that must be true of dist/ before it is allowed to be the live
// site. Run after `npm run build`; exits non-zero on the first thing that would
// be embarrassing or expensive to discover in public.
//
// This is not a substitute for the test suite. The tests check that each piece
// renders correctly in isolation; this checks the assembled output as a whole,
// which is where whole-site mistakes live: a canonical still pointing at the old
// origin, a sitemap listing pages marked noindex, a link to a page that was
// renamed, a build placeholder that never got substituted. Every one of those
// passes unit tests and breaks a launch.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const cfg = JSON.parse(readFileSync('site.config.json', 'utf8'));

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

const all = walk(DIST);
const pages = all.filter((f) => f.endsWith('.html'));
const fail = [];
const check = (cond, msg) => { if (!cond) fail.push(msg); };

// --- where the site thinks it lives -----------------------------------------
check(typeof cfg.origin === 'string' && /^https:\/\/[^/]+$/.test(cfg.origin),
  `site.config origin looks wrong: ${cfg.origin}`);
const host = cfg.origin ? new URL(cfg.origin).host : '';
if (cfg.base === '/' && cfg.origin) {
  check(existsSync(join(DIST, 'CNAME')), 'dist/CNAME missing — GitHub Pages will not serve the custom domain');
  if (existsSync(join(DIST, 'CNAME'))) {
    const cname = readFileSync(join(DIST, 'CNAME'), 'utf8').trim();
    check(cname === host, `CNAME says "${cname}" but origin is ${host}`);
  }
}

// --- canonicals --------------------------------------------------------------
// 404.html is exempt: it is served under whatever URL was missed, so it has no
// canonical of its own and must not claim one.
let noCanon = 0; let badCanon = 0; let multiCanon = 0;
for (const f of pages) {
  if (f === join(DIST, '404.html')) continue;
  const h = readFileSync(f, 'utf8');
  if (/http-equiv="refresh"/i.test(h)) continue;
  const tags = h.match(/<link rel="canonical" href="[^"]+"/g) || [];
  if (!tags.length) { noCanon++; continue; }
  if (tags.length > 1) multiCanon++;
  const u = tags[0].match(/href="([^"]+)"/)[1];
  if (!u.startsWith(`${cfg.origin}/`)) badCanon++;
}
check(noCanon === 0, `${noCanon} pages have no canonical`);
check(multiCanon === 0, `${multiCanon} pages declare more than one canonical`);
check(badCanon === 0, `${badCanon} canonicals do not point at ${cfg.origin}`);

// --- internal links ----------------------------------------------------------
const have = new Set(all.map((f) => f.replace(/^dist/, '')));
for (const f of pages) have.add(f.replace(/^dist/, '').replace(/index\.html$/, ''));
const dead = new Set();
for (const f of pages) {
  for (const m of readFileSync(f, 'utf8').matchAll(/href="(\/[^"#?]*)/g)) {
    if (m[1].startsWith('//')) continue;
    let p;
    try { p = decodeURI(m[1]); } catch { p = m[1]; }
    if (!have.has(p) && !have.has(`${p}index.html`) && !have.has(p.replace(/\/$/, ''))) dead.add(p);
  }
}
check(dead.size === 0, `${dead.size} internal links point at nothing: ${[...dead].slice(0, 8).join(', ')}`);

// --- robots and sitemap agree with each other and with the pages -------------
const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
check(robots.includes(`Sitemap: ${cfg.origin}${cfg.base}sitemap.xml`) || robots.includes(`Sitemap: ${cfg.origin}/sitemap.xml`),
  'robots.txt does not advertise the sitemap at the live origin');
check(!/^\s*Disallow:\s*\/\s*$/m.test(robots), 'robots.txt disallows the entire site');

const locs = [...readFileSync(join(DIST, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length > 500, `sitemap lists only ${locs.length} urls`);
check(locs.every((u) => u.startsWith(cfg.origin)), 'sitemap lists urls on a different origin');
check(new Set(locs).size === locs.length, 'sitemap lists the same url twice');

// A page that is both noindex and in the sitemap sends search engines two
// contradictory instructions, and Search Console reports it as an error.
const inSitemap = new Set(locs.map((u) => u.slice(cfg.origin.length)));
let contradiction = 0;
for (const f of pages) {
  const h = readFileSync(f, 'utf8');
  const p = f.replace(/^dist/, '').replace(/index\.html$/, '');
  if (/name="robots"[^>]*noindex/i.test(h) && inSitemap.has(p)) contradiction++;
  if (/http-equiv="refresh"/i.test(h) && inSitemap.has(p)) contradiction++;
}
check(contradiction === 0, `${contradiction} pages are in the sitemap but noindex or redirecting`);

// --- nothing half-built, nothing private -------------------------------------
for (const [pattern, label] of [
  [/@@LASTMOD@@/, 'an unsubstituted build token'],
  [/http:\/\/localhost|127\.0\.0\.1/, 'a local development URL'],
  [/>undefined<|"undefined"/, 'a literal "undefined"'],
  [/>NaN<|\bNaN\b/, 'a NaN'],
]) {
  const hits = pages.filter((f) => pattern.test(readFileSync(f, 'utf8')));
  check(hits.length === 0, `${hits.length} pages contain ${label} (e.g. ${hits[0]})`);
}

// The owner's personal address must never be published. This is a standing
// constraint on the project, so it is checked rather than remembered.
const leaks = all.filter((f) => /\.(html|txt|json|xml)$/.test(f)
  && /krishnachagti@gmail\.com/i.test(readFileSync(f, 'utf8')));
check(leaks.length === 0, `personal email address published on ${leaks.length} files: ${leaks.slice(0, 3).join(', ')}`);

if (fail.length) {
  console.error(`preflight FAILED — ${fail.length} problem${fail.length === 1 ? '' : 's'}:`);
  for (const m of fail) console.error(`  • ${m}`);
  process.exit(1);
}
console.log(`preflight passed: ${pages.length} html files, ${locs.length} sitemap urls, 0 dead internal links.`);
