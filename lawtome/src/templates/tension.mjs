// "Laws in tension" — a whole-corpus view of the pairs that contradict each other.
//
// Built from build/relations.tensionPairs(laws). Each pair is shown as two
// facing panels (statement + reliability badge, each linking to its law page)
// with a "vs" divider. We deliberately do NOT author a per-pair "why they
// disagree" sentence — that would be fabrication. Letting the two statements sit
// side by side is the honest presentation: the corpus says they are in tension;
// the reader sees both claims and the tension speaks for itself.

import { head, sprite, header, footer, escapeHtml, reliabilityClass } from './partials.mjs';

/**
 * @param {{a:object,b:object,kind:string}[]} pairs from tensionPairs().
 * @param {object} o
 * @param {string} [o.base='/'] site base path (must end with '/').
 * @param {string} [o.origin=''] absolute origin for canonical/JSON-LD.
 * @param {number|string} [o.count] published-law count for the masthead.
 */
export function tensionPage(pairs = [], { base = '/', origin = '', count } = {}) {
  const rows = Array.isArray(pairs) ? pairs : [];
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;

  const side = (law) => {
    const badge = law.reliability
      ? `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span>`
      : '';
    const say = law.statement ? `<p class="ten-say">"${escapeHtml(law.statement)}"</p>` : '';
    return `      <a class="ten-side" href="${permalink(law.slug)}">
        <span class="ten-top"><span class="ten-no">№ ${escapeHtml(law.no)}</span>${badge}</span>
        <span class="ten-name">${escapeHtml(law.name)}</span>
        ${say}
      </a>`;
  };

  const cards = rows.length
    ? rows.map((p) => `    <div class="ten-pair" data-reveal>
${side(p.a)}
      <div class="ten-vs" aria-hidden="true"><span>vs</span></div>
${side(p.b)}
    </div>`).join('\n')
    : '<div class="empty">No opposing pairs yet.</div>';

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>Laws in tension</h1>
      <span class="sub">${rows.length} opposing ${rows.length === 1 ? 'pair' : 'pairs'}</span>
    </div>
    <p class="sec-lede">Not every principle agrees with the others. These are the pairs the corpus marks as pulling in opposite directions — one law's advice is the other's warning. Read them together and decide which one your situation calls for.</p>
    <div class="ten-grid">
${cards}
    </div>
  </div>
</section>
`;

  const description =
    'Named laws that contradict each other — the principles that pull in opposite directions, shown side by side so you can weigh both. A cross-corpus view from The Law Tome.';

  // CollectionPage listing each opposing pair's two members as an ItemList.
  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Laws in tension',
    url: `${origin}${base}tension/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
    ...(rows.length ? {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: rows.length,
        itemListElement: rows.slice(0, 100).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${p.a.name} vs ${p.b.name}`,
        })),
      },
    } : {}),
  }];

  return (
    head({
      title: 'Laws in Tension — Principles That Contradict Each Other | The Law Tome',
      description,
      base,
      origin,
      path: 'tension/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
