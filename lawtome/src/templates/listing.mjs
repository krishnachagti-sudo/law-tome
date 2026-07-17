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

import { head, sprite, header, footer, escapeHtml, lawCard } from './partials.mjs';

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
export function listingPage(laws = [], { title, base = '/', kind = 'browse', active = 'browse', origin = '', categoryKey = '' } = {}) {
  const rows = Array.isArray(laws) ? laws : [];

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

  // data-cat lets search.js honour the category context on first paint.
  const gridAttr = categoryKey ? ` data-cat="${escapeHtml(categoryKey)}"` : '';

  const grid = rows.length
    ? rows.map((l) => lawCard(l, base)).join('\n')
    : '<div class="empty">No laws to show yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>${escapeHtml(title)}</h1>
      <span class="sub" id="showing">showing ${rows.length} of ${rows.length}</span>
    </div>
    <div class="chips" id="chips">${chips}</div>
    <div class="grid" id="grid"${gridAttr}>
${grid}
    </div>
  </div>
</section>
`;

  // JSON-LD: DefinedTermSet for browse, BreadcrumbList for a category page.
  const jsonld = kind === 'category'
    ? [{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
          { '@type': 'ListItem', position: 2, name: 'Browse', item: `${origin}${base}browse/` },
          { '@type': 'ListItem', position: 3, name: title },
        ],
      }]
    : [{
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name: 'The Law Tome',
        url: `${origin}${base}browse/`,
      }];

  const description = kind === 'category'
    ? `${title} — named laws, principles, and effects in The Law Tome.`
    : 'Browse every named law, principle, and effect in The Law Tome.';

  return (
    head({ title, description, base, jsonld }) +
    sprite() +
    header({ base, active, count: rows.length }) +
    section +
    footer({ scripts: `<script defer src="${base}assets/search.js"></script>` })
  );
}
