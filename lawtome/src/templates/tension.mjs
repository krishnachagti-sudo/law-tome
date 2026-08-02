// "Laws in tension" — a whole-corpus view of the pairs that contradict each other.
//
// Built from build/relations.tensionPairs(laws). Each pair is shown as two
// facing panels (statement + reliability badge, each linking to its law page)
// with a "vs" divider. We deliberately do NOT author a per-pair "why they
// disagree" sentence — that would be fabrication. Letting the two statements sit
// side by side is the honest presentation: the corpus says they are in tension;
// the reader sees both claims and the tension speaks for itself.

import { head, sprite, header, footer, escapeHtml, reliabilityClass, personSlug, listFilter } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';
import { monogram } from './eponyms.mjs';

// The bucket for pairs whose two laws come from DIFFERENT fields. This was a
// literal NUL byte in the source, invisible in every tool that reads the file.
// It cost twice: once when it leaked into a category href, and again when a
// later edit compared against ' across' with a space and silently zeroed this
// page's own count. A sentinel you can see cannot do either, and no category
// key can collide with it.
const ACROSS = '__across__';

/**
 * @param {{a:object,b:object,kind:string}[]} pairs from tensionPairs().
 * @param {object} o
 * @param {string} [o.base='/'] site base path (must end with '/').
 * @param {string} [o.origin=''] absolute origin for canonical/JSON-LD.
 * @param {number|string} [o.count] published-law count for the masthead.
 */
