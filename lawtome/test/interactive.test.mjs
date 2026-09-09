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
const { ENGINES, STAGE } = eval(`(function () { ${body} return { ENGINES: ENGINES, STAGE: STAGE }; })()`);

const solvers = interactiveSlugs().filter((s) => interactiveFor(s).kind === 'solver');
const spots = interactiveSlugs().filter((s) => interactiveFor(s).kind === 'spot');
const sims = interactiveSlugs().filter((s) => interactiveFor(s).kind === 'sim');
const demos = interactiveSlugs().filter((s) => interactiveFor(s).kind === 'demo');

test('every spec names a kind this build understands', () => {
  for (const slug of interactiveSlugs()) {
    assert.ok(['solver', 'spot', 'sim', 'demo'].includes(interactiveFor(slug).kind),
      `${slug}: unknown kind "${interactiveFor(slug).kind}"`);
  }
});

test('every solver and sim spec has an engine, and every engine a spec', () => {
  for (const slug of solvers.concat(sims)) {
    assert.ok(ENGINES[slug], `${slug}: spec with no engine behind it`);
  }
  const known = new Set(solvers.concat(sims));
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
      assert.ok(c.text && c.text.length > 15, `${slug}: a case has no real text`);
      if (c.open) {
        // An open case must explain BOTH replies, or it is a scored case
        // pretending to be open.
        assert.ok(c.whyYes && c.whyYes.length > 40, `${slug}: open case missing whyYes`);
        assert.ok(c.whyNo && c.whyNo.length > 40, `${slug}: open case missing whyNo`);
        assert.equal(c.yes, undefined, `${slug}: open case also carries an answer`);
      } else {
        assert.equal(typeof c.yes, 'boolean', `${slug}: a case has no boolean answer`);
        assert.ok(c.why && c.why.length > 40, `${slug}: a case has no real explanation`);
      }
    }
  }
});

/* A scenario whose scored cases are the PREMISES of a derivation legitimately
 * points one way: Gettier needs true, believed and justified all answered yes
 * before the fourth question can bite. That is a guided argument rather than a
 * quiz, and the reader is not being tested on it. */
const DERIVATIONS = new Set(['the-gettier-problem']);

