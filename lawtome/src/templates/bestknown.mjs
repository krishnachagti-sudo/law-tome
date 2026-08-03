// /best-known/ — the index ranked by how often each name appears in print.
//
// "What are the most famous named laws?" is one of the most-asked questions in
// this subject and the one an index is least entitled to answer, because fame
// is not a thing we hold. What we do hold is a measurement somebody else made:
// Google Books Ngrams, the relative frequency of a phrase across the scanned
// English corpus from 1800 to 2019. That is not fame. It is a real, external,
// citable number that correlates with it, and the page says so in those words.
//
// Two rules keep the ranking honest, and both are stated on the page:
//
//   1. The measured phrase is shown on every row. A reader can see that the
//      number against Moore's Law is a count of "Moore's Law" and judge for
//      themselves whether that is the right thing to have counted.
//
//   2. Single-word phrases are excluded. "Substance", "BASE", "ACID",
//      "Sublime" and "Curing" topped the raw ranking, and every one of those
//      readings is the ordinary English word rather than the entry — ACID
//      the database property cannot be told from acid the chemical. The rule
//      is mechanical (two words or more), it is applied without exception, and
//      it costs us legitimate single-word entries like Fermentation and
//      Pasteurization, which the page admits rather than hides.
//
// What the page must never imply: that a frequently printed name is a better
// idea, a truer claim, or a more useful one. Habeas Corpus tops this list by an
// order of magnitude because it is legal boilerplate printed in every casebook
// for two centuries, not because it is the most important entry in the index.

import { head, sprite, header, footer, escapeHtml, listFilter, reliabilityClass } from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

/**
 * Words in a measured phrase.
 *
 * The ngram corpus tokenises punctuation apart, so "Murphy's Law" is stored as
 * "Murphy 's Law" and a hyphenated name as "Navier - Stokes Equations". Both
 * are two-word terms by any reading a person would give them, so the possessive
 * is rejoined and a bare hyphen is not counted as a word.
 */
