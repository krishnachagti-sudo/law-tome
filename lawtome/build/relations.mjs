// Cross-corpus relationship derivations (pure, no I/O).
//
// The law page already splits an entry's own `related[]` into kindred vs.
// "in tension" links. This module lifts that to the WHOLE corpus: it collects
// every law-vs-law tension edge into a deduplicated set of undirected pairs, so
// the site can offer a single "laws that contradict each other" view — the thing
// no flat A–Z list can give you. Nothing here is fabricated: a pair exists only
// when the corpus itself marks a tension edge between two real entries.

/** Does a relationship `kind` string denote opposition/tension? */
export function isTensionKind(kind = '') {
  return /tension|oppos|contra|against|versus|counter|rival/i.test(kind || '');
}

/** Does a `kind` denote a near-twin — two laws that are easily confused? */
export function isTwinKind(kind = '') {
  return /near-twin|twin|confus/i.test(kind || '');
}

// Compare two `no` values as zero-padded strings so ordering matches the
// corpus's own numeric sort ("088" < "103"); falls back to string compare.
function byNo(a, b) {
  return String(a == null ? '' : a).localeCompare(String(b == null ? '' : b), 'en', { numeric: true });
}

/**
 * Every distinct pair of laws joined by a tension edge, as UNDIRECTED pairs.
 * A tension marked in either direction (A lists B, or B lists A) yields one
 * pair; reciprocal edges collapse to a single entry. Pairs whose other endpoint
 * is not a real corpus slug are skipped (no dangling links).
 * @param {object[]} laws corpus entries (each with slug/no/name/related[]).
 * @returns {{a:object,b:object,kind:string}[]} pairs, each {a,b} ordered by `no`,
 *   the list ordered by the first member's `no`.
 */
export function tensionPairs(laws = []) {
  const rows = Array.isArray(laws) ? laws : [];
  const byslug = Object.fromEntries(rows.map((l) => [l.slug, l]));
  const seen = new Set();
  const pairs = [];
  for (const a of rows) {
    if (!Array.isArray(a.related)) continue;
    for (const rel of a.related) {
      if (!rel || !isTensionKind(rel.kind)) continue;
      const b = byslug[rel.slug];
      if (!b || b.slug === a.slug) continue;
      const key = [a.slug, b.slug].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      // Order the pair members by `no` for stable, corpus-consistent display.
      const [x, y] = byNo(a.no, b.no) <= 0 ? [a, b] : [b, a];
      pairs.push({ a: x, b: y, kind: rel.kind });
    }
  }
  pairs.sort((p, q) => byNo(p.a.no, q.a.no) || byNo(p.b.no, q.b.no));
  return pairs;
}

/**
 * Every distinct pair of laws worth a side-by-side "X vs Y" page: those the
 * corpus joins with a TENSION edge (they pull opposite ways) or a NEAR-TWIN
 * edge (they're easily confused). Undirected & deduped like tensionPairs. Each
 * pair carries a `relation` of 'tension' | 'near-twin' and a stable compare
 * `slug` ("<a>-vs-<b>", members ordered by `no`). Nothing is fabricated: a pair
 * exists only where the corpus itself marks such an edge between two real
 * entries. A pair marked both ways resolves deterministically to 'tension'
 * (the stronger claim).
 * @param {object[]} laws corpus entries (each with slug/no/name/related[]).
 * @returns {{a:object,b:object,relation:string,slug:string}[]}
 */
// Words too common in a law's name to make two laws confusable by sharing them:
// "The Second Law of Thermodynamics" and "Jensen's Inequality" are not a pair
// because both contain "law". Only the distinctive remainder counts.
const NAME_STOP = new Set([
  'the', 'of', 'a', 'an', 'and', 'in', 'for', 'on', 'to', 's',
  'law', 'laws', 'effect', 'principle', 'theorem', 'rule', 'paradox', 'problem',
  'model', 'theory', 'hypothesis', 'equation', 'curve', 'fallacy', 'bias',
]);

