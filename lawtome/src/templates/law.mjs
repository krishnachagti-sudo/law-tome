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

import { head, sprite, header, footer, escapeHtml, reliabilityClass, reliabilitySlug, asset, personImage, portrait, imageCredit, shareRow } from './partials.mjs';
import { schematicFigure, schematicForLaw } from './schematics.mjs';
import { eraId, centuryLabelForYear } from './timeline.mjs';
import { personId } from './eponyms.mjs';
import { formulaBlock, diffusionBlock, pronunciation, otherNames, otherNamesText } from './facts.mjs';
import { widgetBlock, widgetFor } from './widgets.mjs';

/**
 * Trim to at most `max` characters, ending on a sentence boundary where one is
 * available in the last third — so an answer stops at a full stop rather than
 * mid-clause. Returns the string untouched when it already fits.
 */
function clip(s, max) {
  const t = String(s).trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  return stop > max * 0.66 ? cut.slice(0, stop + 1) : `${cut.replace(/\s+\S*$/, '')}…`;
}

/**
 * Undo escapeHtml, for text that is going into JSON-LD rather than markup.
 *
 * Structured data is JSON, not HTML: an answer containing "&amp;" reaches the
 * consumer as the literal five characters, not an ampersand. Only the five
 * entities escapeHtml produces need reversing, and `&amp;` must come LAST or
 * "&amp;lt;" would decode twice into a stray "<".
 */
