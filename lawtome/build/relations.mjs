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
