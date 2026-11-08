import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wavePage, takeoverInner, takeoverActive, waveCardSvg, waveHeroSvg } from '../src/templates/wave.mjs';
import { lawPage } from '../src/templates/law.mjs';

const wave = JSON.parse(readFileSync(new URL('../src/data/waves/plane-audio-video-location-doppler-effect.json', import.meta.url)));
const law = JSON.parse(readFileSync(new URL('../src/data/laws/the-doppler-effect.json', import.meta.url)));
const html = wavePage(wave, law, { base: '/lawtome/', origin: 'https://conyso.com', count: 1116 });
const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

test('the takeover runs while developing and until its end date, then stops', () => {
  assert.equal(takeoverActive(wave, '2026-11-09'), true);
  assert.equal(takeoverActive(wave, wave.takeoverUntil), true);
  assert.equal(takeoverActive(wave, '2026-11-24'), false);
  assert.equal(takeoverActive({ ...wave, status: 'settled' }, '2026-11-09'), false);
});

test('the answer is the first thing after the headline', () => {
  const h1 = html.indexOf('<h1'), answer = html.indexOf('wave-answer'), story = html.indexOf('w-what');
  assert.ok(h1 > 0 && h1 < answer && answer < story);
});

test('the answer is 40 to 60 words, as snippets and AI answers lift it', () => {
  const n = wave.answer.split(/\s+/).length;
  assert.ok(n >= 40 && n <= 60, `answer is ${n} words`);
});

test('every timeline line points at a real source, and every source says what it supports and when it was checked', () => {
  for (const t of wave.timeline) assert.ok(wave.sources[t.source], `timeline ${t.date} has no source`);
  for (const s of wave.sources) assert.ok(s.url && s.checked && s.supports);
  for (const s of wave.sources) assert.ok(html.includes(s.url));
});

test('structured data: analysis article with a named author and dated with a timezone, breadcrumbs, and the visible FAQ', () => {
  const art = ld.find((b) => b['@type'] === 'AnalysisNewsArticle');
  assert.equal(art.author['@type'], 'Person');
  assert.match(art.datePublished, /T\d\d:\d\d:\d\d[+-]\d\d:\d\d$/);
  assert.ok(art.image[0].endsWith('-16x9.png'), 'schema image is the 16:9 picture without text');
  assert.ok(ld.some((b) => b['@type'] === 'BreadcrumbList'));
  const faq = ld.find((b) => b['@type'] === 'FAQPage');
  for (const q of faq.mainEntity) assert.ok(html.includes(q.name), 'every FAQ in the markup is visible on the page');
});

test('the worked example is labelled as ours and illustrative, and the prediction as our reading', () => {
  assert.match(html, /Our worked example/);
  assert.match(html, /Illustrative numbers, not Colsto/);
  assert.match(html, /Our reading, not a finding/);
});

test('the social card uses the 1200x630 preview size; the hero has no text', () => {
  assert.match(waveCardSvg(wave, law), /width="1200" height="630"/);
  assert.doesNotMatch(waveHeroSvg(), /<text/);
});

test('the law page leads with the takeover only when a wave is passed', () => {
  const ctx = { base: '/lawtome/', origin: 'https://conyso.com', byslug: { [law.slug]: law } };
  const withWave = lawPage(law, { ...ctx, wave });
  const without = lawPage(law, ctx);
  assert.ok(withWave.includes(wave.question));
  assert.ok(withWave.indexOf(wave.question) < withWave.indexOf('In plain English'));
  assert.ok(!without.includes(wave.question));
  assert.ok(takeoverInner(wave, { base: '/lawtome/' }).includes('/lawtome/wild/plane-audio-video-location-doppler-effect/'));
});

test('the page tells the story, never our process: no detector, no internal measurement', () => {
  // A reader shared the page for the event, not for how we spotted it.
  assert.doesNotMatch(html, /wave detector|our detector|Law Tome measurement/i);
});

test('speed comes from the high-to-low ratio, never from the size of the drop', () => {
  // Persona panel 2026-11-09: the drop in Hz depends on the engine's tone, which a recording doesn't give.
  assert.match(html, /ratio of the two, about 1\.42/);
  assert.doesNotMatch(html, /size of the drop gives the speed/);
  assert.equal(((343 + 60) / (343 - 60)).toFixed(2), '1.42');
});

test('the citation names the date once', () => {
  assert.match(html, /Chagti, K\. \(2026, November 9\)\./);
  assert.doesNotMatch(html, /\(2026, 9 Nov 2026\)/);
});

test('who is behind it and what you can do sit above the story', () => {
  const pub = html.indexOf('class="wave-publisher"'), doBox = html.indexOf('class="wave-do"'), video = html.indexOf('class="wave-video"'), story = html.indexOf('id="w-what"');
  assert.ok(pub > 0 && pub < doBox && doBox < video && video < story);
  assert.match(html, /No ads, no tracking/);
});

test('the creator\'s own video is listed as a source', () => {
  assert.ok(wave.sources.some((s) => s.url.includes('UytYrhYLOKI')));
});

test('the takeover link says how it works, not "the maths"', () => {
  assert.match(takeoverInner(wave, { base: '/' }), /how it works/);
  assert.doesNotMatch(takeoverInner(wave, { base: '/' }), /maths/);
});
