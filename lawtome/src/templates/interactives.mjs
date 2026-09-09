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

  // ---- kind: sim. Run the stated mechanism forward and watch it diverge. ----
  //
  // These two laws are usually quoted as aphorisms and left there. Both make a
  // mechanical claim that can be run: effort moves to whichever route raises
  // the measured number per unit of cost, and if gaming is cheaper than doing
  // the work, the number keeps climbing while the thing it measured does not.
  //
  // This is a MODEL of the mechanism, not data. It is stated as such on the
  // page, and every number in it comes from the reader's own sliders.
  'goodharts-law': {
    kind: 'sim',
    title: 'Run it',
    lede: 'A measure works while nobody is optimising it. Put a target on it and effort moves to whichever route raises the number more cheaply, which is usually not the work.',
    identity: 'effort goes to min(cost of the work, cost of gaming / (1 - scrutiny))',
    symbols: [
      { sym: 'cq', means: 'Cost of one point of the real thing' },
      { sym: 'cg', means: 'Cost of one point of gaming' },
      { sym: 'd', means: 'Share of gaming that gets caught and reversed', unit: '%' },
    ],
    fields: [
      { id: 'cq', label: 'Cost of doing the work', min: 1, max: 40, step: 1, value: 10 },
      { id: 'cg', label: 'Cost of gaming the measure', min: 1, max: 40, step: 1, value: 3 },
      { id: 'd', label: 'Gaming caught and reversed', min: 0, max: 95, step: 1, value: 20, unit: '%' },
      { id: 'n', label: 'Rounds under the target', min: 2, max: 40, step: 1, value: 20 },
    ],
    series: [
      { id: 'p', label: 'The measure' },
      { id: 'q', label: 'What it was measuring' },
    ],
    outputs: [
      { id: 'p', label: 'The measure now reads', fmt: '' },
      { id: 'q', label: 'The real thing is at', fmt: '' },
      { id: 'share', label: 'Share of the measure that is gaming', fmt: '%' },
      { id: 'route', label: 'Where the effort goes', fmt: 'text' },
    ],
    note: 'A model of the stated mechanism, not measured data. Raise scrutiny until gaming costs more than the work and the two lines rejoin, which is the only fix the mechanism admits.',
  },
  'campbells-law': {
    kind: 'sim',
    title: 'Run it',
    lede: 'Campbell goes further than Goodhart. The indicator does not merely stop tracking the thing: the effort spent on the indicator is taken from the thing, so it actively degrades what it was watching.',
    identity: 'gaming both inflates the indicator and displaces the work',
    symbols: [
      { sym: 'cq', means: 'Cost of one point of the real outcome' },
      { sym: 'cg', means: 'Cost of one point of indicator-only gain' },
      { sym: 'displacement', means: 'Real outcome lost per point of gaming', unit: '%' },
    ],
    fields: [
      { id: 'cq', label: 'Cost of the real outcome', min: 1, max: 40, step: 1, value: 10 },
      { id: 'cg', label: 'Cost of lifting the indicator alone', min: 1, max: 40, step: 1, value: 3 },
      { id: 'd', label: 'Gaming caught and reversed', min: 0, max: 95, step: 1, value: 10, unit: '%' },
      { id: 'disp', label: 'Real outcome displaced per point gamed', min: 0, max: 100, step: 1, value: 20, unit: '%' },
      // Twelve rounds at 20% displacement lands the outcome around a quarter of
      // where it started. Longer or harsher and it floors at zero, which is a
      // true consequence of the model but reads like the model breaking.
      { id: 'n', label: 'Rounds under the indicator', min: 2, max: 40, step: 1, value: 12 },
    ],
    series: [
      { id: 'p', label: 'The indicator' },
      { id: 'q', label: 'The outcome it was meant to track' },
    ],
    outputs: [
      { id: 'p', label: 'The indicator now reads', fmt: '' },
      { id: 'q', label: 'The outcome is at', fmt: '' },
      { id: 'drop', label: 'Change in the real outcome', fmt: '%' },
      { id: 'route', label: 'Where the effort goes', fmt: 'text' },
    ],
    note: 'A model of the stated mechanism, not measured data. Set displacement to zero and this reduces to Goodhart: the indicator decouples but does no harm. Campbell is the claim that displacement is not zero.',
  },

  // ---- kind: spot, in scenario form. A scene, then questions, some of which
  // have no right answer. An open case explains what each reply commits you
  // to instead of marking it. ----
  'the-gettier-problem': {
    kind: 'spot',
    title: 'Work the case',
    lede: 'For two thousand years knowledge was justified true belief. Gettier ended that in three pages, with cases like this one.',
    scene: [
      'Smith has excellent evidence that Jones owns a Ford: he has ridden in it, Jones has produced the papers, Jones has driven it for years.',
      'From this Smith infers something more general: someone in the office owns a Ford.',
      'Unknown to Smith, Jones sold the Ford last week and now drives a rental. But Brown, who also works in the office and whom Smith has never discussed cars with, happens to own one.',
    ],
    prompt: 'Take the claim "someone in the office owns a Ford", as Smith holds it.',
    yesLabel: 'Yes',
    noLabel: 'No',
    cases: [
      { text: 'Is the claim true?', yes: true,
        why: 'Brown owns a Ford, so someone in the office does. It is true, though not for the reason Smith thinks.' },
      { text: 'Does Smith believe it?', yes: true,
        why: 'He inferred it deliberately from evidence he trusts, which is belief in the fullest sense.' },
      { text: 'Is Smith justified in believing it?', yes: true,
        why: 'His evidence about Jones was as good as evidence gets, and the inference from it is valid. Being justified does not require being right about why.' },
      { text: 'Does Smith KNOW that someone in the office owns a Ford?', open: true,
        whyYes: 'A defensible answer, and it costs you something: if this is knowledge, then knowledge can rest entirely on a false premise and be rescued by luck. Most people who say yes here revise when the luck is made explicit.',
        whyNo: 'The common answer, and it is fatal to the classical definition. You have just agreed the belief is justified, true, and held, and then denied it is knowledge. The three conditions cannot be sufficient.' },
    ],
    verdict: 'If you answered yes, yes, yes, no, you have reconstructed Gettier’s argument yourself. Justified true belief is not enough, because the justification can be disconnected from what makes the belief true. Sixty years of epistemology have gone into repairing this and no repair commands agreement.',
    note: 'Gettier’s 1963 paper is three pages long and contains two cases. This is the first of them, lightly retold.',
  },
  'chestertons-fence': {
    kind: 'spot',
    title: 'Decide the cases',
    lede: 'Chesterton’s rule is not "never remove anything". It is that the burden falls on the remover to find out why it is there first. The interesting question is when that burden has been met.',
    prompt: 'For each, decide whether Chesterton’s rule permits removing it now.',
    yesLabel: 'Go ahead',
    noLabel: 'Find out first',
    cases: [
      { text: 'A gate across a farm track. Nobody currently working the farm knows why it is there. It is inconvenient.', yes: false,
        why: 'The exact case Chesterton describes. Nobody knowing the reason is not evidence there was none, it is evidence you have not looked.' },
      { text: 'A deployment step whose commit message reads "workaround for the 2019 load balancer, remove after migration". The migration completed last year.', yes: true,
        why: 'The reason was recorded and has expired. Chesterton asks you to learn why the fence was put up, and you have. That is the rule satisfied, not defied.' },
      { text: 'A rule nobody can explain, in a system where the person who wrote it still works down the corridor.', yes: false,
        why: 'The cheapest possible investigation has not been done. Chesterton’s objection is to removal in ignorance, and here ignorance is a five-minute walk away.' },
      { text: 'A safety interlock that is currently injuring people, whose purpose is unknown, and the next incident is expected within days.', open: true,
        whyYes: 'Defensible, and worth being explicit about: you are saying the expected harm from waiting exceeds the expected harm from removing something you do not understand. That is a real trade-off, not an exemption from the rule.',
        whyNo: 'Also defensible, and the harder discipline. Interlocks are exactly the class of thing that looks pointless because it is working, and the injuries may be the symptom of a different fault.' },
      { text: 'A validation check with no comment, no history, and no test covering it, in code you are rewriting entirely.', yes: false,
        why: 'The absence of documentation is the reason to investigate, not permission to skip it. An uncommented check is the fence at its most Chestertonian.' },
    ],
    verdict: 'The rule is procedural rather than conservative. It does not say the fence is good; it says find out, and then decide. Most of the disagreement about it comes from people arguing as though it said the first thing.',
    note: 'From Chesterton’s The Thing, 1929. He was writing about institutions, and the argument transfers to code without much strain.',
  },
  'the-duhem-quine-thesis': {
    kind: 'spot',
    title: 'Assign the blame',
    lede: 'A hypothesis never faces the evidence alone. It goes into the test bundled with assumptions about the instruments, the sample, the background theory, and the arithmetic. When the result comes back wrong, the logic tells you the bundle is wrong. It does not tell you which part.',
    scene: [
      'You predict that a new compound absorbs light at 340 nanometres. You run the spectrometer. Nothing appears at 340.',
      'The prediction failed. Something in what you assumed is false.',
    ],
    prompt: 'For each response, decide whether it is logically available to you.',
    yesLabel: 'Logically available',
    noLabel: 'Ruled out',
    cases: [
      { text: 'Conclude the compound does not absorb at 340, and abandon the hypothesis.', yes: true,
        why: 'Available, and usually the honest reading. But notice it is a choice, not something the failure forced on you.' },
      { text: 'Conclude the spectrometer is miscalibrated, and keep the hypothesis.', yes: true,
        why: 'Equally available. Instruments do drift, and this is a routine and legitimate response. Duhem’s point is that logic cannot tell you it is the wrong one.' },
      { text: 'Conclude the sample was contaminated, and keep the hypothesis.', yes: true,
        why: 'Available again. Any auxiliary assumption can absorb the failure, which is why a determined researcher can always save a hypothesis.' },
      { text: 'Conclude that the failure proves the hypothesis false, with no further assumption required.', yes: false,
        why: 'This is the one thing the failure does NOT establish. The test was of a conjunction, so its falsity licenses only the claim that at least one conjunct is false.' },
      { text: 'Given that any of these is available, is choosing between them therefore arbitrary?', open: true,
        whyYes: 'The strong Quinean reading, and it leads somewhere uncomfortable: if theory choice is not settled by evidence, something else settles it, and Kuhn and the sociology of science follow.',
        whyNo: 'The common working answer, and the one most scientists hold: the choice is underdetermined by logic but not by judgement. Calibrating the instrument is cheap and testable; that is a good reason, just not a deductive one.' },
    ],
    verdict: 'The thesis is not that science cannot decide. It is that the deciding is done by something other than the logic of falsification, which means the something else deserves examination rather than assumption.',
    note: 'Duhem argued it for physics in 1906; Quine generalised it to all of knowledge in 1951. The strong and weak readings are genuinely different claims and are often conflated.',
  },
  'the-teletransportation-paradox': {
    kind: 'spot',
    title: 'Decide who steps out',
    lede: 'Parfit uses this to argue that personal identity is not what matters, and that our confidence in it does not survive being asked carefully.',
    scene: [
      'A machine on Earth scans every cell of your body, records the exact state, and destroys the original. A machine on Mars builds a copy from local matter to that specification. The copy wakes with all your memories, continuous in every psychological respect.',
    ],
    prompt: 'Work through the versions. The first questions have answers; the later ones are the argument.',
    yesLabel: 'Yes',
    noLabel: 'No',
    cases: [
      { text: 'Does the person on Mars remember your childhood, hold your commitments, and continue your projects?', yes: true,
        why: 'By construction, yes. Every psychological connection that normally holds between you yesterday and you today holds here too.' },
      { text: 'Is any physical atom of the original transported to Mars?', yes: false,
        why: 'None. The Martian body is built from Martian matter. Any account resting on material continuity has to say this is a different person.' },
      { text: 'Is the person who steps out on Mars you?', open: true,
        whyYes: 'Then identity travels with the pattern rather than the substance. Accept it and ordinary survival looks the same in kind: the atoms in you now are largely not the ones from ten years ago either.',
        whyNo: 'Then you have just been killed and replaced by a very convincing stranger, and everyone who loves them is mistaken. Consistency then requires saying what physical thread does the work, and every candidate is replaced gradually in ordinary life.' },
      { text: 'Now suppose the Earth scanner malfunctions and does NOT destroy the original, so both of you exist. Is the one on Mars still you?', open: true,
        whyYes: 'Then you are in two places, and the two immediately diverge into different people. Identity cannot be one-to-many, so something has to give.',
        whyNo: 'The usual answer. But nothing about the Martian changed: the same scan, the same matter, the same memories. Whether they are you now depends on an event on another planet, which is Parfit’s point.' },
    ],
    verdict: 'Parfit’s conclusion is that the question has no determinate answer, and that this is not a gap in our knowledge but a fact about identity. What matters, he argues, is psychological continuity and connectedness, and identity is not what matters.',
    note: 'From Reasons and Persons, 1984. The branching version is the one that does the real work, because it makes the answer depend on a distant event that changes nothing locally.',
  },

  // ---- kind: demo. Something the reader looks at. ----
  //
  // These three are the clearest case in the corpus for an interaction: they
  // are perceptual facts, and prose can only assert them. A reader who sees
  // two lights become one moving light has learned the phenomenon; a reader
  // told that this happens has learned a sentence.
  //
  // The stimuli are small and start paused. Anything flashing is kept well
  // under the WCAG general flash threshold by area, and nothing animates until
  // the reader presses play or if they have asked for reduced motion.
  'the-phi-phenomenon': {
    kind: 'demo',
    title: 'See it',
    lede: 'Two lights, alternating. Nothing moves and nothing exists between them. Above about ten flashes a second you will see one light travelling back and forth anyway.',
    stage: 'phi',
    play: true,
    fields: [
      { id: 'gap', label: 'Time between flashes', min: 20, max: 700, step: 10, value: 60, unit: ' ms' },
      { id: 'sep', label: 'Distance apart', min: 20, max: 90, step: 1, value: 60, unit: '%' },
    ],
    readouts: [
      { id: 'rate', label: 'Flashes per second', fmt: '' },
      { id: 'sees', label: 'What most people report', fmt: 'text' },
    ],
    caption: 'Press play, then look at the space between the two dots rather than at either one.',
    note: 'Wertheimer used this in 1912 to argue that perception is not built from the parts of a scene, because the motion you see is in neither frame. It became the founding demonstration of Gestalt psychology. Slow it past roughly 200 milliseconds and the illusion breaks into two blinking lights.',
  },
  'the-purkinje-effect': {
    kind: 'demo',
    title: 'See it',
    lede: 'In daylight the red is the brighter of the two. As the light falls, the eye hands over from cones to rods, and the blue overtakes it without either patch changing colour.',
    stage: 'purkinje',
    fields: [
      { id: 'lum', label: 'Ambient light', min: -3, max: 1, step: 0.05, value: 1, unit: ' log cd/m2' },
    ],
    readouts: [
      { id: 'cond', label: 'Which system is doing the seeing', fmt: 'text' },
      { id: 'ratio', label: 'Blue brightness against red', fmt: 'x' },
      { id: 'peak', label: 'Wavelength the eye is most sensitive to', fmt: ' nm' },
    ],
    caption: 'The two patches keep the same hue throughout. Only their relative brightness changes.',
    note: 'The rendered brightness of each patch is computed from the standard photopic and scotopic luminous efficiency curves at 650 and 450 nanometres, blended across the mesopic range. The shift is why red flowers look black at dusk while blue ones stay vivid, and why darkrooms and cockpit instruments are lit red.',
  },
  'simultaneous-contrast': {
    kind: 'demo',
    title: 'See it',
    lede: 'The two inner squares are the same grey. They are emitting identical light from identical pixels, and they will not look it.',
    stage: 'contrast',
    fields: [
      { id: 'sep', label: 'Difference between the backgrounds', min: 0, max: 100, step: 1, value: 70, unit: '%' },
      { id: 'mid', label: 'Grey of both squares', min: 20, max: 80, step: 1, value: 50, unit: '%' },
    ],
    readouts: [
      { id: 'same', label: 'Colour of the left square', fmt: 'text' },
      { id: 'same2', label: 'Colour of the right square', fmt: 'text' },
      { id: 'diff', label: 'Difference between them', fmt: 'text' },
    ],
    caption: 'Drag the background difference to zero and the two squares visibly become what they always were.',
    note: 'The eye reports contrast with the surround rather than absolute luminance, because that is the quantity that stays constant as the light changes. The illusion is the price of that design, and both readouts below are read back from the rendered elements rather than asserted.',
  },

  // ---- kind: probe. One question at a time, and the verdict is computed from
  // the reader's own answers rather than from anything asserted. ----
  //
  // Sequencing is the mechanism, not decoration. Show both questions at once
  // and the reader reconciles them before answering; that is precisely what
  // these two laws say people fail to do in the wild.
  'the-ellsberg-paradox': {
    kind: 'probe',
    title: 'Take the bets',
    lede: 'An urn holds ninety balls. Thirty are red. The other sixty are black and yellow in an unknown proportion, anywhere from all black to all yellow. You draw one ball.',
    steps: [
      { id: 'first', type: 'choice',
        text: 'Two bets, each paying the same if you win. Which do you want?',
        options: [
          { id: 'red', label: 'Win if the ball is RED' },
          { id: 'black', label: 'Win if the ball is BLACK' },
        ] },
      { id: 'second', type: 'choice',
        text: 'Same urn, same ball, two more bets. Which now?',
        options: [
          { id: 'ry', label: 'Win if the ball is RED or YELLOW' },
          { id: 'by', label: 'Win if the ball is BLACK or YELLOW' },
        ] },
    ],
    note: 'Ellsberg ran this in 1961. The usual pattern is not a mistake in arithmetic. It is a preference for a known risk over an unknown one, which no single probability assignment can represent, and which is why ambiguity aversion is treated as its own thing.',
  },
  'the-planning-fallacy': {
    kind: 'probe',
    title: 'Check yourself',
    lede: 'Kahneman and Tversky’s claim is not that people are bad at estimating. It is that they estimate from the plan in front of them rather than from what happened last time, and that the two answers differ reliably in one direction.',
    steps: [
      { id: 'est', type: 'number', text: 'Think of a piece of work you are putting off. Picture doing it. How many days will it take?',
        min: 0.5, max: 400, step: 0.5, value: 5, unit: ' days' },
      { id: 'h1', type: 'number', text: 'Now do not think about that one. How many days did the LAST comparable piece of work actually take, start to finish?',
        min: 0.5, max: 400, step: 0.5, value: 8, unit: ' days' },
      { id: 'h2', type: 'number', text: 'And the one before that?',
        min: 0.5, max: 400, step: 0.5, value: 12, unit: ' days' },
    ],
    note: 'The first question invites the inside view: you simulate the work and add up the steps, and the simulation contains no interruptions, because you cannot picture the ones you have not had yet. The last two invite the outside view, which already contains every interruption that actually occurred. The gap between your own two answers is the fallacy, measured on you.',
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
  // An OPEN case has no right answer. A thought experiment's interesting
  // question is usually of this shape: both replies are defensible and each
  // commits you to something, so the page explains the commitment rather than
  // marking you. Open cases are not scored.
  const cases = w.cases.map((c, i) => {
    if (c.open) {
      return `            <li class="ix-case" data-ix-case="${i}" data-open="1">
              <p class="ix-case-text">${esc(c.text)}</p>
              <div class="ix-case-why" data-ix-why data-why-yes>
                <p><strong>${esc(w.yesLabel)}.</strong> ${esc(c.whyYes)}</p>
              </div>
              <div class="ix-case-why" data-ix-why data-why-no>
                <p><strong>${esc(w.noLabel)}.</strong> ${esc(c.whyNo)}</p>
              </div>
            </li>`;
    }
    return `            <li class="ix-case" data-ix-case="${i}" data-answer="${c.yes ? '1' : '0'}">
              <p class="ix-case-text">${esc(c.text)}</p>
              <div class="ix-case-why" data-ix-why>
                <p><strong>${esc(c.yes ? w.yesLabel : w.noLabel)}.</strong> ${esc(c.why)}</p>
              </div>
            </li>`;
  }).join('\n');
  const scene = (w.scene || []).map((p) => `          <p class="ix-scene-p">${esc(p)}</p>`).join('\n');
  return `        <div class="interactive ix-spot" data-interactive="${esc(slug)}"
             data-yes="${esc(w.yesLabel)}" data-no="${esc(w.noLabel)}">
          <p class="wg-lede">${esc(w.lede)}</p>
${scene ? `          <div class="ix-scene">\n${scene}\n          </div>` : ''}
          <p class="ix-prompt">${esc(w.prompt)}</p>
          <ol class="ix-cases">
${cases}
          </ol>
          <p class="ix-score" data-ix-score hidden></p>
${w.verdict ? `          <div class="ix-verdict" data-ix-verdict-box hidden><p>${esc(w.verdict)}</p></div>` : ''}
          <p class="wg-note">${esc(w.note)}</p>
        </div>`;
}

