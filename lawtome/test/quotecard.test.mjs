import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { quoteCardSvg, renderPng, emWidth, CARD } from '../build/quotecard.mjs';
import { buildSite } from '../build/build.mjs';
// Corpus-relative: one page per law + home, one og card per law.
const LAW_COUNT = readdirSync('src/data/laws').filter((f) => f.endsWith('.json')).length;
const law = { name:"Goodhart's Law", statement:'When a measure becomes a target, it ceases to be a good measure.', no:'014' };
test('svg embeds statement + brand + index code', () => {
  const svg = quoteCardSvg(law);
  // Asserted word by word: the statement is wrapped into <tspan> lines, so any
  // phrase long enough to be interesting is liable to straddle a line break.
  // (It did — this assertion used to pin "measure becomes a target" and broke
  // the moment the wrapper started fitting text to the column width.)
  for (const w of ['measure', 'becomes', 'target', 'ceases']) {
    assert.match(svg, new RegExp(`<tspan[^>]*>[^<]*\\b${w}\\b`));
  }
  assert.match(svg, /THE LAW TOME/);
  assert.match(svg, /№ 014/);
});

test('no card can overflow its box, at either end of the corpus', () => {
  // Campbell's Law, at 229 characters, used to wrap to eight lines that struck
  // through the masthead above and the attribution below; a short statement sat
  // small in the middle of an empty card. The fitter is checked here against
  // every entry, because the failure was a class, not a case.
  const corpus = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));
  const { TOP, BOTTOM, PAD, PANEL_X, W } = CARD;
  const bad = [];
  for (const l of corpus) {
    const svg = quoteCardSvg(l, { origin: 'https://e.com', base: '/' });
    const size = Number(/font-family="Fraunces" font-size="(\d+)"/.exec(svg)[1]);
    const lines = [...svg.matchAll(/<tspan x="90"[^>]*>([^<]*)<\/tspan>/g)].map((m) => m[1]);
    const lineHeight = Math.round(size * 1.28);
    if (lines.length * lineHeight > BOTTOM - TOP) bad.push(`${l.slug}: ${lines.length} lines at ${size}px`);
    // …and the shortest statements must not be left tiny in a sea of card.
    if (l.statement.length < 45 && size < 60) bad.push(`${l.slug}: short statement set at only ${size}px`);
    // Text must never run under the schematic panel.
    // Measured with the fitter's own estimator, not a character count — the
    // difference between the two is precisely the bug this replaced.
    const colWidth = (/<rect x="690"/.test(svg) ? PANEL_X - 40 : W - PAD) - PAD;
    for (const ln of lines) {
      // Decode first: the SVG holds &quot; where the reader sees one glyph, and
      // measuring the entity would flag a line the fitter sized correctly.
      const glyphs = ln.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      if (emWidth(glyphs) * size > colWidth + 1) bad.push(`${l.slug}: "${glyphs}" overruns the column`);
    }
  }
  assert.deepEqual(bad.slice(0, 5), [], `${bad.length} cards break their layout`);
});

test('the width estimator knows a narrow string from a wide one', () => {
  assert.ok(emWidth('iiiiii') < emWidth('mmmmmm'), 'i and m measured the same');
  assert.ok(emWidth('MMMMMM') > emWidth('mmmmmm') * 0.6);
  assert.ok(emWidth('      ') < emWidth('oooooo'), 'spaces measured as wide as letters');
  assert.equal(emWidth(''), 0);
});

test('the card carries the reliability mark, so a shared quote keeps its caveat', () => {
  assert.match(quoteCardSvg({ ...law, reliability: 'Contested' }), />Contested</);
  assert.match(quoteCardSvg({ ...law, provenance: 'coined', reliability: 'Heuristic' }), />Coined</);
});
test('the exact TTFs resvg loads exist (guards the silent WOFF2 fallback)', () => {
  assert.ok(existsSync('src/assets/fonts/Fraunces.ttf'), 'Fraunces.ttf missing — resvg cannot decode woff2');
  assert.ok(existsSync('src/assets/fonts/SpaceMono.ttf'), 'SpaceMono.ttf missing — resvg cannot decode woff2');
});
test('renders a 1200x630 PNG (magic bytes)', () => {
  const png = renderPng(quoteCardSvg(law));
  assert.ok(png.length > 1000);
  assert.deepEqual([...png.subarray(0,4)], [0x89,0x50,0x4e,0x47]);
});

test('a statement containing & and < is XML-escaped (valid SVG, still renders)', () => {
  const spicy = { name: 'Ampersand & Angle <Law>', statement: 'Risk < reward & reward > risk when a < b.', no: '099' };
  const svg = quoteCardSvg(spicy);
  // No raw & or < survives inside the corpus text (they would break the XML).
  assert.match(svg, /&amp;/);
  assert.match(svg, /&lt;/);
  assert.doesNotMatch(svg, /reward & reward/); // the raw ampersand is gone
  // And resvg still parses it into a real PNG.
  const png = renderPng(svg);
  assert.deepEqual([...png.subarray(0,4)], [0x89,0x50,0x4e,0x47]);
});

test('the attribution name is XML-escaped (isolates the name path from the statement)', () => {
  // Statement is plain ASCII, so any &/< in the SVG must come from the name.
  const svg = quoteCardSvg({ name: 'A & B <C>', statement: 'plain statement here', no: '001' });
  assert.match(svg, /A &amp; B &lt;C&gt;/);      // name escaped in place
  assert.doesNotMatch(svg, /A & B <C>/);         // raw name gone
  const png = renderPng(svg);                     // whole SVG stays well-formed
  assert.deepEqual([...png.subarray(0,4)], [0x89,0x50,0x4e,0x47]);
});

test('a long statement wraps onto multiple lines (multiple tspans)', () => {
  const longLaw = { name: 'Verbose Law', no: '100',
    statement: 'Anything that can possibly go wrong will indeed eventually go wrong at the least convenient possible moment for everyone involved.' };
  const svg = quoteCardSvg(longLaw);
  const tspans = svg.match(/<tspan\b/g) || [];
  assert.ok(tspans.length > 2, `expected multiple wrapped lines, got ${tspans.length}`);
});

test('build emits og/<slug>.png per law as a valid PNG', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-og-'));
  const r = await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.equal(r.pages, LAW_COUNT + 1); // home + one page per law
  assert.equal(r.og, LAW_COUNT);         // one og card per law
  const png = await readFile(join(out, 'og/goodharts-law.png'));
  assert.deepEqual([...png.subarray(0,4)], [0x89,0x50,0x4e,0x47]);
  await rm(out, { recursive:true, force:true });
});
