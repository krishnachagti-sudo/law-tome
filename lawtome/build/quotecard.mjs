// Task 12 — Open Graph quote-cards, 1200×630 PNGs rendered from an SVG with the
// site's actual fonts EMBEDDED. resvg cannot fetch remote fonts and cannot decode
// WOFF2, so the on-disk TTFs (Fraunces + Space Mono) must be handed to it
// explicitly; loadSystemFonts:false makes a missing/mis-named face fail loudly
// rather than silently substituting a system serif.
//
// resvg also does NOT auto-wrap text: the statement is wrapped into lines here and
// emitted as one <text>/<tspan> block. Every corpus string is XML-escaped before
// interpolation so an `&`, `<`, or `>` in a law can't break the SVG document.
import { Resvg } from '@resvg/resvg-js';
import { escapeHtml } from '../src/templates/partials.mjs';
import { schematicForLaw, schematicOgSvg, SCHEMATIC_OG_STYLE } from '../src/templates/schematics.mjs';
import { scoreVerdict } from './quiz.mjs';

// Midnight palette (same hues as the site's dark-first theme).
const BG = '#14161c';   // charcoal-ink field
const INK = '#f0ece2';  // off-white text
const GOLD = '#e0a43f'; // warm amber accent

const W = 1200, H = 630;

// ---- fitting the statement to the card --------------------------------------
//
// The old layout guessed: wrap at a fixed character count, then pick one of
// three font sizes from a line count. It broke in both directions. Campbell's
// Law, at 229 characters, wrapped to eight lines that struck straight through
// the masthead at the top and the attribution at the bottom; and where an entry
// carried a schematic, a 24-character budget still ran the text under the panel,
// because character COUNT is not width — "William" and "illiili" are the same
// count and nothing like the same size.
//
// This measures instead. Each candidate size is wrapped to the real pixel width
// of the text column and kept only if the resulting block also fits the column's
// height; the first size that fits wins. Nothing can overflow, because overflow
// is the condition being tested for.

/**
 * Approximate advance width of a string in Fraunces, in em.
 *
 * Not a font metric — resvg gives us no measurement API and shelling out to one
 * for 1,116 cards would dominate the build. It is a per-character table good to
 * a few percent for Latin text, which is all the fitter needs: it is used to
 * decide between 40px and 46px, not to typeset.
 *
 * Deliberately errs wide (the default for an unlisted character is generous) so
 * a mis-estimate leaves a line short rather than letting it overrun.
 */
export const CARD = { W: 1200, H: 630, PAD: 90, TOP: 196, BOTTOM: 630 - 150, PANEL_X: 690 };

const NARROW = "ijlt.,;:'!|()[]/\\ ";
const WIDE = 'mwMW@%';
const CAPS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function emWidth(str) {
  let w = 0;
  for (const ch of String(str)) {
    if (ch === ' ') w += 0.26;
    else if (NARROW.includes(ch)) w += 0.30;
    else if (WIDE.includes(ch)) w += 0.86;
    else if (CAPS.includes(ch)) w += 0.66;
    else if (ch >= '0' && ch <= '9') w += 0.55;
    else w += 0.52;
  }
  return w;
}

/**
 * Greedy word-wrap to a PIXEL width at a given font size.
 * A single word too long for the column is left over-long rather than broken:
 * there is no such word in this corpus, and hyphenating one would look worse
 * than the rare overhang it prevents.
 */
function wrapToWidth(text, fontSize, maxPx) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && emWidth(candidate) * fontSize > maxPx) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * The largest size at which the statement fits the column, and its wrapping.
 *
 * Sizes descend from display-large to a floor. The floor is reached only by the
 * handful of statements over ~200 characters, and at that point the card is a
 * paragraph rather than a pull-quote — which is the honest rendering of an
 * entry whose statement really is a paragraph.
 */
// Top of the ramp is display-scale: a six-word statement should fill the card,
// not sit small in the middle of it.
/**
 * Space Mono is monospaced at a 0.6em advance, so a line's width is exactly
 * known. Step the size down until the string fits — the longest entry name in
 * the corpus clears 28px with little to spare, and the next long one added
 * should shrink rather than run out of the frame.
 */
function monoFit(text, maxPx, sizes) {
  const len = String(text).length;
  for (const size of sizes) if (len * size * 0.6 <= maxPx) return size;
  return sizes[sizes.length - 1];
}

