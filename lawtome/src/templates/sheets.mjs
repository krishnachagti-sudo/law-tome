// /sheets/ — the index as something you can pin to a wall.
//
// Every other page here assumes a browser. This one assumes a printer, or a
// second monitor, or a phone held up in a meeting: one field, its best-known
// two dozen entries, each with the statement in the form it actually gets
// quoted and the rating that says how far to trust it. Nothing else — no
// navigation, no related links, no prose — because a reference sheet that needs
// scrolling is a web page wearing a costume.
//
// It is a real page, not a PDF: indexable, linkable, and legible on a phone.
// The print stylesheet strips the chrome so Ctrl-P produces the artefact
// directly, with no separate export step to fall out of date.
//
// The selection is the honest part. "The 24 best-known in this field" is a
// claim a reader can check against /best-known/; "the 24 most important" would
// be our taste with a number in front of it.

import {
  head, sprite, header, footer, escapeHtml, reliabilityClass, shareRow, RELIABILITY_NOTE,
} from './partials.mjs';
import { hubHead, hubNav, hubFaq, hubJsonLd } from './hub.mjs';
import { sheetPath, SHEET_SIZE } from '../../build/sheets.mjs';

const num = (n) => Number(n).toLocaleString('en-US');

/**
 * Print rules, scoped to the sheet.
 *
 * Two things matter and the rest is taste. `break-inside: avoid` on a row stops
 * an entry being split across a page turn, which is the single thing that makes
 * a printed page look generated. And the URL is printed under the title,
 * because a sheet on a wall is a dead end unless it says where it came from.
 */
const PRINT_CSS = `
@media print {
  /* The chrome is bare <header>/<footer> elements, not classed wrappers — the
     first version of this guessed at .site-header and silently printed the whole
     navigation. Selecting the elements is both correct and shorter. */
  header, footer, .hub-more, .hub-faq, .sk-others, .sh-print, .share,
  .crumb, .sk-note, .sh-b, .sk-share { display: none !important; }
  /* The framing prose is for a reader who arrived by link. On paper it is a
     sixth of the first page explaining a sheet the reader is already holding. */
  .hub-answer, .sec-lede, .hub-stats { display: none !important; }
  html, body { background: #fff !important; color: #000 !important; }
  .sk-row, .sk-head { break-inside: avoid; page-break-inside: avoid; }
  .sk-row { border-bottom: 1px solid #ccc !important; }
  .sk-name, .sk-say { color: #000 !important; }
  .sk-badge { border: 1px solid #666 !important; color: #000 !important; background: none !important; }
  .sk-foot { display: block !important; }
  /* The global print stylesheet appends "The Law Tome — a sourced index of
     named laws." after main. On a sheet that is a second credit under the one
     above it, and the one above it is better: it carries the URL and the
     licence, which is what a photocopy on a wall actually needs. */
  main::after { content: none !important; border: 0 !important; }
  @page { margin: 14mm; }
}`;

/** One entry: number, name, what it says, how far to trust it. */
function row(l, i, base) {
  return `      <a class="sk-row" href="${base}laws/${escapeHtml(l.slug)}/">
        <span class="sk-i">${String(i + 1).padStart(2, '0')}</span>
        <span class="sk-b">
          <span class="sk-name">${escapeHtml(l.name)}</span>
          <span class="sk-say">${escapeHtml(l.statement || '')}</span>
        </span>
        <span class="badge ${reliabilityClass(l.reliability)} sk-badge">${escapeHtml(l.reliability || '')}</span>
      </a>`;
}

/**
 * One field's sheet.
 * @param {object} sheet from build/sheets.mjs sheets()
 */
