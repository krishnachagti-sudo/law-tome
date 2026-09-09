/* Interactive law widgets. Each one evaluates the law's own closed form — the
 * same identity printed under the sliders — with no eval and no data of its
 * own. A law with no entry here simply has no widget.
 *
 * Sliders marked data-log move geometrically: a linear 1..4096 processor slider
 * spends nine tenths of its travel in a range where nothing changes, which
 * hides the very behaviour Amdahl's law is about.
 */
(function () {
  'use strict';

  var FMT = function (v, unit) {
    // NaN and Infinity are different answers and must not print the same.
    // Infinity is a real result (Amdahl's ceiling when everything parallelises).
    // NaN means the quantity does not exist for these inputs — there is no
    // critical angle going into a denser medium, and no Bragg angle when the
    // wavelength cannot fit the spacing. Printing '∞' there claimed an
    // infinite angle, which is nonsense rather than merely unhelpful.
    if (isNaN(v)) return '—';
    if (!isFinite(v)) return '∞';
    var s;
    if (unit === '%') s = (v < 1 ? v.toFixed(2) : v.toFixed(1));
    else if (Math.abs(v) >= 1000) s = Math.round(v).toLocaleString('en-US');
    else if (Math.abs(v) >= 100) s = v.toFixed(0);
    else if (Math.abs(v) >= 10) s = v.toFixed(1);
    else s = v.toFixed(2);
    return s + (unit || '');
  };

  // Each returns a map of output id -> number. Pure arithmetic on the inputs.
  var LAWS = {
    'amdahls-law': function (v) {
      var p = v.p / 100, s = v.s;
      return { speedup: 1 / ((1 - p) + p / s), ceiling: p < 1 ? 1 / (1 - p) : Infinity };
    },
    'the-rule-of-72': function (v) {
      var r = v.r;
      return { approx: 72 / r, exact: Math.log(2) / Math.log(1 + r / 100) };
    },
    'metcalfes-law': function (v) {
      var n = Math.round(v.n);
      return { links: n * (n - 1) / 2, perhead: (n - 1) / 2 };
    },
    'littles-law': function (v) { return { wait: v.L / v.lam }; },
    'pareto-principle': function (v) {
      // Pareto index implied by the stated a/b split, then the top slice's share
      var a = v.a / 100, b = v.b / 100, top = v.top / 100;
      var alpha = Math.log(1 - b) / Math.log(a);       // b of effects from a of causes
      return { share: (1 - Math.pow(1 - top, alpha)) * 100 };
    },
    'zipfs-law': function (v) {
      var r = Math.round(v.rank);
      return { rel: 100 / r, ratio: r };
    },
    'the-birthday-problem': function (v) {
      var n = Math.round(v.n), q = 1;
      for (var i = 0; i < n; i++) q *= (365 - i) / 365;
      return { p: (1 - q) * 100 };
    },
    // ---- added 2026-09-09: the highest-impression ranking pages ----
    'the-cauchy-schwarz-inequality': function (v) {
      var dot = Math.abs(v.ux * v.vx + v.uy * v.vy);
      var prod = Math.sqrt(v.ux * v.ux + v.uy * v.uy) * Math.sqrt(v.vx * v.vx + v.vy * v.vy);
      return { dot: dot, prod: prod, slack: prod - dot };
    },
    'jensens-inequality': function (v) {
      var w = v.w / 100;
      var mean = w * v.x1 + (1 - w) * v.x2;
      var fmean = mean * mean;
      var meanf = w * v.x1 * v.x1 + (1 - w) * v.x2 * v.x2;
      return { fmean: fmean, meanf: meanf, gap: meanf - fmean };
    },
    'the-law-of-truly-large-numbers': function (v) {
      var p = 1 / v.odds, n = Math.round(v.n);
      // (1-p)^n directly loses all precision for tiny p, so go through log1p.
      var none = Math.exp(n * Math.log1p(-p));
      return { p: (1 - none) * 100, exp: n * p };
    },
    'beer-lambert-law': function (v) {
      var a = v.e * v.l * v.c;
      return { a: a, t: Math.pow(10, -a) * 100 };
    },
    'boyles-law': function (v) {
      return { p2: v.p1 * v.v1 / v.v2, ratio: v.v1 / v.v2 };
    },
    'galileos-inclined-plane': function (v) {
      var a = 9.80665 * Math.sin(v.ang * Math.PI / 180);
      var t = Math.sqrt(2 * v.len / a);
      return { acc: a, time: t, vel: a * t };
    },
    // ---- wave 2, 2026-09-09 ----
    'snells-law': function (v) {
      var r = v.n1 * Math.sin(v.t1 * Math.PI / 180) / v.n2;
      var crit = v.n1 > v.n2 ? Math.asin(v.n2 / v.n1) * 180 / Math.PI : NaN;
      return { t2: Math.abs(r) <= 1 ? Math.asin(r) * 180 / Math.PI : NaN, crit: crit };
    },
    'archimedes-principle': function (v) {
      var f = v.rho * v.vol * 9.80665;
      return { f: f, mass: f / 9.80665 };
    },
    'fouriers-law-of-heat-conduction': function (v) {
      var q = v.k * v.a * v.dt / v.l;
      return { q: q, flux: q / v.a };
    },
    'archards-wear-equation': function (v) {
      // Q is in m^3; report mm^3 (x 1e9) because real wear volumes are tiny.
      return { v: v.kk * v.w * v.l / v.h * 1e9 };
    },
    'braggs-law': function (v) {
      var sin = v.n * v.lam / (2 * v.d);
      return { th: sin <= 1 ? Math.asin(sin) * 180 / Math.PI : NaN };
    },
    'the-de-broglie-wavelength': function (v) {
      return { lam: 6.62607015e-34 / (v.m * v.v) * 1e9 };
    },
    'brewsters-angle': function (v) {
      var b = Math.atan(v.n2 / v.n1) * 180 / Math.PI;
      return { b: b, r: 90 - b };
    },
    'newtons-law-of-cooling': function (v) {
      var gap = v.t0 - v.te;
      return { temp: v.te + gap * Math.exp(-v.k * v.t), half: Math.LN2 / v.k };
    },
    'raoults-law': function (v) {
      var x = v.x / 100;
      return { p: x * v.p0, drop: (1 - x) * v.p0 };
    },
    'the-langmuir-adsorption-isotherm': function (v) {
      return { th: (v.k * v.p) / (1 + v.k * v.p) * 100, phalf: 1 / v.k };
    },
    'the-law-of-total-probability': function (v) {
      var pb = v.pb / 100;
      return { pa: (v.pab / 100 * pb + v.pab2 / 100 * (1 - pb)) * 100 };
    },
    'keplers-third-law': function (v) {
      var t = Math.pow(v.a, 1.5);
      return { t: t, days: t * 365.25 };
    },
    'matthiessens-rule': function (v) {
      var tot = v.rt + v.rr;
      return { tot: tot, share: tot ? v.rr / tot * 100 : 0 };
    },
    'faradays-laws-of-electrolysis': function (v) {
      var q = v.i * v.t;
      return { m: q * v.mm / (v.n * 96485.332), q: q };
    },
    'the-venturi-effect': function (v) {
      var v2 = v.v1 * v.a1 / v.a2;
      return { v2: v2, dp: v.rho / 2 * (v2 * v2 - v.v1 * v.v1) };
    },
    'capillary-action': function (v) {
      return { h: 2 * v.g * Math.cos(v.th * Math.PI / 180) / (v.rho * 9.80665 * v.r) * 1000 };
    },
    'bayes-theorem': function (v) {
      var pr = v.prior / 100, se = v.sens / 100, sp = v.spec / 100;
      var tp = pr * se, fp = (1 - pr) * (1 - sp);
      return { post: (tp + fp) ? (tp / (tp + fp)) * 100 : 0, fp: tp ? fp / tp : Infinity };
    },
  };

  function wire(root) {
    var slug = root.getAttribute('data-widget');
    var calc = LAWS[slug];
    if (!calc) return;
    var ranges = root.querySelectorAll('input[type=range][data-w]');

    function readOne(el) {
      var raw = parseFloat(el.value);
      if (el.getAttribute('data-log')) {
        // the slider carries a 0..1000 POSITION; the real range is in data-min/max
        var lo = parseFloat(el.getAttribute('data-min'));
        var hi = parseFloat(el.getAttribute('data-max'));
        var t = raw / 1000;
        raw = Math.exp(Math.log(lo) + t * (Math.log(hi) - Math.log(lo)));
      }
      return raw;
    }

    function run() {
      var vals = {};
      for (var i = 0; i < ranges.length; i++) {
        var el = ranges[i];
        var v = readOne(el);
        vals[el.getAttribute('data-w')] = v;
        var out = root.querySelector('[data-wout="' + el.getAttribute('data-w') + '"]');
        if (out) out.textContent = FMT(v, el.getAttribute('data-unit') || '');
      }
      var res;
      try { res = calc(vals); } catch (e) { return; }
      for (var k in res) {
        if (!Object.prototype.hasOwnProperty.call(res, k)) continue;
        var cell = root.querySelector('[data-wres="' + k + '"]');
        if (!cell) continue;
        cell.textContent = FMT(res[k], cell.getAttribute('data-unit') || '');
      }
    }

    for (var i = 0; i < ranges.length; i++) {
      ranges[i].addEventListener('input', run);
    }
    run();
  }

  function init() {
    var all = document.querySelectorAll('[data-widget]');
    for (var i = 0; i < all.length; i++) wire(all[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
