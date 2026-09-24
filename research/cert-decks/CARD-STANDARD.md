# Card standard

How every card and deck is written, structured, checked and released. A deck
that does not meet it does not ship.

Draft 3, 24 September 2026. It is rebuilt on the learning-science research:
`LEARNING-SCIENCE.md` is the synthesis, and the six reports in
`learning-science/` hold the evidence. The earlier sources are
`flashcards-general/legal-design.md` §5 and `flashcards-general/tech.md`.
Every figure in those files was read at its source, and each report gives its
DOI or URL.

## Evidence labels

Every rule carries one, so nobody mistakes a habit for a finding:

| Label | Meaning |
|---|---|
| **[E]** | experimental or meta-analytic |
| **[S]** | observational or survey |
| **[R]** | review or theory |
| **[D]** | Anki manual or code |
| **[P]** | practitioner advice (Wozniak, Matuschak, Nielsen) |
| **[H]** | our own house rule |

## What we can honestly claim

This is for the public page, adapted.

**What the research supports:**
- **Retrieval beats rereading.** The effect is g = 0.33 against restudy in real
  classrooms (Yang 2021), and larger in the lab **[E]**.
- **Spacing beats cramming** **[E]**.
- **Feedback roughly doubles the benefit.** That's why every card back
  explains **[E]**.

**What it doesn't support:**
- **For adult continuing education the evidence is thin.** Yang reports 0.314,
  with a confidence interval crossing zero **[E]**.
- **Self-made cards beat premade ones, after the same reading.** In six
  experiments, students read a text, then either made their own flashcards
  or used premade ones for the same time. Two days later the self-made group
  remembered definitions better (pooled d = 0.45) and applied them somewhat
  better (d = 0.29). Paraphrasing was what helped; copying word for word did
  not (Pan et al. 2022) **[E]**.
- **Our approach answers this, but untested.** We teach before we test
  (primer cards and the deck page) and invite paraphrase ("My note"). No study
  has tested either against premade decks, and we don't claim they close
  the gap.
- **Flashcards are the knowledge layer of exam preparation, not all of it.**
  Anki use is *associated* with higher scores on knowledge-heavy medical
  exams. No study has tested flashcards for any exam we cover, and practice
  questions predict scores at least as well **[S]**.

## 1. Principles

### Teaching before testing

1. **Understand before you memorise.**
   - Every deck has a readable page, and every card links to the section it
     drills (`PageURL`).
   - In the premade-deck study, both groups read first **[E]**.
   - Wozniak's rules 1 and 2 **[P]**.
   - The Anki manual says shared decks lack "background information or
     explanations" **[D]**.
2. **Foundations first, inside the deck itself.**
   - A deck never assumes knowledge it hasn't taught. This was the failure of
     the owner's own earlier deck: it treated concepts as already understood.
   - Learners skip pages, so the page's core explanations must *also* exist as
     primer cards (§2a).
   - Pre-training on the parts before the whole: median d = 0.46 (Mayer)
     **[E/R]**.
   - Too many new, interacting terms overload novices **[R]**.
   - The checker enforces no-undefined-terms (§5).
3. **Authors can't see their own blind spots.** Experts misjudge what novices
   need, and write more abstractly **[E/R]**. So every deck gets a novice
   read-through before release (§6), and the term checker does not rely on the
   author's judgement.
4. **Let experts skip the scaffolding.**
   - Explanations help novices and can hurt experts (expertise reversal)
     **[E/R]**.
   - Primers carry the tag `kind::primer`, so an experienced learner can
     suspend them in one step.

### Making cards that work

5. **Every card requires recall of a specific answer before the reveal.**
   - No "read this" cards.
   - Recall beat recognition in the lab: cued recall g = 0.72 and free recall
     0.81, against 0.36 for recognition (Rowland 2014). Classroom data show
     recognition closer, so this is a strong lean, not an absolute **[E]**.
6. **Every card back is feedback.**
   - The answer, then a one- or two-sentence *why* (`Explanation`), then the
     source.
   - Feedback: 0.73 vs 0.39 (Rowland); 0.537 vs 0.374 (Yang).
   - Elaborated feedback beats the bare answer: 0.49 vs 0.32 (Van der Kleij).
   - On a card the learner can't yet answer, the explanation is the whole
     benefit: g = 0.03 without feedback, 0.73 with it **[E]**.
