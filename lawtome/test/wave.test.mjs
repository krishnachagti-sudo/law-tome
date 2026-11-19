import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wavePage, takeoverInner, takeoverActive, waveCardSvg, waveHeroSvg, wildHubPage, wildFeed, waveMarkdown, wildLlms, wildStrip, lawWildInner } from '../src/templates/wave.mjs';
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
  const h1 = html.indexOf('<h1'), answer = html.indexOf('class="wave-answer"'), story = html.indexOf('id="w-what"');
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
  assert.ok(art.image.some((u) => u.endsWith('-16x9.png')), 'schema image includes the 16:9 picture without text');
  if (wave.image) assert.ok(art.image[0].endsWith(`wild-${wave.slug}-hero.jpg`), 'the engraving leads the schema images when there is one');
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
  assert.match(html, /No ads, no account/);
});

test('the creator\'s own video is listed as a source', () => {
  assert.ok(wave.sources.some((s) => s.url.includes('UytYrhYLOKI')));
});

test('the takeover link says how it works, not "the maths"', () => {
  assert.match(takeoverInner(wave, { base: '/' }), /how it works/);
  assert.doesNotMatch(takeoverInner(wave, { base: '/' }), /maths/);
});

// ---- search, answer-engine and AI-citation basics every wave page must have ----

test('section headings are questions, which answer engines and People Also Ask pick up', () => {
  const h2 = [...html.matchAll(/<h2 class="block-h"[^>]*>(.*?)<\/h2>/g)].map((m) => m[1]);
  assert.ok(h2.filter((h) => h.trim().endsWith('?')).length >= 4, h2.join(' | '));
});

test('the title fits a result slot and says what people search for', () => {
  const t = html.match(/<title>(.*?)<\/title>/)[1];
  assert.ok(t.length <= 60, t);
  assert.match(t, /plane sounds?/i);
});

test('the article is speakable and links its Markdown twin and the wave feed', () => {
  const art = ld.find((b) => b['@type'] === 'AnalysisNewsArticle');
  assert.deepEqual(art.speakable.cssSelector, ['.wave-h1', '.wave-answer']);
  assert.match(html, /rel="alternate" type="text\/markdown"[^>]*href="\/lawtome\/wild\/plane-audio-video-location-doppler-effect\/index\.md"/);
  assert.match(html, /application\/atom\+xml[^>]*wild\/feed\.xml/);
});

test('a wave page is never an orphan: hub, feed, home strip, llms and the law page all point at it', () => {
  const byslug = { [law.slug]: law };
  const url = 'wild/plane-audio-video-location-doppler-effect/';
  assert.ok(wildHubPage([wave], byslug, { base: '/lawtome/' }).includes(url));
  assert.ok(wildFeed([wave], byslug, { base: '/lawtome/', origin: 'https://conyso.com' }).includes(`https://conyso.com/lawtome/${url}`));
  assert.ok(wildStrip([wave], byslug, { base: '/lawtome/' }).includes(url));
  assert.ok(wildLlms([wave], byslug, { base: '/lawtome/', origin: 'https://conyso.com' }).includes(`${url}index.md`));
  // After the takeover ends, the law page keeps a permanent link.
  const ctx = { base: '/lawtome/', origin: 'https://conyso.com', byslug };
  const after = lawPage(law, { ...ctx, lawWaves: [wave] });
  assert.ok(after.includes(`/lawtome/${url}`));
  assert.ok(lawWildInner([wave], { base: '/lawtome/' }).includes(url));
});

test('the Markdown twin carries the answer, the sources and the labelled worked example', () => {
  const md = waveMarkdown(wave, law, { base: '/lawtome/', origin: 'https://conyso.com' });
  assert.ok(md.startsWith(`# ${wave.h1}`));
  for (const s of wave.sources) assert.ok(md.includes(s.url));
  assert.match(md, /Worked example \(ours, illustrative\)/);
});

