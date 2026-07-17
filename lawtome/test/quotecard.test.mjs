import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { quoteCardSvg, renderPng } from '../build/quotecard.mjs';
import { buildSite } from '../build/build.mjs';
const law = { name:"Goodhart's Law", statement:'When a measure becomes a target, it ceases to be a good measure.', no:'014' };
test('svg embeds statement + brand + index code', () => {
  const svg = quoteCardSvg(law);
  assert.match(svg, /measure becomes a target/);
  assert.match(svg, /THE LAW TOME/);
  assert.match(svg, /№ 014/);
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
  assert.equal(r.pages, 12); // unchanged: home + 11 law pages
  assert.equal(r.og, 11);
  const png = await readFile(join(out, 'og/goodharts-law.png'));
  assert.deepEqual([...png.subarray(0,4)], [0x89,0x50,0x4e,0x47]);
  await rm(out, { recursive:true, force:true });
});
