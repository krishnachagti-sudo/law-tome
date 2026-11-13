// /chains/ and /clusters/ (backlog B4, B3): both computed from the entries'
// own `related` labels, so these pin how the labels are read.
import test from 'node:test';
import assert from 'node:assert/strict';
import { leadsTo, causalChains, kindredClusters } from '../build/lineage.mjs';

const law = (slug, related = []) => ({ slug, name: slug.toUpperCase(), related });

test('a cause label points into the entry, a consequence label out of it', () => {
  // On B, "A is a cause" means A leads to B; on B, "C is a consequence" means B leads to C.
  const { edges } = leadsTo([law('a'), law('b', [{ slug: 'a', kind: 'cause' }, { slug: 'c', kind: 'consequence' }]), law('c')]);
  assert.deepEqual(edges, [['a', 'b'], ['b', 'c']]);
});

test('a pair labelled both ways is set aside, not walked', () => {
  const laws = [law('a', [{ slug: 'b', kind: 'cause' }]), law('b', [{ slug: 'a', kind: 'cause' }])];
  const { edges, twoWay } = leadsTo(laws);
  assert.deepEqual(edges, []);
  assert.deepEqual(twoWay, [['a', 'b']]);
});

test('chains are the longest walks from where nothing leads in, three or more long', () => {
  const laws = [
    law('a', [{ slug: 'b', kind: 'consequence' }]),
    law('b', [{ slug: 'c', kind: 'consequence' }, { slug: 'x', kind: 'consequence' }]),
    law('c', [{ slug: 'd', kind: 'consequence' }]),
    law('d'), law('x'),
    law('p', [{ slug: 'q', kind: 'consequence' }]), law('q'),
  ];
  const { chains } = causalChains(laws);
  assert.deepEqual(chains, [['a', 'b', 'c', 'd']], 'the two-step p→q is too short, and the longer branch wins');
});

test('clusters are the same every time, named after their best-connected member', () => {
  const k = (a, b) => ({ slug: b, kind: 'kindred' });
  const laws = [
    law('hub', [k('hub', 'a'), k('hub', 'b'), k('hub', 'c')]), law('a', [k('a', 'b')]), law('b'), law('c'),
    law('lone', [k('lone', 'other')]), law('other'),
  ];
  const one = kindredClusters(laws);
  assert.deepEqual(one, kindredClusters(laws));
  assert.equal(one.length, 1, 'a pair is under the four-member floor');
  assert.equal(one[0].anchor, 'hub');
  assert.deepEqual([...one[0].members].sort(), ['a', 'b', 'c', 'hub']);
});