7. **One retrievable answer per card, precise and unambiguous.**
   - Wozniak rule 4, Nielsen, Matuschak **[P]**.
   - Relearning needs a clean right/wrong criterion (Rawson & Dunlosky 2011)
     **[E]**.
   - Ambiguous cards that are rarely answered correctly give no benefit
     **[E]**.
8. **Difficulty must come from effort, never from ambiguity or missing
   prerequisites.**
   - "If … the learner does not have the background knowledge … they become
     undesirable difficulties" (Bjork & Bjork 2011) **[R]**.
   - A card that keeps failing (a leech) is rewritten, not re-drilled.
   - Do **not** cite an "85% rule": its authors derived it for binary
     classification in machine learning **[E]**.
9. **Cover complete sets.**
   - If a list, framework or family is examinable, every member gets a card.
   - Practising part of a set can suppress the rest (retrieval-induced
     forgetting, g = 0.35) **[E]**.
   - Link related items on the back ("contrast with X; both belong to Y").
     Integration removes the effect: g = 0.01 for integrated text **[E]**.
10. **No sets or enumerations in one answer.**
    - At most 3 items **[H]**. Beyond that, one card per member, plus an
      optional "which one is missing?" card.
    - Wozniak rules 9 and 10 **[P]**; the atomicity evidence in rule 7.
11. **Fill-in-the-blank (cloze) only on concept-bearing words in fresh
    sentences.**
    - Delete the idea, not a random word.
    - Write the sentence new, never cut it from a source.
    - One blank per card, and no card gives away a sibling's answer.
    - Isolated single-word cloze from prose is a known cause of failed testing
      effects (Karpicke & Aue 2015) **[E]**.
    - Matuschak warns against copied passages **[P]**.
    - No controlled comparison of cloze and Q&A cards exists.
12. **Reverse cards only where the exam asks both directions.** Reversed cards
    barely transfer (d = 0.063) **[E]**, so each direction is separate
    learning.
13. **Numbers and thresholds get their own cards,** with units and conditions
    stated, and the reason on the back. This is practitioner advice only
    **[P]**; there is no evidence either way.
14. **Procedures become decision-point cards,** not "list all the steps".
    - The deck page points to worked practice for whole procedures.
    - There was no testing benefit after worked examples in 4 experiments (van
      Gog 2015), and the debate is unresolved **[E]**.
15. **Images only when the image is the content.**
    - Simplified, labelled, and ideally tested by occlusion.
    - No decorative images: they hurt learning and breed overconfidence
      (Carpenter & Olson 2012; the coherence meta-analyses) **[E]**.
    - Every image carries its licence.
16. **Mnemonics are optional back-of-card aids for cards learners keep
    failing,** never a replacement for the content. The keyword method's
    advantage reversed after 2 days (Wang & Thomas 1995) **[E]**.

### Matching the exam

17. **Every key concept gets a fact card *and* an application card.**
    - Fact-only practice did not improve higher-order test scores; mixed
      practice did best (Agarwal 2019; McDaniel 2013) **[E]**.
    - Transfer is about zero without matching answers or explanation (Pan &
      Rickard 2018) **[E]**.
18. **Where the exam uses scenarios, write scenario → concept cards,** whose
    answer is the tested concept.
    - Answer congruency adds d = 0.35 (Pan & Rickard).
    - Format matching gives 0.531 vs 0.399 (Yang) **[E]**.
    - A target of about a third application cards per deck is our starting
      point **[H]**.
19. **Concepts get example → concept classification cards,** with varied and
    ideally new examples: d = 0.74 to 1.67 (Rawson 2015) **[E]**.
20. **Confusable pairs get contrast cards,** once both concepts are known.
    - Tag them so they can be studied together.
    - Mixing helps for similar categories (g = 0.42) and hurts for word lists
      (−0.39) **[E]**.
    - So contrast cards do the work, not author-imposed shuffling.
21. **Multiple choice is optional, and only for scenario cards.**
    - Every wrong option must be plausible, and explained on the back
      (`ChoicesExplained`).
    - Unexplained lures can become false knowledge (Roediger & Marsh 2005;
      Butler & Roediger 2008) **[E]**.
    - Multiple choice is never the only card for a fact. It works about as
      well as short answer (McDermott 2014; Smith & Karpicke 2014) **[E]**.

