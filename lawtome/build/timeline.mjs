// Group laws by the era they were coined (pure, no I/O).
//
// `coinedYear` is a number for most of the corpus; this buckets the laws by
// century so the index can be walked as a history of ideas. Entries with no
// usable year fall into a single "Undated" bucket shown last. Uses only existing
// data — no dates are invented.

/** Ordinal century label for a year: 1962 -> "20th century". */
function centuryLabel(century) {
  const suffix = (century % 10 === 1 && century % 100 !== 11) ? 'st'
    : (century % 10 === 2 && century % 100 !== 12) ? 'nd'
      : (century % 10 === 3 && century % 100 !== 13) ? 'rd' : 'th';
  return `${century}${suffix} century`;
}

function byYearThenName(a, b) {
  return (a.__y - b.__y) || String(a.name || '').localeCompare(String(b.name || ''), 'en');
}

/**
 * @param {object[]} laws corpus entries.
 * @returns {{key:string, label:string, from:number|null, laws:object[]}[]} eras
 *   in chronological order, each law tagged; an "Undated" era (from=null) last.
 */
export function eraGroups(laws = []) {
  const buckets = new Map(); // century number -> laws
  const undated = [];
  for (const l of Array.isArray(laws) ? laws : []) {
    const y = Number(l && l.coinedYear);
    if (!Number.isFinite(y) || y < 1) { undated.push({ ...l, __y: Infinity }); continue; }
    const century = Math.floor((y - 1) / 100) + 1;
    if (!buckets.has(century)) buckets.set(century, []);
    buckets.get(century).push({ ...l, __y: y });
  }
  const eras = [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([century, ls]) => ({
      key: `c${century}`,
      label: centuryLabel(century),
      from: (century - 1) * 100 + 1,
      laws: ls.sort(byYearThenName),
    }));
  if (undated.length) {
    eras.push({ key: 'undated', label: 'Undated', from: null, laws: undated.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'en')) });
  }
  return eras;
}
