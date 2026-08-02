// /print/ — the whole index as one document, typeset for paper.
//
// A website is a thing you visit. A book is a thing you own, lend and cite, and
// this corpus has always been shaped like one: 1,101 numbered entries, a
// controlled vocabulary, an eponym index, a bibliography. What was missing was
// the artefact.
//
// So: a single self-contained HTML document with print CSS — running heads,
// page breaks that never orphan an entry, a table of contents, an A–Z index of
// names and aliases, and the credits the licences require. Print it to PDF from
// any browser, or run `npm run pdf`, which drives the same page through
// headless Chromium.
//
// It is deliberately NOT the website with a print stylesheet bolted on. The
// web page's job is to answer one question fast; the book's job is to be read
// in order, so this uses a different type scale, drops every navigational
// affordance, and prints the URL of each entry so a photocopy still points home.

import { escapeHtml } from './partials.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

/**
 * Print CSS, inlined — the file has to survive being saved and mailed around
 * with no server behind it.
 *
 * `@page` gives the paper its margins and a running foot; `break-inside:avoid`
 * on an entry is the rule that matters most, because an entry split across a
 * page turn is the one thing that makes a generated book look generated.
 */
const PRINT_CSS = `
@page { size: A4; margin: 20mm 18mm 22mm; }
@page :first { margin-top: 60mm; }
:root{ --ink:#141310; --soft:#4a473f; --faint:#77736a; --rule:#cfc9bc; }
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;background:#fff;color:var(--ink);
  font:10.5pt/1.5 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;
  hyphens:auto}
h1,h2,h3{font-weight:600;margin:0}
a{color:inherit;text-decoration:none}
.sheet{max-width:170mm;margin:0 auto;padding:16mm 10mm}
@media print{ .sheet{max-width:none;margin:0;padding:0} .screen-only{display:none} }

/* — title page — */
.tp{text-align:center;break-after:page}
.tp h1{font-size:34pt;line-height:1.1;letter-spacing:-.01em;margin:0 0 6mm}
.tp .sub{font-size:12pt;color:var(--soft);font-style:italic}
.tp .rule{width:40mm;height:1px;background:var(--rule);margin:10mm auto}
.tp .meta{font-size:9pt;color:var(--faint);line-height:1.9}

/* — front matter — */
.fm{break-after:page}
.fm h2{font-size:15pt;margin:0 0 4mm;padding-bottom:2mm;border-bottom:1px solid var(--rule)}
.fm p{margin:0 0 3mm;color:var(--soft);font-size:10pt}
.toc{column-count:2;column-gap:10mm;font-size:9.5pt;margin-top:4mm}
.toc div{break-inside:avoid;display:flex;justify-content:space-between;gap:4mm;padding:.6mm 0;color:var(--soft)}
.toc b{font-weight:600;color:var(--ink)}

/* — the entries — */
.field{break-before:page}
.field-h{font-size:16pt;margin:0 0 1mm}
.field-n{font-size:8.5pt;color:var(--faint);letter-spacing:.08em;text-transform:uppercase;
  margin:0 0 6mm;padding-bottom:2mm;border-bottom:1px solid var(--rule)}
.e{break-inside:avoid;margin:0 0 6mm;padding-bottom:5mm;border-bottom:1px dotted var(--rule)}
.e-h{display:flex;align-items:baseline;gap:3mm;margin-bottom:1.5mm}
.e-no{font-size:8pt;color:var(--faint);font-variant-numeric:tabular-nums;min-width:11mm}
.e-n{font-size:12.5pt}
.e-t{font-size:7.5pt;letter-spacing:.07em;text-transform:uppercase;color:var(--faint);margin-left:auto}
.e-s{font-style:italic;margin:0 0 1.5mm;color:var(--ink)}
.e-m{margin:0 0 1.5mm;color:var(--soft)}
.e-f{font-size:8pt;color:var(--faint)}
.e-f span+span::before{content:" · "}

/* — back matter — */
.idx{break-before:page;column-count:3;column-gap:8mm;font-size:8.5pt;line-height:1.45}
.idx h2{column-span:all;font-size:15pt;margin:0 0 4mm;padding-bottom:2mm;border-bottom:1px solid var(--rule)}
.idx .l{break-inside:avoid;color:var(--soft)}
.idx .l b{color:var(--ink);font-weight:600}
.colo{break-before:page;font-size:9pt;color:var(--soft)}
.colo h2{font-size:15pt;margin:0 0 4mm;padding-bottom:2mm;border-bottom:1px solid var(--rule);color:var(--ink)}
.colo p{margin:0 0 3mm}
`.trim();

/**
 * @param {object[]} laws the corpus, in № order
 * @param {object} o
 * @param {object} o.categories controlled vocabulary
 * @param {object} o.bib the bibliography summary (build/surfaces.mjs)
 */