const SIZES = [84, 76, 68, 62, 56, 50, 45, 40, 36, 32, 29, 26];
function fitStatement(text, { maxPx, maxHeight }) {
  for (const size of SIZES) {
    const lines = wrapToWidth(text, size, maxPx);
    const lineHeight = Math.round(size * 1.28);
    if (lines.length * lineHeight <= maxHeight) return { size, lines, lineHeight };
  }
  const size = SIZES[SIZES.length - 1];
  const lineHeight = Math.round(size * 1.28);
  // Still too tall at the floor: clip on a word boundary and mark the cut, so
  // the card is short rather than broken. No entry currently reaches this.
  const lines = wrapToWidth(text, size, maxPx).slice(0, Math.floor(maxHeight / lineHeight));
  if (lines.length) lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[\s,;:]+$/, '')}…`;
  return { size, lines, lineHeight };
}

/**
 * Build a 1200×630 quote-card SVG for a law. Codex-dark; statement in Fraunces,
 * metadata (index code + attribution + URL) in Space Mono, faint seal watermark.
 * @param {{name:string, statement:string, no:string}} law
 * @returns {string} SVG document
 */
export function quoteCardSvg(law, { origin = 'https://conyso.com', base = '/lawtome/' } = {}) {
  const name = escapeHtml(law.name ?? '');
  const no = escapeHtml(String(law.no ?? ''));
  const tier = escapeHtml(law.provenance === 'coined' ? 'Coined' : (law.reliability || ''));
  // Display host+path, derived from the build's origin+base so the card never
  // drifts from the real domain (no hardcoded string). e.g. "conyso.com/lawtome".
  const displayUrl = escapeHtml(`${origin}${base}`.replace(/^https?:\/\//, '').replace(/\/+$/, ''));

  // The layout, stated once as numbers so the text column and the panel cannot
  // disagree about where the boundary is. The column runs from the left margin
  // to either the panel's left edge or the right margin, and vertically between
  // the masthead and the attribution — nothing is allowed outside it.
  const PAD = 90;
  const TOP = 196;              // clears "THE LAW TOME" + the index number
  const BOTTOM = H - 150;       // clears the name + URL at the foot
  const shapeKey = schematicForLaw(law);
  const PANEL_X = 690;
  const colWidth = (shapeKey ? PANEL_X - 40 : W - PAD) - PAD;
  const { size, lines, lineHeight } = fitStatement(law.statement ?? '', {
    maxPx: colWidth,
    maxHeight: BOTTOM - TOP,
  });

  // Vertically centre the block inside the column rather than on the canvas: a
  // one-line statement centred on the canvas sits below the masthead's optical
  // centre, and an eight-line one used to start above it entirely.
  const blockH = lines.length * lineHeight;
  const startY = Math.round(TOP + (BOTTOM - TOP - blockH) / 2) + Math.round(size * 0.78);
  const tspans = lines
    .map((ln, i) => `<tspan x="${PAD}" ${i === 0 ? `y="${startY}"` : `dy="${lineHeight}"`}>${escapeHtml(ln)}</tspan>`)
    .join('');

  const shape = shapeKey ? schematicOgSvg(shapeKey, { x: PANEL_X + 28, y: 232, w: 396 }) : '';

  // The #seal vector (from partials.sprite), placed faint as a watermark and
  // sized to sit INSIDE the rule. It used to be scaled and offset so that its
  // right third fell outside the border, which read as a rendering fault rather
  // than as a watermark.
  const seal = `
    <g transform="translate(966,392) scale(1.9)" opacity="0.08" fill="none" stroke="${GOLD}">
      <circle cx="50" cy="50" r="47.2" stroke-width="1.4"/>
      <circle cx="50" cy="50" r="39.5" stroke-width="0.6" stroke-dasharray="0.4 3" stroke-linecap="round"/>
      <g stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <path d="M50,39 v23"/>
        <path d="M50,39 C43,35 34,35 27,38 L27,58 C34,55 43,55 50,59 Z"/>
        <path d="M50,39 C57,35 66,35 73,38 L73,58 C66,55 57,55 50,59 Z"/>
      </g>
    </g>`;

  // With a schematic, the right column is the diagram; otherwise it is the seal.
  const rightColumn = shape
    ? `${SCHEMATIC_OG_STYLE}
    <rect x="${PANEL_X}" y="200" width="452" height="260" rx="16" fill="#191c24" stroke="#2b303b" stroke-width="1.5"/>
    ${shape}`
    : seal;

  // The reliability mark, on the card. It is the one thing this index says that
  // a shared screenshot of a quotation otherwise loses entirely — and a Contested
  // claim travelling as a bare aphorism is exactly the failure the scale exists
  // to prevent.
  const nameSize = monoFit(law.name ?? '', W - PAD * 2, [28, 25, 22, 20, 18]);

  const chip = tier
    ? `<g transform="translate(${PAD},${H - 128})">
      <rect x="0" y="-20" width="${Math.round(tier.length * 17 * 0.6 + (tier.length - 1) * 1 + 30)}" height="30" rx="15"
            fill="none" stroke="${GOLD}" stroke-width="1.2" opacity="0.55"/>
      <text x="15" y="1" font-family="Space Mono" font-size="17" letter-spacing="1" fill="${GOLD}" opacity="0.9">${tier}</text>
    </g>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.5"/>
  ${rightColumn}
  <text x="${PAD}" y="90" font-family="Space Mono" font-size="26" letter-spacing="6" fill="${GOLD}">THE LAW TOME</text>
  <text x="${PAD}" y="130" font-family="Space Mono" font-size="24" letter-spacing="2" fill="${INK}" opacity="0.7">№ ${no}</text>
  <text font-family="Fraunces" font-size="${size}" fill="${INK}">${tspans}</text>
  ${chip}
  <text x="${PAD}" y="${H - 78}" font-family="Space Mono" font-size="${nameSize}" fill="${GOLD}">${name}</text>
  <text x="${PAD}" y="${H - 44}" font-family="Space Mono" font-size="20" fill="${INK}" opacity="0.6">${displayUrl}</text>
