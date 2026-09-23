// "What we checked": the one proof component, rendered identically everywhere.
//
// The JavaScript half of the shared device. The Python half is proof.py in the
// conyso repo, which renders it on the Labs dataset pages and the founder site.
// Same structure, same class names, same honesty, skinned per property — so the
// three read as one component rather than three lookalikes. The formatting rule
// is the part that silently drifts, so it is pinned by proof_fixture.json in the
// conyso repo and checked by test/proof.test.mjs here.
//
// The component accepts a callable, never a number. Handing it a literal throws.
// That is deliberate: founder/index.html already carried a proof strip whose six
// figures were typed into HTML, one of them wrong on the live site, and nothing
// in the build could tell. A device whose numbers can go stale spends exactly
// the credibility it was built to earn.

/** A proof figure was not derived from a live source. */
export class ProofError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProofError';
  }
}

/**
 * HTML escaping, matching Python's `html.escape(s)` (quote=True) character for
 * character — including `'` as `&#x27;`, where this repo's own escapeHtml leaves
 * the apostrophe literal. That difference is the whole reason this is local:
 * markup parity with proof.py is what makes the two renderers one component, and
 * partials.escapeHtml is tuned for law names ("Goodhart's Law"), not for that.
 */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Call a source function and validate what it returns.
 *
 * `source` must be callable and return rows of [number, label, how]:
 *   number  a number computed now, not typed
 *   label   what it counts, in plain words
 *   how     one sentence telling the reader how to check it themselves
 */
export function figures(source) {
  if (typeof source !== 'function') {
    throw new ProofError(
      `proof figures must come from a callable that computes them now, got ${typeof source}. `
      + 'Passing a literal is the failure this component exists to prevent.');
  }
  const rows = source();
  if (!rows || !rows.length) {
    throw new ProofError(
      'proof source returned nothing. A property with no measurement does not '
      + 'get the device; see the readiness table in the plan.');
  }
  const out = [];
  for (const r of rows) {
    if (!Array.isArray(r) || r.length !== 3) {
      throw new ProofError(`expected [number, label, how], got ${JSON.stringify(r)}`);
    }
    const [n, label, how] = r;
    if (typeof n !== 'number' || !Number.isFinite(n)) {
      throw new ProofError(`proof figure ${JSON.stringify(n)} for ${JSON.stringify(label)} is not a number`);
    }
    if (!String(label).trim() || !String(how).trim()) {
      throw new ProofError(
        `figure ${n} needs both a label and a sentence saying how to check it. `
        + 'A number the reader cannot reproduce is decoration.');
    }
    out.push([n, String(label).trim(), String(how).trim()]);
  }
  return out;
}

/**
 * Round to one decimal the way Python's "%.1f" does: half-to-even on the exact
 * binary value. Number.prototype.toFixed rounds exact ties away from zero, so
 * (0.25).toFixed(1) is "0.3" where Python prints "0.2". Only exact ties differ —
 * a value like 0.35 is not really a tie in binary and both agree on it — but a
 * quarter is exactly representable, so the case is reachable and cheap to match.
 */
function fixed1(n) {
  const t = n * 10;
  const lo = Math.floor(t);
  if (t - lo !== 0.5) return n.toFixed(1);
  return ((lo % 2 === 0 ? lo : lo + 1) / 10).toFixed(1);
}

/**
 * One formatting rule, shared with proof.py via proof_fixture.json.
 *
 * If the two renderers format differently the properties stop looking like one
 * component, which is the only thing the shared constant is for.
 *
 * Python distinguishes 3 from 3.0 and JavaScript does not; the rule survives the
 * translation because Python's branch is `n != int(n)`, i.e. "has a fractional
 * part", which is exactly `!Number.isInteger(n)` here. 3.0 formats as "3" in both.
 */
export function fmt(n) {
  if (!Number.isInteger(n)) return fixed1(n);
  // Python's "{:,}" on int(n); Math.trunc matches int()'s truncation toward zero.
  // String() is used rather than toLocaleString so the output cannot depend on
  // the machine's locale (fr-FR groups with narrow spaces, and the build would
  // ship "1 116" with nothing failing).
  const s = String(Math.trunc(n));
  const neg = s.startsWith('-');
  const digits = neg ? s.slice(1) : s;
  return (neg ? '-' : '') + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Render the device. `source` is a callable, per figures(). */
export function render(source, { heading = 'What we checked', cls = 'cy-proof' } = {}) {
  const rows = figures(source);
  const items = rows
    .map(([n, label, how]) => `<li><b>${esc(fmt(n))}</b><span>${esc(label)}</span><em>${esc(how)}</em></li>`)
    .join('');
  return `<section class="${cls}"><h2 class="${cls}-h">${esc(heading)}</h2><ul class="${cls}-list">${items}</ul></section>`;
}

/**
 * Recompute the figures and confirm each reached the markup.
 *
 * The render-side counterpart to figures(). compute_datasets_gen.py learned this
 * the expensive way: its checks all passed while a 40-row cap silently dropped
 * 88% of computed rows off the page. Every value verified upstream was still
 * verified, and the page was still wrong. Verify the output, not only the input.
 */
export function assertRendered(markup, source, where) {
  const missing = figures(source)
    .filter(([n]) => !markup.includes(`<b>${esc(fmt(n))}</b>`))
    .map(([n, label]) => `${fmt(n)} (${label})`);
  if (missing.length) {
    throw new ProofError(
      `proof device on ${where}: ${missing.length} computed figures did not reach the markup: `
      + missing.join('; '));
  }
}
