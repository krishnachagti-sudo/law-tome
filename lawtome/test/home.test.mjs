import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homePage } from '../src/templates/home.mjs';
const laws = [{no:'001', slug:'a', name:'A', statement:'S </script> x', statementAccent:'S', category:'economics', reliability:'Heuristic', related:[]}];
const html = homePage(laws, { publishedCount: 212, base:'/lawtome/' });
test('renders the ACTUAL published count, not a hard-coded 1,400', () => { assert.match(html, /212/); assert.doesNotMatch(html, /1,400/); });
test('uses the qualified superlative claim', () => assert.match(html, /unified,\s*(defined|sourced)/i));
test('escapes </script> in inline featured JSON', () => assert.doesNotMatch(html, /S <\/script> x/));
test('embeds featured laws for the rotating hero', () => assert.match(html, /"slug":"a"/));
test('wraps the directory in DefinedTermSet JSON-LD', () => assert.match(html, /"DefinedTermSet"/));

// ---- added coverage (Task 5/6 lessons) ---------------------------------
test('formats the published count with thousands separators', () => {
  const h = homePage(laws, { publishedCount: 1200, base: '/lawtome/' });
  assert.match(h, /1,200/);
});
test('escapes a featured law name containing < and & in visible markup', () => {
  const evil = [{ no: '002', slug: 'b', name: 'B <x> & Co', statement: 'plain', statementAccent: '', category: 'x', reliability: 'Heuristic', related: [] }];
  const h = homePage(evil, { publishedCount: 5, base: '/lawtome/' });
  assert.doesNotMatch(h, /B <x> & Co/);
});
test('emits no CDN / third-party asset links', () => {
  assert.doesNotMatch(html, /googleapis|gstatic|jsdelivr|cdn\./);
});
test('browse chips and links point at the base-relative browse path', () => {
  assert.match(html, /\/lawtome\/browse\//);
});
test('links the graph and coin bands to base-relative paths', () => {
  assert.match(html, /\/lawtome\/graph\//);
  assert.match(html, /\/lawtome\/coin\//);
});
test('renders the browse-teaser containers Task 10 will wire', () => {
  assert.match(html, /id="chips"/);
  assert.match(html, /id="grid"/);
  assert.match(html, /id="q"/);
  assert.match(html, /id="rand"/);
});
// Task 7 code-quality gate: the client rotation must write a PRE-escaped name via
// innerHTML. A static source check can't see the runtime bug (the <-escape hides
// raw '<' from source; JSON.parse restores it at runtime), so pin the blob field
// + assert the raw name is never concatenated into markup.
test('hero rotation writes a pre-escaped name (no runtime innerHTML injection)', () => {
  const evil = [{ no:'002', slug:'b', name:'B <img onerror=x> & Co', statement:'S', statementAccent:'S', category:'economics', reliability:'Heuristic', related:[] }];
  const h = homePage(evil, { publishedCount: 5, base:'/lawtome/' });
  assert.match(h, /"nameHtml":"B &lt;img onerror=x&gt; &amp; Co"/); // escaped name carried in the blob
  assert.doesNotMatch(h, /\+l\.name\+/);                            // raw name never concatenated into markup
});
