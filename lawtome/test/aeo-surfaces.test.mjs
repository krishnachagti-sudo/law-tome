/* The surfaces answer engines actually read.
 *
 * 84% of this property's AI-feature impressions land on law pages, and what an
 * answer engine fetches is the Markdown twin or llms-full.txt, not the rendered
 * HTML. A calculator is a script; to a crawler that does not run one, a page
 * with a working calculator and a page without look identical unless the text
 * says otherwise.
 *
 * Four surfaces now carry the claim: the HTML title, the meta description, the
 * Markdown twin, and llms-full.txt. These tests exist to stop them drifting,
 * and above all to stop any of them claiming a tool the page does not have.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { widgetSlugs, widgetFor } from '../src/templates/widgets.mjs';
import { interactiveSlugs, interactiveFor } from '../src/templates/interactives.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const md = (slug) => {
  const f = path.join(dist, 'laws', slug, 'index.md');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};
const interactive = new Set([...widgetSlugs().filter(widgetFor), ...interactiveSlugs()]);
const allSlugs = fs.existsSync(path.join(dist, 'laws'))
  ? fs.readdirSync(path.join(dist, 'laws')).filter((d) => md(d) !== null)
  : [];

test('the build is present', () => {
  assert.ok(allSlugs.length > 1000, `only ${allSlugs.length} markdown twins; run the build`);
});

test('every interactive entry says so in its Markdown twin', () => {
  for (const slug of interactive) {
    const m = md(slug);
    if (m === null) continue;
    assert.match(m, /^## Try it$/m, `${slug}: markdown twin does not mention the interaction`);
    assert.match(m, /free, runs in the browser, sends nothing anywhere/,
      `${slug}: missing the terms of use an answer engine would repeat`);
    assert.match(m, /Open it at https?:\/\/\S+/, `${slug}: no URL to send a reader to`);
  }
});

test('no entry without an interaction claims one in Markdown', () => {
  for (const slug of allSlugs) {
    if (interactive.has(slug)) continue;
    assert.ok(!/^## Try it$/m.test(md(slug)), `${slug}: claims an interaction it does not have`);
  }
});

test('the identity and its symbols reach the Markdown in plain text', () => {
  // Search Console shows these pages ranking for queries about their own
  // symbols and units, which is an answer-engine-shaped question.
  for (const slug of interactive) {
    const spec = widgetFor(slug) || interactiveFor(slug);
    const m = md(slug);
    if (m === null || !spec || !spec.identity) continue;
    const body = m.slice(m.indexOf('## Try it'));
    const want = spec.identity.replace(/\s+/g, ' ').trim();
    assert.ok(body.replace(/\s+/g, ' ').includes(want),
      `${slug}: identity missing from the markdown`);
    for (const y of (spec.symbols || [])) {
      assert.ok(body.includes(y.sym), `${slug}: symbol ${y.sym} not carried into markdown`);
    }
  }
});

test('llms-full.txt marks exactly the interactive entries, and no others', () => {
  const full = fs.readFileSync(path.join(dist, 'llms-full.txt'), 'utf8');
  const entries = full.split(/\n---\n/);
  let marked = 0;
  for (const e of entries) {
    const u = e.match(/^URL: .*\/laws\/([a-z0-9-]+)\/$/m);
    if (!u) continue;
    const has = /^Interactive: /m.test(e);
    if (has) marked++;
    assert.equal(has, interactive.has(u[1]),
      `${u[1]}: llms-full ${has ? 'claims' : 'omits'} an interaction wrongly`);
  }
  assert.equal(marked, interactive.size, `llms-full marked ${marked} of ${interactive.size}`);
});

test('llms-full identities match the spec they came from', () => {
  const full = fs.readFileSync(path.join(dist, 'llms-full.txt'), 'utf8');
  for (const e of full.split(/\n---\n/)) {
    const u = e.match(/^URL: .*\/laws\/([a-z0-9-]+)\/$/m);
    const id = e.match(/^Identity: (.+)$/m);
    if (!u || !id) continue;
    const spec = widgetFor(u[1]) || interactiveFor(u[1]);
    assert.ok(spec, `${u[1]}: identity stated for a law with no spec`);
    assert.equal(id[1].replace(/\s+/g, ' ').trim(), spec.identity.replace(/\s+/g, ' ').trim(),
      `${u[1]}: llms-full identity does not match the widget's own`);
  }
});

test('llms.txt tells a model the interactive entries exist, and counts them right', () => {
  const idx = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8');
  const m = idx.match(/(\d+) of these entries are interactive/);
  assert.ok(m, 'llms.txt does not mention the interactive entries at all');
  assert.equal(Number(m[1]), interactive.size, 'llms.txt count is stale');
  const listed = [...idx.matchAll(/^- (\d+) with /gm)].reduce((a, x) => a + Number(x[1]), 0);
  assert.equal(listed, interactive.size, 'the per-kind breakdown does not sum to the total');
});

test('AI crawlers are allowed by name', () => {
  const robots = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'OAI-SearchBot']) {
    assert.match(robots, new RegExp(`User-agent: ${bot}`), `${bot} not named in robots.txt`);
  }
});
