import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listingPage } from '../src/templates/listing.mjs';
const laws = [
  {no:'001', slug:'a', name:'A', statement:'S', category:'economics', reliability:'Heuristic'},
  {no:'002', slug:'b', name:'B', statement:'T', category:'media', reliability:'Empirical'}
];
test('browse lists a card link per law + DefinedTermSet JSON-LD', () => {
  const h = listingPage(laws, { title:'Browse', base:'/lawtome/', kind:'browse' });
  assert.match(h, /href="\/lawtome\/laws\/a\/"/);
  assert.match(h, /href="\/lawtome\/laws\/b\/"/);
  assert.match(h, /"DefinedTermSet"/);
});
test('category page lists only its members + BreadcrumbList', () => {
  const h = listingPage(laws.filter(l=>l.category==='economics'), { title:'Economics', base:'/lawtome/', kind:'category' });
  assert.match(h, /href="\/lawtome\/laws\/a\/"/);
  assert.doesNotMatch(h, /href="\/lawtome\/laws\/b\/"/);
  assert.match(h, /"BreadcrumbList"/);
});

// --- added coverage ---

test('card corpus text is HTML-escaped (name/statement/category/no)', () => {
  const evil = [{
    no: '<x>', slug: 'evil', name: 'A & <b>B</b>', statement: 'x < y & "q"',
    category: 'me&dia', reliability: 'Heuristic',
  }];
  const h = listingPage(evil, { title: 'Browse', base: '/lawtome/', kind: 'browse' });
  // Raw, unescaped markup from corpus text must never appear.
  assert.doesNotMatch(h, /<b>B<\/b>/);
  assert.match(h, /A &amp; &lt;b&gt;B&lt;\/b&gt;/);
  assert.match(h, /x &lt; y &amp; &quot;q&quot;/);
  assert.match(h, /me&amp;dia/);
  assert.match(h, /№ &lt;x&gt;/);
});

test('browse lists all N laws as cards', () => {
  const many = [
    {no:'001', slug:'a', name:'A', statement:'S', category:'economics', reliability:'Heuristic'},
    {no:'002', slug:'b', name:'B', statement:'T', category:'media', reliability:'Empirical'},
    {no:'003', slug:'c', name:'C', statement:'U', category:'media', reliability:'Contested'},
  ];
  const h = listingPage(many, { title:'Browse', base:'/lawtome/', kind:'browse' });
  const cards = h.match(/class="card"/g) || [];
  assert.equal(cards.length, 3);
});

test('reliability maps to the correct badge class', () => {
  const rows = [
    {no:'001', slug:'a', name:'A', statement:'S', category:'x', reliability:'Empirical'},
    {no:'002', slug:'b', name:'B', statement:'T', category:'x', reliability:'Folk-adage'},
    {no:'003', slug:'c', name:'C', statement:'U', category:'x', reliability:'Contested'},
  ];
  const h = listingPage(rows, { title:'Browse', base:'/lawtome/', kind:'browse' });
  assert.match(h, /badge b-emp/);
  assert.match(h, /badge b-folk/);
  assert.match(h, /badge b-con/);
});

test('category BreadcrumbList runs Home > Browse > title', () => {
  const h = listingPage(laws.filter(l=>l.category==='media'), { title:'Media & info', base:'/lawtome/', kind:'category' });
  assert.match(h, /"BreadcrumbList"/);
  assert.match(h, /"Home"/);
  assert.match(h, /"Browse"/);
});

test('works with only {title, base, kind} and renders chips', () => {
  const h = listingPage(laws, { title:'Browse', base:'/lawtome/', kind:'browse' });
  assert.match(h, /class="chips"/);
  assert.match(h, /class="grid"/);
  assert.match(h, /data-c="all"/);
  assert.match(h, /data-c="economics"/);
});

test('empty laws renders the empty state and does not throw', () => {
  const h = listingPage([], { title:'Browse', base:'/lawtome/', kind:'browse' });
  assert.match(h, /class="empty"/);
  assert.doesNotMatch(h, /class="card"/);
});

