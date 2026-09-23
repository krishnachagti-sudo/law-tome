/* The quiz's server-rendered round.
 *
 * The page used to be a sentence apologising for needing JavaScript, to readers
 * and crawlers alike, and its Quiz markup carried an empty hasPart. It now
 * serves ten real questions built by the same four rules the live quiz uses.
 *
 * The round must be DETERMINISTIC and must be genuinely present, because the
 * markup describes it: a practice-problem result points a reader at a question,
 * and it has to be one they find when they arrive.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, 'dist/quiz/index.html'), 'utf8');
const quiz = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map((m) => JSON.parse(m[1])).flat().find((x) => x['@type'] === 'Quiz');

test('ten real questions are in the HTML', () => {
  assert.equal((html.match(/class="qs-q"/g) || []).length, 10);
  assert.equal((html.match(/class="qs-ask"/g) || []).length, 10);
  // Four options each, so it is a multiple choice rather than a prompt.
  assert.ok((html.match(/<li>/g) || []).length >= 40);
});

test('the markup describes the round that is actually on the page', () => {
  assert.ok(quiz, 'no Quiz markup');
  assert.equal(quiz.hasPart.length, 10, 'hasPart does not match the rendered round');
  for (const q of quiz.hasPart) {
    assert.equal(q.learningResourceType, 'Practice problem');
    assert.ok(q.acceptedAnswer.text, 'a question has no accepted answer');
    assert.ok(q.suggestedAnswer.length >= 2, 'a question offers no alternatives');
    // The accepted answer must not also appear among the wrong ones.
    assert.ok(!q.suggestedAnswer.some((a) => a.text === q.acceptedAnswer.text),
      `the right answer is also listed as a distractor: ${q.acceptedAnswer.text}`);
    // And the question has to be findable in the page a reader lands on.
    const esc = q.acceptedAnswer.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/'/g, '&#39;').replace(/&(?!#39;)/g, '&amp;');
    assert.ok(html.includes(q.acceptedAnswer.text) || new RegExp(esc).test(html),
      `answer not present on the page: ${q.acceptedAnswer.text.slice(0, 40)}`);
  }
});

test('answers are one click away rather than on show', () => {
  // Visible answers beside a live quiz would spoil it; hiding them with script
  // would hide them from Google too. A disclosure satisfies both.
  assert.equal((html.match(/<details class="qs-ans">/g) || []).length, 10);
  assert.ok(!/<details class="qs-ans" open/.test(html), 'answers start open');
});

test('the round is deterministic across rebuilds', async () => {
  const { quizPage } = await import('../src/templates/quiz.mjs');
  const laws = fs.readdirSync(path.join(root, 'src/data/laws'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(root, 'src/data/laws', f), 'utf8')));
  const cats = JSON.parse(fs.readFileSync(path.join(root, 'src/data/categories.json'), 'utf8'));
  const a = quizPage({ base: '/', origin: 'https://x', count: laws.length, categories: cats, laws });
  const b = quizPage({ base: '/', origin: 'https://x', count: laws.length, categories: cats, laws });
  const asks = (s) => (s.match(/class="qs-ask">([^<]*)</g) || []);
  assert.deepEqual(asks(a), asks(b), 'two renders produced different rounds');
  assert.equal(asks(a).length, 10);
});

test('the page still works with an empty corpus', () => {
  // The generator returns [] rather than a half-built round, and the page then
  // renders the noscript notice it always had.
  return import('../src/templates/quiz.mjs').then(({ quizPage }) => {
    const out = quizPage({ base: '/', origin: 'https://x', count: 0, categories: {}, laws: [] });
    assert.ok(!out.includes('class="qs-q"'), 'built a round from nothing');
    assert.ok(out.includes('<noscript>'), 'lost the fallback notice');
  });
});