/* kind: sim. Sliders, an SVG the engine draws, and numeric readouts. The
 * chart is drawn client-side because it depends entirely on the reader's
 * settings; the numbers beside it carry the same information for anyone
 * without scripts, so nothing is only in the picture. */
function simBlock(slug, w) {
  const fields = w.fields.map((f) => `            <label class="wg-in">
              <span class="wg-lab">${esc(f.label)}</span>
              <input type="range" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.value}"
                     data-ix="${esc(f.id)}" data-unit="${esc(f.unit || '')}" aria-label="${esc(f.label)}">
              <output data-ixout="${esc(f.id)}">${f.value}${esc(f.unit || '')}</output>
            </label>`).join('\n');
  const legend = w.series.map((y, i) => `            <span class="ix-key" data-series="${i}">${esc(y.label)}</span>`).join('\n');
  const outs = w.outputs.map((o) => `            <div class="wg-res">
              <span class="wg-res-lab">${esc(o.label)}</span>
              <span class="wg-res-v" data-ixres="${esc(o.id)}" data-unit="${esc(o.fmt || '')}">—</span>
            </div>`).join('\n');
  return `        <div class="interactive ix-sim" data-interactive="${esc(slug)}">
          <p class="wg-lede">${esc(w.lede)}</p>
${keyBlock(w)}
${fields}
          <div class="ix-legend">
${legend}
          </div>
          <div class="ix-chart" data-ix-chart aria-hidden="true"></div>
${outs}
          <p class="wg-note">${esc(w.note)}</p>
        </div>`;
}

