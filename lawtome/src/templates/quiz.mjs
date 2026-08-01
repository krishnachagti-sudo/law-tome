// Quiz page — "Name that law", and three other ways to be wrong about a law.
//
// A static shell filled by src/assets/quiz.js, which fetches the prebuilt search
// index and runs a ten-question round. The law of the day used to share this
// page; it now opens the home page, where people actually arrive, and this page
// is the game alone.
//
// Four question modes, all answerable from data the index already carries — no
// new build artefact, no claim the corpus cannot back:
//   1. Name that law     — a statement, four names.
//   2. What does it say? — a name, four statements.
//   3. Which field?      — a law, four disciplines.
//   4. How reliable?     — a law, the four rating tiers.
// The last is the one worth playing: the whole point of rating every entry is
// that a measured finding and a catchy saying look identical until you check.
//
// With JS off the shell says so and points at the index — no dead page.

import { head, sprite, header, footer, escapeHtml, asset } from './partials.mjs';
import { hubFaq } from './hub.mjs';

const MODES = [
  ['Name that law', 'A statement appears; pick the law it belongs to.'],
  ['What does it say?', 'A law appears; pick the statement that is actually its own.'],
  ['Which field?', 'Name the discipline the law came out of.'],
  ['How reliable?', 'Empirical, Heuristic, Folk-adage or Contested — say how far this one can be trusted.'],
];

export function quizPage({ base = '/', origin = '', count, categories = {} } = {}) {
  const nf = new Intl.NumberFormat('en');
  const n = count == null ? null : nf.format(count);

  // The client needs the display names for the twenty fields; the slugs alone
  // ("psychology") would make a poor answer next to "Software & systems".
  const catsJson = JSON.stringify(categories).replace(/</g, '\\u003c');

  const faq = hubFaq([
    {
      q: 'What is the Law Tome quiz?',
      a: `A ten-question round drawn at random from ${n ? `all ${n}` : 'every'} entries in the index. Four kinds of question — ${MODES.map(([m]) => m.toLowerCase()).join(', ')} — mixed through the round. Nothing is invented for the game: every question, every wrong answer and every explanation comes from an entry that already exists here, with its own sourced page.`,
    },
    {
      q: 'How do I get better at it?',
      a: `The wrong options are pulled from the same field as the answer wherever the index allows, so guessing by vibe stops working quickly. Every answer links straight to the law's page — the fastest way through the round is to read the ones you miss. <a href="${base}browse/">The index</a> is the study material; <a href="${base}reliability/">the reliability scale</a> is what the fourth mode is testing.`,
    },
    {
      q: 'Where is the law of the day?',
      a: `On <a href="${base}">the front page</a>. It was buried here, which meant almost nobody arriving at the site ever saw it.`,
    },
    {
      q: 'Is my score saved anywhere?',
      a: 'Your best streak is kept in your own browser and never leaves it. There is no account, no server and no tracking — the same as the rest of the site.',
    },
  ], { heading: 'About the quiz' });

  const section = `<section class="sec" id="quiz-sec">
  <div class="wrap">
    <nav class="crumb"><a href="${base}">Home</a><span class="sep">/</span>Quiz</nav>
    <div class="sec-head">
      <h1>Name that law</h1>
      <span class="sub">ten questions, four ways to be wrong</span>
    </div>
    <p class="sec-lede hub-lede">Reading an index does not tell you whether you have learned it. Ten questions, pulled at random from ${n ? `all ${n} entries` : 'the whole index'}: name a law from its statement, match a law to what it actually says, place it in its field, and — the one that catches people — say how far it can be trusted.</p>

    <div class="quiz" id="quiz" hidden>
      <div class="quiz-hud">
        <div class="quiz-prog" aria-hidden="true"><span class="quiz-prog-bar" id="quiz-prog"></span></div>
        <div class="quiz-hud-row">
          <span class="quiz-mode" id="quiz-mode"></span>
          <span class="quiz-score" id="quiz-score"></span>
        </div>
      </div>
      <p class="quiz-ask" id="quiz-ask"></p>
      <blockquote class="quiz-stmt" id="quiz-stmt"></blockquote>
      <div class="quiz-options" id="quiz-options"></div>
      <div class="quiz-after" id="quiz-after" hidden></div>
      <div class="quiz-foot">
        <span class="quiz-hint">Press <kbd>1</kbd>–<kbd>4</kbd> to answer, <kbd>Enter</kbd> to continue</span>
        <button class="btn" id="quiz-next" type="button">Next <i class="ti ti-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>

    <div class="quiz-done" id="quiz-done" hidden>
      <div class="quiz-eyebrow">Round over</div>
      <p class="quiz-final" id="quiz-final"></p>
      <ul class="quiz-recap" id="quiz-recap"></ul>
      <button class="btn solid" id="quiz-again" type="button">Play again</button>
    </div>

    <p class="quiz-boot" id="quiz-boot">Loading the index… <a href="${base}browse/">browse it</a> in the meantime.</p>
    <noscript><p class="sec-lede">The quiz needs JavaScript. You can still <a href="${base}browse/">browse every law</a>, or read <a href="${base}reliability/">how each one is rated</a>.</p></noscript>

    <section class="quiz-modes">
      <h2>The four kinds of question</h2>
      <ul class="qm-list">
${MODES.map(([m, d], i) => `        <li><span class="qm-no">${String(i + 1).padStart(2, '0')}</span><b>${escapeHtml(m)}</b> ${escapeHtml(d)}</li>`).join('\n')}
      </ul>
    </section>
${faq.html}  </div>
</section>
`;

  const description =
    'A ten-question quiz on named laws, principles and effects — name the law from its statement, place it in its field, and say how far it can be trusted. From The Law Tome.';

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Quiz',
      name: 'Name that law — The Law Tome quiz',
      url: `${origin}${base}quiz/`,
      description,
      educationalLevel: 'beginner',
      learningResourceType: 'Quiz',
      isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
      about: { '@type': 'Thing', name: 'Named laws, principles and effects' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
        { '@type': 'ListItem', position: 2, name: 'Quiz' },
      ],
    },
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: 'Name That Law — A Quiz on Named Laws & Principles | The Law Tome',
      description,
      base,
      origin,
      path: 'quiz/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({
      base,
      scripts: `<script>window.LT_CATS=${catsJson};</script>\n<script defer src="${asset(base, 'assets/quiz.js')}"></script>`,
    })
  );
}
