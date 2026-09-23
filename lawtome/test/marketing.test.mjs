import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { resolveAudiences } from '../build/audiences.mjs';
import { audiencesIndexPage, audiencePage } from '../src/templates/audiences.mjs';
import { featuresPage } from '../src/templates/features.mjs';
import { manifestoPage } from '../src/templates/manifesto.mjs';
import { coinPage, aboutPage } from '../src/templates/static-pages.mjs';

const BYSLUG = {
  a: { slug: 'a', no: '1', name: 'A Law', statement: 'sa', category: 'software', reliability: 'Heuristic', related: [] },
  b: { slug: 'b', no: '2', name: 'B Law', statement: 'sb', category: 'psychology', reliability: 'Contested', related: [] },
};

test('resolveAudiences drops unknown slugs and skips empty personas', () => {
  const raw = [
    { slug: 'eng', title: 'For engineers', who: 'Engineers', problem: 'P', blurb: 'B', laws: ['a', 'ghost', 'b'] },
    { slug: 'empty', title: 'X', who: 'X', problem: 'P', blurb: 'B', laws: ['nope'] },
  ];
  const { audiences, dropped } = resolveAudiences(raw, BYSLUG);
  assert.equal(audiences.length, 1);
  assert.deepEqual(audiences[0].laws.map((l) => l.slug), ['a', 'b']);
  assert.ok(dropped.includes('eng: ghost'));
});

test('audience hub + page render with persona copy and law cards', () => {
  const { audiences } = resolveAudiences([{ slug: 'eng', title: 'For engineers', who: 'Engineers', problem: 'You meet the same failures.', blurb: 'The laws you learn the hard way.', laws: ['a', 'b'] }], BYSLUG);
  const hub = audiencesIndexPage(audiences, { base: '/lawtome/', origin: 'https://conyso.com', count: 2 });
  assert.match(hub, /<h1>Find your laws<\/h1>/);
  assert.match(hub, /href="\/lawtome\/for\/eng\/"/);
  assert.match(hub, /canonical" href="https:\/\/conyso\.com\/lawtome\/for\/"/);
  const page = audiencePage(audiences[0], { base: '/lawtome/', origin: 'https://conyso.com', count: 2 });
  assert.match(page, /<h1>For engineers<\/h1>/);
  assert.match(page, /You meet the same failures\./);       // problem
  assert.match(page, /href="\/lawtome\/laws\/a\/"/);          // law card
  assert.match(page, /"@type":"ItemList"/);
  assert.match(page, /canonical" href="https:\/\/conyso\.com\/lawtome\/for\/eng\/"/);
});

test('features page tours the capabilities and links each one', () => {
  const h = featuresPage({ base: '/lawtome/', origin: 'https://conyso.com', count: 948 });
  assert.match(h, /What The Law Tome does/);
  for (const href of ['situations/', 'graph/', 'tension/', 'reliability/', 'collections/', 'data/', 'coin/']) {
    assert.match(h, new RegExp(`href="/lawtome/${href.replace('/', '\\/')}"`));
  }
  assert.match(h, /class="on" aria-current="page">Features/); // nav marks Features active
});

test('manifesto argues the case and credits Conyso', () => {
  const h = manifestoPage({ base: '/lawtome/', origin: 'https://conyso.com', count: 948 });
  assert.match(h, /Why name a law\?/);
  assert.match(h, /initiative by <a href="https:\/\/conyso\.com">Conyso<\/a>/);
  assert.match(h, /href="\/lawtome\/coin\/"/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/manifesto\/"/);
});

test('coin page keeps its working form AND gains a pitch', () => {
  const h = coinPage({ base: '/lawtome/', origin: 'https://conyso.com' });
  assert.match(h, /action="https:\/\/github\.com\/[^"]+\/issues\/new"/); // form intact, real target
  assert.match(h, /How it works/);                      // pitch added
  assert.match(h, /What makes a good one/);
  assert.match(h, /with your name/i);
});

test('about credits Krishna Chagti (creator) + Conyso (publisher), factual only', () => {
  const h = aboutPage({ base: '/lawtome/', origin: 'https://conyso.com' });
  assert.match(h, /behind it/);              // "Who's behind it" section
  assert.match(h, /Krishna Chagti/);         // named creator, on-page…
  // …as one identified entity, whose title and employer are separate fields.
  assert.match(h, /"@type":"Person","@id":"https:\/\/conyso\.com\/founder\/#person","name":"Krishna Chagti","jobTitle":"Founder & CEO"/);
  assert.match(h, /"founderOf":\{"@id":"https:\/\/conyso\.com\/#organization"\}/);
  assert.match(h, /https:\/\/orcid\.org\/0009-0003-6401-1788/); // persistent identifier
  assert.match(h, /founder and CEO/);        // visible bio, sourced from his founder page
  assert.match(h, /linkedin\.com\/in\/krishna-chagti/); // real sameAs link
  assert.match(h, /initiative by/i);
  assert.match(h, /href="https:\/\/conyso\.com"/);
  // Conyso is described factually (sourced from conyso.com), not invented.
  assert.match(h, /holding company/);
  assert.match(h, /operating discipline/);
  // No invented "Dr. Firstname Lastname".
  assert.doesNotMatch(h, /Dr\.\s+[A-Z][a-z]+\s+[A-Z][a-z]+/);
});

test('the shipped audiences all resolve against the corpus', () => {
  const dir = 'src/data/laws';
  const byslug = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8'))).map((l) => [l.slug, l]));
  const raw = JSON.parse(readFileSync('src/data/audiences.json', 'utf8'));
  const { audiences, dropped } = resolveAudiences(raw, byslug);
  assert.deepEqual(dropped, [], `unknown audience slugs: ${dropped.join(', ')}`);
  assert.equal(audiences.length, raw.length);
});
