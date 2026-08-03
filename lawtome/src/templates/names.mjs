// The names these ideas go by in other languages (/names/ and /names/<lang>/).
//
// The corpus already holds 6,253 foreign names for 766 of its entries, pulled
// from Wikidata labels by build/fetch-facts.py. Until now every one of them was
// buried in a collapsed block two thirds of the way down a law page, which
// means someone searching for "قانون جودهارت" or "グッドハートの法則" could not
// find us at all — the string exists in our HTML, but on a page whose title,
// headings and every other word are English.
//
// So: one index per language, listing the name as it is actually written
// alongside the entry it belongs to. What these pages are NOT is a translated
// site. We hold names, not content, and machine-translating 1,101 articles
// would be fabrication dressed as reach. Every page says so in its own words,
// in its own language's section, and links back to the English entry.

import { head, sprite, header, footer, escapeHtml, listFilter, reliabilityClass } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

/**
 * The languages we index, in the order the hub lists them.
 *
 * `native` is the language's name in itself (an endonym), because a reader
 * scanning for their own language scans for that word, not for the English
 * one. `dir` marks the two that are not written left to right — Arabic here —
 * so the name column can be marked up honestly rather than rendered backwards.
 * `code` is the BCP 47 tag that goes in `lang=` and in hreflang-style hints.
 *
 * This list is deliberately hard-coded rather than derived from the data: it
 * carries facts about the languages (endonym, direction, script) that are not
 * in the corpus and cannot be inferred from a two-letter key.
 */
