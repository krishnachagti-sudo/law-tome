import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lawPage } from '../src/templates/law.mjs';
const law = { no:'014', slug:'goodharts-law', name:"Goodhart's Law", aliases:['Goodhart–Strathern'],
  statement:'When a measure becomes a target, it ceases to be a good measure.', statementAccent:'measure becomes a target',
  meaning:'M', example:'E', origin:'O', whyItMatters:'W', category:'economics', reliability:'Heuristic', provenance:'canon',
  coinedYear:1975, namedAfter:'Charles Goodhart', sameAs:'https://en.wikipedia.org/wiki/Goodhart%27s_law',
  sources:[{text:'Goodhart (1975)', url:'https://x', type:'primary'}], related:[{slug:'campbells-law', kind:'near-twin'}], confusedWith:['campbells-law'] };
const byslug = { 'campbells-law': { no:'015', slug:'campbells-law', name:"Campbell's Law", statement:'S', reliability:'Heuristic' } };
const ctx = { byslug, categories:{economics:'Economics'}, base:'/lawtome/', origin:'https://conyso.com',
  prev:{slug:'greshams-law', name:"Gresham's Law", no:'013'}, next:{slug:'galls-law', name:"Gall's Law", no:'015'} };
const html = lawPage(law, ctx);
test('statement renders with the accent span', () => assert.match(html, /<span class="accent">measure becomes a target<\/span>/));
test('every source renders with its visible link', () => { assert.match(html, /Goodhart \(1975\)/); assert.match(html, /href="https:\/\/x"/); });
test('cite-this-entry block carries the immutable canonical URL', () => assert.match(html, /conyso\.com\/lawtome\/laws\/goodharts-law\//));
test('emits the JSON-LD stack: DefinedTerm + Article + BreadcrumbList (no FAQPage)', () => {
  for (const t of ['"DefinedTerm"','"Article"','"BreadcrumbList"']) assert.match(html, new RegExp(t));
  // FAQPage was dropped: its answers duplicated the article sections verbatim,
  // and FAQ rich results no longer apply to a site like this.
  assert.doesNotMatch(html, /"FAQPage"/);
  assert.match(html, /Goodhart%27s_law/); // sameAs
});
test('links related laws by resolved name + permalink', () => { assert.match(html, /Campbell's Law/); assert.match(html, /href="\/lawtome\/laws\/campbells-law\/"/); });
test('prev/next render from ctx', () => { assert.match(html, /Gresham's Law/); assert.match(html, /Gall's Law/); });
test('coined entry shows the Coined badge + provenance marking, no citation gate', () => {
  const c = lawPage({...law, provenance:'coined', namedAfter:undefined, sources:[]}, ctx);
  assert.match(c, /Coined/);
  assert.match(c, /"additionalType"|coined/i);
});

// --- Added by implementer ---
test('all corpus strings are HTML-escaped (no raw special chars from injection)', () => {
  const nasty = lawPage({ ...law, name: 'A & B <script> "q"', statement: 'x & y < z "quote"', statementAccent: undefined,
    sources:[{ text: 'Src & <b>', url: 'https://x?a=1&b=2', type:'primary' }] }, ctx);
  assert.doesNotMatch(nasty, /<script> "q"/);
  assert.match(nasty, /A &amp; B &lt;script&gt; &quot;q&quot;/);
  assert.match(nasty, /Src &amp; &lt;b&gt;/);
  assert.match(nasty, /href="https:\/\/x\?a=1&amp;b=2"/);
});
test('optional blocks are omitted when their fields are absent', () => {
  const min = lawPage({ no:'020', slug:'s', name:'N', statement:'St', statementAccent:undefined,
    meaning:'M', example:'Ex', origin:'Or', category:'economics', reliability:'Heuristic', provenance:'canon',
    sources:[{text:'T', url:'https://u', type:'primary'}] }, { ...ctx, prev:undefined, next:undefined });
  assert.doesNotMatch(min, /Why it matters/);
  assert.doesNotMatch(min, /Commonly confused with/);
  assert.doesNotMatch(min, /Related laws/);
  assert.doesNotMatch(min, /class="aka"/);
  assert.doesNotMatch(min, /class="prevnext"/);
});
test('coined variant renders submitter credit and no Sources block', () => {
  const c = lawPage({ ...law, provenance:'coined', namedAfter:undefined, sources:[], submittedBy:'Ada' }, ctx);
  assert.doesNotMatch(c, /<div class="lbl">Sources<\/div>/);
  assert.match(c, /Ada/);
  assert.doesNotMatch(c, /class="badge b-heu"/);
});

// --- Regression guards from the Task 6 code-quality gate ---

test('resolved related/confusedWith/prev/next names are escaped (not raw)', () => {
  const nasty = lawPage(law, {
    ...ctx,
    byslug: { 'campbells-law': { no:'015', slug:'campbells-law', name:'A & B <x> "q"', statement:'T & <u>', reliability:'Heuristic' } },
    prev: { slug:'p-law', name:'P & <Q>', no:'001' }, next: undefined,
  });
  assert.doesNotMatch(nasty, /A & B <x>/);                 // resolved name must not be raw
  assert.match(nasty, /A &amp; B &lt;x&gt; &quot;q&quot;/);
  assert.match(nasty, /T &amp; &lt;u&gt;/);                 // resolved statement escaped
  assert.match(nasty, /P &amp; &lt;Q&gt;/);                 // prev name escaped
});

test('reliability badge class matches the vocabulary (Folk-adage -> b-folk, not b-heu)', () => {
  const h = lawPage({ ...law, reliability:'Folk-adage' }, ctx);
  assert.match(h, /class="badge b-folk">Folk-adage/);
  assert.doesNotMatch(h, /class="badge b-heu"/);
});

test('accent containing a $ replacement pattern is not mangled', () => {
  const h = lawPage({ ...law, statement:'x $& y', statementAccent:'$& y' }, ctx);
  assert.match(h, /<span class="accent">\$&amp; y<\/span>/);
});
test('accent that collides with an escaped entity does not corrupt it', () => {
  // "R&D amp" escapes to "R&amp;D amp"; a naive replace of the accent "amp"
  // would match inside "&amp;" and split the entity. Split-on-raw wraps the real one.
  const h = lawPage({ ...law, statement:'R&D amp', statementAccent:'amp' }, ctx);
  assert.match(h, /R&amp;D <span class="accent">amp<\/span>/);
  assert.doesNotMatch(h, /&<span class="accent">amp<\/span>;/);
});
