// "Law of the day" + "Name that law" — client for /quiz/.
//
// Fetches the prebuilt search index (dist/search-index.json) and:
//   1. shows the deterministic law of the day (mirrors build/quiz.dayIndex), and
//   2. runs a name-that-law game — a statement plus four names, one correct.
//
// XSS discipline matches search.js: every corpus string reaches the DOM via
// .textContent (DOM nodes), never innerHTML. The only markup we build is our own
// fixed structure.
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

  var BADGE = { Empirical: 'b-emp', Heuristic: 'b-heu', 'Folk-adage': 'b-folk', Contested: 'b-con' };
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function lawHref(slug) { return BASE + 'laws/' + encodeURIComponent(slug) + '/'; }

  // ---- law of the day -----------------------------------------------------
  function renderLotd(rows) {
    var host = document.getElementById('lotd');
    if (!host) return;
    var body = host.querySelector('.lotd-body');
    if (!body) { body = el('div', 'lotd-body'); host.appendChild(body); }
    var law = rows[dayIndex(todayKey(), rows.length)];
    if (!law) return;
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

  // ---- name that law ------------------------------------------------------
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function initQuiz(rows) {
    var quiz = document.getElementById('quiz');
    var stmtEl = document.getElementById('quiz-stmt');
    var optsEl = document.getElementById('quiz-options');
    var scoreEl = document.getElementById('quiz-score');
    var nextBtn = document.getElementById('quiz-next');
    // Need at least 4 distinct laws to make a 4-option question.
    if (!quiz || !stmtEl || !optsEl || rows.length < 4) return;
    quiz.hidden = false;
    var score = 0, total = 0, answered = false;

    function pickDistinct(n, exceptIdx) {
      var picks = [], used = {}; used[exceptIdx] = 1;
      var guard = 0;
      while (picks.length < n && guard < 500) {
        guard++;
        var k = Math.floor(Math.random() * rows.length);
        if (used[k]) continue;
        used[k] = 1; picks.push(k);
      }
      return picks;
    }

    function setScore() {
      if (scoreEl) scoreEl.textContent = total ? 'Score: ' + score + ' / ' + total : '';
    }

    function newQuestion() {
      answered = false;
      var ai = Math.floor(Math.random() * rows.length);
      var answer = rows[ai];
      stmtEl.textContent = '“' + (answer.statement || '') + '”';
      var opts = pickDistinct(3, ai).map(function (k) { return rows[k]; });
      opts.push(answer);
      shuffle(opts);
      optsEl.textContent = '';
      opts.forEach(function (law) {
        var b = el('button', 'quiz-opt');
        b.type = 'button';
        b.textContent = law.name || '';
        b.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          total++;
          var correct = law.slug === answer.slug;
          if (correct) score++;
          var kids = optsEl.children;
          for (var i = 0; i < kids.length; i++) kids[i].disabled = true;
          b.classList.add(correct ? 'correct' : 'wrong');
          if (!correct) {
            // reveal the right answer
            for (var j = 0; j < kids.length; j++) {
              if (kids[j].textContent === (answer.name || '')) kids[j].classList.add('correct');
            }
          }
          // Reveal the law's quote-card. The site already renders one per law for
          // social previews and has never shown them anywhere on the site itself;
          // the answer reveal is the one place a single 50KB card earns its weight,
          // because it IS the payoff of the question.
          var card = el('img', 'quiz-card');
          card.setAttribute('src', BASE + 'og/' + encodeURIComponent(answer.slug) + '.png');
          card.setAttribute('alt', (answer.name || '') + ' — quote card');
          card.setAttribute('loading', 'lazy');
          card.setAttribute('decoding', 'async');
          optsEl.appendChild(card);
          // append a link to read the answer
          var link = el('a', 'quiz-link');
          link.setAttribute('href', lawHref(answer.slug));
          link.textContent = 'Read ' + (answer.name || '') + ' →';
          optsEl.appendChild(link);
          setScore();
        });
        optsEl.appendChild(b);
      });
      setScore();
    }

    if (nextBtn) nextBtn.addEventListener('click', newQuestion);
    newQuestion();
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
