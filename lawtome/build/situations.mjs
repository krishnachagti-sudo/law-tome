// Curated situation → law map (pure, no I/O).
//
// A "situation" is a plain-language description of a problem ("You set a target
// and people optimise the number instead of the goal") paired with the ONE law
// that names it (goodharts-law). It does two jobs:
//   1. search sharpening — the situation phrasing is folded into the target law's
//      search blob, so a user who types something close lands on the right law
//      (see build/search-index.buildSearchIndex, which takes situationsBySlug);
//   2. a visible reverse-lookup page (/situations/) — browse problems, not names.
// It fabricates nothing: every situation points at an existing, sourced entry.

/**
 * Resolve raw situation entries against the corpus, dropping any whose law slug
 * doesn't exist. Preserves authored order.
 * @param {object[]} raw [{situation, law: slug}].
 * @param {Object<string,object>} byslug corpus laws keyed by slug.
 * @returns {{situations: {situation:string, law:object}[], dropped: string[]}}
 */
export function resolveSituations(raw, byslug = {}) {
  const situations = [];
  const dropped = [];
  for (const s of Array.isArray(raw) ? raw : []) {
    if (!s || !s.situation || !s.law) continue;
    const law = byslug[s.law];
    if (law) situations.push({ situation: s.situation, law });
    else dropped.push(s.law);
  }
  return { situations, dropped };
}

/**
 * Group each situation's SEARCH text by law slug, for folding into the search
 * blob. The search text is the visible situation sentence plus any `cues` —
 * extra synonyms a user might type (metric, gamed, bikeshedding) that would read
 * awkwardly on the page. Cues sharpen matching without changing what's shown.
 * @param {object[]} raw [{situation, law: slug, cues?: string[]}].
 * @returns {Object<string,string[]>} slug -> [search text, ...].
 */
export function situationsBySlug(raw) {
  const map = {};
  for (const s of Array.isArray(raw) ? raw : []) {
    if (!s || !s.situation || !s.law) continue;
    const text = [s.situation, ...(Array.isArray(s.cues) ? s.cues : [])].join(' ');
    (map[s.law] || (map[s.law] = [])).push(text);
  }
  return map;
}
