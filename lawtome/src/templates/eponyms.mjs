// Eponym index (/named-after/) — browse laws by the person they're named after.
//
// A reference index: one row per namesake, their law(s) linked. People with more
// than one law are featured up top (the interesting clusters — "Parkinson's
// laws"), then the full A–Z. Built from eponymGroups; nothing invented.

import { head, sprite, header, footer, escapeHtml } from './partials.mjs';

export function eponymsPage(groups = [], { base = '/', origin = '', count } = {}) {
  const rows = Array.isArray(groups) ? groups : [];
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;
  const lawLinks = (laws) => laws
    .map((l) => `<a href="${permalink(l.slug)}">${escapeHtml(l.name)}</a>`)
    .join('<span class="ep-dot">·</span>');

  const row = (g) => `      <div class="ep-row">
        <span class="ep-person">${escapeHtml(g.person)}${g.laws.length > 1 ? `<span class="ep-badge">${g.laws.length}</span>` : ''}</span>
        <span class="ep-laws">${lawLinks(g.laws)}</span>
      </div>`;

  const multi = rows.filter((g) => g.laws.length > 1);
  const featured = multi.length
    ? `    <h2 class="ep-h2">Namesakes with more than one law</h2>
    <div class="ep-list">
${multi.slice().sort((a, b) => b.laws.length - a.laws.length || a.person.localeCompare(b.person, 'en')).map(row).join('\n')}
    </div>
`
    : '';

  const all = rows.length
    ? `    <h2 class="ep-h2">Every namesake, A–Z</h2>
    <div class="ep-list">
${rows.map(row).join('\n')}
    </div>`
    : '<div class="empty">No named laws yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>Laws by their namesake</h1>
      <span class="sub">${rows.length} ${rows.length === 1 ? 'person' : 'people'}</span>
    </div>
    <p class="sec-lede">Every law that carries someone's name, gathered under the person who lent it. Some names turn up more than once — a few thinkers have a whole handful of principles to their credit.</p>
${featured}${all}
  </div>
</section>
`;

  const description =
    'Browse named laws by the person behind them — every principle, effect, and razor gathered under its namesake, from the one-law figures to the thinkers with several to their name.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Laws by their namesake',
    url: `${origin}${base}named-after/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
  }];

  return (
    head({
      title: 'Named Laws by Their Namesake — The Eponym Index | The Law Tome',
      description,
      base,
      origin,
      path: 'named-after/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
