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

  // Surname initial, accent-folded ("Ångström" -> A, "Émile Durkheim" -> D), used
  // to break the A–Z list into letter-anchored sections and drive the jump-bar.
  const initial = (person) => {
    const parts = String(person || '').trim().split(/\s+/);
    const c = (parts[parts.length - 1] || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : '#';
  };

  // A–Z, grouped by surname initial with an id anchor per letter. rows arrive
  // surname-sorted, so a single pass emits a heading whenever the initial changes.
  let alpha = '';
  const present = new Set();
  if (rows.length) {
    let cur = null;
    for (const g of rows) {
      const ltr = initial(g.person);
      present.add(ltr);
      if (ltr !== cur) {
        if (cur !== null) alpha += '\n    </div>';
        alpha += `\n    <h3 class="ep-letter" id="az-${ltr === '#' ? 'sym' : ltr}">${ltr === '#' ? '#' : ltr}</h3>\n    <div class="ep-list">`;
        cur = ltr;
      }
      alpha += '\n' + row(g);
    }
    alpha += '\n    </div>';
  }

  // Jump-bar: every A–Z letter plus '#', letters with no namesake shown inert so
  // the row never reflows between pages.
  const alphabet = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  const jump = rows.length
    ? `    <nav class="az-nav" aria-label="Jump to letter">
${alphabet.map((L) => {
        const id = L === '#' ? 'sym' : L;
        return present.has(L)
          ? `      <a href="#az-${id}">${L}</a>`
          : `      <span aria-hidden="true">${L}</span>`;
      }).join('\n')}
    </nav>
`
    : '';

  const all = rows.length
    ? `    <h2 class="ep-h2" id="az">Every namesake, A–Z</h2>
${jump}${alpha}`
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
