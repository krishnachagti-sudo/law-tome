// Group laws by the person they are named after (pure, no I/O).
//
// `namedAfter` is populated for the majority of the corpus; this turns it into a
// browsable axis — the eponym index — so a reader can find "Parkinson's laws" or
// see every principle Durkheim lent his name to. Uses only existing data.

// The A–Z key comes from the template, which also uses it for the letter
// headings and the avatar initial. Deriving it twice is how the page ended up
// sorting by one rule and labelling by another.
import { surnameKey } from '../src/templates/eponyms.mjs';

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
  // Carry the namesake's kind through. Every law sharing a namedAfter shares
  // its kind, so the first law that states one settles it; a group whose laws
  // are all silent gets no kind, which downstream must read as "unknown"
  // rather than "person" (see docs/CORPUS-SCHEMA.md).
  const groups = [...by.entries()].map(([person, ls]) => {
    const kind = (ls.find((l) => l.namesakeKind) || {}).namesakeKind;
    return { person, laws: ls.slice().sort((a, b) => byNo(a.no, b.no)), ...(kind ? { kind } : {}) };
  });
  groups.sort((a, b) => surnameKey(a.person).localeCompare(surnameKey(b.person), 'en')
    || a.person.localeCompare(b.person, 'en'));
  return groups;
}
