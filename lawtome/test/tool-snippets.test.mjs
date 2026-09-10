/* Titles and descriptions that claim an interaction.
 *
 * Search Console says the snippet is the whole decision at positions four to
 * ten: the top three convert at 3.85% and four-to-ten at 0.48%, and 171
 * queries rank in the top ten with no clicks at all. So pages that gained a
 * calculator or a solver now say so in the slot the searcher reads.
 *
 * The risk that comes with that is claiming a tool a page does not have, which
 * would be a lie told at scale to 1,116 pages. Most of what follows guards
 * against exactly that.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { widgetSlugs, widgetFor } from '../src/templates/widgets.mjs';
import { interactiveSlugs, interactiveFor } from '../src/templates/interactives.mjs';
import { DESC_MAX } from '../src/templates/partials.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist/laws');
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function page(slug) {
  const f = path.join(dist, slug, 'index.html');
  if (!fs.existsSync(f)) return null;
  const h = fs.readFileSync(f, 'utf8');
  const t = h.match(/<title>(.*?)<\/title>/);
  const d = h.match(/<meta name="description" content="(.*?)"/);
  return { title: t ? unesc(t[1]) : '', desc: d ? unesc(d[1]) : '' };
}

const withWidget = new Set(widgetSlugs().filter((s) => widgetFor(s)));
const withIx = new Map(interactiveSlugs().map((s) => [s, interactiveFor(s).kind]));
const CLAUSE = /calculator|solver|worked cases|model of the mechanism|shown rather than described|short exercise/;
const TOOLWORD = /Calculator|Solver|Test Yourself|Run the Model|See It|Try It/;

const all = fs.existsSync(dist)
  ? fs.readdirSync(dist).filter((d) => fs.existsSync(path.join(dist, d, 'index.html')))
  : [];

test('the build is present, so these assertions mean something', () => {
  assert.ok(all.length > 1000, `only ${all.length} law pages found; run the build first`);
});

test('every page with a calculator says so in the title', () => {
  for (const slug of withWidget) {
    const p = page(slug);
    if (!p) continue;
    assert.match(p.title, /Calculator/, `${slug}: has a widget, title does not say so`);
  }
});

test('every interactive page names what it lets you do', () => {
  for (const [slug] of withIx) {
    const p = page(slug);
    if (!p) continue;
    assert.match(p.title, TOOLWORD, `${slug}: interactive, title says nothing`);
  }
});

/* The one that matters. A title claiming a calculator on a page without one is
 * a promise broken at the click, which costs more than the click was worth. */
test('no page claims a tool it does not have', () => {
  for (const slug of all) {
    if (withWidget.has(slug) || withIx.has(slug)) continue;
    const p = page(slug);
    assert.ok(!TOOLWORD.test(p.title),
      `${slug}: no interaction, but the title claims one: ${p.title}`);
    assert.ok(!CLAUSE.test(p.desc),
      `${slug}: no interaction, but the description claims one`);
  }
});

test('every interactive description keeps its clause inside the SERP window', () => {
  for (const slug of [...withWidget, ...withIx.keys()]) {
    const p = page(slug);
    if (!p) continue;
    assert.match(p.desc, CLAUSE, `${slug}: description lost the clause`);
    assert.ok(p.desc.length <= DESC_MAX,
      `${slug}: description is ${p.desc.length}, past the ${DESC_MAX} cut`);
  }
});

test('a long law name never costs the tool word', () => {
  // The tool noun joins the protected core, so it survives when facets do not.
  for (const slug of withWidget) {
    const p = page(slug);
    if (!p) continue;
    assert.ok(p.title.indexOf('Calculator') < p.title.indexOf(':') || !p.title.includes(':'),
      `${slug}: "Calculator" fell past the colon: ${p.title}`);
  }
});

test('titles stay distinct across the corpus', () => {
  const seen = new Map();
  for (const slug of all) {
    const t = page(slug).title;
    if (seen.has(t)) assert.fail(`duplicate title: "${t}" on ${slug} and ${seen.get(t)}`);
    seen.set(t, slug);
  }
});

const ld = (slug) => {
  const f = path.join(dist, slug, 'index.html');
  const h = fs.readFileSync(f, 'utf8');
  const out = [];
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      for (const x of (Array.isArray(d) ? d : [d])) out.push(x);
    } catch { out.push({ '@type': 'PARSE ERROR' }); }
  }
  return out;
};

test('every interactive page declares itself a WebApplication', () => {
  for (const slug of [...withWidget, ...withIx.keys()]) {
    if (!page(slug)) continue;
    const app = ld(slug).find((x) => x['@type'] === 'WebApplication');
    assert.ok(app, `${slug}: interactive, but claims no application`);
    assert.equal(app.isAccessibleForFree, true);
    assert.equal(app.offers.price, '0');
    // Free is a checkable claim here: the arithmetic runs in the browser and
    // neither asset file makes a request.
    assert.ok(app.url && app.name, `${slug}: incomplete application markup`);
  }
});