export function sheetPage(sheet, { base = '/', origin = '', count, siblings = [] } = {}) {
  const { title, laws, total, measured } = sheet;
  const path = sheetPath(sheet);
  const displayUrl = `${origin}${base}${path}`.replace(/^https?:\/\//, '').replace(/\/+$/, '');

  const answer = `The ${num(laws.length)} best-known named laws, principles and effects in ${title}, each with the statement it is usually quoted in and a rating for how far the evidence behind it goes. Ranked by how often the name appears in printed books, drawn from ${num(total)} ${title.toLowerCase()} entries in the index. Built to be printed: press Ctrl-P and the navigation drops away.`;

  const lede = `A reference you can pin above a desk gets consulted; a website you have to remember to visit does not. This is one field on one sheet — no prose, no navigation, just the names, what each one says, and how far it can be trusted. ${measured < laws.length ? `${num(laws.length - measured)} of these have no print-frequency measurement and are ordered after the ones that do. ` : ''}Every line links to the full sourced entry.`;

  const faq = hubFaq([
    {
      q: 'How were these chosen?',
      a: `By how often each name appears in the Google Books English corpus — an external count, not our judgement. ${num(total)} entries in this field are in the index; this sheet carries the ${num(laws.length)} whose names are printed most. <a href="${base}category/${escapeHtml(sheet.slug)}/">The full field</a> shows all of them, and <a href="${base}best-known/">the ranking</a> shows the exact phrase counted for each.`,
    },
    {
      q: 'What do the four ratings mean?',
      a: `They say what kind of support a claim has, not whether it is true. ${Object.entries(RELIABILITY_NOTE).map(([k, v]) => `<b>${escapeHtml(k)}</b> — ${escapeHtml(v)}`).join('; ')}. <a href="${base}reliability/">The scale in full</a>, and <a href="${base}how-solid/">what happens when you apply it to the whole index</a>.`,
    },
    {
      q: 'Can I print or reuse this?',
      a: `Yes. Press Ctrl-P (or Cmd-P) and the site chrome drops away, leaving the sheet with its URL on it. The corpus is published under <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a>, so you may print it, hand it round, put it in a deck or build on it — attribution is the only condition, and the URL printed at the foot of the sheet is enough.`,
    },
  ], { heading: 'About this sheet' });

  const others = siblings.filter((s) => s.slug !== sheet.slug);
  const nav = others.length
    ? `    <nav class="sk-others" aria-label="Other sheets">
      <h2 class="sk-others-h">Sheets for the other fields</h2>
      <div class="sk-others-row">
${others.map((s) => `        <a class="sk-other" href="${base}${sheetPath(s)}">${escapeHtml(s.title)}<span class="sk-other-n">${s.count}</span></a>`).join('\n')}
      </div>
    </nav>
`
    : '';

  const section = `<section class="sec">
  <div class="wrap">
${hubHead({
    title: `${title}: the ${num(laws.length)} best-known`,
    sub: 'one field, one sheet',
    answer,
    lede,
    base,
    crumbs: [['browse/', 'Browse'], ['sheets/', 'Cheat sheets']],
    stats: [
      [num(laws.length), 'on the sheet'],
      [num(total), `in ${title.toLowerCase()}`],
      ['CC BY 4.0', 'print and reuse it'],
    ],
  })}    <p class="sh-print"><button class="btn" type="button" data-print>Print this sheet</button> <span class="sk-note">Ctrl-P works too — the navigation drops away.</span></p>

    <div class="sk-list">
${laws.map((l, i) => row(l, i, base)).join('\n')}
    </div>
    <p class="sk-foot" hidden>${escapeHtml(displayUrl)} · ${escapeHtml(title)} · The Law Tome · CC BY 4.0</p>

    <div class="sk-share">
${shareRow({
    url: `${origin}${base}${path}`,
    title: `${title}: the ${num(laws.length)} best-known named laws`,
    text: answer.split('.')[0],
    label: `Share the ${title} sheet`,
  })}    </div>

${nav}${faq.html}${hubNav('sheets/', { base })}  </div>
</section>
`;

  const description = `The ${num(laws.length)} best-known named laws, principles and effects in ${title} on one printable sheet — each with its statement and a rating for how well established it is.`;

  return (
    head({
      title: `${title} Laws: A One-Page Cheat Sheet`,
      description,
      base,
      origin,
      path,
      jsonld: [
        ...hubJsonLd({
          name: `${title}: the ${num(laws.length)} best-known`,
          description,
          path,
          origin,
          base,
          crumbs: [['browse/', 'Browse'], ['sheets/', 'Cheat sheets']],
          items: laws.map((l) => ({ name: l.name, url: `${origin}${base}laws/${l.slug}/` })),
        }),
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
    sprite() +
    `<style>${PRINT_CSS}</style>` +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base, scripts: '<script>document.querySelectorAll("[data-print]").forEach(function(b){b.addEventListener("click",function(){window.print();});});</script>' })
  );
}

/** The hub: every sheet, with what is on it. */
export function sheetsHubPage(all = [], { base = '/', origin = '', count } = {}) {
  const totalOn = all.reduce((n, s) => n + s.count, 0);

  const answer = `${all.length} printable cheat sheets, one per field — ${num(totalOn)} named laws, principles and effects in all. Each sheet carries the ${SHEET_SIZE} best-known entries in its field with the statement each is usually quoted in and a rating for how far the evidence goes, sized to print on paper and licensed CC BY 4.0 so you can hand it round.`;

  const lede = `The index is ${count ? `${num(count)} entries` : 'a thousand entries'} deep, which is the right size for a reference and the wrong size for a wall. These are the short version: one field, two dozen entries, printable. Nothing on a sheet is written for the sheet — every line is the entry's own statement, and every line links back to the sourced page it came from.`;

  const faq = hubFaq([
    {
      q: 'Why only two dozen per field?',
      a: `Because a sheet that runs to eleven pages is not a sheet. The cut is the best-known entries in each field by printed frequency — an external count rather than our judgement — and each sheet says how many entries the field holds in total, with a link to all of them.`,
    },
    {
      q: 'Is there a PDF?',
      a: 'There is no separate PDF to go stale. Open a sheet and print it: the stylesheet drops the navigation and prints the URL at the foot, so a copy on a wall still says where it came from. For the whole index as one document, <a href="' + base + 'print/">the printable book</a> is the same idea at 1,116 entries.',
    },
    {
      q: 'Can I use these at work?',
      a: 'Yes, including commercially. The corpus is <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> — print them, put them in a deck, put them in a handbook. Attribution is the only condition and the URL on the sheet satisfies it.',
    },
  ], { heading: 'About the sheets' });

  const section = `<section class="sec">
  <div class="wrap">
${hubHead({
    title: 'Cheat sheets',
    sub: 'one field, one page, printable',
    answer,
    lede,
    base,
    crumbs: [['browse/', 'Browse']],
    stats: [[all.length, 'sheets'], [num(totalOn), 'entries on them'], ['CC BY 4.0', 'print and reuse']],
  })}    <div class="sk-cards">
${all.map((s) => `      <a class="sk-card" href="${base}${sheetPath(s)}">
        <span class="skc-t">${escapeHtml(s.title)}</span>
        <span class="skc-n">${s.count} of ${num(s.total)}</span>
        <span class="skc-l">${s.laws.slice(0, 3).map((l) => escapeHtml(l.name)).join(' · ')}…</span>
      </a>`).join('\n')}
    </div>
${faq.html}${hubNav('sheets/', { base })}  </div>
</section>
`;

  const description = `${all.length} printable one-page cheat sheets of named laws, principles and effects — one per field, each with statements and reliability ratings. Free and CC BY 4.0.`;

  return (
    head({
      title: 'Printable Cheat Sheets of Named Laws & Principles',
      description,
      base,
      origin,
      path: 'sheets/',
      jsonld: [
        ...hubJsonLd({
          name: 'Cheat sheets',
          description,
          path: 'sheets/',
          origin,
          base,
          items: all.map((s) => ({ name: s.title, url: `${origin}${base}${sheetPath(s)}` })),
        }),
        ...(faq.jsonld ? [faq.jsonld] : []),
      ],
    }) +
    sprite() +
    header({ base, active: 'browse', count }) +
    section +
    footer({ base })
  );
}