// A field page was the last page type still built as a crumb, an H1 and a grid,
// so its length was purely a function of how many laws the field happened to
// hold — linguistics, with six, came to 210 words. Everything below is read off
// the members; the point of the tests is that it is DERIVED, never authored.
const field = [
  { no: '001', slug: 'a', name: 'A', statement: 'S', category: 'software', reliability: 'Heuristic',
    coinedYear: 1975, namedAfter: 'Fred Brooks', related: [{ slug: 'b', kind: 'opposed' }, { slug: 'z', kind: 'related' }] },
  { no: '002', slug: 'b', name: 'B', statement: 'T', category: 'software', reliability: 'Empirical',
    coinedYear: 1999, related: [{ slug: 'a', kind: 'opposed' }, { slug: 'z', kind: 'related' }] },
];
const byslug = {
  ...Object.fromEntries(field.map((l) => [l.slug, l])),
  z: { slug: 'z', name: 'Z', category: 'economics' },
};
const fieldHtml = listingPage(field, {
  title: 'Software & systems', base: '/lawtome/', kind: 'category', origin: 'https://conyso.com',
  categoryKey: 'software', categories: { software: 'Software & systems', economics: 'Economics & incentives' },
  byslug, compareSlugs: { 'a|b': 'a-vs-b' },
});

test('a field page states its own scale in one liftable sentence', () => {
  assert.match(fieldHtml, /class="hub-answer"/);
  assert.match(fieldHtml, /lists 2 named laws/);
  assert.match(fieldHtml, /named between 1975 and 1999/);
  assert.match(fieldHtml, /1 rated <a[^>]*>Empirical<\/a>, 1 rated <a[^>]*>Heuristic<\/a>/);
  assert.match(fieldHtml, /class="hub-stats"/);
});

test('a field page names the fields it borders, counted from real relations', () => {
  // Both members point at z (economics) — but that is ONE edge each, and the
  // count must not double just because two laws drew it.
  assert.match(fieldHtml, /Fields it borders/);
  assert.match(fieldHtml, /Economics &amp; incentives<\/a><span>2<\/span>/);
  // Its own field is never listed as a neighbour of itself.
  assert.doesNotMatch(fieldHtml, /Fields it borders[\s\S]{0,400}Software/);
});

test('a field page surfaces its internal tensions and its edge, in field words', () => {
  assert.match(fieldHtml, /Where this field disagrees with itself/);
  assert.match(fieldHtml, /compare\/a-vs-b\//);
  assert.match(fieldHtml, /Just outside this field/);
  assert.match(fieldHtml, /laws\/z\//);
  // "set" is the collection wording; a field page must not borrow it.
  assert.doesNotMatch(fieldHtml, /disagrees with itself[\s\S]{0,200}flaw in the set/);
});

test('a field page declares its members and its questions as structured data', () => {
  assert.match(fieldHtml, /"CollectionPage"/);
  assert.match(fieldHtml, /"numberOfItems":2/);
  assert.match(fieldHtml, /"FAQPage"/);
  assert.match(fieldHtml, /What are the named laws of software &amp; systems\?/);
  assert.match(fieldHtml, /"BreadcrumbList"/);
});

test('a unanimous field says so instead of listing one tier as a split', () => {
  const one = listingPage(
    [{ no: '1', slug: 'x', name: 'X', statement: 'S', category: 'law', reliability: 'Heuristic', coinedYear: 1700 }],
    { title: 'Law & jurisprudence', base: '/', kind: 'category', categoryKey: 'law', categories: { law: 'Law & jurisprudence' } },
  );
  assert.match(one, /every one of them rated <a[^>]*>Heuristic<\/a>/);
});

test('the browse index keeps its own head and gains no field furniture', () => {
  const h = listingPage(laws, { title: 'Browse', base: '/', kind: 'browse' });
  assert.doesNotMatch(h, /The shape of this field/);
  assert.doesNotMatch(h, /Just outside this field/);
});
