/* Interactions that are not calculators.
 *
 * widgets.mjs answers "what number does this law give for these inputs" with
 * sliders. Most of the corpus cannot be asked that question: an impossibility
 * proof has no closed form, a fallacy has no dial, a thought experiment is a
 * choice rather than a quantity. Those laws still have something a reader can
 * DO, and Search Console says doing beats reading by roughly five to one.
 *
 * Each spec names a `kind`, which selects an engine in assets/interactive.js.
 * The arithmetic and the validation stay in the engine; this file is content.
 */

const INTERACTIVES = {
  // ---- kind: solver. Typed inputs, validated, with the construction shown. ----
  //
  // This law was recorded for several weeks as permanently prose, on the
  // grounds that its moduli must be pairwise coprime and a slider producing
  // invalid input would teach the wrong thing. That objection was about
  // SLIDERS. It is the highest-impression page on the site without an
  // interaction: 914 impressions at position 8.1, and no clicks at all.
  // A typed input that checks coprimality and refuses to pretend is exactly
  // what the theorem's own precondition asks for.
  'the-chinese-remainder-theorem': {
    kind: 'solver',
    title: 'Solve one',
    lede: 'Give the remainders and the moduli. If the moduli are pairwise coprime there is exactly one answer below their product, and the construction finds it.',
    identity: 'x = sum(ri Ni yi) mod N,  N = product of the mi',
    symbols: [
      { sym: 'ri', means: 'The remainder you want' },
      { sym: 'mi', means: 'The modulus, pairwise coprime with the others' },
      { sym: 'N', means: 'Product of all the moduli' },
    ],
    // The classical Sun Tzu problem, third century: things of unknown number,
    // counted in threes, fives and sevens.
    fields: [
      { id: 'r0', label: 'x leaves remainder', value: 2, min: 0, max: 100000 },
      { id: 'm0', label: 'on division by', value: 3, min: 2, max: 100000 },
      { id: 'r1', label: 'and remainder', value: 3, min: 0, max: 100000 },
      { id: 'm1', label: 'on division by', value: 5, min: 2, max: 100000 },
      { id: 'r2', label: 'and remainder', value: 2, min: 0, max: 100000 },
      { id: 'm2', label: 'on division by', value: 7, min: 2, max: 100000 },
    ],
    note: 'The moduli must be pairwise coprime. When they are not, the theorem does not apply and this says so rather than returning a number.',
  },
};

export function interactiveSlugs() {
  return Object.keys(INTERACTIVES);
}

export function interactiveFor(slug) {
  return INTERACTIVES[slug] || null;
}

export function interactiveBlock(slug) {
  const w = interactiveFor(slug);
  if (!w) return '';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const symbols = (w.symbols || []).map((y) => `            <div class="wg-sym">
              <dt>${esc(y.sym)}</dt>
              <dd>${esc(y.means)}${y.unit ? ` <span class="wg-unit">${esc(y.unit)}</span>` : ''}</dd>
            </div>`).join('\n');
  const key = w.symbols && w.symbols.length
    ? `          <div class="wg-formula">
            <p class="wg-eq"><code>${esc(w.identity)}</code></p>
            <dl class="wg-syms">
${symbols}
            </dl>
          </div>`
    : '';
  const fields = w.fields.map((f) => `            <label class="ix-f">
              <span class="ix-lab">${esc(f.label)}</span>
              <input type="number" inputmode="numeric" data-ix="${esc(f.id)}"
                     value="${f.value}" min="${f.min}" max="${f.max}" step="1"
                     aria-label="${esc(f.label)}">
            </label>`).join('\n');
  return `        <div class="interactive" data-interactive="${esc(slug)}">
          <p class="wg-lede">${esc(w.lede)}</p>
${key}
          <div class="ix-fields">
${fields}
          </div>
          <p class="ix-msg" data-ix-msg role="status"></p>
          <div class="ix-result" data-ix-out="result"></div>
          <div class="ix-work" data-ix-out="work"></div>
          <p class="wg-note">${esc(w.note)}</p>
        </div>`;
}
