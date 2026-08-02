// Task 10 — prebuilt search index (pure, no I/O).
//
// The build serialises buildSearchIndex(laws) to dist/search-index.json; the
// client (src/assets/search.js) fetches that JSON and runs searchRows() over it.
// Both the match/rank logic and the row shape live here so the Node test and the
// browser client describe the SAME behaviour (search.js re-implements searchRows
// in-browser but is kept behaviourally identical to the tested reference here).

/**
 * Build the client search index: one row per law with the display fields kept in
 * ORIGINAL case, plus a single lowercased `blob` used for substring matching.
 * `blob` = name + every alias + statement + category, joined by spaces, lowercased.
 * Pure function — no filesystem or network.
 * @param {object[]} laws
 * @returns {{slug:string,no:string,name:string,aliases:string[],category:string,statement:string,blob:string,reliability:string,rels:number}[]}
 */
// Words counting toward the concept keyword bag: >2 chars, splitting on any
// non-alphanumeric. (Mirrors the query-side token length used by contentTokens.)
function bagWords(s) {
  return String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
}

// Cap on concept keywords appended per law. The base blob (name/aliases/
// statement/category) is contiguous and unbounded; the concept bag is a
// DEDUPLICATED set of the most relevant extra words from `meaning` + example
// texts, capped so the client-fetched index stays lean (~2x the base gzip).
const CONCEPT_CAP = 35;

export function buildSearchIndex(laws = [], situationsBySlug = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const sitMap = situationsBySlug && typeof situationsBySlug === 'object' ? situationsBySlug : {};
  return rows.map((l) => {
    const aliases = Array.isArray(l.aliases) ? l.aliases : [];
    const name = l.name ?? '';
    const statement = l.statement ?? '';
    const category = l.category ?? '';
    // Base blob: the fields whose exact phrasing matters (names, the one-line
    // statement). Kept contiguous so multi-word substrings still work.
    //
    // Variant NAMES belong here rather than in the concept bag. "Mutational
    // meltdown" and "regressional Goodhart" are things people search for by
    // name, and the phrase has to survive intact for a multi-word match — the
    // concept bag would shred it into two capped, deduplicated words. The
    // variant TEXT stays out; only the names are search terms.
    const variantNames = Array.isArray(l.variants)
      ? l.variants.map((v) => (v && v.name) || '').filter(Boolean)
      : [];
    const base = [name, ...aliases, ...variantNames, statement, category].join(' ').toLowerCase();
    // Concept bag: so a search can find a law by the SITUATION it describes, not
    // just its name. Pull unique content words from `meaning` + example texts that
    // aren't already in the base and aren't stopwords, capped. This is what makes
    // "describe the feeling" work without bloating the index. `reliability` stays
    // OUT of the blob (it is a display-only badge), as does `whyItMatters` (its
    // vocabulary is the bulkiest and least discriminating).
    const baseWords = new Set(bagWords(base));
    const exText = Array.isArray(l.examples)
      ? l.examples.map((e) => (typeof e === 'string' ? e : [e && e.tag, e && e.text].filter(Boolean).join(' '))).join(' ')
      : '';
    // Curated situation phrases for this law go FIRST, so their words win the cap
    // over generic meaning/example vocabulary — a typed problem description lands
    // on the law an editor mapped it to.
    const sitText = (sitMap[l.slug] || []).join(' ');
    const concept = [];
    const seen = new Set();
    for (const w of bagWords(`${sitText} ${l.meaning ?? ''} ${exText}`)) {
      if (STOPWORDS.has(w) || baseWords.has(w) || seen.has(w)) continue;
      seen.add(w);
      concept.push(w);
      if (concept.length >= CONCEPT_CAP) break;
    }
    const blob = concept.length ? `${base} ${concept.join(' ')}` : base;
    // reliability + rels are DISPLAY-ONLY: the client card renders a reliability
    // badge and an "N related" line, matching the server-rendered browse card.
    // They are deliberately NOT part of the search `blob`.
    return {
      slug: l.slug, no: l.no, name, aliases, category, statement, blob,
      reliability: l.reliability ?? '',
      rels: Array.isArray(l.related) ? l.related.length : 0,
    };
  });
}

/** Tokenise a query: lowercase, split on whitespace, drop empties. */
export function tokenize(query) {
  return String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
}

// Function words carry no topic signal, so they are dropped before the
// descriptive-sentence fallback scores a query. Kept small and generic.
export const STOPWORDS = new Set(
  ('a an and or but so the of to in on at by for with without from as is are was were be been being it its this that these those i you we they he she them my your our their not no nor if then than too very just about into over under out up down do does did has have had will would can could should may might when where what which who whom how why get got make made keep kept feel felt your there here also more most some any each every')
    .split(/\s+/),
);

/**
 * Content tokens of a query: tokens that are >2 chars and not stopwords. These
 * are the words the descriptive-sentence fallback matches on.
 */
export function contentTokens(query) {
  return tokenize(query).filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Rank a single row against already-tokenised query tokens.
 *  -1  => no match (at least one token is absent from the blob)
 *   1  => matches, but only in the statement (weaker)
 *   2  => matches, and at least one token appears in name/aliases (stronger)
 * A row matches when EVERY token is a substring of `blob` (token-AND).
 */
export function rankRow(row, tokens) {
  if (!tokens.length) return -1;
  const nameBlob = [row.name, ...(Array.isArray(row.aliases) ? row.aliases : [])]
    .join(' ')
    .toLowerCase();
  let inName = false;
  for (const t of tokens) {
    if (!row.blob.includes(t)) return -1; // token-AND: one miss disqualifies the row
    if (nameBlob.includes(t)) inName = true;
  }
  return inName ? 2 : 1;
}

/**
 * Filter + rank rows for a query. Every token must be a substring of a row's blob
 * (token-AND). Name/alias hits rank above statement-only hits; ties keep the input
 * (corpus) order via a stable sort. Empty/whitespace query => [].
 */
export function searchRows(rows, query) {
  const list = Array.isArray(rows) ? rows : [];
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  // Phase 1 — token-AND (unchanged): the precise path for names and short
  // keyword queries. Every token must be a blob substring; name/alias hits win.
  const scored = [];
  for (let i = 0; i < list.length; i++) {
    const score = rankRow(list[i], tokens);
    if (score > 0) scored.push({ row: list[i], score, i });
  }
  if (scored.length) {
    scored.sort((a, b) => b.score - a.score || a.i - b.i);
    return scored.map((s) => s.row);
  }
  // Phase 2 — descriptive-sentence fallback: engaged ONLY when token-AND found
  // nothing AND the query reads like a described situation (>=4 content words).
  // This is what makes "describe the feeling" work: score each law by how many of
  // the query's content words appear anywhere in its blob (name/alias hits weigh
  // double), keep rows matching >=2, best first. Short/keyword queries never reach
  // here, so Phase-1 behaviour is preserved exactly.
  const content = contentTokens(query);
  if (content.length < 4) return [];
  const fuzzy = [];
  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    const nameBlob = [row.name, ...(Array.isArray(row.aliases) ? row.aliases : [])].join(' ').toLowerCase();
    let hits = 0, nameHits = 0;
    for (const t of content) {
      if (row.blob.includes(t)) { hits++; if (nameBlob.includes(t)) nameHits++; }
    }
    if (hits >= 2) fuzzy.push({ row, score: hits * 2 + nameHits, i });
  }
  fuzzy.sort((a, b) => b.score - a.score || a.i - b.i);
  return fuzzy.map((s) => s.row);
}
