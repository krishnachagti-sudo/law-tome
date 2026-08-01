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

import { escapeHtml, personSlug } from './partials.mjs';

/**
 * The art band for a hub card: a strip of this set's own imagery.
 *
 * The hubs had all the structure they needed and still read as stacked text,
 * because the one thing the site has in quantity — 458 verified portraits and
 * 561 diagrams and manuscript scans — never appeared on them. A collection of
 * laws about incentives looks like something once it has Goodhart's and
 * Campbell's faces on it.
 *
 * Faces before figures, for the reason figureStrip gives: most figures were
 * drawn for white paper and a row of them on a dark page is a row of bright
 * rectangles at six aspect ratios. Returns '' below `min` rather than render a
 * gappy band — a card with one tile looks broken, a card with none looks
 * deliberate.
 *
 * @param {object} images src/data/images.json
 * @param {object[]} laws the set this card stands for
 */
export function hubTiles(images, laws, { base = '/', n = 4, min = 3 } = {}) {
  const people = (images && images.people) || {};
  const figures = (images && images.figures) || {};
  const rows = Array.isArray(laws) ? laws : [];
  const picked = [];
  const seen = new Set();
  for (const law of rows) {
    if (picked.length >= n) break;
    const por = law.namedAfter ? people[personSlug(law.namedAfter)] : null;
    if (por && !seen.has(por.slug)) {
      seen.add(por.slug);
      picked.push({ src: `${base}assets/img/people/${escapeHtml(por.slug)}.webp`, kind: 'por' });
    }
  }
  for (const law of rows) {
    if (picked.length >= n) break;
    if (figures[law.slug] && !seen.has(law.slug)) {
      seen.add(law.slug);
      picked.push({ src: `${base}assets/img/figures/${escapeHtml(law.slug)}.webp`, kind: 'fig' });
    }
  }
  if (picked.length < min) return '';
  return `        <span class="hcard-art" aria-hidden="true">
${picked.map((p) => `          <img class="hca hca--${p.kind}" src="${p.src}" alt="" loading="lazy" decoding="async">`).join('\n')}
        </span>
`;
}

/** The field most of a set belongs to, for the card's accent colour. */
export function dominantField(laws) {
  const n = new Map();
  for (const l of (Array.isArray(laws) ? laws : [])) {
    if (l && l.category) n.set(l.category, (n.get(l.category) || 0) + 1);
  }
  let best = '', bestN = 0;
  for (const [k, v] of n) if (v > bestN) { best = k; bestN = v; }
  return best;
}

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

/**
 * What a curated set of laws actually consists of, read off the members.
 *
 * A collection page used to be a blurb and a grid: the reader could see the
 * names but nothing about the set as a set — how many fields it spans, whether
 * it is built on measured findings or rules of thumb, how far back it reaches.
 * All of that is already in the corpus and none of it needs authoring.
 *
 * @returns {{stats: Array, html: string, fields: Array, tiers: Array}}
 */
export function setShape(laws = [], { base = '/', categories = {} } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const tally = (key) => {
    const m = new Map();
    for (const l of rows) if (l && l[key]) m.set(l[key], (m.get(l[key]) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  };
  const fields = tally('category');
  const tiers = tally('reliability');
  const years = rows.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y) && y >= 1);
  const span = years.length ? [Math.min(...years), Math.max(...years)] : null;
  const named = rows.filter((l) => l.namedAfter).length;

  const bar = (entries, href) => entries.length
    ? `        <ul class="shape-list">
${entries.map(([k, n]) => `          <li>${href ? `<a href="${href(k)}">${escapeHtml(categories[k] || k)}</a>` : escapeHtml(k)}<span>${n}</span></li>`).join('\n')}
        </ul>`
    : '';

  const html = rows.length
    ? `    <section class="setshape">
      <h2 class="setshape-h">What is in this set</h2>
      <div class="setshape-grid">
        <div class="setshape-col">
          <h3>Fields</h3>
${bar(fields, (k) => `${base}category/${escapeHtml(k)}/`)}
        </div>
        <div class="setshape-col">
          <h3>How well established</h3>
${bar(tiers, (k) => `${base}reliability/${String(k).toLowerCase()}/`)}
        </div>
        <div class="setshape-col">
          <h3>Span</h3>
          <p class="setshape-note">${span
            ? `Named between <b>${span[0]}</b> and <b>${span[1]}</b>${span[0] !== span[1] ? `, ${span[1] - span[0]} years apart` : ''}.`
            : 'None of these carries a reliable date.'}${named
              // "12 of the 12 are named after someone" is a sentence no editor
              // would let through; when the set is unanimous, say so.
              ? named === rows.length
                ? ` ${rows.length === 1 ? 'It is' : `All ${rows.length} are`} named after someone.`
                : ` ${named} of the ${rows.length} are named after someone.`
              : ''}</p>
        </div>
      </div>
    </section>
`
    : '';

  return {
    html,
    fields,
    tiers,
    span,
    stats: [
      [rows.length, 'laws'],
      [fields.length, fields.length === 1 ? 'field' : 'fields'],
      ...(span ? [[`${span[0]}–${span[1]}`, 'span']] : []),
    ],
  };
}

