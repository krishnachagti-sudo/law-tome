// "Situations" — a reverse-lookup page: browse problems, not names.
//
// Each row is a plain-language situation paired with the one law that names it,
// linking to that law. It's the front door for the reader who has the feeling
// but not the vocabulary — the same job the search fallback does for typed
// queries, made browsable. Fabricates nothing: every row points at an existing
// entry (build/situations.resolveSituations drops any unknown slug).

import { head, sprite, header, footer, escapeHtml, reliabilityClass } from './partials.mjs';

/**
 * @param {{situation:string, law:object}[]} situations resolved rows.
 * @param {object} o
 * @param {string} [o.base='/'] site base path.
 * @param {string} [o.origin=''] absolute origin.
 * @param {number|string} [o.count] published-law count for the masthead.
 */
export function situationsPage(situations = [], { base = '/', origin = '', count, categories = {} } = {}) {
  const rows = Array.isArray(situations) ? situations : [];
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;

  // Name, then badge, then the arrow LAST so it pins to the row's right edge.
  // With the arrow leading a variable-length name it landed at a different x on
  // every row, giving the column a jittery edge.
  const row = ({ situation, law }) => {
    const badge = law.reliability
      ? `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span>`
      : '<span class="badge badge--none" aria-hidden="true"></span>';
    return `        <a class="sit-row" href="${permalink(law.slug)}">
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

  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>What's the law for…?</h1>
      <span class="sub">${rows.length} common ${rows.length === 1 ? 'situation' : 'situations'}</span>
    </div>
    <p class="sec-lede">You know the feeling but not the name for it. Find the situation you're in and jump to the law that describes it — or <a href="${base}">describe what's happening from the home page</a> and let search find the match.</p>
${jump}    <div class="sit-list">
${items}
    </div>
  </div>
</section>
`;

  const description =
    'What law describes this? A reverse lookup from common situations — a target that gets gamed, a project that runs late, a rule nobody remembers the reason for — to the named law that explains each one.';

  // FAQPage: each situation is a "What law explains …?" Q with the law as answer.
  // The situation text is a whole authored line and the law name is corpus data,
  // so the structured data matches the visible rows exactly (no spam risk).
  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: rows.map(({ situation, law }) => ({
      '@type': 'Question',
      name: `What law explains this: ${situation}?`,
      acceptedAnswer: { '@type': 'Answer', text: `${law.name}${law.statement ? ` — ${law.statement}` : ''}` },
    })),
  }];

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
