// Listing template — the browse page and each per-category page.
//
// Ported from the approved prototype index.html #index section (`.chips`, `.grid`,
// and the inline render()'s `.card` markup), reusing the Task 5 chrome partials
// (head/sprite/header/footer/jsonLd/escapeHtml). Composition:
//   head({...}) + sprite() + header({...}) + <section chips + grid> + footer()
//
// The prototype's client-side chip filtering + live search is Task 10 (search.js).
// Here we render the static #chips buttons and the full #grid of cards; the JS
// that hides/shows on click is NOT included in this template.
//
// EVERY corpus string interpolated into markup (name, statement, category, no) and
// every slug used in an href goes through escapeHtml — the Task 5/6/7 gates all
// failed on missed escaping.

import { head, sprite, header, footer, escapeHtml, lawCard, RELIABILITY_NOTE, reliabilitySlug, browseControls } from './partials.mjs';

/**
 * A browse or per-category listing page — one full HTML document.
 * @param {object[]} laws laws to list (all laws for browse; category members for a category page)
 * @param {object} o
 * @param {string} o.title    drives <title> / <h1> (required)
 * @param {string} [o.base='/'] site base path — MUST end with '/'
 * @param {string} [o.kind='browse'] 'browse' => DefinedTermSet JSON-LD; 'category' => BreadcrumbList
 * @param {string} [o.active] nav key to mark active (defaults to 'browse')
 * @param {string} [o.origin=''] absolute-URL origin for JSON-LD (optional; degrades to base-relative)
 */
export function listingPage(laws = [], { title, base = '/', kind = 'browse', active = 'browse', origin = '', categoryKey = '', reliabilityKey = '', count } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  // A reliability-tier page (kind='reliability') is a faceted-browse view: the
  // server renders only that tier's laws and stamps the grid so the client keeps
  // the facet instead of repainting with the whole corpus (the category bug).
  const isReliability = kind === 'reliability';

  // Chips: "all" + the distinct categories present, in first-seen order. On a
  // category page the chip for `categoryKey` is the active one (not "all"), so the
  // client (search.js) initialises its filter to this category instead of clobbering
  // the server-filtered grid with every law.
  const cats = ['all'];
  for (const l of rows) if (l.category != null && !cats.includes(l.category)) cats.push(l.category);
  const chips = cats
    .map((c, i) => {
      const on = categoryKey ? c === categoryKey : i === 0;
      return `<button class="chip${on ? ' on' : ''}" data-c="${escapeHtml(c)}">${escapeHtml(c)}</button>`;
    })
    .join('');

  // data-cat / data-reliability let search.js honour the facet on first paint,
  // so the client filter narrows WITHIN the server-rendered subset (it never
  // repaints the grid with the full corpus).
  const gridAttr = (categoryKey ? ` data-cat="${escapeHtml(categoryKey)}"` : '')
    + (reliabilityKey ? ` data-reliability="${escapeHtml(reliabilityKey)}"` : '');

  const grid = rows.length
    ? rows.map((l) => lawCard(l, base, 2)).join('\n')
    : '<div class="empty">No laws to show yet.</div>';

  // On-page H1: category and reliability pages use their own title (already a
  // keyword); the browse index gets a descriptive, keyword-bearing H1 instead of
  // the bare nav word.
  const h1 = (kind === 'category' || isReliability) ? title : 'Named laws, principles & effects';
  // Reliability pages carry a one-line gloss of what the tier means (shared with
  // the law page's reliability meter), so the facet is self-explaining.
  const lede = isReliability && RELIABILITY_NOTE[reliabilityKey]
    ? `    <p class="sec-lede">Every entry rated <b>${escapeHtml(reliabilityKey)}</b> — ${escapeHtml(RELIABILITY_NOTE[reliabilityKey])}. Filter by field with the chips, or see the <a href="${base}reliability/">whole reliability scale</a>.</p>\n`
    : '';
  // Faceted controls (reliability filter + sort + group-by-tier), shared with the
  // homepage teaser via browseControls(). With JS off the server-rendered grid is
  // still the full, readable list.
  const controls = browseControls({ isReliability });

  // Visible breadcrumb on the deeper listing views (category, reliability tier),
  // matching the law/compare pages and reflecting the BreadcrumbList JSON-LD so a
  // reader always has an "up" path back to Browse.
  const crumb = (kind === 'category' || isReliability)
    ? `    <nav class="crumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}browse/">Browse</a>${isReliability ? `<span class="sep">/</span><a href="${base}reliability/">Reliability</a>` : ''}<span class="sep">/</span>${escapeHtml(title)}</nav>\n`
    : '';

  const section = `<section class="sec" id="index">
  <div class="wrap">
${crumb}    <div class="sec-head">
      <h1>${escapeHtml(h1)}</h1>
      <span class="sub" id="showing" aria-live="polite">showing ${rows.length} of ${rows.length}</span>
    </div>
${lede}    <div class="chips" id="chips">${chips}</div>
${controls}    <div class="grid" id="grid"${gridAttr}>
${grid}
    </div>
  </div>
</section>
`;

  // JSON-LD: DefinedTermSet for browse, BreadcrumbList for a category or
  // reliability-tier page (both are sub-views under Browse).
  const jsonld = (kind === 'category' || isReliability)
    ? [{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
          { '@type': 'ListItem', position: 2, name: 'Browse', item: `${origin}${base}browse/` },
          ...(isReliability ? [{ '@type': 'ListItem', position: 3, name: 'Reliability', item: `${origin}${base}reliability/` }] : []),
          { '@type': 'ListItem', position: isReliability ? 4 : 3, name: title },
        ],
      }]
    : [{
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name: 'The Law Tome',
        url: `${origin}${base}browse/`,
      }];

  const description = isReliability
    ? `${title} — named laws, principles, and effects rated ${reliabilityKey} (${RELIABILITY_NOTE[reliabilityKey] || 'see the reliability scale'}), each explained, cross-linked, and sourced in The Law Tome.`
    : kind === 'category'
      ? `${title} — named laws, principles, and effects, each explained with examples, origin, and sources in The Law Tome.`
      : 'Browse every named law, principle, and effect — each with its meaning, examples, origin, and sources. The complete index of The Law Tome.';

  // SEO title: keyword-led and distinct from the on-page <h1> (which stays the
  // short section label). Category pages target "<Field> laws & principles".
  const seoTitle = isReliability
    ? `${title} — Named Laws Rated ${reliabilityKey} | The Law Tome`
    : kind === 'category'
      ? `${title} Laws & Principles — Meaning & Examples | The Law Tome`
      : 'All Named Laws, Principles & Effects — Index | The Law Tome';

  const path = isReliability
    ? `reliability/${reliabilitySlug(reliabilityKey)}/`
    : kind === 'category' ? `category/${categoryKey}/` : 'browse/';
  return (
    head({ title: seoTitle, description, base, origin, path, jsonld }) +
    sprite() +
    header({ base, active, count: count ?? rows.length }) +
    section +
    footer({ base, scripts: `<script defer src="${base}assets/search.js"></script>` })
  );
}
