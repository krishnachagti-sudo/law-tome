// A field crossed with a period: /category/<field>/<century|decade>/.
//
// "20th century psychology laws" and "1970s economics" are how people ask, and
// the site could answer neither: the field page held two hundred entries across
// four centuries, the century page held five hundred and seventy-five across
// twenty fields, and the intersection — the smaller, sharper set the reader
// actually wanted — had no URL at all.
//
// Nothing new is authored. The page is the intersection of two sets the corpus
// already defines, stated in the terms the reader used to arrive.

import { head, sprite, header, footer, escapeHtml, figureStrip, listFilter } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd, setShape, setTensions } from './hub.mjs';

const num = (n) => Number(n).toLocaleString('en-US');
const fpPath = (fp) => `category/${fp.field}/${fp.period.slug}/`;

/**
 * @param {object} fp a row from build/periods.mjs fieldPeriods()
 * @param {object} o
 * @param {object[]} o.siblings the other periods of the same field, and the
 *   other fields of the same period — both are one click a reader will want
 */
export function fieldPeriodPage(fp, {
  base = '/', origin = '', count, images, categories = {}, compareSlugs = {},
  siblings = [], fieldTotal = 0, periodTotal = 0,
} = {}) {
  const laws = fp.laws;
  const total = laws.length;
  const label = categories[fp.field] || fp.field;
  const era = fp.period.label;
  const shape = setShape(laws, { base, categories });
  const years = laws.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y));
  const first = laws.slice().sort((a, b) => a.coinedYear - b.coinedYear)[0];
  const last = laws.slice().sort((a, b) => b.coinedYear - a.coinedYear)[0];
  const named = laws.filter((l) => l.namedAfter).length;

  const items = laws.slice()
    .sort((a, b) => (a.coinedYear - b.coinedYear) || String(a.name).localeCompare(String(b.name), 'en'))
    .map((l) => `        <a class="tl-item" data-filter-row href="${base}laws/${escapeHtml(l.slug)}/"><span class="tl-year">${escapeHtml(String(l.coinedYear))}</span><span class="tl-name">${escapeHtml(l.name)}</span></a>`)
    .join('\n');

  const otherEras = siblings.filter((s) => s.field === fp.field && s.slug !== fp.slug);
  const otherFields = siblings.filter((s) => s.period.slug === fp.period.slug && s.slug !== fp.slug);

  const band = (rows, heading, labelOf) => rows.length
    ? `    <nav class="fp-band" aria-label="${escapeHtml(heading)}">
      <h2 class="fp-band-h">${escapeHtml(heading)}</h2>
      <div class="fp-band-row">
${rows.map((s) => `        <a class="cy-chip" href="${base}${fpPath(s)}"><span>${escapeHtml(labelOf(s))}</span><b>${num(s.laws.length)}</b></a>`).join('\n')}
      </div>
    </nav>
`
    : '';

  const answer = `${num(total)} named laws, principles and effects in ${escapeHtml(label)} were coined in the ${escapeHtml(era)}${first && last && first !== last ? `, from ${escapeHtml(first.name)} in ${first.coinedYear} to ${escapeHtml(last.name)} in ${last.coinedYear}` : ''} — ${fieldTotal ? `${Math.round((total / fieldTotal) * 100)}% of everything this index holds in the field` : 'the field\'s work in that period'}${periodTotal ? `, and ${Math.round((total / periodTotal) * 100)}% of everything it holds from the period` : ''}.`;

  const lede = `The intersection of two sets: <a href="${base}category/${escapeHtml(fp.field)}/">${escapeHtml(label)}</a>${fieldTotal ? ` (${num(fieldTotal)} entries)` : ''} and <a href="${base}timeline/${escapeHtml(fp.period.slug)}/">the ${escapeHtml(era)}</a>${periodTotal ? ` (${num(periodTotal)} entries)` : ''}. The date is when the NAME was coined, not when the phenomenon began and not always when the work was done; entries whose coinage cannot be dated are in the field but in no period, so they are absent here rather than guessed into place.`;

  const faq = hubFaq([
    {
      q: `What ${label.toLowerCase()} laws come from the ${era}?`,
      a: `${num(total)} of them: ${laws.slice(0, 8).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a> (${l.coinedYear})`).join(', ')}${total > 8 ? `, and ${num(total - 8)} more, listed above in order` : ''}.`,
    },
    ...(first && last && first !== last ? [{
      q: `What was the earliest and latest of them?`,
      a: `Earliest: <a href="${base}laws/${escapeHtml(first.slug)}/">${escapeHtml(first.name)}</a>, ${first.coinedYear}. Latest: <a href="${base}laws/${escapeHtml(last.slug)}/">${escapeHtml(last.name)}</a>, ${last.coinedYear}.`,
    }] : []),
    ...(otherEras.length ? [{
      q: `How does the ${era} compare with other periods in ${label.toLowerCase()}?`,
      a: `${otherEras.map((s) => `<a href="${base}${fpPath(s)}">${escapeHtml(s.period.label)}</a> (${num(s.laws.length)})`).join(', ')}. Only periods holding at least ten entries get a page; the rest are on <a href="${base}category/${escapeHtml(fp.field)}/">the field page</a>.`,
    }] : []),
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: `${label} in the ${era}`,
    sub: `${num(total)} entries`,
    answer,
    lede,
    stats: [
      [num(total), 'entries'],
      [`${fp.period.from}–${fp.period.to}`, 'years'],
      ...(named ? [[num(named), 'named after someone']] : []),
    ],
    base,
    crumbs: [['browse/', 'Browse'], [`category/${fp.field}/`, label], ['timeline/', 'Timeline']],
  })}${figureStrip(images, laws, { base, limit: 10, min: 5 })}${shape.html}${listFilter({ target: 'fp-items', label: `Filter ${num(total)} entries`, placeholder: 'Filter these entries…', noun: 'entries' })}    <div class="tl-items" id="fp-items">
${items}
    </div>
${setTensions(laws, { base, compareSlugs, noun: 'set' })}${band(otherEras, `${label} in other periods`, (s) => s.period.label)}${band(otherFields, `Other fields in the ${era}`, (s) => categories[s.field] || s.field)}${faq.html}${hubNav('timeline/', { base })}  </div>
</section>
`;

  const description = `The ${num(total)} named laws, principles and effects in ${label} coined in the ${era}${years.length ? ` (${Math.min(...years)}–${Math.max(...years)})` : ''} — each dated, sourced and linked.`;

  const jsonld = [
    ...hubJsonLd({
        crumbs: [['browse/', 'Browse'], [`category/${fp.field}/`, label], ['timeline/', 'Timeline']],
      name: `${label} in the ${era}`,
      description,
      path: fpPath(fp),
      items: laws.slice(0, 100).map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return head({
    title: `${era} ${label} — ${num(total)} Named Laws | The Law Tome`,
    description, base, origin, path: fpPath(fp), jsonld,
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}
