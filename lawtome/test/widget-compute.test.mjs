/* The widgets compute a law's own closed form in the browser. Nothing else in
 * the suite exercises that arithmetic, so a wrong constant or a mis-keyed slug
 * would ship silently: the Pareto widget was keyed to a slug that did not
 * exist and rendered nothing for weeks before anyone noticed.
 *
 * assets/widget.js is a browser IIFE with no exports, so the LAWS table is
 * lifted out of the source text and evaluated here.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { widgetSlugs, widgetFor } from '../src/templates/widgets.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = fs.readFileSync(path.join(root, 'src/assets/widget.js'), 'utf8');
const body = src.slice(src.indexOf('  var LAWS = {'), src.indexOf('  function wire(root)'));
const LAWS = eval('(' + body.slice(body.indexOf('{'), body.lastIndexOf('};') + 1) + ')');

const specs = widgetSlugs().map((s) => [s, widgetFor(s)]).filter(([, w]) => w);

/* An output that is NaN at its defaults is a dead widget, unless the law really
 * has no answer there. Snell's law defaults to entering a denser medium, where
 * no critical angle exists; the dash is the correct reading. */
const NAN_AT_DEFAULT_IS_CORRECT = new Set(['snells-law:crit']);

const defaults = (w) => Object.fromEntries(w.inputs.map((i) => [i.id, i.value]));

test('every widget spec has a compute function', () => {
  const missing = specs.filter(([s]) => !LAWS[s]).map(([s]) => s);
  assert.deepEqual(missing, [], 'specs with no arithmetic behind them');
});

test('every compute function has a spec', () => {
  const keys = new Set(specs.map(([s]) => s));
  assert.deepEqual(Object.keys(LAWS).filter((k) => !keys.has(k)), []);
});

test('declared outputs and computed outputs agree', () => {
  for (const [slug, w] of specs) {
    const res = LAWS[slug](defaults(w));
    for (const o of w.outputs) {
      assert.ok(o.id in res, `${slug}: output "${o.id}" is rendered but never computed`);
    }
    for (const k of Object.keys(res)) {
      assert.ok(w.outputs.some((o) => o.id === k),
        `${slug}: computes "${k}" but has nowhere to show it`);
    }
  }
});

test('no widget is dead at its own defaults', () => {
  for (const [slug, w] of specs) {
    const res = LAWS[slug](defaults(w));
    for (const o of w.outputs) {
      if (NAN_AT_DEFAULT_IS_CORRECT.has(`${slug}:${o.id}`)) continue;
      assert.ok(typeof res[o.id] === 'number' || typeof res[o.id] === 'boolean',
        `${slug}: "${o.id}" is not a number`);
      assert.ok(!Number.isNaN(res[o.id]), `${slug}: "${o.id}" is NaN at defaults`);
    }
  }
});

test('log sliders are positive and ordered', () => {
  for (const [slug, w] of specs) {
    for (const i of w.inputs) {
      assert.ok(i.min < i.max, `${slug}/${i.id}: min is not below max`);
      assert.ok(i.value >= i.min && i.value <= i.max, `${slug}/${i.id}: default is outside the range`);
      if (i.log) assert.ok(i.min > 0, `${slug}/${i.id}: a log slider cannot start at or below zero`);
    }
  }
});

/* Known values, checked by hand against the literature. Relative tolerance:
 * an absolute one let a wrong Eyring rate constant of 0.0613 pass against a
 * true 0.0590 because both are small. */
