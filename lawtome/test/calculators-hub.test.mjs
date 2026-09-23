/* /calculators/ — the entries that do something, collected.
 *
 * 187 pages compute, solve, simulate or demonstrate the thing they define, and
 * nothing on the site distinguished them from the other 929. Browse, the
 * timeline and the quotes index link every entry equally, so a reader who used
 * one calculator had no route to the other 186.
 *
 * The list is generated from the same specs the law pages read, so the tests
 * are mostly about it not being able to drift from them.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { widgetSlugs, widgetFor } from '../src/templates/widgets.mjs';
import { interactiveSlugs, interactiveFor } from '../src/templates/interactives.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, 'dist/calculators/index.html'), 'utf8');
const expected = new Set([
  ...widgetSlugs().filter(widgetFor),
  ...interactiveSlugs().filter(interactiveFor),
]);
const listed = [...html.matchAll(/class="cx-i" href="[^"]*?\/laws\/([a-z0-9-]+)\//g)].map((m) => m[1]);

test('every interactive entry is listed, exactly once', () => {
  assert.equal(listed.length, expected.size, `listed ${listed.length}, expected ${expected.size}`);
  assert.equal(new Set(listed).size, listed.length, 'an entry is listed twice');
  for (const slug of expected) {
    assert.ok(listed.includes(slug), `${slug}: interactive but missing from the hub`);
  }
});

test('nothing without an interaction is listed', () => {
  for (const slug of listed) {
    assert.ok(expected.has(slug), `${slug}: on the hub without an interaction`);
  }
});

test('the counts in the copy are the real counts', () => {
  // A hub that states a number is a hub that can state a wrong one.
  const total = html.match(/(\d[\d,]*) interactive entries/);
  assert.ok(total, 'the page does not state its own size');
  assert.equal(Number(total[1].replace(/,/g, '')), expected.size);
  const calcs = widgetSlugs().filter(widgetFor).length;
  assert.match(html, new RegExp(`Calculators <span class="cx-n">${calcs.toLocaleString('en-US')}`),
    'the calculator count in the heading is stale');
});

test('every group heading matches the group beneath it', () => {
  const heads = [...html.matchAll(/<h2 class="cx-h2">([^<]*)<span class="cx-n">([\d,]+)</g)];
  assert.ok(heads.length >= 4, 'the hub is not grouped');
  let sum = 0;
  for (const [, , n] of heads) sum += Number(n.replace(/,/g, ''));
  assert.equal(sum, expected.size, 'the group counts do not add up to the whole');
});

test('the hub publishes its list and is reachable', () => {
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1])).flat();
  const page = ld.find((x) => x['@type'] === 'CollectionPage');
  assert.ok(page && page.mainEntity['@type'] === 'ItemList', 'no ItemList');
  assert.equal(page.mainEntity.numberOfItems, expected.size);
  const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  assert.match(sitemap, /\/calculators\/<\/loc>/, 'not in the sitemap');
  // And linked from somewhere, or it is an orphan nobody finds.
  const browse = fs.readFileSync(path.join(root, 'dist/browse/index.html'), 'utf8');
  assert.match(browse, /href="[^"]*\/calculators\//, 'nothing links to the hub');
});

test('a formula is shown wherever the entry has one', () => {
  const withIdentity = [...expected].filter((s) => {
    const spec = widgetFor(s) || interactiveFor(s);
    return spec && spec.identity;
  });
  const shown = (html.match(/class="cx-eq"/g) || []).length;
  assert.equal(shown, withIdentity.length,
    `${shown} formulas shown against ${withIdentity.length} entries that have one`);
});
