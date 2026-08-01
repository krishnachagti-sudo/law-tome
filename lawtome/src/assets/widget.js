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
    'the-pareto-principle': function (v) {
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
