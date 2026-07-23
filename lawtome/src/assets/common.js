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

  function wireTheme() {
    var btn = document.getElementById('theme');
    // Which glyph shows (moon vs sun) is driven purely by CSS keyed on
    // <html data-theme>, so there's no icon to repaint here — just flip the theme.
    // A brief .spin class gives the toggle a satisfying rotation on press.
    if (btn) btn.onclick = function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('lt-theme', next); } catch (e) {}
      if (root.classList.contains('anim')) {
        btn.classList.remove('spin'); void btn.offsetWidth; btn.classList.add('spin');
      }
    };
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

    // 3) PARALLAX + POINTER SPOTLIGHT — cheap rAF-throttled transforms.
    var parallax = [].slice.call(document.querySelectorAll('[data-parallax]'));
    var spots = [].slice.call(document.querySelectorAll('[data-spotlight]'));
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
    // spotlight: a soft radial that follows the cursor inside the element, exposed
    // to CSS as --mx/--my (percentages). Pure enhancement over the static glow.
    spots.forEach(function (el) {
      el.addEventListener('pointermove', function (ev) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
      });
    });

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
      var dist = 0, ticking = false;
      function measure() {
        dist = Math.max(0, track.scrollWidth - window.innerWidth);
        sec.style.height = (window.innerHeight + dist) + 'px';
      }
      function frame() {
        var top = -sec.getBoundingClientRect().top;
        var p = dist > 0 ? Math.min(1, Math.max(0, top / dist)) : 0;
        track.style.transform = 'translate3d(' + (-p * dist) + 'px,0,0)';
        if (bar) bar.style.transform = 'scaleX(' + p + ')';
        var vw = window.innerWidth;
        for (var i = 0; i < panels.length; i++) {
          var r = panels[i].getBoundingClientRect();
          var d = Math.min(1, Math.abs((r.left + r.width / 2) - vw / 2) / vw);
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

  function wire() { wireTheme(); wireMotion(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
