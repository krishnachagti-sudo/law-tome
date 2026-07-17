// Task 10 — client search over the prebuilt index (dist/search-index.json).
//
// XSS-CRITICAL. The rows carry raw corpus text (name, statement, aliases) — the
// exact surface that XSS'd Task 7's hero rotation. This file NEVER concatenates a
// raw corpus field into innerHTML. Every corpus string reaches the DOM through
// .textContent (created via DOM nodes), so a law named `A <img onerror=alert(1)>`
// renders as inert text, never an executing tag. The one HTML-string path (the
// empty state) runs the echoed query through escapeHtml() first.
//
// The match/rank logic mirrors build/search-index.mjs (searchRows/rankRow): every
// query token must be a substring of a row's `blob` (token-AND), and name/alias
// hits rank above statement-only hits. That module is unit-tested in Node; this is
// its browser twin.
(function () {
  'use strict';

  // ---- base path: pages are served under /lawtome/. Derive it from THIS script's
  // own src so the same file works at any mount point. Falls back to '/'.
  function computeBase() {
    var s = document.currentScript;
    if (!s) {
      var all = document.getElementsByTagName('script');
      for (var i = 0; i < all.length; i++) {
        if (/assets\/search\.js(\?|$)/.test(all[i].src)) { s = all[i]; break; }
      }
    }
    if (s && s.src) {
      var m = s.src.replace(/assets\/search\.js(\?.*)?$/, '');
      try { return new URL(m, location.href).pathname; } catch (e) { return '/'; }
    }
    return '/';
  }
  var BASE = computeBase();

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var BADGE = { Empirical: 'b-emp', Heuristic: 'b-heu', 'Folk-adage': 'b-folk', Contested: 'b-con' };
  function badgeClass(r) { return BADGE[r] || 'b-heu'; }

  function tokenize(q) {
    return String(q || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
  }

  // Mirror of build/search-index.mjs rankRow: -1 miss, 1 statement-only, 2 name/alias.
  function rankRow(row, tokens) {
    if (!tokens.length) return -1;
    var nameBlob = ([row.name].concat(row.aliases || [])).join(' ').toLowerCase();
    var inName = false;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (row.blob.indexOf(t) === -1) return -1;
      if (nameBlob.indexOf(t) !== -1) inName = true;
    }
    return inName ? 2 : 1;
  }

  // Mirror of searchRows: token-AND filter, name-hits ranked first, stable order.
  function searchRows(rows, query) {
    var tokens = tokenize(query);
    if (!tokens.length) return [];
    var scored = [];
    for (var i = 0; i < rows.length; i++) {
      var score = rankRow(rows[i], tokens);
      if (score > 0) scored.push({ row: rows[i], score: score, i: i });
    }
    scored.sort(function (a, b) { return (b.score - a.score) || (a.i - b.i); });
    return scored.map(function (s) { return s.row; });
  }

  // ---- card DOM builder. EVERY corpus string set via textContent (no innerHTML). --
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }

  function buildCard(row) {
    var a = el('a', 'card');
    a.setAttribute('href', BASE + 'laws/' + encodeURIComponent(row.slug) + '/');

    var top = el('div', 'top');
    var no = el('span', 'no'); no.textContent = '№ ' + (row.no || '');
    top.appendChild(no);
    if (row.reliability) {
      var badge = el('span', 'badge ' + badgeClass(row.reliability));
      badge.textContent = row.reliability; // textContent — corpus-controlled enum
      top.appendChild(badge);
    }

    var h3 = document.createElement('h3'); h3.textContent = row.name || '';

    var say = el('div', 'say'); say.textContent = '"' + (row.statement || '') + '"';

    var foot = el('div', 'foot');
    var cat = el('span', 'cat'); cat.textContent = row.category || '';
    foot.appendChild(cat);
    var relN = Array.isArray(row.related) ? row.related.length : row.rels;
    if (relN != null) {
      var rel = el('span', 'rel');
      var ic = el('i', 'ti ti-affiliate'); ic.setAttribute('aria-hidden', 'true'); ic.setAttribute('style', 'font-size:13px');
      rel.appendChild(ic); rel.appendChild(document.createTextNode(' ' + relN + ' related'));
      foot.appendChild(rel);
    }

    a.appendChild(top); a.appendChild(h3); a.appendChild(say); a.appendChild(foot);
    return a;
  }

  function init(rows) {
    var q = document.getElementById('q');
    var grid = document.getElementById('grid');
    var rand = document.getElementById('rand');
    var chipsEl = document.getElementById('chips');
    var showing = document.getElementById('showing');

    // On a category page the server pre-marks that category's chip `.on` and
    // stamps data-cat on the grid. Honour it so the initial client paint matches
    // the server-filtered grid instead of clobbering it with every law (the bug
    // where /category/economics/ silently repainted all 11 laws on load).
    var onChip = chipsEl && chipsEl.querySelector ? chipsEl.querySelector('.chip.on') : null;
    var activeCat = (grid && grid.getAttribute('data-cat'))
      || (onChip && onChip.getAttribute('data-c'))
      || 'all';
    var query = '';

    // Populate chips on the homepage (browse/category pages ship static chips).
    if (chipsEl && chipsEl.children.length === 0) {
      var cats = ['all'];
      for (var i = 0; i < rows.length; i++) {
        var c = rows[i].category;
        if (c != null && cats.indexOf(c) === -1) cats.push(c);
      }
      for (var j = 0; j < cats.length; j++) {
        var b = el('button', 'chip' + (j === 0 ? ' on' : ''));
        b.setAttribute('data-c', cats[j]);
        b.textContent = cats[j]; // textContent — category is corpus text
        chipsEl.appendChild(b);
      }
    }

    function filtered() {
      var base = query ? searchRows(rows, query) : rows.slice();
      if (activeCat !== 'all') base = base.filter(function (r) { return r.category === activeCat; });
      return base;
    }

    function render() {
      if (!grid) return;
      var list = filtered();
      grid.textContent = ''; // clear without innerHTML
      if (list.length) {
        var frag = document.createDocumentFragment();
        for (var i = 0; i < list.length; i++) frag.appendChild(buildCard(list[i]));
        grid.appendChild(frag);
      } else {
        // Only HTML-string path — echoed query is escaped first.
        grid.innerHTML = '<div class="empty">No law matches "' + escapeHtml(query) +
          '". Maybe you should <b>coin</b> it.</div>';
      }
      if (showing) showing.textContent = 'showing ' + list.length + ' of ' + rows.length;
    }

    if (q) {
      q.addEventListener('input', function () {
        query = q.value.trim().toLowerCase();
        render();
        var idx = document.getElementById('index');
        if (query && idx) idx.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (chipsEl) {
      chipsEl.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('.chip') : null;
        if (!b) return;
        activeCat = b.getAttribute('data-c');
        var kids = chipsEl.children;
        for (var i = 0; i < kids.length; i++) kids[i].classList.toggle('on', kids[i] === b);
        render();
      });
    }

    if (rand) {
      rand.addEventListener('click', function () {
        if (!rows.length) return;
        var pick = rows[Math.floor(Math.random() * rows.length)];
        location = BASE + 'laws/' + encodeURIComponent(pick.slug) + '/';
      });
    }

    // Initial paint only when there's a live grid to fill (homepage / browse).
    if (grid) render();
  }

  // Nothing to wire if none of the search surfaces exist on this page.
  function anyTarget() {
    return document.getElementById('q') || document.getElementById('grid') || document.getElementById('rand');
  }

  function start() {
    if (!anyTarget()) return;
    fetch(BASE + 'search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (rows) { init(Array.isArray(rows) ? rows : []); })
      .catch(function () { /* leave server-rendered content in place on fetch failure */ });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
