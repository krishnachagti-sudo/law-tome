// Periods of the index: centuries and decades (pure, no I/O).
//
// /timeline/ groups the corpus by century, but only as sections of one long
// page. A reader who wants "the laws coined in the 1970s" — a real thing to
// want, and a real thing people type — has nowhere to land, and nothing to
// link. This turns the same `coinedYear` data into addressable periods.
//
// Two rules keep it honest:
//   * Nothing is bucketed that isn't dated. An entry with no coinedYear stays
//     out of every period rather than being guessed into one.
//   * A decade earns a page only once it holds enough entries to say anything
//     about. Below that the page would be a heading and three links, which is
//     the thin-page problem we spent this week removing.

/** Below this, a decade is a heading with nothing under it. */
export const MIN_DECADE = 10;

/** Ordinal century label: 20 -> "20th century". */
export function centuryLabel(c) {
  const suffix = (c % 10 === 1 && c % 100 !== 11) ? 'st'
    : (c % 10 === 2 && c % 100 !== 12) ? 'nd'
      : (c % 10 === 3 && c % 100 !== 13) ? 'rd' : 'th';
  return `${c}${suffix} century`;
}

/** The URL slug for a century page: 20 -> "20th-century". */
export function centurySlug(c) {
  return centuryLabel(c).replace(/\s+/g, '-');
}

/** The decade a year falls in: 1974 -> 1970. */
export function decadeOf(year) {
  return Math.floor(Number(year) / 10) * 10;
}

function dated(laws) {
  const out = [];
  for (const l of (Array.isArray(laws) ? laws : [])) {
    const y = Number(l && l.coinedYear);
    if (Number.isFinite(y) && y >= 1) out.push({ law: l, year: y });
  }
  return out;
}

function byYearThenName(a, b) {
  return (Number(a.coinedYear) - Number(b.coinedYear))
    || String(a.name || '').localeCompare(String(b.name || ''), 'en');
}

/**
 * Every period that earns a page, in chronological order.
 *
 * @param {object[]} laws corpus entries
 * @param {object} [o]
 * @param {number} [o.minDecade] threshold for a decade page
 * @returns {{kind:string, slug:string, label:string, from:number, to:number,
 *   century:number, decade:(number|null), laws:object[]}[]}
 */
export function periods(laws = [], { minDecade = MIN_DECADE } = {}) {
  const rows = dated(laws);
  const cents = new Map();
  const decs = new Map();
  for (const { law, year } of rows) {
    const c = Math.floor((year - 1) / 100) + 1;
    const d = decadeOf(year);
    if (!cents.has(c)) cents.set(c, []);
    cents.get(c).push(law);
    if (!decs.has(d)) decs.set(d, []);
    decs.get(d).push(law);
  }
  const out = [];
  for (const [c, ls] of cents) {
    out.push({
      kind: 'century',
      slug: centurySlug(c),
      label: centuryLabel(c),
      from: (c - 1) * 100 + 1,
      to: c * 100,
      century: c,
      decade: null,
      laws: ls.slice().sort(byYearThenName),
    });
  }
  for (const [d, ls] of decs) {
    if (ls.length < minDecade) continue;
    out.push({
      kind: 'decade',
      slug: `${d}s`,
      label: `${d}s`,
      from: d,
      to: d + 9,
      century: Math.floor((d + 9 - 1) / 100) + 1,
      decade: d,
      laws: ls.slice().sort(byYearThenName),
    });
  }
  // Chronological by first year. Centuries begin at X01 and decades at X00, so
  // the two never tie and no tie-break rule is needed.
  return out.sort((a, b) => a.from - b.from);
}

/** The path for a period page, base-relative. */
export function periodPath(p) {
  return `timeline/${p.slug}/`;
}

/**
 * Every decade inside a century, whether or not it earned a page.
 *
 * The century page shows the shape of its own hundred years, so it needs the
 * empty and near-empty decades too — a run of quiet decades before the 1950s is
 * the fact the page is there to show. `href` is null where there is no page.
 */
export function decadesIn(century, laws = [], { minDecade = MIN_DECADE } = {}) {
  const counts = new Map();
  for (const { law, year } of dated(laws)) {
    const c = Math.floor((year - 1) / 100) + 1;
    if (c !== century) continue;
    const d = decadeOf(year);
    counts.set(d, (counts.get(d) || 0) + 1);
    void law;
  }
  const start = (century - 1) * 100;
  const out = [];
  for (let d = start; d < start + 100; d += 10) {
    const n = counts.get(d) || 0;
    out.push({ decade: d, label: `${d}s`, count: n, slug: n >= minDecade ? `${d}s` : null });
  }
  return out;
}

/**
 * A field crossed with a period: "20th-century psychology", "the 1970s in
 * economics".
 *
 * This is the cut people actually ask for and the one axis the site could not
 * address: /category/psychology/ holds 200 entries spanning four centuries and
 * /timeline/20th-century/ holds 575 across twenty fields, but the intersection
 * — which is a smaller, more useful, more searchable set than either — had no
 * URL. Same thresholds as everywhere else: a bucket earns a page only when it
 * holds enough entries to say something about.
 *
 * @returns {{field:string, period:object, slug:string, laws:object[]}[]}
 */
export function fieldPeriods(laws = [], { min = 10, minDecade = MIN_DECADE } = {}) {
  const all = periods(laws, { minDecade });
  const out = [];
  for (const p of all) {
    const byField = new Map();
    for (const l of p.laws) {
      if (!l.category) continue;
      if (!byField.has(l.category)) byField.set(l.category, []);
      byField.get(l.category).push(l);
    }
    for (const [field, ls] of byField) {
      if (ls.length < min) continue;
      out.push({ field, period: p, slug: `${field}/${p.slug}`, laws: ls });
    }
  }
  return out.sort((a, b) => a.field.localeCompare(b.field) || a.period.from - b.period.from);
}

/** The path for a field-period page, base-relative. */
export function fieldPeriodPath(fp) {
  return `category/${fp.field}/${fp.period.slug}/`;
}
