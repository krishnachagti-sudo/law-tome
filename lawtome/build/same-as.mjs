// A law's `sameAs`, as a list (backlog D6).
//
// It was a single URL, but an entry can legitimately be the same thing as a
// Wikipedia article AND a Wikidata item AND a Stanford Encyclopedia entry, and
// a knowledge graph matches on any of them. The field now takes a string (all
// 1,112 existing values, unchanged) or an array; everything that reads it goes
// through here, so no reader can handle one shape and miss the other.

/** @returns {string[]} trimmed, non-empty, de-duplicated */
export function sameAsList(v) {
  const raw = Array.isArray(v) ? v : (v == null ? [] : [v]);
  const out = [];
  for (const x of raw) {
    const s = String(x ?? '').trim();
    if (s && !out.includes(s)) out.push(s);
  }
  return out;
}

/** For JSON-LD: one URL stays a string, as before; several become an array. */
export function sameAsLd(v) {
  const l = sameAsList(v);
  return l.length === 0 ? null : l.length === 1 ? l[0] : l;
}
