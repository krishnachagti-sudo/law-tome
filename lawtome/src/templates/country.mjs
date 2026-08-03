// One country's named laws, by where the namesake was born (/origins/<slug>/).
//
// The map at /origins/ answers "where were these people born" with a picture.
// This answers it with a page you can link, quote and land on from a search for
// "German named laws" — the same data, addressable.
//
// The framing is doing real work here and the page never lets it slide: this is
// a birthplace, not a nationality, not a passport, and not where the thinking
// happened. Every page says so above the fold, because the reader who arrives
// from a search will otherwise read the list as a claim about nationhood.

import { head, sprite, header, footer, escapeHtml, figureStrip, personImage, portrait, listFilter } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd, setShape, setTensions, setAdjacent } from './hub.mjs';
import { personId, monogram } from './eponyms.mjs';

const num = (n) => Number(n).toLocaleString('en-US');
const countryPath = (slug) => `origins/${slug}/`;

/**
 * @param {object} g a group from build/countries.mjs
 * @param {object} o
 * @param {object[]} o.others the other countries with pages, for the footer band
 */
export function countryPage(g, {
  base = '/', origin = '', count, images, categories = {}, byslug = {},
  compareSlugs = {}, others = [], namesakeHrefs = {},
} = {}) {
  const laws = g.laws;
  const total = laws.length;
  const shape = setShape(laws, { base, categories });
  const topField = shape.fields[0];
  const years = laws.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y) && y >= 1);
  const span = years.length ? [Math.min(...years), Math.max(...years)] : null;
  const topPeople = g.people.filter((p) => p.laws.length > 1);
  const wikidata = g.qid ? `https://www.wikidata.org/wiki/${g.qid}` : '';

  const personRow = (p) => {
    const img = personImage(images, p.person);
    const href = namesakeHrefs[p.person];
    const nameCell = href
      ? `<a class="cy-pname" href="${escapeHtml(href)}">${escapeHtml(p.person)}</a>`
      : `<a class="cy-pname" href="${base}named-after/#${escapeHtml(personId(p.person))}">${escapeHtml(p.person)}</a>`;
    return `      <div class="cy-row" data-filter-row>
        <span class="cy-who">${img ? portrait(img, { base, small: true, alt: p.person }) : `<span class="ep-initial" aria-hidden="true">${escapeHtml(monogram(p.person))}</span>`}${nameCell}</span>
        <span class="cy-place">${escapeHtml(p.place || '')}</span>
        <span class="cy-laws">${p.laws.map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join('<span class="ep-dot">·</span>')}</span>
      </div>`;
  };

  const placeLine = g.places.length
    ? `    <p class="cy-places"><b>${g.places.length} ${g.places.length === 1 ? 'place' : 'places'}:</b> ${g.places.slice(0, 12).map((p) => `${escapeHtml(p.place)}${p.n > 1 ? ` (${p.n})` : ''}`).join(', ')}${g.places.length > 12 ? `, and ${g.places.length - 12} more` : ''}.</p>\n`
    : '';

  const answer = `${num(total)} named laws, principles and effects in The Law Tome are named after ${g.people.length === 1 ? 'someone' : `${g.people.length} people`} born in ${escapeHtml(g.country)}${topField ? `, most of them in ${escapeHtml(categories[topField[0]] || topField[0])} (${topField[1]})` : ''}${span ? `, named between ${span[0]} and ${span[1]}` : ''}.`;

  const lede = `Filed by <em>birthplace</em>, which is the one fact here with a source behind it. It is not nationality, not citizenship, and not where the work was done — several of these people left ${escapeHtml(g.country)} as children and did everything they are remembered for somewhere else. The country is the one Wikidata records for the birthplace itself${wikidata ? ` (<a href="${escapeHtml(wikidata)}">${escapeHtml(g.country)} on Wikidata</a>)` : ''}, so a place whose item still carries a historical state is filed under that state rather than being quietly modernised.`;

  const faq = hubFaq([
    {
      q: `What named laws come from ${g.country}?`,
      a: `${num(total)}, by the birthplace of the person each is named after${topField ? `, led by ${escapeHtml(categories[topField[0]] || topField[0])} with ${topField[1]}` : ''}: ${laws.slice(0, 8).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join(', ')}${total > 8 ? `, and ${num(total - 8)} more` : ''}.`,
    },
    {
      q: `Who are the namesakes born in ${g.country}?`,
      a: `${g.people.length} ${g.people.length === 1 ? 'person' : 'people'}${topPeople.length ? `, of whom ${topPeople.length} ${topPeople.length === 1 ? 'has' : 'have'} more than one law: ${topPeople.slice(0, 5).map((p) => `${escapeHtml(p.person)} (${p.laws.length})`).join(', ')}` : ''}. The full list, with the town each was born in, is above.`,
    },
    {
      q: 'Does this mean the law was discovered here?',
      a: `No. It means the person it is named after was born here. Where an idea was actually worked out, and by whom, is on the entry's own page — and the namesake is often not the discoverer either.`,
    },
    {
      q: 'Why are some countries missing?',
      a: `A namesake appears only where Wikidata records a birthplace, and a country gets a page of its own only once at least three entries land in it. Everyone with a recorded birthplace is on <a href="${base}origins/">the map</a> regardless.`,
    },
  ]);

  const band = others.length
    ? `    <nav class="cy-others" aria-label="Other countries">
      <h2 class="cy-others-h">Named laws from elsewhere</h2>
      <div class="cy-others-row">
${others.map((o) => `        <a class="cy-chip" href="${base}${countryPath(o.slug)}"><span>${escapeHtml(o.country)}</span><b>${num(o.laws.length)}</b></a>`).join('\n')}
      </div>
    </nav>
`
    : '';

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: `Named laws from ${g.country}`,
    sub: `${num(total)} entries`,
    answer,
    lede,
    stats: [
      [num(total), 'entries'],
      [g.people.length, g.people.length === 1 ? 'namesake' : 'namesakes'],
      [g.places.length, g.places.length === 1 ? 'birthplace' : 'birthplaces'],
      ...(span ? [[`${span[0]}–${span[1]}`, 'span']] : []),
    ],
    base,
    crumbs: [['browse/', 'Browse'], ['origins/', 'Where they came from']],
  })}${figureStrip(images, laws, { base, limit: 12, min: 5 })}${placeLine}${shape.html}    <h2 class="cy-h2">The namesakes</h2>
