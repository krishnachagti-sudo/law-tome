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
    'Explore The Law Tome as a graph — start on any law and walk its local neighbourhood of related principles and effects.';

  const section = `<section class="sec" id="graph-explorer">
  <div class="wrap">
    <div class="sec-head">
      <h1>The graph</h1>
      <span class="sub">${count} laws, cross-linked</span>
    </div>
    <p class="graph-intro" style="font-size:15px;color:var(--muted);max-width:640px;margin:6px 0 22px">Every law is a door to three others. Start on one and walk its <b>local neighbourhood</b> — the handful of laws it touches directly. Click any node to re-centre the map on it. This is a focused view, never the whole tangle.</p>
    <div class="graph-stage graph-band" id="graph" aria-label="Relationship graph explorer" role="img" style="min-height:420px;display:flex;align-items:center;justify-content:center;padding:20px">
      <div class="graph-empty" id="graph-empty" style="font-family:var(--mono);font-size:13px;color:#a89e84">Loading the graph…</div>
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
      canonical: origin ? `${origin}${base}graph/` : undefined,
      jsonld: [definedTermSet],
    }) +
    sprite() +
    header({ base, active: 'graph', count }) +
    section +
    footer({ scripts: `<script defer src="${escapeHtml(base)}assets/graph.js"></script>` })
  );
}
