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
export function comparePairs(laws = []) {
  const rows = Array.isArray(laws) ? laws : [];
  const byslug = Object.fromEntries(rows.map((l) => [l.slug, l]));
  const seen = new Map();
  for (const a of rows) {
    if (!Array.isArray(a.related)) continue;
    for (const rel of a.related) {
      if (!rel) continue;
      const ten = isTensionKind(rel.kind), twin = isTwinKind(rel.kind);
      if (!ten && !twin) continue;
      const b = byslug[rel.slug];
      if (!b || b.slug === a.slug) continue;
      const key = [a.slug, b.slug].sort().join('|');
      const relation = ten ? 'tension' : 'near-twin';
      if (seen.has(key)) {
        if (relation === 'tension') seen.get(key).relation = 'tension';
        continue;
      }
      const [x, y] = byNo(a.no, b.no) <= 0 ? [a, b] : [b, a];
      seen.set(key, { a: x, b: y, relation, slug: `${x.slug}-vs-${y.slug}` });
    }
  }
  const pairs = [...seen.values()];
  pairs.sort((p, q) => byNo(p.a.no, q.a.no) || byNo(p.b.no, q.b.no));
  return pairs;
}