export const LANGS = [
  { code: 'zh', name: 'Chinese', native: '中文', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', native: '日本語', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', dir: 'ltr' },
  { code: 'it', name: 'Italian', native: 'Italiano', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
];

const BY_CODE = new Map(LANGS.map((l) => [l.code, l]));

/** Thousands separators, because the header says 1,101 and so should we. */
const num = (n) => Number(n).toLocaleString('en-US');

/**
 * "a French edition" but "an Arabic edition".
 *
 * Only the ten English language names above decide this, so the initial-vowel
 * test is exact here rather than a guess at English orthography in general.
 */
const an = (name) => (/^[AEIOU]/.test(name) ? 'an' : 'a');

/** The path for a language index, base-relative. */
export function namesPath(code) {
  return `names/${code}/`;
}

/**
 * Every recorded name in one language, paired with the entry it names.
 *
 * Sorted by the FOREIGN name, using that language's own collation — the point
 * of the page is to be scannable by someone reading in that language, and
 * sorting by the English title would scatter the column they are reading.
 *
 * @param {object[]} laws corpus entries
 * @param {object} facts src/data/facts.json (slug -> fact)
 * @param {string} code two-letter language key
 * @returns {{name: string, law: object}[]}
 */
export function namesFor(laws, facts, code) {
  const rows = [];
  for (const l of (Array.isArray(laws) ? laws : [])) {
    const f = facts && facts[l.slug];
    const label = f && f.names && f.names.labels && f.names.labels[code];
    if (!label) continue;
    rows.push({ name: label, law: l, source: (f.names && f.names.source) || '' });
  }
  // Intl collation per language where the runtime has it; localeCompare falls
  // back to code-point order for a locale it does not know, which is still
  // stable, so no guard is needed.
  return rows.sort((a, b) => a.name.localeCompare(b.name, code) || a.law.name.localeCompare(b.law.name, 'en'));
}

/** Which languages actually have names recorded, with their counts. */
export function languagesPresent(laws, facts) {
  return LANGS
    .map((l) => ({ ...l, count: namesFor(laws, facts, l.code).length }))
    .filter((l) => l.count > 0);
}

/**
 * A name a reader can recognise: the foreign name large, the English entry
 * under it. `lang` and `dir` are set per cell, not per page, so a browser
 * picks the right font and a screen reader the right voice.
 */
function nameRows(rows, { base, code, dir, categories = {} }) {
  return rows.map(({ name, law }) => {
    // The statement is the reason this page is worth landing on. Without it the
    // row is a redirect wearing a name — someone who searched "Ley de Murphy"
    // arrives, sees two words they already knew, and leaves. With it they have
    // the answer before they click, which is the whole promise of the index.
    //
    // It stays in English, and the page says so above in plain terms. A
    // machine-translated statement would be an unverified claim in a project
    // whose one rule is that it does not publish those.
    const field = categories[law.category] || law.category || '';
    return `      <a class="nx-row" data-filter-row
         data-filter-text="${escapeHtml(`${name} ${law.name} ${field}`)}"
         href="${base}laws/${escapeHtml(law.slug)}/">
        <span class="nx-name" lang="${escapeHtml(code)}"${dir === 'rtl' ? ' dir="rtl"' : ''}>${escapeHtml(name)}</span>
        <span class="nx-en">${escapeHtml(law.name)}${field ? `<span class="nx-cat">${escapeHtml(field)}</span>` : ''}</span>
        <span class="nx-say">${escapeHtml(law.statement || '')}</span>
        <span class="badge ${reliabilityClass(law.reliability)} nx-badge">${escapeHtml(law.reliability || '')}</span>
      </a>`;
  }).join('\n');
}

/**
 * One language's index.
 *
 * @param {object} lang entry from LANGS, with `count`
 * @param {{name: string, law: object}[]} rows from namesFor
 */
export function namesLangPage(lang, rows, { base = '/', origin = '', count, others = [], categories = {} } = {}) {
  const { code, name, native, dir } = lang;
  const total = rows.length;
  const path = namesPath(code);

  const answer = `The Law Tome records ${num(total)} of its ${count ? num(count) : 'named'} laws under the ${name} (${native}) ${total === 1 ? 'name' : 'names'} ${total === 1 ? 'it goes' : 'they go'} by — “${escapeHtml(rows[0] ? rows[0].name : '')}” and the rest — each one taken from that entry's Wikidata label rather than translated by us, and each linked to the full English entry.`;

  const lede = `This is an index of names, not ${an(name)} ${name} edition of the site. Every name below is the one the idea is already published under in ${name}, as recorded on Wikidata; the ${name} column is real ${name}, and everything you find behind the link is in English. We would rather be findable under the right name and honest about the language of the article than machine-translate ${count ? num(count) : 'every one of these'} entries and call the result ${an(name)} ${name} encyclopedia.`;

  const faq = hubFaq([
    {
      q: `Is The Law Tome available in ${name}?`,
      a: `Not as articles. ${num(total)} entries carry their ${name} name here, so you can find the right one under the name you know it by, but the entries themselves are written in English. Translating them by machine would put text on the site that nobody verified, which is the one thing this project does not do.`,
    },
    {
      q: `Where do these ${name} names come from?`,
      a: `From Wikidata's ${name} labels for each idea — the name the idea is already published under, not a rendering we produced. Each entry's own page links the Wikidata item it was read from.`,
    },
    {
      q: `Why do only ${num(total)} of the laws have a ${name} name?`,
      a: `Because only those have a Wikidata item with a ${name} label. The rest are recorded in English only, and inventing a ${name} name for them would be making something up. Where a name appears later, it appears here.`,
    },
  ]);

  const nav = others.length
    ? `    <nav class="nx-langs" aria-label="Other languages">
      <h2 class="nx-langs-h">The same index in another language</h2>
      <div class="nx-langs-row">
${others.map((o) => `        <a class="nx-lang" href="${base}${namesPath(o.code)}" hreflang="${escapeHtml(o.code)}"><span class="nx-lang-n" lang="${escapeHtml(o.code)}"${o.dir === 'rtl' ? ' dir="rtl"' : ''}>${escapeHtml(o.native)}</span><span class="nx-lang-c">${o.count}</span></a>`).join('\n')}
      </div>
    </nav>
`
    : '';

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: `Named laws in ${name}`,
    sub: `${total} ${total === 1 ? 'name' : 'names'}`,
    answer,
    lede,
    stats: [[num(total), 'recorded names'], [native, 'in itself'], ['Wikidata', 'the source']],
    base,
    crumbs: [['browse/', 'Browse'], ['names/', 'In other languages']],
  })}${listFilter({ target: 'nx-list', label: `Filter ${num(total)} ${name} names`, placeholder: `Filter ${num(total)} names…`, noun: 'names' })}    <div class="nx-list" id="nx-list">
${nameRows(rows, { base, code, dir, categories })}
    </div>
