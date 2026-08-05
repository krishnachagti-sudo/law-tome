// The non-image dimensions of a law: its formula, how the phrase spread, how
// the name is said, and what it is called elsewhere.
//
// All of it comes from build/fetch-facts.py and carries its source, on the same
// terms as everything else here: fetched and attributed, never composed. Each
// renderer returns '' when the fact is absent, so a page shows a dimension only
// where we actually have it rather than printing an empty shell.

import { escapeHtml, personSlug } from './partials.mjs';

const LANG_NAME = {
  fr: 'French', de: 'German', es: 'Spanish', it: 'Italian', pt: 'Portuguese',
  ru: 'Russian', ja: 'Japanese', zh: 'Chinese', ar: 'Arabic', hi: 'Hindi',
};

/** The law written as itself. */
export function formulaBlock(fact, law, { base = '/' } = {}) {
  const f = fact && fact.formula;
  if (!f) return '';
  return `        <figure class="formula">
          <img class="formula-img" src="${base}assets/img/formula/${escapeHtml(law.slug)}.svg" alt="${escapeHtml(f.tex)}" loading="lazy" decoding="async">
          <figcaption>The defining formula as recorded on <a href="${escapeHtml(f.source)}">Wikidata</a>. <code>${escapeHtml(f.tex)}</code></figcaption>
        </figure>`;
}

/**
 * The caption's warning that a chart of a NAME is not a chart of an idea.
 *
 * It used to be the same clause on all 965 entries with a diffusion chart. The
 * two dates needed to make it specific were already on the page — the year the
 * idea was coined, and the year its name reaches a tenth of its eventual peak
 * in print — so the warning now measures the gap instead of asserting it, and
 * only falls back to the general statement when one of the dates is missing.
 *
 * The gap is stated as a lag, never as a cause: print frequency measures when a
 * phrase was in circulation, not when anyone had the thought.
 */
function gapNote(coined, firstYear) {
  const generic = 'This tracks the <b>phrase</b> and not the idea. A law is usually older than the name for it.';
  if (!coined || !firstYear || !Number.isFinite(coined) || !Number.isFinite(firstYear)) return generic;
  const lag = firstYear - coined;
  if (lag >= 15) return `The idea dates to ${coined}: the <b>phrase</b> took about ${lag} years to reach print in any quantity, which is the gap this chart measures.`;
  if (lag <= -15) return `The <b>phrase</b> was already in print some ${Math.abs(lag)} years before ${coined}, the date recorded for the idea here. A chart of words is not a chart of when anyone had the thought.`;
  if (Math.abs(lag) < 15) return `Coined ${coined} and in print by about ${firstYear}, unusually close together. This still charts the <b>phrase</b> rather than the idea.`;
  return generic;
}

/**
 * When the phrase entered the language.
 *
 * This charts the NAME, not the idea — Occam's razor is six centuries older
 * than the phrase "Occam's razor" — so the caption says so outright rather than
 * letting a rising line imply the idea was invented when the words caught on.
 */
export function diffusionBlock(fact, law, { base = '/' } = {}) {
  const g = fact && fact.ngram;
  if (!g || !Array.isArray(g.series) || g.series.length < 40) return '';
  const s = g.series;
  const W = 640, H = 120, pad = 4;
  const step = (W - pad * 2) / (s.length - 1);
  const pts = s.map((v, i) => `${(pad + i * step).toFixed(1)},${(H - pad - (v / 1000) * (H - pad * 2)).toFixed(1)}`);
  const area = `M${pad},${H - pad} L${pts.join(' L')} L${W - pad},${H - pad} Z`;
  // the year the phrase first reaches a tenth of its own peak — its arrival
  const firstIdx = s.findIndex((v) => v >= 100);
  const firstYear = firstIdx >= 0 ? g.from + firstIdx : null;
  const peakYear = g.from + s.indexOf(Math.max(...s));
  const coined = law.coinedYear ? Number(law.coinedYear) : null;
  const coinedX = coined && coined >= g.from && coined <= g.to
    ? pad + (coined - g.from) * step : null;
  return `        <figure class="diffusion">
          <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Frequency of the phrase “${escapeHtml(g.phrase)}” in printed books, ${g.from} to ${g.to}">
            <path class="dif-area" d="${area}"/>
            <polyline class="dif-line" points="${pts.join(' ')}"/>
            ${coinedX != null ? `<line class="dif-coined" x1="${coinedX.toFixed(1)}" y1="${pad}" x2="${coinedX.toFixed(1)}" y2="${H - pad}"/>` : ''}
          </svg>
          <div class="dif-axis"><span>${g.from}</span>${coined ? `<span class="dif-mark">coined ${escapeHtml(String(coined))}</span>` : ''}<span>${g.to}</span></div>
          <figcaption>How often “${escapeHtml(g.phrase)}” appears in printed English${firstYear ? `, which takes hold around ${firstYear}` : ''}${firstYear && peakYear && peakYear !== firstYear ? ` and peaks around ${peakYear}` : ''}. ${gapNote(coined, firstYear)} Source: <a href="${escapeHtml(g.source)}">Google Books Ngrams</a>.</figcaption>
        </figure>`;
}

