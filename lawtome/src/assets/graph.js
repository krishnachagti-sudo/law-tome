// The graph explorer — a LOCAL-neighbourhood ("ego network") view, not the whole
// 948-node hairball. It fetches graph.json once, then shows ONE law at the centre
// with its direct connections around it, laid out radially so it's always
// readable. Click a neighbour to travel to it (the web re-centres on it); search
// to jump anywhere; click the centre (or "Open this law") to read the page.
//
// Zero dependencies. Deterministic radial layout (no Math.random) so a headless
// screenshot is stable. XSS-CRITICAL: every corpus `name` reaches the DOM only as
// an SVG <text>/DOM node's .textContent — never innerHTML — so a hostile name
// renders as inert text.
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var W = 900, H = 560, CX = W / 2, CY = H / 2;
  var MAX_NEIGHBOURS = 18;             // cap the fan so a hub stays readable

  var TIER = { Empirical: '#8fbf6f', Heuristic: '#d8a63f', 'Folk-adage': '#b7ab86', Contested: '#e05a44' };
  function tierColor(r) { return TIER[r] || '#c9bf9f'; }
  function isTension(kind) { return /oppos|contra|tension|versus|counter|rival|against/i.test(kind || ''); }

  function computeBase() {
    var s = document.currentScript;
    if (!s) {
      var all = document.getElementsByTagName('script');
      for (var i = 0; i < all.length; i++) if (/assets\/graph\.js(\?|$)/.test(all[i].src)) { s = all[i]; break; }
    }
    if (s && s.src) {
      var m = s.src.replace(/assets\/graph\.js(\?.*)?$/, '');
      try { return new URL(m, location.href).pathname; } catch (e) { return '/'; }
    }
    return '/';
  }
  var BASE = computeBase();
  function svgEl(t) { return document.createElementNS(SVGNS, t); }
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function lawHref(slug) { return BASE + 'laws/' + encodeURIComponent(slug) + '/'; }

  function start() {
    var stage = document.getElementById('graph');
    if (!stage) return;
    fetch(BASE + 'graph.json')
      .then(function (r) { return r.json(); })
      .then(function (graph) {
        if (!graph || !Array.isArray(graph.nodes) || !graph.nodes.length) { stage.textContent = 'No laws to graph yet.'; return; }
        build(stage, graph);
      })
      .catch(function () { stage.textContent = 'The graph could not be loaded.'; });
  }

  function build(stage, graph) {
    var index = {};
    graph.nodes.forEach(function (n) { index[n.slug] = { slug: n.slug, name: n.name, reliability: n.reliability, adj: [] }; });
    (Array.isArray(graph.edges) ? graph.edges : []).forEach(function (e) {
      var a = index[e.a], b = index[e.b];
      if (!a || !b) return;
      a.adj.push({ node: b, kind: e.kind }); b.adj.push({ node: a, kind: e.kind });
    });
    var all = Object.keys(index).map(function (s) { return index[s]; });
    function deg(n) { return n.adj.length; }

    // ---- svg scaffold ----
    var empty = document.getElementById('graph-empty');
    if (empty && empty.parentNode) empty.parentNode.removeChild(empty);
    var svg = svgEl('svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block';
    var edgeLayer = svgEl('g'), nodeLayer = svgEl('g');
    svg.appendChild(edgeLayer); svg.appendChild(nodeLayer);
    stage.appendChild(svg);

    // ---- page chrome refs ----
    var focusName = document.getElementById('graph-focus-name');
    var focusMeta = document.getElementById('graph-focus-meta');
    var focusLink = document.getElementById('graph-focus-link');
    var focusBar = document.getElementById('graph-focusbar');
    var backBtn = document.getElementById('graph-back');
    var q = document.getElementById('graph-q');
    var suggest = document.getElementById('graph-suggest');

    var history = [];
    var current = null;

    // ---- render one law's neighbourhood ----
    function render(slug, pushHistory) {
      var focus = index[slug];
      if (!focus) return;
      if (pushHistory && current && current !== slug) history.push(current);
      current = slug;

      var neighbours = focus.adj.slice().sort(function (a, b) { return deg(b.node) - deg(a.node); });
      var extra = Math.max(0, neighbours.length - MAX_NEIGHBOURS);
      neighbours = neighbours.slice(0, MAX_NEIGHBOURS);

      edgeLayer.textContent = ''; nodeLayer.textContent = '';

      var n = neighbours.length;
      var R = n <= 1 ? 0 : Math.min(232, 116 + n * 7);   // fan radius grows with count
      var pos = {}; pos[focus.slug] = { x: CX, y: CY };
      neighbours.forEach(function (nb, i) {
        var ang = (-Math.PI / 2) + (2 * Math.PI * i / Math.max(1, n));
        pos[nb.node.slug] = { x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang), ang: ang };
      });

      var visible = {}; visible[focus.slug] = true;
      neighbours.forEach(function (nb) { visible[nb.node.slug] = true; });

      // edges: focus->neighbour (bright), plus neighbour<->neighbour (faint context)
      function drawEdge(a, b, kind, ctx) {
        var pa = pos[a], pb = pos[b]; if (!pa || !pb) return;
        var ln = svgEl('line');
        ln.setAttribute('x1', pa.x); ln.setAttribute('y1', pa.y);
        ln.setAttribute('x2', pb.x); ln.setAttribute('y2', pb.y);
        ln.setAttribute('stroke', ctx ? '#3a3320' : (isTension(kind) ? '#e05a44' : '#7d6f43'));
        ln.setAttribute('stroke-width', ctx ? '1' : '1.6');
        ln.setAttribute('stroke-linecap', 'round');
        if (isTension(kind)) ln.setAttribute('stroke-dasharray', '5 5');
        edgeLayer.appendChild(ln);
      }
      neighbours.forEach(function (nb) { drawEdge(focus.slug, nb.node.slug, nb.kind, false); });
      // context edges among neighbours (dedup by ordering)
      neighbours.forEach(function (nb) {
        nb.node.adj.forEach(function (e2) {
          if (visible[e2.node.slug] && e2.node.slug !== focus.slug && nb.node.slug < e2.node.slug) drawEdge(nb.node.slug, e2.node.slug, e2.kind, true);
        });
      });

      // nodes
      function drawNode(node, isFocus) {
        var p = pos[node.slug];
        var g = svgEl('g'); g.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')');
        g.setAttribute('class', 'gnode');
        g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
        g.setAttribute('aria-label', (node.name || node.slug) + (isFocus ? ' (current)' : ''));
        g.style.cursor = 'pointer';
        var r = isFocus ? 15 : 8 + Math.min(6, deg(node) * 0.4);
        var dot = svgEl('circle');
        dot.setAttribute('r', r); dot.setAttribute('fill', tierColor(node.reliability));
        dot.setAttribute('stroke', isFocus ? '#f1e7cf' : '#141109'); dot.setAttribute('stroke-width', isFocus ? '2.5' : '1.5');
        g.appendChild(dot);
        var label = svgEl('text');
        label.setAttribute('font-family', "'Space Mono',monospace");
        label.setAttribute('font-size', isFocus ? '13' : '11');
        label.setAttribute('fill', isFocus ? '#f6edd6' : '#e7dcbe');
        label.setAttribute('paint-order', 'stroke');
        label.setAttribute('stroke', '#141109'); label.setAttribute('stroke-width', isFocus ? '4' : '3.5'); label.setAttribute('stroke-linejoin', 'round');
        // place label outward along the radial so neighbour labels splay apart
        if (isFocus) { label.setAttribute('text-anchor', 'middle'); label.setAttribute('y', r + 16); }
        else {
          var right = Math.cos(p.ang) >= -0.15;
          label.setAttribute('text-anchor', right ? 'start' : 'end');
          label.setAttribute('x', (right ? 1 : -1) * (r + 6));
          label.setAttribute('y', Math.sin(p.ang) > 0.5 ? r + 12 : (Math.sin(p.ang) < -0.5 ? -(r + 6) : 4));
        }
        label.textContent = node.name == null ? '' : String(node.name);
        g.appendChild(label);

        function activate() { if (isFocus) location = lawHref(node.slug); else render(node.slug, true); }
        g.addEventListener('click', activate);
        g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); activate(); } });
        nodeLayer.appendChild(g);
      }
      neighbours.forEach(function (nb) { drawNode(nb.node, false); });
      drawNode(focus, true); // focus last -> on top

      // chrome
      if (focusName) focusName.textContent = focus.name || focus.slug;
      if (focusMeta) {
        var d = focus.adj.length;
        focusMeta.textContent = d + (d === 1 ? ' connection' : ' connections') + (extra ? ' (showing ' + MAX_NEIGHBOURS + ')' : '') + (focus.reliability ? ' · ' + focus.reliability : '');
      }
      if (focusLink) focusLink.setAttribute('href', lawHref(focus.slug));
      if (focusBar) focusBar.hidden = false;
      if (backBtn) backBtn.hidden = history.length === 0;
      try { history.replaceState ? 0 : 0; } catch (e) {}
    }

    // ---- search ----
    function closeSuggest() { if (suggest) { suggest.textContent = ''; suggest.hidden = true; } }
    if (q && suggest) {
      q.addEventListener('input', function () {
        var v = q.value.trim().toLowerCase();
        suggest.textContent = '';
        if (!v) { closeSuggest(); return; }
        var hits = all.filter(function (nn) { return (nn.name || '').toLowerCase().indexOf(v) !== -1; })
          .sort(function (a, b) { return deg(b) - deg(a); }).slice(0, 8);
        hits.forEach(function (nn) {
          var b = el('button', 'graph-suggest-item'); b.type = 'button';
          b.textContent = nn.name || nn.slug;
          b.addEventListener('click', function () { render(nn.slug, true); q.value = ''; closeSuggest(); });
          suggest.appendChild(b);
        });
        suggest.hidden = hits.length === 0;
      });
      q.addEventListener('blur', function () { setTimeout(closeSuggest, 150); });
    }
    if (backBtn) backBtn.addEventListener('click', function () { var prev = history.pop(); if (prev) render(prev, false); });

    // ---- initial focus: ?law= if valid, else the most-connected law ----
    var want = null;
    try { want = new URLSearchParams(location.search).get('law'); } catch (e) {}
    var startSlug = (want && index[want]) ? want
      : all.slice().sort(function (a, b) { return deg(b) - deg(a); })[0].slug;
    render(startSlug, false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
