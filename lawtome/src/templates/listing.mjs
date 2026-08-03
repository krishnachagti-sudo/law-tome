// Listing template — the browse page and each per-category page.
//
// Ported from the approved prototype index.html #index section (`.chips`, `.grid`,
// and the inline render()'s `.card` markup), reusing the Task 5 chrome partials
// (head/sprite/header/footer/jsonLd/escapeHtml). Composition:
//   head({...}) + sprite() + header({...}) + <section chips + grid> + footer()
//
// The prototype's client-side chip filtering + live search is Task 10 (search.js).
// Here we render the static #chips buttons and the full #grid of cards; the JS
// that hides/shows on click is NOT included in this template.
//
// EVERY corpus string interpolated into markup (name, statement, category, no) and
// every slug used in an href goes through escapeHtml — the Task 5/6/7 gates all
// failed on missed escaping.

import { head, sprite, header, footer, escapeHtml, lawCard, RELIABILITY_NOTE, reliabilitySlug, browseControls, searchBox, asset, figureStrip, fitTitle } from './partials.mjs';
import { hubNav, hubFaq, fieldShape, setTensions, setAdjacent } from './hub.mjs';

/**
 * A browse or per-category listing page — one full HTML document.
 * @param {object[]} laws laws to list (all laws for browse; category members for a category page)
 * @param {object} o
 * @param {string} o.title    drives <title> / <h1> (required)
 * @param {string} [o.base='/'] site base path — MUST end with '/'
 * @param {string} [o.kind='browse'] 'browse' => DefinedTermSet JSON-LD; 'category' => BreadcrumbList
 * @param {string} [o.active] nav key to mark active (defaults to 'browse')
 * @param {string} [o.origin=''] absolute-URL origin for JSON-LD (optional; degrades to base-relative)
 */
