import { personSlug } from '../src/templates/partials.mjs';
// Task 11 — graph data. Pure, I/O-free transforms over the loaded corpus:
//   buildGraph(laws) -> { nodes, edges } for the graph explorer + graph.json
//   neighbourhood(graph, slug, hops) -> a focused local subgraph
//
// The explorer never renders the full hairball (spec §6): the client fetches the
// whole graph but only ever draws a LOCAL NEIGHBOURHOOD. `neighbourhood` is the
// pure core of that selection, extracted here so it is unit-testable in Node (the
// browser's src/assets/graph.js is its runtime twin).

/**
 * Build the undirected relationship graph from the corpus.
 * @param {object[]} laws  each {slug, name, category, related?: [{slug, kind}]}
 * @returns {{nodes: {slug,name,category}[], edges: {a,b,kind}[]}}
 *
 * nodes: one per law, {slug, name, category, reliability}. reliability is carried
 *   so the client graph can colour each node by its tier (Empirical / Heuristic /
 *   Folk-adage / Contested) without a second fetch — a short enum, negligible size.
 * edges: derived from each law's `related[]`. UNDIRECTED + DE-DUPLICATED —
 *   every edge is normalised so a < b (string compare) and a pair appears once
 *   (an A->B and a B->A collapse; a repeated A->B collapses). Edges to a slug
 *   with no node (dangling) and self-loops (a law relating to itself) are dropped.
 */
export function buildGraph(laws = [], faces = null) {
  const rows = Array.isArray(laws) ? laws : [];
  // `face` is the portrait slug for an eponymous law whose namesake we have a
  // verified picture of, so the explorer can draw the person instead of a dot.
  // Absent for everything else; the renderer falls back to the coloured circle.
  const nodes = rows.map((l) => {
    const face = l.namedAfter && faces && faces.has(personSlug(l.namedAfter))
      ? personSlug(l.namedAfter) : null;
    return { slug: l.slug, name: l.name, category: l.category, reliability: l.reliability,
      ...(face ? { face } : {}) };
  });

  const known = new Set(nodes.map((n) => n.slug));
  const seen = new Map(); // "ab" -> {a, b, kind} — first kind seen wins
  const edges = [];

  for (const law of rows) {
    const from = law.slug;
    const rels = Array.isArray(law.related) ? law.related : [];
    for (const rel of rels) {
      const to = rel && rel.slug;
      if (to == null) continue;
      if (to === from) continue;            // no self-loops
      if (!known.has(from) || !known.has(to)) continue; // both ends must be nodes
      const [a, b] = from < to ? [from, to] : [to, from]; // normalise a < b
      const key = a + ' ' + b; // separator: no slug can contain a space, so distinct pairs never collide
      if (seen.has(key)) continue;          // undirected de-dup
      const edge = { a, b, kind: rel.kind };
      seen.set(key, edge);
      edges.push(edge);
    }
  }
  return { nodes, edges };
}

/**
 * The local neighbourhood of `slug`: the focus node plus every node reachable
 * within `hops` undirected steps, and the edges among that set.
 * @param {{nodes,edges}} graph  a graph from buildGraph
 * @param {string} slug          focus slug
 * @param {number} [hops=1]      how many undirected steps to include
 * @returns {{focus, nodes, edges}}  focus may be undefined if slug is unknown
 */
export function neighbourhood(graph, slug, hops = 1) {
  const nodes = (graph && Array.isArray(graph.nodes)) ? graph.nodes : [];
  const edges = (graph && Array.isArray(graph.edges)) ? graph.edges : [];
  const byslug = new Map(nodes.map((n) => [n.slug, n]));
  const focus = byslug.get(slug);
  if (!focus) return { focus: undefined, nodes: [], edges: [] };

  // Adjacency for BFS.
  const adj = new Map();
  for (const n of nodes) adj.set(n.slug, []);
  for (const e of edges) {
    if (adj.has(e.a)) adj.get(e.a).push(e.b);
    if (adj.has(e.b)) adj.get(e.b).push(e.a);
  }

  // BFS out to `hops`, preserving first-discovery order for a deterministic layout.
  const included = new Set([slug]);
  const order = [slug];
  let frontier = [slug];
  for (let h = 0; h < Math.max(0, hops); h++) {
    const next = [];
    for (const cur of frontier) {
      for (const nb of adj.get(cur) || []) {
        if (!included.has(nb)) { included.add(nb); order.push(nb); next.push(nb); }
      }
    }
    frontier = next;
  }

  const subNodes = order.map((s) => byslug.get(s));
  const subEdges = edges.filter((e) => included.has(e.a) && included.has(e.b));
  return { focus, nodes: subNodes, edges: subEdges };
}
