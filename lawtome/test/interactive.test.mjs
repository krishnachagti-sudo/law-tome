/* The non-calculator interactions. Same contract as the widget tests: the
 * engines live in a browser IIFE with no exports, so they are lifted out of
 * the source text and evaluated here.
 *
 * A solver is held to a higher bar than a calculator. A calculator that is
 * wrong shows a wrong number; a solver that is wrong shows a wrong number
 * AND a construction that appears to justify it.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { interactiveSlugs, interactiveFor, interactiveBlock } from '../src/templates/interactives.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = fs.readFileSync(path.join(root, 'src/assets/interactive.js'), 'utf8');
const body = src.slice(src.indexOf('  function gcd'), src.indexOf('  function wire(root)'));
// The engines close over gcd and inverse, so the whole body is evaluated as
// one function and asked for its table. A bare eval would not leak `var` out
// of ESM strict mode.
const ENGINES = eval(`(function () { ${body} return ENGINES; })()`);

const solvers = interactiveSlugs().filter((s) => interactiveFor(s).kind === 'solver');
const spots = interactiveSlugs().filter((s) => interactiveFor(s).kind === 'spot');

test('every spec names a kind this build understands', () => {
  for (const slug of interactiveSlugs()) {
    assert.ok(['solver', 'spot'].includes(interactiveFor(slug).kind),
      `${slug}: unknown kind "${interactiveFor(slug).kind}"`);
  }
});

test('every solver spec has an engine, and every engine a spec', () => {
  for (const slug of solvers) assert.ok(ENGINES[slug], `${slug}: spec with no engine behind it`);
  const known = new Set(solvers);
  for (const k of Object.keys(ENGINES)) assert.ok(known.has(k), `${k}: engine with no spec`);
});

test('every solver renders its fields and a result slot', () => {
  for (const slug of solvers) {
    const html = interactiveBlock(slug);
    assert.ok(html.includes(`data-interactive="${slug}"`));
    for (const f of interactiveFor(slug).fields) {
      assert.ok(html.includes(`data-ix="${f.id}"`), `${slug}: field ${f.id} not rendered`);
    }
    assert.ok(html.includes('data-ix-out="result"'), `${slug}: no result slot`);
  }
});

test('solvers produce an answer at their own defaults, not an error', () => {
  for (const slug of solvers) {
    const f = Object.fromEntries(interactiveFor(slug).fields.map((x) => [x.id, x.value]));
    const res = ENGINES[slug](f);
    assert.ok(!res.error, `${slug}: errors at its own defaults: ${res.error}`);
    assert.ok(res.result, `${slug}: no result at defaults`);
  }
});

/* The spot kind is content, so the tests are about the content being sound.
 * A quiz where every answer is the same teaches the reader to click one button
 * and learn nothing, and it would pass every structural check. */
test('spot cases are complete', () => {
  for (const slug of spots) {
    const w = interactiveFor(slug);
    assert.ok(w.prompt && w.yesLabel && w.noLabel, `${slug}: missing prompt or labels`);
    assert.ok(w.cases.length >= 4, `${slug}: only ${w.cases.length} cases`);
    for (const c of w.cases) {
      assert.equal(typeof c.yes, 'boolean', `${slug}: a case has no boolean answer`);
      assert.ok(c.text && c.text.length > 15, `${slug}: a case has no real text`);
      assert.ok(c.why && c.why.length > 40, `${slug}: a case has no real explanation`);
    }
  }
});

test('spot answers are mixed, so the quiz cannot be gamed', () => {
  for (const slug of spots) {
    const ans = interactiveFor(slug).cases.map((c) => c.yes);
    const yes = ans.filter(Boolean).length;
    assert.ok(yes > 0 && yes < ans.length, `${slug}: every answer is the same`);
    // No run of four identical answers, which is the other way to guess right.
    for (let i = 0; i + 3 < ans.length; i++) {
      assert.ok(new Set(ans.slice(i, i + 4)).size > 1, `${slug}: four identical answers in a row`);
    }
  }
});

test('spot blocks render every case and every explanation into the HTML', () => {
  for (const slug of spots) {
    const html = interactiveBlock(slug);
    const w = interactiveFor(slug);
    assert.equal((html.match(/ix-case-text/g) || []).length, w.cases.length);
    assert.equal((html.match(/ix-case-why/g) || []).length, w.cases.length);
    // Readable with no script at all: nothing is hidden in the served markup.
    assert.ok(!/data-ix-why hidden/.test(html), `${slug}: explanations hidden server-side`);
    assert.ok(html.includes('data-answer='), `${slug}: no answers encoded`);
  }
});

const CRT = (f) => ENGINES['the-chinese-remainder-theorem'](f);
const answer = (res) => Number(res.result.match(/x = (\d+)/)[1]);

test('CRT solves the classical Sun Tzu problem', () => {
  // Third century: things of unknown number, counted in threes, fives, sevens.
  const res = CRT({ r0: 2, m0: 3, r1: 3, m1: 5, r2: 2, m2: 7 });
  assert.equal(answer(res), 23);
  assert.ok(res.result.includes('105'), 'should state the modulus of the solution set');
});

test('CRT refuses moduli that are not pairwise coprime', () => {
  const res = CRT({ r0: 2, m0: 4, r1: 3, m1: 6, r2: 1, m2: 5 });
  assert.ok(res.error, 'must refuse rather than return a number');
  assert.match(res.error, /coprime/);
  assert.match(res.error, /2/, 'should name the shared factor');
  assert.equal(res.result, undefined);
});

test('CRT refuses a modulus below 2', () => {
  assert.ok(CRT({ r0: 1, m0: 1, r1: 1, m1: 3, r2: 1, m2: 5 }).error);
});

test('CRT answer satisfies every congruence it was given', () => {
  // Exhaustive over small moduli: the construction is only worth showing if
  // the number it produces actually survives being checked.
  let checked = 0;
  for (let m0 = 2; m0 <= 11; m0++) {
    for (let m1 = 2; m1 <= 11; m1++) {
      for (let m2 = 2; m2 <= 11; m2++) {
        for (const [r0, r1, r2] of [[0, 0, 0], [1, 2, 3], [1, 0, 4]]) {
          const res = CRT({ r0, m0, r1, m1, r2, m2 });
          if (res.error) continue;
          const x = answer(res);
          assert.equal(x % m0, r0 % m0, `x=${x} fails mod ${m0}`);
          assert.equal(x % m1, r1 % m1, `x=${x} fails mod ${m1}`);
          assert.equal(x % m2, r2 % m2, `x=${x} fails mod ${m2}`);
          assert.ok(x >= 0 && x < m0 * m1 * m2, `x=${x} outside 0..N`);
          checked++;
        }
      }
    }
  }
  assert.ok(checked > 500, `only ${checked} cases ran`);
});

test('CRT accepts every coprime triple it should', () => {
  // 3, 5 and 7 are pairwise coprime and must never be refused.
  assert.ok(!CRT({ r0: 0, m0: 3, r1: 0, m1: 5, r2: 0, m2: 7 }).error);
  assert.equal(answer(CRT({ r0: 0, m0: 3, r1: 0, m1: 5, r2: 0, m2: 7 })), 0);
});

test('CRT shows its working and checks itself', () => {
  const res = CRT({ r0: 2, m0: 3, r1: 3, m1: 5, r2: 2, m2: 7 });
  assert.ok(res.work.length >= 4, 'should show the construction');
  assert.ok(res.work.some((w) => w.startsWith('N = 105')));
  assert.ok(res.work.some((w) => w.startsWith('Check:')), 'should verify its own answer');
});
