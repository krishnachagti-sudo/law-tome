// Homepage template — one full HTML document for the site index.
//
// Ported from the approved prototype index.html, reusing the Task 5 chrome
// partials (head/sprite/header/footer/jsonLd/escapeHtml). Composition:
//   head({...}) + sprite() + header({...}) + hero + browse-teaser
//   + graph-band + coin-band + footer({scripts})
//
// Deliberate departures from the prototype (all mandated by the spec / prior tasks):
//   1. The hard-coded "1,400 laws" / "showing 10 of 1,400" placeholders are
//      REPLACED by the real publishedCount, formatted with Intl.NumberFormat.
//   2. The bare "world's largest" claim is REPLACED by the QUALIFIED wording
//      "largest unified, defined & sourced index" (spec §1).
//   3. The client-side search / grid / random-law wiring is Task 10 (search.js).
//      This template renders the empty containers (#chips #grid #q #rand) plus a
//      small inline HERO-ROTATION script only; grid + search stay for Task 10.
//   4. The prototype's inline LAWS array (bespoke sample data) is REPLACED by the
//      real featuredLaws, serialised with `<` -> < so corpus text containing
//      "</script>" cannot break out of the inline <script> (Task 5/6 lesson).
//
// EVERY corpus string rendered directly into markup goes through escapeHtml; the
// inline JSON blob is neutralised with the `<`-escape above; and the fields the
// client rotation writes via innerHTML (`hero`, `nameHtml`) are PRE-escaped in
// the blob, so the rotation cannot inject markup either.

import { head, sprite, header, footer, escapeHtml } from './partials.mjs';

/**
 * Escape the statement, then wrap the accent phrase in <span class="accent">.
 * Mirrors law.mjs renderStatement so the hero highlight matches the law page.
 */
function renderStatement(statement, accent) {
  if (!accent) return escapeHtml(statement);
  const i = statement.indexOf(accent);
  if (i === -1) return escapeHtml(statement);
  // Split the RAW statement at the RAW accent, then escape each part. This can
  // never match the accent inside an entity produced by escaping (e.g. "amp"
  // within "&amp;"), and sidesteps String.replace's $-pattern handling entirely.
  return escapeHtml(statement.slice(0, i)) +
    `<span class="accent">${escapeHtml(accent)}</span>` +
    escapeHtml(statement.slice(i + accent.length));
}

