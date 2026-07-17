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
test('emits the JSON-LD stack: DefinedTerm + Article + BreadcrumbList + FAQPage', () => {
  for (const t of ['"DefinedTerm"','"Article"','"BreadcrumbList"','"FAQPage"']) assert.match(html, new RegExp(t));
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
