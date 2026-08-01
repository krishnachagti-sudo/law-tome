// Curated collections — a themed front door onto the index.
//
// Two page kinds:
//   collectionsIndexPage(collections, …)  → /collections/       (the hub)
//   collectionPage(collection, …)         → /collections/<slug>/ (one theme)
// The per-collection grid reuses the shared lawCard, so a collection card looks
// exactly like a browse card. Blurbs are editorial framing (like a category
// description), never invented facts about the laws themselves.

import { head, sprite, header, footer, escapeHtml, lawCard, figureStrip } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

/**
 * The hub: one panel per collection, linking to its page.
 *
 * A card used to be a title, a blurb and a count — nothing a reader or a
 * crawler could act on without a click. Each panel now lists its members, so
 * the hub is a table of contents rather than a menu of closed doors, and the
 * law names it advertises are all links.
 */
export function collectionsIndexPage(collections = [], { base = '/', origin = '', count } = {}) {
  const rows = Array.isArray(collections) ? collections : [];
  const total = rows.reduce((n, c) => n + c.laws.length, 0);
  const cards = rows.length
    ? rows.map((c) => {
      const laws = c.laws || [];
      const shown = laws.slice(0, 8);
      const rest = laws.length - shown.length;
      return `      <article class="coll-card" id="c-${escapeHtml(c.slug)}">
        <h2 class="coll-h"><a href="${base}collections/${escapeHtml(c.slug)}/">${escapeHtml(c.title)}</a></h2>
        <p class="coll-blurb">${escapeHtml(c.blurb)}</p>
        <ul class="coll-laws">
${shown.map((l) => `          <li><a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a></li>`).join('\n')}
${rest > 0 ? `          <li class="coll-rest"><a href="${base}collections/${escapeHtml(c.slug)}/">+${rest} more</a></li>\n` : ''}        </ul>
        <p class="coll-count"><a class="ghost" href="${base}collections/${escapeHtml(c.slug)}/"><i class="ti ti-arrow-right" aria-hidden="true"></i> All ${laws.length} laws<span class="sr-only"> in ${escapeHtml(c.title)}</span></a></p>
      </article>`;
    }).join('\n')
    : '<div class="empty">No collections yet.</div>';

  const answer = rows.length
    ? `The Law Tome has ${rows.length} curated collections — ${rows.map((c) => `<a href="${base}collections/${escapeHtml(c.slug)}/">${escapeHtml(c.title)}</a>`).join(', ')} — gathering ${total} named laws by the kind of problem they describe rather than by the field they came from.`
    : 'Curated collections gather named laws by the kind of problem they describe.';

  const lede = `The index is alphabetical and the fields are academic, and neither is how a problem arrives. A collection is the third cut: the laws that belong together because they name the same trouble, whoever happened to discover them. <a href="${base}browse/">Browse everything</a> if you already have a name, or <a href="${base}situations/">start from the situation</a> if you don't.`;

  const faq = hubFaq([
    {
      q: 'What is a collection here?',
      a: `A hand-picked set of named laws that explain the same kind of problem, drawn from across the ${total ? '' : ''}index regardless of field. There are ${rows.length}, covering ${total} law entries in total; a law can appear in more than one.`,
    },
    ...rows.slice(0, 6).map((c) => ({
      // Quoted rather than "the ${title} collection" — half the titles already
      // start with "The", and "the The razors collection" is not a sentence.
      q: `What is in the “${c.title}” collection?`,
      a: `${escapeHtml(c.blurb)} ${c.laws.length} laws, including ${c.laws.slice(0, 5).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join(', ')}. <a href="${base}collections/${escapeHtml(c.slug)}/">Open the collection</a>.`,
    })),
    {
      q: 'How do collections differ from fields?',
      a: `A field says where a law came from — physics, economics, psychology. A collection says what it is useful for. <a href="${base}browse/">The index</a> is filterable by field; collections cut across them.`,
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Collections',
    sub: `${rows.length} themed ${rows.length === 1 ? 'set' : 'sets'}`,
    answer,
    lede,
    stats: [[rows.length, 'collections'], [total, 'laws gathered']],
    base,
  })}    <div class="coll-grid">
${cards}
    </div>
${faq.html}${hubNav('collections/', { base })}  </div>
</section>
`;

  const description = rows.length
    ? `${rows.length} curated collections of named laws — ${rows.slice(0, 5).map((c) => c.title).join(', ')} and more — grouping ${total} entries by the problems they explain rather than the fields they came from.`
    : 'Curated collections of named laws, grouped by the problems they explain. Themed starting points into The Law Tome.';

  const jsonld = [
    ...hubJsonLd({
      name: 'Collections',
      description,
      path: 'collections/',
      items: rows.map((c) => ({ name: c.title, href: `collections/${c.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

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
export function collectionPage(collection, { base = '/', origin = '', count, images } = {}) {
  const c = collection || {};
  const laws = Array.isArray(c.laws) ? c.laws : [];
  const grid = laws.length
    ? laws.map((l) => lawCard(l, base, 2)).join('\n')
    : '<div class="empty">No laws in this collection yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <nav class="crumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}collections/">Collections</a><span class="sep">/</span>${escapeHtml(c.title || '')}</nav>
    <div class="sec-head">
      <h1>${escapeHtml(c.title || '')}</h1>
      <span class="sub">${laws.length} ${laws.length === 1 ? 'law' : 'laws'}</span>
    </div>
    <p class="sec-lede">${escapeHtml(c.blurb || '')}</p>
${figureStrip(images, laws, { base })}    <div class="grid">
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