</svg>`;
}

/**
 * The site's own card, for every page that is not a single entry.
 *
 * 526 indexable pages — every hub, field, era, country and comparison — had no
 * og:image at all, so a share of any of them unfurled as bare text and the
 * Twitter card degraded from a large image to a summary. That is a lot of
 * click-through to leave on the table on a site that just grew a share button
 * on every page.
 *
 * Deliberately generic: it says what the index is and how big it is, and it
 * does not pretend to be about whichever page was shared. A card claiming to
 * depict a page it was not built from would be the image equivalent of a stock
 * photo, and this project does not use those either.
 *
 * @param {object} o
 * @param {number} o.count published entries, so the card ages with the corpus
 */
export function siteCardSvg({ origin = 'https://conyso.com', base = '/lawtome/', count = 0 } = {}) {
  const displayUrl = escapeHtml(`${origin}${base}`.replace(/^https?:\/\//, '').replace(/\/+$/, ''));
  const n = escapeHtml(Number(count).toLocaleString('en-US'));
  const seal = `
    <g transform="translate(830,150) scale(4.6)" opacity="0.07" fill="none" stroke="${GOLD}">
      <circle cx="50" cy="50" r="47.2" stroke-width="1.4"/>
      <circle cx="50" cy="50" r="39.5" stroke-width="0.6" stroke-dasharray="0.4 3" stroke-linecap="round"/>
      <g stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
        <path d="M50,39 v23"/>
        <path d="M50,39 C43,35 34,35 27,38 L27,58 C34,55 43,55 50,59 Z"/>
        <path d="M50,39 C57,35 66,35 73,38 L73,58 C66,55 57,55 50,59 Z"/>
      </g>
    </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.5"/>
  ${seal}
  <text x="90" y="96" font-family="Space Mono" font-size="26" letter-spacing="6" fill="${GOLD}">THE LAW TOME</text>
  <text x="90" y="240" font-family="Fraunces" font-size="76" fill="${INK}">${n} named laws,</text>
  <text x="90" y="326" font-family="Fraunces" font-size="76" fill="${INK}">principles and effects</text>
  <text x="90" y="404" font-family="Fraunces" font-size="40" fill="${INK}" opacity="0.72">Defined, sourced, and rated for</text>
  <text x="90" y="456" font-family="Fraunces" font-size="40" fill="${INK}" opacity="0.72">how well established each one is.</text>
  <text x="90" y="${H - 50}" font-family="Space Mono" font-size="22" fill="${GOLD}">${displayUrl}</text>
