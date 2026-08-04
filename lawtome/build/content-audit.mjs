// Content defects the test suite cannot see.
//
// The build validates structure — every entry has the required fields, every
// URL is http(s), no relation dangles. It cannot tell whether a field is any
// GOOD. An `origin` reading "Lars Vegard, Norwegian physicist, 1921." satisfies
// every rule and is still a stub where the entry beside it carries a paragraph.
//
// This looks for the things a reader would notice and a validator would not. It
// is deliberately noisy about some categories and precise about others, and it
// prints why each check exists, because a checker whose findings nobody trusts
// gets ignored — which is worse than not having it.
//
//   node build/content-audit.mjs           # summary + the worst of each kind
//   node build/content-audit.mjs --kind stub-origin --all
//
// Exits non-zero only for defects that are unambiguous, so it can gate a build
// later without crying wolf over judgement calls.

import { loadCorpus } from './corpus.mjs';

/**
 * An origin shorter than this is a name-and-date fragment rather than an
 * account of where an idea came from.
 *
 * Ninety, not the hundred and thirty I first tried. At 130 the check flagged
 * perfectly good concise origins — "Predicted by Stephen Hawking in 1974,
 * building on Jacob Bekenstein's 1972 work relating black hole area to entropy"
 * is a complete answer in 115 characters. Below ninety they stop being sentences
 * and become index cards: "Lars Vegard, Norwegian physicist, 1921."
 *
 * I also tried detecting a finite verb instead of counting characters, and it
 * was worse — it flagged 231 entries because "Established by", "Proved by" and
 * "Identified by" open a valid sentence that a naive verb list misses. Length is
 * a cruder signal and a more honest one.
 */
export const ORIGIN_MIN = 90;

/**
 * Every check, with the reason it exists. `hard` means a definite defect;
 * everything else is a prompt for a human to look.
 */
export function audit(laws = []) {
  const out = [];
  const push = (kind, law, detail, hard = false) => out.push({ kind, slug: law.slug, detail, hard });
  const seenStatement = new Map();

  for (const l of laws) {
    // A stub origin. The single most visible content gap: the entry page has a
    // "Where did it come from?" section, and a name-and-year fragment answers it
    // the way an index card answers an essay question.
    const origin = String(l.origin || '').trim();
    if (origin && origin.length < ORIGIN_MIN) {
      push('stub-origin', l, `${origin.length} chars: ${origin}`);
    }

    // Two entries claiming the same statement means a duplicate or a copy-paste.
    const s = (l.statement || '').trim().toLowerCase();
    if (s) {
      if (seenStatement.has(s)) push('duplicate-statement', l, `same as ${seenStatement.get(s)}`, true);
      else seenStatement.set(s, l.slug);
    }

    // Editorial leftovers. Never acceptable.
    for (const [f, v] of Object.entries(l)) {
      if (typeof v === 'string' && /\b(TODO|TKTK|FIXME|lorem ipsum|\[citation needed\]|XXX)\b/i.test(v)) {
        push('placeholder', l, f, true);
      }
    }

    // Unbalanced brackets read as truncation even when the prose is complete.
    for (const f of ['statement', 'meaning', 'limits', 'origin', 'misreadings']) {
      const v = l[f];
      if (typeof v !== 'string') continue;
      if ((v.match(/\(/g) || []).length !== (v.match(/\)/g) || []).length) {
        push('unbalanced-parens', l, `${f}: ${v.slice(0, 60)}`, true);
      }
    }

    // An example that only restates the statement teaches nothing.
    for (const e of l.examples || []) {
      if (e && e.text && s && e.text.trim().toLowerCase() === s) push('example-restates-statement', l, '', true);
    }

    // Sources that are all Wikipedia. Not a defect in an entry about an internet
    // meme; a problem in one about a physical law. Flagged, never failed.
    const src = Array.isArray(l.sources) ? l.sources : [];
    if (src.length && src.every((x) => /wikipedia\.org/i.test(x.url || ''))) {
      push('wikipedia-only', l, `${src.length} sources, all Wikipedia`);
    }
  }
  return out;
}

const main = async () => {
  const laws = await loadCorpus('src/data/laws');
  const rows = audit(laws);
  const want = (process.argv.includes('--kind') && process.argv[process.argv.indexOf('--kind') + 1]) || null;
  const all = process.argv.includes('--all');

  const by = {};
  for (const r of rows) by[r.kind] = (by[r.kind] || 0) + 1;
  console.log(`${laws.length} entries audited\n`);
  for (const [k, n] of Object.entries(by).sort((a, b) => b[1] - a[1])) {
    const hard = rows.find((r) => r.kind === k && r.hard) ? ' (defect)' : ' (review)';
    console.log(`  ${String(n).padStart(4)}  ${k}${hard}`);
  }
  for (const k of want ? [want] : Object.keys(by)) {
    const list = rows.filter((r) => r.kind === k);
    if (!list.length) continue;
    console.log(`\n## ${k} — ${list.length}`);
    for (const r of (all || want ? list : list.slice(0, 5))) console.log(`   ${r.slug.padEnd(34)} ${r.detail}`);
  }
  const hard = rows.filter((r) => r.hard).length;
  console.log(`\n${hard} unambiguous defect(s).`);
  process.exitCode = hard ? 1 : 0;
};

if (import.meta.url === `file://${process.argv[1]}`) main();
