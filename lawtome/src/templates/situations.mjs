// "Situations" — a reverse-lookup page: browse problems, not names.
//
// Each row is a plain-language situation paired with the one law that names it,
// linking to that law. It's the front door for the reader who has the feeling
// but not the vocabulary — the same job the search fallback does for typed
// queries, made browsable. Fabricates nothing: every row points at an existing
// entry (build/situations.resolveSituations drops any unknown slug).

import { head, sprite, header, footer, escapeHtml, reliabilityClass, personSlug } from './partials.mjs';
import { hubHead, hubNav, hubJsonLd } from './hub.mjs';

/**
 * @param {{situation:string, law:object}[]} situations resolved rows.
 * @param {object} o
 * @param {string} [o.base='/'] site base path.
 * @param {string} [o.origin=''] absolute origin.
 * @param {number|string} [o.count] published-law count for the masthead.
 */
export function situationsPage(situations = [], { base = '/', origin = '', count, categories = {}, images } = {}) {
  const rows = Array.isArray(situations) ? situations : [];
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;

  // Name, then badge, then the arrow LAST so it pins to the row's right edge.
  // With the arrow leading a variable-length name it landed at a different x on
  // every row, giving the column a jittery edge.
  // The answering law's own face, where it has one. A reverse-lookup table is
  // the most list-like thing on the site; a column of the people who named
  // these things turns it into something you scan rather than read.
  const people = (images && images.people) || {};
  const figures = (images && images.figures) || {};
  const face = (law) => {
    const por = law.namedAfter ? people[personSlug(law.namedAfter)] : null;
    if (por) return `<img class="sit-face" src="${base}assets/img/people/${escapeHtml(por.slug)}.webp" alt="" loading="lazy" decoding="async">`;
    if (figures[law.slug]) return `<img class="sit-face sit-face--fig" src="${base}assets/img/figures/${escapeHtml(law.slug)}.webp" alt="" loading="lazy" decoding="async">`;
    return '<span class="sit-face sit-face--none" aria-hidden="true"></span>';
  };
  const row = ({ situation, law }) => {
    const badge = law.reliability
      ? `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span>`
      : '<span class="badge badge--none" aria-hidden="true"></span>';
    return `        <a class="sit-row" href="${permalink(law.slug)}" data-c="${escapeHtml(law.category || '')}">
          ${face(law)}
          <span class="sit-desc">${escapeHtml(situation)}</span>
          <span class="sit-answer"><span class="sit-name">${escapeHtml(law.name)}</span>${badge}<span class="sit-arrow" aria-hidden="true">→</span></span>
        </a>`;
  };

  // Group by the answering law's field, so the map reads as themed sections
  // instead of one undifferentiated run. Largest groups lead.
  const groups = new Map();
  for (const r of rows) {
    const k = (r.law && r.law.category) || 'other';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  }
  const ordered = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0])));
  const label = (k) => categories[k] || k;
  const gid = (k) => 'sit-' + String(label(k)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const items = rows.length
    ? ordered.map(([k, rs]) => `      <section class="sit-group" id="${gid(k)}">
        <h2 class="sit-group-h">${categories[k] ? `<a href="${base}category/${escapeHtml(k)}/">${escapeHtml(label(k))}</a>` : escapeHtml(label(k))}<span class="sit-group-n">${rs.length}</span></h2>
${rs.map(row).join('\n')}
      </section>`).join('\n')
    : '<div class="empty">No situations yet.</div>';

  const jump = ordered.length > 1
    ? `    <nav class="az-nav" aria-label="Jump to field">
${ordered.map(([k, rs]) => `      <a href="#${gid(k)}">${escapeHtml(label(k))} <span class="az-n">${rs.length}</span></a>`).join('\n')}
    </nav>
`
    : '';

  const answer = rows.length
    ? `This page maps ${rows.length} everyday situations — a target that gets gamed, a meeting that fills its hour, a rule nobody remembers the reason for — each onto the named law that describes it, across ${ordered.length} ${ordered.length === 1 ? 'field' : 'fields'}. Read down the left column until something sounds like your week, then follow the link.`
    : 'A reverse lookup: describe the situation, find the named law for it.';

  const lede = `You know the feeling but not the name for it, and a name is what makes a thing arguable in a meeting. Every row here is a plain-language description paired with the one law that names it. Nothing on this page is hypothetical — each answer is <a href="${base}browse/">an entry in the index</a> with its sources and its <a href="${base}reliability/">reliability rating</a>. If your situation isn't listed, <a href="${base}">describe it on the home page</a> and let search find the match.`;

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: "What's the law for…?",
    sub: `${rows.length} common ${rows.length === 1 ? 'situation' : 'situations'}`,
    answer,
    lede,
    stats: [[rows.length, 'situations mapped'], [ordered.length, 'fields covered']],
    base,
  })}${jump}    <div class="sit-list">
${items}
    </div>
${hubNav('situations/', { base })}  </div>
</section>
`;

  const description = rows.length
    ? `What law describes this? ${rows.length} everyday situations — a target that gets gamed, a project that runs late, a rule nobody remembers the reason for — each mapped to the named law that explains it.`
    : 'What law describes this? A reverse lookup from common situations to the named law that explains each one.';

  // FAQPage: each situation is a "What law explains …?" Q with the law as answer.
  // The situation text is a whole authored line and the law name is corpus data,
  // so the structured data matches the visible rows exactly (no spam risk).
  const jsonld = [
    ...hubJsonLd({
      name: "What's the law for…?",
      description,
      path: 'situations/',
      items: rows.map(({ situation, law }) => ({ name: situation, href: `laws/${law.slug}/` })),
      origin,
      base,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: rows.map(({ situation, law }) => ({
        '@type': 'Question',
        name: `What law explains this: ${situation}?`,
        acceptedAnswer: { '@type': 'Answer', text: `${law.name}${law.statement ? ` — ${law.statement}` : ''}` },
      })),
    },
  ];

  return (
    head({
      title: "What's the Law for…? — Situations to Named Laws | The Law Tome",
      description,
      base,
      origin,
      path: 'situations/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'situations', count }) +
    section +
    footer({ base })
  );
}
