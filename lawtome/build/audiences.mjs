// Audience ("for …") pages (pure, no I/O). Each audience is a persona-framed
// entry point onto the corpus — a curated shortlist of the laws that matter most
// to that reader, with copy that speaks to their problem. Like collections, but
// organised by WHO rather than by theme. Fabricates nothing: every law is an
// existing, sourced entry, and unknown slugs are dropped.

/**
 * Resolve each audience's slug list against the corpus.
 * @param {object[]} raw [{slug,title,who,problem,blurb,laws:[slug,...]}].
 * @param {Object<string,object>} byslug corpus laws keyed by slug.
 * @returns {{audiences: object[], dropped: string[]}} resolved audiences (laws as
 *   objects, curated order preserved; empty audiences skipped) and dropped slugs.
 */
export function resolveAudiences(raw, byslug = {}) {
  const out = [];
  const dropped = [];
  for (const a of Array.isArray(raw) ? raw : []) {
    if (!a || !a.slug) continue;
    const laws = [];
    const seen = new Set();
    for (const slug of Array.isArray(a.laws) ? a.laws : []) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      const law = byslug[slug];
      if (law) laws.push(law);
      else dropped.push(`${a.slug}: ${slug}`);
    }
    if (laws.length) out.push({ slug: a.slug, title: a.title, who: a.who, problem: a.problem, blurb: a.blurb, laws });
  }
  return { audiences: out, dropped };
}
