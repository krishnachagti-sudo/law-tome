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
  for (const t of ['"DefinedTerm"','"Article"','"BreadcrumbList"']) assert.match(html, new RegExp(t));
  // FAQPage was dropped once, on the grounds that its answers duplicated the
  // article sections and FAQ rich results had been withdrawn for sites like
  // this. It came back for the other reason it exists: answer engines read it,
  // and every question here is a heading a reader can also see. Each answer is
  // lifted from that section's own prose, so the two cannot drift.
  assert.match(html, /"FAQPage"/);
  // This fixture's prose is one letter per field, and an answer under 40
  // characters is not published as one — so the question that survives is the
  // verdict, which is assembled from the tier rather than from the entry's text.
  assert.match(html, /"@type":"Question","name":"Is Goodhart's Law real\?"/);
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
  // the badge is a link into that tier's index, so assert the class AND the target
  assert.match(h, /class="badge b-folk" href="[^"]*reliability\/folk-adage\/">Folk-adage/);
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

// Every question-headed section on a law page also becomes one Q&A in the page's
// FAQPage. The rule that matters is that the answer is the section's OWN content
// — visible page and structured data cannot drift, because there is only one
// source. (This earns no Google rich result: FAQ rich results were restricted to
// government and health sites in 2023. It is emitted for consistency with every
// other page type and as a faithful machine-readable index of the article.)
function faqOf(html) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const d = JSON.parse(m[1]);
    for (const node of (Array.isArray(d) ? d : [d])) {
      if (node && node['@type'] === 'FAQPage') out.push(...node.mainEntity);
    }
  }
  return out;
}

test('a law page declares one Q&A per question-headed section', () => {
  const l = {
    no: '001', slug: 'q', name: 'Q Law', statement: 'S', category: 'economics', reliability: 'Heuristic',
    meaning: 'It means the thing it means, at enough length to clear the minimum.',
    mechanism: 'It works by the mechanism described here, at enough length to clear the minimum.',
    origin: 'It came from somewhere documented, at enough length to clear the minimum.',
    sources: [{ title: 'T', url: 'https://example.org/' }],
  };
  const qs = faqOf(lawPage(l, { base: '/', origin: 'https://conyso.com' }));
  const names = qs.map((q) => q.name);
  assert.ok(names.includes('What does Q Law mean?'), names.join(' | '));
  assert.ok(names.includes('How does Q Law work?'));
  assert.ok(names.includes('Where did Q Law come from?'));
  // Every question is a question; nothing statement-headed leaks in.
  for (const n of names) assert.match(n, /\?$/);
  // Every answer is the section's own prose.
  assert.equal(qs.find((q) => q.name === 'What does Q Law mean?').acceptedAnswer.text, l.meaning);
});

test('structured answers are readable text, not stripped markup', () => {
  const l = {
    no: '002', slug: 'r', name: 'R Law', statement: 'S', category: 'economics', reliability: 'Heuristic',
    meaning: 'A meaning long enough to be carried into the structured data as an answer.',
    // A card whose label and body are adjacent elements: stripping the tags used
    // to fuse them into "RegressionalThe proxy correlates…".
    variants: [{ name: 'Regressional', text: 'The proxy correlates with the goal but is not identical to it.' }],
    working: [{ lead: 'Track the three components', text: 'reason about the problem in terms of the parts.' }],
    examples: [{ tag: 'Education', text: 'Rank schools on test scores and teachers teach to the test.' }],
    sources: [{ title: 'T', url: 'https://example.org/' }],
  };
  const html = lawPage(l, { base: '/', origin: 'https://conyso.com' });
  const by = Object.fromEntries(faqOf(html).map((q) => [q.name, q.acceptedAnswer.text]));
  assert.match(by['What are the types of R Law?'], /Regressional — The proxy/);
  assert.match(by['How do you apply R Law?'], /Track the three components — reason about/);
  assert.match(by['What are examples of R Law?'], /Education: Rank schools/);
  // …and the visible playbook uses the same separator, because a full stop before
  // a lowercase clause was wrong on the page too.
  assert.match(html, /<b>Track the three components<\/b> — reason about/);
  assert.doesNotMatch(html, /<b>Track the three components\.<\/b>/);
});

test('a section with no prose to give contributes no Q&A', () => {
  const l = {
    no: '003', slug: 's', name: 'S Law', statement: 'S', category: 'economics', reliability: 'Heuristic',
    meaning: 'Long enough to be a real answer in the structured data for this entry.',
    sources: [{ title: 'T', url: 'https://example.org/' }],
  };
  const qs = faqOf(lawPage(l, { base: '/', origin: 'https://conyso.com' }));
  // No examples, variants or working were supplied, so none of their questions
  // may appear — an empty answer must drop the entry, never ship a hollow one.
  const names = qs.map((q) => q.name);
  assert.ok(!names.some((n) => /examples|types of|apply/.test(n)), names.join(' | '));
  for (const q of qs) assert.ok(q.acceptedAnswer.text.length >= 40);
});

test('structured answers carry decoded text, not HTML entities', () => {
  const l = {
    no: '004', slug: 't', name: 'T Law', statement: 'S', category: 'economics', reliability: 'Heuristic',
    meaning: 'Risk & reward move together, and "a target" is never quite the goal itself.',
    sources: [{ title: 'T', url: 'https://example.org/' }],
  };
  const a = faqOf(lawPage(l, { base: '/', origin: 'https://conyso.com' }))
    .find((q) => q.name === 'What does T Law mean?').acceptedAnswer.text;
  assert.match(a, /Risk & reward/);
  assert.match(a, /"a target"/);
  assert.doesNotMatch(a, /&amp;|&quot;|&#39;/);
});

// Each named variant is a thing people search for and link to — "mutational
// meltdown", "regressional Goodhart" — and none of the 1,877 of them was
// addressable. Ids must be stable and unique per page; a couple of laws name two
// variants the same, and two elements sharing an id would make one unreachable.
test('every named variant is individually addressable', () => {
  const l = {
    no: '005', slug: 'u', name: 'U Law', statement: 'S', category: 'economics', reliability: 'Heuristic',
    meaning: 'A meaning long enough to carry into the structured data as an answer.',
    variants: [
      { name: 'Regressional', text: 'One.' },
      { name: 'Extremal', text: 'Two.' },
      { name: 'Regressional', text: 'A second card an editor named the same thing.' },
    ],
    sources: [{ title: 'T', url: 'https://example.org/' }],
  };
  const h = lawPage(l, { base: '/', origin: 'https://conyso.com' });
  const ids = [...h.matchAll(/class="variant" id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['v-regressional', 'v-extremal', 'v-regressional-2']);
  assert.equal(new Set(ids).size, ids.length, 'variant ids must be unique on the page');
  // Each carries a permalink pointing at its own id.
  for (const id of ids) assert.match(h, new RegExp(`class="vlink" href="#${id}"`));
});