test('spot answers are mixed, so the quiz cannot be gamed', () => {
  for (const slug of spots) {
    if (DERIVATIONS.has(slug)) continue;
    const ans = interactiveFor(slug).cases.filter((c) => !c.open).map((c) => c.yes);
    if (ans.length < 2) continue;          // an all-open scenario keeps no score
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
    // An open case renders BOTH readings into the HTML.
    const whys = w.cases.reduce((n, c) => n + (c.open ? 2 : 1), 0);
    assert.equal((html.match(/ix-case-why/g) || []).length, whys);
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

/* The sim kind runs a model of a law's stated mechanism. The model is only
 * worth showing if it actually reproduces the claim the law makes, so each of
 * these asserts the law rather than the code. */
const simDefaults = (slug) =>
  Object.fromEntries(interactiveFor(slug).fields.map((f) => [f.id, f.value]));

test('sims return every declared series and output, with no NaN', () => {
  for (const slug of sims) {
    const w = interactiveFor(slug);
    const res = ENGINES[slug](simDefaults(slug));
    for (const s of w.series) {
      assert.ok(Array.isArray(res.series[s.id]), `${slug}: series ${s.id} missing`);
      assert.equal(res.series[s.id].length, Math.round(simDefaults(slug).n) + 1,
        `${slug}: series ${s.id} is the wrong length`);
      assert.ok(res.series[s.id].every((x) => Number.isFinite(x)),
        `${slug}: series ${s.id} contains a non-finite value`);
    }
    for (const o of w.outputs) {
      assert.ok(o.id in res.out, `${slug}: output ${o.id} never computed`);
      if (o.fmt !== 'text') assert.ok(!Number.isNaN(res.out[o.id]), `${slug}: ${o.id} is NaN`);
    }
    for (const k of Object.keys(res.out)) {
      assert.ok(w.outputs.some((o) => o.id === k), `${slug}: computes ${k} with nowhere to show it`);
    }
  }
});

test('every sim series starts from the same baseline', () => {
  for (const slug of sims) {
    const res = ENGINES[slug](simDefaults(slug));
    const firsts = Object.values(res.series).map((a) => a[0]);
    assert.ok(new Set(firsts).size === 1, `${slug}: series do not start together, so divergence is not visible`);
  }
});

test("Goodhart: when gaming is cheaper, the measure rises and the thing does not", () => {
  const r = ENGINES['goodharts-law']({ cq: 10, cg: 3, d: 20, n: 20 });
  assert.equal(r.out.route, 'gaming the measure');
  assert.ok(r.out.p > 600, `measure only reached ${r.out.p}`);
  assert.equal(r.out.q, 100, 'the real thing must not move when no effort goes to it');
  assert.ok(r.out.share > 80, 'most of the measure should be gaming by now');
  assert.ok(r.series.q.every((x) => x === 100));
});

test('Goodhart: enough scrutiny makes the work the cheaper route again', () => {
  const r = ENGINES['goodharts-law']({ cq: 10, cg: 3, d: 90, n: 20 });
  assert.equal(r.out.route, 'doing the work');
  assert.equal(r.out.share, 0);
  assert.equal(r.out.p, r.out.q, 'with no gaming the measure IS the thing');
});

test('Campbell with no displacement is exactly Goodhart', () => {
  const c = ENGINES['campbells-law']({ cq: 10, cg: 3, d: 20, disp: 0, n: 20 });
  const g = ENGINES['goodharts-law']({ cq: 10, cg: 3, d: 20, n: 20 });
  assert.deepEqual(c.series.p, g.series.p);
  assert.deepEqual(c.series.q, g.series.q);
  assert.equal(c.out.drop, 0, 'without displacement the outcome is unharmed');
});

test('Campbell: displacement drives the outcome down while the indicator climbs', () => {
  const r = ENGINES['campbells-law']({ cq: 10, cg: 3, d: 10, disp: 20, n: 12 });
  assert.ok(r.out.drop < 0, 'the outcome must fall, which is the whole difference from Goodhart');
  assert.ok(r.out.p > 300, 'the indicator must climb anyway');
  // Monotone in both directions, which is the shape the law describes.
  for (let i = 1; i < r.series.q.length; i++) {
    assert.ok(r.series.q[i] <= r.series.q[i - 1], 'outcome should never rise under displacement');
    assert.ok(r.series.p[i] >= r.series.p[i - 1], 'indicator should never fall');
  }
});

test('the outcome is floored at zero rather than going negative', () => {
  const r = ENGINES['campbells-law']({ cq: 10, cg: 1, d: 0, disp: 100, n: 40 });
  assert.ok(r.series.q.every((x) => x >= 0), 'a real outcome below zero is meaningless');
});

test('scenario scenes and verdicts are rendered into the HTML', () => {
  for (const slug of spots) {
    const w = interactiveFor(slug);
    const html = interactiveBlock(slug);
    if (w.scene) {
      assert.equal((html.match(/ix-scene-p/g) || []).length, w.scene.length,
        `${slug}: scene paragraphs missing`);
    }
    if (w.verdict) assert.ok(html.includes('ix-verdict'), `${slug}: verdict missing`);
  }
});

test('open cases exist only where the law genuinely has no single answer', () => {
  // A scenario whose every case is open teaches nothing checkable; one with
  // none is a quiz, not a thought experiment. Both are fine, but a scenario
  // carrying a verdict should have at least one open case to earn it.
  for (const slug of spots) {
    const w = interactiveFor(slug);
    if (!w.verdict) continue;
    assert.ok(w.cases.some((c) => c.open),
      `${slug}: has a closing verdict but no open question to reach it`);
  }
});

test('a derivation really is one, so the exemption cannot be borrowed', () => {
  for (const slug of DERIVATIONS) {
    const w = interactiveFor(slug);
    const scored = w.cases.filter((c) => !c.open);
    assert.ok(new Set(scored.map((c) => c.yes)).size === 1,
      `${slug}: answers are mixed after all, so it should not be exempt`);
    assert.ok(w.cases.some((c) => c.open),
      `${slug}: a derivation must end in the open question it was building towards`);
    assert.ok(w.verdict, `${slug}: a derivation must state what it derived`);
  }
});

/* The demo kind shows the reader a stimulus. The tests check that the numbers
 * driving the pixels reproduce the perceptual claim the law makes. */
const demoDefaults = (slug) =>
  Object.fromEntries(interactiveFor(slug).fields.map((f) => [f.id, f.value]));

test('every demo has a stage function and renders its stage markup', () => {
  for (const slug of demos) {
    const w = interactiveFor(slug);
    assert.ok(STAGE[w.stage], `${slug}: no stage function for "${w.stage}"`);
    const html = interactiveBlock(slug);
    assert.ok(html.includes(`data-stage="${w.stage}"`), `${slug}: stage not marked`);
    assert.ok(html.includes('data-ix-stage'), `${slug}: no stage element`);
    assert.ok(html.includes('ix-caption'), `${slug}: no caption telling the reader what to look at`);
  }
});

test('demos compute every readout they declare, and nothing spare', () => {
  for (const slug of demos) {
    const w = interactiveFor(slug);
    const res = STAGE[w.stage](demoDefaults(slug));
    for (const o of w.readouts) {
      assert.ok(o.id in res.out, `${slug}: readout ${o.id} never computed`);
      if (o.fmt !== 'text') assert.ok(Number.isFinite(res.out[o.id]), `${slug}: ${o.id} is not finite`);
    }
    for (const k of Object.keys(res.out)) {
      assert.ok(w.readouts.some((o) => o.id === k), `${slug}: computes ${k} with nowhere to show it`);
    }
    assert.ok(Object.keys(res.css).length > 0, `${slug}: sets no CSS, so the stage cannot change`);
  }
});

test('anything that flashes starts stopped', () => {
  for (const slug of demos) {
    const w = interactiveFor(slug);
    if (!w.play) continue;
    const html = interactiveBlock(slug);
    assert.ok(html.includes('aria-pressed="false"'), `${slug}: play control not in the off state`);
    assert.ok(!html.includes('data-playing'), `${slug}: stage is animating on load`);
  }
});

test('phi: the flash rate is the reciprocal of the gap, and the report changes with it', () => {
  assert.equal(STAGE.phi({ gap: 100, sep: 60 }).out.rate, 10);
  assert.equal(STAGE.phi({ gap: 500, sep: 60 }).out.rate, 2);
  assert.match(STAGE.phi({ gap: 60, sep: 60 }).out.sees, /one light moving/);
  assert.match(STAGE.phi({ gap: 600, sep: 60 }).out.sees, /two lights blinking/);
  // The cycle is two gaps, because each dot is lit for one of them.
  assert.equal(STAGE.phi({ gap: 60, sep: 60 }).css['--phi-t'], '120ms');
});

test('Purkinje: red leads in daylight, blue leads in the dark, and they cross once', () => {
  const at = (lum) => STAGE.purkinje({ lum });
  const bright = at(1), dark = at(-3);
  assert.ok(bright.out.ratio < 1, 'red must be the brighter patch in daylight');
  assert.ok(dark.out.ratio > 100, 'red must all but vanish under rods alone');
  assert.ok(Number(bright.css['--pk-red']) === 1, 'the brighter patch renders at full');
  assert.ok(Number(dark.css['--pk-red']) < 0.01, 'red should be nearly black at scotopic levels');
  // Monotone, so there is exactly one crossover rather than a wobble.
  let prev = -Infinity, crossings = 0;
  for (let l = 1; l >= -3; l -= 0.05) {
    const r = at(l).out.ratio;
    assert.ok(r >= prev - 1e-9, `ratio fell as the light dimmed at ${l.toFixed(2)}`);
    if (prev < 1 && r >= 1) crossings++;
    prev = r;
  }
  assert.equal(crossings, 1, 'the two patches should swap places exactly once');
});

test('Purkinje: the sensitivity peak shifts from 555 nm to 507 nm', () => {
  assert.equal(Math.round(STAGE.purkinje({ lum: 1 }).out.peak), 555);
  assert.equal(Math.round(STAGE.purkinje({ lum: -3 }).out.peak), 507);
});

test('simultaneous contrast: the two chips are the same colour at every setting', () => {
  for (let sep = 0; sep <= 100; sep += 5) {
    for (let mid = 20; mid <= 80; mid += 10) {
      const r = STAGE.contrast({ sep, mid });
      assert.equal(r.out.same, r.out.same2, `chips differ at sep=${sep} mid=${mid}`);
      assert.equal(r.css['--sc-lo'] === r.css['--sc-hi'], sep === 0,
        `grounds should differ unless separation is zero (sep=${sep})`);
    }
  }
});

test('simultaneous contrast: the chip colour does not depend on the backgrounds', () => {
  const a = STAGE.contrast({ sep: 0, mid: 50 }).css['--sc-mid'];
  const b = STAGE.contrast({ sep: 100, mid: 50 }).css['--sc-mid'];
  assert.equal(a, b, 'the whole claim is that the chip never changes');
});