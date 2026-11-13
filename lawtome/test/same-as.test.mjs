// sameAs may hold one URL or several (backlog D6); every reader goes through
// build/same-as.mjs so no reader handles one shape and misses the other.
import test from 'node:test';
import assert from 'node:assert/strict';
import { sameAsList, sameAsLd } from '../build/same-as.mjs';
import { validateCorpus } from '../build/validate.mjs';
import { lawRecord } from '../build/dataset.mjs';
import { lawPage } from '../src/templates/law.mjs';

test('one URL stays one, several stay several, blanks and repeats go', () => {
  assert.deepEqual(sameAsList('https://a'), ['https://a']);
  assert.deepEqual(sameAsList([' https://a ', 'https://b', 'https://a', '']), ['https://a', 'https://b']);
  assert.deepEqual(sameAsList(null), []);
  assert.equal(sameAsLd('https://a'), 'https://a', 'a single URL is emitted exactly as before');
  assert.deepEqual(sameAsLd(['https://a', 'https://b']), ['https://a', 'https://b']);
  assert.equal(sameAsLd([]), null);
});

test('the validator checks every URL in a list', () => {
  const law = (sameAs) => ({ no: '1', slug: 'x', name: 'X', category: 'economics', reliability: 'Heuristic',
    statement: 's', meaning: 'm', sources: [{ text: 't', url: 'https://s' }], sameAs });
  const errs = (sa) => validateCorpus([law(sa)], { economics: 'Economics' }).filter((e) => /sameAs/.test(e));
  assert.equal(errs(['https://a', 'https://b']).length, 0);
  assert.ok(errs(['https://a', 'javascript:alert(1)']).length, 'a bad URL inside a list is caught');
  assert.ok(errs({ url: 'https://a' }).length, 'an object is not a sameAs');
});

test('the dataset always publishes a list, and the page emits both URLs', () => {
  const law = { no: '1', slug: 'x', name: 'X Law', category: 'economics', reliability: 'Heuristic', statement: 'S.', meaning: 'M.',
    sources: [{ text: 't', url: 'https://s', type: 'primary' }], sameAs: ['https://en.wikipedia.org/wiki/X', 'https://www.wikidata.org/wiki/Q1'] };
  assert.deepEqual(lawRecord({ ...law, sameAs: 'https://en.wikipedia.org/wiki/X' }, { baseUrl: '/' }).sameAs, ['https://en.wikipedia.org/wiki/X']);
  const html = lawPage(law, { byslug: { x: law }, categories: { economics: 'Economics' }, base: '/', origin: 'https://e' });
  assert.match(html, /"sameAs":\["https:\/\/en\.wikipedia\.org\/wiki\/X","https:\/\/www\.wikidata\.org\/wiki\/Q1"\]/);
});
