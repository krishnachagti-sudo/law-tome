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

// The reliability scale, in strongest-to-weakest order, with a one-line gloss.
// Shared so the law page, the browse/tier listings, and the reliability hub all
// describe the same tiers identically (they diverged once on a badge key).
export const RELIABILITY_TIERS = ['Empirical', 'Heuristic', 'Folk-adage', 'Contested'];
export const RELIABILITY_NOTE = {
  Empirical: 'grounded in studies or measurable evidence',
  Heuristic: 'a dependable rule of thumb, not a proven theorem',
  'Folk-adage': 'a proverb or saying, not a scientific finding',
  Contested: 'disputed — the evidence is debated',
};
/** URL slug for a reliability value: 'Folk-adage' -> 'folk-adage'. */
export function reliabilitySlug(reliability) {
  return String(reliability || '').toLowerCase();
}

/**
 * One `.card` anchor for a law, faithful to the prototype's render() markup.
 * Shared by the browse/category listings and the Coined wing so the card shape
 * cannot drift between them. Every corpus string is escaped.
 */
// `level` is the heading level for the card title (default 3). Pages that place
// cards directly under the page <h1> with no intervening section heading (browse,
// category, collections, audiences, the Coined wing) pass 2 to avoid an h1→h3
// skip; the homepage keeps 3 (its cards sit under an <h2> section head).
export function lawCard(law, base, level = 3) {
  const rels = Array.isArray(law.related) ? law.related.length : 0;
  const h = level === 2 ? 'h2' : 'h3';
  return `   <a class="card" href="${base}laws/${escapeHtml(law.slug)}/">
     <div class="top"><span class="no">№ ${escapeHtml(law.no)}</span><span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span></div>
     <${h} class="card-name">${escapeHtml(law.name)}</${h}>
     <div class="say">"${escapeHtml(law.statement)}"</div>
     <div class="foot"><span class="cat">${escapeHtml(law.category)}</span><span class="rel"><i class="ti ti-affiliate" style="font-size:13px" aria-hidden="true"></i> ${rels} related</span></div>
   </a>`;
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
 *
 * SEO / AEO / GEO: every page gets a canonical link, a robots directive, Open
 * Graph + Twitter card meta, and theme-color hints. Canonical/og:url are derived
 * from `origin`+`base`+`path` when not passed explicitly, so a caller only has to
 * supply its base-relative `path` to be fully addressable. og:image is promoted
 * to an absolute URL (crawlers reject relative image refs).
 * @param {object} o
 * @param {string} o.title        document title (required)
 * @param {string} [o.description] meta description; emitted only when given
 * @param {string} [o.base='/']   site base path — MUST end with '/', e.g. '/lawtome/'
 * @param {string} [o.origin='']  absolute origin, e.g. 'https://example.com'
 * @param {string} [o.path]       base-relative page path (e.g. 'laws/goodharts-law/'); used to derive canonical/og:url
 * @param {string} [o.canonical]  explicit canonical URL (overrides the derived one)
 * @param {object} [o.og]         Open Graph fields {title,description,image,type}
 * @param {string} [o.siteName='The Law Tome'] og:site_name
 * @param {string} [o.robots]     robots directive (defaults to a permissive, rich-preview policy)
 * @param {object[]} [o.jsonld]   array of JSON-LD objects; each emitted via jsonLd()
 */
export function head({ title, description, base = '/', origin = '', path, canonical, og, jsonld, siteName = 'The Law Tome', robots, modified, published, alternates } = {}) {
  const canon = canonical || (path != null ? `${origin}${base}${path}` : undefined);
  const out = [
    '<!DOCTYPE html>',
    '<html lang="en" data-theme="dark">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(title)}</title>`,
  ];
  if (description) out.push(`<meta name="description" content="${escapeHtml(description)}">`);
  // Crawler + generative-answer directives: index freely and allow large image /
  // full-text previews so AI answer engines can quote and cite the entry.
  out.push(`<meta name="robots" content="${escapeHtml(robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')}">`);
  if (canon) out.push(`<link rel="canonical" href="${escapeHtml(canon)}">`);
  // Open Graph — social + generative-engine link unfurls.
  out.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}">`);
  out.push('<meta property="og:locale" content="en_US">');
  out.push(`<meta property="og:type" content="${escapeHtml((og && og.type) || 'website')}">`);
  if (canon) out.push(`<meta property="og:url" content="${escapeHtml(canon)}">`);
  const ogTitle = (og && og.title) || title;
  const ogDesc = (og && og.description) || description;
  if (ogTitle) out.push(`<meta property="og:title" content="${escapeHtml(ogTitle)}">`);
  if (ogDesc) out.push(`<meta property="og:description" content="${escapeHtml(ogDesc)}">`);
  // Article freshness signals (GEO): AI answer engines favour recently-updated
  // sources. Emitted only for og:type=article and only when a date is supplied.
  if (og && og.type === 'article') {
    if (published) out.push(`<meta property="article:published_time" content="${escapeHtml(published)}">`);
    if (modified) out.push(`<meta property="article:modified_time" content="${escapeHtml(modified)}">`);
  }
  // og:image → absolute (crawlers reject base-relative refs). A caller passes the
  // base-relative path (starts with `base`, i.e. '/'); prefix the origin.
  let ogImage = og && og.image;
  if (ogImage && origin && ogImage.startsWith('/')) ogImage = origin + ogImage;
  if (ogImage) {
    out.push(`<meta property="og:image" content="${escapeHtml(ogImage)}">`);
    out.push('<meta property="og:image:width" content="1200">');
    out.push('<meta property="og:image:height" content="630">');
  }
  // Twitter card — mirrors OG so X/other unfurlers get a large-image preview.
  out.push(`<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}">`);
  if (ogTitle) out.push(`<meta name="twitter:title" content="${escapeHtml(ogTitle)}">`);
  if (ogDesc) out.push(`<meta name="twitter:description" content="${escapeHtml(ogDesc)}">`);
  if (ogImage) out.push(`<meta name="twitter:image" content="${escapeHtml(ogImage)}">`);
  // Theme-color: match the masthead paper/ink so the browser chrome blends in.
  out.push('<meta name="theme-color" content="#f4f1e8" media="(prefers-color-scheme: light)">');
  out.push('<meta name="theme-color" content="#14161c" media="(prefers-color-scheme: dark)">');
  // Site identity: SVG favicon (modern browsers), a rasterised apple-touch-icon,
  // a web-app manifest, and RSS/Atom autodiscovery for the latest-entries feed.
  out.push(`<link rel="icon" href="${base}assets/logo.svg" type="image/svg+xml">`);
  out.push(`<link rel="apple-touch-icon" href="${base}icon-512.png">`);
  out.push(`<link rel="manifest" href="${base}site.webmanifest">`);
  out.push(`<link rel="alternate" type="application/atom+xml" title="${escapeHtml(siteName)} — latest entries" href="${base}feed.xml">`);
  // Extra alternate representations (e.g. a clean Markdown twin for LLMs/agents).
  if (Array.isArray(alternates)) for (const a of alternates) {
    if (a && a.href && a.type) out.push(`<link rel="alternate" type="${escapeHtml(a.type)}"${a.title ? ` title="${escapeHtml(a.title)}"` : ''} href="${escapeHtml(a.href)}">`);
  }
  // Preload the two primary text faces (Newsreader roman + italic, Latin) so the
  // above-the-fold title and statement paint without waiting on the stylesheet to
  // parse first — cuts LCP. Same URLs the @font-face rules resolve to, so they
  // dedupe. Fonts require crossorigin even when same-origin.
  out.push(`<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/fonts/Newsreader-normal-latin.woff2">`);
  out.push(`<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/fonts/Newsreader-italic-latin.woff2">`);
  // Self-hosted stylesheets — replaces the prototype's Google-Fonts + jsDelivr
  // <link>s. Fonts are pulled in by the @font-face rules inside styles.css.
  out.push(`<link rel="stylesheet" href="${base}assets/styles.css">`);
  out.push(`<link rel="stylesheet" href="${base}assets/icons/tabler.css">`);
  // Inline theme-init (mirrors common.js): set data-theme before first paint so
  // dark-mode readers never flash the light theme. common.js is deferred below.
  // Theme-init (flash-free dark mode) + reveal-arm: add `.anim` before first paint
  // so scroll-reveal never flashes, but ONLY when motion is allowed and IO exists —
  // otherwise content stays fully visible with no JS dependency.
  out.push(`<script>(function(){var d=document.documentElement,t;try{t=localStorage.getItem('lt-theme')}catch(e){}if(t)d.setAttribute('data-theme',t);else if(window.matchMedia&&matchMedia('(prefers-color-scheme: light)').matches)d.setAttribute('data-theme','light');try{if(window.matchMedia&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window)d.classList.add('anim')}catch(e){}})();</script>`);
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
  <symbol id="moon" viewBox="0 0 24 24">
    <path d="M21 12.9A9 9 0 1 1 11.1 3 7 7 0 0 0 21 12.9Z" fill="currentColor"/>
  </symbol>
  <symbol id="sun" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4.2" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2.4v2.4"/><path d="M12 19.2v2.4"/><path d="M4.2 4.2l1.7 1.7"/><path d="M18.1 18.1l1.7 1.7"/><path d="M2.4 12h2.4"/><path d="M19.2 12h2.4"/><path d="M4.2 19.8l1.7-1.7"/><path d="M18.1 5.9l1.7-1.7"/></g>
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
  // Primary nav. "What's the law for…?" is the promise the hero makes, so it earns
  // a header slot rather than living only in the footer.
  const nav = [
    ['browse', 'browse/', 'Browse'],
    ['situations', 'situations/', 'What’s the law for…?'],
    ['graph', 'graph/', 'The graph'],
    ['features', 'features/', 'Features'],
    ['coin', 'coin/', 'Coin a law'],
    ['about', 'about/', 'About'],
  ]
    .map(([key, path, label]) => `        <a href="${base}${path}"${key === active ? ' class="on" aria-current="page"' : ''}>${label}</a>`)
    .join('\n');
  // Ship the thousands-separated number in the static HTML so no-JS readers (and
  // the first paint before common.js runs) see "1,122", not "1122". The count-up
  // animation still reads the raw value from data-count.
  const c = count == null ? '—' : (typeof count === 'number' ? count.toLocaleString('en-US') : count);
  return `<a class="skip" href="#main-content">Skip to content</a>
<header>
  <div class="kicker"><div class="wrap kick-in">
    <span class="k-l">Vol.&nbsp;I</span>
    <span class="k-c">a living index of named laws · est.&nbsp;mmxxvi</span>
    <span class="k-r">no ads · no tracking</span>
  </div></div>
  <div class="wrap bar">
    <a class="brand" href="${base}" aria-label="The Law Tome — home">
      <svg class="mark" viewBox="0 0 100 100" aria-hidden="true"><use href="#seal"/></svg>
      <span class="brand-txt"><span class="brand-name">The Law Tome</span><span class="brand-sub">index of named laws</span></span>
    </a>
    <nav class="links" id="primary-nav" aria-label="Primary">
${nav}
    </nav>
    <div class="right">
      <a class="count" href="${base}browse/"><span class="count-n"${typeof count === 'number' ? ` data-count="${count}"` : ''}>${c}</span><span class="count-l">entries</span></a>
      <button class="icon-btn" id="theme" type="button" aria-label="Toggle light and dark theme" aria-pressed="false"><svg class="th-ico th-moon" viewBox="0 0 24 24" aria-hidden="true"><use href="#moon"/></svg><svg class="th-ico th-sun" viewBox="0 0 24 24" aria-hidden="true"><use href="#sun"/></svg></button>
      <button class="icon-btn menu-btn" id="menu" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav"><svg class="th-ico m-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg><svg class="th-ico m-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>
  </div>
</header>
<main id="main-content" tabindex="-1">
`;
}

