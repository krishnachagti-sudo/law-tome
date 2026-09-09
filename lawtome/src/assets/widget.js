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

  // Superscript exponents, so 1e-4 reads as 10\u207b\u2074 rather than as 'e-4'.
  var SUP = function (n) {
    var map = { '0':'\u2070','1':'\u00b9','2':'\u00b2','3':'\u00b3','4':'\u2074',
                '5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079','-':'\u207b' };
    return String(n).split('').map(function (c) { return map[c] || c; }).join('');
  };

  var FMT = function (v, unit) {
    // NaN and Infinity are different answers and must not print the same.
    // Infinity is a real result (Amdahl's ceiling when everything parallelises).
    // NaN means the quantity does not exist for these inputs — there is no
    // critical angle going into a denser medium, and no Bragg angle when the
    // wavelength cannot fit the spacing. Printing '∞' there claimed an
    // infinite angle, which is nonsense rather than merely unhelpful.
    if (unit === 'bool') return v ? 'yes' : 'no';
    if (isNaN(v)) return '—';
    if (!isFinite(v)) return '∞';
    // Counts and remainders are integers. Printing "1.00" for a remainder, or
    // "1.00" for a yes/no, reads as a measurement with two decimals of
    // precision rather than as the exact answer it is.
    if (unit === 'int') return Math.round(v).toLocaleString('en-US');
    var s;
    if (unit === '%') s = (v < 1 ? v.toFixed(2) : v.toFixed(1));
    // Fixed decimals lie about magnitude at the extremes. A diffusion flux of
    // 1e-4 and a drag force of 1.9e-7 both printed '0.00', which reads as the
    // law returning nothing rather than returning a small number. Anything
    // below a hundredth, or above a billion, switches to powers of ten.
    else if (v !== 0 && (Math.abs(v) < 0.01 || Math.abs(v) >= 1e9)) {
      var ex = Math.floor(Math.log(Math.abs(v)) / Math.LN10);
      var mant = v / Math.pow(10, ex);
      // Check AFTER rounding: 0.0099999 has mantissa 9.9999, which toFixed(3)
      // carries to 10.000 and would print as 10.000\u00d710\u207b\u00b3.
      if (Math.abs(Number(mant.toFixed(3))) >= 10) { mant /= 10; ex += 1; }
      return mant.toFixed(3) + '\u00d7' + '10' + SUP(ex) + (unit || '');
    }
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
    // ---- wave 3, 2026-09-09 ----
    'the-van-t-hoff-equation': function (v) {
      var R = 8.314462618;
      var k2 = v.k1 * Math.exp(-(v.dh * 1000 / R) * (1 / v.t2 - 1 / v.t1));
      return { k2: k2, fold: k2 / v.k1 };
    },
    'the-eyring-equation': function (v) {
      var kB = 1.380649e-23, h = 6.62607015e-34, R = 8.314462618;
      var k = (kB * v.t / h) * Math.exp(-(v.dg * 1000) / (R * v.t));
      return { k: k, half: Math.LN2 / k };
    },
    'fermats-little-theorem': function (v) {
      var a = Math.round(v.a), p = Math.round(v.p);
      // modpow keeps every intermediate under p^2, so Number stays exact here.
      function modpow(b, e, m) {
        var r = 1; b %= m;
        while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e >>= 1; }
        return r;
      }
      function isPrime(n) {
        if (n < 2) return 0;
        for (var i = 2; i * i <= n; i++) if (n % i === 0) return 0;
        return 1;
      }
      return { r: (p > 1 && a % p !== 0) ? modpow(a, p - 1, p) : NaN, prime: isPrime(p) };
    },
    'helmholtz-resonance': function (v) {
      // cm -> m: A/1e4, V/1e6, L/100
      var A = v.a / 1e4, V = v.v / 1e6, L = v.l / 100;
      return { f: (343 / (2 * Math.PI)) * Math.sqrt(A / (V * L)) };
    },
    'the-clausius-clapeyron-relation': function (v) {
      var R = 8.314462618;
      return { p2: v.p1 * Math.exp(-(v.dh * 1000 / R) * (1 / v.t2 - 1 / v.t1)) };
    },
    'henrys-law': function (v) { return { c: v.kh * v.p }; },
    'the-henderson-hasselbalch-equation': function (v) {
      return { ph: v.pka + Math.log(v.ratio) / Math.LN10 };
    },
    'the-hall-petch-relationship': function (v) {
      return { sy: v.s0 + v.k / Math.sqrt(v.d) };
    },
    'escape-velocity': function (v) {
      var G = 6.67430e-11, ME = 5.9722e24, RE = 6.371e6;
      return { v: Math.sqrt(2 * G * (v.m * ME) / (v.r * RE)) / 1000 };
    },
    'wiens-displacement-law': function (v) {
      return { lam: 2.897771955e-3 / v.t * 1e9 };
    },
    'the-coupon-collectors-problem': function (v) {
      var n = Math.round(v.n), H = 0;
      for (var i = 1; i <= n; i++) H += 1 / i;
      return { e: n * H, per: H };
    },
    'the-square-cube-law': function (v) {
      var s = v.s;
      return { a: s * s, v: s * s * s, load: s };
    },
    'the-wiedemann-franz-law': function (v) {
      return { kap: 2.44e-8 * v.t * (v.sig * 1e6) };
    },
    // ---- wave 4, 2026-09-09 ----
    'the-taylor-rule': function (v) {
      var i = v.r + v.pi + 0.5 * (v.pi - v.tgt) + 0.5 * v.gap;
      return { i: i, real: i - v.pi };
    },
    'reeds-law': function (v) {
      var n = Math.round(v.n);
      var g = Math.pow(2, n) - n - 1, pairs = n * (n - 1) / 2;
      return { g: g, pairs: pairs, ratio: pairs ? g / pairs : Infinity };
    },
    'dennard-scaling': function (v) {
      var k = Math.pow(v.k, Math.round(v.g));
      return { dens: k * k, speed: k, pd: 1 };
    },
    'cherenkov-radiation': function (v) {
      var cos = 1 / (v.n * v.b);
      return { th: cos <= 1 ? Math.acos(cos) * 180 / Math.PI : NaN,
               thr: 1 / v.n, glow: v.b > 1 / v.n ? 1 : 0 };
    },
    'cromwells-rule': function (v) {
      var pr = v.pr / 100;
      // Odds form makes the point: a prior of exactly 0 has odds 0, and 0 times
      // any likelihood ratio is still 0. No evidence can ever move it.
      var odds = pr / (1 - pr) * v.lr;
      var post = pr >= 1 ? 1 : odds / (1 + odds);
      return { post: post * 100, moved: Math.abs(post - pr) > 1e-12 ? 1 : 0 };
    },
    'the-minimax-theorem': function (v) {
      var a = v.a, b = v.b, c = v.c, d = v.d;
      // A saddle point exists when some entry is its row min and column max.
      var saddle = 0;
      var rows = [[a, b], [c, d]];
      for (var i = 0; i < 2 && !saddle; i++) {
        for (var j = 0; j < 2 && !saddle; j++) {
          var x = rows[i][j];
          if (x === Math.min(rows[i][0], rows[i][1]) && x === Math.max(rows[0][j], rows[1][j])) saddle = 1;
        }
      }
      var den = a + d - b - c;
      if (saddle || den === 0) {
        // pure play: the row player's maximin
        var mm = Math.max(Math.min(a, b), Math.min(c, d));
        return { v: mm, p: Math.min(a, b) >= Math.min(c, d) ? 100 : 0, saddle: 1 };
      }
      return { v: (a * d - b * c) / den, p: (d - c) / den * 100, saddle: 0 };
    },
    'simpsons-paradox': function (v) {
      var e = v.easy / 100, h = v.hard / 100, edge = v.edge / 100;
      var aa = v.aa / 100, ab = v.ab / 100;
      var ra = aa * e + (1 - aa) * h;
      var rb = ab * (e + edge) + (1 - ab) * (h + edge);
      return { ra: ra * 100, rb: rb * 100, rev: rb < ra ? 1 : 0 };
    },
    // ---- wave 5a: core physics ----
    'ohms-law': function (v) { var i=v.v/v.r; return { i:i, pw:v.v*i }; },
    'hookes-law': function (v) { return { f:v.k*v.x, e:0.5*v.k*v.x*v.x }; },
    'coulombs-law': function (v) {
      var q1=v.q1*1e-6, q2=v.q2*1e-6;
      return { f: Math.abs(8.9875517873681764e9*q1*q2/(v.r*v.r)), dir: (q1*q2)<0 ? 1 : 0 };
    },
    'newtons-law-of-universal-gravitation': function (v) {
      return { f: 6.67430e-11*v.m1*v.m2/(v.r*v.r) };
    },
    'mass-energy-equivalence': function (v) {
      var c=299792458, e=v.m*c*c;
      return { e:e, tnt: e/4.184e9 };   // 1 tonne TNT = 4.184e9 J
    },
    'stefan-boltzmann-law': function (v) {
      var j=5.670374419e-8*Math.pow(v.t,4);
      return { j:j, p:j*v.a };
    },
    'maluss-law': function (v) {
      var c=Math.cos(v.th*Math.PI/180); return { i: c*c*100 };
    },
    'torricellis-law': function (v) {
      var sp=Math.sqrt(2*9.80665*v.h);
      return { v:sp, q: sp*v.a*1000 };
    },
    'stokes-law': function (v) { return { f: 6*Math.PI*v.eta*v.r*v.v }; },
    'reynolds-number': function (v) {
      var re=v.rho*v.v*v.l/v.eta;
      return { re:re, reg: re>4000 ? 1 : 0 };
    },
    'the-hagen-poiseuille-equation': function (v) {
      var r=v.r/1000;
      return { q: Math.PI*v.dp*Math.pow(r,4)/(8*v.eta*v.l)*1000 };
    },
    'the-carnot-theorem': function (v) {
      return { eff: v.th>0 ? (1 - v.tc/v.th)*100 : NaN };
    },
    'the-photoelectric-effect': function (v) {
      var hc=1239.841984;                 // eV.nm
      var e=hc/v.lam;
      return { ke: Math.max(0, e-v.phi), emit: e>v.phi ? 1 : 0, thr: hc/v.phi };
    },
    'the-bohr-model': function (v) {
      var n1=Math.round(v.n1), n2=Math.round(v.n2);
      var de=13.605693*(1/(n2*n2) - 1/(n1*n1));   // positive when n1 > n2
      return { de: de, lam: de>0 ? 1239.841984/de : NaN };
    },
    'the-rydberg-formula': function (v) {
      var n1=Math.round(v.n1), n2=Math.round(v.n2);
      if (n2<=n1) return { lam: NaN, series: 0 };
      var inv=1.0973731568e7*(1/(n1*n1) - 1/(n2*n2));
      var lam=1/inv*1e9;
      return { lam: lam, series: (lam>=380 && lam<=750) ? 1 : 0 };
    },
    'heisenbergs-uncertainty-principle': function (v) {
      var dp=1.054571817e-34/(2*v.dx*1e-9);
      return { dp: dp, dv: dp/9.1093837015e-31 };
    },
    'the-law-of-laplace': function (v) {
      var r=v.r/1000;
      return { dp: 2*v.g/r, dpb: 4*v.g/r };
    },
    'ficks-laws-of-diffusion': function (v) {
      return { j: v.d*v.dc/v.dx, time: v.dx*v.dx/(2*v.d) };
    },
    'the-ideal-gas-law': function (v) {
      var vm = v.v / 1000;                       // L -> m3
      var p = v.n * 8.314462618 * v.t / vm;      // Pa
      return { p: p / 1000, atm: p / 101325, mv: v.v / v.n };
    },
    'charles-law': function (v) {
      var t1 = v.t1 + 273.15, t2 = v.t2 + 273.15;
      if (t1 <= 0) return { v2: NaN, ch: NaN };
      var v2 = v.v1 * t2 / t1;
      return { v2: v2, ch: (v2 / v.v1 - 1) * 100 };
    },
    'gay-lussacs-law': function (v) {
      var t1 = v.t1 + 273.15, t2 = v.t2 + 273.15;
      if (t1 <= 0) return { p2: NaN, ch: NaN };
      var p2 = v.p1 * t2 / t1;
      return { p2: p2, ch: (p2 / v.p1 - 1) * 100 };
    },
    'avogadros-law': function (v) {
      var v2 = v.v1 * v.n2 / v.n1;
      return { v2: v2, mv: v.v1 / v.n1, mol: (v.n2 - v.n1) * 6.02214076e23 };
    },
    'daltons-law': function (v) {
      var t = v.p1 + v.p2 + v.p3;
      return { tot: t, f1: t ? v.p1 / t * 100 : NaN };
    },
    'arrhenius-equation': function (v) {
      var R = 8.314462618, t = v.t + 273.15, ea = v.ea * 1000;
      if (t <= 0) return { k: NaN, q10: NaN };
      return { k: v.a * Math.exp(-ea / (R * t)),
               q10: Math.exp((ea / R) * (1 / t - 1 / (t + 10))) };
    },
    'nernst-equation': function (v) {
      var n = Math.round(v.n), rtf = 8.314462618 * 298.15 / 96485.332;  // 0.025693 V
      return { e: v.e0 - (rtf / n) * Math.log(v.q), dec: rtf * Math.LN10 / n * 1000 };
    },
    'grahams-law-of-effusion': function (v) {
      var r = Math.sqrt(v.m2 / v.m1);
      return { r: r, t: r };
    },
    'the-gibbs-phase-rule': function (v) {
      var f = Math.round(v.c) - Math.round(v.p) + 2;
      return { f: f, over: f < 0 ? 1 : 0 };
    },
    'the-pythagorean-theorem': function (v) {
      var a = Math.round(v.a), b = Math.round(v.b), c = Math.sqrt(a * a + b * b);
      return { c: c, ar: a * b / 2, trip: Math.abs(c - Math.round(c)) < 1e-9 ? 1 : 0 };
    },
    'eulers-polyhedron-formula': function (v) {
      var V = Math.round(v.v), E = Math.round(v.e), F = 2 - V + E;
      // A convex polyhedron needs at least 4 of each, and every face has at
      // least 3 edges with each edge shared by two, so 2E >= 3F and 2E >= 3V.
      var ok = (F >= 4 && V >= 4 && 2 * E >= 3 * F && 2 * E >= 3 * V) ? 1 : 0;
      return { f: F, ok: ok };
    },
    'the-binomial-theorem': function (v) {
      var n = Math.round(v.n), k = Math.round(v.k);
      if (k > n || k < 0) return { c: NaN, sh: NaN };
      var c = 1;
      for (var i = 0; i < k; i++) c = c * (n - i) / (i + 1);
      c = Math.round(c);
      return { c: c, sh: c / Math.pow(2, n) * 100 };
    },
    'wilsons-theorem': function (v) {
      var n = Math.round(v.n), r = 1;
      // (n-1)! reduced at every step: 60! overflows a double, 60! mod 60 does not.
      for (var i = 2; i < n; i++) r = (r * i) % n;
      return { r: r, w: r === n - 1 ? 1 : 0 };
    },
    'the-prime-number-theorem': function (v) {
      var l = Math.log(v.x);
      return { p1: v.x / l, p2: l > 1 ? v.x / (l - 1) : NaN, d: l };
    },
    'benfords-law': function (v) {
      var d = Math.round(v.d), p = Math.log(1 + 1 / d) / Math.LN10;
      return { p: p * 100, c: p * v.n, v: v.n / 9 };
    },
    'chebyshevs-inequality': function (v) {
      var b = 1 / (v.k * v.k);
      if (b > 1) b = 1;                     // the bound is vacuous below k = 1
      return { out: b * 100, inn: (1 - b) * 100 };
    },
    'markovs-inequality': function (v) {
      var b = v.mu / v.a;
      return { p: (b > 1 ? 1 : b) * 100, r: v.a / v.mu };
    },
    'bessels-correction': function (v) {
      var n = Math.round(v.n);
      if (n < 2) return { sc: NaN, up: NaN, uv: NaN };
      var f = Math.sqrt(n / (n - 1));
      return { sc: v.sd * f, up: (f - 1) * 100, uv: 100 / n };
    },
    'the-bonferroni-correction': function (v) {
      var m = Math.round(v.m), a = v.a / 100;
      return { pe: a / m * 100, un: (1 - Math.pow(1 - a, m)) * 100 };
    },
    'the-monty-hall-problem': function (v) {
      var n = Math.round(v.n), k = Math.round(v.k);
      if (k > n - 2) return { st: NaN, sw: NaN, r: NaN };   // host must leave one shut
      var st = 1 / n, sw = (1 - st) / (n - 1 - k);
      return { st: st * 100, sw: sw * 100, r: sw / st };
    },
    'the-german-tank-problem': function (v) {
      var m = Math.round(v.m), k = Math.round(v.k);
      if (k > m) return { n: NaN, gap: NaN };               // cannot see more than exist
      var n = m * (1 + 1 / k) - 1;
      return { n: n, gap: n - m };
    },
    'number-needed-to-treat': function (v) {
      var arr = (v.cer - v.eer) / 100;
      return { arr: arr * 100,
               rrr: v.cer ? (v.cer - v.eer) / v.cer * 100 : NaN,
               nnt: arr > 0 ? 1 / arr : NaN };
    },
    'central-limit-theorem': function (v) {
      var n = Math.round(v.n), se = v.sd / Math.sqrt(n);
      return { se: se, moe: 1.959964 * se, n2: n * 4 };
    },
    'the-secretary-problem': function (v) {
      var n = Math.round(v.n), k = Math.max(1, Math.round(n / Math.E)), s = 0;
      for (var i = k; i < n; i++) s += 1 / i;
      var p = (k / n) * s;
      return { k: k, p: p * 100, g: p * n };
    },
    'hubbles-law': function (v) {
      var vel = v.h * v.d;                      // km/s
      // 1/H0 with H0 in km/s/Mpc, expressed in billions of years
      return { v: vel, c: vel / 299792.458 * 100, t: 977.792 / v.h };
    },
    'drake-equation': function (v) {
      var base = v.r * v.fp * v.ne * v.fl * v.fi * v.fc;
      // L is the only term with no upper bound in evidence, and it multiplies
      // everything else. Showing the same product at a million years is the
      // cheapest way to see that the answer is a statement about longevity.
      return { n: base * v.l, nl: base * 1e6 };
    },
    'the-schwarzschild-radius': function (v) {
      var M = v.m * 1.98892e30;
      var rs = 2 * 6.67430e-11 * M / (299792458 * 299792458);
      return { rs: rs / 1000, rho: M / (4 / 3 * Math.PI * rs * rs * rs) };
    },
    'the-roche-limit': function (v) {
      var d = 2.44 * v.r * Math.pow(v.rm / v.rs, 1 / 3);
      return { d: d, rr: d / v.r };
    },
    'the-hill-sphere': function (v) {
      var AU = 1.495978707e8;                   // km
      var r = v.a * (1 - v.e) * Math.pow(v.q / 3, 1 / 3);
      return { km: r * AU, pc: r / v.a * 100 };
    },
    'the-chandrasekhar-limit': function (v) {
      var lim = 1.456 * Math.pow(2 / v.mu, 2);
      return { lim: lim, over: v.m > lim ? 1 : 0, head: lim - v.m };
    },
    'the-doppler-effect': function (v) {
      var c = 343;                              // speed of sound, 20 C dry air
      if (v.vs >= c) return { f2: NaN, sh: NaN, boom: 1 };
      var f2 = v.f * (c + v.vo) / (c - v.vs);
      return { f2: f2, sh: (f2 / v.f - 1) * 100, boom: 0 };
    },
    'the-kelly-criterion': function (v) {
      var p = v.p / 100, q = 1 - p, b = v.b;
      var f = (b * p - q) / b;
      // Growth is the log-utility rate. Negative edge means the honest answer
      // is a negative stake, i.e. do not take the bet; growth is reported at
      // the clamped stake of zero so the number stays meaningful.
      var g = function (x) {
        if (x <= 0) return 0;
        if (x >= 1) return -Infinity;
        return p * Math.log(1 + b * x) + q * Math.log(1 - x);
      };
      return { f: f * 100, g: g(f) * 100, gd: g(f * 2) * 100 };
    },
    'the-gini-coefficient': function (v) {
      var x = v.x / 100, y = v.y / 100;
      // Two-segment Lorenz curve through (0,0), (1-x, 1-y), (1,1).
      var area = 0.5 * ((1 - x) * (1 - y) + x * ((1 - y) + 1));
      var bottomHalf = (0.5 <= 1 - x)
        ? 0.5 * (1 - y) / (1 - x)
        : (1 - y) + (0.5 - (1 - x)) * y / x;
      return { g: 1 - 2 * area, b: bottomHalf * 100, rat: (y / x) / ((1 - y) / (1 - x)) };
    },
    'the-herfindahl-hirschman-index': function (v) {
      var h = v.a * v.a + v.b * v.b + v.c * v.c + v.d * v.d;
      return { h: h, eq: h > 0 ? 10000 / h : Infinity, con: h > 2500 ? 1 : 0 };
    },
    'okuns-law': function (v) {
      var gap = -v.c * (v.u - v.un);
      return { gap: gap, lost: gap / 100 * 20000 };   // $20tn, in billions
    },
    'the-quantity-theory-of-money': function (v) {
      var p = v.m + v.v - v.q;
      return { p: p, yr: p > 0 ? Math.log(2) / Math.log(1 + p / 100) : Infinity };
    },
    'the-poisson-distribution': function (v) {
      var l = v.l, k = Math.round(v.k);
      // Terms built forward from e^-lambda so no factorial is ever formed.
      var term = Math.exp(-l), cum = term;
      for (var i = 1; i <= k; i++) { term = term * l / i; cum += term; }
      return { p: term * 100, ge: (1 - (cum - term)) * 100, z: Math.exp(-l) * 100 };
    },
    'the-nyquist-shannon-sampling-theorem': function (v) {
      var req = 2 * v.f;
      if (v.fs >= req) return { req: req, ok: 1, al: v.f };
      // Under-sampled: the component folds back about the nearest multiple.
      var al = Math.abs(v.f - v.fs * Math.round(v.f / v.fs));
      return { req: req, ok: 0, al: al };
    },
    'gauss-law': function (v) {
      var q = v.q * 1e-9, eps = 8.8541878128e-12;
      return { e: q / (4 * Math.PI * eps * v.r * v.r), fl: q / eps };
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
        // Untouched, a slider means exactly the default the spec asked for.
        // Rounding a default to the nearest of 10,000 positions and reading it
        // back drifts it: Drake's 0.01 came back as 0.009998 and printed as
        // 9.998e-3 beside an identical slider reading 0.01. While el.value
        // still equals the server-rendered attribute, nobody has moved it.
        var init = el.getAttribute('data-init');
        if (init !== null && el.value === el.getAttribute('value')) return parseFloat(init);
        // the slider carries a 0..10000 POSITION; the real range is in data-min/max
        var lo = parseFloat(el.getAttribute('data-min'));
        var hi = parseFloat(el.getAttribute('data-max'));
        var t = raw / 10000;
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