### Keeping it current and personal

22. **Source every card.** Wozniak rule 18 **[P]**; mandatory for us.
23. **Date what can change.** A "valid as of" date, plus the exam or law
    version, on any volatile fact. Wozniak rule 19 **[P]**.
24. **Core first.** Cards are tagged `core` or `extra`, and time-poor learners
    study the core only. Wozniak rule 20 **[P]**; this also serves autonomy and
    competence **[R]**.
25. **Make it yours: paraphrase, not a blank field.**
    - On primer and concept cards, the template invites: "Write the meaning in
      your own words in My note."
    - Paraphrasing was the effective part of making cards; transcription was
      useless (Pan 2022) **[E]**.
    - It's suggested for primers only, because generation took 13–52% of
      session time in that study.
    - Whether it recovers the self-made benefit is untested.

## 2. Anatomy of a card

Three note types are used across the whole site: `Basic`, `Cloze` and
`Scenario`. The last has optional choices. Their fields are fixed at release,
because updating is "generally not possible if the note type is changed" **[D]**.
So every field that might ever be needed exists from version 1, even if empty.

| Field | Required | What it holds |
|---|---|---|
| `ID` | yes | Permanent ID, e.g. `scrum.psm1.events.sprint-length`. Never reused, never changed. |
| `Front` | yes | The prompt, the cloze sentence, or the scenario |
| `Back` | Basic, Scenario | The answer, short |
| `Choices` | Scenario, optional | Answer options, when the exam is multiple choice |
| `ChoicesExplained` | if `Choices` | Why each wrong option is wrong |
| `Explanation` | yes | One or two sentences of why, in plain words |
| `Example` | concept cards | A concrete, ideally comparative, case ("like X, but…") |
| `Contrast` | where relevant | What it is confused with, and the difference |
| `Links` | where relevant | How it relates to its set ("one of the five Scrum events") |
| `Source` | yes | Citation: title, section, publisher |
| `SourceURL` | yes | Link to the exact section |
| `SourceLicence` | yes | The content-policy tier and licence |
| `ValidAsOf` | volatile facts | ISO date, plus the exam or law version |
| `Topic` | yes | Our own topic label, shown on the front |
| `ExamRefs` | only where permitted | Outline mapping, per the content policy |
| `Priority` | yes | `core` or `extra` |
| `Kind` | yes | `primer`, `fact`, `application`, `classification` or `contrast` |
| `Introduces` | primers | The terms this card teaches for the first time (at most one new term per primer **[H]**) |
| `Uses` | yes | Every term, abbreviation, acronym and symbol the card relies on, in any field |
| `Order` | yes | The card's teaching position, written to Anki's `due` position (§2a) |
| `MyNote` | yes | Empty, for the learner. Primer and concept templates prompt for a paraphrase. |
| `PageURL` | yes | The deck page section this card drills |
| `ReportURL` | yes | A link to report an error or a card that keeps failing |

**Structure:**

- **Decks and subdecks:** the deck is named by family and exam or subject.
  Numbered subdecks per domain (`01 …`, `02 …`) are introduced in order under
  Anki's default "Deck" gather order **[D]**.
- **Tags** are hierarchical and survive import **[D]**:
  - `exam::domain::objective`, where permitted;
  - `kind::…`, `priority::…` and `valid-as-of::…`.

## 2a. Primer cards and teaching order

**A primer introduces a concept before anything tests it.** It asks the most
basic question, for example "What is a Sprint, in one sentence?". Its back
gives:
- a plain answer;
- the `Explanation` (why it matters);
- a concrete `Example`, comparative where possible.

Concrete and comparative organizers beat abstract ones **[E]**. A novice may
not answer a primer on first sight, and that's fine: a question followed by its
answer aids learning (pretesting; Pan & Carpenter 2023) **[R]**.

**The sequence:**
- Every topic opens with its primers, one per core concept, in dependency
  order.
- Then fact and classification cards.
- Then application and contrast cards, once the terms they use are known.

