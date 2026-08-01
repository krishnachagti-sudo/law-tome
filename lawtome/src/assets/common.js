// Shared across all Law Tome pages: theme persistence + toggle, and a small motion
// engine. Every animation here is gated behind <html class="anim">, which the head
// script adds BEFORE first paint only when the visitor allows motion AND supports
// IntersectionObserver. So no-JS and prefers-reduced-motion visitors never see (or
// depend on) any of this — content is fully visible and interactive without it.
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem('lt-theme'); } catch (e) {}
  // Dark-first: the document ships data-theme="dark"; only drop to light when the
  // visitor stored that choice or their OS explicitly prefers light.
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches) root.setAttribute('data-theme', 'light');

  // Keep the browser-chrome colour in step with the ACTUAL theme. The static
  // <meta theme-color> pair keys off prefers-color-scheme, which a manual toggle
  // overrides — so add one authoritative meta (no media) that always wins.
  function syncThemeColor(t) {
    var m = document.getElementById('tc-dyn');
    if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; m.id = 'tc-dyn'; document.head.appendChild(m); }
    m.setAttribute('content', t === 'light' ? '#f4f1e8' : '#000000');
  }

  function wireTheme() {
    syncThemeColor(root.getAttribute('data-theme'));
    var btn = document.getElementById('theme');
    // aria-pressed reflects "dark mode is on" so screen-reader users hear the
    // toggle's current state, not just its label.
    if (btn) btn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    // Which glyph shows (moon vs sun) is driven purely by CSS keyed on
    // <html data-theme>, so there's no icon to repaint here — just flip the theme.
    // A brief .spin class gives the toggle a satisfying rotation on press.
    if (btn) btn.onclick = function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
      syncThemeColor(next);
      try { localStorage.setItem('lt-theme', next); } catch (e) {}
      if (root.classList.contains('anim')) {
        btn.classList.remove('spin'); void btn.offsetWidth; btn.classList.add('spin');
      }
    };
  }

  // ---- mobile navigation (works regardless of motion / JS-motion gate) -----
  function wireNav() {
    var btn = document.getElementById('menu');
    if (!btn) return;
    var hdr = btn.closest('header');
    var nav = document.getElementById('primary-nav');
    if (!hdr || !nav) return;
    function set(open) {
      hdr.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    btn.addEventListener('click', function () { set(!hdr.classList.contains('nav-open')); });
    // Close after choosing a destination, on Escape, or on outside click.
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hdr.classList.contains('nav-open')) { set(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (hdr.classList.contains('nav-open') && !hdr.contains(e.target)) set(false);
    });
  }

  // ---- motion engine (only when <html class="anim">) -----------------------
  function wireMotion() {
    if (!root.classList.contains('anim')) return;
    var mAll = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
    if (mAll && mAll.matches) return; // extra guard if preference flipped post-load

    // 1) SCROLL-REVEAL — [data-reveal] slides/fades in as it enters the viewport.
    // A [data-reveal-stagger] container reveals its direct children in sequence.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          if (el.hasAttribute('data-reveal-stagger')) {
            var kids = el.children;
            for (var i = 0; i < kids.length; i++) kids[i].style.transitionDelay = (i * 70) + 'ms';
            el.classList.add('in');
            for (var j = 0; j < kids.length; j++) kids[j].classList.add('in');
          } else {
            el.classList.add('in');
          }
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      var els = document.querySelectorAll('[data-reveal],[data-reveal-stagger]');
      for (var i = 0; i < els.length; i++) io.observe(els[i]);
    } else {
      // No IntersectionObserver: reveal everything immediately so content is never
      // left stuck at opacity:0 (the hidden state is scoped to .anim [data-reveal]).
      var all = document.querySelectorAll('[data-reveal],[data-reveal-stagger],[data-reveal-stagger]>*');
      for (var k = 0; k < all.length; k++) all[k].classList.add('in');
    }

    // 2) COUNT-UP — [data-count] tallies 0 → its value the first time it's seen.
    // Preserves any thousands separators / suffix in the element's original text.
    function countUp(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      var raw = el.textContent.trim();
      var suffix = (raw.match(/[^0-9.,]+$/) || [''])[0];
      var grouped = raw.indexOf(',') !== -1;
      var dur = 1100, t0 = null;
      function fmt(n) { var s = grouped ? Math.round(n).toLocaleString('en-US') : String(Math.round(n)); return s + suffix; }
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
      }
      requestAnimationFrame(step);
    }
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
      if ('IntersectionObserver' in window) {
        var cio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
        }, { threshold: 0.5 });
        for (var c = 0; c < counters.length; c++) cio.observe(counters[c]);
      } else {
        for (var c2 = 0; c2 < counters.length; c2++) countUp(counters[c2]);
      }
    }

    // 3) PARALLAX — cheap rAF-throttled scroll transform.
    var parallax = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (parallax.length) {
      var ticking = false;
      function onScroll() {
        if (ticking) return; ticking = true;
        requestAnimationFrame(function () {
          var y = window.pageYOffset || 0;
          for (var i = 0; i < parallax.length; i++) {
            var sp = parseFloat(parallax[i].getAttribute('data-parallax')) || 0.2;
            parallax[i].style.transform = 'translate3d(0,' + (y * sp) + 'px,0)';
          }
          ticking = false;
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // 4) TILT — [data-tilt] leans a card toward the pointer in 3D, springing back
    // on leave. Small angles keep it tasteful rather than gimmicky.
    var tilts = [].slice.call(document.querySelectorAll('[data-tilt]'));
    tilts.forEach(function (el) {
      var max = 6;
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(700px) rotateX(' + (-py * max) + 'deg) rotateY(' + (px * max) + 'deg) translateY(-3px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    // 5) PINNED HORIZONTAL SCROLL — [data-hscroll]: the section grows as tall as
    // its horizontal overflow, pins to the viewport, and scrubs the inner track
    // sideways as you scroll down; panels dim toward the edges for depth. Without
    // this (no-JS / reduced motion) the CSS leaves a plain swipeable rail.
    [].slice.call(document.querySelectorAll('[data-hscroll]')).forEach(function (sec) {
      var track = sec.querySelector('.hscroll-track');
      var bar = sec.querySelector('.hscroll-bar');
      if (!track) return;
      sec.classList.add('is-pinned');
      var panels = [].slice.call(track.children);
      var dist = 0, vRange = 0, ticking = false;
      function measure() {
        // Horizontal travel the track must make…
        dist = Math.max(0, track.scrollWidth - window.innerWidth);
        // …but cap the VERTICAL scroll it costs to ~1.6 screens, so the section
        // doesn't balloon to five viewports and hijack scroll for that long.
        vRange = Math.min(dist, Math.round(window.innerHeight * 1.6));
        sec.style.height = (window.innerHeight + vRange) + 'px';
      }
      function frame() {
        var top = -sec.getBoundingClientRect().top;
        var p = vRange > 0 ? Math.min(1, Math.max(0, top / vRange)) : 0;
        track.style.transform = 'translate3d(' + (-p * dist) + 'px,0,0)';
        if (bar) bar.style.transform = 'scaleX(' + p + ')';
        // Batch reads then writes (avoid per-panel read/write layout thrash).
        var vw = window.innerWidth, rects = [], i;
        for (i = 0; i < panels.length; i++) rects.push(panels[i].getBoundingClientRect());
        for (i = 0; i < panels.length; i++) {
          var d = Math.min(1, Math.abs((rects[i].left + rects[i].width / 2) - vw / 2) / vw);
          panels[i].style.opacity = String(1 - d * 0.72);
        }
        ticking = false;
      }
      function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(frame); }
      measure(); frame();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
      window.addEventListener('load', function () { measure(); onScroll(); });
    });

    // 6) READING-PROGRESS — a slim top bar tracking scroll depth. The law page
    // injects its own #progress + scroll-spy; only create one where it's absent so
    // every other long page gets the bar too, without doubling up.
    if (!document.getElementById('progress')) {
      var bar = document.createElement('div');
      bar.className = 'progress'; bar.id = 'progress'; bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
      var pt = false;
      function onProg() {
        if (pt) return; pt = true;
        requestAnimationFrame(function () {
          var h = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, (window.pageYOffset || 0) / h) : 0) + ')';
          pt = false;
        });
      }
      window.addEventListener('scroll', onProg, { passive: true });
      onProg();
    }
  }

  // ---- coin form -> pre-filled GitHub issue --------------------------------
  // The form has no server (this is a static site), so it targets the repo's
  // "new issue" endpoint. Without JS that still works — GitHub reads ?title= —
  // but only the title survives. Here we compose the WHOLE submission into the
  // issue body so nothing the visitor typed is dropped, then hand off. The
  // corpus is maintained in that repo, so review happens where the data lives.
  function wireCoinForm() {
    var form = document.getElementById('coin-form');
    if (!form) return;
    var repo = form.getAttribute('data-repo');
    if (!repo) return;
    form.addEventListener('submit', function (e) {
      // Let the browser run its own required-field validation first.
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) return;
      e.preventDefault();
      var get = function (n) {
        var el = form.elements[n];
        return el && el.value ? String(el.value).trim() : '';
      };
      var mode = get('mode') === 'suggest' ? 'Suggest' : 'Coin';
      var law = get('title');
      var lines = [
        '**Submission type:** ' + (mode === 'Coin' ? 'Coin — an original law' : 'Suggest — an existing, attested law'),
        '**Proposed name:** ' + (law || '—'),
        '',
        '**Statement**',
        '', get('statement') || '—',
        '',
        '**Sources / prior art**',
        '', get('sources') || '_none supplied_',
        '',
        '**Credit to:** ' + (get('name') || '—'),
        '',
        '---',
        'Submitted via the “Coin a law” form on The Law Tome. The submitter granted a',
        'non-exclusive, perpetual CC BY licence to publish, edit and cross-link this',
        'submission with attribution, and asserted it is their own original work.',
      ];
      var url = 'https://github.com/' + repo + '/issues/new'
        + '?title=' + encodeURIComponent('[' + mode + '] ' + (law || 'Untitled submission'))
        + '&body=' + encodeURIComponent(lines.join('\n'));
      window.location.href = url;
    });
  }

  function wire() { wireTheme(); wireNav(); wireMotion(); wireCoinForm(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
