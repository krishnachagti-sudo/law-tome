import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { THEMES, THEME_MIN, score, assign, problems, problemPath } from '../build/problems.mjs';
import { problemPage } from '../src/templates/problems.mjs';

const RAW = JSON.parse(readFileSync('src/data/situations.json', 'utf8'));
const ROWS = Array.isArray(RAW) ? RAW : RAW.situations;

// ---- the themes themselves ---------------------------------------------------

test('theme slugs and titles are unique', () => {
  assert.equal(new Set(THEMES.map((t) => t.slug)).size, THEMES.length);
  assert.equal(new Set(THEMES.map((t) => t.title)).size, THEMES.length);
});

test('every theme has a question a reader might actually have typed', () => {
  for (const t of THEMES) {
    assert.ok(t.question.endsWith('?'), `${t.slug} question is not a question`);
    assert.ok(t.keywords.length >= 8, `${t.slug} has too thin a vocabulary to sort on`);
  }
});

// ---- matching ----------------------------------------------------------------

test('a keyword must start at a word boundary', () => {
  // The bug this exists for: the cue "franklin" contains "rank", which filed the
  // X-ray photograph that settled the structure of DNA under Metrics and targets.
  const theme = { keywords: ['rank'] };
  assert.equal(score({ situation: 'x', cues: ['franklin'] }, theme), 0);
  assert.equal(score({ situation: 'x', cues: ['ranking'] }, theme), 1, 'a stem must still run on at the end');
  assert.equal(score({ situation: 'we rank schools', cues: [] }, theme), 2);
});

test('the sentence outweighs the cues', () => {
  const theme = { keywords: ['deadline'] };
  assert.ok(
    score({ situation: 'the deadline slipped', cues: [] }, theme)
    > score({ situation: 'nothing', cues: ['deadline'] }, theme),
  );
});

test('a situation lands on at most one theme', () => {
  const { assigned, unassigned } = assign(ROWS);
  const placed = [...assigned.values()].reduce((n, l) => n + l.length, 0);
  assert.equal(placed + unassigned.length, ROWS.length, 'every row is placed exactly once');
});

test('a situation matching nothing is left off the theme pages rather than dumped somewhere', () => {
  const { assigned, unassigned } = assign([{ situation: 'zzz qqq', cues: ['zzz'] }]);
  assert.equal(unassigned.length, 1);
  assert.equal([...assigned.values()].reduce((n, l) => n + l.length, 0), 0);
});

test('the real corpus sorts into themes that all clear the floor', () => {
  const byslug = Object.fromEntries(ROWS.map((s) => [s.law, { slug: s.law, name: s.law, category: 'x' }]));
  const { themes, unassigned, covered } = problems(ROWS, byslug);
  assert.ok(themes.length >= 15, `only ${themes.length} themes cleared the floor`);
  for (const t of themes) assert.ok(t.count >= THEME_MIN, `${t.slug} is below the floor`);
  assert.ok(covered > ROWS.length * 0.6, `only ${covered} of ${ROWS.length} situations were placed`);
  // …and the unplaced remainder is real and reported rather than hidden.
  assert.ok(unassigned > 0);
  assert.equal(covered + unassigned, ROWS.length);
});

test('a theme drops rows whose law is not in the corpus', () => {
  const raw = [...Array.from({ length: 20 }, () => ({ situation: 'the deadline slipped again', law: 'gone' }))];
  const { themes } = problems(raw, {});
  assert.deepEqual(themes, [], 'a theme made entirely of dangling slugs must not get a page');
});

// ---- the page ----------------------------------------------------------------

const FIX = () => {
  const rows = Array.from({ length: 12 }, (_, i) => ({
    situation: `The deadline slipped for the ${i}th time`,
    law: `l${i}`,
  }));
  const byslug = Object.fromEntries(rows.map((r, i) => [r.law, {
    slug: r.law, name: `Law ${i}`, statement: `Law ${i} says a thing.`,
    category: i % 2 ? 'physics' : 'economics', reliability: 'Empirical',
  }]));
  return problems(rows, byslug).themes;
};

test('the page states the rule that put these rows on it', () => {
  const [t] = FIX();
  const h = problemPage(t, { base: '/', origin: 'https://x.test', total: 581, siblings: FIX() });
  assert.match(h, /matching each situation's own wording/);
  assert.match(h, /581 situations/);
  // …and does not claim an editor sat down and picked them. Asserted against the
  // page's own answer, not the whole document: the shared nav legitimately
  // describes /collections/ as hand-picked, and a document-wide match would
  // fail on that unrelated and accurate sentence.
  const start = h.indexOf('By matching each situation');
  assert.ok(start > 0, 'the answer is missing entirely');
  const answer = h.slice(start, h.indexOf('stay on', start));
  assert.doesNotMatch(answer, /hand-picked|curated|we selected|we chose/i);
  assert.match(answer, /computed from the text/);
});

test('the page does not claim a name solves the problem', () => {
  const [t] = FIX();
  const h = problemPage(t, { base: '/', origin: '' });
  assert.match(h, /No, and none of these pages claim it does/);
});

test('every row carries its statement in the FAQ data and links to the entry', () => {
  const [t] = FIX();
  const h = problemPage(t, { base: '/', origin: '' });
  for (const r of t.rows) {
    assert.match(h, new RegExp(`href="/laws/${r.law.slug}/"`), `${r.law.slug} lost its link`);
    assert.match(h, new RegExp(`${r.law.name} — ${r.law.statement.replace(/\./g, '\\.')}`));
  }
  assert.match(h, /"@type":"FAQPage"/);
});

test('the page counts the fields its answers came from', () => {
  const [t] = FIX();
  assert.equal(t.fields, 2);
  assert.match(problemPage(t, { base: '/', origin: '' }), /2 different fields/);
});

test('paths are stable and base-relative', () => {
  assert.equal(problemPath({ slug: 'metrics-and-targets' }), 'situations/metrics-and-targets/');
});