**Order is written into the file.**
- Anki keeps the `due` position of new cards on import, and introduces them in
  that order under default settings **[C/D]**.
- genanki defaults every card to position 0, and ties come out in no
  guaranteed order. So every note gets an explicit, unique, increasing
  position, with gaps left for future inserts.
- Note IDs do not set the order **[C]**.
- Cards made from the same note share a position.

The deck page tells learners to keep the default order settings (§8).

**Terms are tracked, not assumed.** A term counts as introduced when a primer
with a lower `Order` introduces it, either in this deck or in a prerequisite
deck named on the deck page. The page's "Start here" section lists those
prerequisites and the few terms the deck assumes.

## 3. IDs, and the rules that keep updates from wiping progress

1. **The note GUID comes from the `ID` field only.** genanki's default hashes
   all field values, so any edit would duplicate the note **[D]**.
2. **The IDs of note types, decks, fields and templates are fixed constants.**
   Merging relies on field and template IDs (Anki 2.1.67+) **[D]**.
3. **Note types never change after release.** Renaming, adding or reordering
   fields or card types breaks updates **[D/C]**. If a change is unavoidable,
   it is a new major version, announced on the deck page.
4. **CSV exports put `ID` first,** because Anki matches text imports on the
   first field **[D]**.
5. **We export without scheduling.** An optional settings preset ships with a
   unique ID, never 1 **[C]**.

## 4. Styling and accessibility

- **Type:** sans-serif, about 16–19 px, line height about 1.5, left-aligned.
  Bold, not italics, for emphasis, and no all-caps sentences. No "dyslexia
  fonts": they showed no benefit (Wery 2017; Kuster 2018) **[E]**.
- **Contrast:** at least 4.5:1 in both light and night mode, and no meaning
  carried by colour alone (WCAG 1.4.3 and 1.4.1). Night mode styles are
  `.card.nightMode` **[D]**.
- **Phones:** answers readable in seconds, images legible at phone width, no
  wide tables.
- **Portability:** no JavaScript. Cards must be readable unstyled, because
  other apps drop our CSS **[D]**.
- **Speech:** an optional text-to-speech template, and text equivalents for
  every image.
- **Placement:** source, "valid as of" and the report link sit in small type on
  the back.

## 5. The card checker (runs in the build; a failure blocks release)

**Fails a card with:**
- a missing, duplicate or changed `ID`;
- no `Source`, `SourceURL` or `SourceLicence`, a tier-D source, or a
  `SourceURL` that is not 200 at build time;
- a volatile tag without `ValidAsOf`;
- a `Back` over 25 words **[H]**, or a list answer over 3 items **[H]**;
- a cloze with more than one blank, or a cloze sentence found word for word in
  the cached source text;
- a front with no question and no cloze;
- `Choices` without `ChoicesExplained`;
- `ExamRefs` on a deck not cleared for exam mapping;
- **any term in `Uses` that no primer with a lower `Order` introduces**, in
  this deck or a named prerequisite. `Uses` is checked against every field,
  including `Back`, `Explanation` and `Example`;
- a primer with no `Explanation` and `Example`, or introducing more than one
  new term;
- a fact, application, classification or contrast card placed before its
  topic's primers;
- a missing, duplicate or non-increasing `Order`;
- a note type whose fields changed since the last release;
- an image without a licence or text equivalent.

**Fails a deck when:**
- its page, changelog entry or licence notice is missing;
- a key concept has a fact card but no application or classification card
  (key concepts are tagged `priority::core`);
- a set tagged as examinable is incompletely covered (the rule on complete
  sets, principle 9).

## 6. Making a deck

1. **Research.** Agents read the sources under the research protocol. Figures
   are confirmed in two raw fetches, and the brief is not evidence.
2. **Draft.** Agents write cards to this standard, citing the exact section.
   Agents never commit.
3. **Check.** The card checker runs.
4. **Source audit.** A second agent re-checks every card against its source.
   Any card it can't confirm is removed.
5. **Novice read-through.** Someone who does not know the subject studies the
   first 50–100 new cards in order and flags every card they couldn't follow.
   Every flag is fixed before release. This is the most direct fix for the
   failure that started this rule **[E/R]**.
6. **Expert review.** A qualified person reviews the deck. This is mandatory
   for clinical, legal and financial-rule content.
