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
