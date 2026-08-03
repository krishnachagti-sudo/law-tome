// /situations/{theme}/ — one problem, the laws that name it.
//
// The situations hub answers "what is this called" for 581 problems at once,
// which makes it a good browse and a poor landing page: nobody searches for 581
// things. These pages are the same rows cut by problem, so the reader who typed
// "why do metrics stop working" arrives somewhere that is about that and not
// about the other 569.
//
// The rows are unchanged — same authored sentence, same answering entry, same
// rating. What is new is only which page they appear on, and the page says so
// out loud rather than implying an editor sat down and curated it.

import {
  head, sprite, header, footer, escapeHtml, reliabilityClass, personSlug, shareRow,
} from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';
import { monogram } from './eponyms.mjs';
import { problemPath } from '../../build/problems.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

function row({ situation, law }, { base, people }) {
  const por = law.namedAfter ? people[personSlug(law.namedAfter)] : null;
  const face = por
    ? `<img class="sit-face" src="${base}assets/img/people/${escapeHtml(por.slug)}.webp" alt="" loading="lazy" decoding="async">`
    : law.namedAfter
      ? `<span class="sit-face sit-mono" aria-hidden="true">${escapeHtml(monogram(law.namedAfter))}</span>`
      : '<span class="sit-face sit-face--none" aria-hidden="true"></span>';
  const badge = law.reliability
    ? `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span>`
    : '<span class="badge badge--none" aria-hidden="true"></span>';
  return `        <a class="sit-row" href="${base}laws/${escapeHtml(law.slug)}/" data-c="${escapeHtml(law.category || '')}">
          ${face}
          <span class="sit-desc">${escapeHtml(situation)}</span>
          <span class="sit-answer"><span class="sit-name">${escapeHtml(law.name)}</span>${badge}<span class="sit-arrow" aria-hidden="true">→</span></span>
        </a>`;
}

/**
 * One problem theme.
 * @param {object} theme from build/problems.problems()
 * @param {object} o
 * @param {object[]} [o.siblings] the other themes, for the footer nav
 * @param {number} [o.total] every situation on the hub, themed or not
 */
export function problemPage(theme, {
  base = '/', origin = '', count, siblings = [], images, total,
} = {}) {
  const { title, question, rows, fields, keywords } = theme;
  const people = (images && images.people) || {};
  const path = problemPath(theme);

  const answer = `${num(rows.length)} everyday situations about ${title.toLowerCase()}, each paired with the named law, principle or effect that describes it and a rating for how far the evidence behind that law goes. The answers are drawn from ${fields} ${fields === 1 ? 'field' : 'different fields'} — the problem is one thing, the disciplines that have named it are several.`;

  const lede = `${escapeHtml(question)} You know the shape of it; what you are missing is the name, and a name is what makes a thing arguable in a meeting. Read down the left column until a line sounds like your week, then follow it to the sourced entry — statement, origin, sources, and an honest note on where the idea runs out.`;

  const faq = hubFaq([
    {
      q: 'How were these situations chosen for this page?',
      a: `By matching each situation's own wording against a short vocabulary for this theme — ${keywords.slice(0, 6).map((k) => `<i>${escapeHtml(k)}</i>`).join(', ')} and a dozen more. The themes are our judgement; the sorting of ${total ? `${num(total)} situations` : 'the situations'} into them is computed from the text, so nothing was quietly filed where it looked best. A situation that matches two themes appears on the stronger one only, and ${total ? `the ones that match none stay on <a href="${base}situations/">the full map</a>` : 'unmatched situations stay on the full map'}.`,
    },
    {
      q: 'Does a named law actually solve the problem?',
      a: `No, and none of these pages claim it does. A name makes a recurring problem discussable and lets you find out who has already studied it. Whether the underlying claim holds up is a separate question, which is why every answer here carries a <a href="${base}reliability/">reliability rating</a> — and why <a href="${base}how-solid/">the best-known laws turn out to be the least likely to rest on measurement</a>.`,
    },
    {
      q: 'My problem is not on this list.',
      a: `Try <a href="${base}situations/">the full map</a>, which holds every situation in the index, or <a href="${base}">describe it on the home page</a> — the search matches on situation wording as well as names. If nothing fits, <a href="${base}coin/">the naming form</a> is where a genuinely unnamed one goes.`,
    },
  ], { heading: 'About this page' });

  const others = siblings.filter((s) => s.slug !== theme.slug);
  const nav = others.length
    ? `    <nav class="pb-others" aria-label="Other problems">
      <h2 class="sk-others-h">Other problems people look up</h2>
      <div class="pb-others-row">
${others.map((s) => `        <a class="sk-other" href="${base}${problemPath(s)}">${escapeHtml(s.title)}<span class="sk-other-n">${s.count}</span></a>`).join('\n')}
      </div>
    </nav>
`
    : '';

  const section = `<section class="sec">
  <div class="wrap">
${hubHead({
    title,
    sub: `${num(rows.length)} ${rows.length === 1 ? 'situation' : 'situations'}, named`,
    answer,
    lede,
    base,
    crumbs: [['situations/', "What's the law for…?"]],
    stats: [
      [num(rows.length), 'situations'],
      [fields, fields === 1 ? 'field' : 'fields answer them'],
      [total ? num(total) : '—', 'on the full map'],
    ],
  })}    <div class="sit-list">
${rows.map((r) => row(r, { base, people })).join('\n')}
    </div>

    <div class="sk-share">
${shareRow({
    url: `${origin}${base}${path}`,
    title: `${title}: ${num(rows.length)} problems and the named laws for them`,
    text: question,
    label: 'Share this page',
  })}    </div>

${nav}${faq.html}${hubNav('situations/', { base })}  </div>
</section>
`;

  const description = `${question} ${num(rows.length)} everyday situations about ${title.toLowerCase()}, each mapped to the named law that describes it — with sources and a rating for how solid each one is.`;

  return (
    head({
      title: `${title}: What's the Law for This? | The Law Tome`,
      description,
      base,
      origin,
      path,
      jsonld: [
        ...hubJsonLd({
          name: title,
          description,
          path,
          origin,
          base,
          crumbs: [['situations/', "What's the law for…?"]],
          items: rows.map((r) => ({ name: r.situation, url: `${origin}${base}laws/${r.law.slug}/` })),
        }),
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: rows.map(({ situation, law }) => ({
            '@type': 'Question',
            name: `What law explains this: ${situation}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${law.name}${law.statement ? ` — ${law.statement}` : ''}`,
            },
          })),
        },
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
    sprite() +
    header({ base, active: 'situations', count }) +
    section +
    footer({ base })
  );
}