7. **Release.** Version number and changelog, then export.

After release, reports of cards that keep failing are treated as bugs, and
those cards are rewritten ("change how the information is presented" **[D]**).

## 7. Versions and changelog

| Version | Meaning |
|---|---|
| **Patch** | corrections |
| **Minor** | new cards, or facts dated to a new exam or law version |
| **Major** | a note-type change (avoid), or a new exam version |

Every release has a public changelog of cards added, changed (with the reason)
and retired. Retired cards are tagged `retired`, never deleted: a deleted card
never leaves a learner's collection anyway **[D]**.

## 8. The deck page (required sections)

The deck is half the product. The page is the other half.

1. **Start here.** A one-screen concrete map of the topic: what it is, what
   problem it solves, and one worked scenario. Then the prerequisites and the
   few terms assumed **[E]** (advance organizers, concrete beats abstract).
2. **What these cards can and cannot do.** Retention, yes. Readiness for
   scenario questions, only with practice questions. No pass-rate claims
   **[S]**.
3. **Pair with practice questions.** Links to official or free sample
   questions where they exist, and the loop "miss a question, find or add the
   card" **[S/P]**.
4. **How to import.** In Anki 23.10+:
   - leave "Import any learning progress" unticked;
   - tick "Import any deck presets" to use our settings (optional);
   - keep New card gather order = Deck and a non-random sort order, or the
     teaching order is lost;
   - keep Insertion order = Sequential;
   - enable sibling burying if the deck has multi-card notes **[D/C]**.
5. **Settings.**
   - FSRS on, desired retention about 0.90. Above that, workload rises
     steeply. Only go to 0.93–0.95 in the final stretch, and never above 0.97
     **[D]**.
   - Press **Again**, never Hard, when you forgot **[D]**.
6. **Workload planner.**
   - Card count, and the formula "new cards/day = cards ÷ (days to exam −
     buffer)".
   - Default 10–20 new a day, and expect about 10× that in daily reviews
     (20 new ≈ 200 reviews **[D]**).
   - If the load is too high, study the core subset rather than raising
     limits.
   - Example workloads are moderate, not medical-student extremes.
7. **Five-line onboarding:**
   1. Say the answer before you flip.
   2. Forgot means Again.
   3. Keep 90% retention.
   4. Write an if-then plan and a daily minimum ("After breakfast, I do my
      reviews") (d = 0.65 **[E]**).
   5. Expect it to feel harder than rereading; that is how it works
      **[E]**.
8. **Habits, honestly.** Habits take weeks to months (18–254 days in one
   study), and missing a day is fine **[E]**. No points, badges, leaderboards
   or unbroken-streak framing **[R]**.
9. **If you fall behind.** You don't have to start over **[D/C]**:
   - stop new cards;
   - cap reviews per day;
   - sort by overdueness or retrievability;
   - or use a filtered deck for overdue cards.
10. **Exam timeline.**
    - Start 4–8 weeks out where possible, and review daily.
    - Stop new cards before the exam; the cutoff is set per exam, as the
      evidence gives no exact number.
    - A final weak-card session.
    - No repeated "review ahead".
    - Practised retrieval holds up under stress (Smith 2016) **[E]**.
11. **After the exam.** Keep the deck at zero new cards and a low review cap:
    cheap insurance for the job and for recertification. Knowledge fades
    within about 2 years without use **[E]**.
12. **Changelog, sources, licence and notices** (see the content policy), and
    how the cards were made, including AI use.
13. **Report a problem.** Errors, and cards that keep failing.

## 9. Measuring our own decks

We measure learning, not satisfaction. Perceived usefulness is high even when
outcomes don't differ **[S]**. So:
- an opt-in post-exam survey (pass or fail, deck use, practice-question use),
  published with its limits, including null results;
- where feasible, short pre and post quizzes of objective items.

This would be the first evidence for these exams, and it is still
observational.

## Open questions

- British or US spelling for card text. Suggestion: British for our prose,
  official terms as the source writes them.
- The 25-word, 3-item and one-new-term-per-primer limits are starting points.
  Review them after the first family ships.
- The share of application cards (about a third) is a starting point.
- How many days before the exam to stop new cards: set per exam and test it.
