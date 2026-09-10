// "X vs Y" comparison pages — one per pair of laws the corpus marks as a
// near-twin (easily confused) or in tension (pulling opposite ways). These are
// the queries people type directly ("Occam's razor vs Hanlon's razor",
// "Type I vs Type II error"), so each pair earns its own indexable page.
//
// ANTI-FABRICATION: a compare page invents nothing. It recombines each law's
// own verified fields (statement, meaning, reliability, coined year, eponym)
// and lets the two sit side by side.
//
// This file used to refuse to author a "here's the difference" sentence at all,
// on the grounds that it would be fabrication. That conflated two things. The
// VERDICT — which of the two your case needs — genuinely cannot be written
// here, because it depends on facts about the reader this page does not have,
// and it is still refused everywhere. The DIFFERENCE — what the two disagree
// ABOUT — is a fact about the entries, derivable from claims both already make,
// and of the same kind as "the corpus records them as opposed", which these
// pages have always asserted.
//
// So a pair may carry an authored difference and a condition-matcher, both in
// comparisons.mjs, and both are hand-written per pair rather than generated.
// A pair with no entry there renders exactly as before.

import { head, asset, sprite, header, footer, escapeHtml, reliabilityClass, reliabilitySlug, personSlug, listFilter, fitTitle } from './partials.mjs';
import { comparisonFor } from './comparisons.mjs';
import { eraId, centuryLabelForYear } from './timeline.mjs';
import { personId, monogram } from './eponyms.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const FRAMING = {
  'near-twin': {
    eyebrow: 'Often confused',
    lede: 'These two are routinely mistaken for each other. Here is what separates them, and what each actually claims, field by field.',
  },
  tension: {
    eyebrow: 'In tension',
    lede: 'These two pull in opposite directions: what one recommends, the other warns against. Here is what each actually claims, field by field.',
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

/* The pair's own difference and its condition-matcher, where one is written.
 * Every question and every reading is served in the HTML: with no JavaScript
 * this reads as a set of considerations with both answers explained, which is
 * a worse experience than the quiz and a better one than a blank box. */
function renderDifference(slug, a, b) {
  const cmp = comparisonFor(slug);
  if (!cmp) return '';
  const qs = cmp.questions.map((q, i) => `            <li class="ix-case" data-ix-case="${i}">
              <p class="ix-case-text">${escapeHtml(q.text)}</p>
${q.options.map((o) => `              <div class="ix-case-why" data-ix-why data-ix-opt="${escapeHtml(o.label)}" data-matches="${escapeHtml(o.matches)}">
                <p>${escapeHtml(o.why)}</p>
              </div>`).join('\n')}
            </li>`).join('\n');
  return `<div class="cmp-difference">
        <h2 class="cmp-diff-h">What they disagree about</h2>
        <p>${escapeHtml(cmp.difference)}</p>
      </div>
      <div class="interactive ix-match" data-interactive="${escapeHtml(slug)}"
           data-a="${escapeHtml(a.name)}" data-b="${escapeHtml(b.name)}">
        <p class="ix-prompt">${escapeHtml(cmp.prompt)}</p>
        <ol class="ix-cases">
${qs}
        </ol>
        <div class="ix-verdict" data-ix-tally hidden></div>
        <p class="wg-note">This reports which entry's stated conditions your answers match. Which one your case actually needs is still yours to decide.</p>
      </div>`;
}

export function comparePage(pair, { base = '/', origin = '', categories = {}, count, images, byslug = {}, allPairs = [] } = {}) {
  const { a, b, relation, slug } = pair;
  const people = (images && images.people) || {};
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

  const face = (law) => {
    const por = law.namedAfter ? people[personSlug(law.namedAfter)] : null;
    if (por) return `<img class="cmp-face" src="${base}assets/img/people/${escapeHtml(por.slug)}.webp" alt="${escapeHtml(law.namedAfter)}" loading="lazy" decoding="async">`;
    if (law.namedAfter) return `<span class="cmp-face cmp-face--mono" aria-hidden="true">${escapeHtml(monogram(law.namedAfter))}</span>`;
    return '';
  };
  const panel = (law) => {
    const badge = law.reliability
      ? `<a class="badge ${reliabilityClass(law.reliability)}" href="${base}reliability/${reliabilitySlug(law.reliability)}/">${escapeHtml(law.reliability)}</a>`
      : '';
    const stmt = law.statement ? `<p class="cmp-stmt"><q>${escapeHtml(law.statement)}</q></p>` : '';
    const who = law.namedAfter
      ? `<span class="cmp-who">${face(law)}<span><a href="${base}named-after/#${escapeHtml(personId(law.namedAfter))}">${escapeHtml(law.namedAfter)}</a>${law.coinedYear ? `<span class="cmp-yr">${escapeHtml(String(law.coinedYear))}</span>` : ''}</span></span>`
      : '';
    return `      <article class="cmp-col" data-c="${escapeHtml(law.category || '')}">
        <div class="cmp-col-top">
          <a class="cmp-name" href="${permalink(law.slug)}">${escapeHtml(law.name)}</a>
          ${badge}
        </div>
        <span class="cmp-cat">${catCell(law.category)}</span>
${stmt}
${who}
        <a class="cmp-read" href="${permalink(law.slug)}">Read the full law <span aria-hidden="true">→</span></a>
      </article>`;
  };

  // ---- the substance -------------------------------------------------------
  // Dimension by dimension, both laws' OWN words under the same heading. This
  // is where a comparison earns its page: two statements and a facts table tell
  // you the pair exists, not what separates them. Every cell is a corpus field;
  // a dimension only appears when at least one side has something to say, and
  // where one side is silent it says so rather than inventing parity.
  const DIMENSIONS = [
    ['What it claims', (l) => l.statement, 'q'],
    ['In plain English', (l) => l.meaning],
    ['How it works', (l) => l.mechanism],
    ['Why it matters', (l) => l.whyItMatters],
    ['Where it breaks down', (l) => l.limits],
    ['Commonly misread as', (l) => l.misreadings],
    ['A worked example', (l) => (Array.isArray(l.examples) && l.examples[0] ? l.examples[0].text : l.example)],
    ['Where it came from', (l) => l.origin],
  ];
  const dimRows = DIMENSIONS.map(([label, get, tag]) => {
    const av = get(a), bv = get(b);
    if (!av && !bv) return '';
    const cell = (v) => v
      ? (tag === 'q' ? `<q>${escapeHtml(v)}</q>` : escapeHtml(v))
      : '<span class="cmp-none">Not recorded for this entry.</span>';
    return `      <div class="cmp-dim">
        <h3 class="cmp-dim-h">${escapeHtml(label)}</h3>
        <div class="cmp-dim-a" data-c="${escapeHtml(a.category || '')}"><span class="cmp-dim-w">${escapeHtml(a.name)}</span>${cell(av)}</div>
        <div class="cmp-dim-b" data-c="${escapeHtml(b.category || '')}"><span class="cmp-dim-w">${escapeHtml(b.name)}</span>${cell(bv)}</div>
      </div>`;
  }).filter(Boolean).join('\n');

  // What the two genuinely have in common, computed rather than asserted.
  const relSlugs = (l) => new Set((Array.isArray(l.related) ? l.related : []).map((r) => r && r.slug).filter(Boolean));
  const shared = [...relSlugs(a)].filter((x) => relSlugs(b).has(x) && byslug[x]).map((x) => byslug[x]);
  const common = [];
  if (a.category && a.category === b.category) common.push(`Both sit in <a href="${base}category/${escapeHtml(a.category)}/">${catLabel(a.category)}</a>.`);
  else if (a.category && b.category) common.push(`They come from different fields: <a href="${base}category/${escapeHtml(a.category)}/">${catLabel(a.category)}</a> and <a href="${base}category/${escapeHtml(b.category)}/">${catLabel(b.category)}</a>.`);
  if (a.reliability && a.reliability === b.reliability) common.push(`Both are rated <a href="${base}reliability/${reliabilitySlug(a.reliability)}/">${escapeHtml(a.reliability)}</a>, so they stand on the same kind of evidence.`);
  else if (a.reliability && b.reliability) common.push(`They are not equally well established: ${escapeHtml(a.name)} is rated <a href="${base}reliability/${reliabilitySlug(a.reliability)}/">${escapeHtml(a.reliability)}</a> and ${escapeHtml(b.name)} <a href="${base}reliability/${reliabilitySlug(b.reliability)}/">${escapeHtml(b.reliability)}</a>.`);
  if (a.coinedYear && b.coinedYear) {
    const gap = Math.abs(Number(a.coinedYear) - Number(b.coinedYear));
    const older = Number(a.coinedYear) <= Number(b.coinedYear) ? a : b;
    common.push(gap === 0
      ? `Both were named in ${escapeHtml(String(a.coinedYear))}.`
      : `${escapeHtml(older.name)} is the older of the two by ${gap} ${gap === 1 ? 'year' : 'years'}.`);
  }
  if (shared.length) {
    common.push(`Both are linked to ${shared.slice(0, 3).map((l) => `<a href="${permalink(l.slug)}">${escapeHtml(l.name)}</a>`).join(', ')}.`);
  }
  const commonBlock = common.length
    ? `    <section class="cmp-common">
      <h2>What they have in common</h2>
      <ul>${common.map((c) => `<li>${c}</li>`).join('')}</ul>
    </section>
`
    : '';

  // Sources for both, so the page is checkable without leaving it.
  const srcList = (law) => {
    const ss = (Array.isArray(law.sources) ? law.sources : []).filter(Boolean).slice(0, 4);
    if (!ss.length) return '';
    return `      <div class="cmp-src-col">
        <h3><a href="${permalink(law.slug)}">${escapeHtml(law.name)}</a></h3>
        <ul>${ss.map((x) => `<li>${x.url ? `<a href="${escapeHtml(x.url)}">${escapeHtml(x.text || x.url)}</a>` : escapeHtml(x.text || '')}</li>`).join('')}</ul>
      </div>`;
  };
  const sources = (srcList(a) || srcList(b))
    ? `    <section class="cmp-src">
      <h2>Sources</h2>
      <div class="cmp-src-grid">
${srcList(a)}
${srcList(b)}
      </div>
    </section>
`
    : '';

  // Other comparisons either law appears in — the reason a reader who landed
  // here from a search has somewhere to go next.
  const siblings = (Array.isArray(allPairs) ? allPairs : [])
    .filter((p) => p.slug !== slug && (p.a.slug === a.slug || p.b.slug === a.slug || p.a.slug === b.slug || p.b.slug === b.slug))
    .slice(0, 8);
  const more = siblings.length
    ? `    <section class="cmp-more">
      <h2>Related comparisons</h2>
      <ul class="cmp-more-list">${siblings.map((p) => `<li><a href="${base}compare/${escapeHtml(p.slug)}/">${escapeHtml(p.a.name)} <span>vs</span> ${escapeHtml(p.b.name)}</a></li>`).join('')}</ul>
    </section>
`
    : '';

  const faq = hubFaq([
    {
      q: `What is the difference between ${a.name} and ${b.name}?`,
      a: `${escapeHtml(a.name)} says ${a.statement ? `“${escapeHtml(a.statement)}”` : 'one thing'}; ${escapeHtml(b.name)} says ${b.statement ? `“${escapeHtml(b.statement)}”` : 'another'}. ${relation === 'tension' ? 'They pull in opposite directions, so which applies depends on your conditions. The two are compared field by field above.' : 'They are near-twins and easy to confuse; the field-by-field comparison above sets out what each actually claims.'}`,
    },
    {
      q: `Are ${a.name} and ${b.name} the same thing?`,
      a: relation === 'tension'
        ? 'No. The corpus records them as opposed: what one recommends, the other warns against.'
        : 'No, though they are routinely mistaken for each other. They are recorded here as near-twins precisely because the confusion is common.',
    },
    {
      // Deliberately no recommendation — but the reason has to be said in terms
      // of THESE two entries, or it is a disclaimer stamped on 235 pages.
      // Pointing at each law's own limits section makes the refusal useful:
      // it hands the reader the two paragraphs the decision actually turns on.
      q: 'Which one should I apply?',
      a: `Whichever one's conditions your case meets. This page will not guess which that is. ${escapeHtml(a.name)} ${a.limits ? 'states where it stops working' : 'sets out its scope'}, and so does ${escapeHtml(b.name)}; both passages are above, in the entries' own words. Reading the two limits side by side answers this faster than a recommendation from a site that cannot see your situation.`,
    },
  ], { heading: 'Questions about this pair' });

  const substance = `${commonBlock}    <section class="cmp-dims">
      <h2>Side by side</h2>
${dimRows}
    </section>
${sources}${more}${faq.html}`;

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
      ${renderDifference(slug, a, b)}
    </div>
    <div class="cmp-cols">
${panel(a)}
      <div class="cmp-mid" aria-hidden="true"><span>vs</span></div>
${panel(b)}
    </div>
${table}
${substance}    <div class="cmp-foot">
      <a class="btn ghost" href="${base}compare/">All comparisons</a>
      <a class="btn ghost" href="${base}graph/">See the graph</a>
    </div>
  </div>
</section>
`;

  // Where a difference is written, it IS the description. A searcher typing
  // "X vs Y" asked one question, and a snippet promising a side-by-side table
  // answers a different one. There is nothing to protect here: these pages take
  // nine clicks from 3,179 impressions at a median position of 8.8.
  const authored = comparisonFor(slug);
  const description = authored
    ? `${a.name} vs ${b.name}: ${authored.difference}`
    : `${a.name} vs ${b.name}: how the two compare — what each one claims, who coined it, and how reliable it is, side by side. From The Law Tome.`;
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
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      // Longest trimming that still fits the result slot: the pair of names is
      // the part a searcher typed, so it is the part that must survive whole.
      title: fitTitle(`${a.name} vs ${b.name}`, [
        ' — What’s the Difference? | The Law Tome',
        ' — What’s the Difference?',
        ' — Compared | The Law Tome',
        ' — Compared',
        '',
      ]),
      description,
      base,
      origin,
      path: `compare/${slug}/`,
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    // interactive.js only where this pair actually has a matcher: 224 of the
    // 234 comparison pages should not pay for a script they never use.
    footer({ base, scripts: comparisonFor(slug)
      ? `<script defer src="${asset(base, 'assets/interactive.js')}"></script>` : '' })
  );
}

/**
 * The /compare/ hub — every comparison, grouped by relation, as an internal-link
 * spine that makes each pair page discoverable (and captures "compare laws"
 * style queries in its own right).
 * @param {{a:object,b:object,relation:string,slug:string}[]} pairs
 */
export function compareHubPage(pairs = [], { base = '/', origin = '', count, images } = {}) {
  const rows = Array.isArray(pairs) ? pairs : [];
  const twins = rows.filter((p) => p.relation === 'near-twin');
  const tensions = rows.filter((p) => p.relation === 'tension');

  // A face for each side where we have one. The pair reads as two people
  // disagreeing rather than two strings either side of the word "vs" — which is
  // the whole point of a head-to-head.
  const people = (images && images.people) || {};
  // Portraits only. A figure was tried here and it does not survive the crop:
  // these are diagrams and photographs drawn for a page, and at 34px in a
  // circle they became a white disc (an inverted line drawing), a smear of
  // supermarket shelving, and an engraving nobody could identify. A face reads
  // at that size; nothing else here does. Otherwise the namesake's monogram,
  // which is what /named-after/ uses for the same situation.
  const thumb = (law) => {
    const por = law.namedAfter ? people[personSlug(law.namedAfter)] : null;
    if (por) return `<img class="cvs-face" src="${base}assets/img/people/${escapeHtml(por.slug)}.webp" alt="" loading="lazy" decoding="async">`;
    return `<span class="cvs-face cvs-face--none" aria-hidden="true">${escapeHtml(law.namedAfter ? monogram(law.namedAfter) : '')}</span>`;
  };
  const side = (law, cls) => `<span class="cvs-side cvs-side--${cls}">${thumb(law)}<span class="cvs-name">${escapeHtml(law.name)}</span></span>`;
  const item = (p) => `        <li class="cmp-hub-item" data-filter-row><a class="cvs" href="${base}compare/${escapeHtml(p.slug)}/" data-c="${escapeHtml(p.a.category || '')}">
          ${side(p.a, 'a')}<span class="cvs-vs" aria-hidden="true">vs</span>${side(p.b, 'b')}
        </a></li>`;
  const group = (title, blurb, list) => list.length
    ? `    <div class="cmp-hub-group" data-filter-group>
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
      a: `On evidence, never on a guess. A pair qualifies if the corpus records the two as opposed or as near-twins, or — for merely kindred pairs — if one entry's own prose names the other, or if their names share an uncommon word (Change Blindness and Inattentional Blindness; Hanlon's Razor and Hitchens's Razor). ${rows.length} pairs qualify today, out of roughly 1,500 linked pairs: a page for every link would be a thousand thin permutations of writing that already exists elsewhere on the site.`,
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
  })}${rows.length ? listFilter({ target: 'cmp-hub', label: `Filter ${rows.length} comparisons`, placeholder: 'Filter by either law…', noun: 'comparisons' }) : ''}    <div id="cmp-hub">
${group('Often confused', 'Near-twins that are easy to mistake for one another.', twins)}
${group('In tension', 'Principles that pull in opposite directions.', tensions)}
    </div>
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
