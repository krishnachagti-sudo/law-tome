import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLlmsIndex, buildLlmsFull } from '../build/llms.mjs';

const CATS = { management: 'Management', science: 'Science' };
const LAWS = [
  { slug: 'parkinsons-law', name: "Parkinson's Law", statement: 'Work expands to fill the time available.', category: 'management', reliability: 'Heuristic', aliases: ['Parkinson'], meaning: 'A long meaning.', sources: [{ url: 'https://example.com/p' }] },
  { slug: 'zebra-law', name: 'Zebra Law', statement: 'Stripes matter.', category: 'management', reliability: 'Folk-adage', sources: [] },
  { slug: 'newtons-law', name: "Newton's Law", statement: 'Force equals mass times acceleration.', category: 'science', reliability: 'Empirical', sources: [{ url: 'https://example.com/n' }] },
];
const BASE = 'https://conyso.com/lawtome/';

const idx = buildLlmsIndex(LAWS, CATS, { baseUrl: BASE });

test('llms.txt starts with an H1 title and blockquote summary', () => {
  assert.match(idx, /^# The Law Tome\n/);
  assert.match(idx, /\n> The largest unified, defined, and sourced directory/);
});

test('llms.txt reports the entry count', () => {
  assert.match(idx, /3 entries\./);
});

test('llms.txt groups by category in vocabulary order (Management before Science)', () => {
  assert.ok(idx.indexOf('## Management') < idx.indexOf('## Science'), 'category order wrong');
});

test('llms.txt sorts entries by name within a category', () => {
  assert.ok(idx.indexOf('Parkinson') < idx.indexOf('Zebra Law'), 'not name-sorted');
});

test('llms.txt bullets are absolute-URL markdown links with the statement', () => {
  assert.match(idx, /- \[Parkinson's Law\]\(https:\/\/conyso\.com\/lawtome\/laws\/parkinsons-law\/\): Work expands to fill the time available\./);
});

test('llms.txt links the full corpus and key site pages', () => {
  assert.match(idx, /\(https:\/\/conyso\.com\/lawtome\/llms-full\.txt\)/);
  assert.match(idx, /\(https:\/\/conyso\.com\/lawtome\/browse\/\)/);
  assert.match(idx, /\(https:\/\/conyso\.com\/lawtome\/graph\/\)/);
});

const full = buildLlmsFull(LAWS, CATS, { baseUrl: BASE });

test('llms-full.txt inlines each entry with URL, category, reliability, statement, meaning, sources', () => {
  assert.match(full, /## Newton's Law/);
  assert.match(full, /URL: https:\/\/conyso\.com\/lawtome\/laws\/newtons-law\//);
  assert.match(full, /Category: Science · Reliability: Empirical/);
  assert.match(full, /Statement: Force equals mass times acceleration\./);
  assert.match(full, /Sources: https:\/\/example\.com\/n/);
});

test('llms-full.txt separates entries with a horizontal rule and lists aliases', () => {
  assert.match(full, /\n---\n/);
  assert.match(full, /Also known as: Parkinson/);
});

test('llms-full.txt omits an empty Sources line when a law has none', () => {
  // Zebra Law has sources:[] — its block must not carry a "Sources:" label.
  const block = full.slice(full.indexOf('## Zebra Law'), full.indexOf('## Zebra Law') + 200);
  assert.doesNotMatch(block, /Sources:/);
});

// --- build integration: llms.txt / llms-full.txt written to the output dir ---
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../build/build.mjs';

const LAW_FILES = readdirSync('src/data/laws').filter(f => f.endsWith('.json'));

test('build emits llms.txt and llms-full.txt with every law linked', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-llms-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  const index = await readFile(join(out, 'llms.txt'), 'utf8');
  const fullTxt = await readFile(join(out, 'llms-full.txt'), 'utf8');
  assert.match(index, /^# The Law Tome/);
  // One bullet link per law in the compact index.
  const bullets = (index.match(/^- \[.+\]\(https:\/\/conyso\.com\/lawtome\/laws\//gm) || []).length;
  assert.equal(bullets, LAW_FILES.length, 'llms.txt should link every law');
  // The full dump carries a section header per law.
  const sections = (fullTxt.match(/^URL: https:\/\/conyso\.com\/lawtome\/laws\//gm) || []).length;
  assert.equal(sections, LAW_FILES.length, 'llms-full.txt should include every law');
  // A known entry appears with an absolute URL.
  assert.match(index, /https:\/\/conyso\.com\/lawtome\/laws\/goodharts-law\//);
  await rm(out, { recursive: true, force: true });
});

test('robots.txt advertises llms.txt', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-llms-rb-'));
  await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  const robots = await readFile(join(out, 'robots.txt'), 'utf8');
  assert.match(robots, /# llms\.txt: https:\/\/conyso\.com\/lawtome\/llms\.txt/);
  await rm(out, { recursive: true, force: true });
});

test('site files do not inflate the build return counts (llms files excluded)', async () => {
  const out = await mkdtemp(join(tmpdir(), 'lt-llms-cnt-'));
  const r = await buildSite({ dataDir: 'src/data/laws', catFile: 'src/data/categories.json', assetsDir: 'src/assets', out, base: '/lawtome/', origin: 'https://conyso.com' });
  assert.equal(r.pages, LAW_FILES.length + 1); // home + one page per law; llms files are not pages
  await rm(out, { recursive: true, force: true });
});