const KNOWN = [
  ['amdahls-law', { p: 90, s: 64 }, 'speedup', 8.7671],
  ['bayes-theorem', { prior: 1, sens: 99, spec: 95 }, 'post', 16.667],
  ['the-ideal-gas-law', { n: 1, t: 273.15, v: 22.414 }, 'p', 101.325],
  ['the-ideal-gas-law', { n: 1, t: 273.15, v: 22.414 }, 'atm', 1],
  ['charles-law', { v1: 1, t1: 0, t2: 273.15 }, 'v2', 2],
  ['arrhenius-equation', { a: 1e13, ea: 50, t: 25 }, 'k', 17392.6, 0.001],
  ['arrhenius-equation', { a: 1e13, ea: 50, t: 25 }, 'q10', 1.9244, 0.001],
  ['nernst-equation', { e0: 1.1, n: 2, q: 0.1 }, 'e', 1.12958],
  ['nernst-equation', { e0: 0, n: 1, q: 1 }, 'dec', 59.16, 0.001],
  ['grahams-law-of-effusion', { m1: 2.016, m2: 31.998 }, 'r', 3.9839],
  ['the-gibbs-phase-rule', { c: 1, p: 3 }, 'f', 0],
  ['the-pythagorean-theorem', { a: 3, b: 4 }, 'c', 5],
  ['eulers-polyhedron-formula', { v: 8, e: 12 }, 'f', 6],
  ['the-binomial-theorem', { n: 30, k: 15 }, 'c', 155117520],
  ['wilsons-theorem', { n: 59 }, 'w', 1],
  ['wilsons-theorem', { n: 9 }, 'w', 0],
  ['the-prime-number-theorem', { x: 1e6 }, 'p1', 72382.4, 0.001],
  ['benfords-law', { d: 1, n: 10000 }, 'p', 30.103],
  ['benfords-law', { d: 9, n: 10000 }, 'p', 4.5757],
  ['chebyshevs-inequality', { k: 2 }, 'out', 25],
  ['markovs-inequality', { mu: 10, a: 50 }, 'p', 20],
  ['bessels-correction', { n: 10, sd: 5 }, 'sc', 5.27046],
  ['the-bonferroni-correction', { m: 20, a: 5 }, 'un', 64.151],
  ['the-monty-hall-problem', { n: 3, k: 1 }, 'sw', 66.6667],
  ['the-monty-hall-problem', { n: 10, k: 8 }, 'sw', 90],
  ['the-german-tank-problem', { m: 60, k: 4 }, 'n', 74],
  ['number-needed-to-treat', { cer: 20, eer: 15 }, 'nnt', 20],
  ['central-limit-theorem', { sd: 15, n: 100 }, 'moe', 2.93995],
  ['the-secretary-problem', { n: 1000 }, 'p', 36.82, 0.001],
  ['hubbles-law', { d: 100, h: 70 }, 'v', 7000],
  ['hubbles-law', { d: 100, h: 70 }, 't', 13.968],
  ['the-schwarzschild-radius', { m: 1 }, 'rs', 2.9532, 0.002],
  ['the-roche-limit', { r: 6371, rm: 5514, rs: 3346 }, 'd', 18363, 0.01],
  ['the-hill-sphere', { a: 1, q: 3.0034e-6, e: 0.0167 }, 'km', 1.4714e6, 0.01],
  ['the-chandrasekhar-limit', { mu: 2, m: 1.2 }, 'lim', 1.456],
  ['the-doppler-effect', { f: 440, vs: 30, vo: 0 }, 'f2', 482.24],
  ['the-doppler-effect', { f: 440, vs: 400, vo: 0 }, 'boom', 1],
  ['the-kelly-criterion', { p: 60, b: 1 }, 'f', 20],
  ['the-kelly-criterion', { p: 60, b: 1 }, 'g', 2.0136, 0.001],
  ['the-kelly-criterion', { p: 60, b: 1 }, 'gd', -0.24469, 0.001],
  ['the-gini-coefficient', { x: 20, y: 80 }, 'g', 0.6],
  ['the-herfindahl-hirschman-index', { a: 25, b: 25, c: 25, d: 25 }, 'h', 2500],
  ['okuns-law', { u: 8, un: 5, c: 2 }, 'gap', -6],
  ['the-quantity-theory-of-money', { m: 10, v: 0, q: 3 }, 'p', 7],
  ['the-poisson-distribution', { l: 3, k: 2 }, 'p', 22.404],
  ['the-poisson-distribution', { l: 3, k: 2 }, 'z', 4.9787],
  ['the-nyquist-shannon-sampling-theorem', { f: 1000, fs: 1500 }, 'al', 500],
  ['gauss-law', { q: 1, r: 1 }, 'e', 8.98755],
  ['the-carnot-theorem', { th: 800, tc: 300 }, 'eff', 62.5],
  ['torricellis-law', { h: 2, a: 0.0001 }, 'v', 6.2632],
  ['the-hagen-poiseuille-equation', { dp: 1000, r: 5, eta: 0.001, l: 1 }, 'q', 0.245437],
  ['reynolds-number', { rho: 1000, v: 1, l: 0.05, eta: 0.001 }, 're', 50000],
  ['the-photoelectric-effect', { lam: 400, phi: 2.3 }, 'ke', 0.79960, 0.001],
  ['the-bohr-model', { n1: 3, n2: 2 }, 'de', 1.88968, 0.001],
  ['the-rydberg-formula', { n1: 2, n2: 3 }, 'lam', 656.11, 0.001],
  // Wave 6: closed forms outside the hard sciences.
  ['sods-law', { p: 1, n: 100 }, 'atl', 63.397],
  ['the-prevention-paradox', { base: 2, rrr: 25, pop: 1e6 }, 'nnt', 200],
  ['the-prevention-paradox', { base: 2, rrr: 25, pop: 1e6 }, 'saved', 5000],
  ['the-abc-conjecture', { a: 1, b: 8 }, 'rad', 6],
  ['the-abc-conjecture', { a: 1, b: 8 }, 'q', 1.22629],
  ['the-abc-conjecture', { a: 2, b: 4 }, 'cop', 0],
  ['the-marginal-value-theorem', { t: 8, k: 2, g: 100 }, 'ts', 4],
  ['the-shannon-hartley-theorem', { b: 1e6, snr: 30 }, 'c', 9966742, 0.001],
  ['gustafsons-law', { s: 10, n: 64 }, 'sc', 57.7],
  ['gustafsons-law', { s: 10, n: 64 }, 'am', 8.7671],
  ['berksons-paradox', { pa: 20, pb: 20 }, 'nb', 100],
  ['brooks-law', { n: 10, add: 5 }, 'p0', 45],
  ['the-experience-curve', { c1: 100, b: 80, n: 2 }, 'cn', 80],
  ['the-kardashev-scale', { p: 1e16 }, 'k', 1],
  ['koomeys-law', { y: 15.7 }, 'g', 1024],
  ['the-winners-curse', { n: 10, s: 100, v: 10000 }, 'ov', 81.818],
  ['the-friendship-paradox', { m: 10, sd: 10 }, 'fm', 20],
  ['the-inspection-paradox', { m: 10, sd: 10 }, 'w', 10],
  ['reillys-law-of-retail-gravitation', { d: 100, pa: 1e5, pb: 25000 }, 'da', 66.667],
  ['byzantine-fault-tolerance', { n: 4 }, 'f', 1],
  ['byzantine-fault-tolerance', { n: 3 }, 'ok', 0],
  ['littlewoods-law', { r: 1e6, e: 1, h: 8 }, 'd', 34.722],
  ['braess-paradox', { n: 4000, f: 45, d: 100 }, 'b', 65],
  ['braess-paradox', { n: 4000, f: 45, d: 100 }, 'a', 80],
  ['the-pythagorean-comma', { n: 12 }, 'c', 23.460, 0.001],
  ['condorcets-jury-theorem', { n: 3, p: 60 }, 'maj', 64.8],
  ['condorcets-jury-theorem', { n: 101, p: 50 }, 'maj', 50],
  ['regression-to-the-mean', { m: 100, sd: 15, x: 130, r: 0.7 }, 'e', 121],
  ['fitts-law', { d: 200, w: 20, a: 0, b: 100 }, 'id', 4.32193],
  ['omoris-law', { k: 100, c: 0.1, t: 1 }, 'cum', 239.79],
  // 2^(1/0.33) is 8.170, not the 8.217 I first wrote by hand.
  ['stevens-power-law', { a: 0.33, i: 10 }, 'dbl', 8.16981, 0.001],
  ['goldbachs-conjecture', { n: 100 }, 'ways', 6],
  ['goldbachs-conjecture', { n: 4 }, 'ways', 1],
  ['the-price-equation', { p: 50, wa: 1.2, wb: 0.8, za: 1, zb: 0 }, 'dz', 0.1],
  ['the-shapley-value', { va: 10, vb: 20, vab: 50 }, 'pa', 20],
  ['paris-law', { dk: 10, c: 1e-12, m: 3 }, 'cyc', 1e6],
  ['the-faber-jackson-relation', { s1: 100, s2: 200 }, 'r', 16],
  ['bergmanns-rule', { m1: 1, m2: 8 }, 'r', 0.5],
  ['engels-law', { y0: 2000, dy: 50, f0: 40, df: 10 }, 'el', 0.2],
  // A ten-fold text multiplies vocabulary by 10^0.49 = 3.09, i.e. +209%.
  ['heaps-law', { n: 1e6, k: 44, b: 0.49 }, 'gain', 209.0295, 0.001],
  ['the-bus-factor', { n: 10, k: 2, p: 15 }, 'ps', 45.570, 0.001],
  ['the-jeans-instability', { t: 10, n: 1e4, mu: 2.33 }, 'mj', 5.375, 0.02],
];

