// Shared chrome for every generated Law Tome page.
//
// These partials are template-literal functions ported byte-faithfully from the
// approved prototype (index.html + laws/goodharts-law.html). Two deliberate
// changes from the prototype markup, both mandated by Task 5:
//   1. Assets are self-hosted. The prototype's Google-Fonts <link>s (+preconnect)
//      and the jsDelivr Tabler-icons <link> are REPLACED by local refs:
//      ${base}assets/styles.css (which carries the @font-face rules) and
//      ${base}assets/icons/tabler.css. No googleapis/jsdelivr/cdn URL is emitted.
//   2. common.js is deferred instead of loaded synchronously in <head>. To keep
//      the prototype's flash-free theming, the theme-init that common.js runs is
//      also inlined in <head> (an inline <script> is fine; a CDN link is not).
//
// Composition (Task 6/7 assemble a whole document like so):
//   head({...}) + sprite() + header({...}) + '<main>…</main>' + footer({...})
// head() opens <!doctype>/<html>/<head>/<body>; footer() closes </body>/</html>.

/**
 * Escape a string for interpolation into HTML text or a DOUBLE-QUOTED attribute.
 * Encodes &, <, >, and ". Apostrophes are intentionally left literal: they are
 * safe both in text and inside double-quoted attributes (this codebase never uses
 * single-quoted attributes), and law names like "Goodhart's Law" must render with
 * a real apostrophe to match the prototype and the corpus.
 */
export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Reliability enum -> badge modifier CSS class. Keyed on the exact controlled
// vocabulary from build/validate.mjs (Empirical | Heuristic | Folk-adage | Contested).
// Shared here so law.mjs and listing.mjs cannot drift (they diverged once: a 'Folk'
// vs 'Folk-adage' key mismatch shipped a wrong badge colour).
export const RELIABILITY_BADGE = { Empirical: 'b-emp', Heuristic: 'b-heu', 'Folk-adage': 'b-folk', Contested: 'b-con' };
/** Badge class for a reliability value; unknown values fall back to b-heu. */
export function reliabilityClass(reliability) {
  return RELIABILITY_BADGE[reliability] || 'b-heu';
}

/**
 * Serialise a JSON-LD object into a <script type="application/ld+json"> tag.
 * Every `<` in the serialised JSON is replaced with its unicode escape, so a
 * corpus value containing "</script>" cannot close the element and inject markup.
 * application/ld+json is data (not executed JS), so escaping `<` is necessary and
 * sufficient — no U+2028/U+2029 handling needed.
 */
export function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
}

/**
 * Document head — everything from <!doctype html> through the opening <body>.
 * @param {object} o
 * @param {string} o.title        document title (required)
 * @param {string} [o.description] meta description; emitted only when given
 * @param {string} [o.base='/']   site base path — MUST end with '/', e.g. '/lawtome/'
 * @param {string} [o.canonical]  canonical URL; emitted only when given
 * @param {object} [o.og]         Open Graph fields {title,description,image,type}
 * @param {object[]} [o.jsonld]   array of JSON-LD objects; each emitted via jsonLd()
 */
export function head({ title, description, base = '/', canonical, og, jsonld } = {}) {
  const out = [
    '<!DOCTYPE html>',
    '<html lang="en" data-theme="light">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
  ];
  if (description) out.push(`<meta name="description" content="${escapeHtml(description)}">`);
  if (canonical) out.push(`<link rel="canonical" href="${escapeHtml(canonical)}">`);
  if (og) {
    if (og.title) out.push(`<meta property="og:title" content="${escapeHtml(og.title)}">`);
    if (og.description) out.push(`<meta property="og:description" content="${escapeHtml(og.description)}">`);
    if (og.image) out.push(`<meta property="og:image" content="${escapeHtml(og.image)}">`);
    if (og.type) out.push(`<meta property="og:type" content="${escapeHtml(og.type)}">`);
  }
  // Self-hosted stylesheets — replaces the prototype's Google-Fonts + jsDelivr
  // <link>s. Fonts are pulled in by the @font-face rules inside styles.css.
  out.push(`<link rel="stylesheet" href="${base}assets/styles.css">`);
  out.push(`<link rel="stylesheet" href="${base}assets/icons/tabler.css">`);
  // Inline theme-init (mirrors common.js): set data-theme before first paint so
  // dark-mode readers never flash the light theme. common.js is deferred below.
  out.push(`<script>(function(){var t;try{t=localStorage.getItem('lt-theme')}catch(e){}if(t)document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark')})();</script>`);
  out.push(`<script defer src="${base}assets/common.js"></script>`);
  if (Array.isArray(jsonld)) for (const block of jsonld) out.push(jsonLd(block));
  out.push('</head>');
  out.push('<body>');
  return out.join('\n') + '\n';
}

/**
 * Inline SVG <symbol> sprite (seal / wax / orn), referenced by the chrome via
 * <use href="#seal"> etc. Ported verbatim from the prototype.
 */