export function listingPage(laws = [], { title, base = '/', kind = 'browse', active = 'browse', origin = '', categoryKey = '', reliabilityKey = '', count, categories = {}, images, byslug = {}, compareSlugs = {}, periodCrosses = [] } = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  // A reliability-tier page (kind='reliability') is a faceted-browse view: the
  // server renders only that tier's laws and stamps the grid so the client keeps
  // the facet instead of repainting with the whole corpus (the category bug).
  const isReliability = kind === 'reliability';

  // Chips: "all" + the distinct categories present, in first-seen order. On a
  // category page the chip for `categoryKey` is the active one (not "all"), so the
  // client (search.js) initialises its filter to this category instead of clobbering
  // the server-filtered grid with every law.
  const cats = ['all'];
  for (const l of rows) if (l.category != null && !cats.includes(l.category)) cats.push(l.category);
  const chips = cats
    .map((c, i) => {
      const on = categoryKey ? c === categoryKey : i === 0;
      return `<button class="chip${on ? ' on' : ''}" type="button" aria-pressed="${on ? 'true' : 'false'}" data-c="${escapeHtml(c)}">${escapeHtml(c)}</button>`;
    })
    .join('');

  // data-cat / data-reliability let search.js honour the facet on first paint,
  // so the client filter narrows WITHIN the server-rendered subset (it never
  // repaints the grid with the full corpus).
  const gridAttr = (categoryKey ? ` data-cat="${escapeHtml(categoryKey)}"` : '')
    + (reliabilityKey ? ` data-reliability="${escapeHtml(reliabilityKey)}"` : '');

  const grid = rows.length
    ? rows.map((l) => lawCard(l, base, 2)).join('\n')
    : '<div class="empty">No laws to show yet.</div>';

  // On-page H1: category and reliability pages use their own title (already a
  // keyword); the browse index gets a descriptive, keyword-bearing H1 instead of
  // the bare nav word.
  const h1 = (kind === 'category' || isReliability) ? title : 'Named laws, principles & effects';
  // Reliability pages carry a one-line gloss of what the tier means (shared with
  // the law page's reliability meter), so the facet is self-explaining.
  const lede = isReliability && RELIABILITY_NOTE[reliabilityKey]
    ? `    <p class="sec-lede">Every entry rated <b>${escapeHtml(reliabilityKey)}</b> — ${escapeHtml(RELIABILITY_NOTE[reliabilityKey])}. Filter by field with the chips, or see the <a href="${base}reliability/">whole reliability scale</a>.</p>\n`
    : '';
  // Faceted controls (reliability filter + sort + group-by-tier), shared with the
  // homepage teaser via browseControls(). With JS off the server-rendered grid is
  // still the full, readable list.
  // …with a search field above them. The index search.js loads covers the whole
  // corpus, so the prompt must not promise a search scoped to this page.
  const controls = searchBox('Search all 1,100 entries…') + browseControls({ isReliability });

  // Visible breadcrumb on the deeper listing views (category, reliability tier),
  // matching the law/compare pages and reflecting the BreadcrumbList JSON-LD so a
  // reader always has an "up" path back to Browse.
  const crumb = (kind === 'category' || isReliability)
    ? `    <nav class="crumb" aria-label="Breadcrumb"><a href="${base}">Home</a><span class="sep">/</span><a href="${base}browse/">Browse</a>${isReliability ? `<span class="sep">/</span><a href="${base}reliability/">Reliability</a>` : ''}<span class="sep">/</span>${escapeHtml(title)}</nav>\n`
    : '';

  // "Browse by field" — the category taxonomy as REAL links. The chips above are
  // client-side filter buttons, so without this the 20 category pages had no
  // anchor pointing at them from the index that owns them: they were reachable
  // only by first landing on a law that happens to be in that field (and not at
  // all with JS off). Only rendered on the browse index, where it's the hub.
  let fieldHub = '';
  if (kind === 'browse') {
    const counts = new Map();
    for (const l of rows) {
      if (l.category == null) continue;
      counts.set(l.category, (counts.get(l.category) || 0) + 1);
    }
    // Controlled-vocabulary order, filtered to fields the corpus actually uses.
    const order = Object.keys(categories).filter((k) => counts.has(k));
    for (const k of counts.keys()) if (!order.includes(k)) order.push(k);
    if (order.length) {
      const items = order.map((k) =>
        `        <a class="field-link" href="${base}category/${escapeHtml(k)}/"><span class="field-name">${escapeHtml(categories[k] || k)}</span><span class="field-n">${counts.get(k)}</span></a>`).join('\n');
      fieldHub = `    <section class="field-hub">
      <h2 class="field-hub-h">Browse by field</h2>
      <div class="field-grid">
${items}
      </div>
    </section>
`;
    }
  }

  // A band of this set's own imagery above the controls. Only on the focused
  // views: /browse/ is every law, so a strip there would say nothing about what
  // you are looking at, whereas on a field or a tier it is a portrait of that
  // set. Client-side filtering never touches it, so it stays a stable header
  // rather than flickering as chips are pressed.
  const strip = (kind === 'category' || isReliability) ? figureStrip(images, rows, { base }) : '';

  // The browse index is the site's front door for crawlers and its only page
  // with no "up" — it got a bare H1 and nothing else. Give it the same direct
  // answer the other hubs carry, and the same footer of other ways in, so the
  // A–Z is a starting point rather than the only route.
  const browseAnswer = kind === 'browse' && rows.length
    ? `    <p class="hub-answer">The Law Tome indexes ${rows.length.toLocaleString('en-US')} named laws, principles, effects, razors and paradoxes across ${new Set(rows.map((l) => l.category).filter(Boolean)).size} fields. Every entry is defined in plain language, traced to a source, and rated for how well established it is. Filter the list below by field or reliability, or use one of the other ways in at the foot of the page.</p>\n`
    : '';
  const browseMore = kind === 'browse' ? hubNav('browse/', { base }) : '';

  // A field page was the last page type still built the way everything was
  // built at the start: a crumb, an H1 and a grid. It said nothing about the
  // field as a field, so its length was purely a function of how many laws the
  // field happens to hold — linguistics, with six, came to 210 words. All of
  // what follows is read off the members; none of it is authored per field.
  const isField = kind === 'category' && rows.length > 0;
  const shape = isField ? fieldShape(rows, { base, categories, byslug, field: categoryKey }) : null;
  let fieldAnswer = '';
  let fieldMore = '';
  let fieldFaq = { html: '', jsonld: null };
  if (isField) {
    // "6 empirical by how well established each one is" is only a sentence when
    // the field actually splits across tiers; a unanimous field should say so.
    const tierPhrase = !shape.tiers.length
      ? ''
      : shape.tiers.length === 1
        ? `every one of them rated <a href="${base}reliability/${String(shape.tiers[0][0]).toLowerCase()}/">${escapeHtml(shape.tiers[0][0])}</a>`
        : `${shape.tiers.map(([k, n]) => `${n} rated <a href="${base}reliability/${String(k).toLowerCase()}/">${escapeHtml(k)}</a>`).join(', ')}`;
    const oldest = rows
      .filter((l) => Number.isFinite(Number(l.coinedYear)) && Number(l.coinedYear) >= 1)
      .sort((a, b) => Number(a.coinedYear) - Number(b.coinedYear))[0];
    const newest = rows
      .filter((l) => Number.isFinite(Number(l.coinedYear)) && Number(l.coinedYear) >= 1)
      .sort((a, b) => Number(b.coinedYear) - Number(a.coinedYear))[0];
    const lawLink = (l) => `<a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a>`;

    fieldAnswer = `    <p class="hub-answer">The Law Tome lists ${rows.length} named ${rows.length === 1 ? 'law' : 'laws'}, principles and effects under <b>${escapeHtml(title)}</b>${shape.span ? `, named between ${shape.span[0]} and ${shape.span[1]}` : ''}${tierPhrase ? ` — ${tierPhrase}` : ''}. Every entry is defined in plain language, traced to a source, and linked to the laws it echoes and contradicts.</p>\n`;

    fieldFaq = hubFaq([
      {
        q: `What are the named laws of ${title.toLowerCase()}?`,
        a: `${rows.length} of them are indexed here: ${rows.map(lawLink).join(', ')}.`,
      },
      ...(shape.tiers.length ? [{
        q: 'How well established are they?',
        a: `${shape.tiers.map(([k, n]) => `${n} rated <a href="${base}reliability/${String(k).toLowerCase()}/">${escapeHtml(k)}</a>`).join(', ')}. The rating is on every card and at the top of every entry, so a measured finding in this field is never dressed as a rule of thumb.`,
      }] : []),
      ...(oldest && newest && oldest.slug !== newest.slug ? [{
        q: `Which is the oldest, and which the newest?`,
        a: `The earliest dated entry here is ${lawLink(oldest)} (${oldest.coinedYear}); the most recent is ${lawLink(newest)} (${newest.coinedYear}). Walk the whole corpus by date on <a href="${base}timeline/">the timeline</a>.`,
      }] : []),
      ...(shape.neighbours.length ? [{
        q: `What other fields does ${title.toLowerCase()} border?`,
        a: `Counting the relations these laws actually draw: ${shape.neighbours.map(([k, n]) => `<a href="${base}category/${escapeHtml(k)}/">${escapeHtml(categories[k] || k)}</a> (${n} ${n === 1 ? 'link' : 'links'})`).join(', ')}.`,
      }] : []),
    ], { heading: `Questions about ${title.toLowerCase()}` });

    fieldMore = setTensions(rows, { base, compareSlugs, noun: 'field' })
      + setAdjacent(rows, { base, byslug, noun: 'field' })
      + shape.html
      + fieldFaq.html
      + hubNav(`category/${categoryKey}/`, { base });
  }

  const section = `<section class="sec" id="index">
  <div class="wrap">
${crumb}    <div class="sec-head">
      <h1>${escapeHtml(h1)}</h1>
      <span class="sub" id="showing" aria-live="polite">showing ${rows.length} of ${rows.length}</span>
    </div>
${browseAnswer}${fieldAnswer}${lede}${shape ? `    <div class="hub-stats">${shape.stats.map(([v, l]) => `<span class="hub-stat"><b>${escapeHtml(String(v))}</b> ${escapeHtml(l)}</span>`).join('')}</div>\n` : ''}${strip}    <div class="chips" id="chips">${chips}</div>
${periodCrosses.length ? `    <nav class="fp-band" aria-label="By period">
      <h2 class="fp-band-h">This field, period by period</h2>
      <div class="fp-band-row">
${periodCrosses.map((c) => `        <a class="cy-chip" href="${base}category/${escapeHtml(c.field)}/${escapeHtml(c.period.slug)}/"><span>${escapeHtml(c.period.label)}</span><b>${c.laws.length}</b></a>`).join('\n')}
      </div>
    </nav>
` : ''}${controls}    <div class="grid" id="grid"${gridAttr}>
${grid}
    </div>
${fieldHub}${fieldMore}${browseMore}  </div>
</section>
`;

  // JSON-LD: DefinedTermSet for browse, BreadcrumbList for a category or
  // reliability-tier page (both are sub-views under Browse).
  const jsonld = (kind === 'category' || isReliability)
    ? [{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
          { '@type': 'ListItem', position: 2, name: 'Browse', item: `${origin}${base}browse/` },
          ...(isReliability ? [{ '@type': 'ListItem', position: 3, name: 'Reliability', item: `${origin}${base}reliability/` }] : []),
          { '@type': 'ListItem', position: isReliability ? 4 : 3, name: title },
        ],
      },
      // A field page IS a collection of its members; declaring the ItemList
      // lets an answer engine lift "the named laws of X" without scraping cards.
      ...(kind === 'category' && rows.length ? [{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        url: `${origin}${base}category/${categoryKey}/`,
        isPartOf: { '@type': 'WebSite', name: 'The Law Tome', url: `${origin}${base}` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: rows.length,
          itemListElement: rows.slice(0, 100).map((l, i) => ({
            '@type': 'ListItem', position: i + 1, name: l.name, url: `${origin}${base}laws/${l.slug}/`,
          })),
        },
      }] : []),
      ...(fieldFaq.jsonld ? [fieldFaq.jsonld] : [])]
    : [{
        '@context': 'https://schema.org',
        '@type': 'DefinedTermSet',
        name: 'The Law Tome',
        url: `${origin}${base}browse/`,
        ...(rows.length ? { hasDefinedTerm: { '@type': 'ItemList', numberOfItems: rows.length } } : {}),
      }, {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${base}` },
          { '@type': 'ListItem', position: 2, name: 'Browse' },
        ],
      }];

  const description = isReliability
    ? `${title} — named laws, principles, and effects rated ${reliabilityKey} (${RELIABILITY_NOTE[reliabilityKey] || 'see the reliability scale'}), each explained, cross-linked, and sourced in The Law Tome.`
    : kind === 'category'
      ? `${title} — named laws, principles, and effects, each explained with examples, origin, and sources in The Law Tome.`
      : 'Browse every named law, principle, and effect — each with its meaning, examples, origin, and sources. The complete index of The Law Tome.';

  // SEO title: keyword-led and distinct from the on-page <h1> (which stays the
  // short section label). Category pages target "<Field> laws & principles".
  // Several field labels are themselves long ("Logic, fallacies & argument"),
  // so the trimmings are tried longest-first and dropped whole rather than let
  // the field name get cut — the field name is the query.
  const seoTitle = isReliability
    ? fitTitle(title, [
      ` — Named Laws Rated ${reliabilityKey} | The Law Tome`,
      ` — Named Laws Rated ${reliabilityKey}`,
      ' — Named Laws | The Law Tome',
      '',
    ])
    : kind === 'category'
      ? fitTitle(title, [
        ' Laws & Principles — Meaning & Examples | The Law Tome',
        ' Laws & Principles — Meaning & Examples',
        ' Laws & Principles | The Law Tome',
        ' — Named Laws & Principles',
        ' — Named Laws',
        '',
      ])
      : 'All Named Laws, Principles & Effects | The Law Tome';

  const path = isReliability
    ? `reliability/${reliabilitySlug(reliabilityKey)}/`
    : kind === 'category' ? `category/${categoryKey}/` : 'browse/';
  return (
    head({ title: seoTitle, description, base, origin, path, jsonld }) +
    sprite() +
    header({ base, active, count: count ?? rows.length }) +
    section +
    footer({ base, scripts: `<script defer src="${asset(base, 'assets/search.js')}"></script>` })
  );
}
