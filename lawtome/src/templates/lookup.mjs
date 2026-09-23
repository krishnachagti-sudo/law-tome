// Two lookup surfaces for readers who do not have the name.
//
// /also-known-as/ — the 1,400-odd other names these ideas travel under. The
//   index knows that the Baader–Meinhof Phenomenon is the frequency illusion
//   and that Sturgeon's Law is Sturgeon's Revelation, but that knowledge was
//   buried one entry at a time on 751 separate pages. A reference book puts its
//   cross-references in one alphabet at the back; so does this.
//
// /quotes/ — the statements, verbatim, in one place. The commonest way a person
//   arrives at a named law is with the phrasing and not the name: "the thing
//   about a measure becoming a target". Search handles it, but a search box is
//   not a page, and the phrasings themselves — the part that gets quoted,
//   printed and misattributed — had no address of their own.
//
// Neither page states anything new. One is the alias field re-sorted; the other
// is the statement field re-sorted. That is the whole of it, and it is the
// reason both can exist at all: an index of what we already hold is not
// content-farming, it is what an index is for.

import { head, sprite, header, footer, escapeHtml, listFilter } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

// Sort key: leading articles are noise in an alphabet, and accents should not
// exile Gödel to the end of the list.
const sortKey = (s) => String(s || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/^(the|a|an)\s+/i, '')
  .toLowerCase();

const initial = (s) => {
  const c = sortKey(s).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
};

const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

/** Jump bar; letters with no rows render inert rather than as dead links. */
function jumpBar(present, prefix) {
  return `    <nav class="az-nav" aria-label="Jump to letter">
${LETTERS.map((L) => {
    const id = L === '#' ? 'sym' : L;
    return present.has(L)
      ? `      <a href="#${prefix}-${id}">${L}</a>`
      : `      <span aria-hidden="true">${L}</span>`;
  }).join('\n')}
    </nav>
`;
}

/* ------------------------------------------------------------ also known as */

/**
 * Every alias in the corpus, alphabetised, each pointing at its entry.
 * @param {object[]} laws
 */
export function akaPage(laws = [], { base = '/', origin = '', count, categories = {} } = {}) {
  // A cross-reference that points at itself is noise: several entries record an
  // alias differing from the headword only in case, in an article, or in
  // punctuation ("The abc conjecture" beside "The abc Conjecture"). Those are
  // spelling variants the search already folds away, not other names.
  const key = (x) => String(x).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/^(the|a|an)\s+/, '').replace(/[^a-z0-9]+/g, '');
  const same = (a, b) => key(a) === key(b);

  const rows = [];
  for (const l of (Array.isArray(laws) ? laws : [])) {
    const seen = [];
    for (const a of (Array.isArray(l.aliases) ? l.aliases : [])) {
      if (!a || same(a, l.name) || seen.some((x) => same(a, x))) continue;
      seen.push(a);
      rows.push({ alias: a, law: l });
    }
  }
  rows.sort((x, y) => sortKey(x.alias).localeCompare(sortKey(y.alias), 'en')
    || sortKey(x.law.name).localeCompare(sortKey(y.law.name), 'en'));

  const withAliases = new Set(rows.map((r) => r.law.slug)).size;
  const present = new Set(rows.map((r) => initial(r.alias)));

  // Grouped by letter so the in-page filter can hide a whole letter once every
  // row under it is filtered out — a bare heading over nothing reads as a bug.
  const groups = [];
  let current = null;
  for (const r of rows) {
    const L = initial(r.alias);
    if (!current || current.L !== L) { current = { L, rows: [] }; groups.push(current); }
    current.rows.push(r);
  }

  const html = groups.map((g) => `      <section class="aka-grp" data-filter-group>
        <h3 class="aka-letter" id="aka-${g.L === '#' ? 'sym' : g.L}">${g.L}</h3>
${g.rows.map((r) => `        <div class="aka-row" data-filter-row data-filter-text="${escapeHtml(`${r.alias} ${r.law.name}`)}">
          <span class="aka-a">${escapeHtml(r.alias)}</span>
          <span class="aka-s">see</span>
          <a class="aka-l" href="${base}laws/${escapeHtml(r.law.slug)}/">${escapeHtml(r.law.name)}</a>
        </div>`).join('\n')}
      </section>`).join('\n');

  const answer = `${num(rows.length)} other names, covering ${num(withAliases)} of the index's ${num(laws.length)} entries — every alias, second name, older name and regional name the corpus records, alphabetised and pointing at the entry it belongs to.`;

  const lede = 'Half the difficulty of looking up a named idea is that it has more than one name, and the one you were given is rarely the one the reference uses. The frequency illusion is the Baader–Meinhof phenomenon. Bikeshedding is Parkinson\'s Law of Triviality. Sturgeon\'s Revelation is Sturgeon\'s Law. This is the cross-reference list: type the name you have, follow it to the entry.';

  const faq = hubFaq([
    { q: 'Where do these names come from?', a: `From the entries themselves. Each is a name the idea is genuinely published or circulated under — recorded on the entry alongside its sources, not generated here. Nothing on this page is a coinage; if a name is listed, some source calls it that.` },
    { q: 'Why is one idea under several names?', a: `Because that is what happened to it. An idea named in one field gets renamed when it crosses into another, a joke name outlives the formal one, and a translation sticks. The index keeps every name it can attest and treats one of them as the headword — which is a filing decision, not a claim that the others are wrong.` },
    { q: 'What if the name I have is not here?', a: `Then try <a href="${base}browse/">the search</a>, which also matches the statement text and ignores accents and apostrophes, or <a href="${base}situations/">describe the problem instead of naming it</a>. If the name is real and missing, it belongs in the corpus — that is a gap, and the entry pages say how to report one.` },
    { q: 'Do the other names have their own pages?', a: `No, deliberately. A second page repeating one entry under a second name would be two thin pages where there is one good one, so every alias links to the single entry that holds the statement, the mechanism, the examples and the sources.` },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'Also known as',
    sub: `${num(rows.length)} other names`,
    answer,
    lede,
    stats: [[num(rows.length), 'other names'], [num(withAliases), 'entries with one'], [present.size, 'letters']],
    base,
    crumbs: [['browse/', 'Browse']],
  })}${listFilter({ target: 'aka-az', label: `Filter ${num(rows.length)} names`, placeholder: 'Type any name you have heard…', noun: 'names' })}${jumpBar(present, 'aka')}    <div id="aka-az">
