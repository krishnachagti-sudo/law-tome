// Law-page template — one full HTML document per law entry.
//
// Ported from the approved prototype laws/goodharts-law.html, reusing the Task 5
// chrome partials (head/sprite/header/footer/jsonLd/escapeHtml). Composition:
//   head({...}) + sprite() + header({...}) + <entry + layout> + footer({scripts})
//
// Deliberate departures from the prototype markup (both documented in Task 6):
//   1. The hand-written standalone "Reliability" prose block is DROPPED. That
//      paragraph was bespoke per-law copy, not a corpus field, and reliability
//      is already surfaced in entry-meta and the at-a-glance panel. Fabricating
//      it would violate the anti-fabrication rule.
//   2. The decorative per-law <svg class="minigraph"> is OMITTED. The real
//      relationship graph is Task 11; the prototype's node coordinates were
//      hand-placed, not derived data. The textual .rel-list is kept.
//
// EVERY corpus string interpolated into markup goes through escapeHtml. The
// statement accent is injected AFTER escaping (see renderStatement).

import { head, sprite, header, footer, escapeHtml, reliabilityClass } from './partials.mjs';

/**
 * Wrap the accent phrase in <span class="accent"> within the statement. Splits the
 * RAW statement at the RAW accent, then escapes each part — so the accent can never
 * match inside an HTML entity produced by escaping (e.g. "amp" within "&amp;"), and
 * String.replace's $-pattern handling is avoided. Absent accent => plain escaped.
 */
function renderStatement(law) {
  const { statement, statementAccent } = law;
  if (!statementAccent) return escapeHtml(statement);
  const i = statement.indexOf(statementAccent);
  if (i === -1) return escapeHtml(statement);
  return escapeHtml(statement.slice(0, i)) +
    `<span class="accent">${escapeHtml(statementAccent)}</span>` +
    escapeHtml(statement.slice(i + statementAccent.length));
}

/** A single "At a glance" row, only when the value is present. */
function glanceRow(k, v) {
  if (v == null || v === '') return '';
  return `          <div class="row"><span class="k">${escapeHtml(k)}</span><span class="v">${escapeHtml(v)}</span></div>\n`;
}