test('no page without an interaction claims to be an application', () => {
  for (const slug of all) {
    if (withWidget.has(slug) || withIx.has(slug)) continue;
    assert.ok(!ld(slug).some((x) => x['@type'] === 'WebApplication'),
      `${slug}: no interaction, but declares a WebApplication`);
  }
});

test('all JSON-LD on every law page still parses', () => {
  for (const slug of all) {
    assert.ok(!ld(slug).some((x) => x['@type'] === 'PARSE ERROR'), `${slug}: broken JSON-LD`);
  }
});

/* The shipped stylesheet is comment-stripped. That is a build step operating on
 * CSS with a regex, which is exactly the kind of thing that works until it
 * silently eats a rule, so the output is checked rather than assumed. */
test('the shipped stylesheet is lean but intact', () => {
  const shipped = fs.readFileSync(path.join(root, 'dist/assets/styles.css'), 'utf8');
  const source = fs.readFileSync(path.join(root, 'src/assets/styles.css'), 'utf8');
  assert.equal(shipped.includes('/*'), false, 'comments still shipping');
  assert.ok(source.includes('/*'), 'the SOURCE must keep its comments');
  const braces = (t) => [(t.match(/\{/g) || []).length, (t.match(/\}/g) || []).length];
  const [o, c] = braces(shipped);
  assert.equal(o, c, 'unbalanced braces after stripping');
  // Rules that only exist because of this session's work, spot-checked so a
  // future strip cannot quietly remove the blocks the interactions depend on.
  for (const sel of ['.wg-formula', '.wg-syms', '.ix-fields', '.ix-case', '.ix-chart',
                     '.ix-stage', '.ix-choice', '.ix-scene', '.ix-verdict',
                     'prefers-reduced-motion', '.entry-layout .lawmain']) {
    assert.ok(shipped.includes(sel), `${sel} lost from the shipped stylesheet`);
  }
  assert.ok(shipped.length < source.length * 0.85, 'strip did not actually save anything');
});

/* Practice problems (Google's Quiz rich result).
 *
 * The Datasets enhancement on the sibling property reports 53 invalid items and
 * zero valid, which is what a structured-data type looks like when nobody is
 * checking it. These tests exist so this type does not go the same way, and
 * above all so it never asserts a right answer where the page refuses to give
 * one.
 */
const jsonld = (slug) => {
  const h = fs.readFileSync(path.join(dist, slug, 'index.html'), 'utf8');
  const out = [];
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      for (const x of (Array.isArray(d) ? d : [d])) out.push(x);
    } catch { out.push({ '@type': 'PARSE ERROR' }); }
  }
  return out;
};

test('spot pages publish their scored cases as practice problems', () => {
  for (const [slug, kind] of withIx) {
    if (kind !== 'spot') continue;
    const spec = interactiveFor(slug);
    const scored = spec.cases.filter((c) => !c.open);
    const quiz = jsonld(slug).find((x) => x['@type'] === 'Quiz');
    if (!scored.length) { assert.ok(!quiz, `${slug}: quiz with no scored cases`); continue; }
    assert.ok(quiz, `${slug}: no Quiz markup`);
    assert.equal(quiz.hasPart.length, scored.length,
      `${slug}: ${quiz.hasPart.length} questions marked up against ${scored.length} scored cases`);
    for (const q of quiz.hasPart) {
      assert.equal(q.learningResourceType, 'Practice problem');
      assert.ok(q.text && q.acceptedAnswer && q.acceptedAnswer.text,
        `${slug}: a question has no accepted answer`);
      assert.ok(q.suggestedAnswer && q.suggestedAnswer.length,
        `${slug}: a question offers no alternative`);
    }
  }
});

/* The line. An open case exists because the law has two defensible answers.
 * Marking one accepted would assert in machine-readable form the very verdict
 * the page declines to give in prose. */
test('open cases are never published as having a right answer', () => {
  for (const [slug, kind] of withIx) {
    if (kind !== 'spot') continue;
    const spec = interactiveFor(slug);
    const open = spec.cases.filter((c) => c.open);
    if (!open.length) continue;
    const quiz = jsonld(slug).find((x) => x['@type'] === 'Quiz');
    if (!quiz) continue;
    const marked = new Set(quiz.hasPart.map((q) => q.text));
    for (const c of open) {
      assert.ok(!marked.has(c.text),
        `${slug}: open question published with an accepted answer — "${c.text.slice(0, 50)}…"`);
    }
  }
});

test('no page publishes a Quiz it has no questions for', () => {
  for (const slug of all) {
    const kind = withIx.get(slug);
    if (kind === 'spot') continue;
    assert.ok(!jsonld(slug).some((x) => x['@type'] === 'Quiz'),
      `${slug}: publishes Quiz markup without being a quiz`);
  }
});
