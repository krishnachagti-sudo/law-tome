// Where the laws came from (/origins/) — the namesakes' birthplaces on a map.
//
// WHAT THIS IS AND IS NOT. A dot marks where a law's namesake was BORN. That
// is not where the idea was had, not where the work was done, and not the
// nationality of the thinking: Fermi was born in Rome and did his best-known
// work in Chicago. The page says so in its own lede rather than letting the
// map imply a claim the data does not support. What the map does show, and
// shows honestly, is the geography of who gets to have a law named after them
// — which is a fact about the history of science worth looking at directly.
//
// Coordinates come from Wikidata (P19 birthplace -> P625 coordinates) via
// build/fetch-facts.py; each one carries a source link. The coastline is
// Natural Earth 110m, public domain, inlined as a single path at build time
// (build/make-worldmap.py) so the page fetches nothing.

import { head, sprite, header, footer, escapeHtml, personSlug } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';
import { personId } from './eponyms.mjs';

/** Plate carree, the same two lines the map path was generated with. */
const px = (lon) => Math.round((Number(lon) + 180) * 10) / 10;
const py = (lat) => Math.round((90 - Number(lat)) * 10) / 10;

/** A stable id for a place, for the dot -> list-row anchor. */
function placeId(place) {
  return 'pl-' + String(place || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/**
 * @param {object[]} groups eponymGroups() output — [{person, laws}].
 * @param {object} facts    src/data/facts.json (reads facts._people[slug].origin).
 * @param {object} world    src/data/world-land.json — {path, viewBox}.
 */
export function originsPage(groups = [], { base = '/', origin = '', count, facts = {}, world = {} } = {}) {
  const rows = Array.isArray(groups) ? groups : [];
  const people = (facts && facts._people) || {};

  // Gather every namesake we have a birthplace for, folded together by place —
  // 30 people born in London should be one dot that says 30, not 30 dots.
  const byPlace = new Map();
  let located = 0;
  for (const g of rows) {
    const rec = people[personSlug(g.person)];
    const o = rec && rec.origin;
    if (!o || !Number.isFinite(Number(o.lat)) || !Number.isFinite(Number(o.lon))) continue;
    located++;
    const key = o.place;
    if (!byPlace.has(key)) {
      byPlace.set(key, { place: o.place, lat: Number(o.lat), lon: Number(o.lon), source: o.source, people: [] });
    }
    byPlace.get(key).people.push(g);
  }
  const places = [...byPlace.values()]
    .sort((a, b) => b.people.length - a.people.length || a.place.localeCompare(b.place, 'en'));
  const lawsAt = (p) => p.people.reduce((n, g) => n + g.laws.length, 0);
  const biggest = places[0];
  const maxN = biggest ? biggest.people.length : 1;

  // Radius by sqrt of the count, so a dot's AREA is proportional to the number
  // of people — the encoding a reader actually reads off a bubble map.
  const r = (n) => Math.round((1.1 + 2.6 * Math.sqrt(n / maxN)) * 10) / 10;

  // Big dots last so they never hide a small one underneath.
  const dots = places.slice().sort((a, b) => a.people.length - b.people.length).map((p) => {
    const n = p.people.length;
    const label = `${p.place} — ${n} ${n === 1 ? 'namesake' : 'namesakes'}`;
    return `        <a href="#${placeId(p.place)}" class="omap-dot"><circle cx="${px(p.lon)}" cy="${py(p.lat)}" r="${r(n)}"><title>${escapeHtml(label)}</title></circle></a>`;
  }).join('\n');

  const map = places.length
    ? `    <figure class="omap-wrap">
      <svg class="omap" viewBox="${escapeHtml(world.viewBox || '0 0 360 180')}" role="img"
           aria-label="World map. ${located} namesakes' birthplaces, in ${places.length} places.${biggest ? ` The largest is ${escapeHtml(biggest.place)}, with ${biggest.people.length}.` : ''}">
        <rect class="omap-sea" x="0" y="0" width="360" height="180"/>
        <g class="omap-grid" aria-hidden="true">
${[-60, -30, 0, 30, 60].map((lat) => `          <line x1="0" y1="${py(lat)}" x2="360" y2="${py(lat)}"${lat === 0 ? ' class="omap-eq"' : ''}/>`).join('\n')}
${[-120, -60, 0, 60, 120].map((lon) => `          <line x1="${px(lon)}" y1="0" x2="${px(lon)}" y2="180"/>`).join('\n')}
        </g>
        <path class="omap-land" d="${escapeHtml(world.path || '')}"/>
        <g class="omap-dots">
${dots}
        </g>
      </svg>
      <figcaption class="omap-cap">Birthplaces of ${located} namesakes, ${places.length} places. Equirectangular projection; coastline from <a href="https://www.naturalearthdata.com/">Natural Earth</a> (public domain). Dot area is proportional to the number of people born there.</figcaption>
    </figure>
`
    : '';

  // The ranked list. Every dot has a row, and every row names the people and
  // links their laws, so the map is never the only way to read the data (and
  // the page still works with images or SVG off).
  const list = places.length
    ? `    <div class="ori-list">
${places.map((p) => `      <section class="ori-place" id="${placeId(p.place)}">
        <h3 class="ori-place-h">${escapeHtml(p.place)}<span class="ori-n">${p.people.length} ${p.people.length === 1 ? 'namesake' : 'namesakes'} · ${lawsAt(p)} ${lawsAt(p) === 1 ? 'law' : 'laws'}</span></h3>
        <ul class="ori-people">
${p.people.map((g) => `          <li><a href="${base}named-after/#${escapeHtml(personId(g.person))}">${escapeHtml(g.person)}</a> <span class="ori-laws">${g.laws.map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join(', ')}</span></li>`).join('\n')}
        </ul>
      </section>`).join('\n')}
    </div>
`
    : '<div class="empty">No birthplaces harvested yet.</div>';

  const answer = located
    ? `${located} of the people with a law named after them have a birthplace on record, in ${places.length} different places${biggest ? `, most of them in ${escapeHtml(biggest.place)} (${biggest.people.length})` : ''}. This map plots those birthplaces — where the namesakes were born, which is a different question from where the ideas were had.`
    : 'A map of where the people with laws named after them were born.';

  const lede = `A dot here marks a <em>birthplace</em>, and only that. Fermi was born in Rome and did the work he is remembered for in Chicago; plenty of these people left as children and never went back. What the map is good for is the other question — who has historically been in a position to get a law named after them — and on that it is blunt, because the clustering is not subtle. Coordinates come from Wikidata and each place links to its source. The ${rows.length - located} namesakes with no confirmed birthplace are absent rather than approximated.`;

  const faq = hubFaq([
    {
      q: 'Where do most named laws come from?',
      a: places.length
        ? `By the birthplace of their namesake: ${places.slice(0, 6).map((p) => `<a href="#${placeId(p.place)}">${escapeHtml(p.place)}</a> (${p.people.length})`).join(', ')}. ${located} namesakes are placed in total, across ${places.length} places.`
        : 'No birthplaces are on record yet.',
    },
    {
      q: 'Does the birthplace tell you where the idea came from?',
      a: 'No, and the map should not be read that way. It records where a person was born, not where they studied, worked, or published. Each law\'s own page gives the actual origin of the idea and cites it.',
    },
    {
      q: 'Why is the map so lopsided?',
      a: 'Because the naming is. A law acquires a person\'s name through the institutions that publish and cite, and those have been concentrated in a small number of places for most of the period this index covers. The map shows that concentration rather than smoothing it out.',
    },
    {
      q: 'Where do the coordinates come from?',
      a: 'Wikidata — the namesake\'s birthplace (P19), then that place\'s coordinates (P625). Each place row links back to the source. Nothing is estimated: a namesake with no recorded birthplace simply does not appear.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Where the laws came from',
    sub: `${located} namesakes placed`,
    answer,
    lede,
    stats: [
      [located, 'birthplaces'],
      [places.length, 'places'],
      ...(biggest ? [[biggest.people.length, `most, in ${biggest.place}`]] : []),
      [rows.length - located, 'not placed'],
    ],
    base,
  })}${map}${list}
${faq.html}${hubNav('origins/', { base })}  </div>
</section>
`;

  const description = located
    ? `A map of where the ${located} namesakes behind these laws were born — ${places.length} places, most of them in ${biggest ? biggest.place : 'Europe'}. Birthplaces from Wikidata, each one sourced.`
    : 'A map of where the people with laws named after them were born.';

  const jsonld = [
    ...hubJsonLd({
      name: 'Where the laws came from',
      description,
      path: 'origins/',
      items: places.map((p) => ({ name: `${p.place} (${p.people.length})` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: 'Where Named Laws Came From — A Map of the Namesakes | The Law Tome',
      description,
      base,
      origin,
      path: 'origins/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
