import { test } from 'node:test';
import assert from 'node:assert/strict';
import { namesakePage, namesakePath, namesakesWithPages, siblingOrderings, isJoint } from '../src/templates/namesake.mjs';

const newton = {
  person: 'Isaac Newton',
  kind: 'person',
  laws: [
    { no: '140', slug: 'a', name: "Newton's Law of Cooling", statement: 'S', category: 'physics', reliability: 'Empirical', coinedYear: 1701 },
    { no: '212', slug: 'b', name: "Newton's Laws of Motion", statement: 'T', category: 'physics', reliability: 'Empirical', coinedYear: 1687 },
  ],
};
const ctx = {
  base: '/lawtome/', origin: 'https://conyso.com',
  categories: { physics: 'Physics & the physical world' },
  kinds: { 'Isaac Newton': { qid: 'Q935', title: 'Isaac Newton', kind: 'person' } },
  facts: { _people: { 'isaac-newton': { origin: { place: 'Woolsthorpe Manor', source: 'https://www.wikidata.org/wiki/Q935' } } } },
};

test('only people with more than one law get a page', () => {
  const groups = [
    newton,
    { person: 'One Law Person', kind: 'person', laws: [{ slug: 'x', name: 'X' }] },
    // A place or a character can also carry two laws; "where was it born" is not
    // a question this page shape can answer, so it gets no page.
    { person: 'Pygmalion', kind: 'fictional', laws: [{ slug: 'y', name: 'Y' }, { slug: 'z', name: 'Z' }] },
    { person: 'Unknown Kind', laws: [{ slug: 'p', name: 'P' }, { slug: 'q', name: 'Q' }] },
  ];
  assert.deepEqual(namesakesWithPages(groups).map((g) => g.person), ['Isaac Newton']);
});

test('a namesake page states the cluster and links every law', () => {
  const h = namesakePage(newton, ctx);
  assert.match(h, /Isaac Newton has 2 named laws/);
  assert.match(h, /named between 1687 and 1701/);
  assert.match(h, /href="\/lawtome\/laws\/a\//);
  assert.match(h, /href="\/lawtome\/laws\/b\//);
  assert.match(h, /"@type":"CollectionPage"/);
  assert.match(h, /"@type":"Person"/);
  assert.match(h, /"numberOfItems":2/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/named-after\/isaac-newton\/"/);
});

// ANTI-FABRICATION. The page may carry only what was fetched and sourced. A
// biography written from memory is exactly the invented fact this project
// refuses, so the page links the record rather than paraphrasing it.
test('a namesake page publishes only sourced facts about the person', () => {
  const h = namesakePage(newton, ctx);
  assert.match(h, /Woolsthorpe Manor/);
  assert.match(h, /wikidata\.org\/wiki\/Q935/);
  assert.match(h, /en\.wikipedia\.org\/wiki\/Isaac_Newton/);
  // No birth or death dates: the corpus never fetched them.
  assert.doesNotMatch(h, /"birthDate"|"deathDate"/);
  // With no Wikidata match, nothing is asserted in its place.
  const bare = namesakePage({ ...newton, person: 'Nobody Known' }, { ...ctx, kinds: {}, facts: {} });
  assert.doesNotMatch(bare, /wikidata\.org/);
  assert.doesNotMatch(bare, /"identifier"/);
});

test('a joint namesake takes a plural verb and says whose record it links', () => {
  assert.equal(isJoint('Amos Tversky and Daniel Kahneman'), true);
  assert.equal(isJoint('Isaac Newton'), false);
  const pair = { person: 'Amos Tversky and Daniel Kahneman', kind: 'person', laws: newton.laws };
  const h = namesakePage(pair, {
    ...ctx,
    kinds: { 'Amos Tversky and Daniel Kahneman': { qid: 'Q474333', title: 'Amos Tversky' } },
  });
  assert.match(h, /Amos Tversky and Daniel Kahneman have 2 named laws/);
  // The fetch resolved ONE of the two, so the link must not read as a record
  // for the pair.
  assert.match(h, /one of the two/);
});

// The same two people in two written orders is not a duplicate to normalise:
// the order follows each paper's authorship. Both stay, and each points at the
// other so neither looks like the whole of what the pair is named on.
test('orderings of the same people are matched and cross-linked', () => {
  const a = { person: 'Amos Tversky and Daniel Kahneman', kind: 'person', laws: [{ slug: 'a', name: 'A' }, { slug: 'b', name: 'B' }] };
  const b = { person: 'Daniel Kahneman and Amos Tversky', kind: 'person', laws: [{ slug: 'c', name: 'C' }, { slug: 'd', name: 'D' }] };
  const map = siblingOrderings([a, b, newton]);
  assert.deepEqual(map[a.person].map((g) => g.person), [b.person]);
  assert.deepEqual(map[b.person].map((g) => g.person), [a.person]);
  assert.equal(map['Isaac Newton'], undefined);
  const h = namesakePage(a, { ...ctx, siblings: map[a.person] });
  assert.match(h, /named-after\/daniel-kahneman-and-amos-tversky\//);
  assert.match(h, /both orderings are kept/);
});

test('namesakePath is the slug the index links at', () => {
  assert.equal(namesakePath('Émile Durkheim'), 'named-after/emile-durkheim/');
});
