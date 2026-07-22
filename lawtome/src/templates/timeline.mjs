// Timeline (/timeline/) — browse laws by the century they were coined.
//
// A history-of-ideas view built from eraGroups: each century is a section, its
// laws listed chronologically with the year. Undated laws sit in a final bucket.
// Uses only existing coinedYear data.

import { head, sprite, header, footer, escapeHtml } from './partials.mjs';

export function timelinePage(eras = [], { base = '/', origin = '', count } = {}) {
  const rows = Array.isArray(eras) ? eras : [];
  const total = rows.reduce((n, e) => n + e.laws.length, 0);
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;

  const eraBlock = (e) => {
    const items = e.laws.map((l) => {
      const yr = (l.coinedYear != null && Number(l.coinedYear) >= 1) ? String(l.coinedYear) : '—';
      return `        <a class="tl-item" href="${permalink(l.slug)}"><span class="tl-year">${escapeHtml(yr)}</span><span class="tl-name">${escapeHtml(l.name)}</span></a>`;
    }).join('\n');
    return `    <section class="tl-era">
      <h2 class="tl-eyebrow">${escapeHtml(e.label)}<span class="tl-count">${e.laws.length}</span></h2>
      <div class="tl-items">
${items}
      </div>
    </section>`;
  };

  const body = rows.length ? rows.map(eraBlock).join('\n') : '<div class="empty">No dated laws yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>A timeline of named laws</h1>
      <span class="sub">${total} dated across ${rows.length} ${rows.length === 1 ? 'era' : 'eras'}</span>
    </div>
    <p class="sec-lede">The index read as a history of ideas — every law placed in the century it was named, from ancient maxims to principles coined in living memory.</p>
${body}
  </div>
</section>
`;

  const description =
    'A chronological view of named laws, principles, and effects — grouped by the century each was coined, from antiquity to the present. A history of ideas from The Law Tome.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'A timeline of named laws',
    url: `${origin}${base}timeline/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
  }];

  return (
    head({
      title: 'Timeline of Named Laws — A History of Ideas by Century | The Law Tome',
      description,
      base,
      origin,
      path: 'timeline/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
