// /calculators/ — the entries you can actually run.
//
// 187 pages on this site compute, solve, simulate or demonstrate the thing they
// define, and until this page existed there was no way to find them. Browse,
// the timeline and the quotes index all link every entry equally, so a reader
// who used one calculator had no route to the other 186, and a search engine
// had no page saying this class of thing exists here.
//
// Membership is read off the build, not off a judgement: an entry is here
// because widgets.mjs or interactives.mjs gives it something to do, which is
// the same test the page itself uses to decide whether to render one. The list
// cannot drift from what the pages actually carry.

import { head, sprite, header, footer, escapeHtml, listFilter } from './partials.mjs';
import { hubHead, hubNav, hubFaq } from './hub.mjs';
import { widgetSlugs, widgetFor } from './widgets.mjs';
import { interactiveSlugs, interactiveFor } from './interactives.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

// One entry per kind, in the order a reader meets them: the arithmetic first,
// because it is most of them, then the things that are not arithmetic at all.
const KINDS = [
  ['calculator', 'Calculators', 'Move the inputs, and the law’s own formula answers.'],
  ['solver', 'Solvers', 'Type the problem in. It works it, checks itself, and refuses what it cannot do.'],
  ['spot', 'Judge the cases', 'Worked cases, chosen to break the version people think they know.'],
  ['sim', 'Runnable models', 'The stated mechanism, run forward until it does what the law says it does.'],
  ['demo', 'Demonstrations', 'Perceptual facts. Prose can only assert these; here you see them happen.'],
  ['probe', 'On yourself', 'A few questions, and a result computed from your own answers.'],
];

/** Every entry with something to do, keyed by kind. Read from the same specs
 *  the law pages read, so this list is the pages and not a copy of them. */
export function interactiveIndex(laws = []) {
  const byslug = new Map(laws.map((l) => [l.slug, l]));
  const rows = [];
  for (const slug of widgetSlugs()) {
    if (!widgetFor(slug) || !byslug.has(slug)) continue;
    rows.push({ slug, kind: 'calculator', law: byslug.get(slug), spec: widgetFor(slug) });
  }
  for (const slug of interactiveSlugs()) {
    const spec = interactiveFor(slug);
    if (!spec || !byslug.has(slug)) continue;
    rows.push({ slug, kind: spec.kind, law: byslug.get(slug), spec });
  }
  return rows.sort((a, b) => a.law.name.localeCompare(b.law.name));
}

export function calculatorsPage(laws = [], { base = '/', origin = '', count, categories = {} } = {}) {
  const rows = interactiveIndex(laws);
  const byKind = new Map(KINDS.map(([k]) => [k, []]));
  for (const r of rows) if (byKind.has(r.kind)) byKind.get(r.kind).push(r);

  const fieldName = (c) => categories[c] || c;
  const fields = [...new Set(rows.map((r) => r.law.category))].sort();

  const answer = `${num(rows.length)} of the ${num(count || laws.length)} entries here do more than define the idea: `
    + `${num(byKind.get('calculator').length)} compute the law's own formula from inputs you set, `
    + `${num(byKind.get('solver').length)} solve a problem you type in, and the rest simulate a mechanism, `
    + `test you against worked cases, or show a perceptual effect happening. Everything runs in the browser and sends nothing anywhere.`;

  const lede = `A definition tells you what a law says. It does not tell you what the law does to numbers you care about, `
    + `and for a quantitative claim that is most of the content. These are the entries where you can put your own figures in — `
    + `your workload, your sample size, your error rate — and read the answer off the law itself rather than off a worked example `
    + `somebody else chose.`;

  const sections = KINDS.map(([kind, title, gloss]) => {
    const list = byKind.get(kind) || [];
    if (!list.length) return '';
    return `    <section class="cx-sec" id="${escapeHtml(kind)}">
      <h2 class="cx-h2">${escapeHtml(title)} <span class="cx-n">${num(list.length)}</span></h2>
      <p class="cx-gloss">${escapeHtml(gloss)}</p>
      <div class="cx-grid">
${list.map((r) => `        <a class="cx-i" href="${base}laws/${escapeHtml(r.slug)}/" data-filter-row data-filter-text="${escapeHtml(`${r.law.name} ${fieldName(r.law.category)} ${title}`)}">
          <span class="cx-nm">${escapeHtml(r.law.name)}</span>
          <span class="cx-fd">${escapeHtml(fieldName(r.law.category))}</span>
${r.spec.identity ? `          <code class="cx-eq">${escapeHtml(r.spec.identity)}</code>` : ''}
        </a>`).join('\n')}
      </div>
    </section>`;
  }).filter(Boolean).join('\n');

  const faq = hubFaq([
    { q: 'How is this list decided?', a: `By the build, not by an editor. An entry appears here if it carries a widget or an interaction, which is the same test the entry's own page uses to decide whether to render one. If a page stops computing, it leaves this list in the same build.` },
    { q: 'Do any of these send my numbers anywhere?', a: `No, and that is checkable rather than promised: the arithmetic lives in two script files that make no network request of any kind. Nothing you type is stored, logged or transmitted, and the pages work with the connection cut once they have loaded.` },
    { q: 'Why do some laws have one and most do not?', a: `Because most named laws have no single agreed closed form to compute. A rule of thumb, a fallacy or a historical claim has nothing to put on a slider, and giving it one would invent a precision the idea does not have. Where an entry is deliberately left without one, its page says so and why — <a href="${base}laws/the-chinese-remainder-theorem/">the Chinese Remainder Theorem</a> spent weeks in that category before it got a solver that validates its precondition rather than a slider that would have violated it.` },
    { q: 'Can I link to a calculation?', a: `Yes. Every calculator and solver reads its settings from the address bar and keeps them there as you change them, so the link in your address bar always describes what is on your screen. Send it and the other person opens the same numbers.` },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'The ones you can run',
    sub: `${num(rows.length)} interactive entries`,
    answer,
    lede,
    stats: [[num(rows.length), 'interactive'], [num(byKind.get('calculator').length), 'calculators'], [num(fields.length), 'fields']],
    base,
    crumbs: [['browse/', 'Browse']],
  })}${listFilter({ target: 'cx-all', label: `Filter ${num(rows.length)} entries`, placeholder: 'Filter by name or field…', noun: 'entries' })}    <div id="cx-all">
${sections}
    </div>
${faq.html}${hubNav('calculators/', { base })}  </div>
</section>
`;

  const title = 'Calculators & Interactive Laws';
  const description = `${num(rows.length)} named laws you can actually run — ${num(byKind.get('calculator').length)} with a live calculator for the formula, plus solvers, runnable models and demonstrations. Free, in the browser, nothing sent anywhere.`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      url: `${origin}${base}calculators/`,
      description,
      isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
      mainEntity: {
        '@type': 'ItemList',
        name: title,
        numberOfItems: rows.length,
        itemListElement: rows.slice(0, 100).map((r, i) => ({
          '@type': 'ListItem', position: i + 1, name: r.law.name,
          url: `${origin}${base}laws/${r.slug}/`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
        { '@type': 'ListItem', position: 2, name: 'Browse', item: `${origin}${base}browse/` },
        // Must match the visible trail exactly; the page's own heading is
        // "The ones you can run", and seo-budget.test.mjs holds the two together.
        { '@type': 'ListItem', position: 3, name: 'The ones you can run' },
      ],
    },
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: `${title} | The Law Tome`,
      description,
      base,
      origin,
      path: 'calculators/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
