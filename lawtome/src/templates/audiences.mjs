// Audience "for …" pages — persona landing pages.
//   audiencesIndexPage(audiences, …) → /for/            (the hub)
//   audiencePage(audience, …)        → /for/<slug>/      (one persona)
// The per-audience grid reuses the shared lawCard. Copy is editorial framing;
// every law is an existing, sourced entry.

import { head, sprite, header, footer, escapeHtml, lawCard } from './partials.mjs';

/** The hub: one panel per audience. */
export function audiencesIndexPage(audiences = [], { base = '/', origin = '', count } = {}) {
  const rows = Array.isArray(audiences) ? audiences : [];
  const cards = rows.length
    ? rows.map((a) => `      <a class="aud-card" href="${base}for/${escapeHtml(a.slug)}/">
        <span class="aud-h">${escapeHtml(a.title)}</span>
        <span class="aud-blurb">${escapeHtml(a.problem)}</span>
        <span class="aud-count">${a.laws.length} laws →</span>
      </a>`).join('\n')
    : '<div class="empty">No audiences yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>Find your laws</h1>
      <span class="sub">${rows.length} starting points</span>
    </div>
    <p class="sec-lede">The index is big. These are curated ways in — the laws that matter most for what you do, with the noise stripped out. Pick the one that sounds like you.</p>
    <div class="aud-grid">
${cards}
    </div>
  </div>
</section>
`;

  const description =
    'Curated entry points into The Law Tome for engineers, decision-makers, writers, leaders, and the endlessly curious — the named laws that matter most for what you do.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Find your laws',
    url: `${origin}${base}for/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
    ...(rows.length ? {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: rows.length,
        itemListElement: rows.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.title, url: `${origin}${base}for/${a.slug}/` })),
      },
    } : {}),
  }];

  return (
    head({
      title: 'Named Laws for Engineers, Decision-Makers, Writers & More | The Law Tome',
      description,
      base,
      origin,
      path: 'for/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}

/** One audience: a persona hero, then its curated laws as a card grid. */
export function audiencePage(audience, { base = '/', origin = '', count } = {}) {
  const a = audience || {};
  const laws = Array.isArray(a.laws) ? a.laws : [];
  const grid = laws.length
    ? laws.map((l) => lawCard(l, base)).join('\n')
    : '<div class="empty">No laws yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <nav class="crumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}for/">For…</a><span class="sep">/</span>${escapeHtml(a.who || a.title || '')}</nav>
    <div class="sec-head">
      <h1>${escapeHtml(a.title || '')}</h1>
      <span class="sub">${laws.length} ${laws.length === 1 ? 'law' : 'laws'}</span>
    </div>
    <p class="aud-problem">${escapeHtml(a.problem || '')}</p>
    <p class="sec-lede">${escapeHtml(a.blurb || '')}</p>
    <div class="grid">
${grid}
    </div>
    <div class="sec-more"><a class="ghost" href="${base}browse/"><i class="ti ti-arrow-right" aria-hidden="true"></i> Browse the whole index</a></div>
  </div>
</section>
`;

  const description = `${a.title} — ${a.blurb} Curated named laws from The Law Tome.`;

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: a.title,
      url: `${origin}${base}for/${a.slug}/`,
      description: a.blurb,
      isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: laws.length,
        itemListElement: laws.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
        { '@type': 'ListItem', position: 2, name: 'For…', item: `${origin}${base}for/` },
        { '@type': 'ListItem', position: 3, name: a.title },
      ],
    },
  ];

  return (
    head({
      title: `${a.title} — Named Laws Worth Knowing | The Law Tome`,
      description,
      base,
      origin,
      path: `for/${a.slug}/`,
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
