// Two views computed from the relation graph (backlog B3 and B4). Nothing here
// is authored: every cluster and every step of every chain comes from the
// `related` labels the entries already carry, and both pages say so.

/**
 * Directed "leads to" edges from the `cause` and `consequence` labels.
 *
 * On entry A, `{slug: B, kind: 'cause'}` means B leads to A (the bystander
 * effect lists diffusion of responsibility as a cause), and `{slug: B, kind:
 * 'consequence'}` means A leads to B (the Turing machine lists the halting
 * problem). The schema does not spell the direction out; it was read off a
 * sample of the edges and holds across them.
 *
 * Pairs labelled in BOTH directions contradict each other, so they cannot be
 * walked either way. They are returned separately and left out.
 */
export function leadsTo(laws = []) {
  const known = new Set(laws.map((l) => l.slug));
  const all = new Set();
  for (const l of laws) {
    for (const r of l.related || []) {
      if (!known.has(r.slug) || r.slug === l.slug) continue;
      if (r.kind === 'cause') all.add(`${r.slug}\u0000${l.slug}`);
      if (r.kind === 'consequence') all.add(`${l.slug}\u0000${r.slug}`);
    }
  }
  const edges = [];
  const twoWay = [];
  for (const e of all) {
    const [a, b] = e.split('\u0000');
    if (all.has(`${b}\u0000${a}`)) { if (a < b) twoWay.push([a, b]); } else edges.push([a, b]);
  }
  edges.sort((x, y) => x[0].localeCompare(y[0]) || x[1].localeCompare(y[1]));
  return { edges, twoWay: twoWay.sort() };
}

/**
 * Walkable chains: from every entry nothing leads to, the longest path out,
 * kept when it has at least `min` steps' worth of entries. Ties go to the
 * alphabetically first branch, so a build is reproducible.
 */
export function causalChains(laws = [], { min = 3 } = {}) {
  const { edges, twoWay } = leadsTo(laws);
  const out = new Map();
  const indeg = new Map();
  for (const [a, b] of edges) {
    if (!out.has(a)) out.set(a, []);
    out.get(a).push(b);
    indeg.set(b, (indeg.get(b) || 0) + 1);
  }
  for (const v of out.values()) v.sort();
  const memo = new Map();
  const visiting = new Set();
  const longest = (u) => {
    if (memo.has(u)) return memo.get(u);
    // A cycle would make "longest path" meaningless; the data has none once
    // the two-way pairs are out, and this guard keeps a future one from
    // looping instead of simply ending the chain.
    if (visiting.has(u)) return [u];
    visiting.add(u);
    let best = [u];
    for (const v of out.get(u) || []) {
      const p = [u, ...longest(v)];
      if (p.length > best.length) best = p;
    }
    visiting.delete(u);
    memo.set(u, best);
    return best;
  };
  const nodes = new Set(edges.flat());
  const seen = new Set();
  const chains = [];
  for (const s of [...nodes].filter((n) => !indeg.get(n)).sort()) {
    const c = longest(s);
    const key = c.join('>');
    if (c.length >= min && !seen.has(key)) { seen.add(key); chains.push(c); }
  }
  chains.sort((a, b) => b.length - a.length || a[0].localeCompare(b[0]));
  return { chains, edges: edges.length, twoWay };
}

/**
 * Clusters of ideas that travel together, from the `kindred` edges, by label
 * propagation: each entry repeatedly takes the label most common among its
 * neighbours, ties to the alphabetically first, visiting entries in slug
 * order — the same corpus always gives the same clusters.
 *
 * Named after the best-connected member, never by hand: a hand-written title
 * ("Biases of belief") would be a claim about what the cluster means, and the
 * cluster is only a fact about which entries point at each other.
 */
export function kindredClusters(laws = [], { min = 4, rounds = 30 } = {}) {
  const known = new Set(laws.map((l) => l.slug));
  const adj = new Map();
  const link = (a, b) => { if (!adj.has(a)) adj.set(a, new Set()); adj.get(a).add(b); };
  for (const l of laws) {
    for (const r of l.related || []) {
      if (r.kind !== 'kindred' || !known.has(r.slug) || r.slug === l.slug) continue;
      link(l.slug, r.slug); link(r.slug, l.slug);
    }
  }
  const nodes = [...adj.keys()].sort();
  const label = new Map(nodes.map((n) => [n, n]));
  for (let i = 0; i < rounds; i += 1) {
    let changed = 0;
    for (const n of nodes) {
      const count = new Map();
      for (const v of adj.get(n)) count.set(label.get(v), (count.get(label.get(v)) || 0) + 1);
      const top = Math.max(...count.values());
      const best = [...count.entries()].filter(([, c]) => c === top).map(([l]) => l).sort()[0];
      if ((count.get(label.get(n)) || 0) < top && best !== label.get(n)) { label.set(n, best); changed += 1; }
    }
    if (!changed) break;
  }
  const groups = new Map();
  for (const [n, l] of label) { if (!groups.has(l)) groups.set(l, []); groups.get(l).push(n); }
  const degree = (s) => adj.get(s).size;
  return [...groups.values()]
    .filter((g) => g.length >= min)
    .map((g) => {
      const members = g.slice().sort((a, b) => degree(b) - degree(a) || a.localeCompare(b));
      return { anchor: members[0], members };
    })
    .sort((a, b) => b.members.length - a.members.length || a.anchor.localeCompare(b.anchor));
}