export function printPage(laws = [], {
  base = '/', origin = '', categories = {}, buildDate = '', bib = null,
} = {}) {
  const rows = Array.isArray(laws) ? laws : [];
  const abs = `${origin}${base}`;

  // Grouped by field, fields in descending size — the book reads as a tour of
  // the disciplines, biggest first, rather than as a thousand-item alphabet.
  const byField = new Map();
  for (const l of rows) {
    const k = l.category || 'other';
    if (!byField.has(k)) byField.set(k, []);
    byField.get(k).push(l);
  }
  const fields = [...byField.entries()]
    .sort((a, b) => b[1].length - a[1].length || String(a[0]).localeCompare(String(b[0])));
  for (const [, list] of fields) list.sort((a, b) => (Number(a.no) || 0) - (Number(b.no) || 0));

  const years = rows.map((l) => Number(l.coinedYear)).filter((y) => Number.isFinite(y) && y >= 1);
  const named = rows.filter((l) => l.namedAfter).length;

  const entry = (l) => {
    const foot = [
      l.coinedYear ? `Coined ${escapeHtml(String(l.coinedYear))}` : '',
      l.namedAfter ? `Named after ${escapeHtml(l.namedAfter)}` : '',
      `${escapeHtml(abs)}laws/${escapeHtml(l.slug)}/`,
    ].filter(Boolean).map((x) => `<span>${x}</span>`).join('');
    return `      <article class="e" id="p-${escapeHtml(l.slug)}">
        <div class="e-h"><span class="e-no">${escapeHtml(String(l.no ?? ''))}</span><h3 class="e-n">${escapeHtml(l.name)}</h3><span class="e-t">${escapeHtml(l.reliability || '')}</span></div>
        ${l.statement ? `<p class="e-s">“${escapeHtml(l.statement)}”</p>` : ''}
        ${l.meaning ? `<p class="e-m">${escapeHtml(l.meaning)}</p>` : ''}
        <p class="e-f">${foot}</p>
      </article>`;
  };

  const body = fields.map(([key, list]) => `    <section class="field">
      <h2 class="field-h">${escapeHtml(categories[key] || key)}</h2>
      <p class="field-n">${num(list.length)} ${list.length === 1 ? 'entry' : 'entries'}</p>
${list.map(entry).join('\n')}
    </section>`).join('\n');

  const toc = fields.map(([key, list]) =>
    `      <div><b>${escapeHtml(categories[key] || key)}</b><span>${num(list.length)}</span></div>`).join('\n');

  // A–Z of every name and alias, so the book can be used the way a reference
  // book is used: from the back.
  const idxRows = [];
  for (const l of rows) {
    idxRows.push([l.name, l]);
    for (const a of (Array.isArray(l.aliases) ? l.aliases : [])) if (a) idxRows.push([a, l]);
  }
  idxRows.sort((a, b) => String(a[0]).replace(/^(the|a|an)\s+/i, '')
    .localeCompare(String(b[0]).replace(/^(the|a|an)\s+/i, ''), 'en'));
  const index = idxRows.map(([label, l]) => {
    const alias = label !== l.name;
    return `      <div class="l">${alias ? `${escapeHtml(label)} — see <b>${escapeHtml(l.name)}</b>` : `<b>${escapeHtml(label)}</b>`} <span>${escapeHtml(String(l.no ?? ''))}</span></div>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>The Law Tome — the complete index, for printing</title>
<link rel="canonical" href="${escapeHtml(abs)}print/">
<style>${PRINT_CSS}</style>
</head><body>
<div class="sheet">

  <section class="tp">
    <h1>The Law Tome</h1>
    <p class="sub">A defined, sourced index of ${num(rows.length)} named laws, principles and effects</p>
    <div class="rule"></div>
    <p class="meta">
      ${years.length ? `Spanning ${Math.min(...years)}–${Math.max(...years)}` : ''}<br>
      ${num(named)} named after somebody · ${fields.length} fields<br>
      ${buildDate ? `This printing: ${escapeHtml(buildDate)}` : ''}<br>
      ${escapeHtml(abs)}
    </p>
  </section>

  <section class="fm">
    <h2>About this printing</h2>
    <p>This is the complete index as one document. Each entry carries its number, its name, the statement in the form it is usually quoted, one paragraph of plain-English meaning, the year the name was coined where that is known, the person it is named after, and the address of its full entry — which holds the mechanism, the worked examples, the limits, the common misreadings, the sources, and everything else that would not fit on paper.</p>
    <p>Entries are grouped by field, largest field first, and numbered in the order the index was built rather than alphabetically. The index at the back lists every name <em>and every alias</em>, so an idea you know by its other name is still findable.</p>
    <p>Nothing here was written from memory. Every entry is sourced${bib ? `; the index as a whole cites ${num(bib.sources)} sources across ${num(bib.domains.length)} domains` : ''}, and the reliability mark against each name states plainly whether it rests on measurement, on a rule of thumb, on folklore, or on a dispute.</p>
    <h2 style="margin-top:8mm">Contents</h2>
    <div class="toc">
${toc}
    </div>
  </section>

${body}

  <section class="idx">
    <h2>Index of names and aliases</h2>
${index}
  </section>

  <section class="colo">
    <h2>Colophon</h2>
    <p><b>The Law Tome</b> — ${escapeHtml(abs)}</p>
    <p>Text licensed <b>CC BY 4.0</b>. You may copy, print, quote and redistribute this document, including commercially, provided the attribution stays with it.</p>
    <p>Reliability marks: <b>Empirical</b>, rests on studies or measurement · <b>Heuristic</b>, a dependable rule of thumb with no proof behind it · <b>Folk-adage</b>, a saying rather than a finding · <b>Contested</b>, the evidence is genuinely disputed.</p>
    <p>Set in the reader's serif. Generated from the same corpus as the website, on ${escapeHtml(buildDate || 'the build date')}; where the two differ, the website is newer.</p>
  </section>

</div>
</body></html>
`;
}
