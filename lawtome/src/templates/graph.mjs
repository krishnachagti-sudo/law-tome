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
    <p class="graph-intro" style="font-size:15px;color:var(--muted);max-width:660px;margin:6px 0 22px">The whole corpus as one map — every law a node, every cross-link an edge. <b>Drag</b> a node to pull the web around, <b>scroll</b> to zoom, <b>hover</b> to trace what a law touches, and <b>click</b> to open its page. Colour marks the reliability tier; the better-connected a law, the larger its node.</p>
    <div class="graph-stage graph-band" id="graph" aria-label="Relationship graph explorer" role="img" style="position:relative;min-height:540px;padding:0;overflow:hidden">
      <div class="graph-empty" id="graph-empty" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:13px;color:#a89e84">Loading the graph…</div>
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
