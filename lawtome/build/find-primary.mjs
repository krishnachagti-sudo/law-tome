// Propose primary sources for entries that have none. Read-only; writes a
// review file, never the corpus.
//
// 759 of 1,116 entries cite no primary source, and 1,148 of our 2,367 sources
// point at Wikipedia. For a site whose stated differentiator against Wikipedia
// is that it sources its claims, that is the most attackable fact about the
// project. Fixing it by hand is hundreds of lookups.
//
// The good news is that the work is mostly already done and just not cited: the
// `origin` field on nearly every entry NAMES the original paper, its author and
// its year, because someone verified that when the entry was written. So this
// does not discover anything — it resolves what the entry already says into a
// citable DOI via Crossref, which is publisher-deposited metadata rather than a
// search engine's guess.
//
// The Wikidata audit is the cautionary tale this is built against. There, a
// label search returned a 1994 film, a video game and a family name, and 45% of
// what a naive script would have accepted was a publication about the idea
// rather than the idea. A bibliographic search has the mirror-image failure: it
// will always return SOMETHING, and the something is usually a paper that merely
// cites the one you want. So nothing here is auto-accepted. Every candidate is
// scored on three independent checks and written to a review file for a person
// to read:
//
//   author  — a surname the entry itself names must appear in the author list.
//             This is the strongest signal by far and the hardest to fake.
//   year    — the publication year must be within two of the year the entry
//             records for the idea being coined.
//   type    — journal articles, books and chapters only. Not datasets, not
//             corrections, not "posted-content".
//
// A candidate that fails the author check is reported but marked, because that
// is the one most likely to be a citing paper wearing the right title.
//
//   node build/find-primary.mjs            # top 40 by fame
//   node build/find-primary.mjs --n 120    # more
//
// Writes docs/primary-candidates.json.

import { readFile, writeFile } from 'node:fs/promises';
import { loadCorpus } from './corpus.mjs';
import { bestKnown } from '../src/templates/bestknown.mjs';
import { gaps } from './source-gaps.mjs';

const API = 'https://api.crossref.org/works';
const UA = 'LawTome/1.0 (https://github.com/krishnachagti-sudo/law-tome; citation resolution)';
const OK_TYPES = new Set(['journal-article', 'book', 'book-chapter', 'monograph', 'proceedings-article', 'report']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Surnames the entry itself names, from `namedAfter` and from capitalised runs
 * in `origin`. These are the names a correct citation must contain.
 */
export function claimedNames(law) {
  const out = new Set();
  for (const part of String(law.namedAfter || '').split(/\s*(?:,|and|&)\s*/)) {
    const w = part.trim().split(/\s+/).filter(Boolean);
    if (w.length) out.add(w[w.length - 1].replace(/[^\p{L}-]/gu, ''));
  }
  // Capitalised word pairs in the origin prose — "Osborne Reynolds", "Max Weber".
  for (const m of String(law.origin || '').matchAll(/\b([A-Z][a-z]{2,})\s+([A-Z][a-z]{2,})\b/g)) {
    out.add(m[2]);
  }
  return [...out].filter((s) => s.length > 2);
}

/** The bibliographic query: what the entry says about where it came from. */
export function query(law) {
  const origin = String(law.origin || '').replace(/\s+/g, ' ').slice(0, 180);
  return `${law.name} ${origin}`.slice(0, 260);
}

async function crossref(q) {
  const url = `${API}?rows=4&select=DOI,title,author,issued,container-title,type&query.bibliographic=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`crossref ${res.status}`);
  return (await res.json()).message.items || [];
}

/** Score one Crossref item against what the entry claims. */
export function score(law, item, names) {
  const authors = (item.author || []).map((a) => `${a.family || ''}`.toLowerCase());
  const year = ((item.issued || {})['date-parts'] || [[]])[0][0];
  const coined = Number(law.coinedYear);
  return {
    author: names.some((n) => authors.some((a) => a.includes(n.toLowerCase()))),
    year: Number.isFinite(coined) && Number.isFinite(year) ? Math.abs(year - coined) <= 2 : null,
    type: OK_TYPES.has(item.type),
  };
}

const main = async () => {
  const n = Number((process.argv.find((a) => a.startsWith('--n')) || '').split('=')[1]
    || process.argv[process.argv.indexOf('--n') + 1] || 40);
  const laws = await loadCorpus('src/data/laws');
  const byslug = Object.fromEntries(laws.map((l) => [l.slug, l]));
  let facts = {};
  try { facts = JSON.parse(await readFile('src/data/facts.json', 'utf8')); } catch { /* optional */ }

  const targets = gaps(laws, bestKnown(laws, facts)).slice(0, n);
  const out = [];
  for (const [i, g] of targets.entries()) {
    const law = byslug[g.slug];
    const names = claimedNames(law);
    let items = [];
    try { items = await crossref(query(law)); } catch (e) { console.warn(`  ! ${g.slug}: ${e.message}`); }
    await sleep(300);
    const scored = items.map((it) => ({
      doi: it.DOI,
      title: (it.title || [''])[0],
      authors: (it.author || []).slice(0, 4).map((a) => `${a.family || ''}`).filter(Boolean),
      year: ((it.issued || {})['date-parts'] || [[]])[0][0] || null,
      journal: (it['container-title'] || [''])[0] || null,
      type: it.type,
      checks: score(law, it, names),
    }));
    // Author match first, then a year match, then anything.
    scored.sort((a, b) => (Number(b.checks.author) - Number(a.checks.author))
      || (Number(b.checks.year === true) - Number(a.checks.year === true)));
    out.push({
      slug: g.slug,
      name: law.name,
      rank: g.rank === Infinity ? null : g.rank,
      coinedYear: law.coinedYear ?? null,
      claims: names,
      origin: String(law.origin || '').slice(0, 200),
      candidates: scored,
      verified: false,
    });
    console.log(`${String(i + 1).padStart(3)}/${targets.length} ${g.slug.padEnd(38)} ${scored[0] && scored[0].checks.author ? 'AUTHOR MATCH' : 'no author match'}`);
  }

  await writeFile('docs/primary-candidates.json', `${JSON.stringify({
    generated: null,
    about: ('Crossref candidates for entries with no primary source, seeded from each '
      + "entry's own origin text. NOTHING here is accepted automatically — every row "
      + 'carries three independent checks and waits for a human.'),
    checks: {
      author: "a surname the entry itself names appears in the candidate's author list",
      year: "the candidate's year is within two of the entry's coinedYear",
      type: 'the candidate is an article, book, chapter, paper or report',
    },
    rows: out,
  }, null, 2)}\n`);
  const strong = out.filter((r) => r.candidates[0] && r.candidates[0].checks.author).length;
  console.log(`\n${out.length} entries probed; ${strong} have a top candidate whose author the entry names.`);
};

if (import.meta.url === `file://${process.argv[1]}`) main();