</svg>`;
}

/**
 * The card a finished quiz round unfurls as.
 *
 * A shared score is a link somebody else clicks, and a link with no picture is
 * a link nobody clicks. Eleven of these are rendered at build time — one per
 * possible score — and the score page for each names it as its og:image. The
 * card shows the score and the grid, which is exactly what the shared text
 * already says, so the picture cannot disagree with the words.
 *
 * The grid is drawn as squares rather than set as emoji: resvg has no colour
 * font, and a row of empty boxes would be worse than no grid at all.
 *
 * @param {object} o
 * @param {number} o.score right answers
 * @param {number} [o.total=10]
 */
export function scoreCardSvg({ score = 0, total = 10, origin = 'https://conyso.com', base = '/lawtome/' } = {}) {
  const s = Math.max(0, Math.min(total, Math.round(Number(score) || 0)));
  const displayUrl = escapeHtml(`${origin}${base}quiz/`.replace(/^https?:\/\//, '').replace(/\/+$/, ''));
  const verdict = escapeHtml(scoreVerdict(s, total));

  // One square per question: the right ones first, because the card is about a
  // score and not about which question anybody missed — the order of a real
  // round is the reader's to share in the text, not ours to invent in a picture.
  const BOX = 62, GAP = 14;
  const gridW = total * BOX + (total - 1) * GAP;
  const x0 = Math.round((W - gridW) / 2);
  const boxes = Array.from({ length: total }, (_, i) => {
    const on = i < s;
    return `<rect x="${x0 + i * (BOX + GAP)}" y="392" width="${BOX}" height="${BOX}" rx="8" `
      + (on ? `fill="${GOLD}"/>` : `fill="none" stroke="${INK}" stroke-width="2" opacity="0.28"/>`);
  }).join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.5"/>
  <text x="${W / 2}" y="118" text-anchor="middle" font-family="Space Mono" font-size="24" letter-spacing="6" fill="${GOLD}">THE LAW TOME QUIZ</text>
  <text x="${W / 2}" y="272" text-anchor="middle" font-family="Fraunces" font-size="150" fill="${INK}">${s} / ${total}</text>
  <text x="${W / 2}" y="336" text-anchor="middle" font-family="Fraunces" font-size="42" fill="${INK}" opacity="0.74">${verdict}</text>
  ${boxes}
  <text x="${W / 2}" y="${H - 58}" text-anchor="middle" font-family="Space Mono" font-size="22" fill="${GOLD}">${displayUrl}</text>
</svg>`;
}

/**
 * The card for /how-solid/ — the site's one finding, as a picture.
 *
 * A launch artifact whose whole job is to be shared cannot unfurl as the
 * generic site card. This is the same chart the page draws, at the same honest
 * 0-100% axis: a truncated axis would make the finding look bigger than it is,
 * and a card that oversells the page it links to is a bait-and-switch even when
 * every number on it is true.
 *
 * @param {{label:string, share:number}[]} rows the bands, best-known first
 */
export function findingCardSvg({ rows = [], origin = 'https://conyso.com', base = '/lawtome/' } = {}) {
  const displayUrl = escapeHtml(`${origin}${base}how-solid/`.replace(/^https?:\/\//, '').replace(/\/+$/, ''));
  const top = rows[0] || { share: 0 };
  const pct = (x) => `${Math.round(x * 100)}%`;

  // The track is the full 0-100% axis; a fill is exactly its share of it.
  const X = 90, LABEL = 250, TRACK = 450, ROW = 56, Y0 = 300;
  const bars = rows.slice(0, 5).map((r, i) => {
    const y = Y0 + i * ROW;
    const fill = Math.max(2, Math.round(TRACK * Math.min(1, Math.max(0, r.share))));
    return `  <text x="${X}" y="${y + 15}" font-family="Space Mono" font-size="17" fill="${INK}" opacity="0.62">${escapeHtml(r.label)}</text>
  <rect x="${X + LABEL}" y="${y}" width="${TRACK}" height="22" rx="3" fill="${INK}" opacity="0.12"/>
  <rect x="${X + LABEL}" y="${y}" width="${fill}" height="22" rx="3" fill="${GOLD}"/>
  <text x="${X + LABEL + TRACK + 20}" y="${y + 18}" font-family="Fraunces" font-size="22" fill="${INK}">${pct(r.share)}</text>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.5"/>
  <text x="${X}" y="96" font-family="Space Mono" font-size="22" letter-spacing="6" fill="${GOLD}">THE LAW TOME</text>
  <text x="${X}" y="186" font-family="Fraunces" font-size="54" fill="${INK}">The better known a law is,</text>
  <text x="${X}" y="248" font-family="Fraunces" font-size="54" fill="${INK}">the less settled it turns out to be.</text>
${bars}
  <text x="${X}" y="${H - 48}" font-family="Space Mono" font-size="19" fill="${INK}" opacity="0.55">share NOT resting on measurement</text>
  <text x="${W - X}" y="${H - 48}" text-anchor="end" font-family="Space Mono" font-size="19" fill="${GOLD}">${displayUrl}</text>
</svg>`;
}

/**
 * Render an SVG string to a PNG Buffer. The TTFs are CWD-relative (the build runs
 * from lawtome/); loadSystemFonts:false guarantees a loud failure over a silent
 * system-serif fallback.
 * @param {string} svg
 * @returns {Buffer} PNG bytes
 */
export function renderPng(svg) {
  return new Resvg(svg, {
    font: {
      fontFiles: ['src/assets/fonts/Fraunces.ttf', 'src/assets/fonts/SpaceMono.ttf'],
      defaultFontFamily: 'Fraunces',
      loadSystemFonts: false,
    },
  })
    .render()
    .asPng();
}
