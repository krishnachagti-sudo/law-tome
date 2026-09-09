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

  // ---- kind: spot. The reader judges cases and finds out. ----
  'rices-theorem': {
    kind: 'spot',
    title: 'Judge the cases',
    lede: 'Rice’s theorem is about SEMANTIC properties, meaning what a program does rather than how it is written, and about NON-TRIVIAL ones, meaning true of some programs and false of others. Every property meeting both conditions is undecidable.',
    prompt: 'For each question about an arbitrary program, decide whether a program could always answer it.',
    yesLabel: 'Decidable',
    noLabel: 'Undecidable',
    cases: [
      { text: 'Does the source code contain the word "goto"?', yes: true,
        why: 'A property of the text, not of the behaviour. Rice’s theorem says nothing about syntax, and you can just read the file.' },
      { text: 'Does this program ever print the number 7?', yes: false,
        why: 'Semantic, and true of some programs and false of others. That is exactly the pair of conditions Rice rules out.' },
      { text: 'Does this program halt on every input?', yes: false,
        why: 'The halting problem in its general form. Semantic and non-trivial, so undecidable.' },
      { text: 'Does this program stop within a thousand steps on input x?', yes: true,
        why: 'Semantic, but bounded. Run it for a thousand steps and look. The theorem needs the property to be about behaviour on unbounded runs.' },
      { text: 'Does this program compute the same function as some fixed program P?', yes: false,
        why: 'Program equivalence. Semantic, non-trivial, and undecidable, which is why no compiler can verify that an optimisation preserved meaning in general.' },
      { text: 'Is this a syntactically valid program at all?', yes: true,
        why: 'A parser answers it. Syntax again, so outside the theorem entirely.' },
      { text: 'Does this program compute SOME function?', yes: true,
        why: 'Trivially true of every program, so trivial in Rice’s sense. A property true of all programs, or of none, is decidable by answering the same way every time.' },
    ],
    note: 'Both conditions have to hold. Drop "semantic" and you get syntax, which is easy. Drop "non-trivial" and the answer is constant.',
  },
  'the-intentional-fallacy': {
    kind: 'spot',
    title: 'Judge the readings',
    lede: 'Wimsatt and Beardsley argued that what the author meant to do is neither available nor decisive. The evidence for a reading has to be in the work.',
    prompt: 'For each claim about a work, decide whether it rests on the author’s intention or on the work itself.',
    yesLabel: 'Appeals to intention',
    noLabel: 'Argues from the work',
    cases: [
      { text: 'The poem must be about grief, because the poet’s brother died the year before he wrote it.', yes: true,
        why: 'Biography standing in for evidence. The date of a death tells you what the writer may have felt, not what the poem says.' },
      { text: 'The poem is about grief: it returns four times to burial, and every door in it closes.', yes: false,
        why: 'The claim is checkable against the text by anyone, without knowing a thing about the poet.' },
      { text: 'The author said in an interview that the ending is a dream, so the ending is a dream.', yes: true,
        why: 'The strongest form of the fallacy, because the testimony feels authoritative. An author is a reader of their own work like anyone else, and can be wrong about it.' },
      { text: 'The ending is ambiguous: the final shot withholds the reverse angle that every earlier scene supplies.', yes: false,
        why: 'A structural fact about the film, and a reader who disagrees has to point at the film to do it.' },
      { text: 'Tolkien denied that the Ring is the atomic bomb, so that reading is wrong.', yes: true,
        why: 'A denial of intent settles what he meant, not what the work supports. Wimsatt and Beardsley would say the question is what is in the book.' },
      { text: 'The narrator is unreliable: chapters 2 and 9 give incompatible accounts of the same afternoon.', yes: false,
        why: 'Internal contradiction, cited precisely, and independent of anything the novelist intended.' },
    ],
    note: 'The fallacy is not "authors never say useful things". It is treating what they say as the evidence, when the work is what the claim is about.',
  },
  'the-no-true-scotsman': {
    kind: 'spot',
    title: 'Judge the moves',
    lede: 'The fallacy is redefining a group AFTER a counterexample, purely to expel the counterexample. Tightening a definition is not automatically the fallacy: it depends on whether the criterion existed beforehand.',
    prompt: 'For each exchange, decide whether the reply commits the fallacy.',
    yesLabel: 'Commits the fallacy',
    noLabel: 'Legitimate',
    cases: [
      { text: '"No Scotsman puts sugar on his porridge." "My uncle Angus does." "Well, no TRUE Scotsman does."', yes: true,
        why: 'The original example. The criterion appears only once the counterexample does, and it exists solely to remove it.' },
      { text: '"No licensed physician would prescribe that." "Dr Hale did." "Hale was struck off in 2019, so he was not licensed."', yes: false,
        why: 'Licensure is a prior, public, checkable criterion. The reply is a fact about the case, not a redefinition invented to escape it.' },
      { text: '"No real fan would boo the team." "Thousands booed on Saturday." "Then they were never real fans."', yes: true,
        why: '"Real fan" is doing no work except excluding whoever disagrees, so the claim can never be wrong. That is the tell.' },
      { text: '"No prime is even." "Two is." "Two is the exception; every OTHER prime is odd."', yes: false,
        why: 'A correction of an overstated claim to the true one, and the amended claim is still falsifiable. Nothing has been defined out of existence.' },
      { text: '"Our method never fails." "It failed at the Leeds site." "They did not apply it properly."', yes: true,
        why: 'The fallacy in industrial dress. If any failure counts as misapplication, no evidence could ever count against the method.' },
    ],
    note: 'The test is not whether the definition narrowed. It is whether the new criterion was available before the counterexample, and whether the claim could still be shown false afterwards.',
  },
  'the-steel-man': {
    kind: 'spot',
    title: 'Judge the restatements',
    lede: 'A steel man is the strongest version of the opposing case, stated so its holder would accept it. A straw man is a version chosen because it is easy to knock over.',
    prompt: 'For each restatement of an opponent’s position, decide which it is.',
    yesLabel: 'Steel man',
    noLabel: 'Straw man',
    cases: [
      { text: 'They argue for a speed limit here because they think drivers cannot be trusted with any freedom at all.', yes: false,
        why: 'A local claim about one road is inflated into a general contempt for drivers, which is easier to attack and is not what was said.' },
      { text: 'They argue for a speed limit here because sightlines at the bend are short and the cost of being wrong is a death.', yes: true,
        why: 'States the actual reasoning, including the strongest part of it, in terms the other side would sign.' },
      { text: 'Opponents of the merger just want to protect their own jobs.', yes: false,
        why: 'Replaces the argument with a motive. Even if the motive is real, it is not the case that was made, and answering it leaves the case standing.' },
      { text: 'Opponents of the merger accept the savings are real, and argue the combined firm would face no competitor able to discipline its prices.', yes: true,
        why: 'Concedes the strongest point on your own side and then states theirs precisely, which is what makes a rebuttal worth reading.' },
      { text: 'They want open borders.', yes: false,
        why: 'A position almost nobody holds, substituted for whatever was actually proposed. The give-away is that the restatement is shorter and more extreme than the original.' },
    ],
    note: 'The working test: would the person you are describing read your restatement and say yes, that is what I think, you have put it better than I did.',
  },
};

