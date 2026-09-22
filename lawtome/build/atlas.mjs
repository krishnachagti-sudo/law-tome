// Which laws here also have an entry in the Bias Atlas, and what it says.
//
// The Atlas is a sister index by the same author: 544 cognitive biases, each
// carrying what happened when the experiments behind it were repeated. 131 of
// its entries are also laws here.
//
// WHY THE PAIRING IS NOT COMPUTED HERE. It is inverted from the Atlas's own
// src/data/crosswalk.json rather than derived again from the two corpora. Two
// independent matchers would eventually disagree, and the way that failure
// shows up is the worst kind: a reader follows a link across, and the page
// they land on does not link back. One source of truth, inverted, cannot do
// that.
//
// The Atlas's rule, for the record, because it had to be strict. A name-to-name
// match is taken as-is. An alias match counts only when an alias THERE equals
// the canonical name HERE — never alias-to-alias, which paired its escalation
// of commitment with this site's sunk cost fallacy out of the shared phrase
// "throwing good money after bad", and which its own sunk-cost entry says is a
// different thing.
//
// WHAT THE PANEL IS FOR. The two sites ask different questions of the same
// idea, and saying so is more use than pretending the other does not exist.
// This index asks whether a named principle is dependable and answers on a
// four-tier reliability scale. The Atlas asks what happened when the claim was
// retested and answers with a replication verdict. Dunning-Kruger is rated
// Contested here and Mixed there, and those are not contradictory answers —
// they are answers to two questions.
//
// Regenerate with `npm run atlas` when either corpus changes.

import { readFileSync } from 'node:fs';

/** Where the Atlas is served. */
export const ATLAS_BASE = 'https://krishnachagti-sudo.github.io/biases/';

/**
 * Invert the Atlas's crosswalk into a map keyed by THIS site's slug.
 * @param {object} doc the Atlas's crosswalk.json
 * @param {object[]} laws this corpus, for checking the slug still exists
 */
export function invert(doc, laws) {
  const known = new Set(laws.map((l) => l.slug));
  const out = [];
  const seen = new Set();
  for (const p of doc.pairs || []) {
    const slug = p.tome && p.tome.slug;
    // A law that has since been renamed or removed here must not keep a panel
    // pointing at it. The Atlas cannot know that; this can.
    if (!slug || !known.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    out.push({
      slug,
      matchedBy: p.matchedBy,
      atlas: {
        slug: p.slug,
        name: p.name,
        no: p.no,
      },
    });
  }
  return out;
}

// ---- CLI: node build/atlas.mjs [--atlas <path to its repo root>] -----------
if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (k, d) => {
    const hit = process.argv.find((a) => a.startsWith(`--${k}=`));
    return hit ? hit.slice(k.length + 3) : d;
  };
  const atlasRoot = arg('atlas', '../../bias-atlas');
  let doc;
  try {
    doc = JSON.parse(readFileSync(`${atlasRoot}/src/data/crosswalk.json`, 'utf8'));
  } catch {
    console.error(`No Atlas crosswalk at ${atlasRoot}/src/data/crosswalk.json.`);
    console.error('Pass --atlas=<path to the bias-atlas repo>. src/data/atlas.json is left as it is.');
    process.exit(1);
  }

  const { loadCorpus } = await import('./corpus.mjs');
  const laws = await loadCorpus('src/data/laws');
  const pairs = invert(doc, laws);

  // The Atlas statement and verdict are NOT copied in. A panel here shows that
  // the other treatment exists and what question it answers; quoting its
  // verdict would put a figure on this page that this page cannot check, and
  // that goes stale silently the moment the Atlas revises an entry. The link
  // is the honest depth.
  process.stdout.write(`${JSON.stringify({
    _note: 'Laws that also have an entry in the Bias Atlas. Inverted from the Atlas\'s own crosswalk.json so the two sites cannot disagree about which pages are paired. Regenerate with `npm run atlas`.',
    base: ATLAS_BASE,
    counts: { pairs: pairs.length, ofLaws: laws.length },
    pairs,
  }, null, 1)}\n`);
  console.error(`${pairs.length} laws also in the Bias Atlas, of ${laws.length}.`);
}