${nav}${faq.html}${hubNav('names/', { base })}  </div>
</section>
`;

  const description = `${num(total)} named laws, principles and effects under their ${name} names (${native}) — every name as recorded on Wikidata, each linked to the full entry.`;

  const jsonld = [
    ...hubJsonLd({
        crumbs: [['browse/', 'Browse'], ['names/', 'In other languages']],
      name: `Named laws in ${name}`,
      description,
      path,
      items: rows.slice(0, 100).map((r) => ({ name: r.name })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: `Named Laws in ${name} (${native}) — ${num(total)} Names | The Law Tome`,
      description,
      base,
      origin,
      path,
      jsonld,
    })
    + sprite()
    + header({ base, active: 'browse', count })
    + section
    + footer({ base })
  );
}

/** The hub: which languages we hold names in, and how many of each. */
export function namesHubPage(langs = [], { base = '/', origin = '', count, lawsWithNames = 0 } = {}) {
  const rows = Array.isArray(langs) ? langs : [];
  const total = rows.reduce((n, l) => n + l.count, 0);
  const top = rows.slice().sort((a, b) => b.count - a.count);

  const answer = `The Law Tome holds ${num(total)} names for its laws in ${rows.length} languages other than English — ${top.slice(0, 3).map((l) => `${num(l.count)} in ${l.name}`).join(', ')} and the rest — covering ${num(lawsWithNames)} of the ${count ? num(count) : ''} entries, every one of them read off that entry's Wikidata item rather than translated here.`;

  const lede = 'A law you know by one name is often filed here under another. These indexes let you come in from the name you actually use: pick a language, find the name, land on the entry. The entries themselves are in English — we hold the names, not translations, and we are not going to machine-translate an encyclopedia and pretend otherwise.';

  const cards = rows.map((l) => `      <a class="nx-card" href="${base}${namesPath(l.code)}" hreflang="${escapeHtml(l.code)}">
        <span class="nx-card-n" lang="${escapeHtml(l.code)}"${l.dir === 'rtl' ? ' dir="rtl"' : ''}>${escapeHtml(l.native)}</span>
        <span class="nx-card-e">${escapeHtml(l.name)}</span>
        <span class="nx-card-c">${num(l.count)} names</span>
      </a>`).join('\n');

  const faq = hubFaq([
    {
      q: 'Is the site translated into these languages?',
      a: `No. Each index gives the name an idea is already published under in that language, taken from Wikidata; the entries are written in English. A machine translation of ${count ? num(count) : 'a thousand'} verified entries would be ${count ? num(count) : 'a thousand'} unverified ones.`,
    },
    {
      q: 'Where do the names come from?',
      a: 'Wikidata labels, fetched per entry and stored with the item they came from. Nothing here was translated by us or by a model.',
    },
    {
      q: 'Which languages are covered?',
      a: `${rows.map((l) => `<a href="${base}${namesPath(l.code)}">${escapeHtml(l.name)}</a> (${l.count})`).join(', ')}. A language appears once at least one entry carries a name in it.`,
    },
    {
      q: 'Why do the counts differ between languages?',
      a: 'Because Wikidata coverage does. An idea with a long article history in one language may have no label at all in another, and we record only what is there.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'These laws in other languages',
    sub: `${rows.length} languages`,
    answer,
    lede,
    stats: [[num(total), 'recorded names'], [rows.length, 'languages'], [num(lawsWithNames), 'entries covered']],
    base,
  })}    <div class="nx-cards">
${cards}
    </div>
${faq.html}${hubNav('names/', { base })}  </div>
</section>
`;

  const description = `${num(total)} names for the laws in this index across ${rows.length} languages — Chinese, French, Spanish, Japanese, German, Russian and more — each recorded on Wikidata, not translated here.`;

  const jsonld = [
    ...hubJsonLd({
        crumbs: [['browse/', 'Browse']],
      name: 'These laws in other languages',
      description,
      path: 'names/',
      items: rows.map((l) => ({ name: `${l.name} (${l.count} names)` })),
      origin,
      base,
    }),
    ...(faq.jsonld ? [faq.jsonld] : []),
  ];

  return (
    head({
      title: 'Named Laws in Other Languages — Name Indexes | The Law Tome',
      description,
      base,
      origin,
      path: 'names/',
      jsonld,
    })
    + sprite()
    + header({ base, active: 'browse', count })
    + section
    + footer({ base })
  );
}

export { BY_CODE };
