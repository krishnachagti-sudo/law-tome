/* Engines for the interactions that are not calculators.
 *
 * Same contract as widget.js: no eval, no network, no data of its own. Each
 * engine reads the typed fields inside its own block, does the law's own
 * arithmetic, and writes plain text back. A law with no entry here has no
 * interaction.
 */
(function () {
  'use strict';

  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }

  /* Modular inverse by the extended Euclidean algorithm. Returns null when a
   * and m share a factor, because then no inverse exists and the caller must
   * say so rather than return a number. */
  function inverse(a, m) {
    var g = m, x = 0, x1 = 1, r = ((a % m) + m) % m;
    while (r !== 0) {
      var q = Math.floor(g / r);
      var t = g - q * r; g = r; r = t;
      t = x - q * x1; x = x1; x1 = t;
    }
    if (g !== 1) return null;
    return ((x % m) + m) % m;
  }

  /* The metric-gaming model, shared by Goodhart and Campbell.
   *
   * Each round the population spends a fixed effort budget. A point of the
   * real thing costs cq. A point of metric-only gain costs cg, but a share d
   * of it is caught and reversed, so its effective cost is cg/(1-d). Identical
   * rational agents put the whole budget into whichever is cheaper.
   *
   * Campbell's addition is `disp`: effort that goes into gaming is taken OUT
   * of the real work, so the outcome falls rather than merely stalling. With
   * disp = 0 this is exactly Goodhart.
   */
  function metricGaming(v, disp) {
    var E = 100, rounds = Math.round(v.n);
    var d = v.d / 100;
    var effGame = d >= 1 ? Infinity : v.cg / (1 - d);
    var gaming = effGame < v.cq;
    var q = 100, g = 0, P = [100], Q = [100];
    for (var i = 0; i < rounds; i++) {
      if (gaming) {
        var gained = E / effGame;
        g += gained;
        q -= disp * gained;              // Campbell: the work is displaced
        if (q < 0) q = 0;
      } else {
        q += E / v.cq;
      }
      P.push(q + g);
      Q.push(q);
    }
    return {
      series: { p: P, q: Q },
      p: q + g,
      q: q,
      g: g,
      gaming: gaming,
      route: gaming ? 'gaming the measure' : 'doing the work',
    };
  }

  var ENGINES = {
    'goodharts-law': function (v) {
      var r = metricGaming(v, 0);
      return {
        series: r.series,
        out: {
          p: r.p, q: r.q,
          share: r.p > 0 ? r.g / r.p * 100 : 0,
          route: r.route,
        },
      };
    },
    'campbells-law': function (v) {
      var r = metricGaming(v, v.disp / 100);
      return {
        series: r.series,
        out: {
          p: r.p, q: r.q,
          drop: (r.q / 100 - 1) * 100,
          route: r.route,
        },
      };
    },
    'the-chinese-remainder-theorem': function (f) {
      var pairs = [], i;
      for (i = 0; i < 3; i++) {
        var r = f['r' + i], m = f['m' + i];
        if (!isFinite(r) || !isFinite(m)) return { error: 'Fill in every box.' };
        m = Math.round(m); r = Math.round(r);
        if (m < 2) return { error: 'Every modulus must be at least 2.' };
        pairs.push([((r % m) + m) % m, m]);
      }
      // The precondition, checked rather than assumed. This is the whole
      // reason the page had no slider.
      for (i = 0; i < pairs.length; i++) {
        for (var j = i + 1; j < pairs.length; j++) {
          var g = gcd(pairs[i][1], pairs[j][1]);
          if (g !== 1) {
            return { error: 'The moduli ' + pairs[i][1] + ' and ' + pairs[j][1]
              + ' share the factor ' + g + ', so they are not coprime and the theorem does not apply here.' };
          }
        }
      }
      var N = 1;
      for (i = 0; i < pairs.length; i++) N *= pairs[i][1];
      if (N > 9e15) return { error: 'Those moduli multiply past what this page can compute exactly.' };
      var x = 0, work = [];
      for (i = 0; i < pairs.length; i++) {
        var ri = pairs[i][0], mi = pairs[i][1];
        var Ni = N / mi;
        var yi = inverse(Ni, mi);
        if (yi === null) return { error: 'No inverse exists, so the moduli are not coprime.' };
        x = (x + ri * (Ni % N) * yi) % N;
        work.push('r' + (i + 1) + ' = ' + ri + ',  N' + (i + 1) + ' = ' + N + '/' + mi + ' = ' + Ni
          + ',  inverse of ' + Ni + ' mod ' + mi + ' is ' + yi
          + '  ->  term ' + (ri * Ni * yi));
      }
      x = ((x % N) + N) % N;
      var checks = [];
      for (i = 0; i < pairs.length; i++) {
        checks.push(x + ' mod ' + pairs[i][1] + ' = ' + (x % pairs[i][1]));
      }
      return {
        result: 'x = ' + x + '   (and every x + ' + N + 'k)',
        work: ['N = ' + N].concat(work).concat(['Check: ' + checks.join(',  ')]),
      };
    },
  };

  /* kind: spot. The cases and their explanations are already in the page and
   * readable with no script at all. This turns that list into a quiz: hide the
   * explanations, add two buttons per case, reveal on answer, keep score.
   * Nothing is inserted that was not already served. */
  function wireSpot(root) {
    var yes = root.getAttribute('data-yes'), no = root.getAttribute('data-no');
    var cases = root.querySelectorAll('[data-ix-case]');
    var scoreEl = root.querySelector('[data-ix-score]');
    var right = 0, done = 0;

    function tell() {
      scoreEl.hidden = false;
      scoreEl.textContent = done < cases.length
        ? right + ' of ' + done + ' so far'
        : 'Final: ' + right + ' of ' + cases.length;
    }

    for (var i = 0; i < cases.length; i++) {
      (function (li) {
        var want = li.getAttribute('data-answer') === '1';
        var why = li.querySelector('[data-ix-why]');
        why.hidden = true;
        var bar = document.createElement('div');
        bar.className = 'ix-choices';
        [[yes, true], [no, false]].forEach(function (pair) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'ix-choice';
          b.textContent = pair[0];
          b.addEventListener('click', function () {
            if (li.getAttribute('data-ix-done')) return;
            li.setAttribute('data-ix-done', '1');
            var ok = pair[1] === want;
            if (ok) right++;
            done++;
            li.setAttribute('data-ix-verdict', ok ? 'right' : 'wrong');
            b.setAttribute('data-ix-picked', '1');
            var all = bar.querySelectorAll('button');
            for (var j = 0; j < all.length; j++) all[j].disabled = true;
            why.hidden = false;
            tell();
          });
          bar.appendChild(b);
        });
        li.insertBefore(bar, why);
      }(cases[i]));
    }
  }

  var FMT = function (v, unit) {
    if (unit === 'text') return v;
    if (unit === 'bool') return v ? 'yes' : 'no';
    if (isNaN(v)) return '—';
    if (!isFinite(v)) return '∞';
    if (unit === 'int') return Math.round(v).toLocaleString('en-US');
    var s;
    if (unit === '%') s = (Math.abs(v) < 1 ? v.toFixed(2) : v.toFixed(1));
    else if (Math.abs(v) >= 1000) s = Math.round(v).toLocaleString('en-US');
    else if (Math.abs(v) >= 100) s = v.toFixed(0);
    else if (Math.abs(v) >= 10) s = v.toFixed(1);
    else s = v.toFixed(2);
    return s + (unit || '');
  };

  var NS = 'http://www.w3.org/2000/svg';

  /* Two lines on a shared scale. Drawn rather than described because the whole
   * point is the moment they part company; the readouts underneath carry the
   * same numbers for anyone who cannot see it. */
  function draw(box, series, ids) {
    while (box.firstChild) box.removeChild(box.firstChild);
    var W = 600, H = 190, pad = 6;
    var all = [];
    for (var k = 0; k < ids.length; k++) all = all.concat(series[ids[k]]);
    var lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
    if (hi === lo) hi = lo + 1;
    // Headroom, so a line that never moves does not sit flush on the frame
    // edge underneath the starting-level marker.
    var slack = (hi - lo) * 0.09;
    lo -= slack; hi += slack;
    var n = series[ids[0]].length;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('class', 'ix-svg');
    var base = document.createElementNS(NS, 'line');
    var y0 = H - pad - (100 - lo) / (hi - lo) * (H - 2 * pad);
    base.setAttribute('x1', 0); base.setAttribute('x2', W);
    base.setAttribute('y1', y0); base.setAttribute('y2', y0);
    base.setAttribute('class', 'ix-base');
    svg.appendChild(base);
    for (k = 0; k < ids.length; k++) {
      var pts = [], d = series[ids[k]];
      for (var i = 0; i < n; i++) {
        var x = pad + i / (n - 1) * (W - 2 * pad);
        var y = H - pad - (d[i] - lo) / (hi - lo) * (H - 2 * pad);
        pts.push(x.toFixed(1) + ',' + y.toFixed(1));
      }
      var pl = document.createElementNS(NS, 'polyline');
      pl.setAttribute('points', pts.join(' '));
      pl.setAttribute('class', 'ix-line');
      pl.setAttribute('data-series', k);
      svg.appendChild(pl);
    }
    box.appendChild(svg);
  }

  function wireSim(root) {
    var slug = root.getAttribute('data-interactive');
    var run = ENGINES[slug];
    if (!run) return;
    var ranges = root.querySelectorAll('input[type=range][data-ix]');
    var box = root.querySelector('[data-ix-chart]');

    function go() {
      var vals = {}, i;
      for (i = 0; i < ranges.length; i++) {
        var el = ranges[i], val = parseFloat(el.value);
        vals[el.getAttribute('data-ix')] = val;
        var o = root.querySelector('[data-ixout="' + el.getAttribute('data-ix') + '"]');
        if (o) o.textContent = FMT(val, el.getAttribute('data-unit') || '');
      }
      var res;
      try { res = run(vals); } catch (e) { return; }
      for (var key in res.out) {
        if (!Object.prototype.hasOwnProperty.call(res.out, key)) continue;
        var cell = root.querySelector('[data-ixres="' + key + '"]');
        if (cell) cell.textContent = FMT(res.out[key], cell.getAttribute('data-unit') || '');
      }
      if (box) draw(box, res.series, Object.keys(res.series));
    }

    for (var i = 0; i < ranges.length; i++) ranges[i].addEventListener('input', go);
    go();
  }

  function wire(root) {
    var slug = root.getAttribute('data-interactive');
    if (root.className.indexOf('ix-spot') !== -1) return wireSpot(root);
    if (root.className.indexOf('ix-sim') !== -1) return wireSim(root);
    var run = ENGINES[slug];
    if (!run) return;
    var fields = root.querySelectorAll('input[data-ix]');
    var msg = root.querySelector('[data-ix-msg]');
    var outResult = root.querySelector('[data-ix-out="result"]');
    var outWork = root.querySelector('[data-ix-out="work"]');

    function go() {
      var f = {}, i;
      for (i = 0; i < fields.length; i++) {
        f[fields[i].getAttribute('data-ix')] = parseFloat(fields[i].value);
      }
      var res;
      try { res = run(f); } catch (e) { return; }
      if (res.error) {
        msg.textContent = res.error;
        msg.hidden = false;
        outResult.textContent = '';
        outWork.textContent = '';
        root.setAttribute('data-ix-state', 'invalid');
        return;
      }
      msg.textContent = '';
      msg.hidden = true;
      root.setAttribute('data-ix-state', 'ok');
      outResult.textContent = res.result;
      // textContent per line, never innerHTML: the engine's strings are built
      // from the reader's own numbers and must never be parsed as markup.
      outWork.textContent = '';
      for (i = 0; i < res.work.length; i++) {
        var p = document.createElement('p');
        p.className = 'ix-step';
        p.textContent = res.work[i];
        outWork.appendChild(p);
      }
    }

    for (var i = 0; i < fields.length; i++) {
      fields[i].addEventListener('input', go);
      fields[i].addEventListener('change', go);
    }
    go();
  }

  function init() {
    var all = document.querySelectorAll('[data-interactive]');
    for (var i = 0; i < all.length; i++) wire(all[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