function decodeEntities(s) {
  return String(s)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

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

// ---- in-prose cross-links -------------------------------------------------
// When a law's own prose names ANOTHER entry in the corpus, that name should be
// a link — it is the most natural cross-reference the site can offer, and
// without it the reader hits a dead name mid-sentence. Only exact, unambiguous
// matches are linked: a full entry name of 10+ characters, at most once per
// section, and never a law already surfaced as a related/confused-with card
// (those have their own prominent link, so a second one would just be noise).
//
// The alternation is compiled once per corpus and cached — recompiling ~1,100
// alternatives on each of ~1,100 pages would dominate the build.
const NAME_RE_CACHE = new WeakMap();
function nameMatcher(byslug) {
  let cached = NAME_RE_CACHE.get(byslug);
  if (cached) return cached;
  const entries = Object.values(byslug || {})
    .filter((l) => l && l.name && l.slug && l.name.length >= 10)
    // longest first, so "Murphy's Law" is preferred over a shorter prefix entry
    .sort((a, b) => b.name.length - a.name.length);
  const bySafeName = new Map(entries.map((l) => [escapeHtml(l.name), l.slug]));
  const re = entries.length
    ? new RegExp(`(${entries.map((l) => escapeHtml(l.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
    : null;
  cached = { re, bySafeName };
  NAME_RE_CACHE.set(byslug, cached);
  return cached;
}

/**
 * Link the first mention of each other corpus law inside an ESCAPED prose string.
 * Input must already be escaped; only anchors are inserted, so no entity can be
 * broken and no corpus text is reinterpreted as markup.
 */
function linkLawNames(escaped, { byslug, base, skip }) {
  const { re, bySafeName } = nameMatcher(byslug);
  if (!re) return escaped;
  const used = new Set();
  re.lastIndex = 0;
  return escaped.replace(re, (m) => {
    const slug = bySafeName.get(m);
    if (!slug || skip.has(slug) || used.has(slug)) return m;
    used.add(slug);
    return `<a class="prose-law" href="${base}laws/${escapeHtml(slug)}/">${m}</a>`;
  });
}

/** A single "At a glance" row, only when the value is present. */
function glanceRow(k, v) {
  if (v == null || v === '') return '';
  return `          <div class="row"><span class="k">${escapeHtml(k)}</span><span class="v">${escapeHtml(v)}</span></div>\n`;
}

export function lawPage(law, ctx = {}) {
  const { byslug = {}, categories = {}, base = '/', origin = '', prev, next, buildDate, images, facts = {}, periodSlugs } = ctx;
  const coined = law.provenance === 'coined';
  const catLabel = categories[law.category] || law.category || '';
  const canonical = `${origin}${base}laws/${law.slug}/`;
  const permalink = (slug) => `${base}laws/${escapeHtml(slug)}/`;
  // The substantive one-paragraph answer — used verbatim as the DefinedTerm/Article
  // description, the OG description, and the "What is X?" FAQ answer. Kept distinct
  // from the marketing meta description below so answer engines get the real
  // definition, not a keyword-facet blurb.
  const answer = law.meaning || law.statement;
  // Social cards (Twitter/X especially) truncate past ~200 chars; clamp the OG
  // description at a word boundary so the preview doesn't cut mid-word. The full
  // `answer` still feeds the JSON-LD description and on-page FAQ.
  const ogDescription = answer && answer.length > 200
    ? answer.slice(0, 197).replace(/\s+\S*$/, '') + '…'
    : answer;
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
  // Every fact in this strip names a facet the site can browse, so every one of
  // them is a link: the tier to its reliability index, the field to its category
  // page, the year to its century on the timeline. Dead metadata otherwise.
  const heroEra = centuryLabelForYear(law.coinedYear);
  // Where "coined 1974" goes. A period page beats an anchor in a 1,100-row
  // timeline: it is the same set, already filtered, with its own shape. The
  // decade page when the corpus gave that decade one, the century otherwise,
  // and the timeline itself when the entry carries no date at all.
  const periodHref = (() => {
    const y = Number(law.coinedYear);
    if (!Number.isFinite(y) || y < 1) return `${base}timeline/`;
    const dec = `${Math.floor(y / 10) * 10}s`;
    if (periodSlugs && periodSlugs.has(dec)) return `${base}timeline/${dec}/`;
    const cent = heroEra ? heroEra.replace(/\s+/g, '-') : '';
    if (cent && periodSlugs && periodSlugs.has(cent)) return `${base}timeline/${cent}/`;
    return heroEra ? `${base}timeline/#${eraId(heroEra)}` : `${base}timeline/`;
  })();
  const metaBadge = coined
    ? `<a class="badge b-folk" href="${base}coined/">Coined</a>`
    : law.reliability
      ? `<a class="badge ${reliabilityClass(law.reliability)}" href="${base}reliability/${reliabilitySlug(law.reliability)}/">${escapeHtml(law.reliability)}</a>`
      : `<span class="badge ${reliabilityClass(law.reliability)}">${escapeHtml(law.reliability || '')}</span>`;

  const meta = [
    `<span>№ ${escapeHtml(law.no)}</span><span class="dot"></span>`,
    `${metaBadge}<span class="dot"></span>`,
    `<a class="cat" href="${base}category/${escapeHtml(law.category)}/">${escapeHtml(law.category)}</a>`,
  ];
  if (law.coinedYear != null) meta.push(`<span class="dot"></span>\n      <a href="${periodHref}">coined ${escapeHtml(law.coinedYear)}</a>`);

  const aka = Array.isArray(law.aliases) && law.aliases.length
    ? `\n    <div class="aka">also known as — ${law.aliases.map(escapeHtml).join(', ')}</div>`
    : '';

  const entry = `<section class="entry">
  <svg class="entry-mark" viewBox="0 0 100 100" aria-hidden="true"><use href="#seal"/></svg>
  <div class="wrap-wide">
    <nav class="crumb" aria-label="Breadcrumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}category/${escapeHtml(law.category)}/">${escapeHtml(catLabel)}</a><span class="sep">/</span>${escapeHtml(law.name)}</nav>
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
  // and answer engines, phrased as the literal question people search ("What does
  // X mean?", "How does X work?", "Where did X come from?") to target featured
  // snippets / People-Also-Ask / AI Overviews. heading defaults to the label when
  // omitted; navigational sections (Sources, Related) keep statement headings.
  // Every section whose heading is a real question also becomes one Q&A in the
  // page's FAQPage. The answer is the section's OWN rendered prose with the tags
  // taken off — not a summary written alongside it — so the visible page and the
  // structured data cannot drift apart. That is the same rule hubFaq follows,
  // and it is why a section with no prose to give (a formula figure, a
  // calculator, a list of links) contributes nothing: `answerText` comes back
  // too short and the entry is dropped rather than filled with alt text.
  const faq = [];
  const plain = (h) => decodeEntities(
    String(h)
      // A chart's text nodes are axis labels, not prose. Left in, the diffusion
      // curve answered "when did people start saying X?" with "1800coined
      // 19642019 How often…".
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      // A <br> or a block edge is a sentence boundary; without this the stripped
      // text runs two list items together into one unreadable word.
      .replace(/<(br|\/p|\/li|\/h[1-6]|\/div|\/blockquote|\/span)[^>]*>/gi, ' ')
      .replace(/<[^>]+>/g, ''),
  ).replace(/\s+/g, ' ').trim();

  // A figure's caption IS its prose — it is where the chart is put into words —
  // so for a block built around one, the caption is the answer and the rest of
  // the markup is scaffolding.
  const captionOf = (h) => {
    const m = /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i.exec(String(h));
    return m ? plain(m[1]) : '';
  };

  // `answer` overrides the stripped-HTML default for sections that render as
  // cards or lists rather than prose. Reading the first output showed why it is
  // needed: a variant card is a name span butted against a text paragraph, and
  // stripping the tags produced "RegressionalThe proxy correlates…". The override
  // is assembled from the SAME corpus fields the cards render, so it still cannot
  // say anything the page does not — it just punctuates them.
  const block = (label, inner, reveal = true, heading = '', answer = '') => {
    const id = 'sec-' + idify(label);
    toc.push({ label, id });
    const q = heading || label;
    if (/\?\s*$/.test(q)) {
      const a = answer ? plain(answer) : (captionOf(inner) || plain(inner));
      if (a.length >= 40) faq.push({ q, a });
    }
    const h2 = `        <h2 class="block-h">${escapeHtml(q)}</h2>\n`;
    return `      <div class="block" id="${id}"${reveal ? ' data-reveal' : ''}>
        <div class="lbl">${escapeHtml(label)}</div>
${h2}${inner}
      </div>`;
  };
  const L = law.name;
  // The same name, escaped, for the places it goes into HTML rather than into a
  // heading or a JSON string. `L` is raw: block() escapes the headings it builds
  // and JSON.stringify escapes the structured answers, but a template that drops
  // `L` straight into markup is an injection hole, and the escaping test caught
  // exactly that when the verdict block was added.
  const LH = escapeHtml(law.name);
  // The non-image dimensions, all optional: a law shows a formula, a diffusion
  // curve or a set of foreign names only where we actually have one.
  const fact = facts[law.slug] || null;
  const personFact = law.namedAfter ? ((facts._people || {})[personId(law.namedAfter).replace(/^ep-/, '')] || null) : null;

  // Laws already surfaced as their own card elsewhere on the page — don't
  // double-link them from inside the prose.
  const proseSkip = new Set([law.slug,
    ...(Array.isArray(law.related) ? law.related.map((r) => r && r.slug) : []),
    ...(Array.isArray(law.confusedWith) ? law.confusedWith : []),
  ].filter(Boolean));
  const prose = (text) => linkLawNames(escapeHtml(text), { byslug, base, skip: proseSkip });

  if (law.meaning) blocks.push(block('In plain English', `        <p class="lead">${prose(law.meaning)}</p>`, true, `What does ${L} mean?`));

  // The law written as itself, where one exists. Placed right after the plain
  // English so the two readings of the same claim sit together.
  {
    const fig = formulaBlock(fact, law, { base });
    if (fig) blocks.push(block('In symbols', fig, true, `What is the formula for ${L}?`));
    // …and, for the few laws with a single agreed closed form, a slider that
    // computes it. Placed right after the formula so the reader can see the
    // identity and then move it.
    const wg = widgetBlock(law.slug);
    if (wg) blocks.push(block('Run the numbers', wg, true, `${L} calculator`));
  }

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
        <p class="viz-note">Rated <b>${escapeHtml(law.reliability)}</b> — ${escapeHtml(TIER_NOTE[law.reliability] || 'see the reliability scale')}. <a href="${base}reliability/${reliabilitySlug(law.reliability)}/">See every ${escapeHtml(law.reliability)} law</a>, or <a href="${base}reliability/">the whole scale</a>.</p>
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

  if (law.mechanism) blocks.push(block('How it works', `        <p class="prose">${prose(law.mechanism)}</p>`, true, `How does ${L} work?`));
  // Illustration. A REAL figure — the diagram, plate or apparatus photograph from
  // the law's own Wikipedia article, verified and licensed (build/fetch-images.py)
  // — outranks the abstract schematic, which is a drawn shape standing in for a
  // picture we did not have. Only one of the two renders, so the article never
  // carries a photograph and a doodle of the same idea.
  const figureImg = (images && images.figures && images.figures[law.slug]) || null;
  if (figureImg) {
    blocks.push(`      <figure class="lawfig" data-reveal>
        <img src="${base}assets/img/figures/${escapeHtml(law.slug)}.webp" width="${figureImg.width || 640}" height="${figureImg.height || 400}" loading="lazy" decoding="async" alt="Figure illustrating ${escapeHtml(law.name)}">
        <figcaption>${escapeHtml(law.name)} — ${imageCredit(figureImg)}</figcaption>
      </figure>`);
  } else {
    // Concept schematic (illustrative figure): an explicit `schematic` field, or
    // the curated slug->shape fallback for laws with a canonical textbook picture.
    const key = schematicForLaw(law);
    if (key) { const fig = schematicFigure(key); if (fig) blocks.push(fig); }
  }

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
    const exAnswer = exItems.map((e) => {
      const text = typeof e === 'string' ? e : (e && e.text) || '';
      const tag = (e && typeof e === 'object' && e.tag) ? e.tag : '';
      return tag ? `${tag}: ${text}` : text;
    }).filter(Boolean).join(' ');
    blocks.push(block(exItems.length > 1 ? "Where you'll see it" : 'An example', grid, false, `What are examples of ${L}?`, exAnswer));
  }

  // Variants: named sub-forms / corollaries ({name, text}) — e.g. the four types of Goodhart.
  if (Array.isArray(law.variants) && law.variants.length) {
    // Each variant is a NAMED thing — "mutational meltdown", "regressional
    // Goodhart" — and until now none of the 1,877 of them was addressable. A
    // reader who wants to point a colleague at one sub-type had to say "scroll
    // to types and look for the third card". Every card now has a stable id and
    // a permalink, deduped because a couple of laws name two variants the same.
    const seenV = new Set();
    const items = law.variants.map((v) => {
      let vid = 'v-' + idify(v.name);
      if (seenV.has(vid)) { let n = 2; while (seenV.has(`${vid}-${n}`)) n++; vid = `${vid}-${n}`; }
      seenV.add(vid);
      return `          <div class="variant" id="${vid}" data-reveal><span class="vname">${escapeHtml(v.name)}</span><a class="vlink" href="#${vid}" aria-label="Link to ${escapeHtml(v.name)}">§</a><p class="vtext">${escapeHtml(v.text)}</p></div>`;
    }).join('\n');
    const varAnswer = law.variants.map((v) => `${v.name} — ${v.text}`).join(' ');
    blocks.push(block('Types & variants', `        <div class="variants">\n${items}\n        </div>`, false, `What are the types of ${L}?`, varAnswer));
  }

  // Callout cards give the later, prose-only sections visual weight (inline SVG
  // icons, since the icon font here is a tiny subset).
  const CALLOUT_ICON = {
    key: '<svg class="co-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3"/></svg>',
    warn: '<svg class="co-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M12 4l9 16H3z"/><path d="M12 10v4.5"/><circle cx="12" cy="17.4" r=".7" fill="currentColor" stroke="none"/></svg>',
    info: '<svg class="co-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.2"/><path d="M12 11.5v4.5"/><circle cx="12" cy="8" r=".7" fill="currentColor" stroke="none"/></svg>',
  };
  const callout = (tone, text) => `        <div class="callout callout--${tone}">${CALLOUT_ICON[tone]}<p>${escapeHtml(text)}</p></div>`;

  if (law.whyItMatters) blocks.push(block('Why it matters', callout('key', law.whyItMatters), true, `Why does ${L} matter?`));

  // Working with it: a practical playbook. Items are {lead, text} (bold lead) or plain strings.
  if (Array.isArray(law.working) && law.working.length) {
    const items = law.working.map((w) => {
      if (w && typeof w === 'object') {
        // An em dash, not a full stop. The corpus writes `lead` as a short
        // imperative LABEL and `text` as the clause that continues it — 2,797 of
        // the 2,807 items start lowercase — so a full stop produced "Track the
        // three components. reason about intracranial problems…" on every
        // playbook on the site. Reading one FAQ answer out loud is what caught it.
        const lead = w.lead ? `<b>${escapeHtml(w.lead)}</b> — ` : '';
        return `          <li>${lead}${escapeHtml(w.text || '')}</li>`;
      }
      return `          <li>${escapeHtml(w)}</li>`;
    }).join('\n');
    const workAnswer = law.working.map((w) => (w && typeof w === 'object')
      ? [w.lead ? `${w.lead} —` : '', w.text || ''].filter(Boolean).join(' ')
      : String(w)).filter(Boolean).join(' ');
    blocks.push(block('Working with it', `        <ul class="playbook">\n${items}\n        </ul>`, true, `How do you apply ${L}?`, workAnswer));
  }

  if (law.limits) blocks.push(block('Where it breaks down', callout('warn', law.limits), true, `What are the limits of ${L}?`));
  if (law.misreadings) blocks.push(block("What it doesn't say", callout('info', law.misreadings), true, `What are common misconceptions about ${L}?`));

  // "Is the Dunning–Kruger effect real?" is how people actually search for the
  // thing this whole index is organised around, and the page answered it only
  // obliquely — a coloured badge near the title and a limits section two
  // screens down. This states it in a sentence.
  //
  // Assembled from the controlled reliability tier plus the entry's OWN limits
  // and misreadings text; nothing is authored per law, so no entry can end up
  // with a verdict its evidence does not support. The wording is deliberately
  // careful: a tier is a claim about what kind of support an idea has, not a
  // promise that it holds in your case.
  if (!coined && law.reliability) {
    const VERDICT = {
      Empirical: `<b>Yes, as far as the evidence goes.</b> ${LH} is rated <b>Empirical</b> here, meaning it rests on studies or measurements rather than on a saying. That is a claim about the support behind it, not a guarantee that it holds in every setting.`,
      Heuristic: `<b>Real as a rule of thumb, not as a theorem.</b> ${LH} is rated <b>Heuristic</b> here: it is dependable enough to plan with and has no proof behind it. Treat it as a prior, not a law of nature.`,
      'Folk-adage': `<b>It is a saying, not a finding.</b> ${LH} is rated <b>Folk-adage</b> here — it circulates because it is memorable and often true, not because anyone measured it. Quoting it as science is the usual mistake.`,
      Contested: `<b>That is exactly what is in dispute.</b> ${LH} is rated <b>Contested</b> here: the effect is claimed, the evidence is argued over, and reasonable specialists disagree. Anyone telling you it is settled — in either direction — is ahead of the evidence.`,
    };
    const v = VERDICT[law.reliability];
    if (v) {
      const caveat = law.limits
        ? ` <span class="verdict-more">Where it stops working is set out under <a href="#sec-where-it-breaks-down">Where it breaks down</a>.</span>`
        : '';
      const inner = `        <p class="verdict">${v}${caveat}</p>
        <p class="verdict-scale">Rated on <a href="${base}reliability/">this index's four-tier scale</a>, which separates measured findings from rules of thumb, folklore and disputed claims. <a href="${base}reliability/${reliabilitySlug(law.reliability)}/">Every ${escapeHtml(law.reliability)} entry</a>.</p>`;
      // The structured answer gets the verdict plus the entry's own caveat, so a
      // machine quoting it quotes the qualification too.
      const answer = `${v.replace(/<[^>]+>/g, '')}${law.limits ? ' ' + String(law.limits).split(/(?<=[.!?])\s/)[0] : ''}`;
      blocks.push(block('Is it real?', inner, true, `Is ${L} real?`, answer));
    }
  }

  // "What is the opposite of X?" — the corpus already records which entries pull
  // against which, but only as a card in the relations grid labelled "in
  // tension", which is not the phrase anyone types.
  {
    const against = (Array.isArray(law.related) ? law.related : [])
      .filter((r) => r && r.slug && byslug[r.slug] && /oppos|contra|tension|versus|counter|against|rival/i.test(r.kind || ''))
      .map((r) => ({ law: byslug[r.slug], note: r.note || '' }));
    if (against.length) {
      const items = against.map((a) => `          <li><a href="${base}laws/${escapeHtml(a.law.slug)}/">${escapeHtml(a.law.name)}</a>${a.note ? ` — ${prose(a.note)}` : ''}</li>`).join('\n');
      const inner = `        <p class="prose">Nothing here is the formal negation of ${escapeHtml(law.name)} — these are the ${against.length === 1 ? 'entry' : 'entries'} in this index that ${against.length === 1 ? 'pulls' : 'pull'} the other way, so that following both at once forces a choice.</p>
        <ul class="opp-list">
${items}
        </ul>
        <p class="prose"><a href="${base}tension/">Every opposing pair in the index</a>.</p>`;
      const answer = `The ${against.length === 1 ? 'entry' : 'entries'} that pull against ${law.name}: ${against.map((a) => a.law.name).join(', ')}. None is a formal negation — they are principles that push the other way, so following both at once forces a choice.`;
      blocks.push(block('What pulls against it', inner, true, `What is the opposite of ${L}?`, answer));
    }
  }
  if (law.origin) blocks.push(block('Origin', `        <p class="prose">${prose(law.origin)}</p>`, true, `Where did ${L} come from?`));

  // When the NAME caught on, and what the idea is called elsewhere. Both belong
  // beside Origin: they are the afterlife of the name rather than the idea.
  {
    const dif = diffusionBlock(fact, law, { base });
    if (dif) blocks.push(block('How the name spread', dif, true, `When did people start saying “${L}”?`));
    const others = otherNames(fact, { base });
    if (others) blocks.push(block('Known elsewhere as', others, true, `What is ${L} called in other languages?`, otherNamesText(fact)));
  }

  if (coined) {
    // Coined laws carry no external sources; credit the submitter instead.
    if (law.submittedBy) {
      blocks.push(block('Submitted by',
        `        <p class="prose">Coined for The Law Tome by ${escapeHtml(law.submittedBy)}. See the <a href="${base}coined/">other coined laws</a>, or <a href="${base}coin/">coin one of your own</a>.</p>`, true, `Who coined ${L}`));
    }
  } else if (Array.isArray(law.sources) && law.sources.length) {
    const items = law.sources.map((s, i) => {
      // Only hyperlink http(s) URLs. escapeHtml blocks attribute breakout, but a
      // `javascript:`/`data:` scheme would still execute on click — so a non-http
      // URL renders as plain text, never a live href. (The build also rejects
      // such URLs via validateCorpus, so this is defence-in-depth.)
      const safeUrl = s.url && /^https?:\/\//i.test(String(s.url).trim());
      const label = safeUrl
        ? `<a href="${escapeHtml(s.url)}">${escapeHtml(s.text)}</a>`
        : escapeHtml(s.text);
      const type = s.type ? `<span class="stype">${escapeHtml(s.type)}</span>` : '';
      return `          <li><span class="snum">${i + 1}</span><span class="stext">${label}</span>${type}</li>`;
    }).join('\n');
    // Per-entry trust cue: restate the anti-fabrication promise and the open
    // corrections path (an E-E-A-T signal that mirrors the publishingPrinciples /
    // correctionsPolicy JSON-LD, both pointing at the About page's method).
    const srcTrust = `        <p class="src-trust">Every claim on this page is traced to the sources above — nothing here is invented, and reliability is <a href="${base}about/">marked honestly</a>. Spot an error or a better source? <a href="${base}coin/">Suggest a fix.</a></p>`;
    blocks.push(block('Sources', `        <ol class="sources-list">\n${items}\n        </ol>\n${srcTrust}`, true, `Sources & further reading`));
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
  // Each tile that names a browsable facet becomes a link into that facet's index
  // (reliability tier, century, eponym index, field). These are the corpus's most
  // natural internal links: without them the facet hubs are reachable only from the
  // footer, while the 1,100+ law pages that *have* the facet link nowhere.
  const statTile = (k, v, href) => {
    if (v == null || v === '') return '';
    const inner = `<span class="s-k">${escapeHtml(k)}</span><span class="s-v">${escapeHtml(v)}</span>`;
    return href
      ? `      <a class="stat stat--link" href="${href}">${inner}</a>`
      : `      <div class="stat">${inner}</div>`;
  };
  const relCount = Array.isArray(law.related) ? law.related.length : 0;
  const srcCount = Array.isArray(law.sources) ? law.sources.length : 0;
  const era = centuryLabelForYear(law.coinedYear);
  const dashTiles = [
    statTile('Reliability', coined ? 'Coined' : law.reliability,
      coined ? `${base}coined/` : (law.reliability ? `${base}reliability/${reliabilitySlug(law.reliability)}/` : '')),
    statTile('Coined', law.coinedYear, periodHref),
    statTile('Popular form', law.popularYear),
    statTile('Named after', law.namedAfter, `${base}named-after/#${escapeHtml(personId(law.namedAfter))}`),
    statTile('Field', catLabel, law.category ? `${base}category/${escapeHtml(law.category)}/` : ''),
    relCount ? statTile('Related', String(relCount), '#sec-related-laws') : '',
    srcCount ? statTile('Sources', String(srcCount), '#sec-sources') : '',
  ].filter(Boolean).join('\n');
  const dash = dashTiles
    ? `<div class="wrap-wide"><div class="dash" data-reveal>\n${dashTiles}\n</div></div>\n`
    : '';

  // (Still no visible FAQ block, and it should stay that way. It used to render a
  // <details> accordion whose every answer was a whole corpus field — meaning /
  // whyItMatters / mechanism / origin / limits / misreadings — i.e. a verbatim
  // restatement of the sections already above it, which read as padding. The
  // article itself, with its contents rail, answers those questions in place.
  //
  // The FAQPage JSON-LD went with it, on the grounds that markup without visible
  // content is spam. That reasoning held for an accordion invented to justify the
  // markup; it does not hold for what is emitted now, which is built FROM the
  // rendered sections and can only ever say what the page already says.
  //
  // Be clear about what it does and does not buy: Google restricted FAQ rich
  // results to government and health sites in 2023, so this earns no rich result
  // here and is not expected to. It is emitted for consistency — every other page
  // type on the site declares its questions — and because the entries are a
  // faithful machine-readable index of a 1,200-word article's actual sections.)

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
        <h3>Related map</h3>
        <div class="minigraph">${miniGraph()}</div>
${mapLegend}
        <a class="mg-link" href="${base}graph/?law=${escapeHtml(law.slug)}">Open in the full graph <i class="ti ti-arrow-right" aria-hidden="true"></i></a>
      </div>\n`
    : '';

  const citeText = `"${escapeHtml(law.name)}." The Law Tome. ${escapeHtml(origin + base)}laws/${escapeHtml(law.slug)}/`;

  // Save button — carries the law's card fields as data-* so saved.js can store
  // and re-render it with no network. reliability is blank for coined entries.
  // Who the law is named for, with their face. The portrait is a real, licensed
  // photograph or engraving from Wikimedia Commons — see build/fetch-images.py for
  // how it is verified as the right person — and it carries the author/licence
  // credit inline, because for the CC-licensed files that credit is the condition
  // of use, not a nicety. A namesake we could not verify simply gets no panel.
  const namesakeImg = law.namedAfter ? personImage(images, law.namedAfter) : null;
  const namesakePanel = namesakeImg
    ? `      <div class="panel panel--face">
        <h3>Named after</h3>
        <a class="face" href="${base}named-after/#${escapeHtml(personId(law.namedAfter))}">
          ${portrait(namesakeImg, { base, alt: `${law.namedAfter}, who ${law.name} is named after` })}
          <span class="face-name">${escapeHtml(law.namedAfter)}</span>
        </a>
${pronunciation(personFact, law.namedAfter, { base, namesakeKind: law.namesakeKind })}
        ${imageCredit(namesakeImg)}
      </div>\n`
    : '';

  const saveBtn = `      <div class="panel panel--save">
        <button class="btn" id="save" type="button" aria-pressed="false" data-slug="${escapeHtml(law.slug)}" data-name="${escapeHtml(law.name)}" data-statement="${escapeHtml(law.statement || '')}" data-cat="${escapeHtml(law.category || '')}" data-rel="${escapeHtml(coined ? '' : (law.reliability || ''))}" data-no="${escapeHtml(law.no || '')}"><svg class="ti-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 7v14l-6-4-6 4V7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4z"/></svg> <span id="save-t">Save</span></button>
        <a class="save-link" href="${base}saved/">View saved</a>
      </div>
`;

  // Cross-links to the "X vs Y" pages for this law's near-twin / tension pairs,
  // so the compare surface is reachable from every relevant law page (the
  // internal linking that lets those pages earn their long-tail queries). The
  // pair slug is ordered by `no` to match the generated compare page exactly.
  const cmpKind = (k = '') => /tension|oppos|contra|against|versus|counter|rival|near-twin|twin|confus/i.test(k);
  const cmpSeen = new Set();
  const compareLinks = (Array.isArray(law.related) ? law.related : [])
    .filter((r) => r && cmpKind(r.kind) && r.slug !== law.slug && byslug[r.slug])
    .map((r) => byslug[r.slug])
    .filter((o) => { if (cmpSeen.has(o.slug)) return false; cmpSeen.add(o.slug); return true; });
  const cmpSlug = (o) =>
    String(law.no ?? '').localeCompare(String(o.no ?? ''), 'en', { numeric: true }) <= 0
      ? `${law.slug}-vs-${o.slug}` : `${o.slug}-vs-${law.slug}`;
  const comparePanel = compareLinks.length
    ? `      <div class="panel panel--compare">
        <h3>Compare</h3>
        <ul class="cmp-side">
${compareLinks.map((o) => `          <li><a href="${base}compare/${cmpSlug(o)}/"><span class="cmp-side-vs">vs</span> ${escapeHtml(o.name)}</a></li>`).join('\n')}
        </ul>
      </div>\n`
    : '';

  // Passing an entry on is a different act from citing it, and it wants
  // different text: a citation is for a bibliography, a share is for a person
  // who has not read the page yet, so the blurb is the statement in the form it
  // is usually quoted rather than the site's name and URL.
  const sharePanel = `      <div class="panel panel--share">
        <h3>Pass it on</h3>
${shareRow({
    url: canonical,
    title: law.name,
    text: law.statement || answer,
    label: `Share ${law.name}`,
  })}      </div>\n`;

  const aside = `    <aside class="aside">
${saveBtn}${namesakePanel}${mapPanel}${comparePanel}${sharePanel}      <div class="panel">
        <h3>Cite this entry</h3>
        <div class="cite-box" id="cite">${citeText}</div>
        <button class="btn" id="copy" type="button"><i class="ti ti-copy" aria-hidden="true"></i> <span id="copy-t">Copy citation</span></button>
        <a class="btn solid" href="${base}og/${escapeHtml(law.slug)}.png" target="_blank" rel="noopener"><i class="ti ti-photo" aria-hidden="true"></i> Open quote-card</a>
      </div>
    </aside>`;

  // ---- prev / next ------------------------------------------------------
  let prevnext = '';
  if (prev || next) {
    const sides = [];
    if (prev) sides.push(`    <a href="${permalink(prev.slug)}"><span class="lab">← Prev · № ${escapeHtml(prev.no)}</span><span class="t">${escapeHtml(prev.name)}</span></a>`);
    if (next) sides.push(`    <a class="n2" href="${permalink(next.slug)}"><span class="lab">Next · № ${escapeHtml(next.no)} →</span><span class="t">${escapeHtml(next.name)}</span></a>`);
    prevnext = `\n  <nav class="prevnext" aria-label="Previous and next law">\n${sides.join('\n')}\n  </nav>\n`;
  }

  const layout = `<div class="wrap-wide">
  <div class="entry-layout">
${tocNav}    <div class="lawmain">
${blocks.join('\n\n')}
    </div>

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
    // E-E-A-T signals: the editorial method and how to report an error both live
    // on the About page, which states the anti-fabrication sourcing standard.
    publishingPrinciples: `${origin}${base}about/`,
    correctionsPolicy: `${origin}${base}about/`,
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
    image: `${origin}${base}og/${law.slug}.png`,
    keywords,
    about: { '@type': 'Thing', name: law.name, ...(law.sameAs ? { sameAs: law.sameAs } : {}) },
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
    mainEntityOfPage: canonical,
    author: publisher,
    publisher,
    publishingPrinciples: `${origin}${base}about/`,
    isAccessibleForFree: true,
    // The corpus has no per-entry authoring date; the site is a living document
    // rebuilt each deploy, so publish and modified both carry the build date.
    ...(buildDate ? { datePublished: buildDate, dateModified: buildDate } : {}),
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

  // One Q&A per question-headed section, each answer lifted from that section's
  // own rendered prose (see `block`). Long answers are trimmed at a sentence
  // boundary rather than mid-word: a 600-word mechanism is a section, not an
  // answer, and a consumer quoting it whole would be quoting the whole page.
  const faqPage = faq.length
    ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: clip(a, 700) },
      })),
    }
    : null;

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
    var ticking=false,lock=null,lockT=0;
    var mark=function(a){
      for(var j=0;j<links.length;j++)links[j].classList.remove('on');
      if(!a)return;
      a.classList.add('on');
      // run the rail fill down to the centre of the active item
      if(toc)toc.style.setProperty('--fill',(a.offsetTop+a.offsetHeight/2)+'px');
    };
    // Active section = the one filling most of the screen, not the one whose
    // heading last crossed a line.
    //
    // The reading-line approach was wrong in a way no amount of tuning fixes.
    // A line can only switch when the NEXT heading reaches it, so a section
    // occupying three quarters of the viewport still reads as the previous one
    // until its title climbs to the top — which is exactly the desync you see
    // when a long section follows a short one. Measuring area asks the question
    // the reader is actually asking, "what am I looking at", and it needs no
    // special case for the end of the page: the last section wins on area once
    // it fills the screen, however little scroll is left.
    //
    // Each section claims the space from its own top to the NEXT section's top,
    // so the figures and infographic cards that sit between blocks count toward
    // the section they follow instead of belonging to nobody.
    var HEADER=92;
    var apply=function(){
      ticking=false;
      if(lock){ if(Date.now()<lockT){mark(lock);return;} lock=null; }
      // The section that owns the READING LINE — a third of the way down the
      // content area. Two earlier rules both failed the same way, by running
      // ahead of the reader: line-crossing at the very top of the viewport, and
      // largest-visible-area, which hands the win to the next section as soon
      // as it claims half the screen. Measured against where the eye actually
      // is, both named section 6 while section 5 filled the view.
      //
      // Switching only when the NEXT heading passes the line is not a lag; it
      // is the definition of which section you are reading.
      var vh=window.innerHeight;
      var line=HEADER+0.30*(vh-HEADER);
      var best=null;
      for(var i=0;i<secs.length;i++){
        if(secs[i].el.getBoundingClientRect().top<=line) best=secs[i];
      }
      if(!best) best=secs[0];
      // At the foot of the page the last sections can be too short to ever
      // reach the line, so nothing past the penultimate one would light up.
      if(window.innerHeight+window.scrollY>=document.body.scrollHeight-4) best=secs[secs.length-1];
      mark(best?best.a:null);
    };
    var onScroll=function(){ if(!ticking){ticking=true;requestAnimationFrame(apply);} };
    // an explicit TOC click wins over the spy while the smooth scroll is in flight —
    // otherwise the animation's intermediate positions repaint the highlight onto a
    // neighbouring section and it settles on the wrong one. Any real input releases it.
    for(var k=0;k<links.length;k++)links[k].addEventListener('click',function(){
      lock=this;lockT=Date.now()+1400;mark(this);
    });
    var release=function(){ if(lock){lock=null;onScroll();} };
    addEventListener('wheel',release,{passive:true});
    addEventListener('touchstart',release,{passive:true});
    addEventListener('keydown',release);
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
      og: { title: `${law.name}: ${facetList}`, description: ogDescription, image: `${base}og/${law.slug}.png`, type: 'article' },
      alternates: [{ type: 'text/markdown', title: `${law.name} (Markdown)`, href: `${canonical}index.md` }],
      jsonld: [definedTerm, article, breadcrumb, ...(faqPage ? [faqPage] : [])],
    }) +
    sprite() +
    '<div class="progress" id="progress" aria-hidden="true"></div>\n' +
    header({ base, active: 'browse', count: ctx.publishedCount }) +
    entry +
    dash +
    layout +
    footer({ base, scripts: `${scripts}\n<script defer src="${asset(base, 'assets/saved.js')}"></script>`
      // widget.js only where there IS a widget: nine laws should not cost the
      // other 1,096 an extra request.
      + (widgetFor(law.slug) ? `\n<script defer src="${asset(base, 'assets/widget.js')}"></script>` : '') })
  );
}
