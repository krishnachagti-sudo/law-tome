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
import { hubHead, hubFaq, hubNav } from './hub.mjs';

/**
 * "Coin a law" page — a form that POSTs to ${base}api/submit (no live rendering).
 * @param {object} o
 * @param {string} [o.base='/'] site base path — MUST end with '/'
 */
export function coinPage({ base = '/', origin = '', count } = {}) {
  const description =
    'Coin an original law or suggest one for the Canon. Submissions are verified before publication and, if coined, credited to you in the Coined wing.';

  const coinStep = (i, t, b) => `      <div class="mstep"><span class="mstep-n">${i}</span><div class="mstep-b"><span class="mstep-t">${t}</span><span class="mstep-p">${b}</span></div></div>`;

  const faq = hubFaq([
    {
      q: 'What actually happens after I submit?',
      a: `The form opens a pre-filled public issue on the project's GitHub repository — you see exactly what will be posted and can edit it before it is sent. Nothing appears on the site until it has been reviewed by hand. Because the issue is public, the review happens in the open rather than in a private inbox.`,
    },
    {
      q: 'What is the difference between coining and suggesting?',
      a: `Coining is naming a pattern that has no name yet: it is your original work, and if it is published it goes into <a href="${base}coined/">the Coined wing</a> credited to you. Suggesting is telling us about a law that already exists in the literature and is missing from the index — those join the sourced corpus and need a resolvable source before they can ship.`,
    },
    {
      q: 'What makes a submission likely to be rejected?',
      a: 'A joke with no claim in it, a definition dressed as a law, a restatement of something already indexed under another name, or — for a suggestion — no source anyone can check. The most common failure by far is prior art: the pattern already has a name, usually an older one.',
    },
    {
      q: 'Do I keep any rights over it?',
      a: 'You keep the authorship. The licence you grant is non-exclusive, so it remains yours to use anywhere else; what it lets us do is publish, edit and cross-link it under the CC BY licence that covers the whole corpus, with the credit attached.',
    },
    {
      q: 'Can I use this to report a mistake instead?',
      a: `Yes, and please do. A better source or an earlier attribution for an entry that already exists is worth more to the index than a new entry. Use the same form and say what is wrong; <a href="${base}about/">the method page</a> explains why corrections matter more here than volume.`,
    },
  ], { heading: 'Before you submit' });

  const section = `<section class="sec" id="coin">
  <div class="wrap">
${hubHead({
    title: 'Coin a law',
    sub: 'nobody else lets you do this',
    answer: `Coining a law means naming a pattern that has no name yet. Submit it here and it is reviewed by hand; if it holds up, it is published in <a href="${base}coined/">the Coined wing</a> as a real entry — explained, cross-linked into the graph, marked <code>provenance: coined</code>, and credited to you under CC BY. You can also use the same form to suggest an existing law the index is missing, or to report a mistake in one it already has.`,
    crumbs: [],
    base,
  })}    <p class="sec-lede">You’ve seen it a dozen times but it has no name — the pattern that keeps repeating, the effect everyone recognises and no one can point to. Name it. If it holds up, it goes into the <a href="${base}coined/">Coined wing</a> alongside <a href="${base}laws/goodharts-law/">Goodhart</a> and <a href="${base}laws/parkinsons-law/">Parkinson</a> — credited, clearly marked, with your name on it. This is the one thing a static list can never offer: a way in.</p>

    <div class="coin-how">
      <h2 class="about-h2">How it works</h2>
      <div class="method-steps coin-steps">
${coinStep('1', 'Submit it', 'State your law in one testable sentence and tell us where it comes from, if anywhere. Two minutes, in the form below.')}
${coinStep('2', 'We verify it', 'Every submission is reviewed by hand — checked for prior art, sourced where we can, and pressure-tested the same way the rest of the corpus is. Nothing ships unchecked.')}
${coinStep('3', 'It’s published — with your name', 'If it clears, it becomes a real entry: explained, cross-linked into the graph, and marked as coined. Credited to you, forever, under CC BY.')}
      </div>
    </div>

    <h2 class="about-h2">What makes a good one</h2>
    <p class="sec-lede coin-what">A coinable law is a single, testable claim about how the world tends to work — sharp enough to be wrong, general enough to recur. Not a joke, not a definition, not a personal grievance. If you can picture three unrelated situations it explains, you’re close.</p>

    <h2 class="about-h2">Submit</h2>
    <form class="coin-form" id="coin-form" method="get" action="https://github.com/krishnachagti-sudo/law-tome/issues/new" data-repo="krishnachagti-sudo/law-tome">
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
        <textarea name="sources" rows="2" inputmode="url" aria-describedby="sources-hint" placeholder="Links or citations."></textarea>
        <span class="field-hint" id="sources-hint">Suggestions without a resolvable source will not be published.</span>
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
    <p class="fine">Submitting opens a <b>pre-filled public issue</b> on the project's <a href="https://github.com/krishnachagti-sudo/law-tome/issues" rel="noopener">GitHub repository</a> — the same place the corpus itself is maintained, so every submission and the review of it stay in the open. You'll see exactly what will be posted before anything is sent, and you can edit it there. A free GitHub account is required.</p>
    <p class="fine">Submissions are reviewed by hand before anything is published. Nothing you enter here appears on the site until it clears verification.</p>
${faq.html}  </div>
</section>
`;

  return (
    head({
      title: 'Coin a Law — Name a Pattern Nobody Has Named | The Law Tome',
      description, base, origin, path: 'coin/',
      jsonld: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Coin a law',
          url: `${origin}${base}coin/`,
          description,
          isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
            { '@type': 'ListItem', position: 2, name: 'Coin a law' },
          ],
        },
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
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

  // Formatted, not stringified: the masthead says 1,105 and an unpunctuated
  // 1105 two lines below it reads as a different number.
  const n = count == null ? '—' : Number(count).toLocaleString('en-US');
  const statCell = (v, l) => `      <div class="ht-cell"><span class="ht-n">${v}</span><span class="ht-l">${l}</span></div>`;
  const step = (i, t, b) => `      <div class="mstep"><span class="mstep-n">${i}</span><div class="mstep-b"><span class="mstep-t">${t}</span><span class="mstep-p">${b}</span></div></div>`;
  const tierRow = RELIABILITY_TIERS.map((tier) =>
    `      <div class="tier-row"><span class="badge ${reliabilityClass(tier)}">${escapeHtml(tier)}</span><span class="tier-note">${escapeHtml(RELIABILITY_NOTE[tier])}</span></div>`,
  ).join('\n');
  const explore = (href, t) => `<a class="about-chip" href="${base}${href}">${t}</a>`;

  const faq = hubFaq([
    {
      q: 'What is The Law Tome?',
      a: `A single sourced reference for the named laws, principles and effects that turn up across every field — ${n} of them, each explained in plain language, rated for how well established it is, cross-linked to the ones it echoes and contradicts, and cited.`,
    },
    {
      q: 'Who writes it, and can I trust it?',
      a: `It is written and maintained by <a href="https://conyso.com/founder/" rel="author">Krishna Chagti</a>, an initiative of <a href="https://conyso.com">Conyso</a>. Trust is not asked for: no claim reaches a page without a resolvable source, every entry carries its own citations, and each one wears a rating that says how far it can be pushed. Where a law is disputed, the entry says who disputes it.`,
    },
    {
      q: 'Are any of these laws made up?',
      a: `No entry is invented. Laws are drawn from the literature and traced to the earliest reliable attribution; anything that cannot be cited does not ship. The one exception is labelled as such: the <a href="${base}coined/">Coined wing</a> holds original laws submitted by readers, marked <code>provenance: coined</code> and never presented as historical.`,
    },
    {
      q: 'How do I report a mistake?',
      a: `<a href="${base}coin/">Through the same form</a> that takes new laws. A better source or an earlier attribution is more useful than a new entry — corrections are the only thing this project asks of its readers.`,
    },
    {
      q: 'Can I reuse it?',
      a: `Yes, under <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a>, including commercially, with credit. <a href="${base}data/">Download the dataset</a> in JSON or CSV.`,
    },
  ], { heading: 'Common questions' });

  const section = `<section class="sec" id="about">
  <div class="wrap">
${hubHead({
    title: 'About The Law Tome',
    answer: `The Law Tome is a single, sourced index of ${n} named laws, principles and effects — each explained in plain language, cited, rated for how well established it is, and cross-linked to the laws it agrees and disagrees with. It is published by Conyso, carries no ads, and tracks nothing about what you read.`,
    lede: 'One place instead of forty half-finished lists. This page is the method: where the entries come from, what has to be true before one ships, and who is answerable for it.',
    crumbs: [],
    base,
  })}

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

    <h2 class="about-h2">Who’s behind it</h2>
    <p class="about-p">The Law Tome is created and maintained by <b><a href="https://conyso.com/founder/" rel="author">Krishna Chagti</a></b> — founder and CEO of <a href="${origin || 'https://conyso.com'}">Conyso</a>, a student at IIT Madras and IIM Sirmaur, a Lean Six Sigma Black Belt, and a published researcher. He builds in the open, on the principle that the work is the marketing. Find him on <a href="https://www.linkedin.com/in/krishna-chagti">LinkedIn</a> or <a href="https://github.com/krishnachagti-sudo">GitHub</a>.</p>
    <p class="about-p"><a href="https://conyso.com">Conyso</a> is a holding company that builds and backs companies run with operating discipline — strategy, education, software, and ventures under one roof, on the belief that <i>“excellence is not a slogan; it is a system.”</i> The Law Tome is one of its initiatives: a reference held to that same standard.</p>
    <p class="about-p">We keep it deliberately quiet: no ads, no sponsors, nothing that tracks what you read. The only thing we ask of you is a correction when we get something wrong. Spot an error, know a better source, or think we’ve missed a law? <a href="${base}coin/">Suggest a law or a fix.</a> It’s how the index stays honest.</p>

    <h2 class="about-h2">Start exploring</h2>
    <div class="about-explore">
      ${explore('browse/', 'Browse all')}${explore('situations/', 'What’s the law for…?')}${explore('graph/', 'The graph')}${explore('collections/', 'Collections')}${explore('compare/', 'Compare two laws')}${explore('tension/', 'Laws in tension')}${explore('reliability/', 'By reliability')}${explore('timeline/', 'The timeline')}${explore('named-after/', 'By namesake')}${explore('for/', 'Find your laws')}${explore('quiz/', 'Name that law')}${explore('manifesto/', 'Why name a law?')}${explore('data/', 'Download the data')}
    </div>
${faq.html}  </div>
</section>
`;

  // Person node for the creator — the "who" behind the project, for the entity
  // graph / knowledge panel. Only verified facts: name + GitHub. No invented bio.
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Krishna Chagti',
    jobTitle: 'Founder & CEO, Conyso',
    url: 'https://conyso.com/founder/',
    sameAs: ['https://conyso.com/founder/', 'https://www.linkedin.com/in/krishna-chagti', 'https://github.com/krishnachagti-sudo'],
    worksFor: { '@type': 'Organization', name: 'Conyso', url: 'https://conyso.com' },
  };
  const aboutLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About The Law Tome',
    url: `${origin}${base}about/`,
    description,
    mainEntity: {
      '@type': 'Organization',
      name: 'The Law Tome',
      url: `${origin}${base}`,
      founder: { '@type': 'Person', name: 'Krishna Chagti', url: 'https://conyso.com/founder/' },
      parentOrganization: {
        '@type': 'Organization',
        name: 'Conyso',
        url: 'https://conyso.com',
        slogan: 'Building and backing companies, run with operating discipline.',
        description: 'A holding company that builds and backs companies run with operating discipline — strategy, education, software, and ventures under one roof.',
      },
    },
  };

  return (
    head({
      title: 'About & Method — How The Law Tome Is Built | The Law Tome',
      description, base, origin, path: 'about/',
      jsonld: [
        aboutLd,
        person,
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
            { '@type': 'ListItem', position: 2, name: 'About The Law Tome' },
          ],
        },
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
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
${rows.map((l) => lawCard(l, base, 2)).join('\n')}
    </div>`
    : `<div class="empty">No coined laws yet. The Coined wing fills as readers submit original laws that clear verification — <a href="${base}coin/">coin the first one</a>.</div>`;

  const faq = hubFaq([
    {
      q: 'What is the Coined wing?',
      a: `The one part of The Law Tome that is not drawn from the historical record. Everywhere else, a law has to be attested in the literature before it can have a page. Here a reader can name a pattern nobody has named yet — credited to them, carried under <code>provenance: coined</code>, and kept visibly separate from the ${rows.length ? 'rest of the' : ''} index so it can never be mistaken for something with a century of citations behind it.`,
    },
    {
      q: 'Why keep them apart from the rest?',
      a: 'Because mixing them would quietly destroy the thing that makes the index worth reading. An encyclopedia that lets new inventions sit unmarked beside sourced entries is a list of assertions. The separation is not a demotion of coined laws — it is what lets them exist here at all.',
    },
    {
      q: 'What does a submission have to clear?',
      a: `It has to be original, it has to be yours to give, and it has to say something a reader could actually test or recognise. A restatement of an existing law is filed as that law instead. <a href="${base}coin/">The form</a> sets out the rights grant and the originality warranty in full.`,
    },
    {
      q: 'Do I keep the credit?',
      a: 'Yes. A coined entry carries its author\'s name, and the machine-readable record carries it too, so the attribution survives anyone reusing the dataset under its licence.',
    },
  ], { heading: 'About coining' });

  const section = `<section class="sec" id="coined">
  <div class="wrap">
${hubHead({
    title: 'The Coined wing',
    sub: 'community-submitted originals · credited · clearly marked',
    answer: rows.length
      ? `The Coined wing holds ${rows.length} named ${rows.length === 1 ? 'law' : 'laws'} coined by readers of The Law Tome rather than drawn from the historical record — each credited to its author, marked <code>provenance: coined</code>, and kept apart from the sourced index so the two can never be confused.`
      : 'The Coined wing is where original laws submitted by readers are published — credited to their authors, marked <code>provenance: coined</code>, and kept apart from the sourced historical index so the two can never be confused. It is empty so far.',
    lede: `Every other entry here had to be attested somewhere before it could exist. This is the exception, and it is labelled as one. Think you have spotted a real pattern with no name? <a href="${base}coin/">Coin it.</a>`,
    stats: [[rows.length, rows.length === 1 ? 'coined law' : 'coined laws'], ['Credited', 'to their authors'], ['Marked', 'never passed off as Canon']],
    crumbs: [['about/', 'About']],
    base,
  })}    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>
    ${grid}
${faq.html}${hubNav('', { base })}  </div>
</section>
`;

  return (
    head({
      title: 'The Coined wing — The Law Tome',
      description: 'Original laws coined by readers of The Law Tome — credited, clearly marked, and never laundered as historical Canon.',
      base,
      origin,
      path: 'coined/',
      jsonld: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'The Coined wing',
          url: `${origin}${base}coined/`,
          description: 'Original laws coined by readers of The Law Tome — credited, clearly marked, and never laundered as historical Canon.',
          isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: rows.length,
            itemListElement: rows.map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${origin}${base}about/` },
            { '@type': 'ListItem', position: 3, name: 'The Coined wing' },
          ],
        },
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
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

  const faq = hubFaq([
    {
      q: 'Does The Law Tome use cookies?',
      a: 'It sets none. The two things the site remembers — your light or dark theme, and <a href="' + base + 'saved/">your saved shortlist</a> — are kept in your browser\'s own local storage, which is never transmitted with a request the way a cookie is. Clearing site data clears both.',
    },
    {
      q: 'Do you know which laws I read?',
      a: 'No. There is no analytics script on any page, no pixel, no third-party embed, and no server-side log we consult. The site is static files; the only record of a visit is whatever the host keeps to serve it.',
    },
    {
      q: 'What happens to a submission I make?',
      a: `The <a href="${base}coin/">coin form</a> opens a public issue on the project's GitHub repository with the text you entered — so it becomes public at the moment you send it, under GitHub's own terms as well as this notice. Do not put anything in it you would not want read.`,
    },
    {
      q: 'How do I get something removed?',
      a: 'Ask, through the same form or on the repository, and say which submission. Consent is the basis for publishing it, and withdrawing consent withdraws the entry — including the credit line, if a coined law of yours has been published.',
    },
    {
      q: 'Is there an account?',
      a: `None, anywhere on the site. There is nothing to sign up for, so there is no password, no email list, and no profile to delete.`,
    },
  ], { heading: 'Privacy questions' });

  const section = `<section class="sec" id="privacy">
  <div class="wrap narrow">
${hubHead({
    title: 'Privacy',
    answer: 'The Law Tome sets no cookies, runs no analytics, and keeps no record of which laws you read. The only personal data it ever holds is what you deliberately type into the coin form, which is used to review and — with your consent — publish and credit your submission.',
    lede: 'A reference project, not a business with a funnel. There are <b>no ads and no tracking</b> — no analytics cookies, no reading profile, no third-party scripts on any page.',
    crumbs: [['about/', 'About']],
    base,
  })}    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>

    <h2>What we collect</h2>
    <p>Only what you type into the <a href="${base}coin/">coin form</a> when you choose to submit a law: the name you give for credit, the law's title and statement, your chosen mode (coin or suggest), and any sources you provide. Browsing the rest of the site collects nothing about you.</p>

    <h2>The basis for using it</h2>
    <p>We use a submission on the basis of the <b>consent</b> you give — the required checkbox on the form — together with the CC BY licence grant it carries. If a coined law is published, the name you supplied is shown as its credit. You can ask us to correct or remove your submission at any time.</p>

    <h2>What we don't do</h2>
    <p>We don't sell your data, we don't build advertising profiles, and we don't track which laws you read. Submission data is used only to review and, if it clears verification, publish your entry.</p>
${faq.html}  </div>
</section>
`;

  return (
    head({
      title: 'Privacy — No Ads, No Tracking, No Account | The Law Tome',
      description, base, origin, path: 'privacy/',
      jsonld: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy',
          url: `${origin}${base}privacy/`,
          description,
          isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${origin}${base}about/` },
            { '@type': 'ListItem', position: 3, name: 'Privacy' },
          ],
        },
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
    sprite() +
    header({ base, active: 'about', count }) +
    section +
    footer({ base })
  );
}

/**
 * A redirect, for a host that cannot do redirects.
 *
 * dist/_redirects is the Netlify/Cloudflare format, and GitHub Pages ignores it
 * completely: it serves static files and nothing else. So every one of the 49
 * redirects the build emits — the retired collection, and 48 law permalinks
 * seeded from duplicate-slug cleanup — has been a 404 on the live site, which
 * is the exact failure the redirect map exists to prevent.
 *
 * The static-host answer is a stub at the old path: an instant meta refresh for
 * a reader, a canonical pointing at the destination so a search engine folds the
 * two together, and a real visible link so the page works with the refresh
 * blocked. `_redirects` stays for the eventual conyso.com rewrite layer, where
 * a proper 301 is available and better.
 *
 * Deliberately NOT noindex: a canonical and a noindex on the same URL are
 * contradictory instructions, and the canonical is the one that does the job.
 *
 * @param {string} to base-relative destination path (e.g. 'for/engineers/')
 * @param {string} label what the destination is called, for the visible link
 */
export function redirectStub(to, { base = '/', origin = '', label = '' } = {}) {
  const url = `${base}${to}`;
  const abs = `${origin}${url}`;
  const name = label || to;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${escapeHtml(url)}">
<link rel="canonical" href="${escapeHtml(abs)}">
<title>Moved — ${escapeHtml(name)} | The Law Tome</title>
<meta name="description" content="This page has moved to ${escapeHtml(name)}.">
</head>
<body>
<p>This page has moved to <a href="${escapeHtml(url)}">${escapeHtml(name)}</a>.</p>
</body>
</html>
`;
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
