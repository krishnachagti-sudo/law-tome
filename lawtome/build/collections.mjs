// Curated collections (pure, no I/O). A collection is an editorial grouping of
// EXISTING corpus entries under a theme ("When incentives backfire", "The
// razors") with a short framing blurb. It fabricates nothing — it only orders
// and frames laws that are already defined and sourced — but it turns the flat
// index into themed, shareable, landing-quality pages built around how people
// actually search.

/**
 * Resolve each collection's slug list against the corpus, dropping any slug that
 * doesn't exist (so a typo can never ship a dead link) and any collection left
 * empty. Preserves the curated order of both collections and their members.
 * @param {object[]} collections raw entries [{slug,title,blurb,laws:[slug,...]}].
 * @param {Object<string,object>} byslug corpus law objects keyed by slug.
 * @returns {{collections: object[], dropped: string[]}} resolved collections
 *   (each with `laws` as resolved law objects) and a list of dropped "coll: slug".
 */
export function resolveCollections(collections, byslug = {}) {
  const out = [];
  const dropped = [];
  for (const c of Array.isArray(collections) ? collections : []) {
    if (!c || !c.slug) continue;
    const laws = [];
    const seen = new Set();
    for (const slug of Array.isArray(c.laws) ? c.laws : []) {
      if (seen.has(slug)) continue;      // de-dupe within a collection
      seen.add(slug);
      const law = byslug[slug];
      if (law) laws.push(law);
      else dropped.push(`${c.slug}: ${slug}`);
    }
    if (laws.length) out.push({ slug: c.slug, title: c.title, blurb: c.blurb, laws });
  }
  return { collections: out, dropped };
}
