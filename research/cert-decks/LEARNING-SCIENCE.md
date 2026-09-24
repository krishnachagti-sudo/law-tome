# What the learning science says, and what we do about it

Synthesis of six research reports in `learning-science/`, researched 24 September 2026.
Every figure below was read in the primary source or meta-analysis. The
reports give the DOI or URL for each, and mark what could not be verified.

**Labels:**

| Label | Meaning |
|---|---|
| **[E]** | experimental or meta-analytic |
| **[S]** | observational or survey |
| **[R]** | review or theory |
| **[D]** | Anki documentation or code |
| **[P]** | practitioner advice |
| **[C]** | community reports |

## The short version

1. **Retrieval works, but less than the lab numbers suggest.**
   - Testing beats restudying: g = 0.50 in the lab (Rowland 2014) and 0.33 in
     real classrooms (Yang 2021) **[E]**.
   - Yang's overall effect is 0.499, falling to 0.427 after bias correction.
   - For adult continuing education it is unproven: 0.314, with a confidence
     interval crossing zero **[E]**.
   - We quote classroom-size effects, never lab maxima.
2. **A card trains the exact recall it asks for.**
   - Transfer to new questions averages d = 0.40, and after bias correction is
     about zero unless the new question shares the answer or the card
     explained it (Pan & Rickard 2018) **[E]**.
   - Reversed cards barely transfer: d = 0.063 **[E]**.
3. **Fact cards alone don't carry over to exam scenarios.**
   - Fact-only quizzing did not improve higher-order test scores; mixed fact
     and application practice did best (Agarwal 2019; McDaniel 2013) **[E]**.
4. **The back of the card is the feedback, and it's one of the best-supported
   levers.**
   - Feedback roughly doubles the effect: 0.73 vs 0.39 (Rowland); 0.537 vs
     0.374 (Yang) **[E]**.
   - Elaborated feedback beats the bare answer: 0.49 vs 0.32 (Van der Kleij
     2015) **[E]**.
   - On a card the learner can't yet answer, feedback is the difference between
     no benefit (g = 0.03) and a large one (g = 0.73) **[E]**.
5. **Premade decks lose to self-made ones, but that study taught first.**
   - In all six experiments of Pan et al. (2022), everyone read the source text
     before using flashcards.
   - Self-made cards then won on definitions (d = 0.45) and application
     (d = 0.29) **[E]**.
   - Paraphrasing was the part of card-making that helped; copying word for
     word did nothing **[E]**.
   - Editing premade cards has never been tested: "an uninvestigated middle
     ground".
6. **Novices need the parts before the whole.**
   - Pre-training on components: median d = 0.46 (Mayer) **[E/R]**.
   - Advance organizers: about 0.21 **[E]**.
   - Explanations help novices and can hurt experts (expertise reversal)
     **[E/R]**.
   - Experts misjudge what novices need (the "expert blind spot") **[E/R]**.
   - This is the owner's failure, and the evidence says an author cannot
     reliably catch it alone.
7. **Examples teach concepts.** "Which concept does this example show?" practice
   raised performance by d = 0.74 to 1.67 (Rawson 2015) **[E]**.
8. **Mixing topics helps only for confusable categories.** Overall g = 0.42, but
   it reverses for word lists (−0.39) (Brunmair & Richter 2019) **[E]**.
9. **Practising part of a set can make the rest harder to recall.** This is
   retrieval-induced forgetting, g = 0.35 (Murayama 2014) **[E]**. Decks cover
   whole sets.
10. **Multiple-choice options can plant false knowledge** unless every wrong
    option is explained (Roediger & Marsh 2005; Butler & Roediger 2008)
    **[E]**.
11. **Images only when the image is the content.** Decorative pictures hurt
    learning and breed overconfidence (Carpenter & Olson 2012) **[E]**.
12. **Mnemonics fade.** The keyword method reversed after two days (Wang &
    Thomas 1995) **[E]**.
13. **For exams, flashcards are the knowledge layer, not the whole
    preparation.**
    - Anki use is associated with 4–13 points higher on USMLE Step 1, with no
      benefit on the more applied Step 2 CK. All of it is correlational
      (Frappa 2026 review) **[S]**.
    - Practice-question volume predicted scores more consistently than
      flashcard volume **[S]**.
    - **No flashcard outcome study exists for IT, finance, agile, aviation,
      bar or NCLEX exams.**
14. **Workload is what breaks learners.**
    - 20 new cards a day means about 200 reviews a day [D].
    - The community pattern is binge, snowball, quit [C].
    - No peer-reviewed study of dropout from spaced-repetition apps was found.
15. **Learners misjudge what works.**
    - 72% believed cramming beat spacing, yet spacing won for 90% of them
      (Kornell 2009) **[E]**.
    - Only 11% of students use retrieval practice (Karpicke 2009) **[S]**.
    - Telling them helps only a little (Yan 2016) **[E]**.
16. **Habits take 18 to 254 days, and a missed day doesn't reset them**
    (Lally 2010) **[E]**. If-then plans help: d = 0.65 (Gollwitzer & Sheeran
    2006) **[E]**.
17. **Badges and leaderboards are where most reported harms of gamification
    come from** **[R]**. Show progress as information, not points.
18. **Knowledge fades after the exam.** Unused medical knowledge held for about
    1.5 to 2 years, then declined (Custers & ten Cate 2011) **[E]**.

## What Anki lets a deck author control

Established from Anki's import code, tests and manual **[C/D]**.

**Controlled by the deck file:**

| What | How |
|---|---|
| **Teaching order** | New cards keep the `due` position written in the file, and Anki introduces them in that order under default settings. Positions must be explicit and unique, because genanki defaults every card to 0 and ties come out in no guaranteed order. Note IDs do not set the order. |
| **Topic order** | Numbered subdecks, introduced in order under the default "Deck" gather order. |
| **Tags** | Survive import. |
| **Updates** | Matched by note GUID. They break if fields or card types are renamed, added or reordered after release. |
| **Deck description** | Imported. |

**Not controlled by the deck file:**

- **Presets.** A deck can carry a settings preset, but Anki applies it only if
  the learner ticks "Import any deck presets", which is unticked by default.
- **Collection-wide settings.** FSRS on or off, load balancing and FSRS
  parameters.
- **Per-deck limits.** Cleared unless the learner imports progress.

So recommended settings live on the deck page as instructions, and the
optional preset is a convenience.

## Where the evidence runs out

We say this plainly on the site:

- No experiment compares cloze with question-and-answer flashcards, and none
  tests how to write cards for numbers or thresholds.
- None tests editing or annotating premade cards, and none compares premade
  decks with and without a teaching layer, which is our core design.
- None measures flashcard outcomes for any certification we plan to cover.
- The "85% success" rule does not apply to flashcards. Its authors derived it
  for binary classification in machine learning.
- No peer-reviewed study of why people quit spaced repetition was found.

## How this changed the plan

- **The card standard, draft 3:** new card kinds (application,
  classification), the rules on explanations and complete sets, the
  multiple-choice and image rules, the stronger foundations-first rules, a
  novice read-through before release, and a corrected summary of Pan et al.
- **The deck page is now specified:** how to import, settings, a workload
  planner, onboarding, backlog recovery, exam-date and after-exam guidance,
  honest claims, and pairing with practice questions.
- **Our own evidence:** an opt-in post-exam survey. It is still observational,
  but it would be the first data for these exams.
