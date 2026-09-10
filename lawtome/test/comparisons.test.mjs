/* The authored comparisons.
 *
 * These pages sit at a median position of 8.8 and take nine clicks from 3,179
 * addressable impressions, because the first thing a reader met was boilerplate
 * ending "yours to judge" and the page then declined to answer the question in
 * its own H1.
 *
 * The line this file has to hold: naming what two entries disagree ABOUT is a
 * fact about the entries; saying which one the reader should use is not. The
 * first is now authored. The second must never be, and most of these tests are
 * about keeping that boundary where it is.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { comparisonSlugs, comparisonFor } from '../src/templates/comparisons.mjs';
import { DESC_MAX } from '../src/templates/partials.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist/compare');
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const page = (slug) => {
  const f = path.join(dist, slug, 'index.html');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};

test('every authored comparison names a real compare page', () => {
  for (const slug of comparisonSlugs()) {
    assert.ok(page(slug), `${slug}: no such comparison page`);
  }
});

test('each carries a difference and well-formed questions', () => {
  for (const slug of comparisonSlugs()) {
    const c = comparisonFor(slug);
    assert.ok(c.difference && c.difference.length > 80, `${slug}: difference too thin`);
    assert.ok(c.prompt, `${slug}: no prompt`);
    assert.ok(c.questions.length >= 2, `${slug}: needs at least two questions`);
    for (const q of c.questions) {
      assert.ok(q.text && q.text.length > 20, `${slug}: question has no real text`);
      assert.equal(q.options.length, 2, `${slug}: each question offers exactly two readings`);
      for (const o of q.options) {
        assert.ok(o.label && o.why && o.why.length > 30, `${slug}: option is not explained`);
        assert.ok(['a', 'b', 'both', 'neither'].includes(o.matches),
          `${slug}: "${o.matches}" is not a valid match`);
      }
      // A question where both readings point the same way separates nothing.
      const m = q.options.map((o) => o.matches);
      assert.notEqual(m[0], m[1], `${slug}: both answers to "${q.text.slice(0, 40)}…" match the same entry`);
    }
    // Across the whole set, each entry must be reachable, or the matcher is rigged.
    const all = c.questions.flatMap((q) => q.options.map((o) => o.matches));
    assert.ok(all.includes('a') && all.includes('b'), `${slug}: one entry is unreachable`);
  }
});

/* The boundary. A page may say what the two disagree about; it may not tell the
 * reader which to use, because that needs facts about their case. */
const PRESCRIBES = /\byou should\b|\bwe recommend\b|\bthe better (choice|option)\b|\bis the right (one|choice)\b|\bpick \w+ (if|when)\b|\buse \w+ instead\b/i;

test('no authored text tells the reader which one to use', () => {
  for (const slug of comparisonSlugs()) {
    const c = comparisonFor(slug);
    const prose = [c.difference, c.prompt, ...c.questions.flatMap((q) => [q.text, ...q.options.map((o) => o.why)])];
    for (const t of prose) {
      assert.ok(!PRESCRIBES.test(t), `${slug}: prescribes a choice — "${t.slice(0, 90)}"`);
    }
  }
});

test('the page still refuses the verdict in its own words', () => {
  for (const slug of comparisonSlugs()) {
    const h = page(slug);
    assert.match(h, /is still yours to decide|yours to judge/,
      `${slug}: lost the disclaimer that the choice remains the reader's`);
  }
});

test('the difference and the matcher are rendered, and served without JavaScript', () => {
  for (const slug of comparisonSlugs()) {
    const h = page(slug);
    const c = comparisonFor(slug);
    assert.ok(h.includes('cmp-difference'), `${slug}: difference block missing`);
    assert.ok(h.includes(`data-interactive="${slug}"`), `${slug}: matcher missing`);
    assert.equal((h.match(/ix-case-text/g) || []).length, c.questions.length);
    // Both readings for every question are in the served HTML.
    assert.equal((h.match(/data-ix-why/g) || []).length, c.questions.length * 2);
    assert.ok(!/data-ix-why hidden/.test(h), `${slug}: readings hidden server-side`);
  }
});

test('the description leads with the difference, and survives the clamp', () => {
  for (const slug of comparisonSlugs()) {
    const h = page(slug);
    const d = unesc(h.match(/<meta name="description" content="(.*?)"/)[1]);
    assert.ok(d.length <= DESC_MAX, `${slug}: description is ${d.length}`);
    assert.ok(!/how the two compare/.test(d), `${slug}: still using the generic description`);
    // The clamp cuts at a sentence end, so the first sentence has to stand alone.
    const first = comparisonFor(slug).difference.split('. ')[0];
    assert.ok(first.length >= 60,
      `${slug}: opening sentence is only ${first.length} chars, too thin to survive as a snippet`);
  }
});

test('pages without an authored comparison are untouched', () => {
  const authored = new Set(comparisonSlugs());
  const all = fs.readdirSync(dist).filter((d) => fs.existsSync(path.join(dist, d, 'index.html')));
  let plain = 0;
  for (const slug of all) {
    if (authored.has(slug)) continue;
    const h = page(slug);
    assert.ok(!h.includes('cmp-difference'), `${slug}: difference block on an unauthored pair`);
    assert.ok(!h.includes('assets/interactive.js'), `${slug}: loading a script it does not use`);
    plain++;
  }
  assert.ok(plain > 200, `only ${plain} plain compare pages, expected most of them`);
});
