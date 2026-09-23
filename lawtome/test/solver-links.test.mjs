/* Shareable solver links, and the markup that depends on them.
 *
 * Google's MathSolver type describes a URL template that accepts the problem.
 * Until this session that claim would have been false — the solvers read
 * nothing from the query string — which is why the type was not published.
 * The feature came first and the markup follows it, so these tests check the
 * two agree rather than checking the markup alone.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { interactiveSlugs, interactiveFor } from '../src/templates/interactives.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist/laws');
const ld = (slug) => {
  const f = path.join(dist, slug, 'index.html');
  if (!fs.existsSync(f)) return [];
  const h = fs.readFileSync(f, 'utf8');
  const out = [];
  for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const d = JSON.parse(m[1]);
      for (const x of (Array.isArray(d) ? d : [d])) out.push(x);
    } catch { /* covered elsewhere */ }
  }
  return out;
};
const solvers = interactiveSlugs().filter((s) => interactiveFor(s).kind === 'solver');
const withMath = solvers.filter((s) => ld(s).some((x) => x['@type'] === 'MathSolver'));

test('MathSolver appears only on solvers, and only some of them', () => {
  assert.ok(withMath.length >= 1, 'no MathSolver pages at all');
  assert.ok(withMath.length < solvers.length,
    'every solver claims to be a math solver, which is the overreach this guards against');
  // Named exclusions, so neither can be added back without a decision. The
  // Chinese Remainder Theorem takes six numeric fields rather than one
  // expression; Lamport takes a description of processes and messages.
  for (const excluded of ['the-chinese-remainder-theorem', 'lamports-happened-before-relation']) {
    assert.ok(!withMath.includes(excluded),
      `${excluded}: claims MathSolver, but it has no single expression input`);
  }
  const all = fs.readdirSync(dist).filter((d) => fs.existsSync(path.join(dist, d, 'index.html')));
  const set = new Set(withMath);
  for (const slug of all) {
    if (set.has(slug)) continue;
    assert.ok(!ld(slug).some((x) => x['@type'] === 'MathSolver'),
      `${slug}: claims MathSolver without being one`);
  }
});

/* The one that matters. The markup names a query parameter; if the engine reads
 * a different one, the template describes a page that does not exist. */
test('the parameter MathSolver advertises is the one the solver reads', () => {
  const js = fs.readFileSync(path.join(root, 'src/assets/interactive.js'), 'utf8');
  assert.match(js, /new URLSearchParams\(location\.search\)/,
    'the solver does not read the query string at all');
  for (const slug of withMath) {
    const ms = ld(slug).find((x) => x['@type'] === 'MathSolver');
    const target = ms.potentialAction.target;
    const param = target.match(/[?&]([a-z0-9_]+)=\{/i);
    assert.ok(param, `${slug}: target has no substitutable parameter`);
    // applyQuery keys off each field's own data-ix, so the advertised parameter
    // has to be one of the spec's field ids.
    const ids = interactiveFor(slug).fields.map((f) => f.id);
    assert.ok(ids.includes(param[1]),
      `${slug}: advertises ?${param[1]}= but its fields are ${ids.join(', ')}`);
    assert.match(ms.potentialAction['mathExpression-input'], /^required name=/);
    assert.ok(target.startsWith(ms.url), `${slug}: target points away from the page`);
  }
});

test('calculators do not claim to be math solvers', () => {
  // Their inputs are numbers on sliders, not an expression.
  for (const slug of ['amdahls-law', 'reeds-law', 'the-shannon-hartley-theorem']) {
    assert.ok(!ld(slug).some((x) => x['@type'] === 'MathSolver'), `${slug}: wrong type claimed`);
  }
});

test('both calculators and solvers read their inputs from the URL', () => {
  const w = fs.readFileSync(path.join(root, 'src/assets/widget.js'), 'utf8');
  assert.match(w, /URLSearchParams/, 'calculators ignore the query string');
  assert.match(w, /replaceState/, 'calculators never put their state in the URL');
  // A log slider stores the VALUE, not the position: a position would be
  // meaningless if the range ever changed.
  assert.match(w, /data-min/, 'log sliders do not convert the shared value back');
});
