import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  replicationFor, replicationLine, contradictsRating, replicationSummary,
} from '../build/replication.mjs';

const DOC = JSON.parse(readFileSync('src/data/replication.json', 'utf8'));

const rep = (o = {}) => ({
  effects: ['X'], studies: 2, results: 2, coded: 0,
  db: 'FReD', cite: 'FReD.', source: 'https://example.test/fred', ...o,
});

test('an unmatched entry gets nothing rather than an empty shell', () => {
  assert.equal(replicationFor({ slug: 'nope' }, DOC), null);
  assert.equal(replicationFor(null, DOC), null);
  assert.equal(replicationFor({ slug: 'x' }, undefined), null);
});

// ---- the counting bug this module exists to avoid ---------------------------

test('studies and results are reported separately, never conflated', () => {
  // The bug: 21 rows for the availability heuristic are a handful of studies
  // reporting one result per site. Counting rows as attempts overstates the
  // scrutiny an effect has had by an order of magnitude.
  const line = replicationLine(rep({ studies: 3, results: 21, coded: 21, signal: 2, noSignal: 19 }));
  assert.match(line, /3 replication studies/);
  assert.match(line, /21 separate results/);
  assert.doesNotMatch(line, /21 replication (studies|attempts)/);
  // …and it explains why the two numbers differ, rather than leaving a reader to
  // assume one of them is a typo.
  assert.match(line, /one study and many results/);
});

test('a single study is not pluralised into several', () => {
  const line = replicationLine(rep({ studies: 1, results: 1, coded: 0 }));
  assert.match(line, /1 replication study of this effect\./);
  assert.doesNotMatch(line, /studies/);
  assert.doesNotMatch(line, /separate results/, 'one result is not worth explaining');
});

test('with no coded outcome the line reports the work and refuses a verdict', () => {
  const line = replicationLine(rep({ studies: 2, results: 2, coded: 0 }));
  assert.match(line, /has not yet computed an outcome/);
  assert.doesNotMatch(line, /found a signal/);
});

test('with coded outcomes the line gives counts, not a conclusion', () => {
  const line = replicationLine(rep({ studies: 62, results: 554, coded: 73, signal: 66, noSignal: 7 }));
  assert.match(line, /66 found a signal and 7 did not/);
  // It must not draw FORRT's conclusion for them.
  assert.doesNotMatch(line, /does not replicate|fails to replicate|is not real/i);
});

// ---- the disagreement rule ---------------------------------------------------

test('flags only the case a reader could fairly call us out on', () => {
  const bad = rep({ coded: 21, signal: 2, noSignal: 19 });
  assert.ok(contradictsRating({ reliability: 'Empirical' }, bad), 'Empirical vs mostly-no-signal');
  // The reverse is us being cautious, which needs no apology.
  assert.ok(!contradictsRating({ reliability: 'Contested' }, rep({ coded: 9, signal: 8, noSignal: 1 })));
  // And an uncoded record can never contradict anything.
  assert.ok(!contradictsRating({ reliability: 'Empirical' }, rep({ coded: 0 })));
});

// ---- the real data -----------------------------------------------------------

test('the harvested file is shaped as the module expects', () => {
  assert.ok(DOC.entries && Object.keys(DOC.entries).length > 0);
  assert.equal(DOC.licence, 'CC BY 4.0', 'a licence incompatible with ours must not be ingested');
  for (const [slug, v] of Object.entries(DOC.entries)) {
    assert.ok(v.studies >= 1, `${slug} has no replication study`);
    assert.ok(v.results >= v.studies, `${slug} reports fewer results than studies`);
    assert.ok(v.source && v.cite, `${slug} is unattributed`);
    if (v.signal !== undefined) assert.equal(v.signal + v.noSignal, v.coded, `${slug} split does not sum`);
  }
});

test('every published line is renderable without throwing or printing undefined', () => {
  for (const [slug, v] of Object.entries(DOC.entries)) {
    const line = replicationLine(v);
    assert.ok(line.length > 40, `${slug} produced a stub`);
    assert.doesNotMatch(line, /undefined|NaN|null/, slug);
  }
});

test('the corpus summary counts what it says it counts', () => {
  const laws = Object.keys(DOC.entries).map((slug) => ({ slug, reliability: 'Contested' }));
  const s = replicationSummary(laws, DOC);
  assert.equal(s.matched, laws.length);
  assert.deepEqual(s.contradictions, [], 'nothing rated Contested can contradict');
});
