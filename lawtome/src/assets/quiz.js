// "Law of the day" (home) + the quiz (/quiz/).
//
// One file, two jobs, each a no-op when its host element is absent:
//   1. #lotd  — the home page ships the build day's law server-rendered; this
//      recomputes the pick for the reader's actual date and swaps it in only if
//      the build has gone stale. It never blanks correct markup.
//   2. #quiz  — a ten-question round, four question modes, drawn from the
//      prebuilt search index.
//
// XSS discipline matches search.js: every corpus string reaches the DOM via
// .textContent, never innerHTML. The only markup built here is our own.
(function () {
  'use strict';

  function computeBase() {
    var s = document.currentScript;
    if (!s) {
      var all = document.getElementsByTagName('script');
      for (var i = 0; i < all.length; i++) {
        if (/assets\/quiz\.js(\?|$)/.test(all[i].src)) { s = all[i]; break; }
      }
    }
    if (s && s.src) {
      var m = s.src.replace(/assets\/quiz\.js(\?.*)?$/, '');
      try { return new URL(m, location.href).pathname; } catch (e) { return '/'; }
    }
    return '/';
  }
  var BASE = computeBase();

  // Mirror of build/quiz.dayIndex — same date + count => same index.
  function dayIndex(dateStr, count) {
    var n = Number(count) || 0;
    if (n < 1) return 0;
    var s = String(dateStr || ''), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h % n;
  }
  function todayKey() {
    try { return new Date().toISOString().slice(0, 10); } catch (e) { return '2026-01-01'; }
  }

  var TIERS = ['Empirical', 'Heuristic', 'Folk-adage', 'Contested'];
  var TIER_SAYS = {
    Empirical: 'published measurement backs it',
    Heuristic: 'a dependable rule of thumb, not a proven result',
    'Folk-adage': 'a saying that hardened into a "law"',
    Contested: 'specialists still argue about it',
  };
  var BADGE = { Empirical: 'b-emp', Heuristic: 'b-heu', 'Folk-adage': 'b-folk', Contested: 'b-con' };
  var CATS = (window.LT_CATS && typeof window.LT_CATS === 'object') ? window.LT_CATS : {};
  function fieldName(slug) { return CATS[slug] || String(slug || ''); }

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function lawHref(slug) { return BASE + 'laws/' + encodeURIComponent(slug) + '/'; }

  // ---- law of the day (home page) -----------------------------------------
  function renderLotd(rows) {
    var host = document.getElementById('lotd');
    if (!host) return;
    var law = rows[dayIndex(todayKey(), rows.length)];
    if (!law) return;
    var body = host.querySelector('.lotd-body');
    if (!body) { body = el('div', 'lotd-body'); host.appendChild(body); }
    // The server already rendered a law. If it is the right one, leave it alone
    // — repainting identical markup only risks a flash.
    var have = body.querySelector('.lotd-card');
    if (have && have.getAttribute('href') === lawHref(law.slug)) return;

    body.textContent = '';
    var a = el('a', 'lotd-card');
    a.setAttribute('href', lawHref(law.slug));
    var top = el('div', 'lotd-top');
    var no = el('span', 'lotd-no'); no.textContent = '№ ' + (law.no || '');
    top.appendChild(no);
    if (law.reliability) {
      var badge = el('span', 'badge ' + (BADGE[law.reliability] || 'b-heu'));
      badge.textContent = law.reliability;
      top.appendChild(badge);
    }
    var h = el('div', 'lotd-name'); h.textContent = law.name || '';
    var say = el('div', 'lotd-say'); say.textContent = '“' + (law.statement || '') + '”';
    a.appendChild(top); a.appendChild(h); a.appendChild(say);
    body.appendChild(a);
  }

  // ---- the quiz -----------------------------------------------------------
  var ROUND = 10;
  var BEST_KEY = 'lawtome:quiz:best';

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function readBest() {
    try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { return 0; }
  }
  function writeBest(v) {
    try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* private mode */ }
  }

  /**
   * Three wrong laws for a question. Same-field first — a round where every
   * distractor comes from a different discipline is answerable on vibe alone,
   * which teaches nothing. Falls back to the whole corpus when a field is too
   * small to supply three.
   */
  function distractors(rows, byCat, answer, n) {
    var out = [], used = {}, guard = 0;
    used[answer.slug] = 1;
    var pool = byCat[answer.category] || [];
    while (out.length < n && guard < 400 && pool.length > 1) {
      guard++;
      var c = pool[Math.floor(Math.random() * pool.length)];
      if (used[c.slug]) continue;
      used[c.slug] = 1; out.push(c);
    }
    guard = 0;
    while (out.length < n && guard < 800) {
      guard++;
      var r = rows[Math.floor(Math.random() * rows.length)];
      if (used[r.slug]) continue;
      used[r.slug] = 1; out.push(r);
    }
    return out;
  }

  /**
   * Build one question. Returns {mode, ask, quote, options:[{label, right}], law}
   * — options carry their own label so the renderer never needs to know the mode.
   */
  function makeQuestion(rows, byCat, mode) {
    var answer = pick(rows);
    var wrong, opts;

    if (mode === 'name') {
      if (!answer.statement) return null;
      wrong = distractors(rows, byCat, answer, 3);
      if (wrong.length < 3) return null;
      opts = wrong.map(function (w) { return { label: w.name, right: false }; });
      opts.push({ label: answer.name, right: true });
      return { mode: 'Name that law', ask: 'Which law says this?', quote: answer.statement, options: shuffle(opts), law: answer };
    }

    if (mode === 'says') {
      if (!answer.statement) return null;
      wrong = distractors(rows, byCat, answer, 3).filter(function (w) { return w.statement; });
      if (wrong.length < 3) return null;
      opts = wrong.map(function (w) { return { label: w.statement, right: false }; });
      opts.push({ label: answer.statement, right: true });
      return { mode: 'What does it say?', ask: 'What does ' + answer.name + ' actually state?', quote: '', options: shuffle(opts), law: answer, long: true };
    }

    if (mode === 'field') {
      if (!answer.category) return null;
      var cats = Object.keys(byCat).filter(function (c) { return c !== answer.category; });
      if (cats.length < 3) return null;
      shuffle(cats);
      opts = cats.slice(0, 3).map(function (c) { return { label: fieldName(c), right: false }; });
      opts.push({ label: fieldName(answer.category), right: true });
      return { mode: 'Which field?', ask: 'Which field does ' + answer.name + ' come from?', quote: answer.statement || '', options: shuffle(opts), law: answer };
    }

    // 'tier' — the four ratings are fixed, so this one has no distractor problem
    // and is the hardest of the four: nothing in the statement gives it away.
    if (!answer.reliability) return null;
    opts = TIERS.map(function (t) { return { label: t, right: t === answer.reliability }; });
    return { mode: 'How reliable?', ask: 'How far can ' + answer.name + ' be trusted?', quote: answer.statement || '', options: opts, law: answer, tier: true };
  }

  function initQuiz(rows) {
    var root = document.getElementById('quiz');
    var boot = document.getElementById('quiz-boot');
    if (!root || rows.length < 8) return;

    var byCat = {};
    rows.forEach(function (r) {
      if (!r.category) return;
      (byCat[r.category] || (byCat[r.category] = [])).push(r);
    });

    var askEl = document.getElementById('quiz-ask');
    var stmtEl = document.getElementById('quiz-stmt');
    var optsEl = document.getElementById('quiz-options');
    var afterEl = document.getElementById('quiz-after');
    var modeEl = document.getElementById('quiz-mode');
    var scoreEl = document.getElementById('quiz-score');
    var progEl = document.getElementById('quiz-prog');
    var nextBtn = document.getElementById('quiz-next');
    var doneEl = document.getElementById('quiz-done');
    var finalEl = document.getElementById('quiz-final');
    var recapEl = document.getElementById('quiz-recap');
    var againBtn = document.getElementById('quiz-again');

    var MODES = ['name', 'says', 'field', 'tier'];
    var order = [], asked = 0, score = 0, streak = 0, bestStreak = 0, seen = [];
    // qNo is the question ON SCREEN; asked is how many have been answered. They
    // differ for the whole time the reveal is up, which is when a reader is
    // most likely to be looking at the counter.
    var q = null, qNo = 0, answered = false;

    function newRound() {
      order = shuffle(MODES.concat(MODES, MODES.slice(0, 2))).slice(0, ROUND);
      asked = 0; qNo = 0; score = 0; streak = 0; bestStreak = 0; seen = [];
      if (doneEl) doneEl.hidden = true;
      root.hidden = false;
      nextQuestion();
    }

    function setHud() {
      if (scoreEl) scoreEl.textContent = score + ' / ' + asked + (streak > 1 ? '  ·  ' + streak + ' in a row' : '');
      if (progEl) progEl.style.width = Math.round((asked / ROUND) * 100) + '%';
      if (modeEl && q) modeEl.textContent = 'Q' + qNo + ' of ' + ROUND + '  ·  ' + q.mode;
    }

    function nextQuestion() {
      if (asked >= ROUND) return finish();
      var guard = 0;
      do { q = makeQuestion(rows, byCat, order[asked]); guard++; } while (!q && guard < 40);
      if (!q) return finish();
      qNo = asked + 1;
      answered = false;
      if (afterEl) { afterEl.hidden = true; afterEl.textContent = ''; }
      if (askEl) askEl.textContent = q.ask;
      if (stmtEl) {
        stmtEl.textContent = q.quote ? '“' + q.quote + '”' : '';
        stmtEl.hidden = !q.quote;
      }
      optsEl.textContent = '';
      q.options.forEach(function (opt, i) {
        var b = el('button', 'quiz-opt' + (q.long ? ' quiz-opt--long' : ''));
        b.type = 'button';
        var k = el('span', 'quiz-key'); k.textContent = String(i + 1);
        var t = el('span', 'quiz-opt-t'); t.textContent = opt.label || '';
        b.appendChild(k); b.appendChild(t);
        b.addEventListener('click', function () { answer(opt, b); });
        optsEl.appendChild(b);
      });
      setHud();
      if (nextBtn) nextBtn.disabled = true;
    }

    function answer(opt, btn) {
      if (answered) return;
      answered = true;
      asked++;
      var right = !!opt.right;
      if (right) { score++; streak++; if (streak > bestStreak) bestStreak = streak; }
      else streak = 0;
      seen.push({ law: q.law, right: right });

      var kids = optsEl.children;
      for (var i = 0; i < kids.length; i++) {
        kids[i].disabled = true;
        if (q.options[i] && q.options[i].right) kids[i].classList.add('correct');
      }
      if (!right) btn.classList.add('wrong');

      // The reveal is the teaching moment, so it carries the reason rather than
      // just a tick: what the rating means, or which field it really came from.
      if (afterEl) {
        afterEl.textContent = '';
        var line = el('p', 'quiz-after-l');
        if (q.tier) {
          line.textContent = q.law.name + ' is rated ' + q.law.reliability + ' — ' + (TIER_SAYS[q.law.reliability] || '') + '.';
        } else if (q.mode === 'Which field?') {
          line.textContent = q.law.name + ' sits under ' + fieldName(q.law.category) + '.';
        } else {
          line.textContent = (right ? 'Right. ' : 'It was ') + q.law.name +
            (q.law.reliability ? ' — rated ' + q.law.reliability + '.' : '.');
        }
        afterEl.appendChild(line);
        var link = el('a', 'quiz-link');
        link.setAttribute('href', lawHref(q.law.slug));
        link.textContent = 'Read ' + (q.law.name || '') + ' →';
        afterEl.appendChild(link);
        afterEl.hidden = false;
      }
      setHud();
      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.textContent = asked >= ROUND ? 'See the round' : 'Next';
        nextBtn.focus();
      }
    }

    function finish() {
      root.hidden = true;
      if (!doneEl) return;
      doneEl.hidden = false;
      var best = readBest();
      if (bestStreak > best) { writeBest(bestStreak); best = bestStreak; }
      if (finalEl) {
        finalEl.textContent = score + ' out of ' + ROUND +
          (bestStreak > 1 ? '. Longest run: ' + bestStreak + '.' : '.') +
          (best > 1 ? ' Your best run so far: ' + best + '.' : '');
      }
      if (recapEl) {
        recapEl.textContent = '';
        seen.forEach(function (s) {
          var li = el('li', s.right ? 'qr-ok' : 'qr-no');
          var a = el('a', null);
          a.setAttribute('href', lawHref(s.law.slug));
          a.textContent = s.law.name || '';
          li.appendChild(a);
          if (s.law.reliability) {
            var b = el('span', 'badge ' + (BADGE[s.law.reliability] || 'b-heu'));
            b.textContent = s.law.reliability;
            li.appendChild(b);
          }
          recapEl.appendChild(li);
        });
      }
      if (againBtn) againBtn.focus();
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { if (answered) nextQuestion(); });
    if (againBtn) againBtn.addEventListener('click', newRound);

    // Keyboard: 1–4 answers, Enter advances. Skipped while the reader is typing
    // in the site search, which shares the page chrome.
    document.addEventListener('keydown', function (e) {
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (root.hidden) return;
      if (e.key >= '1' && e.key <= '4') {
        var b = optsEl.children[Number(e.key) - 1];
        if (b && !b.disabled) { e.preventDefault(); b.click(); }
      } else if (e.key === 'Enter' && answered) {
        // The reveal moves focus to Next, and a focused button already turns
        // Enter into a click. Handling it here too would advance twice and skip
        // a question — so leave Enter to the button whenever it has the focus.
        if (e.target === nextBtn) return;
        e.preventDefault(); nextQuestion();
      }
    });

    if (boot) boot.hidden = true;
    newRound();
  }

  function start() {
    if (!document.getElementById('lotd') && !document.getElementById('quiz')) return;
    fetch(BASE + 'search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (rows) {
        rows = Array.isArray(rows) ? rows : [];
        if (!rows.length) return;
        renderLotd(rows);
        initQuiz(rows);
      })
      .catch(function () { /* leave the graceful fallback text in place */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
