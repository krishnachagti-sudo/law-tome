// Task 14 static pages: the "Coin a law" form, the About page, the Coined wing
// listing, and the Privacy page. Each returns one full HTML document assembled
// from the Task 5 chrome partials (head/sprite/header/footer/escapeHtml), so the
// masthead, nav, seal and footer stay identical to every generated page.
//
// ANTI-FABRICATION notes carried through this file:
//   1. The About page attributes curation to a REAL organisational entity — "The
//      Law Tome editorial team" at Conyso (the publisher) — never an invented
//      individual byline. Fabricating a person ("Dr. Jane Smith, Editor") is
//      exactly the made-up fact this project forbids; a role/org satisfies
//      E-E-A-T without inventing anyone.
//   2. The Coined wing renders ONLY entries whose provenance is 'coined', and
//      every corpus string (name/statement/reliability/no) is escapeHtml'd — the
//      Coined tier is community-submitted originals, credited and machine-readable
//      (`provenance: coined`), never laundered as historical Canon.
//   3. The coin form POSTs to ${base}api/submit (the live endpoint is Plan B); it
//      renders no submissions itself. Consent is a required checkbox whose label
//      links to the Privacy page, and the rights-grant + originality warranty copy
//      (spec §13) is explicit.

import { head, sprite, header, footer, escapeHtml, lawCard } from './partials.mjs';

/**
 * "Coin a law" page — a form that POSTs to ${base}api/submit (no live rendering).
 * @param {object} o
 * @param {string} [o.base='/'] site base path — MUST end with '/'
 */
export function coinPage({ base = '/' } = {}) {
  const description =
    'Coin an original law or suggest one for the Canon. Submissions are verified before publication and, if coined, credited to you in the Coined wing.';

  const section = `<section class="sec" id="coin-form">
  <div class="wrap narrow">
    <div class="sec-head"><h1>Coin a law</h1></div>
    <p class="lede">Noticed a pattern that has no name? Coin it. Submit an original law — if it holds up under source-resolution and adversarial verification, we publish it in the <a href="${base}coined/">Coined wing</a> with your name on it. Or <b>suggest</b> an existing, attested law for the Canon and point us at the sources.</p>
    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>
    <form class="coin-form" action="${base}api/submit" method="post">
      <label class="field">
        <span class="lbl">Your name (for credit)</span>
        <input type="text" name="name" autocomplete="name" required>
      </label>
      <label class="field">
        <span class="lbl">The law, in one line</span>
        <input type="text" name="title" placeholder="e.g. The Cobra Effect" required>
      </label>
      <label class="field">
        <span class="lbl">The statement</span>
        <textarea name="statement" rows="3" placeholder="State the law as a single, testable sentence." required></textarea>
      </label>
      <label class="field">
        <span class="lbl">Submission mode</span>
        <select name="mode" required>
          <option value="coin">Coin — an original law of my own</option>
          <option value="suggest">Suggest — an existing, attested law for the Canon</option>
        </select>
      </label>
      <label class="field">
        <span class="lbl">Sources / prior art (optional but decisive)</span>
        <textarea name="sources" rows="2" placeholder="Links or citations. Suggestions without a resolvable source will not be published."></textarea>
      </label>
      <div class="grant">
        <p>By submitting, you <b>grant</b> The Law Tome a non-exclusive, perpetual licence to publish, edit, and cross-link your submission under the <b>CC BY</b> licence that covers the whole corpus, with attribution to you. You <b>warrant</b> that the submission is your own original work (for a coined law) and does not infringe anyone else's rights.</p>
      </div>
      <label class="consent">
        <input type="checkbox" name="consent" required>
        <span>I have read and agree to the <a href="${base}privacy/">privacy notice</a>, and I grant the licence and give the originality warranty above.</span>
      </label>
      <div class="actions">
        <button class="cta" type="submit"><i class="ti ti-feather" aria-hidden="true"></i> Submit for review</button>
      </div>
    </form>
    <p class="fine">Submissions are reviewed by hand before anything is published. Nothing you enter here appears on the site until it clears verification.</p>
  </div>
</section>
`;

  return (
    head({ title: 'Coin a law — The Law Tome', description, base }) +
    sprite() +
    header({ base, active: 'coin' }) +
    section +
    footer()
  );
}

/**
 * About page — states the anti-fabrication verification method, the sources
 * policy, the CC BY licence, and a named ORGANISATIONAL curator (no fake person).
 * @param {object} o
 * @param {string} [o.base='/'] site base path
 */
