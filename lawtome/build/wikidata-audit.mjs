// Audit our Wikidata linkage. Read-only: this never edits Wikidata.
//   1. For every entry we already matched, confirm the item exists and record
//      how connected it is (sitelinks) and whether it already carries a
//      "described at URL" (P973).
//   2. For every entry we never matched, ask Wikidata whether an item exists
//      that our fetcher missed — by the entry's name and by each of its aliases.
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';

// Run from the package root: `node build/wikidata-audit.mjs`.
const DIR = '.';
const facts = JSON.parse(readFileSync(`${DIR}/src/data/facts.json`, 'utf8'));
const files = await readdir(`${DIR}/src/data/laws`);
const laws = files.map((f) => JSON.parse(readFileSync(`${DIR}/src/data/laws/${f}`, 'utf8')));

const UA = 'LawTomeAudit/1.0 (https://krishnachagti-sudo.github.io/law-tome; read-only linkage audit)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `https://www.wikidata.org/w/api.php?${new URLSearchParams({ ...params, format: 'json' })}`;
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.ok) return await r.json();
    } catch { /* retry */ }
    await sleep(1000 * (a + 1));
  }
  return null;
}

const qidOf = (slug) => ((facts[slug] || {}).names || {}).qid || null;
const matched = laws.filter((l) => qidOf(l.slug));
const unmatched = laws.filter((l) => !qidOf(l.slug));
console.error(`matched ${matched.length}, unmatched ${unmatched.length}`);

// ---- 1. the ones we have -----------------------------------------------------
const have = [];
for (let i = 0; i < matched.length; i += 50) {
  const batch = matched.slice(i, i + 50);
  const d = await api({
    action: 'wbgetentities',
    ids: batch.map((l) => qidOf(l.slug)).join('|'),
    props: 'sitelinks|claims|labels',
    languages: 'en',
  });
  for (const l of batch) {
    const e = d && d.entities && d.entities[qidOf(l.slug)];
    have.push({
      slug: l.slug,
      name: l.name,
      qid: qidOf(l.slug),
      ok: !!(e && !e.missing),
      label: e && e.labels && e.labels.en ? e.labels.en.value : null,
      sitelinks: e && e.sitelinks ? Object.keys(e.sitelinks).length : 0,
      p973: !!(e && e.claims && e.claims.P973),
    });
  }
  console.error(`  have: ${have.length}/${matched.length}`);
  await sleep(250);
}

// ---- 2. the ones we don't ----------------------------------------------------
const found = [];
for (const l of unmatched) {
  const tries = [l.name, ...(Array.isArray(l.aliases) ? l.aliases.slice(0, 2) : [])];
  let hit = null;
  for (const q of tries) {
    const d = await api({ action: 'wbsearchentities', search: q, language: 'en', uselang: 'en', type: 'item', limit: 3 });
    const top = d && d.search && d.search[0];
    if (top) { hit = { q, id: top.id, label: top.label, description: top.description || '' }; break; }
    await sleep(120);
  }
  found.push({ slug: l.slug, name: l.name, hit });
  if (found.length % 25 === 0) console.error(`  search: ${found.length}/${unmatched.length}`);
  await sleep(150);
}

writeFileSync('docs/wikidata-audit-raw.json',
  JSON.stringify({ have, found }, null, 2));
console.error('done');
