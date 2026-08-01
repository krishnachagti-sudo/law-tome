// "X vs Y" comparison pages — one per pair of laws the corpus marks as a
// near-twin (easily confused) or in tension (pulling opposite ways). These are
// the queries people type directly ("Occam's razor vs Hanlon's razor",
// "Type I vs Type II error"), so each pair earns its own indexable page.
//
// ANTI-FABRICATION: a compare page invents nothing. It recombines each law's
// own verified fields (statement, meaning, reliability, coined year, eponym)
// and lets the two sit side by side. We deliberately do NOT author a "here's
// the difference" sentence — that would be fabrication. The honest presentation
// is both claims, laid out, for the reader to weigh.

import { head, sprite, header, footer, escapeHtml, reliabilityClass, reliabilitySlug } from './partials.mjs';
import { eraId, centuryLabelForYear } from './timeline.mjs';
import { personId } from './eponyms.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const FRAMING = {
  'near-twin': {
    eyebrow: 'Often confused',
    lede: 'These two are easy to mix up. Here is what each one actually claims — side by side — so you can tell them apart.',
  },
  tension: {
    eyebrow: 'In tension',
    lede: 'These two pull in opposite directions: one law’s advice is the other’s warning. Both claims are laid out side by side, so which one your situation calls for is yours to judge.',
  },
};

function provenanceLabel(p) {
  if (p === 'coined') return 'Coined term';
  if (p === 'canon') return 'Established';
  return '—';
}

/**
 * @param {{a:object,b:object,relation:string,slug:string}} pair from comparePairs().
 * @param {object} o
 * @param {string} [o.base='/'] site base (trailing slash).
 * @param {string} [o.origin=''] absolute origin for canonical/JSON-LD.
 * @param {object} [o.categories] category key -> label map.
 * @param {number|string} [o.count] published-law count for the masthead.
 */