/**
 * Faceted browse controls — a reliability-tier filter, a sort selector, and a
 * "group by tier" toggle. Shared by the homepage teaser and the /browse/ +
 * category pages so they behave identically; wired client-side by search.js.
 * @param {object} [o]
 * @param {boolean} [o.isReliability=false] on a reliability-tier page the tier is
 *   fixed, so the tier chips and group toggle are omitted (sort only).
 */
export function browseControls({ isReliability = false } = {}) {
  const REL_TIERS = [['', 'All tiers', ''], ['Empirical', 'Empirical', 'var(--ok)'], ['Heuristic', 'Heuristic', 'var(--gold)'], ['Folk-adage', 'Folk-adage', 'var(--faint)'], ['Contested', 'Contested', 'var(--con)']];
  const relChips = `<div class="chips chips--rel" id="rel-chips" role="group" aria-label="Filter by reliability tier">${REL_TIERS.map(([val, label, col], i) => `<button class="chip${i === 0 ? ' on' : ''}" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" data-r="${escapeHtml(val)}">${col ? `<span class="rel-dot" style="background:${col}"></span>` : ''}${escapeHtml(label)}</button>`).join('')}</div>`;
  const sortControl = `<div class="browse-sort">
      <label class="browse-sort-l" for="sort">Sort</label>
      <select id="sort" class="browse-select" aria-label="Sort laws">
        <option value="no">№ order</option>
        <option value="az">Name A–Z</option>
        <option value="za">Name Z–A</option>
        <option value="rels">Most connected</option>
        <option value="tier">By reliability</option>
      </select>${isReliability ? '' : `
      <button class="chip group-toggle" id="group-toggle" type="button" aria-pressed="false">Group by tier</button>`}
    </div>`;
  return `    <div class="browse-controls">${isReliability ? '' : relChips}${sortControl}</div>\n`;
}