export function sprite() {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="seal" viewBox="0 0 100 100">
    <defs><path id="seal-arc" d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" fill="none"/></defs>
    <circle cx="50" cy="50" r="47.2" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <circle cx="50" cy="50" r="39.5" fill="none" stroke="currentColor" stroke-width="0.6" stroke-dasharray="0.4 3" stroke-linecap="round"/>
    <text font-family="'Space Mono',monospace" font-size="7" letter-spacing="1.7" fill="currentColor"><textPath href="#seal-arc" startOffset="1%">· THE LAW TOME · A LIVING INDEX · </textPath></text>
    <g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
      <path d="M50,39 v23"/>
      <path d="M50,39 C43,35 34,35 27,38 L27,58 C34,55 43,55 50,59 Z"/>
      <path d="M50,39 C57,35 66,35 73,38 L73,58 C66,55 57,55 50,59 Z"/>
    </g>
    <g stroke="currentColor" stroke-width="0.8" stroke-linecap="round">
      <path d="M33,43 h10 M33,47.5 h9 M33,52 h8 M57,43 h10 M58,47.5 h9 M59,52 h8"/>
    </g>
  </symbol>
  <symbol id="wax" viewBox="0 0 100 100">
    <path d="M50,5 C57,4 59,12 65,15 C72,18 80,15 83,22 C87,30 80,36 82,44 C83,52 90,55 87,63 C84,72 74,70 69,76 C64,81 63,90 54,90 C46,91 43,83 36,81 C28,79 20,84 15,77 C10,69 17,62 15,54 C13,46 5,43 8,35 C11,27 20,28 25,23 C30,18 31,9 40,7 C44,6 46,5 50,5 Z" fill="currentColor"/>
    <circle cx="50" cy="48" r="28" fill="none" stroke="rgba(0,0,0,.17)" stroke-width="1.3"/>
    <g fill="none" stroke="rgba(0,0,0,.2)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M50,38 v22"/><path d="M50,38 C44,35 37,35 32,37 L32,55 C37,53 44,53 50,56 Z"/>
      <path d="M50,38 C56,35 63,35 68,37 L68,55 C63,53 56,53 50,56 Z"/>
    </g>
  </symbol>
  <symbol id="orn" viewBox="0 0 120 12">
    <line x1="0" y1="6" x2="48" y2="6" stroke="currentColor" stroke-width="1"/>
    <line x1="72" y1="6" x2="120" y2="6" stroke="currentColor" stroke-width="1"/>
    <path d="M60,1 L64,6 L60,11 L56,6 Z" fill="currentColor"/>
    <circle cx="49.5" cy="6" r="1.3" fill="currentColor"/><circle cx="70.5" cy="6" r="1.3" fill="currentColor"/>
  </symbol>
</svg>
`;
}

/**
 * Kicker + masthead + nav. Ported from the prototype; nav links are base-relative
 * and the item whose key === `active` gets class="on".
 * @param {object} o
 * @param {string} [o.base='/'] site base path
 * @param {string} [o.active]   key of the active nav item (browse|graph|coin|about)
 * @param {number|string} [o.count] published-law count; caller-supplied placeholder when absent
 */
export function header({ base = '/', active, count } = {}) {
  const nav = [
    ['browse', 'browse/', 'Browse'],
    ['graph', 'graph/', 'The graph'],
    ['coin', 'coin/', 'Coin a law'],
    ['about', 'about/', 'About'],
  ]
    .map(([key, path, label]) => `      <a href="${base}${path}"${key === active ? ' class="on"' : ''}>${label}</a>`)
    .join('\n');
  const c = count == null ? '—' : count;
  return `<header>
  <div class="kicker"><div class="wrap">Vol.&nbsp;I &nbsp;·&nbsp; a living index of named laws &nbsp;·&nbsp; est. mmxxvi &nbsp;·&nbsp; no ads, no tracking</div></div>
  <div class="wrap bar">
    <a class="brand" href="${base}"><svg class="mark" viewBox="0 0 100 100"><use href="#seal"/></svg>The Law Tome</a>
    <nav class="links">
${nav}
    </nav>
    <div class="right">
      <span class="count">${c} laws</span>
      <button class="icon-btn" id="theme" aria-label="Toggle light and dark theme"><span id="th-ico">☾</span></button>
    </div>
  </div>
</header>
`;
}

/**
 * Footer (verbatim from the prototype, incl. the CC BY licence line and seal),
 * then the closing </body></html>. Optional `scripts` markup is emitted just
 * before </body> — the prototype's slot for page-specific inline scripts.
 * @param {object} [o]
 * @param {string} [o.scripts=''] raw <script> markup to inject before </body>
 */
export function footer({ scripts = '' } = {}) {
  return `<footer>
  <div class="wrap foot-grid">
    <div class="foot-note">
      <b>The Law Tome</b> · every entry sourced &amp; cited · corpus licensed CC BY<br>
      Canon: attested &amp; verified. Coined: original, credited, clearly marked.<br>
      A reference project — no ads, no tracking of what you read.
    </div>
    <div class="foot-seal"><svg class="mark" viewBox="0 0 100 100" aria-hidden="true"><use href="#seal"/></svg><span class="seal">Sapere aude.</span></div>
  </div>
</footer>
${scripts ? scripts + '\n' : ''}</body>
</html>
`;
}
