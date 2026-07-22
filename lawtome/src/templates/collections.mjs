// Curated collections — a themed front door onto the index.
//
// Two page kinds:
//   collectionsIndexPage(collections, …)  → /collections/       (the hub)
//   collectionPage(collection, …)         → /collections/<slug>/ (one theme)
// The per-collection grid reuses the shared lawCard, so a collection card looks
// exactly like a browse card. Blurbs are editorial framing (like a category
// description), never invented facts about the laws themselves.

import { head, sprite, header, footer, escapeHtml, lawCard } from './partials.mjs';

/** The hub: one panel per collection, linking to its page. */
export function collectionsIndexPage(collections = [], { base = '/', origin = '', count } = {}) {
  const rows = Array.isArray(collections) ? collections : [];
  const cards = rows.length
    ? rows.map((c) => `      <a class="coll-card" href="${base}collections/${escapeHtml(c.slug)}/">
        <span class="coll-h">${escapeHtml(c.title)}</span>
        <span class="coll-blurb">${escapeHtml(c.blurb)}</span>
        <span class="coll-count">${c.laws.length} laws</span>
      </a>`).join('\n')
    : '<div class="empty">No collections yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>Collections</h1>
      <span class="sub">${rows.length} themed ${rows.length === 1 ? 'set' : 'sets'}</span>
    </div>
    <p class="sec-lede">Hand-picked sets that cut across the alphabetical index — the laws that go together because they name the same kind of trouble. A place to start when you don't yet have a name to search for.</p>
    <div class="coll-grid">
${cards}
    </div>
  </div>
</section>
`;

  const description =
    'Curated collections of named laws — grouped by the problems they explain, from failing incentives to the razors of good reasoning. Themed starting points into The Law Tome.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Collections',
    url: `${origin}${base}collections/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
    ...(rows.length ? {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: rows.length,
        itemListElement: rows.map((c, i) => ({
          '@type': 'ListItem', position: i + 1, name: c.title, url: `${origin}${base}collections/${c.slug}/`,
        })),
      },
    } : {}),
  }];

  return (
    head({
      title: 'Collections — Named Laws Grouped by Theme | The Law Tome',
      description,
      base,
      origin,
      path: 'collections/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}

/** One collection: title + blurb, then its curated laws as a card grid. */
export function collectionPage(collection, { base = '/', origin = '', count } = {}) {
  const c = collection || {};
  const laws = Array.isArray(c.laws) ? c.laws : [];
  const grid = laws.length
    ? laws.map((l) => lawCard(l, base)).join('\n')
    : '<div class="empty">No laws in this collection yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <nav class="crumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}collections/">Collections</a><span class="sep">/</span>${escapeHtml(c.title || '')}</nav>
    <div class="sec-head">
      <h1>${escapeHtml(c.title || '')}</h1>
      <span class="sub">${laws.length} ${laws.length === 1 ? 'law' : 'laws'}</span>
    </div>
    <p class="sec-lede">${escapeHtml(c.blurb || '')}</p>
    <div class="grid">
${grid}
    </div>
  </div>
</section>
`;

  const description = `${c.title} — ${c.blurb} A curated collection of named laws from The Law Tome.`;

  // ItemList of the collection's members, in curated order, for answer engines.
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: c.title,
      url: `${origin}${base}collections/${c.slug}/`,
      description: c.blurb,
      isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: laws.length,
        itemListElement: laws.map((l, i) => ({
          '@type': 'ListItem', position: i + 1, name: l.name, url: `${origin}${base}laws/${l.slug}/`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
        { '@type': 'ListItem', position: 2, name: 'Collections', item: `${origin}${base}collections/` },
        { '@type': 'ListItem', position: 3, name: c.title },
      ],
    },
  ];

  return (
    head({
      title: `${c.title} — A Collection of Named Laws | The Law Tome`,
      description,
      base,
      origin,
      path: `collections/${c.slug}/`,
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