/** The distinctive words in a law's name. */
function nameTokens(name) {
  return new Set(
    String(name || '').toLowerCase().match(/[a-z']+/g)?.filter((w) => w.length > 2 && !NAME_STOP.has(w)) || [],
  );
}

/**
 * Whether a pair of laws is worth a comparison page on the evidence available.
 *
 * The corpus marks 163 pairs as opposed or near-twins and another ~1,229 as
 * merely kindred. Building a page for every kindred pair would be 1,229 thin
 * permutations of content that already exists — a doorway-page generator. So a
 * kindred pair has to earn its page on one of two pieces of evidence, both
 * checkable rather than judged:
 *
 *   1. NAMED IN THE PROSE. One entry's own meaning, mechanism, limits or
 *      misreadings text names the other law. An editor wrote that sentence
 *      because the two get tangled.
 *   2. A SHARED DISTINCTIVE NAME. Two different laws whose names share an
 *      uncommon word — Change Blindness and Inattentional Blindness, the
 *      Dictator Game and the Ultimatum Game, Hanlon's Razor and Hitchens's
 *      Razor. That IS what being mixed up looks like, and it is exactly the
 *      "X vs Y" a reader types.
 *
 * Mining the prose alone found twelve pairs across the whole corpus, so the
 * headroom that looked large from the edge count is mostly not there. Better to
 * publish sixty pages that answer a real question than twelve hundred that do
 * not.
 */
function kindredEarnsAPage(a, b, docFreq) {
  const named = ['meaning', 'mechanism', 'limits', 'misreadings'].some((f) =>
    (a[f] && String(a[f]).includes(b.name)) || (b[f] && String(b[f]).includes(a.name)));
  if (named) return 'named-in-prose';
  const ta = nameTokens(a.name);
  for (const w of nameTokens(b.name)) {
    // "Distinctive" = the word names few enough laws that sharing it is a
    // signal. Above that it is a genre word, not a collision.
    if (ta.has(w) && (docFreq.get(w) || 0) <= 6) return 'shared-name';
  }
  return '';
}

export function comparePairs(laws = []) {
  const rows = Array.isArray(laws) ? laws : [];
  const byslug = Object.fromEntries(rows.map((l) => [l.slug, l]));
  const docFreq = new Map();
  for (const l of rows) for (const w of nameTokens(l.name)) docFreq.set(w, (docFreq.get(w) || 0) + 1);

  const seen = new Map();
  const kindred = new Map();
  for (const a of rows) {
    if (!Array.isArray(a.related)) continue;
    for (const rel of a.related) {
      if (!rel) continue;
      const b = byslug[rel.slug];
      if (!b || b.slug === a.slug) continue;
      const key = [a.slug, b.slug].sort().join('|');
      const ten = isTensionKind(rel.kind), twin = isTwinKind(rel.kind);
      if (!ten && !twin) {
        // Hold kindred aside; a pair that is ALSO marked opposed or twin
        // somewhere else in the corpus must keep that stronger relation.
        if (!kindred.has(key)) kindred.set(key, [a, b]);
        continue;
      }
      const relation = ten ? 'tension' : 'near-twin';
      if (seen.has(key)) {
        if (relation === 'tension') seen.get(key).relation = 'tension';
        continue;
      }
      const [x, y] = byNo(a.no, b.no) <= 0 ? [a, b] : [b, a];
      seen.set(key, { a: x, b: y, relation, slug: `${x.slug}-vs-${y.slug}` });
    }
  }
  for (const [key, [a, b]] of kindred) {
    if (seen.has(key)) continue;
    const why = kindredEarnsAPage(a, b, docFreq);
    if (!why) continue;
    const [x, y] = byNo(a.no, b.no) <= 0 ? [a, b] : [b, a];
    seen.set(key, { a: x, b: y, relation: 'near-twin', evidence: why, slug: `${x.slug}-vs-${y.slug}` });
  }
  const pairs = [...seen.values()];
  pairs.sort((p, q) => byNo(p.a.no, q.a.no) || byNo(p.b.no, q.b.no));
  return pairs;
}
