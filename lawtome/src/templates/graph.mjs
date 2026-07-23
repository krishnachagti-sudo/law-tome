// Task 11 — the graph explorer page. One full HTML document, reusing the Task 5
// chrome partials (head/sprite/header/footer). Composition:
//   head({...}) + sprite() + header({active:'graph'}) + <section intro + #graph>
//   + footer({scripts: graph.js})
//
// The page ships an EMPTY, always-dark Codex container (#graph); src/assets/graph.js
// fetches graph.json and renders a LOCAL NEIGHBOURHOOD into it at runtime (spec §6 —
// never the full hairball). The container carries the `.graph-band` Codex-dark
// treatment (styled dark regardless of theme) already defined in styles.css.
//
// No corpus text is interpolated here — node labels live in graph.json and are
// rendered by graph.js via SVG textContent (never innerHTML). So this template has
// no untrusted-string surface; the count is numeric.

import { head, sprite, header, footer, escapeHtml } from './partials.mjs';

/**
 * The graph explorer page.
 * @param {object} o
 * @param {string} [o.base='/']  site base path — MUST end with '/'
 * @param {string} [o.origin=''] absolute-URL origin for JSON-LD (optional)
 * @param {number} [o.publishedCount] published-law count for the header/intro
 */
export function graphPage({ base = '/', origin = '', publishedCount } = {}) {
  const nf = new Intl.NumberFormat('en');
  const count = publishedCount == null ? '—' : nf.format(publishedCount);

  const description =
    'Explore The Law Tome as a graph — the whole corpus as one interactive map of laws and the cross-links between them.';

  const section = `<section class="sec" id="graph-explorer">
  <div class="wrap">
    <div class="sec-head">
      <h1>The graph</h1>
      <span class="sub">${count} laws, cross-linked</span>
    </div>
    <p class="graph-intro">Every law is a door to a few others. Start from one and walk its web — the laws it echoes, causes, or contradicts. <b>Search</b> for a law, <b>click</b> a neighbour to travel to it, or click the one in the centre to read its page. Colour marks the reliability tier.</p>
    <div class="graph-search">
      <i class="ti ti-search" aria-hidden="true"></i>
      <input id="graph-q" type="search" placeholder="Start from a law…" autocomplete="off" aria-label="Find a law to explore in the graph">
      <div class="graph-suggest" id="graph-suggest" hidden></div>
    </div>
    <div class="graph-stage graph-band" id="graph" aria-label="Relationship graph explorer" role="group">
      <div class="graph-empty" id="graph-empty">Loading the graph…</div>
    </div>
    <div class="graph-focusbar" id="graph-focusbar" hidden>
      <button class="graph-back" id="graph-back" type="button" hidden><svg class="ti-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M5 12l6 6M5 12l6-6"/></svg> back</button>
      <span class="graph-focus-name" id="graph-focus-name"></span>
      <span class="graph-focus-meta" id="graph-focus-meta"></span>
      <a class="graph-focus-link" id="graph-focus-link" href="${base}"><i class="ti ti-arrow-right" aria-hidden="true"></i> Open this law</a>
    </div>
  </div>
</section>
`;

  const definedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'The Law Tome',
    url: `${origin}${base}graph/`,
  };

  return (
    head({
      title: 'The graph — The Law Tome',
      description,
      base,
      origin,
      path: 'graph/',
      jsonld: [definedTermSet],
    }) +
    sprite() +
    header({ base, active: 'graph', count }) +
    section +
    footer({ base, scripts: `<script defer src="${escapeHtml(base)}assets/graph.js"></script>` })
  );
}