/**
 * Footer (verbatim from the prototype, incl. the CC BY licence line and seal),
 * then the closing </body></html>. Optional `scripts` markup is emitted just
 * before </body> — the prototype's slot for page-specific inline scripts.
 * @param {object} [o]
 * @param {string} [o.scripts=''] raw <script> markup to inject before </body>
 */
export function footer({ base = '/', scripts = '' } = {}) {
  const col = (heading, links) => `      <nav class="foot-col" aria-label="${escapeHtml(heading)}">
        <h2>${escapeHtml(heading)}</h2>
${links.map(([path, label]) => `        <a href="${base}${path}">${escapeHtml(label)}</a>`).join('\n')}
      </nav>`;
  // Close the <main> landmark opened in header() before the site footer.
  return `</main>
<footer>
  <div class="wrap foot-grid">
    <div class="foot-brand">
      <a class="foot-seal" href="${base}" aria-label="The Law Tome — home">
        <svg class="mark" viewBox="0 0 100 100" aria-hidden="true"><use href="#seal"/></svg>
        <span class="brand-name">The Law Tome</span>
      </a>
      <p class="foot-blurb">A living, sourced index of named laws, principles, and effects — every entry traced to its origin and cited. No ads, no tracking of what you read.</p>
      <p class="foot-conyso">Created by <a href="https://conyso.com/founder/" rel="author">Krishna Chagti</a> · an initiative by <a href="https://conyso.com">Conyso</a>.</p>
      <p class="foot-motto">Sapere aude.</p>
    </div>
${col('Browse', [['browse/', 'All laws'], ['for/', 'Find your laws'], ['collections/', 'Collections'], ['timeline/', 'Timeline'], ['named-after/', 'By namesake'], ['reliability/', 'By reliability']])}
${col('Discover', [['situations/', "What's the law for…?"], ['graph/', 'The graph'], ['compare/', 'Compare laws'], ['tension/', 'Laws in tension'], ['features/', 'Features'], ['quiz/', 'Law of the day'], ['saved/', 'Saved laws']])}
${col('The project', [['about/', 'About & method'], ['manifesto/', 'Why name a law?'], ['data/', 'Download the data'], ['coin/', 'Coin a law'], ['coined/', 'The Coined wing'], ['feed.xml', 'Subscribe (RSS)'], ['privacy/', 'Privacy']])}
  </div>
  <div class="wrap foot-rule">
    <span>Canon: attested &amp; verified. Coined: original, credited, clearly marked.</span>
    <span>Corpus licensed <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC&nbsp;BY&nbsp;4.0</a>.</span>
  </div>
</footer>
${scripts ? scripts + '\n' : ''}</body>
</html>
`;
}
