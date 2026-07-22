import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildDataset, datasetCsv } from '../build/dataset.mjs';
import { dataPage } from '../src/templates/data.mjs';

const LAW = {
  no: '014', slug: 'goodharts-law', name: "Goodhart's Law", aliases: ['Goodhart–Strathern'],
  category: 'economics', reliability: 'Heuristic', statement: 'When a measure becomes a target, it ceases to be a good measure.',
  coinedYear: 1975, namedAfter: 'Charles Goodhart', sameAs: 'https://en.wikipedia.org/wiki/Goodhart%27s_law',
  sources: [{ text: 'Goodhart (1975).', url: 'https://doi.org/x', type: 'primary' }],
  related: [{ slug: 'campbells-law', kind: 'kindred' }],
  // The long-form prose that MUST NOT appear in the dataset:
  meaning: 'SECRET_MEANING', mechanism: 'SECRET_MECHANISM', whyItMatters: 'SECRET_WHY',
  examples: [{ tag: 'x', text: 'SECRET_EXAMPLE' }], working: [{ lead: 'a', text: 'SECRET_WORKING' }],
  limits: 'SECRET_LIMITS', misreadings: 'SECRET_MIS', origin: 'SECRET_ORIGIN', variants: [{ name: 'v', text: 'SECRET_VARIANT' }],
};

test('dataset carries the metadata fields', () => {
  const d = buildDataset([LAW], { baseUrl: 'https://conyso.com/lawtome/', generated: '2026-07-22' });
  const r = d.laws[0];
  assert.equal(r.name, "Goodhart's Law");
  assert.equal(r.statement, LAW.statement);
  assert.equal(r.category, 'economics');
  assert.equal(r.reliability, 'Heuristic');
  assert.equal(r.coinedYear, 1975);
  assert.equal(r.namedAfter, 'Charles Goodhart');
  assert.deepEqual(r.aliases, ['Goodhart–Strathern']);
  assert.deepEqual(r.related, [{ slug: 'campbells-law', kind: 'kindred' }]);
  assert.equal(r.sources[0].url, 'https://doi.org/x');
  assert.equal(r.url, 'https://conyso.com/lawtome/laws/goodharts-law/');
  // Licence header, machine-readable.
  assert.equal(d.meta.license, 'CC BY 4.0');
  assert.match(d.meta.licenseUrl, /creativecommons\.org/);
  assert.equal(d.meta.count, 1);
});

test('MOAT GUARANTEE: no long-form prose leaks into the dataset', () => {
  const d = buildDataset([LAW], { baseUrl: 'https://conyso.com/lawtome/' });
  const r = d.laws[0];
  // The prose fields must be entirely absent from the record.
  for (const k of ['meaning', 'mechanism', 'whyItMatters', 'examples', 'working', 'limits', 'misreadings', 'origin', 'variants']) {
    assert.ok(!(k in r), `dataset record must not contain the prose field "${k}"`);
  }
  // And no SECRET_ marker can appear anywhere in the serialised JSON.
  assert.doesNotMatch(JSON.stringify(d), /SECRET_/);
});

test('CSV is a flat scalar view with a header and RFC-4180 quoting', () => {
  const csv = datasetCsv([LAW, { no: '1', slug: 's', name: 'Has, comma', category: 'x', reliability: 'Contested', coinedYear: 2000, namedAfter: null }], { baseUrl: 'https://conyso.com/lawtome/' });
  const lines = csv.trimEnd().split('\r\n');
  assert.equal(lines[0], 'no,slug,name,category,reliability,coinedYear,namedAfter,url');
  assert.match(lines[1], /goodharts-law/);
  assert.match(csv, /"Has, comma"/); // comma-bearing field is quoted
  assert.doesNotMatch(csv, /SECRET_/);
});

test('data page links both downloads, states the licence, and types a Dataset', () => {
  const h = dataPage({ base: '/lawtome/', origin: 'https://conyso.com', count: 948, generated: '2026-07-22' });
  assert.match(h, /href="\/lawtome\/data\/lawtome\.json"/);
  assert.match(h, /href="\/lawtome\/data\/lawtome\.csv"/);
  assert.match(h, /metadata only/i);
  assert.match(h, /Creative Commons Attribution 4\.0/);
  assert.match(h, /"@type":"Dataset"/);
  assert.match(h, /"@type":"DataDownload"/);
});

test('the shipped corpus produces a prose-free dataset', () => {
  const dir = 'src/data/laws';
  const laws = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const json = JSON.stringify(buildDataset(laws, { baseUrl: 'https://conyso.com/lawtome/' }));
  const r0 = buildDataset(laws, { baseUrl: 'https://conyso.com/lawtome/' }).laws[0];
  for (const k of ['meaning', 'mechanism', 'whyItMatters', 'working', 'limits', 'misreadings', 'origin']) {
    assert.ok(!(k in r0), `prose field ${k} leaked`);
  }
  // Every record carries a canonical URL back to its page.
  assert.match(json, /"url":"https:\/\/conyso\.com\/lawtome\/laws\//);
});
