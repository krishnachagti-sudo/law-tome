import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verdicts, verdictPath, verdictLine, isSoft, isTestable } from '../build/verdicts.mjs';
import { verdictPage } from '../src/templates/verdict.mjs';

// The fixture entries are all "effects" so they pass the testability filter;
// the filter itself is exercised separately below.
const kindOf = (l) => (l && l.kind !== undefined ? l.kind : 'effect');

const law = (slug, reliability, category = 'psychology', extra = {}) => ({
  slug,
  name: slug.replace(/-/g, ' '),
  reliability,
  category,
  statement: `${slug} says a thing.`,
  limits: `${slug} stops working somewhere.`,
  misreadings: `${slug} is often read as something else.`,
  sources: [{ text: 'A source.', url: 'https://example.test/a', type: 'primary' }],
  ...extra,
});

const LAWS = [
  law('a', 'Contested'),
  law('b', 'Empirical'),
  law('c', 'Heuristic'),
  law('d', 'Folk-adage', 'economics'),
  law('e', 'Contested', 'economics'),
  law('f', 'Empirical', 'economics'),
];
// b (Empirical) is ranked and must be skipped; c is unranked and must be skipped.
const RANKED = [{ law: LAWS[0] }, { law: LAWS[1] }, { law: LAWS[3] }, { law: LAWS[4] }];

test('only entries that are both ranked and not Empirical get a page', () => {
  const v = verdicts(LAWS, RANKED, { kindOf });
  assert.deepEqual(v.map((x) => x.slug), ['a', 'd', 'e']);
});

test('an unranked entry gets no page however soft its rating', () => {
  assert.equal(verdicts(LAWS, [], { kindOf }).length, 0, 'nobody is asking about an unmeasurable name');
});

test('rank is the position in the full ranking, not in the filtered list', () => {
  const v = verdicts(LAWS, RANKED, { kindOf });
  assert.equal(v.find((x) => x.slug === 'd').rank, 3, 'the Empirical entry still occupies rank 2');
  assert.equal(v[0].rankOf, 4);
});

test('the field share counts the whole field, not the ranked part of it', () => {
  const v = verdicts(LAWS, RANKED, { kindOf }).find((x) => x.slug === 'd');
  assert.equal(v.fieldTotal, 3, 'economics holds d, e and f');
  assert.equal(v.fieldSoft, 2, 'd and e are soft; f is Empirical');
});

test('the corpus share counts every entry, ranked or not', () => {
  const [v] = verdicts(LAWS, RANKED, { kindOf });
  assert.equal(v.corpusTotal, 6);
  assert.equal(v.corpusSoft, 4);
});

test('isSoft is the rating test the whole module turns on', () => {
  assert.ok(isSoft({ reliability: 'Contested' }));
  assert.ok(isSoft({ reliability: 'Folk-adage' }));
  assert.ok(isSoft({ reliability: 'Heuristic' }));
  assert.ok(!isSoft({ reliability: 'Empirical' }));
  assert.ok(!isSoft({}));
  assert.ok(!isSoft(null));
});

test('the verdict line is derived from the rating, never written per entry', () => {
  assert.notEqual(verdictLine({ reliability: 'Contested' }), verdictLine({ reliability: 'Heuristic' }));
  assert.equal(verdictLine({ reliability: 'Contested' }), verdictLine({ reliability: 'Contested' }));
  // …and none of them says the idea is false.
  for (const t of ['Contested', 'Heuristic', 'Folk-adage']) {
    assert.doesNotMatch(verdictLine({ reliability: t }), /\b(false|debunked|myth|untrue)\b/i);
  }
});

// ---- the page ----------------------------------------------------------------

const PAGE = () => verdictPage(verdicts(LAWS, RANKED, { kindOf })[0], {
  base: '/', origin: 'https://x.test', categories: { psychology: 'Psychology & the mind' },
});

test('the page carries the three numbers the entry page cannot', () => {
  const h = PAGE();
  assert.match(h, /#1/, 'the print rank is missing');
  assert.match(h, /entries in psychology &amp; the mind rest on something other than measurement/);
  assert.match(h, /of all 6 entries in the index are rated the same way/);
});

test('the page quotes the entry rather than paraphrasing it', () => {
  const h = PAGE();
  assert.match(h, /a stops working somewhere\./);
  assert.match(h, /a is often read as something else\./);
  assert.match(h, /a says a thing\./);
});

test('the page links the sources it says the claim rests on', () => {
  assert.match(PAGE(), /href="https:\/\/example\.test\/a"/);
});

test('the page sends the reader to the full entry rather than duplicating it', () => {
  const h = PAGE();
  assert.match(h, /href="\/laws\/a\/"/);
  // The things that make an entry page an entry page must NOT be sections here.
  // Asserted on headings, not on the document: the "where is the rest of it?"
  // answer names those sections in order to send the reader to them, which is
  // the opposite of duplicating them.
  const headings = [...h.matchAll(/<h2 class="vd-h">([^<]*)</g)].map((m) => m[1]);
  assert.deepEqual(headings, ['Where it runs out', 'What people get wrong about it', 'What the claim rests on']);
});

test('the page never rules the idea true or false', () => {
  const h = PAGE().replace(/<script[\s\S]*?<\/script>/g, '');
  assert.doesNotMatch(h, /\bdebunked\b|\bproven false\b|\bit is a myth\b/i);
});

test('paths are stable', () => {
  assert.equal(verdictPath({ slug: 'the-bystander-effect' }), 'is-it-real/the-bystander-effect/');
});

// ---- the testability filter --------------------------------------------------
//
// This filter exists because of what the built pages looked like, not because of
// anything a test caught. The first version produced "Is Habeas Corpus real?",
// "Is The Social Contract real?" and "Is Virtue Ethics real?" — three category
// errors that make the page look like it does not understand its own subject.

test('a doctrine, a proof or a normative position gets no verdict page', () => {
  const kind = (k) => (l) => l.kind ?? k;
  assert.ok(!isTestable(law('x', 'Contested', 'philosophy'), kind('theory')), 'a philosophical position');
  assert.ok(!isTestable(law('x', 'Contested', 'law'), kind('doctrine')), 'a legal doctrine');
  assert.ok(!isTestable(law('x', 'Contested', 'mathematics'), kind('hypothesis')), 'a mathematical conjecture');
  assert.ok(!isTestable(law('x', 'Contested', 'logic'), kind('fallacy')), 'a fallacy');
});

test('a claim about how the world behaves does get one', () => {
  for (const k of ['effect', 'bias', 'illusion', 'law', 'principle', 'hypothesis', 'theory', 'curve', 'model', 'rule']) {
    assert.ok(isTestable(law('x', 'Contested', 'psychology'), () => k), `${k} should be testable`);
  }
});

test('an entry whose kind cannot be read from its name is left out', () => {
  // A third of the index has no kind word in any of its names. Guessing which
  // of those are testable would be exactly the invention this project refuses.
  assert.ok(!isTestable(law('x', 'Contested', 'psychology'), () => null));
});

test('the filter is applied by verdicts(), not just exposed by it', () => {
  const only = verdicts(LAWS, RANKED, { kindOf: () => 'paradox' });
  assert.deepEqual(only, [], 'no paradox should get a verdict page');
});