/**
 * How the namesake's name is said, in a real recording of it.
 *
 * Gated on the law's `namesakeKind` being `person`. Some namesakes are a
 * factory, a casino, a gospel, a character in a novel, or — for Muphry's Law —
 * a misspelling, and offering to pronounce one of those is nonsense; the
 * harvester had matched a recording of "Murphy" to the phrase "A misspelling of
 * Murphy". This was briefly gated on the string starting with an article, which
 * worked for the ten cases I had looked at and would have failed the moment a
 * non-person turned up without one. Absence of the field means "not
 * established", so it also withholds the button — the honest default.
 */
export function pronunciation(personFact, person, { base = '/', namesakeKind } = {}) {
  const a = personFact && personFact.audio;
  if (!a) return '';
  if (namesakeKind !== 'person') return '';
  // The file on disk is named for the person, not stored on the record — the
  // harvester writes assets/audio/<personSlug>.<ext>. Reading a `slug` field
  // that was never written produced `/assets/audio/.ogg` on every page.
  const src = `${base}assets/audio/${escapeHtml(personSlug(person))}${escapeHtml(a.ext || '.ogg')}`;
  return `        <div class="pronounce">
          <button class="pron-btn" type="button" data-audio="${src}" aria-label="Hear ${escapeHtml(person)} pronounced">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>
            <span>Say it</span>
          </button>
          <span class="pron-credit">${escapeHtml(a.artist || 'Unknown')} · ${escapeHtml(a.licence || '')}${a.source ? ` · <a href="${escapeHtml(a.source)}">source</a>` : ''}</span>
        </div>`;
}

/** What the idea is called where it isn't called this. */
/**
 * The same recorded names as `otherNames`, punctuated as a sentence.
 *
 * The rendered list is a label span butted against a name span, which is right
 * on screen and unreadable once the tags come off — "Arabicقانون جودهارت
 * GermanGoodharts Gesetz". A structured answer needs the separators, and it must
 * come from this data rather than be written beside it.
 */
export function otherNamesText(fact) {
  const n = fact && fact.names;
  if (!n || !n.labels) return '';
  const rows = Object.entries(n.labels).filter(([, v]) => v);
  if (rows.length < 3) return '';
  return `${rows.map(([lang, v]) => `${LANG_NAME[lang] || lang}: ${v}`).join('; ')}. These are the names the idea already goes by, as recorded on Wikidata — not translations we made.`;
}

export function otherNames(fact, { base = '/' } = {}) {
  const n = fact && fact.names;
  if (!n || !n.labels) return '';
  const rows = Object.entries(n.labels)
    .filter(([, v]) => v)
    .map(([lang, v]) => `<li><span class="on-lang">${escapeHtml(LANG_NAME[lang] || lang)}</span><span class="on-name" lang="${escapeHtml(lang)}">${escapeHtml(v)}</span></li>`);
  if (rows.length < 3) return '';
  return `        <div class="othernames">
          <ul class="on-list">${rows.join('')}</ul>
          <p class="on-note">${rows.length} languages, as recorded on <a href="${escapeHtml(n.source)}">Wikidata</a>. These are names the idea already goes by, not translations we made. <a href="${base}names/">The whole index by language</a>.</p>
        </div>`;
}
