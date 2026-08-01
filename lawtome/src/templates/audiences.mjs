// Audience "for …" pages — persona landing pages.
//   audiencesIndexPage(audiences, …) → /for/            (the hub)
//   audiencePage(audience, …)        → /for/<slug>/      (one persona)
// The per-audience grid reuses the shared lawCard. Copy is editorial framing;
// every law is an existing, sourced entry.

import { head, sprite, header, footer, escapeHtml, lawCard, figureStrip } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd, hubTiles, dominantField } from './hub.mjs';

/**
 * The hub: one panel per audience.
 *
 * As with /collections/, the panels used to be closed doors — a title, a
 * problem, a count. Each now shows the laws it is recommending, because the
 * recommendation IS the content and a reader deciding which persona is theirs
 * should be able to judge it from the names.
 */
export function audiencesIndexPage(audiences = [], { base = '/', origin = '', count, images } = {}) {
  const rows = Array.isArray(audiences) ? audiences : [];
  const total = rows.reduce((n, a) => n + a.laws.length, 0);
  const cards = rows.length
    ? rows.map((a, i) => {
      const laws = a.laws || [];
      const shown = laws.slice(0, 8);
      const rest = laws.length - shown.length;
      const art = hubTiles(images, laws, { base });
      return `      <article class="hcard${art ? '' : ' hcard--noart'}" data-c="${escapeHtml(dominantField(laws))}" id="a-${escapeHtml(a.slug)}">
        <a class="hcard-hit" href="${base}for/${escapeHtml(a.slug)}/" aria-label="${escapeHtml(a.title)} — ${laws.length} laws"></a>
${art}        <span class="hcard-no" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <div class="hcard-body">
          <h2 class="hcard-h">${escapeHtml(a.title)}</h2>
          <p class="hcard-blurb">${escapeHtml(a.problem)}</p>
          <ul class="coll-laws">
${shown.map((l) => `            <li><a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a></li>`).join('\n')}
${rest > 0 ? `            <li class="coll-rest"><a href="${base}for/${escapeHtml(a.slug)}/">+${rest} more</a></li>\n` : ''}          </ul>
          <p class="hcard-cta"><span class="hcard-n">${laws.length}</span> laws <span class="hcard-arrow" aria-hidden="true">→</span></p>
        </div>
      </article>`;
    }).join('\n')
    : '<div class="empty">No audiences yet.</div>';

  const answer = rows.length
    ? `The Law Tome has ${rows.length} curated reading lists for particular kinds of work — ${rows.map((a) => `<a href="${base}for/${escapeHtml(a.slug)}/">${escapeHtml(a.title)}</a>`).join(', ')} — recommending ${total} of its named laws between them.`
    : 'Curated reading lists of named laws for particular kinds of work.';

  const lede = `Over a thousand entries is too many to read and the wrong ones are worse than none. Each list below is short on purpose: the laws that keep coming up in one kind of work, in the order they tend to bite. If none of them is you, <a href="${base}situations/">start from the situation</a> or <a href="${base}browse/">browse the lot</a>.`;

  const faq = hubFaq([
    {
      q: 'Which named laws should I actually know?',
      a: `It depends what you do, which is why there are ${rows.length} lists rather than one. ${rows.map((a) => `<a href="${base}for/${escapeHtml(a.slug)}/">${escapeHtml(a.title)}</a> (${a.laws.length})`).join(', ')}.`,
    },
    ...rows.slice(0, 6).map((a) => ({
      q: `What laws should ${String(a.who || a.title).toLowerCase()} know?`,
      a: `${escapeHtml(a.problem)} This list has ${a.laws.length}, starting with ${a.laws.slice(0, 5).map((l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`).join(', ')}. <a href="${base}for/${escapeHtml(a.slug)}/">Read the list</a>.`,
    })),
    {
      q: 'How were these picked?',
      a: 'By hand, from the entries already in the index. Every law on a list has its own page with sources; the list is an editorial ordering of existing material, not extra claims about it.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Find your laws',
    sub: `${rows.length} starting points`,
    answer,
    lede,
    stats: [[rows.length, 'reading lists'], [total, 'laws recommended']],
    base,
  })}    <div class="hcard-grid" data-reveal-stagger>
${cards}
    </div>
${faq.html}${hubNav('for/', { base })}  </div>
</section>
`;

  const description = rows.length
    ? `${rows.length} curated reading lists of named laws — ${rows.slice(0, 5).map((a) => a.title).join(', ')} — recommending ${total} entries for the work you actually do.`
    : 'Curated entry points into The Law Tome for engineers, decision-makers, writers, leaders, and the endlessly curious.';

  const jsonld = [
    ...hubJsonLd({
      name: 'Find your laws',
      description,
      path: 'for/',
      items: rows.map((a) => ({ name: a.title, href: `for/${a.slug}/` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

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
export function audiencePage(audience, { base = '/', origin = '', count, images } = {}) {
  const a = audience || {};
  const laws = Array.isArray(a.laws) ? a.laws : [];
  const grid = laws.length
    ? laws.map((l) => lawCard(l, base, 2)).join('\n')
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
${figureStrip(images, laws, { base })}    <div class="grid">
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
