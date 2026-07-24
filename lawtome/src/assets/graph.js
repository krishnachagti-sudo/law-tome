// The graph explorer — an interactive, force-directed LOCAL-neighbourhood view.
// It fetches graph.json once, then shows ONE law at the centre with its direct
// links (and a capped ring of second-hop context) as a physics-laid-out web:
// nodes repel, edges pull, and the layout settles organically. You can drag
// nodes, pan the canvas, zoom with the wheel, hover to spotlight a node's
// connections, click a neighbour to re-centre on it, or open the centre law.
//
// Zero dependencies, self-contained (CSP-safe). Nodes are coloured by CATEGORY
// (a 20-way legend) and sized by how connected they are. XSS-CRITICAL: every
// corpus `name` reaches the DOM only as an SVG <text>/DOM .textContent — never
// innerHTML — so a hostile name renders as inert text.
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';

  // Category palette — tuned for the dark graph stage; distinct enough that
  // clusters read at a glance, warm-biased to sit with the amber accent.
  var CAT_COLOR = {
    economics: '#e0a43f', management: '#d8b45a', planning: '#c9a86a',
    sociology: '#e8926e', psychology: '#f0a0be', media: '#f2b56b',
    philosophy: '#d9cf92', logic: '#a9d15a', law: '#cabf8f',
    linguistics: '#d3a9e6', technology: '#5cc6a2', software: '#77a6f2',
    statistics: '#c79be6', mathematics: '#b79cff', physics: '#6db3e6',
    chemistry: '#d873c8', biology: '#82c07d', medicine: '#df735b',
    'earth-science': '#c39b62', astronomy: '#69cfc6',
  };
  var CAT_LABEL = {
    economics: 'Economics', management: 'Management', planning: 'Planning',
    sociology: 'Society', psychology: 'Psychology', media: 'Media',
    philosophy: 'Philosophy', logic: 'Logic', law: 'Law',
    linguistics: 'Linguistics', technology: 'Technology', software: 'Software',
    statistics: 'Statistics', mathematics: 'Mathematics', physics: 'Physics',
    chemistry: 'Chemistry', biology: 'Biology', medicine: 'Medicine',
    'earth-science': 'Earth science', astronomy: 'Astronomy',
  };
  function catColor(c) { return CAT_COLOR[c] || '#9aa0ab'; }
  function isTension(k) { return /oppos|contra|tension|versus|counter|rival|against/i.test(k || ''); }
  function isDirected(k) { return /cause|consequence/i.test(k || ''); }

  function computeBase() {
    var s = document.currentScript;
    if (!s) { var all = document.getElementsByTagName('script'); for (var i = 0; i < all.length; i++) if (/assets\/graph\.js(\?|$)/.test(all[i].src)) { s = all[i]; break; } }
    if (s && s.src) { var m = s.src.replace(/assets\/graph\.js(\?.*)?$/, ''); try { return new URL(m, location.href).pathname; } catch (e) { return '/'; } }
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
    // ---- index + adjacency ----
    var index = {};
    graph.nodes.forEach(function (n) { index[n.slug] = { slug: n.slug, name: n.name, category: n.category, reliability: n.reliability, adj: [] }; });
    (Array.isArray(graph.edges) ? graph.edges : []).forEach(function (e) {
      var a = index[e.a], b = index[e.b]; if (!a || !b) return;
      a.adj.push({ node: b, kind: e.kind }); b.adj.push({ node: a, kind: e.kind });
    });
    var all = Object.keys(index).map(function (s) { return index[s]; });
    function deg(n) { return n.adj.length; }

    // ---- stage scaffold ----
    var empty = document.getElementById('graph-empty');
    if (empty && empty.parentNode) empty.parentNode.removeChild(empty);
    stage.classList.add('graph-live');

    var W = 1000, H = 600;             // viewBox units (world space)
    var svg = svgEl('svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block'; svg.style.touchAction = 'none';
    // arrowhead marker for directed (cause/consequence) edges
    var defs = svgEl('defs');
    defs.innerHTML = '<marker id="gph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#7d879b"/></marker>';
    svg.appendChild(defs);
    var viewport = svgEl('g');               // pan/zoom transform lives here
    var edgeLayer = svgEl('g'), nodeLayer = svgEl('g');
    viewport.appendChild(edgeLayer); viewport.appendChild(nodeLayer);
    svg.appendChild(viewport);
    stage.appendChild(svg);

    // ---- controls (zoom / reset) injected so the template stays lean ----
    var controls = el('div', 'graph-controls');
    function ctrlBtn(label, title) { var b = el('button', 'graph-ctrl'); b.type = 'button'; b.textContent = label; b.title = title; b.setAttribute('aria-label', title); return b; }
    var zin = ctrlBtn('+', 'Zoom in'), zout = ctrlBtn('−', 'Zoom out'), zreset = ctrlBtn('⌂', 'Reset view');
    controls.appendChild(zin); controls.appendChild(zout); controls.appendChild(zreset);
    stage.appendChild(controls);

    // ---- legend (categories present in the current view) ----
    var legend = el('div', 'graph-legend'); stage.appendChild(legend);

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

    // ---- view transform (pan/zoom) ----
    var view = { k: 1, x: 0, y: 0 };
    function applyView() { viewport.setAttribute('transform', 'translate(' + view.x + ' ' + view.y + ') scale(' + view.k + ')'); }
    function clientToWorld(cx, cy) {
      var ctm = viewport.getScreenCTM(); if (!ctm) return { x: 0, y: 0 };
      var inv = ctm.inverse(); var p = svg.createSVGPoint(); p.x = cx; p.y = cy; p = p.matrixTransform(inv);
      return { x: p.x, y: p.y };
    }

    // ---- simulation state ----
    var sim = { nodes: [], edges: [], alpha: 0, raf: 0, byslug: {} };
    var nodeEls = {}, labelEls = {};

    function pickVisible(focus) {
      // focus + all 1-hop + capped 2-hop (by degree) so the web has real context
      var CAP = (stage.clientWidth || 900) < 620 ? 22 : 46;
      var chosen = {}; chosen[focus.slug] = focus;
      var one = focus.adj.map(function (a) { return a.node; })
        .sort(function (a, b) { return deg(b) - deg(a); });
      one.forEach(function (n) { chosen[n.slug] = n; });
      // second hop, best-connected first, until cap
      var ring = [];
      one.forEach(function (n) { n.adj.forEach(function (a) { if (!chosen[a.node.slug]) ring.push(a.node); }); });
      ring.sort(function (a, b) { return deg(b) - deg(a); });
      for (var i = 0; i < ring.length && Object.keys(chosen).length < CAP; i++) chosen[ring[i].slug] = ring[i];
      return chosen;
    }

    function render(slug, pushHistory) {
      var focus = index[slug]; if (!focus) return;
      if (pushHistory && current && current !== slug) history.push(current);
      current = slug;

      var visible = pickVisible(focus);
      var vslugs = Object.keys(visible);

      // build sim nodes with seeded (deterministic) initial positions on a spiral
      var GOLD = 2.399963229728653;
      sim.byslug = {}; sim.nodes = vslugs.map(function (s, i) {
        var isF = s === slug;
        var r = isF ? 0 : 60 + i * 12;
        var a = i * GOLD;
        var nd = { slug: s, name: visible[s].name, category: visible[s].category, reliability: visible[s].reliability,
          deg: deg(visible[s]), isFocus: isF,
          x: W / 2 + r * Math.cos(a), y: H / 2 + r * Math.sin(a), vx: 0, vy: 0, fx: null, fy: null };
        if (isF) { nd.fx = W / 2; nd.fy = H / 2; } // pin the centre so the view stays anchored
        sim.byslug[s] = nd; return nd;
      });
      // edges among the visible set (dedup undirected)
      var eseen = {}; sim.edges = [];
      vslugs.forEach(function (s) {
        visible[s].adj.forEach(function (a) {
          if (!visible[a.node.slug]) return;
          var key = s < a.node.slug ? s + '|' + a.node.slug : a.node.slug + '|' + s;
          if (eseen[key]) return; eseen[key] = 1;
          sim.edges.push({ a: sim.byslug[s], b: sim.byslug[a.node.slug], kind: a.kind,
            incident: s === slug || a.node.slug === slug });
        });
      });

      draw();
      // pre-settle synchronously so the first paint is a sensible layout, then
      // frame the whole neighbourhood; a gentle reheat lets it breathe into place.
      sim.alpha = 1; for (var s2 = 0; s2 < 160; s2++) { step(); sim.alpha *= 0.955; }
      tickPositions(); fitView();
      sim.needFit = true; sim.alpha = 0.16; if (!sim.raf) loop();
      updateChrome(focus, vslugs.length);
      buildLegend(visible);
    }

    // frame all nodes into the viewBox with padding (zoom-to-fit)
    function fitView() {
      if (!sim.nodes.length) return;
      var minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
      sim.nodes.forEach(function (n) {
        var r = (n.r || 10) + 8;
        // labels sit below the node (and any node's label can appear when zoomed
        // in) — reserve room for every one so nothing clips at the frame edge.
        var below = r + 22, sidex = r + 40;
        if (n.x - sidex < minx) minx = n.x - sidex; if (n.y - r < miny) miny = n.y - r;
        if (n.x + sidex > maxx) maxx = n.x + sidex; if (n.y + below > maxy) maxy = n.y + below;
      });
      var pad = 30, bw = Math.max(1, maxx - minx), bh = Math.max(1, maxy - miny);
      var k = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh); k = Math.max(0.45, Math.min(1.9, k));
      view.k = k; view.x = W / 2 - k * (minx + maxx) / 2; view.y = H / 2 - k * (miny + maxy) / 2; applyView(); reflectZoom();
    }

    // ---- draw DOM (created once per render; positions updated each tick) ----
    var edgeEls = [];
    function draw() {
      edgeLayer.textContent = ''; nodeLayer.textContent = ''; nodeEls = {}; labelEls = {}; edgeEls = [];
      sim.edges.forEach(function (e) {
        var ln = svgEl('line');
        ln.setAttribute('class', 'gedge' + (e.incident ? ' gedge-on' : ''));
        var tension = isTension(e.kind);
        ln.setAttribute('stroke', tension ? '#e0705a' : (isDirected(e.kind) ? '#7d879b' : '#8a7440'));
        ln.setAttribute('stroke-width', e.incident ? 1.7 : 1);
        ln.setAttribute('stroke-linecap', 'round');
        ln.setAttribute('stroke-opacity', e.incident ? 0.85 : 0.34);
        if (tension) ln.setAttribute('stroke-dasharray', '5 5');
        if (isDirected(e.kind)) ln.setAttribute('marker-end', 'url(#gph-arrow)');
        edgeLayer.appendChild(ln); e.el = ln; edgeEls.push(e);
      });
      sim.nodes.forEach(function (nd) {
        var g = svgEl('g'); g.setAttribute('class', 'gnode' + (nd.isFocus ? ' gnode-focus' : ''));
        g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
        g.setAttribute('aria-label', (nd.name || nd.slug) + (nd.isFocus ? ' (current)' : ''));
        var r = nd.isFocus ? 16 : 7 + Math.min(9, nd.deg * 0.5);
        nd.r = r;
        if (nd.isFocus) { var halo = svgEl('circle'); halo.setAttribute('class', 'gnode-halo'); halo.setAttribute('r', r + 7); halo.setAttribute('fill', catColor(nd.category)); halo.setAttribute('opacity', '0.18'); g.appendChild(halo); }
        var dot = svgEl('circle');
        dot.setAttribute('r', r); dot.setAttribute('fill', catColor(nd.category));
        dot.setAttribute('stroke', nd.isFocus ? '#f4efe4' : '#12151d'); dot.setAttribute('stroke-width', nd.isFocus ? 2.5 : 1.5);
        g.appendChild(dot);
        var label = svgEl('text'); label.setAttribute('class', 'glabel');
        label.setAttribute('text-anchor', 'middle'); label.setAttribute('y', r + 13);
        label.setAttribute('font-size', nd.isFocus ? 15 : 11.5);
        label.setAttribute('paint-order', 'stroke'); label.setAttribute('stroke', '#0f1118'); label.setAttribute('stroke-width', nd.isFocus ? 4 : 3.2); label.setAttribute('stroke-linejoin', 'round');
        label.setAttribute('fill', nd.isFocus ? '#f6f1e6' : '#e4ddce');
        // default label visibility: focus + direct neighbours of focus; others fade in on hover/zoom
        var direct = nd.isFocus || (index[current] && index[current].adj.some(function (a) { return a.node.slug === nd.slug; }));
        if (!direct) label.setAttribute('opacity', '0');
        label.textContent = nd.name == null ? '' : String(nd.name);
        g.appendChild(label);
        nd.el = g; nd.dotEl = dot; nd.labelEl = label; nd.direct = direct;
        nodeEls[nd.slug] = g;

        // interactions
        attachNode(g, nd);
        nodeLayer.appendChild(g);
      });
    }

    function tickPositions() {
      edgeEls.forEach(function (e) {
        // trim directed edges to the node rim so the arrowhead sits outside the dot
        var ax = e.a.x, ay = e.a.y, bx = e.b.x, by = e.b.y;
        if (isDirected(e.kind)) { var dx = bx - ax, dy = by - ay, d = Math.sqrt(dx * dx + dy * dy) || 1; bx -= dx / d * (e.b.r + 3); by -= dy / d * (e.b.r + 3); }
        e.el.setAttribute('x1', ax); e.el.setAttribute('y1', ay); e.el.setAttribute('x2', bx); e.el.setAttribute('y2', by);
      });
      sim.nodes.forEach(function (nd) { nd.el.setAttribute('transform', 'translate(' + nd.x + ' ' + nd.y + ')'); });
    }

    // ---- force simulation (Euler with cooling) ----
    function reheat() { sim.alpha = 1; if (!sim.raf) loop(); }
    function loop() {
      sim.raf = requestAnimationFrame(loop);
      step(); tickPositions();
      sim.alpha *= 0.968;
      if (sim.alpha < 0.02 && !dragging) { if (sim.needFit) { sim.needFit = false; fitView(); } cancelAnimationFrame(sim.raf); sim.raf = 0; }
    }
    function step() {
      var nodes = sim.nodes, n = nodes.length, i, j;
      var REP = 5200, L = 108, SPRING = 0.045, GRAV = 0.028, a = sim.alpha;
      // repulsion (O(n^2); n is capped small)
      for (i = 0; i < n; i++) { var p = nodes[i]; for (j = i + 1; j < n; j++) {
        var qn = nodes[j]; var dx = p.x - qn.x, dy = p.y - qn.y; var d2 = dx * dx + dy * dy || 0.01; var d = Math.sqrt(d2);
        var f = REP / d2 * a; var fx = dx / d * f, fy = dy / d * f;
        p.vx += fx; p.vy += fy; qn.vx -= fx; qn.vy -= fy;
      } }
      // springs
      sim.edges.forEach(function (e) { var dx = e.b.x - e.a.x, dy = e.b.y - e.a.y; var d = Math.sqrt(dx * dx + dy * dy) || 0.01; var f = SPRING * (d - L) * a; var fx = dx / d * f, fy = dy / d * f; e.a.vx += fx; e.a.vy += fy; e.b.vx -= fx; e.b.vy -= fy; });
      // gravity to centre + integrate
      for (i = 0; i < n; i++) { var nd = nodes[i];
        nd.vx += (W / 2 - nd.x) * GRAV * a; nd.vy += (H / 2 - nd.y) * GRAV * a;
        nd.vx *= 0.86; nd.vy *= 0.86;
        if (nd.fx != null) { nd.x = nd.fx; nd.vx = 0; } else nd.x += nd.vx;
        if (nd.fy != null) { nd.y = nd.fy; nd.vy = 0; } else nd.y += nd.vy;
      }
    }

    // ---- hover spotlight ----
    function spotlight(nd, on) {
      var near = {}; near[nd.slug] = 1;
      sim.edges.forEach(function (e) { if (e.a.slug === nd.slug) near[e.b.slug] = 1; else if (e.b.slug === nd.slug) near[e.a.slug] = 1; });
      sim.nodes.forEach(function (o) {
        var lit = !on || near[o.slug];
        o.el.style.opacity = lit ? '1' : '0.18';
        if (o.labelEl && !o.direct && !o.isFocus) o.labelEl.setAttribute('opacity', (on && near[o.slug]) ? '1' : '0');
      });
      edgeEls.forEach(function (e) { var lit = !on || e.a.slug === nd.slug || e.b.slug === nd.slug; e.el.style.opacity = lit ? '' : '0.06'; });
    }

    // ---- per-node pointer handling (drag vs click vs travel) ----
    var dragging = null, dragMoved = false, downXY = null;
    function attachNode(g, nd) {
      g.addEventListener('pointerenter', function () { if (!dragging) spotlight(nd, true); });
      g.addEventListener('pointerleave', function () { if (!dragging) spotlight(nd, false); });
      g.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation(); sim.needFit = false; dragging = nd; dragMoved = false; downXY = { x: ev.clientX, y: ev.clientY };
        nd._pinned = (nd.fx != null); var w = clientToWorld(ev.clientX, ev.clientY); nd._off = { x: w.x - nd.x, y: w.y - nd.y };
        nd.fx = nd.x; nd.fy = nd.y; try { g.setPointerCapture(ev.pointerId); } catch (e) {}
        reheat();
      });
      g.addEventListener('pointermove', function (ev) {
        if (dragging !== nd) return;
        if (Math.abs(ev.clientX - downXY.x) + Math.abs(ev.clientY - downXY.y) > 3) dragMoved = true;
        var w = clientToWorld(ev.clientX, ev.clientY); nd.fx = w.x - nd._off.x; nd.fy = w.y - nd._off.y; reheat();
      });
      g.addEventListener('pointerup', function (ev) {
        if (dragging !== nd) return; dragging = null; try { g.releasePointerCapture(ev.pointerId); } catch (e) {}
        if (!nd._pinned && !nd.isFocus) { nd.fx = null; nd.fy = null; }
        if (!dragMoved) { if (nd.isFocus) location = lawHref(nd.slug); else render(nd.slug, true); }
      });
      g.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); if (nd.isFocus) location = lawHref(nd.slug); else render(nd.slug, true); }
      });
    }

    // ---- canvas pan / zoom ----
    var panning = null;
    svg.addEventListener('pointerdown', function (ev) { if (ev.target.closest && ev.target.closest('.gnode')) return; sim.needFit = false; panning = { x: ev.clientX, y: ev.clientY, vx: view.x, vy: view.y }; svg.style.cursor = 'grabbing'; });
    window.addEventListener('pointermove', function (ev) { if (!panning) return; view.x = panning.vx + (ev.clientX - panning.x); view.y = panning.vy + (ev.clientY - panning.y); applyView(); });
    window.addEventListener('pointerup', function () { if (panning) { panning = null; svg.style.cursor = ''; } });
    function zoomAt(cx, cy, factor) {
      sim.needFit = false;
      var r = svg.getBoundingClientRect(); var sx = (cx - r.left) / r.width * W, sy = (cy - r.top) / r.height * H;
      var k2 = Math.max(0.35, Math.min(3.2, view.k * factor));
      // keep the point under the cursor fixed
      view.x = sx - (sx - view.x) * (k2 / view.k); view.y = sy - (sy - view.y) * (k2 / view.k); view.k = k2; applyView(); reflectZoom();
    }
    svg.addEventListener('wheel', function (ev) { ev.preventDefault(); zoomAt(ev.clientX, ev.clientY, ev.deltaY < 0 ? 1.12 : 1 / 1.12); }, { passive: false });
    zin.addEventListener('click', function () { var r = svg.getBoundingClientRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.25); });
    zout.addEventListener('click', function () { var r = svg.getBoundingClientRect(); zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1 / 1.25); });
    zreset.addEventListener('click', function () { fitView(); });
    function reflectZoom() {
      // reveal all labels when zoomed in enough
      var showAll = view.k > 1.35;
      sim.nodes.forEach(function (nd) { if (nd.labelEl && !nd.direct && !nd.isFocus) nd.labelEl.setAttribute('opacity', showAll ? '0.9' : '0'); });
    }

    // ---- legend ----
    function buildLegend(visible) {
      legend.textContent = '';
      var cats = {}; Object.keys(visible).forEach(function (s) { cats[visible[s].category] = 1; });
      var keys = Object.keys(cats).sort(function (a, b) { return (CAT_LABEL[a] || a).localeCompare(CAT_LABEL[b] || b); });
      keys.forEach(function (c) {
        var item = el('span', 'graph-leg-item');
        var sw = el('span', 'graph-leg-swatch'); sw.style.background = catColor(c);
        var tx = el('span'); tx.textContent = CAT_LABEL[c] || c;
        item.appendChild(sw); item.appendChild(tx); legend.appendChild(item);
      });
    }

    // ---- chrome ----
    function updateChrome(focus, shown) {
      if (focusName) focusName.textContent = focus.name || focus.slug;
      if (focusMeta) { var d = focus.adj.length; focusMeta.textContent = d + (d === 1 ? ' connection' : ' connections') + (focus.category ? ' · ' + (CAT_LABEL[focus.category] || focus.category) : ''); }
      if (focusLink) focusLink.setAttribute('href', lawHref(focus.slug));
      if (focusBar) focusBar.hidden = false;
      if (backBtn) backBtn.hidden = history.length === 0;
    }

    // ---- search ----
    function closeSuggest() { if (suggest) { suggest.textContent = ''; suggest.hidden = true; } }
    if (q && suggest) {
      q.addEventListener('input', function () {
        var v = q.value.trim().toLowerCase(); suggest.textContent = '';
        if (!v) { closeSuggest(); return; }
        var hits = all.filter(function (nn) { return (nn.name || '').toLowerCase().indexOf(v) !== -1; })
          .sort(function (a, b) { return deg(b) - deg(a); }).slice(0, 8);
        hits.forEach(function (nn) { var b = el('button', 'graph-suggest-item'); b.type = 'button'; b.textContent = nn.name || nn.slug; b.addEventListener('click', function () { render(nn.slug, true); q.value = ''; closeSuggest(); }); suggest.appendChild(b); });
        suggest.hidden = hits.length === 0;
      });
      q.addEventListener('blur', function () { setTimeout(closeSuggest, 150); });
    }
    if (backBtn) backBtn.addEventListener('click', function () { var prev = history.pop(); if (prev) render(prev, false); });

    // ---- initial focus: ?law= if valid, else the most-connected law ----
    var want = null; try { want = new URLSearchParams(location.search).get('law'); } catch (e) {}
    var startSlug = (want && index[want]) ? want : all.slice().sort(function (a, b) { return deg(b) - deg(a); })[0].slug;
    render(startSlug, false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