export function phraseWords(phrase) {
  return String(phrase || '')
    .replace(/\s'\s?s\b/g, "'s")
    .split(/\s+/)
    .filter((w) => w && w !== '-')
    .length;
}

/**
 * Rank the corpus by peak printed frequency.
 *
 * @param {object[]} laws
 * @param {object} facts src/data/facts.json
 * @param {object} [o]
 * @param {number} [o.minWords=2] see the header note — the single-word cut
 * @returns {{law, phrase, peak, peakYear, series:number[]}[]} descending by peak
 */
export function bestKnown(laws = [], facts = {}, { minWords = 2 } = {}) {
  const rows = [];
  for (const law of (Array.isArray(laws) ? laws : [])) {
    const ng = (facts[law.slug] || {}).ngram;
    if (!ng || !ng.peak || !ng.phrase) continue;
    if (phraseWords(ng.phrase) < minWords) continue;
    const series = Array.isArray(ng.series) ? ng.series : [];
    let peakYear = null;
    if (series.length) {
      let best = -Infinity; let at = 0;
      for (let i = 0; i < series.length; i += 1) if (series[i] > best) { best = series[i]; at = i; }
      peakYear = (Number(ng.from) || 1800) + at;
    }
    rows.push({ law, phrase: String(ng.phrase).replace(/\s'\s?s\b/g, "'s").replace(/\s-\s/g, '-'), peak: ng.peak, peakYear, series });
  }
  return rows.sort((a, b) => b.peak - a.peak);
}

/** A 220-point series as a tiny polyline, scaled to its own maximum. */
function spark(series, w = 92, h = 22) {
  if (!series || series.length < 8) return '';
  const max = Math.max(...series);
  if (!(max > 0)) return '';
  const step = w / (series.length - 1);
  const pts = series.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * (h - 2) - 1).toFixed(1)}`).join(' ');
  return `<svg class="bk-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>`;
}

/**
 * @param {object[]} ranked from bestKnown()
 * @param {object} o
 * @param {number} o.corpusTotal every entry in the index, for the honest denominator
 * @param {number} o.limit how many rows to print
 */
export function bestKnownPage(ranked = [], {
  base = '/', origin = '', count, categories = {}, corpusTotal = 0, limit = 250,
} = {}) {
  const rows = ranked.slice(0, limit);
  const unmeasured = Math.max(0, Number(corpusTotal || 0) - ranked.length);
  const per = (p) => (p * 1e6).toFixed(p * 1e6 >= 1 ? 2 : 3);

  const top = rows.slice(0, 5).map((r) => r.law.name);

  const answer = `Ranked by how often the name is printed: ${top.join(', ')} lead the index, measured as peak relative frequency in the Google Books English corpus between 1800 and 2019. This counts printings of a phrase. It is not a measure of how important, how useful, or how true an idea is.`;

  const lede = 'There is no honest way to measure fame, so this page does not claim to. It reports one external number that somebody else collected — how often a phrase turns up in scanned books — and shows you the exact phrase that was counted, so you can decide whether it counted the right thing. Habeas Corpus leads by a factor of ten because it is printed in every legal casebook ever bound, which tells you a great deal about publishing and nothing at all about jurisprudence.';

  const list = rows.map((r, i) => {
    const l = r.law;
    return `        <a class="bk-row" href="${base}laws/${escapeHtml(l.slug)}/" data-filter-row data-filter-text="${escapeHtml(`${l.name} ${r.phrase} ${categories[l.category] || l.category || ''}`)}">
          <span class="bk-r">${i + 1}</span>
          <span class="bk-n">${escapeHtml(l.name)}<span class="bk-p">counted as “${escapeHtml(r.phrase)}”</span></span>
          <span class="bk-s">${spark(r.series)}</span>
          <span class="bk-v">${per(r.peak)}<span class="bk-u">per million</span></span>
          <span class="bk-y">${r.peakYear ? `peak ${r.peakYear}` : ''}</span>
          <span class="badge ${reliabilityClass(l.reliability)}">${escapeHtml(l.reliability || '')}</span>
        </a>`;
  }).join('\n');

  const faq = hubFaq([
    {
      q: 'What exactly is being measured?',
      a: 'Peak relative frequency in the Google Books English corpus: of all the words printed in the year the phrase was most common, what share were this phrase. The figure is given per million words. The line beside each entry is its whole run from 1800 to 2019, scaled to its own maximum — it shows the shape of a name\'s life in print, not how it compares to the name above it.',
    },
    {
      q: 'Why is my favourite entry missing?',
      a: `Two reasons, and the page would rather lose an entry than publish a bad number. ${num(unmeasured)} entries have no usable reading at all — too recent for a corpus that stops in 2019, too rare to register, or their name is not a fixed phrase. And any entry whose name is a single word is excluded, because the reading would be of the ordinary English word: the raw ranking was topped by <em>Substance</em>, <em>BASE</em>, <em>ACID</em>, <em>Sublime</em> and <em>Curing</em>, and not one of those numbers was about the entry. That rule also costs us honest single-word entries like Fermentation and Pasteurization.`,
    },
    {
      q: 'Does appearing more often mean it is more important?',
      a: `No, and the two come apart constantly. Printing frequency rewards age, legal and academic boilerplate, and phrases that double as ordinary English. It says nothing about evidence — this index rates that separately, and <a href="${base}is-it-real/">the reliability scale</a> and this ranking barely track each other. A heavily printed Folk-adage is still a Folk-adage.`,
    },
    {
      q: 'Why does the line stop in 2019?',
      a: 'Because the corpus does. Google Books Ngrams was last rebuilt from books scanned up to 2019, so nothing named or popularised since then can appear here at all — which is a real bias toward the old, and one more reason to read this as a fact about publishing rather than about ideas.',
    },
  ]);

  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title: 'The best-known',
    sub: `${num(ranked.length)} measured`,
    answer,
    lede,
    stats: [[num(ranked.length), 'with a reading'], [num(unmeasured), 'without one'], ['1800–2019', 'in print']],
    base,
    crumbs: [['browse/', 'Browse']],
  })}    <p class="bk-note">Ranked by peak share of printed English words, from <a href="https://books.google.com/ngrams/" rel="noopener nofollow" target="_blank">Google Books Ngrams</a>. The phrase actually counted is printed under every name. This measures printing, not importance and not truth.</p>
${listFilter({ target: 'bk-list', label: `Filter ${num(rows.length)} entries`, placeholder: 'Filter by name, phrase or field…', noun: 'entries' })}      <div class="bk-list" id="bk-list">
${list}
      </div>
${rows.length < ranked.length ? `      <p class="bk-note">Showing the top ${num(rows.length)} of ${num(ranked.length)} entries with a reading. The rest are on their own pages, each carrying the same chart.</p>\n` : ''}${faq.html}${hubNav('browse/', { base })}  </div>
</section>
`;

  const description = `The named laws printed most often in English books, 1800–2019 — ${num(ranked.length)} entries ranked by peak frequency in Google Books Ngrams, with the exact phrase counted shown for each.`;

  return head({
    title: 'The Best-Known Named Laws, by How Often They Are Printed | The Law Tome',
    description, base, origin, path: 'best-known/',
    jsonld: [
      ...hubJsonLd({
        name: 'The best-known',
        description,
        path: 'best-known/',
        items: rows.slice(0, 100).map((r) => ({ name: r.law.name, url: `${origin}${base}laws/${r.law.slug}/` })),
        origin,
        base,
      }),
      ...(faq.jsonld ? [faq.jsonld] : []),
    ],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}
