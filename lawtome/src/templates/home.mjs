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

import { head, sprite, header, footer, escapeHtml, lawCard, browseControls, asset, portrait } from './partials.mjs';

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

export function homePage(featuredLaws = [], { publishedCount, base = '/', origin = '', images, eponymSlugs, lawOfTheDay } = {}) {
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
  // The rotating statement is the site's shop window — its name and field are the
  // two things a reader wants to click, so both are links (and stay links as the
  // rotation swaps laws underneath them).
  const heroCatHref = first ? `${base}category/${escapeHtml(first.category)}/` : `${base}browse/`;
  const heroAttrib = first
    ? `— <a class="who" href="${base}laws/${escapeHtml(first.slug)}/">${escapeHtml(first.name)}</a>`
    : '';

  const hero = `<section class="hero">
  <svg class="hero-mark" viewBox="0 0 100 100" aria-hidden="true" data-parallax="0.16"><use href="#seal"/></svg>
  <div class="wrap">
    <div class="eyebrow">The largest unified, defined &amp; sourced index of named laws</div>
    <h1 class="lede">Every named law, principle, and effect — <b>explained, sourced, and cross-linked.</b> One place instead of forty half-finished lists.</h1>
    <svg class="orn" viewBox="0 0 120 12" aria-hidden="true"><use href="#orn"/></svg>
    <div class="stmt-wrap">
      <div class="stmt-meta"><span id="m-no">${heroNo}</span><span class="dot"></span><a class="cat" id="m-cat" href="${heroCatHref}">${heroCat}</a></div>
      <div class="stmt" id="stmt">${heroStmt}</div>
      <div class="attrib" id="attrib">${heroAttrib}</div>
    </div>
    <div class="hero-actions">
      <label class="search">
        <i class="ti ti-search" aria-hidden="true"></i>
        <input id="q" type="search" placeholder="Search a law — or describe the feeling…" autocomplete="off" aria-label="Search laws">
      </label>
      <button class="ghost" id="rand"><i class="ti ti-arrows-shuffle" aria-hidden="true"></i> Random law</button>
    </div>
    <p class="hero-credit">By <a href="https://conyso.com/founder/" rel="author">Krishna Chagti</a> · an initiative by <a href="https://conyso.com">Conyso</a> · <a href="${base}about/">about</a></p>
  </div>
</section>
`;

  // ---- law of the day ----------------------------------------------------
  // This used to live on /quiz/, where nobody arriving at the site ever saw it.
  // It belongs on the front page: one entry, in full, every day, as a reason to
  // come back.
  //
  // Server-rendered rather than left to the client, so the band is real content
  // in the HTML — visible with JS off and readable by a crawler. The pick is
  // deterministic from the date (build/quiz.dayIndex), so the shipped markup is
  // the build day's law; assets/quiz.js recomputes on load and swaps in the
  // reader's actual day when they differ.
  const BADGE = { Empirical: 'b-emp', Heuristic: 'b-heu', 'Folk-adage': 'b-folk', Contested: 'b-con' };
  const lotd = lawOfTheDay
    ? `<section class="sec home-lotd" id="lotd-sec">
  <div class="wrap">
    <div class="lotd" id="lotd" aria-live="polite">
      <div class="lotd-eyebrow">Law of the day</div>
      <div class="lotd-body">
        <a class="lotd-card" href="${base}laws/${escapeHtml(lawOfTheDay.slug)}/">
          <div class="lotd-top"><span class="lotd-no">№ ${escapeHtml(String(lawOfTheDay.no || ''))}</span>${lawOfTheDay.reliability ? `<span class="badge ${BADGE[lawOfTheDay.reliability] || 'b-heu'}">${escapeHtml(lawOfTheDay.reliability)}</span>` : ''}</div>
          <div class="lotd-name">${escapeHtml(lawOfTheDay.name || '')}</div>
          <div class="lotd-say">“${escapeHtml(lawOfTheDay.statement || '')}”</div>
        </a>
      </div>
      <p class="lotd-aside">A different entry every day.</p>
      <a class="lotd-daily" href="${base}quiz/">
        <span class="ld-eyebrow">Today's ten</span>
        <span class="ld-t">Can you name a law from its statement alone?</span>
        <span class="ld-s">Ten questions, the same ten for everybody today. <b>Play →</b></span>
      </a>
    </div>
  </div>
</section>
`
    : '';

  // ---- differentiator strip (why this, not a listicle) ------------------
  // Each claim in the strip is backed by a real page — the index, the method, the
  // graph, the reliability scale — so each cell is the link to its own evidence.
  const trustCell = (n, l, href, num) => `      <a class="ht-cell" href="${base}${href}"><span class="ht-n"${num ? ` data-count="${num}"` : ''}>${n}</span><span class="ht-l">${l}</span></a>`;
  const trust = `<section class="sec home-trust">
  <div class="wrap ht-row" data-reveal-stagger>
${trustCell(count, 'named laws, principles &amp; effects — one index', 'browse/', publishedCount)}
${trustCell('Sourced', 'every entry traced to its origin and cited', 'about/')}
${trustCell('Cross-linked', 'a living graph of relations, not a flat list', 'graph/')}
${trustCell('Rated', 'proven, heuristic, or folklore — marked honestly', 'reliability/')}
  </div>
</section>
`;

  // ---- browse teaser: a SAMPLE of the index, server-rendered so it's
  // visible with JS off and never balloons to all ${count} cards. The client
  // (search.js) honours data-limit — it shows this sample until you search or
  // pick a category, then reveals the full matches.
  const teaserLaws = (Array.isArray(featuredLaws) ? featuredLaws : []).slice(0, 18);
  const teaserCards = teaserLaws.map((l) => lawCard(l, base)).join('\n');
  const browse = `<section class="sec" id="index">
  <div class="wrap">
    <div class="sec-head">
      <h2>Browse the index of named laws</h2>
      <span class="sub" id="showing" aria-live="polite">showing ${teaserLaws.length} of ${count}</span>
    </div>
    <div class="chips" id="chips"></div>
${browseControls({})}    <div class="grid" id="grid" data-limit="18">
${teaserCards}
    </div>
    <div class="sec-more"><a class="ghost" href="${base}browse/"><svg class="ti-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 5h8M13 9h5M13 15h8M13 19h5"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="14" width="4" height="4" rx="1"/></svg> Browse all ${count} laws</a></div>
  </div>
</section>
`;

  // ---- feature showcase: what a flat list can't do ----------------------
  // Inline SVG icons (the icon FONT here is a tiny subset — see partials), all
  // 24×24 line icons in the callout style.
  const svg = (inner) => `<svg class="feat-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const IC = {
    feeling: svg('<path d="M20 14a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><circle cx="10.5" cy="10" r="2"/><path d="M13.4 12.9l1.8 1.8"/>'),
    tension: svg('<circle cx="6" cy="6" r="2.3"/><circle cx="6" cy="18" r="2.3"/><path d="M8.3 6H13l3.5 6-3.5 6H8.3"/><path d="M12 12h6"/>'),
    shield: svg('<path d="M12 3l7 3v5c0 5-3.4 8.2-7 10-3.6-1.8-7-5-7-10V6z"/><path d="M9 12l2 2 4-4.5"/>'),
    stack: svg('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
    clock: svg('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    person: svg('<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>'),
    versus: svg('<rect x="3" y="5" width="7" height="14" rx="1.2"/><rect x="14" y="5" width="7" height="14" rx="1.2"/><path d="M12 4v16"/>'),
    daily: svg('<circle cx="12" cy="12" r="9"/><path d="M9.2 9.4a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2.2-2.6 4"/><circle cx="12" cy="17.5" r="0.6" fill="currentColor"/>'),
    compass: svg('<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'),
  };
  const feat = (href, icon, title, body) =>
    `      <a class="feat" href="${base}${href}" data-tilt>${icon}<span class="feat-t">${title}</span><span class="feat-b">${body}</span></a>`;
  const features = `<section class="sec home-features">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      <h2>More than a list</h2>
      <span class="sub">the things a flat A–Z can't give you</span>
    </div>
    <div class="feat-grid" data-reveal-stagger>
${feat('situations/', IC.feeling, 'Describe the feeling', 'Don’t know the name? Say what’s happening — “we hit the target but the product got worse” — and land on the law that names it.')}
${feat('tension/', IC.tension, 'Laws in tension', 'The principles that disagree, side by side — where one law’s advice is another’s warning.')}
${feat('reliability/', IC.shield, 'Proven, or folklore?', 'Every entry is rated — from measured evidence to plain adage — so you always know what you’re quoting.')}
${feat('collections/', IC.stack, 'Curated collections', 'Themed sets that cut across the index: the razors, why incentives backfire, laws every engineer learns.')}
${feat('timeline/', IC.clock, 'A history of ideas', 'Walk the corpus by century — from ancient maxims to principles coined in living memory.')}
${feat('named-after/', IC.person, 'By their namesake', 'Browse laws under the people behind them — the one-law figures and the thinkers with several.')}
${feat('compare/', IC.versus, 'Two laws, side by side', 'The ideas that get mixed up — Brooks’s Law vs Linus’s Law, precision vs accuracy — laid out together so the difference is obvious.')}
${feat('for/', IC.compass, 'Find your laws', 'Curated ways in for engineers, decision-makers, writers, leaders, and the endlessly curious.')}
${feat('quiz/', IC.daily, 'Test yourself', 'Ten questions from the index: name the law, match the statement, place the field, and judge how far it can be trusted.')}
    </div>
  </div>
</section>
`;

  // The anti-fabrication method lives in full on the About page (and is summed up
  // by the trust strip's "Sourced / Rated"); it used to be restated here nearly
  // verbatim, so the home page no longer carries a third copy of the same claim.

  // ---- graph band -------------------------------------------------------
  const graphBand = `<section class="sec" id="graph" style="padding-top:12px">
  <div class="wrap">
    <div class="graph-band" data-reveal="scale">
      <div class="gb-eyebrow">The connective tissue</div>
      <h2>Every law is a door to three others.</h2>
      <p>Follow <a href="${base}laws/goodharts-law/">Goodhart</a> to <a href="${base}laws/campbells-law/">Campbell</a> to the <a href="${base}laws/cobra-effect/">Cobra Effect</a> to <a href="${base}laws/streisand-effect/">Streisand</a>. The relationship graph is the thing no flat list can give you.</p>
      <a class="ghost" href="${base}graph/"><i class="ti ti-affiliate" aria-hidden="true"></i> Explore the graph</a>
      <svg class="constellation" viewBox="0 0 440 300" aria-hidden="true">
        <g stroke="#3b404e" stroke-width="1" fill="none">
          <path d="M120,150 L230,90"/><path d="M230,90 L330,140"/><path d="M330,140 L300,230"/>
          <path d="M300,230 L180,240"/><path d="M180,240 L120,150"/><path d="M230,90 L180,240"/>
          <path d="M330,140 L400,80"/><path d="M120,150 L60,90"/>
        </g>
        <g class="node"><circle cx="230" cy="90" r="7" fill="#e0a43f" class="pulse"/><text x="242" y="86">Goodhart</text></g>
        <g class="node"><circle cx="330" cy="140" r="5" fill="#df735b"/><text x="342" y="144">Campbell</text></g>
        <g class="node"><circle cx="300" cy="230" r="5" fill="#c9bf9f"/><text x="312" y="234">Cobra</text></g>
        <g class="node"><circle cx="180" cy="240" r="5" fill="#c9bf9f"/><text x="192" y="244">Streisand</text></g>
        <g class="node"><circle cx="120" cy="150" r="6" fill="#e0a43f" class="pulse"/><text x="60" y="150" text-anchor="end" style="fill:#8a8168">Peter</text></g>
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
    <div class="coin" data-reveal="scale">
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

  // ---- marquee ticker: an endless horizontal ribbon of law names -------
  // Duplicated once so the CSS translateX(-50%) loop is seamless. Decorative,
  // so aria-hidden; the names are all reachable through the index below.
  const marqueeNames = featured.map((f) => f.name).filter(Boolean);
  const marqueeRun = marqueeNames.length
    ? marqueeNames.map((n) => `<span class="mq-item">${escapeHtml(n)}</span>`).join('<span class="mq-dot">◆</span>')
    : '';
  const marquee = marqueeNames.length
    ? `<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <div class="marquee-run">${marqueeRun}<span class="mq-dot">◆</span></div>
    <div class="marquee-run">${marqueeRun}<span class="mq-dot">◆</span></div>
  </div>
</div>
`
    : '';

  // ---- pinned horizontal-scroll gallery: vertical scroll drives a
  // horizontal "walk" through a handful of marquee laws. With JS + motion it
  // pins to the viewport and scrubs sideways; without either it degrades to a
  // plain swipeable rail (still fully usable, keyboard- and touch-accessible).
  // The panels introduce the platform itself — what the Tome is, how it's
  // built, and the ways in — rather than parading individual laws. Every claim
  // here is true of the site as it actually ships (verified content, the depth
  // fields, the graph, the reliability tiers, the browse facets).
  const aboutPanels = [
    { eyebrow: 'What it is', h: 'An encyclopedia of<br>named&nbsp;laws', p: 'Every principle that earned a name — laws, effects, razors, paradoxes — gathered in one place and explained in plain language.' },
    { eyebrow: 'Verified, never invented', h: 'Every fact is<br>traced to a&nbsp;source', p: 'Dates, people, and references are checked against primary sources. Nothing here is fabricated or written from memory.' },
    { eyebrow: 'Real depth', h: 'Not just a<br>definition', p: 'Each entry lays out what it says, what it means, the mechanism beneath it, worked examples, where it breaks, and how it gets misread.' },
    { eyebrow: 'The connections', h: 'A map, not<br>a&nbsp;list', p: 'An interactive graph links the laws that reinforce — and contradict — one another, so you can see how the ideas pull against each other.' },
    { eyebrow: 'Honest about certainty', h: 'How far to<br>trust&nbsp;it', p: 'Every law is marked Empirical, Heuristic, Folk-adage, or Contested — so a hard result and a catchy saying are never mistaken for one another.' },
    { eyebrow: 'Ways in', h: 'Find it<br>your&nbsp;way', p: 'Browse by field, by era, or by the person a law is named after — or search by the problem you’re actually trying to solve.' },
  ];
  const aboutPanel = (a, i) => `      <div class="hpanel hpanel--about">
        <span class="hpanel-idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="hpanel-eyebrow">${a.eyebrow}</span>
        <h2>${a.h}</h2>
        <p>${a.p}</p>
      </div>`;
  const walk = `<section class="hscroll" data-hscroll aria-label="An introduction to The Law Tome">
  <div class="hscroll-sticky">
    <div class="hscroll-track">
      <div class="hpanel hpanel--intro">
        <span class="hpanel-eyebrow">A quick tour</span>
        <h2>What is<br>The Law Tome?</h2>
        <p>A reference for the named laws, effects, and principles that quietly shape how the world works. Keep scrolling for what makes it different.</p>
        <span class="hpanel-hint">Scroll <span aria-hidden="true">→</span></span>
      </div>
${aboutPanels.map(aboutPanel).join('\n')}
      <div class="hpanel hpanel--outro">
        <span class="hpanel-eyebrow">${count ? count + ' laws and counting' : 'The whole index'}</span>
        <h2>Start reading.</h2>
        <a class="btn solid hpanel-outro-cta" href="${base}browse/"><svg class="ti-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 5h8M13 9h5M13 15h8M13 19h5"/><rect x="3" y="4" width="4" height="4" rx="1"/><rect x="3" y="14" width="4" height="4" rx="1"/></svg> Browse the whole index</a>
      </div>
    </div>
    <div class="hscroll-rail"><span class="hscroll-bar"></span></div>
  </div>
</section>
`;

  // ---- inline hero-rotation script (grid/search wiring is Task 10) ------
  const scripts = `<script>
const LAWS=${featuredJson};
const BASE=${JSON.stringify(base)};
(function(){
  var s=document.getElementById('stmt');if(!s||LAWS.length<2)return;
  // Respect reduced-motion: hold on the first statement, no auto-cycling.
  try{if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;}catch(e){}
  var hi=0,timer=null,hero=document.querySelector('.hero');
  function setHero(i){
    var l=LAWS[i];
    s.style.opacity=0;
    setTimeout(function(){
      document.getElementById('m-no').textContent='№ '+l.no;
      var mc=document.getElementById('m-cat');mc.textContent=l.category;
      mc.setAttribute('href',BASE+'category/'+encodeURIComponent(l.category)+'/');
      s.innerHTML='<q>'+l.hero+'</q>';
      document.getElementById('attrib').innerHTML='— <a class="who" href="'+BASE+'laws/'+encodeURIComponent(l.slug)+'/">'+l.nameHtml+'</a>';
      s.style.opacity=1;
    },300);
  }
  function tick(){hi=(hi+1)%LAWS.length;setHero(hi);}
  function play(){if(!timer)timer=setInterval(tick,5200);}
  function pause(){if(timer){clearInterval(timer);timer=null;}}
  // Pause while the reader hovers or keyboard-focuses the hero, or the tab is
  // hidden — so the statement never changes out from under someone reading it.
  if(hero){hero.addEventListener('pointerenter',pause);hero.addEventListener('pointerleave',play);hero.addEventListener('focusin',pause);hero.addEventListener('focusout',play);}
  document.addEventListener('visibilitychange',function(){document.hidden?pause():play();});
  // Fixed-size statement zone: measure the TALLEST law's height across the whole
  // rotation and lock the block to it, centring each statement inside — so short
  // and long laws occupy the same space and nothing below ever jumps as it cycles.
  function reserve(){
    s.style.height='auto';s.style.display='';
    var save=s.innerHTML,max=0;
    for(var i=0;i<LAWS.length;i++){s.innerHTML='<q>'+LAWS[i].hero+'</q>';if(s.offsetHeight>max)max=s.offsetHeight;}
    s.innerHTML=save;
    s.style.display='flex';s.style.flexDirection='column';s.style.justifyContent='center';
    s.style.height=max+'px';
  }
  reserve();
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(reserve,180);},{passive:true});
  play();
})();
</script>
<script defer src="${asset(base, 'assets/search.js')}"></script>
<script defer src="${asset(base, 'assets/quiz.js')}"></script>`;

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
    isAccessibleForFree: true,
    publishingPrinciples: `${homeUrl}about/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${origin}${base}?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Law Tome',
    url: homeUrl,
    description: 'A living, sourced index of named laws, principles, and effects.',
    logo: { '@type': 'ImageObject', url: `${homeUrl}assets/logo.svg`, width: 512, height: 512 },
    // E-E-A-T: the editorial method + corrections process are stated on /about/.
    publishingPrinciples: `${homeUrl}about/`,
    correctionsPolicy: `${homeUrl}about/`,
    // The Law Tome is an initiative by Conyso, its publisher.
    parentOrganization: {
      '@type': 'Organization',
      name: 'Conyso',
      url: 'https://conyso.com',
      slogan: 'Building and backing companies, run with operating discipline.',
      description: 'A holding company that builds and backs companies run with operating discipline — strategy, education, software, and ventures under one roof.',
    },
    // Creator — the person behind the project (also founder & CEO of Conyso).
    founder: {
      '@type': 'Person',
      name: 'Krishna Chagti',
      jobTitle: 'Founder & CEO, Conyso',
      url: 'https://conyso.com/founder/',
      sameAs: ['https://conyso.com/founder/', 'https://www.linkedin.com/in/krishna-chagti', 'https://github.com/krishnachagti-sudo'],
    },
  };
  const definedTermSet = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'The Law Tome',
    url: homeUrl,
    description,
    ...(publishedCount != null ? { hasDefinedTerm: `${publishedCount} named laws, principles, and effects` } : {}),
  };

  // ---- the people band --------------------------------------------------
  // Real faces, not stock and not generated: every portrait here is a verified,
  // licensed image of a person the corpus is named after (see build/fetch-images.py),
  // and each one is the link to the eponym index. It earns its place by being the
  // one thing a text-only index can never show — that these are real people who
  // put their name to an idea. Renders nothing at all if no images are curated.
  // Only people who actually have a row in the eponym index: merging duplicate
  // laws can retire a namesake while their portrait stays in the manifest, and
  // linking to an anchor that no longer exists drops the reader at the top of a
  // 600-name page with no idea why.
  const faces = Object.values((images && images.people) || {})
    .filter((img) => !eponymSlugs || eponymSlugs.has(img.slug));
  const peopleBand = faces.length >= 12
    ? `<section class="sec people-band">
  <div class="wrap">
    <div class="pb-head">
      <h2>The people who put their name to an idea</h2>
      <a class="pb-more" href="${base}named-after/">Browse every namesake <span aria-hidden="true">→</span></a>
    </div>
    <div class="pb-strip">
${faces.slice(0, 28).map((img) => `      <a class="pb-face" href="${base}named-after/#ep-${escapeHtml(img.slug)}" title="${escapeHtml(img.person)}">${portrait(img, { base, small: true, alt: img.person })}</a>`).join('\n')}
    </div>
    <p class="pb-note">Every image is a real photograph or engraving, in the public domain or under a Creative Commons licence — <a href="${base}credits/">credited in full</a>. None of it is generated.</p>
  </div>
</section>
`
    : '';

  return (
    head({
      title: 'The Law Tome — Named Laws, Principles & Effects, Explained & Sourced',
      description,
      base,
      origin,
      path: '',
      jsonld: [website, organization, definedTermSet],
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    hero +
    marquee +
    lotd +
    trust +
    peopleBand +
    browse +
    features +
    walk +
    graphBand +
    coinBand +
    footer({ base, scripts })
  );
}