export function comparePage(pair, { base = '/', origin = '', categories = {}, count } = {}) {
  const { a, b, relation, slug } = pair;
  const frame = FRAMING[relation] || FRAMING['near-twin'];
  const permalink = (s) => `${base}laws/${escapeHtml(s)}/`;
  const catLabel = (c) => escapeHtml((categories && categories[c]) || c || '—');
  // Every fact in the comparison table names a browsable facet — field, tier,
  // century, namesake — so each cell links into it rather than sitting inert.
  const catCell = (c) => c
    ? `<a href="${base}category/${escapeHtml(c)}/">${catLabel(c)}</a>`
    : '—';
  const tierCell = (r) => r
    ? `<a href="${base}reliability/${reliabilitySlug(r)}/">${escapeHtml(r)}</a>`
    : '—';
  const yearCell = (y) => {
    if (!y) return '—';
    const era = centuryLabelForYear(y);
    return `<a href="${base}timeline/${era ? `#${eraId(era)}` : ''}">${escapeHtml(String(y))}</a>`;
  };
  const personCell = (p) => p
    ? `<a href="${base}named-after/#${escapeHtml(personId(p))}">${escapeHtml(p)}</a>`
    : '—';
  const typeCell = (law) => law.provenance === 'coined'
    ? `<a href="${base}coined/">${provenanceLabel(law.provenance)}</a>`
    : provenanceLabel(law.provenance);

  const panel = (law) => {
    const badge = law.reliability
      ? `<a class="badge ${reliabilityClass(law.reliability)}" href="${base}reliability/${reliabilitySlug(law.reliability)}/">${escapeHtml(law.reliability)}</a>`
      : '';
    const stmt = law.statement ? `<p class="cmp-stmt"><q>${escapeHtml(law.statement)}</q></p>` : '';
    const mean = law.meaning ? `<p class="cmp-mean">${escapeHtml(law.meaning)}</p>` : '';
    return `      <article class="cmp-col">
        <div class="cmp-col-top">
          <a class="cmp-name" href="${permalink(law.slug)}">${escapeHtml(law.name)}</a>
          ${badge}
        </div>
        <span class="cmp-cat">${catCell(law.category)}</span>
${stmt}
${mean}
        <a class="cmp-read" href="${permalink(law.slug)}">Read the full law <span aria-hidden="true">→</span></a>
      </article>`;
  };

  // "At a glance" — pure structured facts, the kind of table answer engines lift.
  const row = (label, av, bv) =>
    `        <tr><th scope="row">${label}</th><td>${av}</td><td>${bv}</td></tr>`;
  const table = `      <div class="cmp-table-wrap">
    <table class="cmp-table">
      <caption class="sr-only">${escapeHtml(a.name)} compared with ${escapeHtml(b.name)}</caption>
      <thead><tr><th scope="col"><span class="sr-only">Attribute</span></th><th scope="col">${escapeHtml(a.name)}</th><th scope="col">${escapeHtml(b.name)}</th></tr></thead>
      <tbody>
${row('Field', catCell(a.category), catCell(b.category))}
${row('Reliability', tierCell(a.reliability), tierCell(b.reliability))}
${row('Coined', yearCell(a.coinedYear), yearCell(b.coinedYear))}
${row('Named after', personCell(a.namedAfter), personCell(b.namedAfter))}
${row('Type', typeCell(a), typeCell(b))}
      </tbody>
    </table>
      </div>`;

  const section = `<section class="sec cmp" id="index">
  <div class="wrap">
    <nav class="cmp-crumb" aria-label="Breadcrumb"><a href="${base}compare/">Comparisons</a> <span aria-hidden="true">/</span> ${escapeHtml(a.name)} vs ${escapeHtml(b.name)}</nav>
    <div class="cmp-head">
      <span class="cmp-eyebrow">${frame.eyebrow}</span>
      <h1>${escapeHtml(a.name)} <span class="cmp-vs">vs</span> ${escapeHtml(b.name)}</h1>
      <p class="cmp-lede">${frame.lede}</p>
    </div>
    <div class="cmp-cols">
${panel(a)}
      <div class="cmp-mid" aria-hidden="true"><span>vs</span></div>
${panel(b)}
    </div>
${table}
    <div class="cmp-foot">
      <a class="btn ghost" href="${base}compare/">All comparisons</a>
      <a class="btn ghost" href="${base}graph/">See the graph</a>
    </div>
  </div>
</section>
`;

  const description =
    `${a.name} vs ${b.name}: how the two compare — what each one claims, who coined it, and how reliable it is, side by side. From The Law Tome.`;
  const abs = (s) => `${origin}${base}laws/${s}/`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${a.name} vs ${b.name}`,
      url: `${origin}${base}compare/${slug}/`,
      description,
      isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
      about: [
        { '@type': 'DefinedTerm', name: a.name, url: abs(a.slug) },
        { '@type': 'DefinedTerm', name: b.name, url: abs(b.slug) },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Comparisons', item: `${origin}${base}compare/` },
        { '@type': 'ListItem', position: 2, name: `${a.name} vs ${b.name}` },
      ],
    },
  ];

  return (
    head({
      title: `${a.name} vs ${b.name} — What’s the Difference? | The Law Tome`,
      description,
      base,
      origin,
      path: `compare/${slug}/`,
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}

/**
 * The /compare/ hub — every comparison, grouped by relation, as an internal-link
 * spine that makes each pair page discoverable (and captures "compare laws"
 * style queries in its own right).
 * @param {{a:object,b:object,relation:string,slug:string}[]} pairs
 */
export function compareHubPage(pairs = [], { base = '/', origin = '', count } = {}) {
  const rows = Array.isArray(pairs) ? pairs : [];
  const twins = rows.filter((p) => p.relation === 'near-twin');
  const tensions = rows.filter((p) => p.relation === 'tension');

  const item = (p) => `        <li class="cmp-hub-item"><a href="${base}compare/${escapeHtml(p.slug)}/"><span class="cmp-hub-a">${escapeHtml(p.a.name)}</span><span class="cmp-hub-vs">vs</span><span class="cmp-hub-b">${escapeHtml(p.b.name)}</span></a></li>`;
  const group = (title, blurb, list) => list.length
    ? `    <div class="cmp-hub-group">
      <h2>${title} <span class="cmp-hub-n">${list.length}</span></h2>
      <p class="cmp-hub-blurb">${blurb}</p>
      <ul class="cmp-hub-list">
${list.map(item).join('\n')}
      </ul>
    </div>`
    : '';

  const answer = rows.length
    ? `There are ${rows.length} side-by-side comparison pages here: ${twins.length} pairs of near-twins that readers routinely mistake for each other, and ${tensions.length} pairs that pull in opposite directions. Each page sets out both laws' claims, reliability ratings, dates and namesakes in one table.`
    : 'Side-by-side comparisons of the named laws people confuse with each other.';

  const lede = `"X vs Y" is how people actually search for these, because the confusion is the question. Every comparison below is built from the two entries' own fields — no page here authors a "the difference is…" sentence, since deciding which one your case falls under is the reader's job and inventing the verdict would be inventing a fact. See also <a href="${base}tension/">every opposing pair at once</a>.`;

  const faq = hubFaq([
    {
      q: 'Which named laws get confused with each other?',
      a: twins.length
        ? `${twins.length} pairs on this site. The most searched are ${twins.slice(0, 5).map((p) => `<a href="${base}compare/${escapeHtml(p.slug)}/">${escapeHtml(p.a.name)} vs ${escapeHtml(p.b.name)}</a>`).join(', ')}.`
        : 'None are currently marked as near-twins.',
    },
    {
      q: 'What does a comparison page show?',
      a: 'Both laws\' statements and plain-English meanings side by side, then an at-a-glance table of field, reliability tier, year coined, namesake and whether the term is established or coined — every cell linking to that facet so you can keep browsing from it.',
    },
    {
      q: 'How are the pairs chosen?',
      a: `From the corpus's own relation edges: a pair appears here if one entry records the other as a near-twin or as opposed. ${rows.length} pairs qualify today.`,
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Compare the laws',
    sub: `${rows.length} side-by-side ${rows.length === 1 ? 'comparison' : 'comparisons'}`,
    answer,
    lede,
    stats: [[rows.length, 'comparisons'], [twins.length, 'often confused'], [tensions.length, 'in tension']],
    base,
  })}${group('Often confused', 'Near-twins that are easy to mistake for one another.', twins)}
${group('In tension', 'Principles that pull in opposite directions.', tensions)}
${faq.html}${hubNav('compare/', { base })}  </div>
</section>
`;

  const description = rows.length
    ? `${rows.length} side-by-side comparisons of named laws — ${twins.length} pairs people confuse and ${tensions.length} that contradict each other, each with both claims and an at-a-glance table.`
    : 'Side-by-side comparisons of named laws — the ones people confuse, and the ones that contradict each other.';

  const jsonld = [
    ...hubJsonLd({
      name: 'Compare the laws',
      description,
      path: 'compare/',
      items: rows.map((p) => ({ name: `${p.a.name} vs ${p.b.name}`, href: `compare/${p.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: 'Compare the Laws — Side-by-Side, "X vs Y" | The Law Tome',
      description,
      base,
      origin,
      path: 'compare/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