export function lawPage(law, ctx = {}) {
  const { byslug = {}, categories = {}, base = '/', origin = '', prev, next } = ctx;
  const coined = law.provenance === 'coined';
  const catLabel = categories[law.category] || law.category || '';
  const canonical = `${origin}${base}laws/${law.slug}/`;
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;
  const description = law.meaning || law.statement;

  // ---- entry section ----------------------------------------------------
  const metaBadge = coined
    ? '<span class="badge b-folk">Coined</span>'
    : `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability)}</span>`;

  const meta = [
    `<span>№ ${escapeHtml(law.no)}</span><span class="dot"></span>`,
    `${metaBadge}<span class="dot"></span>`,
    `<span class="cat">${escapeHtml(law.category)}</span>`,
  ];
  if (law.coinedYear != null) meta.push(`<span class="dot"></span>\n      <span>coined ${escapeHtml(law.coinedYear)}</span>`);

  const aka = Array.isArray(law.aliases) && law.aliases.length
    ? `\n    <div class="aka">also known as — ${law.aliases.map(escapeHtml).join(', ')}</div>`
    : '';

  const entry = `<section class="entry">
  <svg class="entry-mark" viewBox="0 0 100 100" aria-hidden="true"><use href="#seal"/></svg>
  <div class="wrap-wide">
    <nav class="crumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}category/${escapeHtml(law.category)}/">${escapeHtml(catLabel)}</a><span class="sep">/</span>${escapeHtml(law.name)}</nav>
    <div class="entry-meta" style="margin-top:18px">
      ${meta.join('\n      ')}
    </div>
    <h1 class="law-title">${escapeHtml(law.name)}</h1>${aka}
    <blockquote class="entry-stmt">"${renderStatement(law)}"</blockquote>
  </div>
</section>
`;

  // ---- main blocks ------------------------------------------------------
  const blocks = [];
  const toc = [];
  const idify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  // `reveal` marks the whole block for scroll-reveal. Sections that contain their
  // own card grid (examples, variants) pass reveal=false and let the CARDS reveal
  // individually (staggered) instead, so nothing double-animates. Each block also
  // registers a table-of-contents entry (the left scroll-spy rail) via a side effect.
  const block = (label, inner, reveal = true) => {
    const id = 'sec-' + idify(label);
    toc.push({ label, id });
    return `      <div class="block" id="${id}"${reveal ? ' data-reveal' : ''}>
        <div class="lbl">${label}</div>
${inner}
      </div>`;
  };

  if (law.meaning) blocks.push(block('In plain English', `        <p class="lead">${escapeHtml(law.meaning)}</p>`));

  // ---- infographic card: reliability meter + lineage timeline. Both use only
  // real per-law data (the controlled reliability tier; the coined/popular years),
  // so nothing here is fabricated — a chart of facts we already hold. ----
  const RELIABILITY_TIERS = ['Empirical', 'Heuristic', 'Folk-adage', 'Contested'];
  const TIER_NOTE = {
    Empirical: 'grounded in studies or measurable evidence',
    Heuristic: 'a dependable rule of thumb, not a proven theorem',
    'Folk-adage': 'a proverb or saying, not a scientific finding',
    Contested: 'disputed — the evidence is debated',
  };
  const reliabilityMeter = () => {
    if (coined || !law.reliability) return '';
    const segs = RELIABILITY_TIERS.map((name) => {
      const on = name === law.reliability;
      return `<span class="mseg${on ? ' on ' + reliabilityClass(name) : ''}">${escapeHtml(name)}</span>`;
    }).join('');
    return `      <div class="viz-col">
        <div class="viz-h">Reliability</div>
        <div class="meter" role="img" aria-label="Reliability tier: ${escapeHtml(law.reliability)}">${segs}</div>
        <p class="viz-note">Rated <b>${escapeHtml(law.reliability)}</b> — ${escapeHtml(TIER_NOTE[law.reliability] || 'see the reliability scale')}.</p>
      </div>`;
  };
  const lineageTimeline = () => {
    const pts = [];
    if (law.coinedYear != null) pts.push({ y: Number(law.coinedYear), label: 'coined' });
    if (law.popularYear != null && Number(law.popularYear) !== Number(law.coinedYear)) pts.push({ y: Number(law.popularYear), label: 'popular' });
    if (!pts.length || pts.some((p) => Number.isNaN(p.y))) return '';
    let lo = Math.min(...pts.map((p) => p.y)), hi = Math.max(...pts.map((p) => p.y));
    if (lo === hi) { lo -= 6; hi += 6; }
    const W = 320, padX = 22, X = (yr) => (padX + (W - 2 * padX) * (yr - lo) / (hi - lo)).toFixed(1);
    const axis = `<line class="tl-axis" x1="${padX}" y1="42" x2="${W - padX}" y2="42"/>`;
    const marks = pts.map((p) => {
      const px = X(p.y);
      return `<g><line class="tl-axis" x1="${px}" y1="38" x2="${px}" y2="46"/><circle class="tl-dot" cx="${px}" cy="42" r="5"/><text class="tl-year" x="${px}" y="27" text-anchor="middle">${p.y}</text><text class="tl-role" x="${px}" y="60" text-anchor="middle">${escapeHtml(p.label.toUpperCase())}</text></g>`;
    }).join('');
    return `      <div class="viz-col">
        <div class="viz-h">Lineage</div>
        <svg class="timeline-svg" viewBox="0 0 ${W} 72" width="100%" role="img" aria-label="Timeline of the law's dates">${axis}${marks}</svg>
      </div>`;
  };
  const vizInner = reliabilityMeter() + lineageTimeline();
  if (vizInner) blocks.push(`      <div class="viz-card" data-reveal>\n${vizInner}\n      </div>`);

  if (law.mechanism) blocks.push(block('How it works', `        <p class="prose">${escapeHtml(law.mechanism)}</p>`));

  // Examples: prefer the richer `examples[]` ({tag,text} or plain string) and fall
  // back to the single legacy `example`. Multiple examples => "Where you'll see it".
  const exItems = (Array.isArray(law.examples) && law.examples.length)
    ? law.examples
    : (law.example ? [law.example] : []);
  if (exItems.length) {
    const cards = exItems.map((e) => {
      const text = typeof e === 'string' ? e : (e && e.text) || '';
      const tag = (e && typeof e === 'object' && e.tag) ? e.tag : 'In practice';
      return `          <div class="example" data-reveal><span class="ex-tag">${escapeHtml(tag)}</span> ${escapeHtml(text)}</div>`;
    }).join('\n');
    const grid = `        <div class="examples-grid">\n${cards}\n        </div>`;
    blocks.push(block(exItems.length > 1 ? "Where you'll see it" : 'An example', grid, false));
  }

  // Variants: named sub-forms / corollaries ({name, text}) — e.g. the four types of Goodhart.
  if (Array.isArray(law.variants) && law.variants.length) {
    const items = law.variants.map((v) =>
      `          <div class="variant" data-reveal><span class="vname">${escapeHtml(v.name)}</span><p class="vtext">${escapeHtml(v.text)}</p></div>`
    ).join('\n');
    blocks.push(block('Types & variants', `        <div class="variants">\n${items}\n        </div>`, false));
  }

  if (law.whyItMatters) blocks.push(block('Why it matters', `        <p class="prose">${escapeHtml(law.whyItMatters)}</p>`));

  // Working with it: a practical playbook. Items are {lead, text} (bold lead) or plain strings.
  if (Array.isArray(law.working) && law.working.length) {
    const items = law.working.map((w) => {
      if (w && typeof w === 'object') {
        const lead = w.lead ? `<b>${escapeHtml(w.lead)}.</b> ` : '';
        return `          <li>${lead}${escapeHtml(w.text || '')}</li>`;
      }
      return `          <li>${escapeHtml(w)}</li>`;
    }).join('\n');
    blocks.push(block('Working with it', `        <ul class="playbook">\n${items}\n        </ul>`));
  }

  if (law.limits) blocks.push(block('Where it breaks down', `        <p class="prose">${escapeHtml(law.limits)}</p>`));
  if (law.misreadings) blocks.push(block("What it doesn't say", `        <p class="prose">${escapeHtml(law.misreadings)}</p>`));
  if (law.origin) blocks.push(block('Origin', `        <p class="prose">${escapeHtml(law.origin)}</p>`));

  if (coined) {
    // Coined laws carry no external sources; credit the submitter instead.
    if (law.submittedBy) {
      blocks.push(block('Submitted by',
        `        <p class="prose">Coined for The Law Tome by ${escapeHtml(law.submittedBy)}.</p>`));
    }
  } else if (Array.isArray(law.sources) && law.sources.length) {
    const items = law.sources.map((s, i) => {
      const label = s.url
        ? `<a href="${escapeHtml(s.url)}">${escapeHtml(s.text)}</a>`
        : escapeHtml(s.text);
      const type = s.type ? `<span class="stype">${escapeHtml(s.type)}</span>` : '';
      return `          <li><span class="snum">${i + 1}</span><span class="stext">${label}</span>${type}</li>`;
    }).join('\n');
    blocks.push(block('Sources', `        <ol class="sources-list">\n${items}\n        </ol>`));
  }

  if (Array.isArray(law.confusedWith) && law.confusedWith.length) {
    const links = law.confusedWith.map((slug) => {
      const r = byslug[slug] || {};
      const name = escapeHtml(r.name || slug);
      return `          <a href="${permalink(slug)}"><i class="ti ti-arrow-right" aria-hidden="true"></i> ${name}</a>`;
    }).join('\n');
    blocks.push(block('Commonly confused with', `        <div class="confused">\n${links}\n        </div>`));
  }

  // Related laws split into kindred vs. opposing ("in tension"). A relation is
  // treated as opposition when its kind reads that way; the two get distinct UIs.
  if (Array.isArray(law.related) && law.related.length) {
    const isAgainst = (k) => /oppos|contra|tension|versus|counter|against|rival/i.test(k || '');
    const relCard = (rel, against) => {
      const r = byslug[rel.slug] || {};
      const name = escapeHtml(r.name || rel.slug);
      const say = r.statement ? `<div class="rc-say">"${escapeHtml(r.statement)}"</div>` : '';
      const rno = r.no != null ? `№ ${escapeHtml(r.no)}` : '';
      const kind = rel.kind ? `<span class="rc-kind">${escapeHtml(rel.kind)}</span>` : '<span></span>';
      return `          <a class="rel-card${against ? ' against' : ''}" href="${permalink(rel.slug)}">
            <div class="rc-top"><span class="rc-no">${rno}</span>${kind}</div>
            <span class="rc-name">${name}</span>${say}
          </a>`;
    };
    const kindred = law.related.filter((r) => !isAgainst(r.kind));
    const against = law.related.filter((r) => isAgainst(r.kind));
    if (kindred.length) {
      blocks.push(block('Related laws',
        `        <div class="rel-cards">\n${kindred.map((r) => relCard(r, false)).join('\n')}\n        </div>`, false));
    }
    if (against.length) {
      blocks.push(block('In tension with',
        `        <div class="rel-cards against">\n${against.map((r) => relCard(r, true)).join('\n')}\n        </div>`, false));
    }
  }

  // ---- dashboard stat strip (under the hero) ----------------------------
  const statTile = (k, v) => (v == null || v === '')
    ? ''
    : `      <div class="stat"><span class="s-k">${escapeHtml(k)}</span><span class="s-v">${escapeHtml(v)}</span></div>`;
  const relCount = Array.isArray(law.related) ? law.related.length : 0;
  const srcCount = Array.isArray(law.sources) ? law.sources.length : 0;
  const dashTiles = [
    statTile('Reliability', coined ? 'Coined' : law.reliability),
    statTile('Coined', law.coinedYear),
    statTile('Popular form', law.popularYear),
    statTile('Named after', law.namedAfter),
    statTile('Field', catLabel),
    relCount ? statTile('Related', String(relCount)) : '',
    srcCount ? statTile('Sources', String(srcCount)) : '',
  ].filter(Boolean).join('\n');
  const dash = dashTiles
    ? `<div class="wrap-wide"><div class="dash" data-reveal>\n${dashTiles}\n</div></div>\n`
    : '';

  // ---- left rail: table of contents (scroll-spy) ------------------------
  const tocNav = toc.length
    ? `    <nav class="toc" aria-label="On this page">
${toc.map((t) => `      <a href="#${t.id}">${escapeHtml(t.label)}</a>`).join('\n')}
    </nav>\n`
    : '';

  // ---- right rail: a live relationship mini-map + citation --------------
  const neighbours = (Array.isArray(law.related) ? law.related : [])
    .map((r) => byslug[r.slug]).filter(Boolean);
  const TIER = { Empirical: '#8fbf6f', Heuristic: '#d8a63f', 'Folk-adage': '#b7ab86', Contested: '#e05a44' };
  const tierColor = (r) => TIER[r] || '#c9bf9f';
  const miniGraph = () => {
    const W = 260, H = 190, cx = W / 2, cy = H / 2, R = 62;
    let edges = '', nodes = '';
    neighbours.forEach((n, i) => {
      const a = (-Math.PI / 2) + (2 * Math.PI * i / Math.max(1, neighbours.length));
      const x = +(cx + R * Math.cos(a)).toFixed(1), y = +(cy + R * Math.sin(a)).toFixed(1);
      edges += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#5a4f2f" stroke-width="1"/>`;
      nodes += `<a href="${permalink(n.slug)}"><circle cx="${x}" cy="${y}" r="6" fill="${tierColor(n.reliability)}" stroke="#141109" stroke-width="1.5"/><text x="${x}" y="${(y - 10).toFixed(1)}" text-anchor="middle" font-family="'Space Mono',monospace" font-size="8.5" fill="#cdc3a6">${escapeHtml(n.name)}</text></a>`;
    });
    const focus = `<circle cx="${cx}" cy="${cy}" r="8" fill="${tierColor(law.reliability)}" stroke="#141109" stroke-width="2"/><text x="${cx}" y="${cy + 20}" text-anchor="middle" font-family="'Space Mono',monospace" font-size="9" fill="#f1e7cf">${escapeHtml(law.name)}</text>`;
    return `<svg class="minigraph-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Relationship map for ${escapeHtml(law.name)}">${edges}${nodes}${focus}</svg>`;
  };
  const mapPanel = neighbours.length
    ? `      <div class="panel">
        <h4>Related map</h4>
        <div class="minigraph">${miniGraph()}</div>
        <a class="mg-link" href="${base}graph/?law=${escapeHtml(law.slug)}">Open in the graph <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
      </div>\n`
    : '';

  const citeText = `"${escapeHtml(law.name)}." The Law Tome. ${escapeHtml(origin + base)}laws/${escapeHtml(law.slug)}/`;

  const aside = `    <aside class="aside">
${mapPanel}      <div class="panel">
        <h4>Cite this entry</h4>
        <div class="cite-box" id="cite">${citeText}</div>
        <button class="btn" id="copy"><i class="ti ti-copy" aria-hidden="true"></i> <span id="copy-t">Copy citation</span></button>
        <button class="btn solid"><i class="ti ti-photo" aria-hidden="true"></i> Share as quote-card</button>
      </div>
    </aside>`;

  // ---- prev / next ------------------------------------------------------
  let prevnext = '';
  if (prev || next) {
    const sides = [];
    if (prev) sides.push(`    <a href="${permalink(prev.slug)}"><span class="lab">← Prev · № ${escapeHtml(prev.no)}</span><span class="t">${escapeHtml(prev.name)}</span></a>`);
    if (next) sides.push(`    <a class="n2" href="${permalink(next.slug)}"><span class="lab">Next · № ${escapeHtml(next.no)} →</span><span class="t">${escapeHtml(next.name)}</span></a>`);
    prevnext = `\n  <nav class="prevnext">\n${sides.join('\n')}\n  </nav>\n`;
  }

  const layout = `<div class="wrap-wide">
  <div class="entry-layout">
${tocNav}    <main>
${blocks.join('\n\n')}
    </main>

${aside}
  </div>
${prevnext}</div>
`;

  // ---- JSON-LD stack ----------------------------------------------------
  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: law.name,
    ...(Array.isArray(law.aliases) && law.aliases.length ? { alternateName: law.aliases } : {}),
    description: law.statement,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'The Law Tome' },
    ...(law.sameAs ? { sameAs: law.sameAs } : {}),
    ...(coined ? { additionalType: 'coined', disambiguatingDescription: 'Original law coined for The Law Tome — credited and clearly marked.' } : {}),
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: law.name,
    description,
    ...(law.namedAfter ? { author: { '@type': 'Person', name: law.namedAfter } } : {}),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
      { '@type': 'ListItem', position: 2, name: catLabel, item: `${origin}${base}category/${law.category}/` },
      { '@type': 'ListItem', position: 3, name: law.name, item: canonical },
    ],
  };

  const faqEntities = [
    { '@type': 'Question', name: `What is ${law.name}?`, acceptedAnswer: { '@type': 'Answer', text: description } },
  ];
  if (law.namedAfter && law.coinedYear != null) {
    faqEntities.push({
      '@type': 'Question',
      name: `Who coined ${law.name}?`,
      acceptedAnswer: { '@type': 'Answer', text: `${law.name} is named after ${law.namedAfter}, dated to ${law.coinedYear}.` },
    });
  }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqEntities };

  // ---- page scripts: copy-citation + reading-progress + scroll-reveal ----
  // Reveal is a pure enhancement: it only runs when <html> already carries `.anim`
  // (set in <head> only when JS is on AND motion is allowed). Otherwise every
  // [data-reveal] element is fully visible via CSS with no dependency on this code.
  const scripts = `<script>
document.getElementById('copy').onclick=function(){
  var t=document.getElementById('cite').textContent;
  var done=function(){var s=document.getElementById('copy-t');s.textContent='Copied';setTimeout(function(){s.textContent='Copy citation'},1600)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,done)}else{done()}
};
(function(){
  var bar=document.getElementById('progress');
  if(bar){var upd=function(){var h=document.documentElement,m=h.scrollHeight-h.clientHeight;bar.style.transform='scaleX('+(m>0?Math.min(1,h.scrollTop/m):0)+')';};addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();}
  if(document.documentElement.classList.contains('anim')&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px',threshold:0.06});
    var els=document.querySelectorAll('[data-reveal]');for(var i=0;i<els.length;i++)io.observe(els[i]);
  }
  // scroll-spy + rail progress, driven directly by scroll position (no observer
  // lag): on each frame, fill the rail track to the scroll fraction and mark the
  // last section whose top has passed the reading line as active.
  var toc=document.querySelector('.toc');
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  var secs=links.map(function(a){return {a:a,el:document.getElementById(a.getAttribute('href').slice(1))};}).filter(function(o){return o.el;});
  if(secs.length){
    var ticking=false;
    var apply=function(){
      ticking=false;
      var h=document.documentElement,y=window.scrollY||h.scrollTop,mx=h.scrollHeight-h.clientHeight;
      // active = section whose heading sits at/above the viewport middle; at the
      // very bottom, force the last section so short trailing sections still light.
      var atBottom=(y+h.clientHeight)>=(mx-2),cur;
      if(atBottom){cur=secs[secs.length-1];}
      else{var line=y+window.innerHeight*0.42;cur=secs[0];for(var i=0;i<secs.length;i++){if(secs[i].el.getBoundingClientRect().top+y<=line)cur=secs[i];}}
      for(var j=0;j<links.length;j++)links[j].classList.remove('on');
      if(cur){cur.a.classList.add('on');
        // run the rail fill down to the centre of the active item
        if(toc)toc.style.setProperty('--fill',(cur.a.offsetTop+cur.a.offsetHeight/2)+'px');
      }
    };
    var onScroll=function(){ if(!ticking){ticking=true;requestAnimationFrame(apply);} };
    addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);apply();
  }
})();
</script>`;

  return (
    head({
      title: `${law.name} — The Law Tome`,
      description,
      base,
      canonical,
      og: { title: law.name, description, image: `${base}og/${law.slug}.png`, type: 'article' },
      jsonld: [definedTerm, article, breadcrumb, faq],
    }) +
    sprite() +
    '<div class="progress" id="progress" aria-hidden="true"></div>\n' +
    header({ base, active: 'browse', count: ctx.publishedCount }) +
    entry +
    dash +
    layout +
    footer({ scripts })
  );
}