${html}
    </div>
${faq.html}${hubNav('browse/', { base })}  </div>
</section>
`;

  const description = `Every other name in the index — ${num(rows.length)} aliases, second names and older names for ${num(withAliases)} entries, alphabetised and cross-referenced to the entry each belongs to.`;

  return head({
    title: `Also Known As — ${num(rows.length)} Other Names for Named Laws | The Law Tome`,
    description, base, origin, path: 'also-known-as/',
    jsonld: [
      ...hubJsonLd({
        name: 'Also known as',
        description,
        path: 'also-known-as/',
        items: rows.slice(0, 100).map((r) => ({ name: r.alias, url: `${origin}${base}laws/${r.law.slug}/` })),
        origin,
        base,
      }),
      ...(faq.jsonld ? [faq.jsonld] : []),
    ],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/* -------------------------------------------------------------------- quotes */

/**
 * Every statement in the corpus, verbatim, grouped by field.
 *
 * Grouped by field rather than alphabetically because a reader browsing
 * phrasings is browsing a subject, and because an alphabet of quotations
 * sorted by the first word of the quote is an alphabet of "A", "The" and "When".
 */
/**
 * The statements grouped by field, biggest first, each field in corpus order.
 * Shared by the hub and the per-field pages so they cannot disagree.
 */
export function quoteFields(laws = [], categories = {}) {
  const byField = new Map();
  for (const l of Array.isArray(laws) ? laws : []) {
    if (!l.statement) continue;
    const k = l.category || 'other';
    if (!byField.has(k)) byField.set(k, []);
    byField.get(k).push(l);
  }
  return [...byField.entries()]
    .sort((a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0])))
    .map(([key, list]) => ({
      key,
      title: categories[key] || key,
      list: list.slice().sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0)),
    }));
}

/** Base-relative path of a field's statements page. */
export const quotePath = (key) => `quotes/${key}/`;

const quoted = (l, base) => `        <figure class="qt" data-filter-row data-filter-text="${escapeHtml(`${l.statement} ${l.name} ${(l.aliases || []).join(' ')}`)}">
          <blockquote class="qt-q">${escapeHtml(l.statement)}</blockquote>
          <figcaption class="qt-c"><a href="${base}laws/${escapeHtml(l.slug)}/">${escapeHtml(l.name)}</a><span class="qt-n">№ ${escapeHtml(String(l.no ?? ''))}</span></figcaption>
        </figure>`;

const LEDE = 'Most people meet a named law as a sentence, not as a name. They remember "what can go wrong will go wrong" and not that it is Murphy\'s; they remember "when a measure becomes a target, it ceases to be a good measure" and not that it is Goodhart\'s. These pages are the sentences. Recognise one, follow it to the entry, and find out whether it is true.';

/**
 * /quotes/ — a hub, one card per field with a few of its statements.
 *
 * It used to be all 1,116 statements on one page, 614 KB (backlog B9). Each
 * field now has its own page, which is also a landing page a search can
 * arrive at. The one job the single page did that no field page can, finding
 * a line you half-remember without knowing its field, is done by the site
 * search, which ranks statement text (build/search-index.mjs), and the FAQ
 * sends readers there.
 */
export function quotesPage(laws = [], { base = '/', origin = '', count, categories = {} } = {}) {
  const fields = quoteFields(laws, categories);
  const total = fields.reduce((n, f) => n + f.list.length, 0);

  const cards = fields.map((f) => `      <a class="qt-card" href="${base}${quotePath(f.key)}">
        <span class="qtc-t">${escapeHtml(f.title)}<span class="qt-hn">${num(f.list.length)}</span></span>