/** Member pairs that the corpus marks as opposed — a set arguing with itself. */
export function setTensions(laws = [], { base = '/', compareSlugs = {} } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const inSet = new Map(rows.map((l) => [l.slug, l]));
  const seen = new Set();
  const pairs = [];
  for (const l of rows) {
    for (const r of (Array.isArray(l.related) ? l.related : [])) {
      if (!r || !/oppos|tension|contradict/i.test(String(r.kind || ''))) continue;
      const other = inSet.get(r.slug);
      if (!other) continue;
      const key = [l.slug, other.slug].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ a: l, b: other, compare: compareSlugs[key] });
    }
  }
  if (!pairs.length) return '';
  return `    <section class="setten">
      <h2>Where this set disagrees with itself</h2>
      <p class="setten-note">${pairs.length} ${pairs.length === 1 ? 'pair' : 'pairs'} inside this set pull in opposite directions. That is not a flaw in the selection — it is the useful part.</p>
      <ul class="setten-list">
${pairs.map((p) => `        <li>${p.compare
    ? `<a href="${base}compare/${escapeHtml(p.compare)}/">${escapeHtml(p.a.name)} <span>vs</span> ${escapeHtml(p.b.name)}</a>`
    : `<span>${escapeHtml(p.a.name)} vs ${escapeHtml(p.b.name)}</span>`}</li>`).join('\n')}
      </ul>
    </section>
`;
}

/**
 * Laws just outside the set: entries the members repeatedly point at that the
 * curator did not include. Ranked by how many members link them, so the list is
 * "what this set keeps gesturing towards", not a random neighbour dump.
 */
export function setAdjacent(laws = [], { base = '/', byslug = {}, limit = 8 } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const inSet = new Set(rows.map((l) => l.slug));
  const votes = new Map();
  for (const l of rows) {
    for (const r of (Array.isArray(l.related) ? l.related : [])) {
      if (!r || !r.slug || inSet.has(r.slug) || !byslug[r.slug]) continue;
      votes.set(r.slug, (votes.get(r.slug) || 0) + 1);
    }
  }
  const top = [...votes.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([slug, n]) => ({ law: byslug[slug], n }));
  if (!top.length) return '';
  return `    <section class="setadj">
      <h2>Just outside this set</h2>
      <p class="setadj-note">Entries these laws keep pointing at that the collection does not include — each linked by at least two members.</p>
      <ul class="coll-laws">
${top.map((t) => `        <li><a href="${base}laws/${escapeHtml(t.law.slug)}/">${escapeHtml(t.law.name)}</a></li>`).join('\n')}
      </ul>
    </section>
`;
}

/**
 * The set on the OTHER axis that shares the most members with this one.
 *
 * Collections group by problem, reading lists by the work you do, and a law can
 * honestly sit in both — "Biases that skew decisions" and "For product &
 * decision-makers" share five. Overlap only reads as duplication when it is
 * unexplained, so each page names its closest counterpart and says how many
 * they share. (The one pair that WAS duplication — a collection whose members
 * were a strict subset of a reading list, titled after a person rather than a
 * problem — is gone; see build/build.mjs's redirect map.)
 */
export function crossAxis(laws = [], others = [], { base = '/', hrefBase = '', label = '' } = {}) {
  const mine = new Set((Array.isArray(laws) ? laws : []).map((l) => l && l.slug).filter(Boolean));
  if (!mine.size) return '';
  let best = null;
  for (const o of (Array.isArray(others) ? others : [])) {
    const n = (o.laws || []).filter((l) => mine.has(l.slug)).length;
    if (n >= 2 && (!best || n > best.n)) best = { o, n };
  }
  if (!best) return '';
  return `    <p class="crossaxis">Shares ${best.n} of these with ${escapeHtml(label)} <a href="${base}${hrefBase}${escapeHtml(best.o.slug)}/">${escapeHtml(best.o.title)}</a>.</p>
`;
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
