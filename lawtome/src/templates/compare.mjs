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

import { head, sprite, header, footer, escapeHtml, reliabilityClass } from './partials.mjs';

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

  const panel = (law) => {
    const badge = law.reliability
      ? `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span>`
      : '';
    const stmt = law.statement ? `<p class="cmp-stmt"><q>${escapeHtml(law.statement)}</q></p>` : '';
    const mean = law.meaning ? `<p class="cmp-mean">${escapeHtml(law.meaning)}</p>` : '';
    return `      <article class="cmp-col">
        <div class="cmp-col-top">
          <a class="cmp-name" href="${permalink(law.slug)}">${escapeHtml(law.name)}</a>
          ${badge}
        </div>
        <span class="cmp-cat">${catLabel(law.category)}</span>
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
${row('Field', catLabel(a.category), catLabel(b.category))}
${row('Reliability', escapeHtml(a.reliability || '—'), escapeHtml(b.reliability || '—'))}
${row('Coined', escapeHtml(a.coinedYear ? String(a.coinedYear) : '—'), escapeHtml(b.coinedYear ? String(b.coinedYear) : '—'))}
${row('Named after', escapeHtml(a.namedAfter || '—'), escapeHtml(b.namedAfter || '—'))}
${row('Type', provenanceLabel(a.provenance), provenanceLabel(b.provenance))}
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

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>Compare the laws</h1>
      <span class="sub">${rows.length} side-by-side ${rows.length === 1 ? 'comparison' : 'comparisons'}</span>
    </div>
    <p class="sec-lede">The pairs people mix up, and the pairs that disagree — set against each other, one page at a time. Each comparison lays out what both laws claim, side by side, drawn straight from their entries.</p>
${group('Often confused', 'Near-twins that are easy to mistake for one another.', twins)}
${group('In tension', 'Principles that pull in opposite directions.', tensions)}
  </div>
</section>
`;

  const description =
    'Side-by-side comparisons of named laws — the ones people confuse, and the ones that contradict each other. Each pair on its own page from The Law Tome.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Compare the laws',
    url: `${origin}${base}compare/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
    ...(rows.length ? {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: rows.length,
        itemListElement: rows.slice(0, 200).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${p.a.name} vs ${p.b.name}`,
          url: `${origin}${base}compare/${p.slug}/`,
        })),
      },
    } : {}),
  }];

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
