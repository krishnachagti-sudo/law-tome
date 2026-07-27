// Quiz page — "Law of the day" + "Name that law".
//
// A static shell: the two panels are filled by src/assets/quiz.js, which fetches
// the prebuilt search index and (1) shows the deterministic law of the day and
// (2) runs a name-that-law game (a statement + four names, one right). With JS
// off, the shell shows a graceful message and a Browse link — no dead page.

import { head, sprite, header, footer, escapeHtml, asset } from './partials.mjs';

export function quizPage({ base = '/', origin = '', count } = {}) {
  const section = `<section class="sec" id="quiz-sec">
  <div class="wrap">
    <div class="sec-head">
      <h1>Law of the day &amp; the quiz</h1>
      <span class="sub">a new one every day</span>
    </div>
    <p class="sec-lede">One law surfaced fresh each day, and a quick game to test whether you can name a principle from its statement alone. A five-minute way to learn the index instead of only searching it.</p>

    <div class="lotd" id="lotd" aria-live="polite">
      <div class="lotd-eyebrow">Law of the day</div>
      <div class="lotd-body"><p class="lotd-fallback">Loading today's law… <a href="${base}browse/">browse the index</a> in the meantime.</p></div>
    </div>

    <div class="quiz" id="quiz" hidden>
      <div class="quiz-eyebrow">Name that law</div>
      <blockquote class="quiz-stmt" id="quiz-stmt"></blockquote>
      <div class="quiz-options" id="quiz-options"></div>
      <div class="quiz-foot">
        <span class="quiz-score" id="quiz-score"></span>
        <button class="btn" id="quiz-next" type="button">Next law <i class="ti ti-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>
    <noscript><p class="sec-lede">The quiz needs JavaScript. You can still <a href="${base}browse/">browse every law</a>.</p></noscript>
  </div>
</section>
`;

  const description =
    'A law of the day and a name-that-law quiz — learn the index of named laws, principles, and effects by playing. From The Law Tome.';

  const jsonld = [{
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Law of the day & quiz',
    url: `${origin}${base}quiz/`,
    description,
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
  }];

  return (
    head({
      title: 'Law of the Day & Name-That-Law Quiz | The Law Tome',
      description,
      base,
      origin,
      path: 'quiz/',
      jsonld,
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base, scripts: `<script defer src="${asset(base, 'assets/quiz.js')}"></script>` })
  );
}
