// Group named laws by the country their namesake was born in (pure, no I/O).
//
// The birthplace map plots 486 dots and stops there. The question underneath it
// — "which named laws came out of Hungary" — has no page, no URL and no answer,
// though the data to answer it has been sitting in facts.json since the
// coordinates were harvested.
//
// The country comes from Wikidata's P17 on the birthplace item
// (build/fetch-origin-country.py), never from the coordinate: drawing a border
// ourselves would be inventing the fact the page is about. Two consequences the
// pages state plainly rather than smooth over:
//
//   * It is the country the place is in AS RECORDED, which for most places is
//     the modern one and for a handful is a historical state the item still
//     carries. Königsberg's laws are filed where Wikidata files Königsberg.
//   * A birthplace is not a nationality and not where the work was done. Fermi
//     was born in Rome and did his best-known work in Chicago.

import { personSlug } from '../src/templates/partials.mjs';

/** Below this a country page is a heading and two links. */
export const MIN_LAWS = 3;

/** "Czech Republic" -> "czech-republic". */
export function countrySlug(name) {
  return String(name || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** The path for a country page, base-relative. */
export function countryPath(slug) {
  return `origins/${slug}/`;
}

/**
 * Every country with a recorded birthplace, whether or not it earns a page.
 *
 * @param {object[]} laws corpus entries
 * @param {object} facts src/data/facts.json (reads facts._people[slug].origin)
 * @returns {{country:string, slug:string, qid:string, laws:object[],
 *   people:{person:string, laws:object[], place:string}[], places:object[]}[]}
 *   ordered by law count, then name.
 */
export function countryGroups(laws = [], facts = {}) {
  const people = (facts && facts._people) || {};
  const byCountry = new Map();
  for (const l of (Array.isArray(laws) ? laws : [])) {
    if (!l || !l.namedAfter) continue;
    // Only people. A law named after a factory or a gospel has no birthplace,
    // and the harvest only ever recorded coordinates for people anyway.
    if (l.namesakeKind && l.namesakeKind !== 'person') continue;
    const rec = people[personSlug(l.namedAfter)];
    const o = rec && rec.origin;
    if (!o || !o.country) continue;
    const key = o.country;
    if (!byCountry.has(key)) {
      byCountry.set(key, {
        country: key,
        slug: countrySlug(key),
        qid: o.countryQid || '',
        laws: [],
        byPerson: new Map(),
      });
    }
    const g = byCountry.get(key);
    g.laws.push(l);
    if (!g.byPerson.has(l.namedAfter)) {
      g.byPerson.set(l.namedAfter, { person: l.namedAfter, laws: [], place: o.place, source: o.source });
    }
    g.byPerson.get(l.namedAfter).laws.push(l);
  }
  const out = [];
  for (const g of byCountry.values()) {
    const peopleRows = [...g.byPerson.values()]
      .sort((a, b) => b.laws.length - a.laws.length || a.person.localeCompare(b.person, 'en'));
    const placeCounts = new Map();
    for (const p of peopleRows) placeCounts.set(p.place, (placeCounts.get(p.place) || 0) + 1);
    out.push({
      country: g.country,
      slug: g.slug,
      qid: g.qid,
      laws: g.laws.slice().sort((a, b) => String(a.name).localeCompare(String(b.name), 'en')),
      people: peopleRows,
      places: [...placeCounts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'en'))
        .map(([place, n]) => ({ place, n })),
    });
  }
  return out.sort((a, b) => b.laws.length - a.laws.length || a.country.localeCompare(b.country, 'en'));
}

/** The countries that earn a page of their own. */
export function countriesWithPages(groups = [], { min = MIN_LAWS } = {}) {
  return (Array.isArray(groups) ? groups : []).filter((g) => g.laws.length >= min);
}
