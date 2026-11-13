// /also-known-as/ and /quotes/.
//
// Both pages exist to catch a reader who has something other than the headword
// — another name, or a half-remembered line. Neither may say anything the
// corpus does not, and neither may point anywhere but at the entry that owns
// the text. These tests hold both to that, and to the one editorial rule that
// makes the alias index readable: a cross-reference that points at itself is
// not a cross-reference.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { akaPage, quotesPage, quoteFieldPage, quoteFields } from '../src/templates/lookup.mjs';

const CORPUS = readdirSync('src/data/laws').filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join('src/data/laws', f), 'utf8')));

const L = (slug, extra = {}) => ({
  slug, name: slug, no: '001', statement: 'S', category: 'logic', reliability: 'Heuristic', ...extra,
});

test('every alias is a cross-reference to the entry that owns it', () => {
  const html = akaPage([
    L('a', { name: 'Alpha Law', aliases: ['The Beta Rule', 'Gamma'] }),
    L('b', { name: 'Bravo Law', aliases: ['Delta'] }),
  ], { base: '/x/', origin: 'https://e.com' });
  assert.match(html, /The Beta Rule[\s\S]{0,120}href="\/x\/laws\/a\/">Alpha Law/);
  assert.match(html, /Delta[\s\S]{0,120}href="\/x\/laws\/b\/">Bravo Law/);
  assert.equal((html.match(/class="aka-row"/g) || []).length, 3);
});

test('an alias that is only the headword respelled is not a cross-reference', () => {
  // Case, a leading article and punctuation are all things the search already
  // folds away; listing them sends the reader from a name to the same name.
  const html = akaPage([L('a', {
    name: 'The abc Conjecture',
    aliases: ['The abc conjecture', 'abc conjecture', "Oesterlé–Masser conjecture"],
  })], { base: '/', origin: '' });
  assert.equal((html.match(/class="aka-row"/g) || []).length, 1);
  assert.match(html, /Oesterlé–Masser conjecture/);
});

test('the alphabet ignores leading articles and accents', () => {
  const html = akaPage([
    L('a', { name: 'A', aliases: ['The Zebra rule'] }),
    L('b', { name: 'B', aliases: ['Ångström measure'] }),
  ], { base: '/', origin: '' });
  // "The Zebra rule" files under Z, "Ångström measure" under A — so A precedes Z.
  assert.ok(html.indexOf('Ångström measure') < html.indexOf('The Zebra rule'));
  assert.match(html, /id="aka-A"/);
  assert.match(html, /id="aka-Z"/);
});

test('the alias index carries the real corpus and never a dead link', () => {
  const html = akaPage(CORPUS, { base: '/', origin: 'https://e.com' });
  const slugs = new Set(CORPUS.map((l) => l.slug));
  const hrefs = [...html.matchAll(/class="aka-l" href="\/laws\/([^/]+)\//g)].map((m) => m[1]);
  assert.ok(hrefs.length > 1000, `only ${hrefs.length} aliases`);
  for (const s of hrefs) assert.ok(slugs.has(s), `alias points at a missing entry: ${s}`);
});

test("a field's statements page quotes the corpus and attributes every line", () => {
  // /quotes/ is a hub now; the statements live one field to a page (B9).
  const laws = [
    L('a', { name: 'Alpha Law', statement: 'What can go wrong will go wrong.', category: 'logic' }),
    L('c', { name: 'Charlie Law', statement: 'Third thing.', category: 'logic' }),
    L('b', { name: 'Bravo Law', statement: 'Second thing.', category: 'economics' }),
  ];
  const fields = quoteFields(laws, { logic: 'Logic', economics: 'Economics' });
  const html = quoteFieldPage(fields.find((f) => f.key === 'logic'), { base: '/', origin: '', fields });
  assert.match(html, /<blockquote class="qt-q">What can go wrong will go wrong\.<\/blockquote>/);
  // Every quotation is inside a figure whose caption links to its entry.
  assert.equal((html.match(/<figure class="qt"/g) || []).length, 2);
  assert.match(html, /<figcaption class="qt-c"><a href="\/laws\/a\/">Alpha Law<\/a>/);
  assert.match(html, /id="qt-logic"/);
  // The hub links every field's page.
  const hub = quotesPage(laws, { base: '/', origin: '', categories: { logic: 'Logic', economics: 'Economics' } });
  assert.match(hub, /href="\/quotes\/logic\/"/);
  assert.match(hub, /href="\/quotes\/economics\/"/);
});

test('a statement with markup in it is quoted, not executed', () => {
  const html = quotesPage([L('a', { name: 'X', statement: '<script>bad()</script> & "quoted"' })],
    { base: '/', origin: '' });
  assert.doesNotMatch(html, /<script>bad\(\)/);
  assert.match(html, /&lt;script&gt;bad\(\)&lt;\/script&gt; &amp; &quot;quoted&quot;/);
});

test('every statement in the corpus reaches exactly one field page', () => {
  const fields = quoteFields(CORPUS, {});
  const withStatement = CORPUS.filter((l) => l.statement).length;
  let figures = 0;
  const seen = new Set();
  for (const f of fields) {
    const html = quoteFieldPage(f, { base: '/', origin: '', fields });
    figures += (html.match(/<figure class="qt"/g) || []).length;
    for (const l of f.list) { assert.ok(!seen.has(l.slug), `${l.slug} is on two pages`); seen.add(l.slug); }
  }
  assert.equal(figures, withStatement);
  // Fields biggest first, as the hub lists them.
  const sizes = fields.map((f) => f.list.length);
  assert.deepEqual(sizes, [...sizes].sort((a, b) => b - a));
});

test('both pages declare what they are and neither invents a claim', () => {
  const aka = akaPage(CORPUS, { base: '/', origin: 'https://e.com' });
  const qt = quotesPage(CORPUS, { base: '/', origin: 'https://e.com', categories: {} });
  for (const html of [aka, qt]) {
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /application\/ld\+json/);
  }
  // The statements page has to say plainly that a good line is not a true claim.
  assert.match(qt, /CC BY 4\.0/);
  assert.match(qt, /memorable phrasing is evidence about the phrasing/);
  // The alias page has to say the names are attested, not coined here.
  assert.match(aka, /Nothing on this page is a coinage/);
});