export function homePage(featuredLaws = [], { publishedCount, base = '/', origin = '' } = {}) {
  const nf = new Intl.NumberFormat('en');
  const count = publishedCount == null ? '—' : nf.format(publishedCount);

  const description =
    'The largest unified, defined & sourced index of named laws, principles, and effects — explained, cross-linked, and searchable.';

  // ---- featured payload for the inline hero rotation ---------------------
  // Only the fields the hero needs. `hero` is the accent-highlighted, escaped
  // statement HTML (same recipe as the law page).
  const featured = (Array.isArray(featuredLaws) ? featuredLaws : []).slice(0, 12).map((l) => ({
    no: l.no,
    slug: l.slug,
    name: l.name,
    nameHtml: escapeHtml(l.name), // pre-escaped for the client rotation's innerHTML write
    statement: l.statement,
    statementAccent: l.statementAccent || '',
    hero: renderStatement(l.statement, l.statementAccent),
    category: l.category,
    reliability: l.reliability,
  }));
  // application/json-ish blob embedded in a live <script>. Escaping every `<`
  // turns "</script>" into "</script>" (cannot close the element) and
  // neutralises any other markup-looking corpus text.
  const featuredJson = JSON.stringify(featured).replace(/</g, '\\u003c');

  // ---- initial hero (server-rendered first frame) -----------------------
  const first = featured[0];
  const heroStmt = first ? `<q>${first.hero}</q>` : '<q>—</q>';
  const heroNo = first ? `№ ${escapeHtml(first.no)}` : '№ —';
  const heroCat = first ? escapeHtml(first.category) : '';
  const heroAttrib = first ? `— <span class="who">${escapeHtml(first.name)}</span>` : '';

  const hero = `<section class="hero">
  <svg class="hero-mark" viewBox="0 0 100 100" aria-hidden="true"><use href="#seal"/></svg>
  <div class="wrap">
    <div class="eyebrow">The largest unified, defined &amp; sourced index of named laws</div>
    <p class="lede">Every named law, principle, and effect — <b>explained, sourced, and cross-linked.</b> One place instead of forty half-finished lists.</p>
    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>
    <div class="stmt-wrap">
      <div class="stmt-meta"><span id="m-no">${heroNo}</span><span class="dot"></span><span class="cat" id="m-cat">${heroCat}</span></div>
      <div class="stmt" id="stmt">${heroStmt}</div>
      <div class="attrib" id="attrib">${heroAttrib}</div>
    </div>
    <div class="hero-actions">
      <label class="search">
        <i class="ti ti-search" aria-hidden="true"></i>
        <input id="q" placeholder="Search a law — or describe the feeling…" autocomplete="off" aria-label="Search laws">
      </label>
      <button class="ghost" id="rand"><i class="ti ti-arrows-shuffle" aria-hidden="true"></i> Random law</button>
    </div>
  </div>
</section>
`;

  // ---- browse teaser (containers wired by Task 10) ----------------------
  const browse = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h2>Browse the index</h2>
      <span class="sub" id="showing">showing 0 of ${count}</span>
    </div>
    <div class="chips" id="chips"></div>
    <div class="grid" id="grid"></div>
    <div class="sec-more"><a class="ghost" href="${base}browse/"><i class="ti ti-list-details" aria-hidden="true"></i> Browse all ${count} laws</a></div>
  </div>
</section>
`;

  // ---- graph band -------------------------------------------------------
  const graphBand = `<section class="sec" id="graph" style="padding-top:12px">
  <div class="wrap">
    <div class="graph-band">
      <div class="gb-eyebrow">The connective tissue</div>
      <h2>Every law is a door to three others.</h2>
      <p>Follow Goodhart to Campbell to the Cobra Effect to Streisand. The relationship graph is the thing no flat list can give you.</p>
      <a class="ghost" href="${base}graph/"><i class="ti ti-affiliate" aria-hidden="true"></i> Explore the graph</a>
      <svg class="constellation" viewBox="0 0 440 300" aria-hidden="true">
        <g stroke="#3c341f" stroke-width="1" fill="none">
          <path d="M120,150 L230,90"/><path d="M230,90 L330,140"/><path d="M330,140 L300,230"/>
          <path d="M300,230 L180,240"/><path d="M180,240 L120,150"/><path d="M230,90 L180,240"/>
          <path d="M330,140 L400,80"/><path d="M120,150 L60,90"/>
        </g>
        <g class="node"><circle cx="230" cy="90" r="7" fill="#d8a63f" class="pulse"/><text x="242" y="86">Goodhart</text></g>
        <g class="node"><circle cx="330" cy="140" r="5" fill="#e05a44"/><text x="342" y="144">Campbell</text></g>
        <g class="node"><circle cx="300" cy="230" r="5" fill="#c9bf9f"/><text x="312" y="234">Cobra</text></g>
        <g class="node"><circle cx="180" cy="240" r="5" fill="#c9bf9f"/><text x="192" y="244">Streisand</text></g>
        <g class="node"><circle cx="120" cy="150" r="6" fill="#d8a63f" class="pulse"/><text x="60" y="150" text-anchor="end" style="fill:#8a8168">Peter</text></g>
        <g class="node"><circle cx="400" cy="80" r="3.5" fill="#6e6650"/></g>
        <g class="node"><circle cx="60" cy="90" r="3.5" fill="#6e6650"/></g>
      </svg>
    </div>
  </div>
</section>
`;

  // ---- coin band --------------------------------------------------------
  const coinBand = `<section class="sec" id="coin" style="padding-top:12px">
  <div class="wrap">
    <div class="coin">
      <svg class="wax" viewBox="0 0 100 100" aria-hidden="true"><use href="#wax"/></svg>
      <div class="coin-body">
        <h2>Noticed a pattern that has no name?</h2>
        <p>Coin it. Submit an original law — if it holds up, we publish it in the Coined wing with your name on it. Nobody else lets you do this.</p>
      </div>
      <a class="cta" href="${base}coin/"><i class="ti ti-feather" aria-hidden="true"></i> Coin a law</a>
    </div>
  </div>
</section>
`;

  // ---- inline hero-rotation script (grid/search wiring is Task 10) ------
  const scripts = `<script>
const LAWS=${featuredJson};
(function(){
  var s=document.getElementById('stmt');if(!s||LAWS.length<2)return;
  var hi=0;
  function setHero(i){
    var l=LAWS[i];
    s.style.opacity=0;
    setTimeout(function(){
      document.getElementById('m-no').textContent='№ '+l.no;
      document.getElementById('m-cat').textContent=l.category;
      s.innerHTML='<q>'+l.hero+'</q>';
      document.getElementById('attrib').innerHTML='— <span class="who">'+l.nameHtml+'</span>';
      s.style.opacity=1;
    },300);
  }
  setInterval(function(){hi=(hi+1)%LAWS.length;setHero(hi)},5200);
})();
</script>
<script defer src="${base}assets/search.js"></script>`;

  // ---- JSON-LD: identify the site + wire the sitelinks searchbox --------
  // WebSite carries a SearchAction so search engines can surface an in-SERP
  // searchbox pointing at our client search; Organization gives AI answer engines
  // a stable publisher entity to attribute; DefinedTermSet types the directory.
  const homeUrl = `${origin}${base}`;
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Law Tome',
    alternateName: 'Law Tome',
    url: homeUrl,
    description,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${origin}${base}browse/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Law Tome',
    url: homeUrl,
    description: 'A living, sourced index of named laws, principles, and effects.',
  };
  const definedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'The Law Tome',
    url: homeUrl,
    description,
    ...(publishedCount != null ? { hasDefinedTerm: `${publishedCount} named laws, principles, and effects` } : {}),
  };

  return (
    head({
      title: 'The Law Tome — every named law, principle, and effect',
      description,
      base,
      origin,
      path: '',
      jsonld: [website, organization, definedTermSet],
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    hero +
    browse +
    graphBand +
    coinBand +
    footer({ base, scripts })
  );
}
