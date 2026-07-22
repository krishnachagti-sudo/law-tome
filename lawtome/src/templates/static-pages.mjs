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

import { head, sprite, header, footer, escapeHtml, lawCard, reliabilityClass, RELIABILITY_TIERS, RELIABILITY_NOTE } from './partials.mjs';

/**
 * "Coin a law" page — a form that POSTs to ${base}api/submit (no live rendering).
 * @param {object} o
 * @param {string} [o.base='/'] site base path — MUST end with '/'
 */
export function coinPage({ base = '/', origin = '', count } = {}) {
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
    head({ title: 'Coin a law — The Law Tome', description, base, origin, path: 'coin/' }) +
    sprite() +
    header({ base, active: 'coin', count }) +
    section +
    footer({ base })
  );
}

/**
 * About page — states the anti-fabrication verification method, the sources
 * policy, the CC BY licence, and a named ORGANISATIONAL curator (no fake person).
 * @param {object} o
 * @param {string} [o.base='/'] site base path
 */
export function aboutPage({ base = '/', origin = '', count } = {}) {
  const description =
    'How The Law Tome is built and verified: enumerate-from-sources, a citation gate, adversarial verification, and source-resolution — curated by The Law Tome editorial team at Conyso, licensed CC BY.';

  const n = count == null ? '—' : String(count);
  const statCell = (v, l) => `      <div class="ht-cell"><span class="ht-n">${v}</span><span class="ht-l">${l}</span></div>`;
  const step = (i, t, b) => `      <div class="mstep"><span class="mstep-n">${i}</span><div class="mstep-b"><span class="mstep-t">${t}</span><span class="mstep-p">${b}</span></div></div>`;
  const tierRow = RELIABILITY_TIERS.map((tier) =>
    `      <div class="tier-row"><span class="badge ${reliabilityClass(tier)}">${escapeHtml(tier)}</span><span class="tier-note">${escapeHtml(RELIABILITY_NOTE[tier])}</span></div>`,
  ).join('\n');
  const explore = (href, t) => `<a class="about-chip" href="${base}${href}">${t}</a>`;

  const section = `<section class="sec" id="about">
  <div class="wrap">
    <div class="sec-head"><h1>About The Law Tome</h1></div>
    <p class="sec-lede">The Law Tome is one unified, sourced index of named laws, principles, and effects — explained, cross-linked, and verified. One place instead of forty half-finished lists.</p>

    <div class="ht-row about-stats">
${statCell(n, 'named laws, principles &amp; effects')}
${statCell('100%', 'sourced — every entry cited')}
${statCell('4 tiers', 'of reliability, marked honestly')}
${statCell('CC BY', 'free to reuse with credit')}
    </div>

    <h2 class="about-h2">Nothing here is invented</h2>
    <p class="about-p">A named law is worthless if it is misattributed or made up. Every entry earns its place the same way, in order:</p>
    <div class="method-steps about-method">
${step('1', 'Drawn from sources', 'Laws come from the literature, never invented. We start from what is actually attested.')}
${step('2', 'Cited, or it doesn’t ship', 'No claim reaches a page without a resolvable source. An entry that can’t be cited doesn’t exist.')}
${step('3', 'Adversarially checked', 'Each entry is challenged by someone trying to break it — misattributions, apocrypha, and folk-embellishments get caught.')}
${step('4', 'Traced &amp; rated', 'We follow each attribution to its earliest reliable origin and record its reliability tier honestly — including when it’s contested.')}
    </div>

    <h2 class="about-h2">The reliability scale</h2>
    <p class="about-p">Not every “law” is proven, and we never pretend otherwise. Each entry wears one of four ratings, so you always know whether you’re quoting a finding or a folk saying:</p>
    <div class="tier-scale">
${tierRow}
    </div>

    <h2 class="about-h2">Canon &amp; Coined</h2>
    <div class="about-two">
      <div class="about-card"><span class="about-card-h">Canon</span><p>Attested, verified, and sourced — the historical record of named laws. The vast majority of the index.</p></div>
      <div class="about-card"><span class="about-card-h">Coined</span><p>Original laws submitted by readers — credited, clearly marked <code>provenance: coined</code>, never laundered as historical. <a href="${base}coin/">Coin one.</a></p></div>
    </div>

    <h2 class="about-h2">Open by design</h2>
    <p class="about-p">The corpus is licensed <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC&nbsp;BY&nbsp;4.0</a> — reuse it, remix it, build on it, just credit The Law Tome. You can <a href="${base}data/">download the dataset</a> as JSON or CSV. No ads, and no tracking of what you read.</p>

    <h2 class="about-h2">Who curates it</h2>
    <p class="about-p">The Law Tome is curated and maintained by <b>The Law Tome editorial team</b> at <b>Conyso</b>, the publisher of this microsite — a standing editorial responsibility, not a single byline. Corrections and sources are welcome: <a href="${base}coin/">suggest a law or a fix</a>.</p>

    <h2 class="about-h2">Start exploring</h2>
    <div class="about-explore">
      ${explore('browse/', 'Browse all')}${explore('situations/', 'What’s the law for…?')}${explore('graph/', 'The graph')}${explore('collections/', 'Collections')}${explore('tension/', 'Laws in tension')}${explore('reliability/', 'By reliability')}${explore('data/', 'Download the data')}
    </div>
  </div>
</section>
`;

  return (
    head({ title: 'About & Method — How The Law Tome Is Built | The Law Tome', description, base, origin, path: 'about/' }) +
    sprite() +
    header({ base, active: 'about', count }) +
    section +
    footer({ base })
  );
}