export function aboutPage({ base = '/' } = {}) {
  const description =
    'How The Law Tome is built and verified: enumerate-from-sources, a citation gate, adversarial verification, and source-resolution — curated by The Law Tome editorial team at Conyso, licensed CC BY.';

  const section = `<section class="sec" id="about">
  <div class="wrap narrow">
    <div class="sec-head"><h1>About The Law Tome</h1></div>
    <p class="lede">The Law Tome is a single, unified, sourced index of named laws, principles, and effects — one place instead of forty half-finished lists.</p>
    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>

    <h2>How we keep it honest</h2>
    <p>Every entry is built to be un-fabricated. Our method, in order:</p>
    <ol class="method">
      <li><b>Enumerate from sources.</b> Laws are drawn from the literature, not invented. We start from what is attested.</li>
      <li><b>Citation gate.</b> No claim reaches a page without a resolvable source. An entry that cannot be cited does not ship.</li>
      <li><b>Adversarial verification.</b> Each entry is checked against the sources by someone trying to break it — misattributions, apocrypha, and folk-embellishments are caught here.</li>
      <li><b>Source-resolution.</b> We follow attributions back to the earliest reliable origin and record the reliability tier (Empirical, Heuristic, Folk-adage, or Contested) honestly, including when a law is contested.</li>
    </ol>

    <h2>Canon and Coined</h2>
    <p>The <b>Canon</b> is attested, verified, and sourced. The <b>Coined</b> wing holds original laws submitted by readers — credited, clearly marked, and machine-readable as <code>provenance: coined</code>. We never launder a coined law as historical, and we never dress up an unsourced claim as Canon.</p>

    <h2>Licence</h2>
    <p>The corpus is licensed <b>CC BY</b>: reuse it, remix it, build on it — just credit The Law Tome. There are no ads and no tracking of what you read.</p>

    <h2>Who curates it</h2>
    <p>The Law Tome is curated and maintained by <b>The Law Tome editorial team</b> at <b>Conyso</b>, the publisher of this microsite. Curation is a standing editorial responsibility of the team, not a single byline. Corrections and sources are welcome — <a href="${base}coin/">suggest a law or a fix</a>.</p>
  </div>
</section>
`;

  return (
    head({ title: 'About — The Law Tome', description, base }) +
    sprite() +
    header({ base, active: 'about' }) +
    section +
    footer()
  );
}

/**
 * The Coined wing — a listing of ONLY coined entries (cards -> ${base}laws/<slug>/),
 * with an empty-state when there are none (the seed corpus has zero coined entries).
 * @param {object[]} coinedLaws entries whose provenance is 'coined'
 * @param {object} o
 * @param {string} [o.base='/'] site base path
 */
export function coinedIndex(coinedLaws = [], { base = '/' } = {}) {
  const rows = (Array.isArray(coinedLaws) ? coinedLaws : []).filter((l) => l && l.provenance === 'coined');

  const grid = rows.length
    ? `<div class="grid" id="grid">
${rows.map((l) => lawCard(l, base)).join('\n')}
    </div>`
    : `<div class="empty">No coined laws yet. The Coined wing fills as readers submit original laws that clear verification — <a href="${base}coin/">coin the first one</a>.</div>`;

  const section = `<section class="sec" id="coined">
  <div class="wrap">
    <div class="sec-head">
      <h1>The Coined wing</h1>
      <span class="sub">community-submitted originals · credited · clearly marked</span>
    </div>
    <p class="lede">These laws were <b>coined</b> by readers, not drawn from the historical record. Each is credited to its author, marked <code>provenance: coined</code>, and never laundered as historical Canon. Think you've spotted a real pattern with no name? <a href="${base}coin/">Coin it.</a></p>
    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>
    ${grid}
  </div>
</section>
`;

  return (
    head({
      title: 'The Coined wing — The Law Tome',
      description: 'Original laws coined by readers of The Law Tome — credited, clearly marked, and never laundered as historical Canon.',
      base,
    }) +
    sprite() +
    header({ base, active: 'coin' }) +
    section +
    footer()
  );
}

/**
 * Privacy page — backs the consent link on the coin form.
 * @param {object} o
 * @param {string} [o.base='/'] site base path
 */
export function privacyPage({ base = '/' } = {}) {
  const description =
    'The Law Tome privacy notice: what a coin submission collects, the consent basis for publishing it, and our no-tracking posture.';

  const section = `<section class="sec" id="privacy">
  <div class="wrap narrow">
    <div class="sec-head"><h1>Privacy</h1></div>
    <p class="lede">The Law Tome is a reference project. There are <b>no ads and no tracking of what you read</b> — no analytics cookies, no reading profile, no third-party trackers on any page.</p>
    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>

    <h2>What we collect</h2>
    <p>Only what you type into the <a href="${base}coin/">coin form</a> when you choose to submit a law: the name you give for credit, the law's title and statement, your chosen mode (coin or suggest), and any sources you provide. Browsing the rest of the site collects nothing about you.</p>

    <h2>The basis for using it</h2>
    <p>We use a submission on the basis of the <b>consent</b> you give — the required checkbox on the form — together with the CC BY licence grant it carries. If a coined law is published, the name you supplied is shown as its credit. You can ask us to correct or remove your submission at any time.</p>

    <h2>What we don't do</h2>
    <p>We don't sell your data, we don't build advertising profiles, and we don't track which laws you read. Submission data is used only to review and, if it clears verification, publish your entry.</p>
  </div>
</section>
`;

  return (
    head({ title: 'Privacy — The Law Tome', description, base }) +
    sprite() +
    header({ base, active: 'about' }) +
    section +
    footer()
  );
}
