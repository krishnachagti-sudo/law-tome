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
import { isPhraseReading } from './facts.mjs';

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
    if (!isPhraseReading(ng)) continue;
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

/**
 * Bands of printed frequency, in roughly threefold steps (backlog B11).
 *
 * The page used to number every row, as if #43 and #44 were meaningfully
 * different. They are not. A phrase count carries OCR errors, misdated scans,
 * and every other thing the same words can mean, and none of that is small
 * next to the gap between neighbours. The error scales with the count, so the
 * honest unit is a ratio: names are grouped in steps of about three, and
 * within a band the order is shown but called rough. The top band is merged
 * because only eight names reach it.
 *
 * Every figure the site states about a name's fame goes through bandOf():
 * this page, the law page's "Is it real?" figures and the verdict pages, so
 * none of them claims more precision than another.
 */
export const BANDS = [
  { slug: 'everywhere', label: 'Printed everywhere', lo: 3e-7 },
  { slug: 'very-widely', label: 'Very widely printed', lo: 1e-7 },
  { slug: 'widely', label: 'Widely printed', lo: 3e-8 },
  { slug: 'regularly', label: 'Regularly printed', lo: 1e-8 },
  { slug: 'occasionally', label: 'Occasionally printed', lo: 3e-9 },
  { slug: 'rarely', label: 'Rarely printed', lo: 1e-9 },
  { slug: 'seldom', label: 'Seldom printed', lo: 0 },
];

/** The band a peak frequency falls in. */
export function bandOf(peak) {
  return BANDS.find((b) => peak >= b.lo) || BANDS[BANDS.length - 1];
}

/** Human range for a band, per million words. */
export function bandRange(b) {
  const i = BANDS.indexOf(b);
  const per = (x) => {
    const v = x * 1e6;
    return v >= 0.1 ? String(+v.toFixed(1)) : v >= 0.01 ? String(+v.toFixed(2)) : String(+v.toFixed(3));
  };
  if (i === 0) return `${per(b.lo)} or more per million words`;
  if (b.lo === 0) return `under ${per(BANDS[i - 1].lo)} per million words`;
  return `${per(b.lo)} to ${per(BANDS[i - 1].lo)} per million words`;
}

/** Base-relative path of a band's own page. */
export const bandPath = (b) => `best-known/${b.slug}/`;

/**
 * A series as a tiny polyline, scaled to its own maximum.
 *
 * Downsampled to 46 points first. The series has 220, one per year, and the
 * chart is 92 pixels wide, so four of every five points landed on a pixel
 * another point had already drawn. At 250 rows those invisible points were
 * most of what /best-known/ weighed (backlog B9). Each bucket keeps its
 * maximum, so a peak is never averaged away.
 */
function spark(series, w = 92, h = 22) {
  if (!series || series.length < 8) return '';
  const N = Math.min(46, series.length);
  const pts0 = [];
  for (let k = 0; k < N; k += 1) {
    const a = Math.floor((k * series.length) / N);
    const b = Math.max(a + 1, Math.floor(((k + 1) * series.length) / N));
    pts0.push(Math.max(...series.slice(a, b)));
  }
  const max = Math.max(...pts0);
  if (!(max > 0)) return '';
  const step = w / (pts0.length - 1);
  const pts = pts0.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / max) * (h - 2) - 1).toFixed(1)}`).join(' ');
  return `<svg class="bk-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linejoin="round"/></svg>`;
}

/** One row of the ranking. No rank number: see BANDS. */
function row(r, { base, categories }) {
  const l = r.law;
  const per = (p) => (p * 1e6).toFixed(p * 1e6 >= 1 ? 2 : 3);
  return `        <a class="bk-row" href="${base}laws/${escapeHtml(l.slug)}/" data-filter-row data-filter-text="${escapeHtml(`${l.name} ${r.phrase} ${categories[l.category] || l.category || ''}`)}">
          <span class="bk-n">${escapeHtml(l.name)}<span class="bk-p">counted as “${escapeHtml(r.phrase)}”</span></span>
          <span class="bk-s">${spark(r.series)}</span>
          <span class="bk-v">${per(r.peak)}<span class="bk-u">per million</span></span>
          <span class="bk-y">${r.peakYear ? `peak ${r.peakYear}` : ''}</span>
          <span class="badge ${reliabilityClass(l.reliability)}">${escapeHtml(l.reliability || '')}</span>
        </a>`;
}