export function interactiveSlugs() {
  return Object.keys(INTERACTIVES);
}

export function interactiveFor(slug) {
  return INTERACTIVES[slug] || null;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The formula key, shared with widgets.mjs. */
function keyBlock(w) {
  if (!w.symbols || !w.symbols.length) return '';
  const symbols = w.symbols.map((y) => `            <div class="wg-sym">
              <dt>${esc(y.sym)}</dt>
              <dd>${esc(y.means)}${y.unit ? ` <span class="wg-unit">${esc(y.unit)}</span>` : ''}</dd>
            </div>`).join('\n');
  return `          <div class="wg-formula">
            <p class="wg-eq"><code>${esc(w.identity)}</code></p>
            <dl class="wg-syms">
${symbols}
            </dl>
          </div>`;
}

/* Every case and every explanation is rendered into the HTML, visible with no
 * JavaScript at all. The script turns that list into a quiz; without it the
 * reader still gets the whole argument, and a crawler still indexes it. The
 * alternative, holding the cases in a script and injecting them, would have
 * made the page empty to both. */
function spotBlock(slug, w) {
  const cases = w.cases.map((c, i) => `            <li class="ix-case" data-ix-case="${i}" data-answer="${c.yes ? '1' : '0'}">
              <p class="ix-case-text">${esc(c.text)}</p>
              <div class="ix-case-why" data-ix-why>
                <p><strong>${esc(c.yes ? w.yesLabel : w.noLabel)}.</strong> ${esc(c.why)}</p>
              </div>
            </li>`).join('\n');
  return `        <div class="interactive ix-spot" data-interactive="${esc(slug)}"
             data-yes="${esc(w.yesLabel)}" data-no="${esc(w.noLabel)}">
          <p class="wg-lede">${esc(w.lede)}</p>
          <p class="ix-prompt">${esc(w.prompt)}</p>
          <ol class="ix-cases">
${cases}
          </ol>
          <p class="ix-score" data-ix-score hidden></p>
          <p class="wg-note">${esc(w.note)}</p>
        </div>`;
}

export function interactiveBlock(slug) {
  const w = interactiveFor(slug);
  if (!w) return '';
  if (w.kind === 'spot') return spotBlock(slug, w);
  const key = keyBlock(w);
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
