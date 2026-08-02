// A period of the index: one century, or one decade (/timeline/<slug>/).
//
// The timeline told the reader that 575 of these ideas were named in the
// twentieth century and then made them scroll through all of them in one
// column. A period is a set like any other set on this site — it has a shape,
// a busiest field, an argument or two inside it — and it deserves the same
// treatment the collections and fields got, plus the one thing only a period
// can offer: the decade next door.

import { head, sprite, header, footer, escapeHtml, figureStrip, listFilter } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd, setShape, setTensions, setAdjacent } from './hub.mjs';

// The period's own URL. One string, kept here rather than imported from the
// build layer so a template depends only on templates (build/periods.mjs owns
// the same path for the sitemap, and test/periods.test.mjs pins them equal).
const periodPath = (p) => `timeline/${p.slug}/`;
const num = (n) => Number(n).toLocaleString('en-US');

/** The years a period covers: "1901–2000", "1970–1979". */
const spanText = (p) => `${p.from}–${p.to}`;

/**
 * A bar per decade across a century, drawn from counts we already have.
 *
 * Deliberately not an SVG chart: the numbers are small, the labels matter more
 * than the shape, and a row of linked cells is navigable with a keyboard and
 * readable by a screen reader, which a bar chart is not.
 */
function decadeStrip(p, rows, { base }) {
  if (p.kind !== 'century' || !rows.length) return '';
  const peak = Math.max(1, ...rows.map((r) => r.count));
  const cells = rows.map((r) => {
    const h = Math.round((r.count / peak) * 100);
    const inner = `<span class="pd-bar" style="height:${Math.max(r.count ? 6 : 2, h)}%"></span><span class="pd-lab">${escapeHtml(r.label)}</span><span class="pd-n">${r.count || '—'}</span>`;
    return r.slug
      ? `        <a class="pd-cell pd-cell--link" href="${base}timeline/${escapeHtml(r.slug)}/">${inner}</a>`
      : `        <span class="pd-cell">${inner}</span>`;
  }).join('\n');
  const linked = rows.filter((r) => r.slug).length;
  return `    <section class="perdec">
      <h2>Decade by decade</h2>
      <p class="perdec-note">Every decade of the ${escapeHtml(p.label)}, by how many entries were named in it. ${linked ? `The ${linked} with enough entries to say something about ${linked === 1 ? 'has a page of its own' : 'have pages of their own'}; the rest are counted here and left at that.` : 'None holds enough entries for a page of its own.'}</p>
      <div class="pd-strip">
${cells}
      </div>
    </section>
`;
}

/** Previous and next period of the same kind, wherever there is one. */
function periodNav(p, siblings, { base }) {
  const same = siblings.filter((s) => s.kind === p.kind).sort((a, b) => a.from - b.from);
  const i = same.findIndex((s) => s.slug === p.slug);
  const prev = i > 0 ? same[i - 1] : null;
  const next = i >= 0 && i < same.length - 1 ? same[i + 1] : null;
  const parent = p.kind === 'decade'
    ? siblings.find((s) => s.kind === 'century' && s.century === p.century)
    : null;
  if (!prev && !next && !parent) return '';
  const link = (s, rel, label) => `        <a class="pnav-l" href="${base}${periodPath(s)}" rel="${rel}"><span class="pnav-k">${escapeHtml(label)}</span><span class="pnav-n">${escapeHtml(s.label)}</span><span class="pnav-c">${num(s.laws.length)} entries</span></a>`;
  return `    <nav class="pernav" aria-label="Nearby periods">
${[
    prev ? link(prev, 'prev', 'Before') : '',
    parent ? link(parent, 'up', 'Inside') : '',
    next ? link(next, 'next', 'After') : '',
  ].filter(Boolean).join('\n')}
    </nav>
`;
}

/**
 * @param {object} p a period from build/periods.mjs
 * @param {object} o
 * @param {object[]} o.siblings every period, for the prev/next/parent links
 * @param {object[]} o.decades decadesIn(century) rows, for the strip and its FAQ
 */
