// Group laws by the person they are named after (pure, no I/O).
//
// `namedAfter` is populated for the majority of the corpus; this turns it into a
// browsable axis — the eponym index — so a reader can find "Parkinson's laws" or
// see every principle Durkheim lent his name to. Uses only existing data.

// Surname = last whitespace-separated token of the name, for A–Z sorting
// ("Cyril Northcote Parkinson" -> "parkinson"). Good enough for an index sort;
// the displayed name is always the full `namedAfter` string.
function surnameKey(person) {
  const parts = String(person || '').trim().split(/\s+/);
  return (parts[parts.length - 1] || '').toLowerCase();
}

function byNo(a, b) {
  return String(a == null ? '' : a).localeCompare(String(b == null ? '' : b), 'en', { numeric: true });
}

/**
 * @param {object[]} laws corpus entries.
 * @returns {{person:string, laws:object[]}[]} one group per distinct namedAfter,
 *   laws sorted by `no`, groups sorted A–Z by surname then full name.
 */
export function eponymGroups(laws = []) {
  const by = new Map();
  for (const l of Array.isArray(laws) ? laws : []) {
    const person = l && l.namedAfter != null ? String(l.namedAfter).trim() : '';
    // Skip empties and the "not named after a person" sentinels so they never
    // render as a bogus namesake (e.g. a person literally called "NONE").
    if (!person || /^(none|n\/a|na|-|—)$/i.test(person)) continue;
    if (!by.has(person)) by.set(person, []);
    by.get(person).push(l);
  }
  const groups = [...by.entries()].map(([person, ls]) => ({ person, laws: ls.slice().sort((a, b) => byNo(a.no, b.no)) }));
  groups.sort((a, b) => surnameKey(a.person).localeCompare(surnameKey(b.person), 'en')
    || a.person.localeCompare(b.person, 'en'));
  return groups;
}
