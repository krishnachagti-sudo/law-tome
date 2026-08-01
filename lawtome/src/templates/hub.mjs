// Shared furniture for the grouping pages — /collections/, /reliability/,
// /timeline/, /named-after/, /tension/, /situations/, /compare/, /for/.
//
// They were built one at a time and drifted: some carry a breadcrumb and some
// don't, some declare an ItemList and some declare nothing, and the thinnest of
// them (/reliability/, 255 words) is a core browsing axis with no structured
// data at all. This gives every hub the same three things.
//
//   1. A direct answer. One self-contained sentence naming what the page lists,
//      how many there are, and the rule for being on it. An answer engine can
//      lift that sentence whole; a reader gets the point before scrolling.
//   2. A crumb and a stat line, so the page states its own scale.
//   3. A footer of the other hubs, because the ways into 1,100 laws are the
//      most useful thing the site has and each one was a dead end.

import { escapeHtml } from './partials.mjs';

/** Every hub, for the cross-links at the foot of each one. */
export const HUBS = [
  ['browse/', 'All laws', 'the whole index, filterable by field and by how well established it is'],
  ['situations/', "What's the law for…?", 'start from the problem you actually have'],
  ['collections/', 'Collections', 'hand-picked sets that cut across fields'],
  ['for/', 'Find your laws', 'curated ways in for engineers, writers, decision-makers'],
  ['timeline/', 'Timeline', 'the index as a history of ideas, century by century'],
  ['named-after/', 'By namesake', 'the people who lent these ideas their names'],
  ['origins/', 'Where they came from', "the namesakes' birthplaces, on a map"],
  ['reliability/', 'By reliability', 'measured findings, rules of thumb, and folklore, separated'],
  ['tension/', 'Laws in tension', 'the pairs that contradict each other'],
  ['compare/', 'Compare', 'two laws side by side, for the ones people mix up'],
  ['graph/', 'The graph', 'walk the web of what echoes and contradicts what'],
];

/**
 * The head of a hub: crumb, title, count, the direct answer, then the lede.
 * @param {object} o
 * @param {string} o.title      h1
 * @param {string} o.answer     ONE self-contained sentence, with the number in it
 * @param {string} [o.lede]     the human paragraph under it
 * @param {string} [o.sub]      the count chip beside the title
 * @param {Array}  [o.stats]    [[value, label], …] rendered as a stat row
 */
export function hubHead({ title, answer, lede = '', sub = '', stats = [], base = '/' }) {
  const crumb = `    <nav class="crumb" aria-label="Breadcrumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}browse/">Browse</a><span class="sep">/</span>${escapeHtml(title)}</nav>\n`;
  const statRow = stats.length
    ? `    <div class="hub-stats">${stats.map(([v, l]) =>
        `<span class="hub-stat"><b>${escapeHtml(String(v))}</b> ${escapeHtml(l)}</span>`).join('')}</div>\n`
    : '';
  return crumb
    + `    <div class="sec-head">
      <h1>${escapeHtml(title)}</h1>${sub ? `\n      <span class="sub">${escapeHtml(sub)}</span>` : ''}
    </div>
    <p class="hub-answer">${answer}</p>
`
    + statRow
    // .sec-lede carries a -8px top margin (it normally sits straight under the
    // section head); after a stat row that pulls it up into the numbers, so the
    // hub variant restates the margin.
    + (lede ? `    <p class="sec-lede hub-lede">${lede}</p>\n` : '');
}

/** The other ways in, at the foot of every hub. */
export function hubNav(current, { base = '/' } = {}) {
  const rest = HUBS.filter(([href]) => href !== current);
  return `    <nav class="hub-more" aria-label="Other ways to browse">
      <h2 class="hub-more-h">Other ways into the index</h2>
      <div class="hub-more-grid">
${rest.map(([href, label, blurb]) => `        <a class="hub-more-card" href="${base}${href}">
          <span class="hmc-t">${escapeHtml(label)}</span>
          <span class="hmc-b">${escapeHtml(blurb)}</span>
        </a>`).join('\n')}
      </div>
    </nav>
`;
}

/**
 * A visible question-and-answer block, plus the FAQPage that matches it.
 *
 * Visible and structured must say the same thing — a FAQPage whose answers
 * aren't on the page is the spammy kind, and Google drops those. So this
 * renders both from one array and the caller can't let them drift.
 *
 * @param {{q: string, a: string}[]} items answers may contain links (HTML);
 *   the structured copy is stripped to text.
 * @returns {{html: string, jsonld: object}}
 */
export function hubFaq(items = [], { heading = 'Questions people ask' } = {}) {
  const rows = (Array.isArray(items) ? items : []).filter((i) => i && i.q && i.a);
  if (!rows.length) return { html: '', jsonld: null };
  const html = `    <section class="hub-faq" id="faq">
      <h2 class="hub-faq-h">${escapeHtml(heading)}</h2>
${rows.map(({ q, a }) => `      <details class="hub-faq-i">
        <summary><h3>${escapeHtml(q)}</h3></summary>
        <div class="hub-faq-a">${a}</div>
      </details>`).join('\n')}
    </section>
`;
  const text = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  return {
    html,
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: rows.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: text(a) },
      })),
    },
  };
}

/** CollectionPage + ItemList + BreadcrumbList, the set every hub should declare. */
export function hubJsonLd({ name, description, path, items = [], origin = '', base = '/' }) {
  const url = `${origin}${base}${path}`;
  const out = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
    ...(items.length ? {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: items.length,
        itemListElement: items.slice(0, 100).map((it, i) => ({
          '@type': 'ListItem', position: i + 1, name: it.name,
          ...(it.href ? { url: `${origin}${base}${it.href}` } : {}),
        })),
      },
    } : {}),
  }, {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
      { '@type': 'ListItem', position: 2, name: 'Browse', item: `${origin}${base}browse/` },
      { '@type': 'ListItem', position: 3, name },
    ],
  }];
  return out;
}
