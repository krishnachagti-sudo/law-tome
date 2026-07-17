// The graph explorer's browser runtime. Fetches dist/graph.json (the whole graph)
// and renders it as ONE interactive force-directed map: every law is a node, every
// cross-link an edge. Drag a node to pull the web around, scroll to zoom, hover to
// trace a law's connections, click a node to open its page.
//
// Zero dependencies — the force simulation, pan/zoom, and drag are all vanilla. The
// layout is pre-settled synchronously before the first paint, so the initial view is
// stable (and a headless screenshot captures a settled graph); rAF only runs while
// the simulation is "hot" (on drag), then it sleeps, so an idle graph costs nothing.
//
// XSS-CRITICAL. Node labels are raw corpus `name`s. This file NEVER concatenates a
// name into innerHTML — every label reaches the DOM as an SVG <text> node's
// .textContent, so a law named `A <img onerror=alert(1)>` renders as inert text.
// The only markup created is via createElementNS/createElement with fixed tag names.
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var W = 900, H = 560;                 // viewBox units
  var CX = W / 2, CY = H / 2;

  // Force constants — tuned for a few dozen nodes. For a much larger corpus the
  // O(n^2) repulsion would need a quadtree; guarded below by capping pre-settle work.
  var REP = 3200;      // node-node repulsion strength
  var LINK = 110;      // spring rest length
  var K_LINK = 0.045;  // spring stiffness
  var GRAV = 0.012;    // pull toward centre (keeps disconnected nodes on-screen)
  var DAMP = 0.86;     // velocity damping

  // Reliability tier -> node fill (Codex-dark palette; mirrors the badge colours).
  var TIER = { Empirical: '#8fbf6f', Heuristic: '#d8a63f', 'Folk-adage': '#b7ab86', Contested: '#e05a44' };
  function tierColor(r) { return TIER[r] || '#c9bf9f'; }

  // ---- base path: derive from THIS script's own src (mirror of search.js). ----
  function computeBase() {
    var s = document.currentScript;
    if (!s) {
      var all = document.getElementsByTagName('script');
      for (var i = 0; i < all.length; i++) {
        if (/assets\/graph\.js(\?|$)/.test(all[i].src)) { s = all[i]; break; }
      }
    }
    if (s && s.src) {
      var m = s.src.replace(/assets\/graph\.js(\?.*)?$/, '');
      try { return new URL(m, location.href).pathname; } catch (e) { return '/'; }
    }
    return '/';
  }
  var BASE = computeBase();

  function svgEl(tag) { return document.createElementNS(SVGNS, tag); }

  function start() {
    var stage = document.getElementById('graph');
    if (!stage) return;
    fetch(BASE + 'graph.json')
      .then(function (r) { return r.json(); })
      .then(function (graph) {
        if (!graph || !Array.isArray(graph.nodes) || !graph.nodes.length) {
          stage.textContent = 'No laws to graph yet.';
          return;
        }
        graph.edges = Array.isArray(graph.edges) ? graph.edges : [];
        build(stage, graph);
      })
      .catch(function () { stage.textContent = 'The graph could not be loaded.'; });
  }

  function build(stage, graph) {
    // ---- model: nodes with position/velocity, an index, and a degree. ----
    var nodes = graph.nodes.map(function (n, i) { return { slug: n.slug, name: n.name, reliability: n.reliability, deg: 0, i: i, x: 0, y: 0, vx: 0, vy: 0, fx: null, fy: null }; });
    var index = {};
    nodes.forEach(function (n) { index[n.slug] = n; });
    var edges = graph.edges
      .map(function (e) { return { a: index[e.a], b: index[e.b], kind: e.kind }; })
      .filter(function (e) { return e.a && e.b; });
    edges.forEach(function (e) { e.a.deg++; e.b.deg++; });
    var maxDeg = nodes.reduce(function (m, n) { return Math.max(m, n.deg); }, 0) || 1;
    function radius(n) { return 6 + 9 * Math.sqrt(n.deg / maxDeg); }

    // Deterministic seed layout on a circle (no Math.random -> stable screenshots).
    var seedR = Math.min(W, H) * 0.34;
    nodes.forEach(function (n, i) {
      var a = (2 * Math.PI * i / nodes.length) - Math.PI / 2;
      n.x = CX + seedR * Math.cos(a) + (i % 3 - 1) * 6;
      n.y = CY + seedR * Math.sin(a) + (i % 2 ? 5 : -5);
    });

    // ---- one physics tick. alpha scales the whole step (cooling). ----
    function tick(alpha) {
      var i, j, a, b, dx, dy, d2, d, f;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j];
          dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy || 0.01;
          d = Math.sqrt(d2);
          f = (REP / d2) * alpha;
          var ux = dx / d, uy = dy / d;
          a.vx += ux * f; a.vy += uy * f;
          b.vx -= ux * f; b.vy -= uy * f;
        }
      }
      for (i = 0; i < edges.length; i++) {
        a = edges[i].a; b = edges[i].b;
        dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        f = K_LINK * (d - LINK) * alpha;
        var ex = (dx / d) * f, ey = (dy / d) * f;
        a.vx += ex; a.vy += ey; b.vx -= ex; b.vy -= ey;
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.vx += (CX - a.x) * GRAV * alpha;
        a.vy += (CY - a.y) * GRAV * alpha;
        if (a.fx != null) { a.x = a.fx; a.y = a.fy; a.vx = 0; a.vy = 0; continue; }
        a.vx *= DAMP; a.vy *= DAMP;
        a.x += a.vx; a.y += a.vy;
      }
    }

    // Pre-settle synchronously so the first paint is stable. Cap total work so a
    // large corpus can't freeze the tab on load.
    var settleTicks = nodes.length > 400 ? 120 : 420;
    var al = 1;
    for (var t = 0; t < settleTicks; t++) { tick(al); al = Math.max(0.02, al * 0.985); }

    // ---- SVG scaffold. ----
    var empty = document.getElementById('graph-empty');
    if (empty && empty.parentNode) empty.parentNode.removeChild(empty);

    var svg = svgEl('svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block';
    svg.style.touchAction = 'none';

    var vp = svgEl('g');           // pan/zoom viewport
    svg.appendChild(vp);
    var edgeLayer = svgEl('g'); vp.appendChild(edgeLayer);
    var nodeLayer = svgEl('g'); vp.appendChild(nodeLayer);

    // adjacency for hover-tracing
    var nbr = {};
    nodes.forEach(function (n) { nbr[n.slug] = {}; });
    edges.forEach(function (e) { nbr[e.a.slug][e.b.slug] = true; nbr[e.b.slug][e.a.slug] = true; });

    // edges
    var lineEls = edges.map(function (e) {
      var ln = svgEl('line');
      ln.setAttribute('stroke', '#5a4f2f');
      ln.setAttribute('stroke-width', '1.1');
      ln.setAttribute('stroke-linecap', 'round');
      // opposing/contrast relations dashed; kindred/twin solid.
      if (/oppos|contra|tension|versus/i.test(e.kind || '')) ln.setAttribute('stroke-dasharray', '4 4');
      edgeLayer.appendChild(ln);
      return ln;
    });

    // nodes
    var nodeEls = nodes.map(function (n) {
      var g = svgEl('g');
      g.setAttribute('class', 'gnode');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.style.cursor = 'pointer';

      var ring = svgEl('circle');    // subtle halo for hover emphasis
      ring.setAttribute('r', radius(n) + 5);
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', tierColor(n.reliability));
      ring.setAttribute('stroke-width', '1.5');
      ring.setAttribute('opacity', '0');
      g.appendChild(ring);

      var dot = svgEl('circle');
      dot.setAttribute('r', radius(n));
      dot.setAttribute('fill', tierColor(n.reliability));
      dot.setAttribute('stroke', '#141109');
      dot.setAttribute('stroke-width', '1.5');
      g.appendChild(dot);

      var label = svgEl('text');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-family', "'Space Mono',monospace");
      label.setAttribute('font-size', '11');
      label.setAttribute('fill', '#e7dcbe');
      label.setAttribute('paint-order', 'stroke');
      label.setAttribute('stroke', '#141109');
      label.setAttribute('stroke-width', '3');
      label.setAttribute('stroke-linejoin', 'round');
      label.textContent = n.name == null ? '' : String(n.name); // XSS-safe
      g.appendChild(label);

      nodeLayer.appendChild(g);
      return { g: g, ring: ring, dot: dot, label: label, node: n };
    });

    function place() {
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        lineEls[i].setAttribute('x1', e.a.x); lineEls[i].setAttribute('y1', e.a.y);
        lineEls[i].setAttribute('x2', e.b.x); lineEls[i].setAttribute('y2', e.b.y);
      }
      for (var j = 0; j < nodeEls.length; j++) {
        var ne = nodeEls[j], n = ne.node;
        ne.g.setAttribute('transform', 'translate(' + n.x + ' ' + n.y + ')');
        ne.label.setAttribute('y', -(radius(n) + 6));
      }
    }
    place();

    // ---- hover tracing: highlight a node + its neighbours, dim the rest. ----
    function setHover(slug) {
      for (var i = 0; i < nodeEls.length; i++) {
        var ne = nodeEls[i], s = ne.node.slug;
        var on = slug == null || s === slug || (nbr[slug] && nbr[slug][s]);
        ne.g.style.opacity = on ? '1' : '0.22';
        ne.ring.setAttribute('opacity', s === slug ? '0.9' : '0');
      }
      for (var k = 0; k < edges.length; k++) {
        var e = edges[k], hot = slug != null && (e.a.slug === slug || e.b.slug === slug);
        lineEls[k].setAttribute('stroke', hot ? '#d8a63f' : '#5a4f2f');
        lineEls[k].setAttribute('stroke-width', hot ? '2' : '1.1');
        lineEls[k].setAttribute('opacity', slug == null || hot ? '1' : '0.25');
      }
    }

    // ---- pan / zoom / drag ----
    var tx = 0, ty = 0, k = 1;
    function applyVp() { vp.setAttribute('transform', 'translate(' + tx + ' ' + ty + ') scale(' + k + ')'); }
    function toVB(clientX, clientY) {
      var pt = svg.createSVGPoint(); pt.x = clientX; pt.y = clientY;
      var m = svg.getScreenCTM();
      return m ? pt.matrixTransform(m.inverse()) : { x: clientX, y: clientY };
    }
    function toGraph(clientX, clientY) { var v = toVB(clientX, clientY); return { x: (v.x - tx) / k, y: (v.y - ty) / k }; }

    // Frame the settled graph: scale + centre its bounding box to fill the stage,
    // so the layout never sits as a tight clump in a sea of empty black (and the
    // framing is right regardless of how compact/spread the simulation ends up).
    function fit() {
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      nodes.forEach(function (n) {
        var r = radius(n) + 16;
        minX = Math.min(minX, n.x - r); maxX = Math.max(maxX, n.x + r);
        minY = Math.min(minY, n.y - r); maxY = Math.max(maxY, n.y + r);
      });
      var bw = Math.max(1, maxX - minX), bh = Math.max(1, maxY - minY), pad = 46;
      k = Math.max(0.5, Math.min(2.2, Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh)));
      tx = W / 2 - ((minX + maxX) / 2) * k;
      ty = H / 2 - ((minY + maxY) / 2) * k;
      applyVp();
    }
    fit();

    var drag = null;   // {node} while dragging a node
    var pan = null;    // {startTx, startTy, startVB} while panning background
    var moved = 0;

    function hot(ticks) {   // reheat the sim briefly (used after a drag)
      var a = 0.5, left = ticks || 90;
      (function loop() {
        tick(a); a = Math.max(0.02, a * 0.96); place();
        if (--left > 0) requestAnimationFrame(loop);
      })();
    }

    nodeEls.forEach(function (ne) {
      ne.g.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation();
        drag = { node: ne.node }; moved = 0;
        ne.node.fx = ne.node.x; ne.node.fy = ne.node.y;
        try { ne.g.setPointerCapture(ev.pointerId); } catch (e) {}
      });
      ne.g.addEventListener('pointerup', function (ev) {
        if (drag && drag.node === ne.node) {
          ne.node.fx = null; ne.node.fy = null;
          if (moved < 5) { location = BASE + 'laws/' + encodeURIComponent(ne.node.slug) + '/'; }
          drag = null; hot(60);
        }
      });
      ne.g.addEventListener('mouseenter', function () { if (!drag && !pan) setHover(ne.node.slug); });
      ne.g.addEventListener('mouseleave', function () { if (!drag && !pan) setHover(null); });
      ne.g.addEventListener('focus', function () { setHover(ne.node.slug); });
      ne.g.addEventListener('blur', function () { setHover(null); });
      ne.g.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); location = BASE + 'laws/' + encodeURIComponent(ne.node.slug) + '/'; }
      });
    });

    svg.addEventListener('pointerdown', function (ev) {
      if (drag) return;
      pan = { startTx: tx, startTy: ty, startVB: toVB(ev.clientX, ev.clientY) };
      try { svg.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    window.addEventListener('pointermove', function (ev) {
      if (drag) {
        var g = toGraph(ev.clientX, ev.clientY);
        moved += Math.abs(g.x - drag.node.x) + Math.abs(g.y - drag.node.y);
        drag.node.fx = g.x; drag.node.fy = g.y; drag.node.x = g.x; drag.node.y = g.y;
        hot(2); // keep it lively while dragging
      } else if (pan) {
        var v = toVB(ev.clientX, ev.clientY);
        tx = pan.startTx + (v.x - pan.startVB.x);
        ty = pan.startTy + (v.y - pan.startVB.y);
        applyVp();
      }
    });
    window.addEventListener('pointerup', function () { pan = null; });

    svg.addEventListener('wheel', function (ev) {
      ev.preventDefault();
      var v = toVB(ev.clientX, ev.clientY);
      var gx = (v.x - tx) / k, gy = (v.y - ty) / k;
      var factor = ev.deltaY < 0 ? 1.12 : 1 / 1.12;
      k = Math.max(0.4, Math.min(4, k * factor));
      tx = v.x - gx * k; ty = v.y - gy * k;
      applyVp();
    }, { passive: false });

    stage.appendChild(svg);
    addLegend(stage);
    addHint(stage);

    // If arrived via ?law=<slug>, trace that node so the visitor lands oriented.
    try {
      var want = new URLSearchParams(location.search).get('law');
      if (want && index[want]) setHover(want);
    } catch (e) {}
  }

  // ---- legend + hint overlays (DOM, textContent — no untrusted strings) ----
  function addLegend(stage) {
    var box = document.createElement('div');
    box.style.cssText = 'position:absolute;left:16px;top:14px;display:flex;flex-wrap:wrap;gap:12px;font-family:\'Space Mono\',monospace;font-size:10.5px;letter-spacing:.04em;color:#a89e84;pointer-events:none';
    [['Empirical', '#8fbf6f'], ['Heuristic', '#d8a63f'], ['Folk-adage', '#b7ab86'], ['Contested', '#e05a44']].forEach(function (t) {
      var item = document.createElement('span');
      item.style.cssText = 'display:inline-flex;align-items:center;gap:6px';
      var dot = document.createElement('span');
      dot.style.cssText = 'width:9px;height:9px;border-radius:50%;background:' + t[1];
      var lab = document.createElement('span'); lab.textContent = t[0];
      item.appendChild(dot); item.appendChild(lab); box.appendChild(item);
    });
    stage.appendChild(box);
  }
  function addHint(stage) {
    var h = document.createElement('div');
    h.style.cssText = 'position:absolute;right:16px;bottom:12px;font-family:\'Space Mono\',monospace;font-size:10.5px;color:#6e6650;pointer-events:none;text-align:right';
    h.textContent = 'drag · scroll to zoom · click a node';
    stage.appendChild(h);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
