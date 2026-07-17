import { test } from 'node:test';
import assert from 'node:assert/strict';
import { head, header, footer, sprite, jsonLd } from '../src/templates/partials.mjs';
test('head self-hosts css/js/fonts (no third-party CDN) + title + canonical', () => {
  const h = head({ title:'X', base:'/lawtome/', canonical:'https://conyso.com/lawtome/x/' });
  assert.match(h, /assets\/styles\.css/);
  assert.match(h, /assets\/common\.js/);
  assert.doesNotMatch(h, /googleapis|jsdelivr|cdn/i);
  assert.match(h, /<title>X/);
  assert.match(h, /rel="canonical" href="https:\/\/conyso\.com\/lawtome\/x\/"/);
});
test('head embeds any provided JSON-LD blocks', () => {
  assert.match(head({ title:'X', base:'/lawtome/', jsonld:[{'@type':'WebPage'}] }), /"@type":"WebPage"/);
});
test('header marks the active nav item', () => assert.match(header({base:'/lawtome/', active:'browse'}), /class="on"[^>]*>Browse/));
test('sprite defines the seal symbol', () => assert.match(sprite(), /<symbol id="seal"/));
test('footer carries the licence line', () => assert.match(footer(), /CC BY/));
test('jsonLd serialises to a script tag', () => assert.match(jsonLd({'@type':'X'}), /application\/ld\+json/));

// --- additional coverage (not part of the 6-test contract) ---

test('head emits description meta only when provided', () => {
  assert.match(head({ title:'X', base:'/lawtome/', description:'A sourced index.' }), /<meta name="description" content="A sourced index\.">/);
  assert.doesNotMatch(head({ title:'X', base:'/lawtome/' }), /name="description"/);
});

test('head omits canonical when absent', () => {
  assert.doesNotMatch(head({ title:'X', base:'/lawtome/' }), /rel="canonical"/);
});

test('head links the self-hosted tabler icon css and defers common.js', () => {
  const h = head({ title:'X', base:'/lawtome/' });
  assert.match(h, /href="\/lawtome\/assets\/icons\/tabler\.css"/);
  assert.match(h, /<script defer src="\/lawtome\/assets\/common\.js">/);
});

test('head emits Open Graph tags from the og object', () => {
  const h = head({ title:'X', base:'/lawtome/', og:{ title:'OG', description:'D', image:'/lawtome/og/x.png', type:'article' } });
  assert.match(h, /property="og:title" content="OG"/);
  assert.match(h, /property="og:description" content="D"/);
  assert.match(h, /property="og:image" content="\/lawtome\/og\/x\.png"/);
  assert.match(h, /property="og:type" content="article"/);
});

test('head/header/footer/sprite carry no third-party CDN URLs', () => {
  const re = /googleapis|jsdelivr|cdn/i;
  assert.doesNotMatch(head({ title:'X', base:'/lawtome/' }), re);
  assert.doesNotMatch(header({ base:'/lawtome/', active:'browse' }), re);
  assert.doesNotMatch(footer(), re);
  assert.doesNotMatch(sprite(), re);
});

test('header uses the provided count and never hard-codes 1,400', () => {
  assert.match(header({ base:'/lawtome/', active:'browse', count:11 }), /class="count">11 laws/);
  assert.doesNotMatch(header({ base:'/lawtome/' }), /1,400/);
});

test('header links are base-relative', () => {
  const hd = header({ base:'/lawtome/', active:'graph' });
  assert.match(hd, /href="\/lawtome\/graph\/" class="on">The graph/);
  assert.match(hd, /class="brand" href="\/lawtome\/"/);
});

test('sprite also defines the wax and orn symbols', () => {
  const s = sprite();
  assert.match(s, /<symbol id="wax"/);
  assert.match(s, /<symbol id="orn"/);
});

test('head opens the document/body and footer closes them (composable)', () => {
  assert.match(head({ title:'X', base:'/lawtome/' }), /^<!DOCTYPE html>\n<html lang="en" data-theme="light">/);
  assert.match(head({ title:'X', base:'/lawtome/' }), /<body>\s*$/);
  assert.match(footer(), /<\/footer>[\s\S]*<\/body>\s*<\/html>\s*$/);
});

test('footer injects page scripts before </body>', () => {
  const f = footer({ scripts:'<script>1</script>' });
  assert.match(f, /<script>1<\/script>\s*<\/body>/);
});