${f.list.slice(0, 2).map((l) => `        <span class="qtc-q">“${escapeHtml(l.statement)}” <span class="qtc-n">${escapeHtml(l.name)}</span></span>`).join('\n')}
      </a>`).join('\n');

  const answer = `${num(total)} named laws, principles and effects in the form they are usually quoted, each attributed to its entry, in ${fields.length} fields with a page each.`;

  const faq = hubFaq([
    { q: 'Are these exact quotations?', a: `They are the statements in the form the idea is conventionally quoted, which is not always the form its originator wrote — many of these were sharpened by other people over decades, and several were never said by their namesake at all. The entry behind each one gives the wording's actual history, and <a href="${base}misattributed/">the misattribution list</a> gathers the entries whose name credits the wrong person.` },
    { q: 'Can I quote these?', a: `Yes. The corpus is licensed <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> — copy, print and redistribute them, including commercially, as long as the attribution travels with them. Every entry page carries a ready-made citation and a quote-card image.` },
    { q: 'Does a good line mean a true claim?', a: `No, and the two are close to unrelated — a memorable phrasing is evidence about the phrasing. This index rates every entry separately on the evidence behind it, from <a href="${base}reliability/empirical/">measured</a> down to <a href="${base}reliability/folk-adage/">folklore</a>, and some of the most quotable lines here sit at the bottom of that scale.` },
    { q: 'I remember the wording but not the name.', a: `Then <a href="${base}browse/">the search</a> is the place: it matches statement text across all ${num(total)} entries, not only names. Each field page below can also be filtered, and <a href="${base}diagnose/">the problem-first door</a> works from a description rather than a quotation.` },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'The statements',
    sub: `${num(total)} quotations`,
    answer,
    lede: LEDE,
    stats: [[num(total), 'statements'], [fields.length, 'fields'], ['CC BY 4.0', 'licensed']],
    base,
    crumbs: [['browse/', 'Browse']],
  })}    <div class="qt-cards">
${cards}
    </div>
${faq.html}${hubNav('browse/', { base })}  </div>
</section>
`;

  const description = `Every named law in the index in the form it is usually quoted — ${num(total)} statements, attributed, in ${fields.length} fields, and licensed CC BY 4.0.`;

  return head({
    title: `The Statements — ${num(total)} Named Laws, as They Are Quoted | The Law Tome`,
    description, base, origin, path: 'quotes/',
    jsonld: [
      ...hubJsonLd({
        name: 'The statements', description, path: 'quotes/', origin, base,
        items: fields.map((f) => ({ name: f.title, url: `${origin}${base}${quotePath(f.key)}` })),
      }),
      ...(faq.jsonld ? [faq.jsonld] : []),
    ],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/** One field's statements, as they are quoted (backlog B9). */
export function quoteFieldPage(field, { base = '/', origin = '', count, fields = [] } = {}) {
  const { key, title, list } = field;
  const path = quotePath(key);
  const answer = `${num(list.length)} named laws in ${escapeHtml(title.toLowerCase())}, in the form each is usually quoted and attributed to its entry — among them “${escapeHtml(list[0].statement)}” (${escapeHtml(list[0].name)}).`;
  const others = fields.filter((f) => f.key !== key).map((f) => `<a href="${base}${quotePath(f.key)}">${escapeHtml(f.title.toLowerCase())}</a>`).join(', ');
  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: `${title}, as quoted`,
    sub: `${num(list.length)} statements`,
    answer,
    lede: LEDE,
    base,
    crumbs: [['browse/', 'Browse'], ['quotes/', 'The statements']],
  })}${listFilter({ target: 'qt-all', label: `Filter ${num(list.length)} statements`, placeholder: 'Type any part of a line you remember…', noun: 'statements' })}    <div id="qt-all">
      <section class="qt-grp" data-filter-group id="qt-${escapeHtml(key)}">
        <div class="qt-list">
${list.map((l) => quoted(l, base)).join('\n')}
        </div>
      </section>
    </div>
    <p class="bk-note">The other fields: ${others}. Or <a href="${base}category/${escapeHtml(key)}/">every entry in ${escapeHtml(title.toLowerCase())}</a> in full.</p>
${hubNav('browse/', { base })}  </div>
</section>
`;
  const description = `${num(list.length)} named laws in ${title.toLowerCase()} in the form they are usually quoted — each attributed to its entry, and licensed CC BY 4.0.`;
  return head({
    title: `${title} Laws, as They Are Quoted — ${num(list.length)} Statements | The Law Tome`,
    description, base, origin, path,
    jsonld: hubJsonLd({
      name: `${title}, as quoted`, description, path, origin, base,
      crumbs: [['browse/', 'Browse'], ['quotes/', 'The statements']],
      items: list.slice(0, 100).map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
    }),
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}