test('known values, checked against the literature', () => {
  for (const [slug, input, key, want, tol = 0.005] of KNOWN) {
    assert.ok(LAWS[slug], `${slug}: no compute function`);
    const got = LAWS[slug](input)[key];
    const ok = want === 0 ? Math.abs(got) < 1e-9 : Math.abs(got - want) / Math.abs(want) <= tol;
    assert.ok(ok, `${slug}.${key}: got ${got}, expected ${want}`);
  }
});

/* A slider that changes nothing is a lie about the law: it invites the reader
 * to explore a variable the arithmetic ignores. Berkson's paradox shipped with
 * a second trait-rate slider wired to no output at all.
 *
 * The exception is a law whose whole content is that the variable does NOT
 * matter. Fermat's little theorem returns 1 for every base when p is prime,
 * and the frozen readout is the demonstration. */
const FROZEN_ON_PURPOSE = new Set(['fermats-little-theorem:a']);
test('every slider actually moves something', () => {
  for (const [slug, w] of specs) {
    const base = LAWS[slug](defaults(w));
    for (const i of w.inputs) {
      const probe = defaults(w);
      // Nudge within the declared range, away from whichever end we sit on.
      const span = i.max - i.min;
      probe[i.id] = i.value + (i.value + span * 0.37 <= i.max ? span * 0.37 : -span * 0.37);
      const after = LAWS[slug](probe);
      const moved = w.outputs.some((o) => {
        const a = base[o.id], b = after[o.id];
        if (Number.isNaN(a) && Number.isNaN(b)) return false;
        return a !== b;
      });
      if (FROZEN_ON_PURPOSE.has(`${slug}:${i.id}`)) {
        assert.ok(!moved, `${slug}: "${i.id}" now moves an output, so the allowlist entry is stale`);
        continue;
      }
      assert.ok(moved, `${slug}: moving "${i.id}" changes no output`);
    }
  }
});