export function tensionPage(pairs = [], { base = '/', origin = '', count, categories = {}, images, compareSlugs = {} } = {}) {
  const rows = Array.isArray(pairs) ? pairs : [];
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;

  // The same face treatment as /compare/: a disagreement between two people
  // should look like one.
  const people = (images && images.people) || {};
  // Portraits only in the circle — a diagram does not survive a 30px crop.
  const face = (law) => {
    const por = law.namedAfter ? people[personSlug(law.namedAfter)] : null;
    if (por) return `<img class="ten-face" src="${base}assets/img/people/${escapeHtml(por.slug)}.webp" alt="" loading="lazy" decoding="async">`;
    if (law.namedAfter) return `<span class="ten-face ten-face--none" aria-hidden="true">${escapeHtml(monogram(law.namedAfter))}</span>`;
    return '';
  };
  const side = (law) => {
    const badge = law.reliability
      ? `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span>`
      : '';
    const say = law.statement ? `<p class="ten-say">"${escapeHtml(law.statement)}"</p>` : '';
    return `      <a class="ten-side" href="${permalink(law.slug)}" data-c="${escapeHtml(law.category || '')}">
        <span class="ten-top"><span class="ten-no">№ ${escapeHtml(law.no)}</span>${badge}</span>
        <span class="ten-id">${face(law)}<span class="ten-name">${escapeHtml(law.name)}</span></span>
        ${say}
      </a>`;
  };

  // Every one of these pairs already has a page of its own comparing the two
  // field by field — it was reachable only from /compare/, so from here the
  // pair looked like a dead end. The divider is now the way in.
  const key = (p) => [p.a.slug, p.b.slug].sort().join('|');
  const pairCard = (p) => {
    const cs = compareSlugs[key(p)];
    const mid = cs
      ? `      <a class="ten-vs ten-vs--link" href="${base}compare/${escapeHtml(cs)}/" aria-label="Compare ${escapeHtml(p.a.name)} with ${escapeHtml(p.b.name)}"><span>vs</span><span class="ten-vs-cta">compare</span></a>`
      : '      <div class="ten-vs" aria-hidden="true"><span>vs</span></div>';
    return `    <div class="ten-pair" data-filter-row data-reveal>
${side(p.a)}
${mid}
${side(p.b)}
    </div>`;
  };

  // Group by field so 130+ pairs read as a set of scannable sections rather than
  // one unbroken wall. A pair is filed under the field both laws share, or
  // "Across fields" when they disagree from different disciplines — which is
  // itself the interesting cut. Ordered by size so the richest fields lead.
  const fieldKey = (p) => (p.a?.category && p.a.category === p.b?.category) ? p.a.category : ACROSS;
  const groups = new Map();
  for (const p of rows) {
    const k = fieldKey(p);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(p);
  }
  const ordered = [...groups.entries()].sort((x, y) =>
    (x[0] === ACROSS) - (y[0] === ACROSS) || y[1].length - x[1].length || x[0].localeCompare(y[0]));
  const label = (k) => k === ACROSS ? 'Across fields' : (categories[k] || k);
  const groupId = (k) => 'tn-' + String(label(k)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const body = rows.length
    ? ordered.map(([k, ps]) => `    <section class="ten-group" data-filter-group id="${groupId(k)}">
      <h2 class="ten-group-h">${categories[k] ? `<a href="${base}category/${escapeHtml(k)}/">${escapeHtml(label(k))}</a>` : escapeHtml(label(k))}<span class="ten-group-n">${ps.length}</span></h2>
      <div class="ten-grid">
${ps.map(pairCard).join('\n')}
      </div>
    </section>`).join('\n')
    : '<div class="empty">No opposing pairs yet.</div>';

  const jump = ordered.length > 1
    ? `    <nav class="az-nav" aria-label="Jump to field">
${ordered.map(([k, ps]) => `      <a href="#${groupId(k)}">${escapeHtml(label(k))} <span class="az-n">${ps.length}</span></a>`).join('\n')}
    </nav>
`
    : '';

  const across = groups.get(ACROSS) || [];
  const laws = new Set();
  for (const p of rows) { laws.add(p.a?.slug); laws.add(p.b?.slug); }
  const withinFields = ordered.filter(([k]) => k !== ACROSS).length;

  const answer = rows.length
    ? `The Law Tome marks ${rows.length} pairs of named laws as being in tension — ${laws.size} distinct laws whose advice contradicts another entry's. ${across.length} of those pairs disagree <a href="#${groupId(ACROSS)}">across different fields</a>; the rest are ${withinFields === 1 ? 'inside a single field' : `disagreements inside ${withinFields} individual fields`}.`
    : 'Named laws that contradict each other, shown side by side.';

  const lede = `Not every principle agrees with the others, and a collection that never says so is selling certainty it does not have. These are the pairs the corpus marks as pulling in opposite directions — one law's advice is the other's warning. There is deliberately no sentence here explaining away each clash: both statements sit side by side, with each law's <a href="${base}reliability/">reliability rating</a> visible, and you decide which one your situation calls for.`;

  const faq = hubFaq([
    {
      q: 'Which named laws contradict each other?',
      a: `${rows.length} pairs, involving ${laws.size} laws. ${rows.slice(0, 4).map((p) => `<a href="${permalink(p.a.slug)}">${escapeHtml(p.a.name)}</a> vs <a href="${permalink(p.b.slug)}">${escapeHtml(p.b.name)}</a>`).join('; ')} — and more above.`,
    },
    {
      q: 'Does a contradiction mean one of them is wrong?',
      a: 'Usually not. Most of these pairs are each right inside their own conditions and the tension is about where the boundary falls — which is the useful thing to know. Where a law really is disputed on the evidence, it is rated Contested and its page says who disputes it.',
    },
    {
      q: 'How is a tension decided?',
      a: 'It comes from the corpus\'s own relation data: each entry records which other entries it echoes and which it opposes, and opposing edges are reciprocal. This page is that set of edges, rendered.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Laws in tension',
    sub: `${rows.length} opposing ${rows.length === 1 ? 'pair' : 'pairs'}`,
    answer,
    lede,
    stats: [[rows.length, 'opposing pairs'], [laws.size, 'laws involved'], [across.length, 'across fields']],
    base,
  })}${rows.length ? listFilter({ target: 'ten-list', label: `Filter ${rows.length} pairs`, placeholder: 'Filter the pairs…', noun: 'pairs' }) : ''}${jump}    <div id="ten-list">
${body}
    </div>
${faq.html}${hubNav('tension/', { base })}  </div>
</section>
`;

  const description = rows.length
    ? `${rows.length} pairs of named laws that contradict each other — ${laws.size} principles pulling in opposite directions, shown side by side so you can weigh both.`
    : 'Named laws that contradict each other — the principles that pull in opposite directions, shown side by side so you can weigh both.';

  // CollectionPage listing each opposing pair's two members as an ItemList.
  const jsonld = [
    ...hubJsonLd({
      name: 'Laws in tension',
      description,
      path: 'tension/',
      items: rows.map((p) => ({ name: `${p.a.name} vs ${p.b.name}` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: 'Laws in Tension — Principles That Contradict Each Other | The Law Tome',
      description,
      base,
      origin,
      path: 'tension/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
