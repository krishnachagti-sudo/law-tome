/* What a pair actually disagrees about, and a way to find out which one's
 * conditions your case meets.
 *
 * compare.mjs deliberately authors no "the difference is…" sentence, on the
 * grounds that deciding which law your case falls under is the reader's job
 * and inventing the verdict would be inventing a fact. That is right about the
 * VERDICT and too broad about the DIFFERENCE. Naming what two entries disagree
 * about is a fact about the entries, derivable from claims both already make,
 * and it is the same kind of statement as "the corpus records them as opposed",
 * which those pages assert already. Which one your case needs is still yours.
 *
 * So every entry here carries:
 *   difference — what the two disagree ABOUT. Never which to pick.
 *   questions  — each asks about the READER's own conditions or commitments,
 *                and each answer names which entry's stated conditions it
 *                matches. The page reports the match; it does not advise.
 *
 * Search Console: these pages sit at median position 8.8 with 3,179 addressable
 * impressions and nine clicks, because the first sentence a reader meets is
 * boilerplate ending "yours to judge".
 */

const COMPARISONS = {
  'the-gettier-problem-vs-justified-true-belief': {
    difference: 'They disagree about whether justification and truth are enough to make a belief knowledge. Justified True Belief says those three conditions are exactly what knowledge is; the Gettier Problem exhibits cases meeting all three that are not knowledge, because the justification is disconnected from what makes the belief true.',
    prompt: 'Which position do your own commitments match?',
    questions: [
      { text: 'Someone believes the boss is in the building because they saw her car outside. The car was sold last week, but she is in the building, having walked. Do they know she is in the building?',
        options: [
          { label: 'Yes, they know', matches: 'b', why: 'Justified True Belief. The belief is true, they hold it, and the evidence was reasonable, so on the classical analysis this is knowledge.' },
          { label: 'No, they got lucky', matches: 'a', why: 'The Gettier Problem. You have just said the three conditions can all hold and still not deliver knowledge, which is exactly the counterexample.' },
        ] },
      { text: 'Does it matter WHY a justified true belief happens to be true?',
        options: [
          { label: 'Yes, the reason has to connect', matches: 'a', why: 'The Gettier Problem. Requiring the justification to be connected to the truth-maker is precisely what the classical three conditions do not require.' },
          { label: 'No, true and justified is enough', matches: 'b', why: 'Justified True Belief, in its unamended form.' },
        ] },
      { text: 'Is "knowledge" something a short list of conditions can define at all?',
        options: [
          { label: 'Yes, we just need the right list', matches: 'b', why: 'The analytic project Justified True Belief belongs to. Sixty years of proposed fourth conditions have not settled on one.' },
          { label: 'Perhaps not', matches: 'a', why: 'A common reading of what Gettier ultimately showed, though he did not claim it himself.' },
        ] },
    ],
  },

  'the-fundamental-attribution-error-vs-the-actor-observer-bias': {
    difference: 'They differ on whose behaviour is being explained: one is about other people, the other about the gap between them and you. The fundamental attribution error concerns explaining OTHER people: their conduct gets attributed to character rather than circumstance. The actor-observer bias is the asymmetry between others and yourself: the same conduct is character in them and circumstance in you.',
    prompt: 'Which pattern does your case fit?',
    questions: [
      { text: 'Whose behaviour is being explained?',
        options: [
          { label: 'Someone else’s only', matches: 'a', why: 'The fundamental attribution error covers this: over-weighting disposition and under-weighting situation when explaining another person.' },
          { label: 'Yours and theirs, differently', matches: 'b', why: 'The actor-observer bias is exactly this asymmetry. The comparison between the two explanations is the phenomenon.' },
        ] },
      { text: 'Is the claim that the explanation is WRONG, or that it is INCONSISTENT?',
        options: [
          { label: 'Wrong: they blamed character when circumstance did it', matches: 'a', why: 'An error claim, which is what "fundamental attribution error" asserts.' },
          { label: 'Inconsistent: different rules for self and others', matches: 'b', why: 'A bias claim about asymmetry, which is what the actor-observer bias asserts. It can hold even where each explanation is individually reasonable.' },
        ] },
    ],
  },

  'fermentation-vs-pasteurization': {
    difference: 'They do opposite things to microbes: one keeps them alive to do the work, the other applies heat to kill them. Fermentation cultivates them: chosen organisms are kept alive to convert sugars and produce the result. Pasteurisation destroys them: controlled heat kills the organisms so the result stops changing.',
    prompt: 'Which process is your case?',
    questions: [
      { text: 'Are the microorganisms meant to survive?',
        options: [
          { label: 'Yes, they do the work', matches: 'a', why: 'Fermentation. The organisms are the mechanism, and killing them ends the process.' },
          { label: 'No, killing them is the point', matches: 'b', why: 'Pasteurisation. The heat step exists to reduce the viable population.' },
        ] },
      { text: 'Is the product supposed to keep changing after the step?',
        options: [
          { label: 'Yes, it matures', matches: 'a', why: 'Fermentation, which continues as long as the culture is active and the substrate lasts.' },
          { label: 'No, it should hold still', matches: 'b', why: 'Pasteurisation, whose purpose is to stop biological change and extend shelf life.' },
        ] },
      { text: 'Can both apply to the same product?',
        options: [
          { label: 'Yes, in sequence', matches: 'both', why: 'Correct, and common. Many fermented products are pasteurised afterwards to halt the fermentation at a chosen point. The two are opposite operations, not mutually exclusive ones.' },
          { label: 'No, they exclude each other', matches: 'neither', why: 'They are opposite in effect but routinely combined: ferment first, then pasteurise to stop it. Beer and some yoghurts are made this way.' },
        ] },
    ],
  },

  'the-foot-in-the-door-technique-vs-the-door-in-the-face-technique': {
    difference: 'They run in opposite directions: one escalates from a small request, the other retreats from a large one. Foot-in-the-door starts with a small request that is accepted and escalates to the real one. Door-in-the-face starts with a large request that is refused and retreats to the real one.',
    prompt: 'Which sequence describes your case?',
    questions: [
      { text: 'Was the first request meant to be accepted or refused?',
        options: [
          { label: 'Accepted', matches: 'a', why: 'Foot-in-the-door. The small yes is the mechanism, and the technique fails if the first request is declined.' },
          { label: 'Refused', matches: 'b', why: 'Door-in-the-face. The refusal is the mechanism: the retreat that follows reads as a concession.' },
        ] },
      { text: 'Did the second request get bigger or smaller than the first?',
        options: [
          { label: 'Bigger', matches: 'a', why: 'Foot-in-the-door escalates, and the escalation is the point: the small commitment is what makes the large one feel consistent.' },
          { label: 'Smaller', matches: 'b', why: 'Door-in-the-face retreats, which is what makes the second request feel like a compromise.' },
        ] },
      { text: 'How much time passed between the two requests?',
        options: [
          { label: 'Days or longer', matches: 'a', why: 'Foot-in-the-door tolerates a delay, because it works through self-perception: having agreed once, you now see yourself as the kind of person who agrees.' },
          { label: 'Immediately', matches: 'b', why: 'Door-in-the-face needs immediacy, because it works through reciprocal concession, and a concession only reads as one if it follows the refusal closely.' },
        ] },
    ],
  },

  'the-beaufort-scale-vs-the-fujita-scale': {
    difference: 'They measure different things by different means, and one is applied while the wind blows while the other is applied to the wreckage. Beaufort rates sustained wind by its observable effects, from smoke rising straight up to structural damage, and applies to ordinary weather. Fujita rates a tornado after the fact by the damage it left, and infers the wind speed from that damage rather than measuring it.',
    prompt: 'Which scale fits what you are measuring?',
    questions: [
      { text: 'Is the wind still blowing while you rate it?',
        options: [
          { label: 'Yes, I am observing it now', matches: 'a', why: 'Beaufort was built for exactly this: a sailor judging present conditions without instruments.' },
          { label: 'No, I am looking at the aftermath', matches: 'b', why: 'Fujita is a post-hoc damage scale. It is applied to what a tornado left behind, and the wind speed is inferred from that.' },
        ] },
      { text: 'Is the event a tornado?',
        options: [
          { label: 'Yes', matches: 'b', why: 'Fujita, and its successor the Enhanced Fujita scale, are specifically for tornadoes.' },
          { label: 'No, general wind', matches: 'a', why: 'Beaufort covers sustained wind of any origin and tops out at hurricane force.' },
        ] },
    ],
  },

  'moral-realism-vs-moral-relativism': {
    difference: 'They disagree about whether moral claims can be true independently of who holds them. Moral realism says at least some moral statements are made true by facts that do not depend on any culture or observer. Moral relativism says their truth is always relative to a framework, so two conflicting judgements can each be correct within their own.',
    prompt: 'Which position do your answers commit you to?',
    questions: [
      { text: 'Two cultures disagree about whether a practice is wrong. Can both be right?',
        options: [
          { label: 'No, at most one is', matches: 'a', why: 'Moral realism. You have taken moral claims to have truth values that do not vary by framework.' },
          { label: 'Yes, each within their own', matches: 'b', why: 'Moral relativism, in its standard form: truth of a moral claim is indexed to a framework.' },
        ] },
      { text: 'Could an entire society be wrong about a moral question, by its own lights and everyone else’s?',
        options: [
          { label: 'Yes', matches: 'a', why: 'This is the strongest intuition for realism: it requires a standard the society is failing to meet, which by definition is not its own.' },
          { label: 'Not coherently', matches: 'b', why: 'Consistent relativism, and the position most often pressed on this exact point.' },
        ] },
      { text: 'Is moral progress possible?',
        options: [
          { label: 'Yes, we get closer to something', matches: 'a', why: 'Progress toward a standard implies a standard to progress toward, which is a realist commitment.' },
          { label: 'Only change, not progress', matches: 'b', why: 'The relativist reading: frameworks succeed each other without any of them being nearer the truth.' },
        ] },
    ],
  },

  'foundationalism-vs-coherentism': {
    difference: 'They disagree about what stops the regress of justification: bedrock beliefs, or a web that supports itself. Foundationalism says some beliefs are basic and justified without resting on others, and everything else is built on them. Coherentism denies there are any such beliefs and says justification comes from how well the whole set of beliefs hangs together.',
    prompt: 'Which structure do your answers commit you to?',
    questions: [
      { text: 'Every belief is justified by another. Where does that stop?',
        options: [
          { label: 'At beliefs that need no further support', matches: 'a', why: 'Foundationalism. Basic beliefs terminate the regress, and the work then goes into saying which beliefs qualify.' },
          { label: 'It does not stop, it closes into a web', matches: 'b', why: 'Coherentism. The regress is answered by denying that justification is linear at all.' },
        ] },
      { text: 'Could a perfectly consistent set of beliefs still be badly justified?',
        options: [
          { label: 'Yes, consistency is not enough', matches: 'a', why: 'The standard objection to coherentism: a well-made fiction is coherent. Pressing it commits you to some contact with something outside the web.' },
          { label: 'Not if it is genuinely comprehensive', matches: 'b', why: 'The coherentist reply, which strengthens the requirement rather than abandoning it.' },
        ] },
    ],
  },

  'the-prisoners-dilemma-vs-the-stag-hunt': {
    difference: 'They differ in whether betrayal pays when the other side cooperates, which makes one a problem of incentive and the other a problem of trust. In the prisoner’s dilemma betraying pays more than cooperating whatever the other does, so the only equilibrium is mutual defection. In the stag hunt cooperating pays best if the other cooperates too, so both mutual cooperation and mutual caution are equilibria, and the problem is trust rather than incentive.',
    prompt: 'Which game are your payoffs?',
    questions: [
      { text: 'If you knew for certain the other side would cooperate, would you still rather defect?',
        options: [
          { label: 'Yes, defecting still pays more', matches: 'a', why: 'The prisoner’s dilemma. Defection dominates, so the problem survives perfect information about the other player.' },
          { label: 'No, then I would cooperate', matches: 'b', why: 'The stag hunt. Cooperation is a best reply to cooperation, so the difficulty is assurance rather than incentive.' },
        ] },
      { text: 'What is the worst outcome for you?',
        options: [
          { label: 'Cooperating while they defect', matches: 'both', why: 'True in both games, which is why they are so often confused. This question alone does not separate them; the first one does.' },
          { label: 'Both of us defecting', matches: 'neither', why: 'In neither game is mutual defection the worst cell for you. Being the lone cooperator is worse in both.' },
        ] },
      { text: 'Would a binding promise from the other side solve it?',
        options: [
          { label: 'Yes, that is all it needs', matches: 'b', why: 'The stag hunt is an assurance problem, so credible assurance resolves it.' },
          { label: 'No, they would still want to break it', matches: 'a', why: 'The prisoner’s dilemma, where the incentive to defect survives the promise, which is why enforcement rather than assurance is the usual remedy.' },
        ] },
    ],
  },

  'falsifiability-vs-the-duhem-quine-thesis': {
    difference: 'They disagree about whether a theory can ever be tested on its own, or only bundled with its auxiliary assumptions. Falsifiability treats a theory as scientific when observation could contradict it. The Duhem-Quine thesis says no hypothesis ever meets observation alone: it is tested bundled with auxiliary assumptions, so a failed prediction condemns the bundle without saying which part failed.',
    prompt: 'Which side do your answers fall on?',
    questions: [
      { text: 'A prediction fails. Has the hypothesis been refuted?',
        options: [
          { label: 'Yes, that is what a test is for', matches: 'a', why: 'The falsificationist reading, on which a failed prediction is decisive against the hypothesis.' },
          { label: 'Something in the bundle has, not necessarily the hypothesis', matches: 'b', why: 'Duhem-Quine. The test was of a conjunction, so its failure licenses only the claim that at least one conjunct is false.' },
        ] },
      { text: 'Someone saves a theory by adjusting an auxiliary assumption. Is that cheating?',
        options: [
          { label: 'Usually yes, it is an ad hoc rescue', matches: 'a', why: 'Popper’s objection to immunising stratagems, which presupposes we can tell which part should have taken the blame.' },
          { label: 'It is always available, so the question is which rescue is reasonable', matches: 'b', why: 'Duhem-Quine, which makes rescue always logically permissible and moves the real question to judgement rather than deduction.' },
        ] },
    ],
  },

  'the-bandwagon-effect-vs-social-proof': {
    difference: 'They differ in what the crowd is being used for: as evidence about the world, or as a reason in itself. Social proof is a heuristic for reading an ambiguous situation: other people’s behaviour is evidence about what is correct or safe. The bandwagon effect is adoption driven by the popularity itself, where the rate of uptake is the reason rather than any inference about quality.',
    prompt: 'Which is operating in your case?',
    questions: [
      { text: 'Is the crowd being treated as evidence about something?',
        options: [
          { label: 'Yes, they probably know something I do not', matches: 'a', why: 'Social proof, which is an inference under uncertainty and can be entirely rational when the crowd is informed.' },
          { label: 'No, it is just what everyone is doing', matches: 'b', why: 'The bandwagon effect, where popularity is the reason itself rather than a signal of anything.' },
        ] },
      { text: 'If the situation were completely unambiguous, would the crowd still matter?',
        options: [
          { label: 'No, I would just judge for myself', matches: 'a', why: 'Social proof is strongest under ambiguity and weakens as the situation becomes clear, which is a defining feature of it.' },
          { label: 'Yes, I would still want to be with the majority', matches: 'b', why: 'The bandwagon effect does not require ambiguity, because it is not doing inferential work.' },
        ] },
    ],
  },

  'the-social-contract-vs-the-general-will': {
    difference: 'One is the agreement, the other is what the agreement is supposed to track. The social contract is the device that explains how legitimate authority arises: people give up some liberty in exchange for order. The general will is Rousseau’s account of what that authority must aim at once constituted, namely the common interest of the citizens as a body rather than the sum of what they each happen to want.',
    prompt: 'Which idea are your answers about?',
    questions: [
      { text: 'Are you asking how authority becomes legitimate in the first place, or what it must do to stay so?',
        options: [
          { label: 'How it arises', matches: 'a', why: 'The social contract. It is an account of origin and consent, and it is what Hobbes, Locke and Rousseau all offer versions of.' },
          { label: 'What it must aim at', matches: 'b', why: 'The general will. It is a standard for the exercise of authority, not a story about its founding.' },
        ] },
      { text: 'Everyone votes for what they personally want, and the majority gets its way. Is that enough?',
        options: [
          { label: 'Yes, that is what consent means', matches: 'a', why: 'A contractarian reading: legitimacy flows from the agreement and the procedure that implements it.' },
          { label: 'No, that is only the sum of private wants', matches: 'b', why: 'Rousseau’s distinction exactly. The general will is not the will of all; a majority pursuing private interests can miss it entirely.' },
        ] },
      { text: 'Can a citizen be wrong about the common good while being right about what they want?',
        options: [
          { label: 'Yes, those are different questions', matches: 'b', why: 'The general will, which is why Rousseau can say a citizen may be "forced to be free" — the most contested sentence he wrote.' },
          { label: 'No, wanting it is what makes it good for them', matches: 'a', why: 'Closer to the contract tradition, where consent does the normative work rather than any independent common good.' },
        ] },
    ],
  },

  'the-pessimistic-induction-vs-scientific-realism': {
    difference: 'They draw opposite conclusions from the same history of science, one from its successes and the other from its discarded theories. Scientific realism holds that the success of a mature theory is best explained by its being approximately true about unobservable things. The pessimistic induction replies that past theories were successful and are now held to be false about exactly those things, so success cannot license that inference.',
    prompt: 'Which conclusion do your answers support?',
    questions: [
      { text: 'Phlogiston and the luminiferous ether were successful in their day and are now taken to refer to nothing. What follows?',
        options: [
          { label: 'Our best theories may go the same way', matches: 'a', why: 'The pessimistic induction, stated as Laudan put it: the historical record is a list of successful theories now judged false.' },
          { label: 'Later theories retained what made those succeed', matches: 'b', why: 'The realist reply, usually structural or selective realism: what survives theory change is the structure or the working parts, not the whole picture.' },
        ] },
      { text: 'Why does a theory make accurate novel predictions?',
        options: [
          { label: 'Because it gets something right about what is there', matches: 'b', why: 'The no-miracles argument, which is realism’s main positive case.' },
          { label: 'Empirical adequacy is enough to explain that', matches: 'a', why: 'The anti-realist line the pessimistic induction supports: predictive success needs no commitment to unobservables.' },
        ] },
    ],
  },

  'the-first-welfare-theorem-vs-the-second-welfare-theorem': {
    difference: 'They run in opposite directions between markets and outcomes. The first says any competitive equilibrium is Pareto efficient: markets get you to SOME efficient point. The second says any Pareto efficient point can be reached as a competitive equilibrium, given the right redistribution of initial endowments: markets can get you to the efficient point you CHOSE.',
    prompt: 'Which theorem does your question need?',
    questions: [
      { text: 'Are you asking whether a market outcome is efficient, or whether a chosen outcome is reachable by a market?',
        options: [
          { label: 'Whether what markets produce is efficient', matches: 'a', why: 'The first welfare theorem, which is the formal version of the invisible hand.' },
          { label: 'Whether a particular fair outcome can be reached', matches: 'b', why: 'The second welfare theorem, which is the one that separates efficiency from distribution.' },
        ] },
      { text: 'Does your argument require redistributing endowments before trade?',
        options: [
          { label: 'Yes, lump-sum transfers first', matches: 'b', why: 'The second theorem depends on exactly that, and its practical weakness is that genuinely lump-sum transfers are close to unavailable.' },
          { label: 'No, just let the market clear', matches: 'a', why: 'The first theorem needs no redistribution, and correspondingly says nothing about whether the result is fair.' },
        ] },
      { text: 'Someone says "the market outcome is efficient, so it is just". Which theorem are they misusing?',
        options: [
          { label: 'The first', matches: 'a', why: 'Correct. Pareto efficiency is compatible with any distribution, including one person holding everything, so efficiency alone establishes nothing about justice.' },
          { label: 'The second', matches: 'b', why: 'The second theorem actually cuts against that argument: it says the distribution is a separate lever, which is why it is the one invoked in favour of redistribution.' },
        ] },
    ],
  },

  'von-baers-laws-vs-the-biogenetic-law': {
    difference: 'They make different and largely incompatible claims about what embryos show. Von Baer’s laws say development runs from the general to the special: an embryo first resembles the broad group it belongs to, then acquires narrower characters. The biogenetic law claims embryos replay the ADULT forms of their ancestors, which von Baer explicitly rejected and which the evidence does not support.',
    prompt: 'Which claim is being made?',
    questions: [
      { text: 'Does the embryo resemble the ancestor’s ADULT form, or the ancestor’s EMBRYO?',
        options: [
          { label: 'The adult form', matches: 'b', why: 'The biogenetic law, Haeckel’s "ontogeny recapitulates phylogeny". This is the part that is rejected.' },
          { label: 'The embryo', matches: 'a', why: 'Von Baer, and the version modern embryology retains: shared early stages reflect shared developmental programmes, not a replay of adult ancestors.' },
        ] },
      { text: 'A human embryo has pharyngeal arches. What does that show?',
        options: [
          { label: 'It passes through a fish stage', matches: 'b', why: 'The recapitulation reading, and the one usually taught as the example. The embryo is not a fish at any point.' },
          { label: 'It shares an early vertebrate pattern', matches: 'a', why: 'Von Baer’s reading: the general character appears before the special one, which is what the structures actually indicate.' },
        ] },
    ],
  },

  'the-copernican-principle-vs-the-anthropic-principle': {
    difference: 'They pull in opposite directions on how special our position is. The Copernican principle says assume we are not privileged observers, so our vantage point is typical. The anthropic principle says our observations are necessarily filtered by the conditions required for observers to exist, so some apparent fine-tuning is selection rather than coincidence.',
    prompt: 'Which principle is doing the work?',
    questions: [
      { text: 'Is the fact being explained one that only an observer could be around to notice?',
        options: [
          { label: 'Yes, our existence depends on it', matches: 'b', why: 'The anthropic principle applies precisely where the observation is conditioned on the observer existing, which makes the sample non-random.' },
          { label: 'No, it holds regardless', matches: 'a', why: 'The Copernican default: absent a selection effect, assume the vantage point is typical.' },
        ] },
      { text: 'Is assuming we are typical a conclusion or a starting assumption?',
        options: [
          { label: 'A starting assumption, until shown otherwise', matches: 'a', why: 'The Copernican principle is methodological. It is a prior, not a finding.' },
          { label: 'It cannot be assumed where survival filtered the data', matches: 'b', why: 'The anthropic correction, which is why the two are usually stated together rather than as rivals.' },
        ] },
    ],
  },

  'the-third-law-of-thermodynamics-vs-the-nernst-heat-theorem': {
    difference: 'One is the broader statement and the other the specific claim it grew from. The Nernst heat theorem says the entropy CHANGE of a reaction between condensed phases goes to zero as temperature approaches absolute zero. The third law is the stronger and more general statement that the entropy of a perfect crystal itself approaches zero, which fixes an absolute scale rather than only constraining differences.',
    prompt: 'Which statement does your case need?',
    questions: [
      { text: 'Do you need an absolute entropy, or only a difference between two states?',
        options: [
          { label: 'An absolute value', matches: 'a', why: 'The third law, which is what makes tabulated absolute entropies possible at all.' },
          { label: 'Only the difference', matches: 'b', why: 'The Nernst theorem is sufficient: it constrains how entropy differences behave as temperature falls, without fixing the zero.' },
        ] },
      { text: 'Is your substance a perfect crystal?',
        options: [
          { label: 'No, it is a glass or a disordered solid', matches: 'b', why: 'The third law’s zero applies to a perfect crystal. Real glasses retain residual entropy at absolute zero, which is exactly where the stronger statement stops holding.' },
          { label: 'Yes, or close enough', matches: 'a', why: 'The condition the third law states, under which the entropy approaches zero.' },
        ] },
    ],
  },
};

export function comparisonSlugs() {
  return Object.keys(COMPARISONS);
}

export function comparisonFor(slug) {
  return COMPARISONS[slug] || null;
}