/**
 * The Coined wing — a listing of ONLY coined entries (cards -> ${base}laws/<slug>/),
 * with an empty-state when there are none (the seed corpus has zero coined entries).
 * @param {object[]} coinedLaws entries whose provenance is 'coined'
 * @param {object} o
 * @param {string} [o.base='/'] site base path
 */
export function coinedIndex(coinedLaws = [], { base = '/', origin = '', count } = {}) {
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
      origin,
      path: 'coined/',
    }) +
    sprite() +
    header({ base, active: 'coin', count }) +
    section +
    footer({ base })
  );
}

/**
 * Privacy page — backs the consent link on the coin form.
 * @param {object} o
 * @param {string} [o.base='/'] site base path
 */
export function privacyPage({ base = '/', origin = '', count } = {}) {
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
    head({ title: 'Privacy — The Law Tome', description, base, origin, path: 'privacy/' }) +
    sprite() +
    header({ base, active: 'about', count }) +
    section +
    footer({ base })
  );
}

/**
 * 404 Not Found page. Written to dist/404.html so the host (Netlify-style) serves
 * it for unmatched paths. robots: noindex (an error page must never be indexed),
 * follow so crawlers still traverse its recovery links. No canonical/og:url — a
 * 404 addresses no single resource — so `path` is omitted.
 * @param {object} o
 * @param {string} [o.base='/'] site base path — MUST end with '/'
 */
export function notFoundPage({ base = '/', origin = '', count } = {}) {
  const description = 'That page could not be found. Browse the index of named laws, principles, and effects, or search The Law Tome.';
  const section = `<section class="sec" id="notfound">
  <div class="wrap narrow">
    <div class="sec-head"><h1>Lost the plot</h1></div>
    <p class="lede">There's no law at this address. It may have moved, or never existed — much like the Dartmouth paper Campbell's Law was misattributed to.</p>
    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>
    <p>Try one of these instead:</p>
    <ul class="method">
      <li><a href="${base}">The front page</a> — start over.</li>
      <li><a href="${base}browse/">Browse every entry</a> — the full index by category.</li>
      <li><a href="${base}graph/">The relationship graph</a> — laws and their kin.</li>
      <li><a href="${base}coin/">Coin a law</a> — if the one you wanted isn't here yet.</li>
    </ul>
  </div>
</section>
`;
  return (
    head({ title: 'Not found — The Law Tome', description, base, origin, robots: 'noindex, follow' }) +
    sprite() +
    header({ base, active: '', count }) +
    section +
    footer({ base })
  );
}
