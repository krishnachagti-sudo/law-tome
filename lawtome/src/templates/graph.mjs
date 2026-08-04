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

import { head, sprite, header, footer, escapeHtml, asset } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

/**
 * The graph explorer page.
 * @param {object} o
 * @param {string} [o.base='/']  site base path — MUST end with '/'
 * @param {string} [o.origin=''] absolute-URL origin for JSON-LD (optional)
 * @param {number} [o.publishedCount] published-law count for the header/intro
 */
export function graphPage({ base = '/', origin = '', publishedCount, stats = {} } = {}) {
  const nf = new Intl.NumberFormat('en');
  const count = publishedCount == null ? '—' : nf.format(publishedCount);
  const nodes = Number(stats.nodes) || 0;
  const edges = Number(stats.edges) || 0;
  const opposed = Number(stats.opposed) || 0;

  const description = edges
    ? `Explore The Law Tome as a graph — ${nf.format(nodes)} named laws joined by ${nf.format(edges)} cross-links, walkable one neighbourhood at a time.`
    : 'Explore The Law Tome as a graph — the whole corpus as one interactive map of laws and the cross-links between them.';

  const answer = edges
    ? `The graph joins ${nf.format(nodes)} named laws with ${nf.format(edges)} cross-links recorded in the corpus — one law echoing, causing, or contradicting another${opposed ? `, ${nf.format(opposed)} of them contradictions` : ''}. Type a law below to drop into its neighbourhood and walk outward from there.`
    : 'Start from one law and walk the web of what echoes and contradicts it.';

  const faq = hubFaq([
    {
      q: 'What do the links in the graph mean?',
      a: 'Each edge is a relation recorded on a law\'s own entry: it echoes another law, it causes or follows from one, or it opposes one. Dashed red edges are the oppositions; arrows point from cause to consequence; the colour of a node is its field.',
    },
    {
      q: 'Why does it show only part of the graph?',
      a: `Because ${nf.format(edges || 0)} edges at once is a hairball nobody can read. The view renders one law's local neighbourhood — the laws directly around it — and re-centres when you pick a neighbour, so you walk the structure instead of staring at it.`,
    },
    {
      q: 'Can I get the underlying data?',
      a: `Yes. The graph is a static JSON file the page fetches, and the corpus metadata is downloadable from <a href="${base}data/">the data page</a>.`,
    },
  ]);

  const section = `<section class="sec" id="graph-explorer">
  <div class="wrap">
${hubHead({
    title: 'The graph',
    sub: `${count} laws, cross-linked`,
    answer,
    stats: edges ? [[nf.format(nodes), 'laws'], [nf.format(edges), 'links'], ...(opposed ? [[nf.format(opposed), 'contradictions']] : [])] : [],
    base,
  })}    <p class="graph-intro">Every law is a door to a few others. Start from one and walk its web — the laws it echoes, causes, or contradicts. <span class="ptr-fine"><b>Drag</b> nodes to untangle them, zoom with <b>scroll</b> or the <b>+/−</b> buttons, <b>hover</b> a law to spotlight its links, and <b>click</b> a neighbour to re-centre on it (or the centre law to open it).</span><span class="ptr-coarse"><b>Drag</b> nodes to untangle them, <b>pinch</b> to zoom or use the <b>+/−</b> buttons, <b>tap</b> a law to spotlight its links, and tap it <b>again</b> to re-centre on it (or the centre law to open it).</span> Dashed red edges mark laws in tension; arrows point cause → consequence. Colour marks the field.</p>
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
${faq.html}${hubNav('graph/', { base })}  </div>
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
      jsonld: [
        definedTermSet,
        ...hubJsonLd({ name: 'The graph', description, path: 'graph/', origin, base }),
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
    sprite() +
    header({ base, active: 'graph', count }) +
    section +
    footer({ base, scripts: `<script defer src="${asset(base, 'assets/graph.js')}"></script>` })
  );
}
