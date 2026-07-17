import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildGraph, neighbourhood } from '../build/graph-data.mjs';
import { buildSite } from '../build/build.mjs';
const laws = [
  {slug:'goodharts-law', name:"Goodhart's Law", category:'economics', related:[{slug:'campbells-law', kind:'near-twin'}]},
  {slug:'campbells-law', name:"Campbell's Law", category:'sociology', related:[]}
];
const g = buildGraph(laws);
test('a node per law; undirected, de-duplicated edges', () => {
  assert.equal(g.nodes.length, 2);
  assert.equal(g.edges.length, 1);
  assert.deepEqual([g.edges[0].a, g.edges[0].b].sort(), ['campbells-law','goodharts-law']);
});
test('drops edges to unknown slugs', () => {
  assert.equal(buildGraph([{slug:'x', name:'X', category:'economics', related:[{slug:'ghost', kind:'kindred'}]}]).edges.length, 0);
});

test('node shape is {slug, name, category} only', () => {
  const n = buildGraph([{slug:'x', name:'X', category:'economics', related:[], no:'001', extra:true}]).nodes[0];
  assert.deepEqual(Object.keys(n).sort(), ['category','name','slug']);
  assert.deepEqual(n, { slug:'x', name:'X', category:'economics' });
});

test('drops self-loops (a law relating to itself)', () => {
  const gg = buildGraph([{slug:'x', name:'X', category:'economics', related:[{slug:'x', kind:'self'}]}]);
  assert.equal(gg.edges.length, 0);
});

test('A->B and B->A collapse to a single undirected edge', () => {
  const gg = buildGraph([
    {slug:'a', name:'A', category:'c', related:[{slug:'b', kind:'twin'}]},
    {slug:'b', name:'B', category:'c', related:[{slug:'a', kind:'twin'}]},
  ]);
  assert.equal(gg.edges.length, 1);
  assert.deepEqual([gg.edges[0].a, gg.edges[0].b], ['a','b']);
});

test('a repeated A->B edge collapses to one', () => {
  const gg = buildGraph([
    {slug:'a', name:'A', category:'c', related:[{slug:'b', kind:'twin'}, {slug:'b', kind:'twin'}]},
    {slug:'b', name:'B', category:'c', related:[]},
  ]);
  assert.equal(gg.edges.length, 1);
});

test('neighbourhood: 1-hop returns focus + direct neighbours + their edges', () => {
  const gg = buildGraph([
    {slug:'a', name:'A', category:'c', related:[{slug:'b', kind:'twin'}, {slug:'c', kind:'twin'}]},
    {slug:'b', name:'B', category:'c', related:[{slug:'d', kind:'twin'}]},
    {slug:'c', name:'C', category:'c', related:[]},
    {slug:'d', name:'D', category:'c', related:[]},
  ]);
  const nb = neighbourhood(gg, 'a', 1);
  assert.equal(nb.focus.slug, 'a');
  assert.deepEqual(nb.nodes.map(n => n.slug).sort(), ['a','b','c']); // d is 2 hops away
  // edges among {a,b,c}: a-b and a-c only (b-d excluded)
  assert.equal(nb.edges.length, 2);
});

test('neighbourhood: 2-hop reaches d; unknown focus returns empty', () => {
  const gg = buildGraph([
    {slug:'a', name:'A', category:'c', related:[{slug:'b', kind:'twin'}]},
    {slug:'b', name:'B', category:'c', related:[{slug:'d', kind:'twin'}]},
    {slug:'d', name:'D', category:'c', related:[]},
  ]);
  assert.deepEqual(neighbourhood(gg, 'a', 2).nodes.map(n => n.slug).sort(), ['a','b','d']);
  const empty = neighbourhood(gg, 'ghost', 2);
  assert.equal(empty.focus, undefined);
  assert.equal(empty.nodes.length, 0);
});

test('build emits graph.json + graph page referencing graph.js', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-'));
  await buildSite({ dataDir:'src/data/laws', catFile:'src/data/categories.json', assetsDir:'src/assets', out, base:'/lawtome/', origin:'https://conyso.com' });
  assert.ok(existsSync(join(out, 'graph.json')), 'missing graph.json');
  assert.ok(existsSync(join(out, 'graph/index.html')), 'missing graph/index.html');
  assert.ok(existsSync(join(out, 'assets/graph.js')), 'graph.js not copied');
  const gj = JSON.parse(await readFile(join(out, 'graph.json'), 'utf8'));
  assert.ok(Array.isArray(gj.nodes) && gj.nodes.length >= 1);
  assert.ok(Array.isArray(gj.edges));
  const page = await readFile(join(out, 'graph/index.html'), 'utf8');
  assert.match(page, /\/lawtome\/assets\/graph\.js/);
  assert.match(page, /id="graph"/);
  await rm(out, { recursive:true, force:true });
});

test('edge dedup key separates slugs so distinct pairs never collide', () => {
  // Without a separator, edge ("ab","c") and edge ("a","bc") both key to "abc"
  // and one is silently dropped. All four slugs are nodes (no dangling).
  const g = buildGraph([
    { slug:'ab', name:'AB', category:'x', related:[{ slug:'c', kind:'k' }] },
    { slug:'c',  name:'C',  category:'x', related:[] },
    { slug:'a',  name:'A',  category:'x', related:[{ slug:'bc', kind:'k' }] },
    { slug:'bc', name:'BC', category:'x', related:[] },
  ]);
  assert.equal(g.edges.length, 2);
});
