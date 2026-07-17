// Task 11 — the graph explorer's browser runtime. Fetches dist/graph.json (the
// whole graph) and renders a LOCAL NEIGHBOURHOOD ONLY (spec §6 — never the full
// hairball): a focus node at centre with its 1–2-hop neighbours around it.
//
// XSS-CRITICAL. Node labels are raw corpus `name`s — the exact surface that XSS'd
// Task 7's hero rotation. This file NEVER concatenates a raw name into innerHTML /
// insertAdjacentHTML. Every label reaches the DOM as an SVG <text> node's
// .textContent, so a law named `A <img onerror=alert(1)>` renders as inert text,
// never an executing tag. The only markup created is via createElementNS with
// fixed tag names; all corpus strings are textContent.
//
// The neighbourhood selection is the browser twin of build/graph-data.mjs's pure
// `neighbourhood()` (unit-tested in Node); the layout is deterministic (angles from
// node index/count — NO Math.random), so the same focus always draws the same map.
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var HOPS = 1;           // local neighbourhood radius
  var W = 720, H = 420;   // viewBox
  var CX = W / 2, CY = H / 2;
  var R = 150;            // neighbour ring radius

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

  // ---- pure-ish neighbourhood select (twin of graph-data.mjs neighbourhood). ----
  function neighbourhood(graph, slug, hops) {
    var byslug = {}, adj = {}, i;
    for (i = 0; i < graph.nodes.length; i++) {
      var n = graph.nodes[i];
      byslug[n.slug] = n; adj[n.slug] = [];
    }
    var focus = byslug[slug];
    if (!focus) return { focus: null, nodes: [], edges: [] };
    for (i = 0; i < graph.edges.length; i++) {
      var e = graph.edges[i];
      if (adj[e.a]) adj[e.a].push(e.b);
      if (adj[e.b]) adj[e.b].push(e.a);
    }
    var included = {}, order = [slug], frontier = [slug];
    included[slug] = true;
    for (var h = 0; h < Math.max(0, hops); h++) {
      var next = [];
      for (var f = 0; f < frontier.length; f++) {
        var nbrs = adj[frontier[f]] || [];
        for (var k = 0; k < nbrs.length; k++) {
          var nb = nbrs[k];
          if (!included[nb]) { included[nb] = true; order.push(nb); next.push(nb); }
        }
      }
      frontier = next;
    }
    var subNodes = order.map(function (s) { return byslug[s]; });
    var subEdges = graph.edges.filter(function (ed) { return included[ed.a] && included[ed.b]; });
    return { focus: focus, nodes: subNodes, edges: subEdges };
  }

  // ---- deterministic radial layout: focus at centre, neighbours on a ring. ----
  function layout(sub) {
    var pos = {};
    var focus = sub.focus.slug;
    pos[focus] = { x: CX, y: CY };
    var others = sub.nodes.filter(function (n) { return n.slug !== focus; });
    var count = others.length;
    for (var i = 0; i < count; i++) {
      // Angle purely from index/count (deterministic). Start at -90° (top).
      var ang = (-Math.PI / 2) + (2 * Math.PI * i / Math.max(1, count));
      pos[others[i].slug] = { x: CX + R * Math.cos(ang), y: CY + R * Math.sin(ang) };
    }
    return pos;
  }

  function render(graph, focusSlug, stage) {
    var sub = neighbourhood(graph, focusSlug, HOPS);
    if (!sub.focus) return;
    var pos = layout(sub);

    var svg = svgEl('svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'graph-svg');
    svg.setAttribute('width', '100%');

    // Edges first (drawn under the nodes).
    var i, e, a, b;
    for (i = 0; i < sub.edges.length; i++) {
      e = sub.edges[i]; a = pos[e.a]; b = pos[e.b];
      if (!a || !b) continue;
      var line = svgEl('line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      line.setAttribute('class', 'graph-edge');
      // Inline colours so the dark Codex stage renders without extra CSS.
      line.setAttribute('stroke', '#3c341f');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    }

    // Nodes + labels.
    for (i = 0; i < sub.nodes.length; i++) {
      var node = sub.nodes[i];
      var p = pos[node.slug];
      if (!p) continue;
      var isFocus = node.slug === sub.focus.slug;

      var g = svgEl('g');
      g.setAttribute('class', 'graph-node' + (isFocus ? ' is-focus' : ''));
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.style.cursor = isFocus ? 'default' : 'pointer';

      var circle = svgEl('circle');
      circle.setAttribute('cx', p.x); circle.setAttribute('cy', p.y);
      circle.setAttribute('r', isFocus ? 9 : 6);
      circle.setAttribute('class', 'graph-dot');
      circle.setAttribute('fill', isFocus ? '#d8a63f' : '#c9bf9f');
      g.appendChild(circle);

      var label = svgEl('text');
      label.setAttribute('x', p.x);
      label.setAttribute('y', p.y - (isFocus ? 16 : 13));
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'graph-label');
      label.setAttribute('fill', isFocus ? '#f1e7cf' : '#c9bf9f');
      label.setAttribute('font-family', "'Space Mono',monospace");
      label.setAttribute('font-size', isFocus ? '13' : '11');
      // XSS-SAFE: corpus name set as inert text, never parsed as markup.
      label.textContent = node.name == null ? '' : String(node.name);
      g.appendChild(label);

      if (!isFocus) {
        (function (slug) {
          function go() { render(graph, slug, stage); }
          g.addEventListener('click', go);
          g.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); }
          });
        })(node.slug);
      }
      svg.appendChild(g);
    }

    stage.textContent = ''; // clear previous frame / loading text, no innerHTML
    stage.appendChild(svg);
  }

  function pickInitialFocus(graph) {
    // ?law=<slug> if present and known, else the first node.
    var want = null;
    try { want = new URLSearchParams(location.search).get('law'); } catch (e) { want = null; }
    if (want) {
      for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].slug === want) return want;
      }
    }
    return graph.nodes.length ? graph.nodes[0].slug : null;
  }

  function start() {
    var stage = document.getElementById('graph');
    if (!stage) return; // nothing to wire on this page
    fetch(BASE + 'graph.json')
      .then(function (r) { return r.json(); })
      .then(function (graph) {
        if (!graph || !Array.isArray(graph.nodes) || !graph.nodes.length) {
          stage.textContent = 'No laws to graph yet.';
          return;
        }
        graph.edges = Array.isArray(graph.edges) ? graph.edges : [];
        var focus = pickInitialFocus(graph);
        if (focus) render(graph, focus, stage);
      })
      .catch(function () {
        stage.textContent = 'The graph could not be loaded.';
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
