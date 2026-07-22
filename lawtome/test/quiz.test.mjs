import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayIndex } from '../build/quiz.mjs';
import { quizPage } from '../src/templates/quiz.mjs';

test('dayIndex is deterministic and in range', () => {
  assert.equal(dayIndex('2026-07-22', 948), dayIndex('2026-07-22', 948)); // stable
  for (const d of ['2026-01-01', '2026-07-22', '2030-12-31']) {
    const i = dayIndex(d, 948);
    assert.ok(Number.isInteger(i) && i >= 0 && i < 948, `${d} -> ${i} out of range`);
  }
});

test('dayIndex varies across days (not a constant)', () => {
  const seen = new Set(['2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05'].map((d) => dayIndex(d, 948)));
  assert.ok(seen.size > 1, 'consecutive days should not all map to the same law');
});

test('dayIndex tolerates degenerate counts', () => {
  assert.equal(dayIndex('2026-07-22', 0), 0);
  assert.equal(dayIndex('2026-07-22', -3), 0);
  assert.equal(dayIndex('', 5) >= 0 && dayIndex('', 5) < 5, true);
});

test('quiz page ships the shell, the client script, and a JS-off fallback', () => {
  const h = quizPage({ base: '/lawtome/', origin: 'https://conyso.com', count: 948 });
  assert.match(h, /<h1>Law of the day &amp; the quiz<\/h1>/);
  assert.match(h, /id="lotd"/);
  assert.match(h, /id="quiz"/);
  assert.match(h, /id="quiz-options"/);
  assert.match(h, /<noscript>/);
  assert.match(h, /assets\/quiz\.js/);
  assert.match(h, /canonical" href="https:\/\/conyso\.com\/lawtome\/quiz\/"/);
});