/* kind: demo. A stage the reader looks at, sliders that drive it through CSS
 * custom properties, and readouts. The stage markup is static and server
 * rendered; the script only sets variables on it. */
const STAGES = {
  phi: `            <span class="phi-dot" data-dot="0"></span>
            <span class="phi-dot" data-dot="1"></span>`,
  purkinje: `            <span class="pk-patch" data-patch="red"></span>
            <span class="pk-patch" data-patch="blue"></span>`,
  contrast: `            <span class="sc-field" data-field="lo"><span class="sc-chip"></span></span>
            <span class="sc-field" data-field="hi"><span class="sc-chip"></span></span>`,
};

function demoBlock(slug, w) {
  const fields = w.fields.map((f) => `            <label class="wg-in">
              <span class="wg-lab">${esc(f.label)}</span>
              <input type="range" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.value}"
                     data-ix="${esc(f.id)}" data-unit="${esc(f.unit || '')}" aria-label="${esc(f.label)}">
              <output data-ixout="${esc(f.id)}">${f.value}${esc(f.unit || '')}</output>
            </label>`).join('\n');
  const outs = (w.readouts || []).map((o) => `            <div class="wg-res">
              <span class="wg-res-lab">${esc(o.label)}</span>
              <span class="wg-res-v" data-ixres="${esc(o.id)}" data-unit="${esc(o.fmt || '')}">—</span>
            </div>`).join('\n');
  // Anything that flashes starts stopped, and says so, rather than beginning
  // to strobe the moment the section scrolls into view.
  const play = w.play
    ? `          <button type="button" class="ix-play" data-ix-play aria-pressed="false">Play</button>`
    : '';
  return `        <div class="interactive ix-demo" data-interactive="${esc(slug)}" data-stage="${esc(w.stage)}">
          <p class="wg-lede">${esc(w.lede)}</p>
          <div class="ix-stage" data-ix-stage data-stage="${esc(w.stage)}" aria-hidden="true">
${STAGES[w.stage]}
          </div>
          <p class="ix-caption">${esc(w.caption)}</p>
${play}
${fields}
${outs}
          <p class="wg-note">${esc(w.note)}</p>
        </div>`;
}