/** Rows grouped by band, in band order; rows keep measured order within. */
export function banded(ranked = []) {
  const by = new Map(BANDS.map((b) => [b, []]));
  for (const r of ranked) by.get(bandOf(r.peak)).push(r);
  return BANDS.map((b) => ({ band: b, rows: by.get(b) })).filter((g) => g.rows.length);
}

const ROUGH = 'Within a band the order is rough: a phrase count carries scanning errors, misdated books and every other thing the same words can mean, and those are larger than the gap between neighbours.';

/**
 * The hub: every band with its size and range, and the two top bands in full.
 * Each band has its own page with every name in it, so all measured entries
 * are listed somewhere; this page used to show the top 250 of 900-odd.
 *
 * @param {object[]} ranked from bestKnown()
 * @param {object} o
 * @param {number} o.corpusTotal every entry in the index, for the honest denominator
 */
export function bestKnownPage(ranked = [], {
  base = '/', origin = '', count, categories = {}, corpusTotal = 0, inline = 2,
} = {}) {
  const unmeasured = Math.max(0, Number(corpusTotal || 0) - ranked.length);
  const groups = banded(ranked);
  const top = ranked.slice(0, 5).map((r) => r.law.name);

  const answer = `Grouped by how often the name is printed: ${top.join(', ')} lead the index, measured as peak relative frequency in the Google Books English corpus between 1800 and 2019. This counts printings of a phrase. It is not a measure of how important, how useful, or how true an idea is.`;

  const lede = 'There is no honest way to measure fame, so this page does not claim to. It reports one external number that somebody else collected — how often a phrase turns up in scanned books — and shows you the exact phrase that was counted, so you can decide whether it counted the right thing. Habeas Corpus leads by a factor of seven because it is printed in every legal casebook ever bound, which tells you a great deal about publishing and nothing at all about jurisprudence.';

  const cards = groups.map((g) => `      <a class="bk-band" href="${base}${bandPath(g.band)}">
        <span class="bkb-t">${escapeHtml(g.band.label)}</span>
        <span class="bkb-n">${num(g.rows.length)} ${g.rows.length === 1 ? 'name' : 'names'} · ${escapeHtml(bandRange(g.band))}</span>
        <span class="bkb-l">${g.rows.slice(0, 4).map((r) => escapeHtml(r.law.name)).join(' · ')}${g.rows.length > 4 ? '…' : ''}</span>
      </a>`).join('\n');

  const inlineGroups = groups.slice(0, inline).map((g) => `      <h2 class="bk-h" id="band-${g.band.slug}">${escapeHtml(g.band.label)} <span class="bk-hn">${num(g.rows.length)} · ${escapeHtml(bandRange(g.band))}</span></h2>
      <div class="bk-list">
${g.rows.map((r) => row(r, { base, categories })).join('\n')}
      </div>`).join('\n');

  const faq = hubFaq([
    {
      q: 'Why bands instead of a numbered ranking?',
      a: `Because the numbers could not bear it. ${ROUGH} So names are grouped in steps of about three in how often they are printed, which is a difference a count like this can show, and the order inside a band is given but not numbered.`,
    },
    {
      q: 'What exactly is being measured?',
      a: 'Peak relative frequency in the Google Books English corpus: of all the words printed in the year the phrase was most common, what share were this phrase. The figure is given per million words. The line beside each entry is its whole run from 1800 to 2019, scaled to its own maximum — it shows the shape of a name\'s life in print, not how it compares to the name above it.',
    },
    {
      q: 'Why is my favourite entry missing?',
      a: `Three reasons, and the page would rather lose an entry than publish a bad number. ${num(unmeasured)} entries have no usable reading at all — too recent for a corpus that stops in 2019, too rare to register, or their name is not a fixed phrase. Any entry whose name is a single word is excluded, because the reading would be of the ordinary English word: the raw ranking was topped by <em>Substance</em>, <em>BASE</em>, <em>ACID</em>, <em>Sublime</em> and <em>Curing</em>, and the same rule costs us honest single-word entries like Fermentation and Pasteurization. And a reading taken from a query that was an expression rather than a phrase is dropped: one such, a ratio, once sat at the top of this page.`,
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
    stats: [[num(ranked.length), 'with a reading'], [num(unmeasured), 'without one'], [String(groups.length), 'bands']],
    base,
    crumbs: [['browse/', 'Browse']],
  })}    <p class="bk-note">Grouped by peak share of printed English words, from <a href="https://books.google.com/ngrams/" rel="noopener nofollow" target="_blank">Google Books Ngrams</a>. The phrase actually counted is printed under every name. This measures printing, not importance and not truth. ${ROUGH}</p>
    <div class="bk-bands">
${cards}
    </div>
${inlineGroups}
      <p class="bk-note">Every other band has its own page, above, with every name in it.</p>
${faq.html}${hubNav('browse/', { base })}  </div>
</section>
`;

  const description = `The named laws printed most often in English books, 1800–2019 — ${num(ranked.length)} entries grouped by peak frequency in Google Books Ngrams, with the exact phrase counted shown for each.`;

  return head({
    title: 'The Best-Known Named Laws, by How Often They Are Printed | The Law Tome',
    description, base, origin, path: 'best-known/',
    jsonld: [
      ...hubJsonLd({
        name: 'The best-known',
        description,
        path: 'best-known/',
        items: ranked.slice(0, 100).map((r) => ({ name: r.law.name, url: `${origin}${base}laws/${r.law.slug}/` })),
        origin,
        base,
      }),
      ...(faq.jsonld ? [faq.jsonld] : []),
    ],
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}

/** One band's own page: every measured name in it (backlog B9). */
export function bandPage(group, { base = '/', origin = '', count, categories = {}, measured = 0, groups = [] } = {}) {
  const { band, rows } = group;
  const path = bandPath(band);
  const title = band.label;
  const answer = `${num(rows.length)} named laws are ${escapeHtml(band.label.toLowerCase())} in English books: ${escapeHtml(bandRange(band))} at their peak, between 1800 and 2019. ${rows.slice(0, 3).map((r) => escapeHtml(r.law.name)).join(', ')} are among them.`;
  const others = groups.filter((g) => g.band !== band).map((g) => `<a href="${base}${bandPath(g.band)}">${escapeHtml(g.band.label.toLowerCase())}</a> (${num(g.rows.length)})`).join(', ');
  const section = `<section class="sec" id="index">
  <div class="wrap">
${hubHead({
    title,
    sub: `${num(rows.length)} of ${num(measured)} measured`,
    answer,
    lede: `One band of <a href="${base}best-known/">the best-known</a>, grouped by how often each name is printed. ${ROUGH}`,
    base,
    crumbs: [['browse/', 'Browse'], ['best-known/', 'The best-known']],
  })}${listFilter({ target: 'bk-list', label: `Filter ${num(rows.length)} entries`, placeholder: 'Filter by name, phrase or field…', noun: 'entries' })}      <div class="bk-list" id="bk-list">
${rows.map((r) => row(r, { base, categories })).join('\n')}
      </div>
      <p class="bk-note">The other bands: ${others}.</p>
${hubNav('browse/', { base })}  </div>
</section>
`;
  const description = `${num(rows.length)} named laws ${band.label.toLowerCase()} in English books (${bandRange(band)}), each with the exact phrase counted in Google Books Ngrams.`;
  return head({
    title: `${title} — ${num(rows.length)} Named Laws, by Print Frequency | The Law Tome`,
    description, base, origin, path,
    jsonld: hubJsonLd({
      name: title, description, path, origin, base,
      crumbs: [['browse/', 'Browse'], ['best-known/', 'The best-known']],
      items: rows.slice(0, 100).map((r) => ({ name: r.law.name, url: `${origin}${base}laws/${r.law.slug}/` })),
    }),
  }) + sprite() + header({ base, active: 'browse', count }) + section + footer({ base });
}
