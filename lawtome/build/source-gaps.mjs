// Which entries are citing Wikipedia where they should be citing the paper.
//
// This site's stated differentiator against Wikipedia is that it sources its
// claims. 1,148 of 2,362 sources currently point AT Wikipedia and only 430 are
// marked primary. That is the most attackable fact about the project and the
// first thing a hostile reader will find.
//
// Fixing it is slow — every replacement is a citation that has to be verified,
// which is hours of work, not minutes. So this exists to make the job tractable
// and resumable rather than heroic: it ranks the entries that most need a
// primary source by how well known they are, so the work can be done top-down
// over many sittings and its progress measured rather than guessed at.
//
//   node build/source-gaps.mjs          # the worst 60, by fame
//   node build/source-gaps.mjs --all    # every entry with no primary source
//   node build/source-gaps.mjs --stats  # just the ratios, for tracking progress

import { readFile } from 'node:fs/promises';
import { loadCorpus } from './corpus.mjs';
import { bestKnown } from '../src/templates/bestknown.mjs';

const isWiki = (s) => /wikipedia\.org/i.test((s && s.url) || '');
const isPrimary = (s) => s && s.type === 'primary';

/**
 * Source-quality counts for the whole corpus.
 * @param {object[]} laws
 */
export function sourceStats(laws = []) {
  let sources = 0;
  let wiki = 0;
  let primary = 0;
  let noPrimary = 0;
  let wikiOnly = 0;
  for (const l of laws) {
    const s = Array.isArray(l.sources) ? l.sources : [];
    sources += s.length;
    wiki += s.filter(isWiki).length;
    primary += s.filter(isPrimary).length;
    if (!s.some(isPrimary)) noPrimary += 1;
    if (s.length && s.every(isWiki)) wikiOnly += 1;
  }
  return {
    entries: laws.length,
    sources,
    wiki,
    primary,
    noPrimary,
    wikiOnly,
    wikiShare: sources ? wiki / sources : 0,
    primaryShare: sources ? primary / sources : 0,
  };
}

/**
 * Entries with no primary source, most-printed first — the order the work is
 * worth doing in, because a missing citation on a famous entry is seen and a
 * missing citation on an obscure one is not.
 */
export function gaps(laws = [], ranked = []) {
  const at = new Map(ranked.map((r, i) => [r.law && r.law.slug, i]));
  return laws
    .filter((l) => !(Array.isArray(l.sources) ? l.sources : []).some(isPrimary))
    .map((l) => ({
      slug: l.slug,
      name: l.name,
      rank: at.has(l.slug) ? at.get(l.slug) + 1 : Infinity,
      sources: (l.sources || []).length,
      wiki: (l.sources || []).filter(isWiki).length,
    }))
    .sort((a, b) => a.rank - b.rank);
}

const main = async () => {
  const laws = await loadCorpus('src/data/laws');
  let facts = {};
  try { facts = JSON.parse(await readFile('src/data/facts.json', 'utf8')); } catch { /* optional */ }
  const st = sourceStats(laws);
  const pc = (v) => `${Math.round(v * 100)}%`;

  console.log(`${st.entries} entries, ${st.sources} sources`);
  console.log(`  point at Wikipedia   ${st.wiki} (${pc(st.wikiShare)})`);
  console.log(`  marked primary       ${st.primary} (${pc(st.primaryShare)})`);
  console.log(`  entries with NO primary source   ${st.noPrimary}`);
  console.log(`  entries citing ONLY Wikipedia    ${st.wikiOnly}`);
  if (process.argv.includes('--stats')) return;

  const rows = gaps(laws, bestKnown(laws, facts));
  const show = process.argv.includes('--all') ? rows : rows.slice(0, 60);
  console.log(`\nno primary source, best-known first (${show.length} of ${rows.length}):`);
  for (const r of show) {
    const rank = r.rank === Infinity ? '  —' : String(r.rank).padStart(3);
    console.log(`  #${rank}  ${r.slug.padEnd(40)} ${r.sources} src, ${r.wiki} wiki`);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) main();