${g.people.length > 24 ? listFilter({ target: 'cy-list', label: `Filter ${g.people.length} namesakes`, placeholder: 'Filter by person, town or law…', noun: 'namesakes' }) : ''}    <div class="cy-list" id="cy-list">
${g.people.map(personRow).join('\n')}
    </div>
${setTensions(laws, { base, compareSlugs, noun: 'country' })}${setAdjacent(laws, { base, byslug, noun: 'country' })}${band}${faq.html}${hubNav('origins/', { base })}  </div>
</section>
`;

  const description = `${num(total)} named laws, principles and effects whose namesake was born in ${g.country} — ${g.people.length} people, ${g.places.length} birthplaces, each sourced to Wikidata.`;

  const jsonld = [
    ...hubJsonLd({
        crumbs: [['browse/', 'Browse'], ['origins/', 'Where they came from']],
      name: `Named laws from ${g.country}`,
      description,
      path: countryPath(g.slug),
      items: laws.slice(0, 100).map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: `Named Laws from ${g.country} — ${num(total)} Entries by Birthplace | The Law Tome`,
      description,
      base,
      origin,
      path: countryPath(g.slug),
      jsonld,
    })
    + sprite()
    + header({ base, active: 'browse', count })
    + section
    + footer({ base })
  );
}