export function periodPage(p, {
  base = '/', origin = '', count, images, categories = {}, byslug = {},
  compareSlugs = {}, siblings = [], decades = [], fieldCrosses = [],
} = {}) {
  const laws = p.laws;
  const total = laws.length;
  const noun = p.kind === 'decade' ? 'decade' : 'century';
  const shape = setShape(laws, { base, categories });
  const topField = shape.fields[0];
  const years = laws.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y));
  const first = laws.find((l) => Number(l.coinedYear) === Math.min(...years));
  const last = laws.find((l) => Number(l.coinedYear) === Math.max(...years));
  const named = laws.filter((l) => l.namedAfter).length;

  const items = laws.map((l) => `        <a class="tl-item" data-filter-row href="${base}laws/${escapeHtml(l.slug)}/"><span class="tl-year">${escapeHtml(String(l.coinedYear))}</span><span class="tl-name">${escapeHtml(l.name)}</span></a>`).join('\n');

  const answer = `${num(total)} of the named laws, principles and effects in The Law Tome were coined in the ${escapeHtml(p.label)} (${spanText(p)})${topField ? `, most of them in ${escapeHtml(categories[topField[0]] || topField[0])} (${topField[1]})` : ''}${first && last && first !== last ? `, from ${escapeHtml(first.name)} in ${first.coinedYear} to ${escapeHtml(last.name)} in ${last.coinedYear}` : ''}.`;

  const lede = `Every entry here carries a date we could source, and the date is when the NAME was coined — not when the phenomenon started, and not always when the work behind it was done. ${named ? `${named} of the ${num(total)} are named after somebody.` : 'None of them is named after a person.'} Entries with no datable coinage are not in this ${noun}, or in any other; they sit undated on <a href="${base}timeline/">the timeline</a> rather than being placed by guesswork.`;

  const faq = hubFaq([
    {
      q: `What named laws come from the ${p.label}?`,
      a: `${num(total)} of them${topField ? `, led by ${escapeHtml(categories[topField[0]] || topField[0])} with ${topField[1]}` : ''}. ${laws.slice(0, 6).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a> (${l.coinedYear})`).join(', ')}${total > 6 ? `, and ${num(total - 6)} more, all listed above` : ''}.`,
    },
    {
      q: `What was the earliest of these?`,
      a: first ? `<a href="${base}laws/${escapeHtml(first.slug)}/">${escapeHtml(first.name)}</a>, dated ${first.coinedYear}. The latest in this ${noun} is <a href="${base}laws/${escapeHtml(last.slug)}/">${escapeHtml(last.name)}</a>, dated ${last.coinedYear}.` : 'None of these carries a usable date.',
    },
    {
      q: 'Does the date mean the idea was discovered then?',
      a: 'No. It records when the name attached, which is often years after the work and occasionally decades after the phenomenon was first described. Where the gap is notable, the entry\'s own page says so.',
    },
    ...(p.kind === 'century' ? [{
      q: `Which decade of the ${p.label} produced the most?`,
      a: (() => {
        const ds = decades.slice().sort((a, b) => b.count - a.count);
        const best = ds[0];
        if (!best || !best.count) return 'No decade in this century holds a dated entry.';
        return `The ${best.label}, with ${best.count}. ${ds.filter((d) => d.slug).length} decades of this century have an index of their own; the decade-by-decade counts are above.`;
      })(),
    }] : []),
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: `Named laws of the ${p.label}`,
    sub: `${num(total)} entries`,
    answer,
    lede,
    stats: [
      [num(total), 'entries'],
      [spanText(p), 'years'],
      ...(topField ? [[categories[topField[0]] || topField[0], 'busiest field']] : []),
      ...(named ? [[num(named), 'named after someone']] : []),
    ],
    base,
    crumbs: [['browse/', 'Browse'], ['timeline/', 'Timeline']],
  })}${figureStrip(images, laws, { base, limit: 12, min: 5 })}${shape.html}${decadeStrip(p, decades, { base })}    <h2 class="tl-eyebrow tl-eyebrow--period">In order${total > 1 ? `, ${first.coinedYear} to ${last.coinedYear}` : ''}<span class="tl-count">${num(total)}</span></h2>
${total > 24 ? listFilter({ target: 'per-items', label: `Filter ${num(total)} entries`, placeholder: 'Filter these entries…', noun: 'entries' }) : ''}      <div class="tl-items" id="per-items">
${items}
      </div>
${fieldCrosses.length ? `    <nav class="fp-band" aria-label="By field">
      <h2 class="fp-band-h">This ${escapeHtml(noun)}, one field at a time</h2>
      <div class="fp-band-row">
${fieldCrosses.map((c) => `        <a class="cy-chip" href="${base}category/${escapeHtml(c.field)}/${escapeHtml(p.slug)}/"><span>${escapeHtml(categories[c.field] || c.field)}</span><b>${num(c.laws.length)}</b></a>`).join('\n')}
      </div>
    </nav>
` : ''}${setTensions(laws, { base, compareSlugs, noun })}${setAdjacent(laws, { base, byslug, noun })}${periodNav(p, siblings, { base })}${faq.html}${hubNav('timeline/', { base })}  </div>
</section>
`;

  const description = `The ${num(total)} named laws, principles and effects coined in the ${p.label} (${spanText(p)})${topField ? `, led by ${categories[topField[0]] || topField[0]}` : ''} — each dated, sourced and linked.`;

  const jsonld = [
    ...hubJsonLd({
      name: `Named laws of the ${p.label}`,
      description,
      path: periodPath(p),
      items: laws.slice(0, 100).map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: `Named Laws of the ${p.label} — ${num(total)} Entries, ${spanText(p)} | The Law Tome`,
      description,
      base,
      origin,
      path: periodPath(p),
      jsonld,
    })
    + sprite()
    + header({ base, active: 'browse', count })
    + section
    + footer({ base })
  );
}
