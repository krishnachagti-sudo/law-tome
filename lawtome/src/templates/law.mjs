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
import { schematicFigure } from './schematics.mjs';

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
  const { byslug = {}, categories = {}, base = '/', origin = '', prev, next, buildDate } = ctx;
  const coined = law.provenance === 'coined';
  const catLabel = categories[law.category] || law.category || '';
  const canonical = `${origin}${base}laws/${law.slug}/`;
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;
  // The substantive one-paragraph answer — used verbatim as the DefinedTerm/Article
  // description, the OG description, and the "What is X?" FAQ answer. Kept distinct
  // from the marketing meta description below so answer engines get the real
  // definition, not a keyword-facet blurb.
  const answer = law.meaning || law.statement;
  const firstExample = Array.isArray(law.examples) && law.examples[0]
    ? (law.examples[0].text || '')
    : (law.example || '');

  // ---- SEO title + meta description --------------------------------------
  // Ranking pages for named laws title as "<Law>: Definition, Examples & Facts".
  // Mirror that: front-load the law name (the primary keyword), then only the
  // content facets this entry actually has — never claim examples/origin we lack.
  const facets = ['Meaning'];
  if (firstExample) facets.push('Examples');
  if (law.origin) facets.push('Origin');
  const facetList = facets.length > 1
    ? facets.slice(0, -1).join(', ') + ' & ' + facets[facets.length - 1]
    : facets[0];
  const pageTitle = `${law.name}: ${facetList} | The Law Tome`;
  // Meta description leads with the one-line statement (the featured-snippet
  // payload), then the facets and a trust signal. Falls back to the answer.
  const metaDescription = law.statement
    ? `${law.name}: “${law.statement}” — what it means${firstExample ? ', real examples' : ''}${law.origin ? ', and where it came from' : ''}. Clearly explained, cross-linked, and sourced.`
    : answer;

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
  // Each section carries two headings: a short editorial `label` kept as a mono
  // eyebrow (and as the scroll-rail / anchor id), and a keyword-bearing `heading`
  // rendered as the real <h2> — so the page has a proper H1→H2 hierarchy for SEO
  // and answer engines, phrased the way people search ("Examples of X", "How X
  // works", "The origin of X"). heading defaults to the label when omitted.
  const block = (label, inner, reveal = true, heading = '') => {
    const id = 'sec-' + idify(label);
    toc.push({ label, id });
    const h2 = `        <h2 class="block-h">${escapeHtml(heading || label)}</h2>\n`;
    return `      <div class="block" id="${id}"${reveal ? ' data-reveal' : ''}>
        <div class="lbl">${escapeHtml(label)}</div>
${h2}${inner}
      </div>`;
  };
  const L = law.name;

  if (law.meaning) blocks.push(block('In plain English', `        <p class="lead">${escapeHtml(law.meaning)}</p>`, true, `What ${L} means`));

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

  if (law.mechanism) blocks.push(block('How it works', `        <p class="prose">${escapeHtml(law.mechanism)}</p>`, true, `How ${L} works`));
  // Concept schematic (illustrative figure), when the law names one.
  if (law.schematic) { const fig = schematicFigure(law.schematic); if (fig) blocks.push(fig); }

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
    blocks.push(block(exItems.length > 1 ? "Where you'll see it" : 'An example', grid, false, `Examples of ${L}`));
  }

  // Variants: named sub-forms / corollaries ({name, text}) — e.g. the four types of Goodhart.
  if (Array.isArray(law.variants) && law.variants.length) {
    const items = law.variants.map((v) =>
      `          <div class="variant" data-reveal><span class="vname">${escapeHtml(v.name)}</span><p class="vtext">${escapeHtml(v.text)}</p></div>`
    ).join('\n');
    blocks.push(block('Types & variants', `        <div class="variants">\n${items}\n        </div>`, false, `Types and variants of ${L}`));
  }

  // Callout cards give the later, prose-only sections visual weight (inline SVG
  // icons, since the icon font here is a tiny subset).
  const CALLOUT_ICON = {
    key: '<svg class="co-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3"/></svg>',
    warn: '<svg class="co-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M12 4l9 16H3z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.4" r=".7" fill="currentColor" stroke="none"/></svg>',
    info: '<svg class="co-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.2"/><path d="M12 11.5v4.5"/><circle cx="12" cy="8" r=".7" fill="currentColor" stroke="none"/></svg>',
  };
  const callout = (tone, text) => `        <div class="callout callout--${tone}">${CALLOUT_ICON[tone]}<p>${escapeHtml(text)}</p></div>`;

  if (law.whyItMatters) blocks.push(block('Why it matters', callout('key', law.whyItMatters), true, `Why ${L} matters`));

  // Working with it: a practical playbook. Items are {lead, text} (bold lead) or plain strings.
  if (Array.isArray(law.working) && law.working.length) {
    const items = law.working.map((w) => {
      if (w && typeof w === 'object') {
        const lead = w.lead ? `<b>${escapeHtml(w.lead)}.</b> ` : '';
        return `          <li>${lead}${escapeHtml(w.text || '')}</li>`;
      }
      return `          <li>${escapeHtml(w)}</li>`;
    }).join('\n');
    blocks.push(block('Working with it', `        <ul class="playbook">\n${items}\n        </ul>`, true, `How to apply ${L}`));
  }

  if (law.limits) blocks.push(block('Where it breaks down', callout('warn', law.limits), true, `The limits of ${L}`));
  if (law.misreadings) blocks.push(block("What it doesn't say", callout('info', law.misreadings), true, `Common misconceptions about ${L}`));
  if (law.origin) blocks.push(block('Origin', `        <p class="prose">${escapeHtml(law.origin)}</p>`, true, `The origin of ${L}`));

  if (coined) {
    // Coined laws carry no external sources; credit the submitter instead.
    if (law.submittedBy) {
      blocks.push(block('Submitted by',
        `        <p class="prose">Coined for The Law Tome by ${escapeHtml(law.submittedBy)}.</p>`, true, `Who coined ${L}`));
    }
  } else if (Array.isArray(law.sources) && law.sources.length) {
    const items = law.sources.map((s, i) => {
      const label = s.url
        ? `<a href="${escapeHtml(s.url)}">${escapeHtml(s.text)}</a>`
        : escapeHtml(s.text);
      const type = s.type ? `<span class="stype">${escapeHtml(s.type)}</span>` : '';
      return `          <li><span class="snum">${i + 1}</span><span class="stext">${label}</span>${type}</li>`;
    }).join('\n');
    blocks.push(block('Sources', `        <ol class="sources-list">\n${items}\n        </ol>`, true, `Sources & further reading`));
  }

  if (Array.isArray(law.confusedWith) && law.confusedWith.length) {
    const links = law.confusedWith.map((slug) => {
      const r = byslug[slug] || {};
      const name = escapeHtml(r.name || slug);
      return `          <a href="${permalink(slug)}"><i class="ti ti-arrow-right" aria-hidden="true"></i> ${name}</a>`;
    }).join('\n');
    blocks.push(block('Commonly confused with', `        <div class="confused">\n${links}\n        </div>`, true, `Laws commonly confused with ${L}`));
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
        `        <div class="rel-cards">\n${kindred.map((r) => relCard(r, false)).join('\n')}\n        </div>`, false, `Laws related to ${L}`));
    }
    if (against.length) {
      blocks.push(block('In tension with',
        `        <div class="rel-cards against">\n${against.map((r) => relCard(r, true)).join('\n')}\n        </div>`, false, `Laws in tension with ${L}`));
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

  // FAQ — rendered as a VISIBLE accordion (pushed into <main> as the last block)
  // AND emitted as FAQPage JSON-LD from the SAME array, so the structured data
  // always matches on-page content (no invisible-markup / spammy-structured-data
  // risk). Each answer is a whole, self-contained corpus field — no fabrication,
  // no stitched sentences — and a question appears only when its field exists.
  const qa = (name, text) => (text ? { '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } } : null);
  const faqEntities = [
    qa(`What is ${L}?`, answer),
    law.meaning && law.meaning !== answer ? qa(`What does ${L} mean?`, law.meaning) : null,
    // "What is an example of X?" is one of the most common People-Also-Ask / voice
    // queries for a named law — answer it with a real corpus example.
    qa(`What is an example of ${L}?`, firstExample),
    qa(`Why does ${L} matter?`, law.whyItMatters),
    qa(`How does ${L} work?`, law.mechanism),
    (law.namedAfter || law.origin)
      ? qa(`Who coined ${L}?`, law.origin
          || `${L} is named after ${law.namedAfter}${law.coinedYear != null ? `, dated to ${law.coinedYear}` : ''}.`)
      : null,
    qa(`What is commonly misunderstood about ${L}?`, law.misreadings),
    qa(`What are the limits of ${L}?`, law.limits),
  ].filter(Boolean);
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqEntities };
  if (faqEntities.length) {
    const faqInner = `        <div class="faq">\n` +
      faqEntities.map((q, i) =>
        `          <details class="faq-item"${i === 0 ? ' open' : ''}><summary class="faq-q">${escapeHtml(q.name)}</summary><div class="faq-a"><p>${escapeHtml(q.acceptedAnswer.text)}</p></div></details>`,
      ).join('\n') +
      `\n        </div>`;
    // Last block in the reading flow; block() also registers a TOC entry + <h2>.
    blocks.push(block('FAQ', faqInner, true, `Frequently asked questions about ${L}`));
  }

  // ---- left rail: table of contents (scroll-spy) ------------------------
  const tocNav = toc.length
    ? `    <nav class="toc" aria-label="On this page">
${toc.map((t) => `      <a href="#${t.id}">${escapeHtml(t.label)}</a>`).join('\n')}
    </nav>\n`
    : '';

  // ---- right rail: a live relationship mini-map + citation --------------
  // Keep the relationship KIND alongside each resolved neighbour so the map can
  // draw tension edges differently from kindred ones. `isTension` matches the same
  // vocabulary the Related/Tension split below uses.
  const isTension = (kind = '') => /tension|against|contra|oppos/i.test(kind);
  const neighbours = (Array.isArray(law.related) ? law.related : [])
    .map((r) => ({ law: byslug[r.slug], kind: r.kind || '', tension: isTension(r.kind) }))
    .filter((n) => n.law);
  // Node fill by reliability tier — theme-tuned but kept as literal SVG fills
  // (an <svg> fill can't read a CSS custom property without extra plumbing); the
  // surrounding chrome (ring, edges, labels) IS theme-aware via CSS classes.
  const TIER = { Empirical: '#6a9a52', Heuristic: '#c08a2e', 'Folk-adage': '#9c8f6a', Contested: '#c14a38' };
  const tierColor = (r) => TIER[r] || '#9c8f6a';
  const miniGraph = () => {
    const W = 300, H = 232, cx = W / 2, cy = H / 2 - 4;
    const n = neighbours.length;
    // radius adapts a touch so two neighbours don't sit on top of the caption
    const R = n <= 2 ? 66 : 74;
    const rings = `<circle class="mg-ring" cx="${cx}" cy="${cy}" r="${R}"/><circle class="mg-ring mg-ring--in" cx="${cx}" cy="${cy}" r="${(R / 2).toFixed(1)}"/>`;
    let edges = '', nodes = '';
    neighbours.forEach((nb, i) => {
      // start at the top and spread evenly; nudge a single neighbour to upper-right
      const a = (-Math.PI / 2) + (2 * Math.PI * i / Math.max(1, n)) + (n === 1 ? 0.5 : 0);
      const x = +(cx + R * Math.cos(a)).toFixed(1), y = +(cy + R * Math.sin(a)).toFixed(1);
      const right = x >= cx;
      const anchor = Math.abs(x - cx) < 14 ? 'middle' : (right ? 'start' : 'end');
      const lx = +(x + (anchor === 'middle' ? 0 : right ? 11 : -11)).toFixed(1);
      const above = y < cy;
      // Stack the two labels OUTWARD from the dot so they never collide: for a node
      // above the centre the order top→bottom is kind, name, dot; below it's dot,
      // name, kind. The name always sits closest to its dot.
      const nameY = +(y + (above ? -13 : 17)).toFixed(1);
      const kindY = +(y + (above ? -25 : 29)).toFixed(1);
      edges += `<line class="mg-edge${nb.tension ? ' mg-edge--tension' : ''}" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;
      const kindLab = nb.kind ? `<text class="mg-kind" x="${lx}" y="${kindY}" text-anchor="${anchor}">${escapeHtml(nb.kind)}</text>` : '';
      nodes += `<a href="${permalink(nb.law.slug)}" class="mg-node"><circle class="mg-hit" cx="${x}" cy="${y}" r="14" fill="transparent"/><circle class="mg-dot" cx="${x}" cy="${y}" r="6.5" fill="${tierColor(nb.law.reliability)}"/><text class="mg-label" x="${lx}" y="${nameY}" text-anchor="${anchor}">${escapeHtml(nb.law.name)}</text>${kindLab}</a>`;
    });
    const focus = `<circle class="mg-focus-halo" cx="${cx}" cy="${cy}" r="13"/><circle class="mg-focus" cx="${cx}" cy="${cy}" r="8.5" fill="${tierColor(law.reliability)}"/><text class="mg-focus-label" x="${cx}" y="${cy + 26}" text-anchor="middle">${escapeHtml(law.name)}</text>`;
    return `<svg class="minigraph-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Relationship map for ${escapeHtml(law.name)}: ${n} connected ${n === 1 ? 'law' : 'laws'}">${rings}${edges}${nodes}${focus}</svg>`;
  };
  const nCount = neighbours.length;
  const nTension = neighbours.filter((n) => n.tension).length;
  const mapLegend = `        <div class="mg-legend"><span class="mg-lg"><i class="mg-sw mg-sw--kin"></i>${nCount - nTension} kindred</span>${nTension ? `<span class="mg-lg"><i class="mg-sw mg-sw--ten"></i>${nTension} in tension</span>` : ''}</div>`;
  const mapPanel = neighbours.length
    ? `      <div class="panel panel--map">
        <h4>Related map</h4>
        <div class="minigraph">${miniGraph()}</div>
${mapLegend}
        <a class="mg-link" href="${base}graph/?law=${escapeHtml(law.slug)}">Open in the full graph <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
      </div>\n`
    : '';

  const citeText = `"${escapeHtml(law.name)}." The Law Tome. ${escapeHtml(origin + base)}laws/${escapeHtml(law.slug)}/`;

  // Save button — carries the law's card fields as data-* so saved.js can store
  // and re-render it with no network. reliability is blank for coined entries.
  const saveBtn = `      <div class="panel panel--save">
        <button class="btn" id="save" type="button" aria-pressed="false" data-slug="${escapeHtml(law.slug)}" data-name="${escapeHtml(law.name)}" data-statement="${escapeHtml(law.statement || '')}" data-cat="${escapeHtml(law.category || '')}" data-rel="${escapeHtml(coined ? '' : (law.reliability || ''))}" data-no="${escapeHtml(law.no || '')}"><i class="ti ti-bookmark" aria-hidden="true"></i> <span id="save-t">Save</span></button>
        <a class="save-link" href="${base}saved/">View saved</a>
      </div>
`;

  const aside = `    <aside class="aside">
${saveBtn}${mapPanel}      <div class="panel">
        <h4>Cite this entry</h4>
        <div class="cite-box" id="cite">${citeText}</div>
        <button class="btn" id="copy"><i class="ti ti-copy" aria-hidden="true"></i> <span id="copy-t">Copy citation</span></button>
        <a class="btn solid" href="${base}og/${escapeHtml(law.slug)}.png" target="_blank" rel="noopener"><i class="ti ti-photo" aria-hidden="true"></i> Open quote-card</a>
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
  const publisher = {
    '@type': 'Organization',
    name: 'The Law Tome',
    url: `${origin}${base}`,
    logo: { '@type': 'ImageObject', url: `${origin}${base}assets/logo.svg`, width: 512, height: 512 },
    // Published as an initiative by Conyso.
    parentOrganization: { '@type': 'Organization', name: 'Conyso', url: 'https://conyso.com' },
  };
  // Search keywords: the name, its real aliases, the field, and the generic terms
  // people pair with a named law. All honest synonyms — nothing invented.
  const keywords = [law.name, ...(Array.isArray(law.aliases) ? law.aliases : []), catLabel, 'law', 'principle', 'effect', 'meaning', 'definition', 'examples']
    .filter(Boolean).join(', ');

  const definedTerm = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: law.name,
    ...(Array.isArray(law.aliases) && law.aliases.length ? { alternateName: law.aliases } : {}),
    description: answer,
    ...(law.no ? { termCode: law.no } : {}),
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'The Law Tome', url: `${origin}${base}browse/` },
    ...(law.sameAs ? { sameAs: law.sameAs } : {}),
    ...(coined ? { additionalType: 'coined', disambiguatingDescription: 'Original law coined for The Law Tome — credited and clearly marked.' } : {}),
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: law.name,
    ...(Array.isArray(law.aliases) && law.aliases.length ? { alternativeHeadline: law.aliases[0] } : {}),
    name: law.name,
    description: answer,
    keywords,
    about: { '@type': 'Thing', name: law.name, ...(law.sameAs ? { sameAs: law.sameAs } : {}) },
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
    mainEntityOfPage: canonical,
    author: publisher,
    publisher,
    ...(buildDate ? { dateModified: buildDate } : {}),
    // Voice/assistant answer target: read the title and the plain-English definition.
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.law-title', '.lead'] },
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

  // (FAQ + FAQPage JSON-LD are built earlier, near the dash block, so the visible
  // accordion and the structured data come from one array.)

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
      // active = the last section whose heading has crossed a reading line. The line
      // sits ~32% down for most of the page (responsive) but DESCENDS toward the
      // bottom as you approach the end (prog^2 ramp), so it sweeps through the short
      // trailing sections crammed in the final viewport — every section, however
      // short, gets its moment as active instead of being skipped.
      var vh=window.innerHeight,prog=mx>0?Math.min(1,y/mx):1;
      var line=y+vh*(0.32+prog*prog*0.62),cur=secs[0];
      for(var i=0;i<secs.length;i++){if(secs[i].el.getBoundingClientRect().top+y<=line)cur=secs[i];}
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
      title: pageTitle,
      description: metaDescription,
      base,
      origin,
      path: `laws/${law.slug}/`,
      canonical,
      modified: buildDate,
      og: { title: `${law.name}: ${facetList}`, description: answer, image: `${base}og/${law.slug}.png`, type: 'article' },
      jsonld: [definedTerm, article, breadcrumb, faq],
    }) +
    sprite() +
    '<div class="progress" id="progress" aria-hidden="true"></div>\n' +
    header({ base, active: 'browse', count: ctx.publishedCount }) +
    entry +
    dash +
    layout +
    footer({ base, scripts: `${scripts}\n<script defer src="${base}assets/saved.js"></script>` })
  );
}
