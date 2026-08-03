import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sheets, sheetPath, SHEET_SIZE, SHEET_MIN } from '../build/sheets.mjs';
import { sheetPage, sheetsHubPage } from '../src/templates/sheets.mjs';

const law = (slug, category, extra = {}) => ({
  slug, category, name: slug.replace(/-/g, ' '), no: '1',
  statement: `${slug} says a thing.`, reliability: 'Empirical', ...extra,
});

const CATS = { physics: 'Physics & the physical world', tiny: 'A tiny field' };

// Ten physics entries, three of which are measured and should lead.
const LAWS = [
  ...Array.from({ length: 10 }, (_, i) => law(`p${i}`, 'physics', { no: String(i + 1) })),
  ...Array.from({ length: 3 }, (_, i) => law(`t${i}`, 'tiny')),
];
const RANKED = [{ law: LAWS[7] }, { law: LAWS[3] }, { law: LAWS[9] }];

test('a field below the floor gets no sheet', () => {
  const all = sheets(LAWS, RANKED, CATS);
  assert.deepEqual(all.map((s) => s.slug), ['physics']);
  assert.ok(SHEET_MIN > 3, 'the fixture depends on the floor being above three');
});

test('measured entries lead, in fame order, then the rest in corpus order', () => {
  const [s] = sheets(LAWS, RANKED, CATS);
  assert.deepEqual(s.laws.slice(0, 3).map((l) => l.slug), ['p7', 'p3', 'p9']);
  // The unmeasured tail keeps corpus order and does not lose anybody.
  const rest = s.laws.slice(3).map((l) => l.slug);
  assert.deepEqual(rest, ['p0', 'p1', 'p2', 'p4', 'p5', 'p6', 'p8']);
  assert.equal(s.measured, 3);
});

test('a sheet is capped and reports the size of the field it came from', () => {
  const many = Array.from({ length: 60 }, (_, i) => law(`m${i}`, 'physics', { no: String(i + 1) }));
  const [s] = sheets(many, [], CATS);
  assert.equal(s.laws.length, SHEET_SIZE);
  assert.equal(s.count, SHEET_SIZE);
  assert.equal(s.total, 60, 'the sheet must not pretend the field is 24 entries long');
});

test('a field smaller than a sheet reports its real size, not the cap', () => {
  const [s] = sheets(LAWS, RANKED, CATS);
  assert.equal(s.count, 10);
  assert.equal(s.total, 10);
});

test('sheets come out in display-name order and know their paths', () => {
  const big = [
    ...Array.from({ length: 9 }, (_, i) => law(`z${i}`, 'zed')),
    ...Array.from({ length: 9 }, (_, i) => law(`a${i}`, 'alpha')),
  ];
  const all = sheets(big, [], { zed: 'Zed things', alpha: 'Alpha things' });
  assert.deepEqual(all.map((s) => s.title), ['Alpha things', 'Zed things']);
  assert.equal(sheetPath(all[0]), 'sheets/alpha/');
});

// ---- the page ---------------------------------------------------------------

const PAGE = () => {
  const all = sheets(LAWS, RANKED, CATS);
  return sheetPage(all[0], { base: '/lawtome/', origin: 'https://conyso.com', count: 13, siblings: all });
};

test('the sheet names its selection rule rather than claiming importance', () => {
  const h = PAGE();
  assert.match(h, /best-known/);
  assert.doesNotMatch(h, /most important|the essential|must-know/i);
  assert.match(h, /how often the name appears in printed books/);
});

test('every entry on the sheet carries its statement and its rating', () => {
  const h = PAGE();
  for (const l of sheets(LAWS, RANKED, CATS)[0].laws) {
    assert.match(h, new RegExp(l.statement.replace(/\./g, '\\.')), `${l.slug} lost its statement`);
  }
  assert.equal((h.match(/class="badge b-emp sk-badge"/g) || []).length, 10);
});

test('the print stylesheet hides the chrome and shows the provenance line', () => {
  const h = PAGE();
  assert.match(h, /@media print/);
  // The chrome is bare elements, not classed wrappers — this is the bug the
  // first version shipped, so it is asserted by selector.
  assert.match(h, /header, footer,[^}]*display: none/);
  assert.match(h, /\.sk-others[^}]*display: none/);
  assert.match(h, /\.sk-foot \{ display: block/);
  // …and suppresses the site-wide print credit, which would otherwise print a
  // second, less useful attribution directly under this one.
  assert.match(h, /main::after \{ content: none/);
  // …and the line it reveals says where the paper came from.
  assert.match(h, /conyso\.com\/lawtome\/sheets\/physics · Physics &amp; the physical world · The Law Tome · CC BY 4\.0/);
});

test('the sheet states the licence it can be reused under', () => {
  const h = PAGE();
  assert.match(h, /CC BY 4\.0/);
  assert.match(h, /creativecommons\.org\/licenses\/by\/4\.0\//);
});

test('the sheet links back to the whole field it was cut from', () => {
  assert.match(PAGE(), /href="\/lawtome\/category\/physics\/"/);
});

test('the hub lists every sheet with what is on it', () => {
  const all = sheets(LAWS, RANKED, CATS);
  const h = sheetsHubPage(all, { base: '/', origin: 'https://x.test', count: 13 });
  assert.match(h, /<h1>Cheat sheets<\/h1>/);
  assert.match(h, /href="\/sheets\/physics\/"/);
  assert.match(h, /"@type":"CollectionPage"/);
  assert.match(h, /"@type":"FAQPage"/);
});

test('an empty corpus produces a hub and no sheets rather than throwing', () => {
  assert.deepEqual(sheets([], [], {}), []);
  const h = sheetsHubPage([], { base: '/', origin: '' });
  assert.match(h, /<h1>Cheat sheets<\/h1>/);
  assert.doesNotMatch(h, /NaN/);
});

test('the hub takes the corpus size from the build, not from a typed number', () => {
  const all = sheets(LAWS, RANKED, CATS);
  assert.match(sheetsHubPage(all, { base: '/', origin: '', count: 4321 }), /4,321 entries deep/);
  // …and says something sane when the build hands it nothing.
  assert.doesNotMatch(sheetsHubPage(all, { base: '/', origin: '' }), /undefined|NaN/);
});
