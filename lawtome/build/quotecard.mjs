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

// Codex-dark palette (same hues as the site's dark theme).
const BG = '#141109';   // near-black parchment
const INK = '#f1e7cf';  // cream text
const GOLD = '#d8a63f'; // gilt accents

const W = 1200, H = 630;

// Greedy word-wrap to a max characters-per-line budget. resvg has no auto-wrap,
// so the statement is split into lines here; each line becomes a <tspan>.
function wrapLines(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? line + ' ' + word : word;
    if (candidate.length > maxChars && line) {
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
 * Build a 1200×630 quote-card SVG for a law. Codex-dark; statement in Fraunces,
 * metadata (index code + attribution + URL) in Space Mono, faint seal watermark.
 * @param {{name:string, statement:string, no:string}} law
 * @returns {string} SVG document
 */
export function quoteCardSvg(law) {
  const name = escapeHtml(law.name ?? '');
  const no = escapeHtml(String(law.no ?? ''));

  // Wrap on the RAW statement (word/char budget), escape each resulting line so
  // an `&`/`<`/`>` mid-line still yields valid XML.
  const rawLines = wrapLines(law.statement ?? '', 34);
  // Scale the statement type down a touch if it runs long, so it stays in-frame.
  const fontSize = rawLines.length > 5 ? 46 : rawLines.length > 3 ? 54 : 62;
  const lineHeight = Math.round(fontSize * 1.25);
  const startY = Math.round(H / 2 - ((rawLines.length - 1) * lineHeight) / 2) - 10;
  const tspans = rawLines
    .map((ln, i) =>
      `<tspan x="90" ${i === 0 ? `y="${startY}"` : `dy="${lineHeight}"`}>${escapeHtml(ln)}</tspan>`)
    .join('');

  // The #seal vector (from partials.sprite), placed faint as a watermark.
  const seal = `
    <g transform="translate(880,300) scale(3.4)" opacity="0.06" fill="none" stroke="${GOLD}">
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
  <text x="90" y="90" font-family="Space Mono" font-size="26" letter-spacing="6" fill="${GOLD}">THE LAW TOME</text>
  <text x="90" y="130" font-family="Space Mono" font-size="24" letter-spacing="2" fill="${INK}" opacity="0.7">№ ${no}</text>
  <text font-family="Fraunces" font-size="${fontSize}" fill="${INK}">${tspans}</text>
  <text x="90" y="${H - 90}" font-family="Space Mono" font-size="30" fill="${GOLD}">${name}</text>
  <text x="90" y="${H - 50}" font-family="Space Mono" font-size="22" fill="${INK}" opacity="0.6">conyso.com/lawtome</text>
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