test('a wave that is not the Doppler one gets no Doppler diagrams, plot or curves', () => {
  const goodhart = JSON.parse(readFileSync(new URL('../src/data/laws/goodharts-law.json', import.meta.url)));
  const { visuals, lawStep, calc, media, predict, ...rest } = wave;
  const other = { ...rest, slug: 'test-other-wave', law: 'goodharts-law', media: [], artefact: { text: 'A report.', url: 'https://example.com/r' } };
  const page = wavePage(other, goodhart, { base: '/lawtome/', origin: 'https://conyso.com', count: 1116 });
  assert.doesNotMatch(page, /<canvas|class="wave-fig"|Read Gizmodo|id="w-calc"|The name for step/);
  assert.match(page, /The name for this is <a href="\/lawtome\/laws\/goodharts-law\/">/);
  assert.match(page, /Read the original report/);
  for (const svg of [waveCardSvg(other, goodhart), waveHeroSvg(other)]) assert.doesNotMatch(svg, /<path d="M/);
});

test('a dated law-page example newer than the last wave heads the home strip, by law name, and is on the hub', () => {
  const other = { slug: 'cascading-failure', name: 'Cascading Failure', examples: [
    { kind: 'documented', tag: 'In the wild · Nov 2026', date: '2099-01-02', text: 'One router failed and the network went down. More detail follows.', source: { text: 'Example News, 2 Jan 2099', url: 'https://example.com', checked: '2099-01-02' } },
    { text: 'An older plain example.' },
  ] };
  const byslug = { [law.slug]: law, [other.slug]: other };
  const strip = wildStrip([wave], byslug, { base: '/lawtome/' });
  assert.match(strip, /<span class="wave-strip-h">Cascading Failure<\/span>/);
  assert.ok(strip.includes('/lawtome/laws/cascading-failure/#sec-where-you-ll-see-it'));
  assert.ok(strip.includes('One router failed and the network went down.'));
  assert.ok(strip.includes('wild/plane-audio-video-location-doppler-effect/'), 'the wave page stays one click away');
  const hub = wildHubPage([wave], byslug, { base: '/lawtome/' });
  assert.ok(hub.includes('On the law pages') && hub.includes('<strong>Cascading Failure</strong>'));
});

test('an example that is the same story as a wave page is not listed twice', () => {
  const sameStory = { ...law, examples: [{ tag: 'In the wild · Nov 2026', date: wave.publishedAt.slice(0, 10), text: 'Same story.' }] };
  const hub = wildHubPage([wave], { [law.slug]: sameStory }, { base: '/lawtome/' });
  assert.ok(!hub.includes('On the law pages'));
});

test('the feed and llms.txt carry law-page examples too', () => {
  const other = { slug: 'cascading-failure', name: 'Cascading Failure', examples: [{ tag: 'In the wild · Nov 2026', date: '2099-01-02', text: 'One router failed.', source: { text: 'Example News', url: 'https://example.com/a', checked: '2099-01-02' } }] };
  const byslug = { [law.slug]: law, [other.slug]: other };
  const feed = wildFeed([wave], byslug, { base: '/lawtome/', origin: 'https://conyso.com' });
  assert.ok(feed.includes('<title>Cascading Failure: in the wild</title>'));
  assert.ok(feed.includes('<updated>2099-01-02T00:00:00Z</updated>'));
  const llms = wildLlms([wave], byslug, { base: '/lawtome/', origin: 'https://conyso.com' });
  assert.ok(llms.includes('### On the law pages') && llms.includes('[Cascading Failure](https://conyso.com/lawtome/laws/cascading-failure/)'));
});

// Every catch gets a case page since 17 Nov 2026, so the substance bar in
// waves/JUDGE.md is enforced here for every file in src/data/waves/: a run
// cannot push a page that only restates the law.
import { readdirSync } from 'node:fs';
const waveDir = new URL('../src/data/waves/', import.meta.url);
const allWaves = readdirSync(waveDir).filter((f) => f.endsWith('.json')).map((f) => ({ f, w: JSON.parse(readFileSync(new URL(f, waveDir))) }));

test('every case page meets the substance bar', () => {
  for (const { f, w } of allWaves) {
    const words = (s) => String(s || '').split(/\s+/).filter(Boolean).length;
    assert.ok(w.law && existsLaw(w.law), `${f}: law ${w.law} not in the Tome`);
    assert.ok(words(w.answer) >= 40 && words(w.answer) <= 60, `${f}: answer is ${words(w.answer)} words, needs 40-60`);
    assert.ok(Array.isArray(w.timeline) && w.timeline.length >= 2, `${f}: needs a timeline of 2+ dated steps`);
    for (const t of w.timeline) assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(t.date) && w.sources[t.source], `${f}: timeline step without a date or source`);
    assert.ok(Array.isArray(w.mechanism) && w.mechanism.length >= 3, `${f}: mechanism needs 3+ steps`);
    assert.ok(Array.isArray(w.limits) && w.limits.length >= 2, `${f}: needs 2+ limits`);
    assert.ok(Array.isArray(w.faqs) && w.faqs.length >= 2, `${f}: needs 2+ FAQs`);
    assert.ok(Array.isArray(w.predictions) && w.predictions.length >= 1 && w.predictions.every((p) => /^\d{4}-\d{2}-\d{2}$/.test(p.checkBy || '')), `${f}: needs a prediction with a checkBy date`);
    assert.ok(Array.isArray(w.sources) && w.sources.length >= 1 && w.sources.every((s) => s.url && s.checked && s.supports), `${f}: every source needs url, checked and supports`);
    if (w.status === 'developing') assert.ok(w.takeoverUntil, `${f}: a developing page needs takeoverUntil`);
    assert.ok(['developing', 'settled'].includes(w.status), `${f}: status must be developing or settled`);
  }
});