/* kind: probe. Each step is revealed only when the one before it is answered,
 * because seeing the later question first is exactly what stops these effects
 * appearing. With no script every step is visible and the page reads as a
 * description of the experiment, which is the honest fallback. */
function probeBlock(slug, w) {
  const steps = w.steps.map((st, i) => {
    const body = st.type === 'choice'
      ? `                <div class="ix-choices">
${st.options.map((o) => `                  <button type="button" class="ix-choice" data-ix-opt="${esc(o.id)}">${esc(o.label)}</button>`).join('\n')}
                </div>`
      : `                <label class="wg-in">
                  <span class="wg-lab">${esc(st.unit ? st.unit.trim() : 'value')}</span>
                  <input type="range" min="${st.min}" max="${st.max}" step="${st.step}" value="${st.value}"
                         data-ix="${esc(st.id)}" data-unit="${esc(st.unit || '')}" aria-label="${esc(st.text)}">
                  <output data-ixout="${esc(st.id)}">${st.value}${esc(st.unit || '')}</output>
                </label>
                <button type="button" class="ix-choice" data-ix-next>That is my answer</button>`;
    return `            <li class="ix-step-item" data-ix-step="${i}" data-step-id="${esc(st.id)}" data-type="${esc(st.type)}">
              <p class="ix-case-text">${esc(st.text)}</p>
${body}
            </li>`;
  }).join('\n');
  return `        <div class="interactive ix-probe" data-interactive="${esc(slug)}">
          <p class="wg-lede">${esc(w.lede)}</p>
          <ol class="ix-cases">
${steps}
          </ol>
          <div class="ix-verdict" data-ix-out="result" hidden></div>
          <div class="ix-work" data-ix-out="work"></div>
          <p class="wg-note">${esc(w.note)}</p>
        </div>`;
}

export function interactiveBlock(slug) {
  const w = interactiveFor(slug);
  if (!w) return '';
  if (w.kind === 'spot') return spotBlock(slug, w);
  if (w.kind === 'sim') return simBlock(slug, w);
  if (w.kind === 'demo') return demoBlock(slug, w);
  if (w.kind === 'probe') return probeBlock(slug, w);
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
