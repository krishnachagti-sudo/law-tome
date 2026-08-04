import { test } from 'node:test';
import assert from 'node:assert/strict';
import { homePage } from '../src/templates/home.mjs';
const laws = [{no:'001', slug:'a', name:'A', statement:'S </script> x', statementAccent:'S', category:'economics', reliability:'Heuristic', related:[]}];
const html = homePage(laws, { publishedCount: 212, base:'/lawtome/' });
test('renders the ACTUAL published count, not a hard-coded 1,400', () => { assert.match(html, /212/); assert.doesNotMatch(html, /1,400/); });
// The hero used to open with "the largest unified, defined & sourced index of
// named laws" — a superlative, qualified into safety. It has been replaced by
// the site's actual finding, which is checkable rather than merely careful. So
// this no longer polices the qualification; it polices the superlative itself,
// which is what the qualification was ever for.
test('makes no unqualified superlative claim', () => {
  assert.doesNotMatch(html, /world'?s largest|the largest index|biggest (index|collection)/i);
});

test('the positioning line leads with the rating, not the size', () => {
  assert.match(html, /<h1 class="lede">[^<]*Everyone quotes these/);
  assert.match(html, /rated all 212 for how much evidence/);
});
test('escapes </script> in inline featured JSON', () => assert.doesNotMatch(html, /S <\/script> x/));
test('embeds featured laws for the rotating hero', () => assert.match(html, /"slug":"a"/));
test('wraps the directory in DefinedTermSet JSON-LD', () => assert.match(html, /"DefinedTermSet"/));

// Credits the creator (Krishna Chagti) and publisher (Conyso) — visibly and in
// structured data.
test('homepage credits the creator and the publisher, on-page and in JSON-LD', () => {
  assert.match(html, /By <a href="https:\/\/conyso\.com\/founder\/"[^>]*>Krishna Chagti<\/a>/);
  assert.match(html, /an initiative by <a href="https:\/\/conyso\.com">Conyso<\/a>/);
  // The creator is ONE entity with a stable id, not a description repeated per
  // page. Three Person nodes with drifting contents read to a crawler as
  // several people who share a name, which is the opposite of what an entity
  // graph is for.
  assert.match(html, /"founder":\{"@type":"Person","@id":"[^"]*#krishna-chagti"/);
  // The title alone, with the employer as a related entity — not a job title
  // that happens to contain a comma and a company name.
  assert.match(html, /"jobTitle":"Founder & CEO"/);
  assert.doesNotMatch(html, /"jobTitle":"Founder & CEO, Conyso"/);
  // The founder relationship, asserted from both ends and agreeing. One side is
  // a claim; both sides pointing at each other is corroboration, and
  // corroboration is the only thing a knowledge graph acts on.
  assert.match(html, /"worksFor":\{"@id":"https:\/\/conyso\.com\/#organization"\}/);
  assert.match(html, /"founderOf":\{"@id":"https:\/\/conyso\.com\/#organization"\}/);
  assert.match(html, /"@id":"https:\/\/conyso\.com\/#organization","name":"Conyso"[^}]*"founder":\{"@id":"[^"]*#krishna-chagti"\}/);
  // Every sameAs is a profile that can be fetched and checked back. ORCID is
  // the one that proves the name refers to one specific human.
  assert.match(html, /"sameAs":\["https:\/\/conyso\.com\/founder\/","https:\/\/www\.linkedin\.com\/in\/krishna-chagti"/);
  assert.match(html, /https:\/\/orcid\.org\/0009-0003-6401-1788/);
});

// The landing grid is a capped, server-rendered SAMPLE (data-limit), never the
// whole corpus dumped as thousands of cards.
test('browse grid is a capped teaser, server-rendered', () => {
  assert.match(html, /id="grid" data-limit="18"/);
  assert.match(html, /class="card"/);               // teaser cards present with JS off
  assert.match(html, /Browse all 212 laws/);        // CTA to the full index
});

// Marketing sections a landing page needs: a differentiator strip, a feature
// showcase, and the anti-fabrication method — all present and linking out.
test('homepage ships the marketing sections', () => {
  assert.match(html, /class="sec home-trust"/);
  assert.match(html, /class="sec home-features"/);
  assert.match(html, /More than a list/);
  assert.match(html, /href="\/lawtome\/situations\/"/);
  assert.match(html, /href="\/lawtome\/reliability\/"/);
  // The anti-fabrication method is NOT restated on the home page — it lives on
  // About (this avoids a third copy of the same "we're rigorous" claim).
  assert.doesNotMatch(html, /Nothing here is invented/);
});

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

// The law of the day moved off /quiz/ and onto the front page. It is
// SERVER-rendered — the point is that it is real content in the HTML, not an
// empty div a crawler sees nothing in — and omitted entirely when the build
// passes no pick, rather than shipping a hollow band.
test('home page renders the law of the day as real markup', () => {
  const h = homePage(laws, {
    publishedCount: 212, base: '/lawtome/',
    lawOfTheDay: { slug: 'a', no: '001', name: 'A', statement: 'S', reliability: 'Heuristic' },
  });
  assert.match(h, /id="lotd"/);
  assert.match(h, /class="lotd-card" href="\/lawtome\/laws\/a\//);
  assert.match(h, /class="lotd-name">A</);
  assert.match(h, /badge b-heu">Heuristic</);
  assert.match(h, /\/lawtome\/quiz\//);
});

test('home page omits the band entirely when there is no pick', () => {
  assert.doesNotMatch(html, /id="lotd"/);
});

test('the law of the day escapes corpus text like every other field', () => {
  const h = homePage(laws, {
    publishedCount: 212, base: '/lawtome/',
    lawOfTheDay: { slug: 'a', no: '001', name: 'A <img onerror=x>', statement: 'S', reliability: 'Heuristic' },
  });
  assert.match(h, /A &lt;img onerror=x&gt;/);
  assert.doesNotMatch(h, /<img onerror=x>/);
});
