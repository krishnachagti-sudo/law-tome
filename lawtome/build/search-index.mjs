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
 * @returns {{slug:string,no:string,name:string,aliases:string[],category:string,statement:string,blob:string}[]}
 */
export function buildSearchIndex(laws = []) {
  const rows = Array.isArray(laws) ? laws : [];
  return rows.map((l) => {
    const aliases = Array.isArray(l.aliases) ? l.aliases : [];
    const name = l.name ?? '';
    const statement = l.statement ?? '';
    const category = l.category ?? '';
    const blob = [name, ...aliases, statement, category].join(' ').toLowerCase();
    return { slug: l.slug, no: l.no, name, aliases, category, statement, blob };
  });
}

/** Tokenise a query: lowercase, split on whitespace, drop empties. */
export function tokenize(query) {
  return String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
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
  const scored = [];
  for (let i = 0; i < list.length; i++) {
    const score = rankRow(list[i], tokens);
    if (score > 0) scored.push({ row: list[i], score, i });
  }
  scored.sort((a, b) => b.score - a.score || a.i - b.i);
  return scored.map((s) => s.row);
}
