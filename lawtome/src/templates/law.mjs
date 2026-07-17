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
  <div class="wrap">
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
      const type = s.type ? ` <span class="stype">${escapeHtml(s.type)}</span>` : '';
      return `          <li><span class="num">${i + 1}</span>${label}${type}</li>`;
    }).join('\n');
    blocks.push(block('Sources', `        <ol class="sources">\n${items}\n        </ol>`));
  }

  if (Array.isArray(law.confusedWith) && law.confusedWith.length) {
    const links = law.confusedWith.map((slug) => {
      const r = byslug[slug] || {};
      const name = escapeHtml(r.name || slug);
      return `          <a href="${permalink(slug)}"><i class="ti ti-arrow-right" aria-hidden="true"></i> ${name}</a>`;
    }).join('\n');
    blocks.push(block('Commonly confused with', `        <div class="confused">\n${links}\n        </div>`));
  }

  if (Array.isArray(law.related) && law.related.length) {
    const items = law.related.map((rel) => {
      const r = byslug[rel.slug] || {};
      const name = escapeHtml(r.name || rel.slug);
      const say = r.statement ? `<div class="rsay">${escapeHtml(r.statement)}</div>` : '';
      const rno = r.no != null ? `<span class="rno">№ ${escapeHtml(r.no)}</span>` : '<span class="rno"></span>';
      const kind = rel.kind ? `<span class="rrel">${escapeHtml(rel.kind)}</span>` : '';
      return `          <a class="rel-item" href="${permalink(rel.slug)}">
            ${rno}
            <span><span class="rname">${name}</span>${say}</span>
            ${kind}
          </a>`;
    }).join('\n');
    blocks.push(block('Related laws', `        <div class="rel-list">\n${items}\n        </div>`));
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
    ? `<div class="wrap"><div class="dash" data-reveal>\n${dashTiles}\n</div></div>\n`
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

  const layout = `<div class="wrap">
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
  // scroll-spy: highlight the left-rail contents link for the section in view
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
    var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on');});var a=map[e.target.id];if(a)a.classList.add('on');}});},{rootMargin:'-12% 0px -78% 0px',threshold:0});
    document.querySelectorAll('.block[id]').forEach(function(s){spy.observe(s);});
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
