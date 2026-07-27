// Saved page (/saved/) — the reader's private shortlist.
//
// A static shell filled by src/assets/saved.js from localStorage (no account, no
// server, nothing leaves the browser). Every law page carries a Save button; the
// ones you save show up here. With JS off it explains itself and points to
// Browse — never a dead page.

import { head, sprite, header, footer, escapeHtml, asset } from './partials.mjs';

export function savedPage({ base = '/', origin = '', count } = {}) {
  const section = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h1>Saved laws</h1>
      <span class="sub" id="saved-count"></span>
    </div>
    <p class="sec-lede">Your shortlist. Saving is private — it lives in this browser only, with no account and nothing sent anywhere. Hit <b>Save</b> on any law to add it here.</p>
    <div class="grid" id="saved-grid"></div>
    <div class="empty" id="saved-empty" hidden>Nothing saved yet. <a href="${base}browse/">Browse the index</a> and save the ones you want to keep.</div>
    <noscript><p class="sec-lede">Saving needs JavaScript. You can still <a href="${base}browse/">browse every law</a>.</p></noscript>
  </div>
</section>
`;

  const description = 'Your saved shortlist of named laws — a private, in-browser collection with no account required. From The Law Tome.';

  return (
    head({
      // A per-visitor, client-only page: keep it out of the index but let crawlers
      // follow its links.
      title: 'Saved Laws — Your Shortlist | The Law Tome',
      description,
      base,
      origin,
      path: 'saved/',
      robots: 'noindex, follow',
      jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Saved laws', url: `${origin}${base}saved/`, description }],
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base, scripts: `<script defer src="${asset(base, 'assets/saved.js')}"></script>` })
  );
}