test('a settled case page renders without a takeover or the Doppler visuals', () => {
  const { visuals, lawStep, takeoverUntil, ...rest } = wave;
  const settled = { ...rest, slug: 'a-settled-case', status: 'settled', media: [] };
  const out = wavePage(settled, law, { base: '/lawtome/', origin: 'https://conyso.com', count: 1116 });
  assert.ok(out.includes(settled.h1));
  assert.ok(!out.includes('· developing'));
  assert.equal(takeoverActive(settled, '2026-11-10'), false);
});

function existsLaw(slug) {
  try { readFileSync(new URL(`../src/data/laws/${slug}.json`, import.meta.url)); return true; } catch { return false; }
}

test('every case page renders as HTML and Markdown, with or without optional parts', () => {
  for (const { f, w } of allWaves) {
    const l = JSON.parse(readFileSync(new URL(`../src/data/laws/${w.law}.json`, import.meta.url)));
    assert.ok(wavePage(w, l, { base: '/lawtome/', origin: 'https://conyso.com', count: 1116 }).includes(w.h1), f);
    assert.ok(waveMarkdown(w, l, { base: '/lawtome/', origin: 'https://conyso.com' }).includes(w.h1), f);
  }
  const { calc, artefact, actions, ...bare } = wave;
  assert.ok(waveMarkdown(bare, law, { base: '/lawtome/' }).includes(bare.h1));
});

test('a case page with an engraving shows it after the answer and offers it as the schema image', async () => {
  const { casePlate } = await import('../src/templates/wave.mjs');
  const w = { ...wave, slug: 'x-case', image: { alt: 'Engraving of a signal box', caption: 'One relay, every line', width: 1400, height: 788 } };
  const out = wavePage(w, law, { base: '/lawtome/', origin: 'https://conyso.com', count: 1116 });
  assert.ok(out.indexOf('wild-x-case-hero.webp') > out.indexOf('class="wave-answer"'));
  assert.ok(out.includes('alt="Engraving of a signal box"'));
  assert.ok(out.includes('https://conyso.com/lawtome/assets/img/plates/wild-x-case-hero.jpg'));
  assert.equal(casePlate({ ...wave, image: undefined }), '');
});
