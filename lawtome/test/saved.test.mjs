import { test } from 'node:test';
import assert from 'node:assert/strict';
import { savedPage } from '../src/templates/saved.mjs';
import { lawPage } from '../src/templates/law.mjs';

test('saved page is noindex, ships the grid shell, script, and JS-off fallback', () => {
  const h = savedPage({ base: '/lawtome/', origin: 'https://conyso.com', count: 948 });
  assert.match(h, /<meta name="robots" content="noindex, follow">/);
  assert.match(h, /<h1>Saved laws<\/h1>/);
  assert.match(h, /id="saved-grid"/);
  assert.match(h, /id="saved-empty"/);
  assert.match(h, /<noscript>/);
  assert.match(h, /assets\/saved\.js/);
});

test('every law page carries a Save button with its card fields as data-*', () => {
  const law = {
    no: '014', slug: 'goodharts-law', name: "Goodhart's Law", statement: 'A measure that becomes a target stops being good.',
    category: 'economics', reliability: 'Heuristic', meaning: 'm', related: [],
    sources: [{ text: 'x', url: 'https://ok.example', type: 'primary' }],
  };
  const h = lawPage(law, { base: '/lawtome/', origin: 'https://conyso.com', categories: { economics: 'Economics' } });
  assert.match(h, /id="save"/);
  assert.match(h, /data-slug="goodharts-law"/);
  assert.match(h, /data-rel="Heuristic"/);
  assert.match(h, /data-no="014"/);
  assert.match(h, /assets\/saved\.js/);
  assert.match(h, /href="\/lawtome\/saved\/"/); // "View saved" link
});

test('a coined law saves with a blank reliability (no badge)', () => {
  const law = {
    no: '900', slug: 'my-law', name: 'My Law', statement: 'S.', category: 'management',
    provenance: 'coined', submittedBy: 'A. Person', meaning: 'm', related: [],
  };
  const h = lawPage(law, { base: '/lawtome/', origin: 'https://conyso.com', categories: {} });
  assert.match(h, /id="save"[^>]*data-rel=""/);
});
