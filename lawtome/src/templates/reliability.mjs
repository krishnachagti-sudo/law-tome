// The reliability hub — /reliability/. A faceted-browse landing that explains
// the four-tier veracity scale and links to a page per tier. Every entry in the
// corpus carries a reliability rating; this makes that rating a browsable axis,
// so a reader who wants "the disputed ones" (Contested) or "the measured ones"
// (Empirical) has a front door. Leans into the project's honesty about which
// "laws" are proven and which are folklore — the thing the credulous listicles
// never tell you.

import {
  head, sprite, header, footer, escapeHtml,
  reliabilityClass, reliabilitySlug, RELIABILITY_TIERS, RELIABILITY_NOTE,
} from './partials.mjs';

/**
 * @param {object[]} tiers [{ value, count }] for the tiers PRESENT in the corpus,
 *   supplied by the build (already counted). Rendered in canonical scale order.
 * @param {object} o
 * @param {string} [o.base='/'] site base path.
 * @param {string} [o.origin=''] absolute origin.
 * @param {number|string} [o.count] published-law count for the masthead.
 */
export function reliabilityHubPage(tiers = [], { base = '/', origin = '', count } = {}) {
  const present = new Map((Array.isArray(tiers) ? tiers : []).map((t) => [t.value, t.count]));
  // Canonical order, keeping only tiers that actually have members.
  const ordered = RELIABILITY_TIERS.filter((v) => present.has(v)).map((v) => ({ value: v, count: present.get(v) }));

  const cards = ordered.map((t) => `      <a class="rel-tier ${reliabilityClass(t.value)}" href="${base}reliability/${reliabilitySlug(t.value)}/">
        <span class="rt-top"><span class="badge ${reliabilityClass(t.value)}">${escapeHtml(t.value)}</span><span class="rt-count">${t.count}</span></span>
        <span class="rt-note">${escapeHtml(RELIABILITY_NOTE[t.value] || '')}</span>
      </a>`).join('\n');

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>How reliable is each law?</h1>
      <span class="sub">${ordered.length} tiers</span>
    </div>
    <p class="sec-lede">Not every "law" is proven. Each entry is rated on a four-tier scale — from measured evidence to disputed claim to plain folklore — so you always know whether you're reading a finding or a saying. Pick a tier to browse it.</p>
    <div class="rel-tiers">
${cards || '<div class="empty">No ratings yet.</div>'}
    </div>
  </div>
</section>
`;

  const description =
    'How reliable is each named law? Browse the corpus by veracity — Empirical, Heuristic, Folk-adage, or Contested — and see which principles are measured findings and which are folklore.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
      { '@type': 'ListItem', position: 2, name: 'Browse', item: `${origin}${base}browse/` },
      { '@type': 'ListItem', position: 3, name: 'Reliability' },
    ],
  }];

  return (
    head({
      title: 'Reliability of Named Laws — Empirical to Contested | The Law Tome',
      description,
      base,
      origin,
      path: 'reliability/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
