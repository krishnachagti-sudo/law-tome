// Timeline (/timeline/) — browse laws by the century they were coined.
//
// A history-of-ideas view built from eraGroups: each century is a section, its
// laws listed chronologically with the year. Undated laws sit in a final bucket.
// Uses only existing coinedYear data.

import { head, sprite, header, footer, escapeHtml, figureStrip } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

/**
 * Stable anchor id for an era label ("20th century" -> "era-20th-century").
 * Exported so the law page can deep-link its "Coined" tile at the right century
 * instead of re-deriving (and drifting from) this format.
 */
export function eraId(label) {
  return 'era-' + String(label || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Ordinal century label for a year: 1975 -> "20th century". Mirrors build/timeline.mjs. */
export function centuryLabelForYear(year) {
  const y = Number(year);
  if (!Number.isFinite(y) || y < 1) return '';
  const c = Math.floor((y - 1) / 100) + 1;
  const suffix = (c % 10 === 1 && c % 100 !== 11) ? 'st'
    : (c % 10 === 2 && c % 100 !== 12) ? 'nd'
      : (c % 10 === 3 && c % 100 !== 13) ? 'rd' : 'th';
  return `${c}${suffix} century`;
}

export function timelinePage(eras = [], { base = '/', origin = '', count, images } = {}) {
  const rows = Array.isArray(eras) ? eras : [];
  const total = rows.reduce((n, e) => n + e.laws.length, 0);
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;
  const eraBlock = (e) => {
    const items = e.laws.map((l) => {
      const yr = (l.coinedYear != null && Number(l.coinedYear) >= 1) ? String(l.coinedYear) : '—';
      return `        <a class="tl-item" href="${permalink(l.slug)}"><span class="tl-year">${escapeHtml(yr)}</span><span class="tl-name">${escapeHtml(l.name)}</span></a>`;
    }).join('\n');
    return `    <section class="tl-era" id="${eraId(e.label)}">
      <h2 class="tl-eyebrow">${escapeHtml(e.label)}<span class="tl-count">${e.laws.length}</span></h2>
${figureStrip(images, e.laws, { base, limit: 8, min: 4 })}      <div class="tl-items">
${items}
      </div>
    </section>`;
  };

  // Jump-bar to each era so the reader isn't stuck scrolling the whole timeline.
  const jump = rows.length > 1
    ? `    <nav class="az-nav" aria-label="Jump to era">
${rows.map((e) => `      <a href="#${eraId(e.label)}">${escapeHtml(e.label)}</a>`).join('\n')}
    </nav>
`
    : '';

  const body = rows.length ? jump + rows.map(eraBlock).join('\n') : '<div class="empty">No dated laws yet.</div>';

  // Facts the page can state about itself, all read off the corpus: the span it
  // covers, the busiest century, and how many entries carry no date at all —
  // that last one matters, because a timeline that hides its gaps is lying.
  const years = rows.flatMap((e) => e.laws.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y) && y >= 1));
  const earliest = years.length ? Math.min(...years) : null;
  const latest = years.length ? Math.max(...years) : null;
  const dated = years.length;
  const undated = total - dated;
  const busiest = rows.filter((e) => e.laws.some((l) => Number(l.coinedYear) >= 1))
    .slice().sort((a, b) => b.laws.length - a.laws.length)[0];
  const yr = (y) => (y < 0 ? `${Math.abs(y)} BC` : String(y));

  const answer = total
    ? `This timeline places ${dated.toLocaleString('en-US')} of The Law Tome's ${total.toLocaleString('en-US')} named laws in the century each was coined${earliest != null ? `, spanning ${yr(earliest)} to ${yr(latest)}` : ''}.${busiest ? ` The <a href="#${eraId(busiest.label)}">${escapeHtml(busiest.label)}</a> is the busiest by a wide margin, with ${busiest.laws.length} of them.` : ''}${undated > 0 ? ` The remaining ${undated} carry no date anyone can pin down, and are grouped at the end rather than guessed at.` : ''}`
    : 'A chronological view of named laws, grouped by the century each was coined.';

  const lede = `The index read as a history of ideas. A century here is when the law got its <em>name</em>, not when the thing it describes started happening — Zipf did not invent the distribution he measured, and gravity predates <a href="${base}browse/">the entry</a> by some margin. Dates come from the corpus's coinedYear field, and where a date is disputed or unknown the entry says so instead of picking one.`;

  const faq = hubFaq([
    {
      q: 'What is the oldest named law here?',
      a: earliest != null
        ? `The earliest dated entry is from ${yr(earliest)}. Ancient maxims cluster in the first eras of the timeline above; most of the index is far younger.`
        : 'No entry currently carries a date.',
    },
    {
      q: 'When were most named laws coined?',
      a: busiest
        ? `The ${escapeHtml(busiest.label)} accounts for the largest share — ${busiest.laws.length} of ${total.toLocaleString('en-US')} entries. <a href="#${eraId(busiest.label)}">Jump to it</a>.`
        : 'The corpus has no dated entries yet.',
    },
    {
      q: 'Does the date mean when the law was discovered?',
      a: 'No. It is when the principle acquired the name it now goes by, which is often decades after the underlying work and sometimes by someone other than the namesake. Each law page gives the fuller story and its sources.',
    },
    ...(undated > 0 ? [{
      q: 'Why are some laws undated?',
      a: `${undated} of the ${total.toLocaleString('en-US')} entries have no date anyone can pin down — a phrase in circulation before it was written down, or an attribution the sources disagree on. Rather than invent a year, they are grouped separately.`,
    }] : []),
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'A timeline of named laws',
    sub: `${total.toLocaleString('en-US')} laws across ${rows.length} ${rows.length === 1 ? 'era' : 'eras'}`,
    answer,
    lede,
    stats: [
      [total.toLocaleString('en-US'), 'laws placed'],
      ...(earliest != null ? [[`${yr(earliest)}–${yr(latest)}`, 'span']] : []),
      [rows.length, 'eras'],
      ...(undated > 0 ? [[undated, 'undated']] : []),
    ],
    base,
  })}${body}
${faq.html}${hubNav('timeline/', { base })}  </div>
</section>
`;

  const description = total
    ? `${total.toLocaleString('en-US')} named laws, principles and effects placed in the century each was coined${earliest != null ? `, from ${yr(earliest)} to ${yr(latest)}` : ''} — a history of ideas from The Law Tome.`
    : 'A chronological view of named laws, principles, and effects — grouped by the century each was coined.';

  const jsonld = [
    ...hubJsonLd({
      name: 'A timeline of named laws',
      description,
      path: 'timeline/',
      items: rows.map((e) => ({ name: `${e.label} (${e.laws.length} laws)` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

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
