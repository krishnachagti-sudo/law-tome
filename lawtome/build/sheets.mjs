// One printable sheet per field (pure, no I/O).
//
// "Laws of UX" sells a poster and a card deck, and the reason that works is not
// design — it is that a reference you can pin above a desk gets consulted, and a
// website you have to remember to visit does not. This index has 1,116 entries
// and no artefact between one page and the whole book.
//
// A sheet is therefore deliberately SHORT. The temptation with a corpus this
// size is to print everything in a field, which produces eleven pages nobody
// pins anywhere. The cut is the best-known entries in that field, ranked by the
// same external print-frequency measure /best-known/ uses, so the selection is
// somebody else's count rather than our taste — and the sheet says so on its
// face, because "the twenty-four best-known" is a claim a reader can check and
// "the twenty-four most important" is one nobody can.

/** How many entries a sheet carries. Two sides of A4 at a readable size. */
export const SHEET_SIZE = 24;

/**
 * The smallest field worth its own sheet. Below this the sheet is mostly white
 * space and the field page already shows every entry it has, so a sheet adds a
 * URL and nothing else.
 */
export const SHEET_MIN = 8;

/**
 * Group the corpus into printable sheets, one per field.
 *
 * Entries with a fame measurement come first, in fame order. Entries without
 * one — roughly a third of the corpus has no usable n-gram — are appended in
 * corpus order rather than dropped, so a young field whose entries are all
 * unmeasured still gets a sheet instead of an empty one.
 *
 * @param {object[]} laws corpus entries
 * @param {{law:object}[]} ranked from bestKnown(), most-printed first
 * @param {Record<string,string>} categories slug -> display name
 * @param {object} [o]
 * @returns {{slug,title,laws,count,total,measured}[]} in display-name order
 */
export function sheets(laws = [], ranked = [], categories = {}, { size = SHEET_SIZE, min = SHEET_MIN } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const at = new Map((Array.isArray(ranked) ? ranked : []).map((r, i) => [r.law && r.law.slug, i]));

  const by = new Map();
  for (const l of rows) {
    if (!l || !l.category) continue;
    if (!by.has(l.category)) by.set(l.category, []);
    by.get(l.category).push(l);
  }

  return [...by.entries()]
    .filter(([, list]) => list.length >= min)
    .map(([slug, list]) => {
      const ordered = [...list].sort((a, b) => {
        const ia = at.has(a.slug) ? at.get(a.slug) : Infinity;
        const ib = at.has(b.slug) ? at.get(b.slug) : Infinity;
        if (ia !== ib) return ia - ib;
        return (Number(a.no) || 1e9) - (Number(b.no) || 1e9);
      });
      return {
        slug,
        title: categories[slug] || slug,
        laws: ordered.slice(0, size),
        count: Math.min(size, ordered.length),
        total: ordered.length,
        measured: ordered.filter((l) => at.has(l.slug)).length,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'en'));
}

/** Base-relative path for a sheet. */
export function sheetPath(sheet) {
  return `sheets/${sheet.slug}/`;
}
