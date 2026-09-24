# The core memory science and what it means for deck design

Research date: 2026-09-24. Scope: retrieval practice (the testing effect), spacing and lag, successive relearning, interleaving, feedback, desirable difficulties, retrieval-induced forgetting, transfer, complex materials, and higher-order versus fact retrieval.

## Evidence rules used in this report

- Every number below was read in raw text extracted with curl plus pdftotext or a JSON API during this task. Raw files are in `scratchpad/learning/raw-memory/`, and each claim names its file.
- Labels:
  - **[E]** means an experimental study or meta-analysis.
  - **[R]** means a review, theory or commentary.
  - **[P]** means practitioner or tool documentation.
- Where a number came only from a secondary source, the claim says so. "Not verified" means I did not read it in a primary text.
- Abstracts came from Europe PMC (`/rest/search?resultType=core`), OpenAlex (`abstract_inverted_index`) or Crossref, which also confirmed the metadata. Full texts came from author or institutional PDFs, or from PDFs mirrored on gwern.net where the publisher blocked access. The mirrored PDFs are publisher PDFs, and their headers show the journal, volume and DOI.

---

## 1. Retrieval practice (the testing effect)

### 1.1 Rowland (2014), lab meta-analysis of testing versus restudy
Psychological Bulletin. DOI [10.1037/a0037559](https://doi.org/10.1037/a0037559). Raw files: `rowland_full.txt` (full PDF) and `rowland.txt` (abstract).

- **[E] Overall effect.** The analysis pooled 159 effect sizes from 61 studies reported from 1975 to 2013. Testing beat restudy with a random-effects g = 0.50 (CI [0.42, 0.58]). Heterogeneity was high (I² = 84.35). In a "high-exposure" subset the effect was g = 0.66.
- **[E] Initial test type.** Cued recall gave g = 0.61, free recall g = 0.29 and recognition g = 0.29 in the full set. Rowland notes that cued recall more often came with feedback. In the high-exposure set, cued recall (0.72) and free recall (0.81) were both significantly larger than recognition (0.36).
- **[E] Feedback.** Studies with feedback gave g = 0.73 and studies without gave g = 0.39.
- **[E] Feedback timing.** Delayed feedback gave g = 1.38 (k = 6) and immediate feedback g = 0.66 (k = 46). Rowland cautions that k is small and that feedback delay is confounded with retention interval.
- **[E] Retrieval success without feedback.** With no feedback, initial accuracy of 50% or less gave no reliable testing effect (g = 0.03, CI [−0.21, 0.27]). Accuracy of 51–75% gave g = 0.29, and accuracy above 75% gave g = 0.56.
- **[E] Retention interval.** Intervals of 1 day or more gave g = 0.69, and intervals under 1 day gave g = 0.41.
- **[E] Format match.** Whether the initial and final test formats matched made no reliable difference in the lab data.
- **[E] Publication bias.** Published studies gave g = 0.58 and unpublished ones g = 0.25. Rowland says to interpret this cautiously.

### 1.2 Adesope, Trevisan & Sundararajan (2017), meta-analysis of practice testing
Review of Educational Research 87, 659–701. DOI [10.3102/0034654316689306](https://doi.org/10.3102/0034654316689306). Raw files: `gw_2017-adesope.txt` (publisher PDF via gwern.net mirror). Also confirmed in `rp_metaguide.txt`, a RetrievalPractice.org guide co-written by author Sundararajan that reproduces the table, and in Yang et al. 2021, which cites the same numbers.

- **[E] Scale.** The analysis covered 118 articles, 272 independent effect sizes and 15,427 participants. The random-effects g was 0.70 and the fixed-effect g was 0.61.
- **[E] Comparison condition.** Against restudying, g = 0.51 (k = 195). Against filler or no activity, g = 0.93.
- **[E] Practice-test format.** Multiple-choice gave g = 0.70, short answer g = 0.48 and mixed formats g = 0.80. Matching practice and final formats gave g = 0.63, and mismatched formats g = 0.53.
- **[E] Number of tests.** A single practice test gave g = 0.70 and two or more gave g = 0.51. This conflicts with Yang et al. (2021); see §1.3.
- **[E] Feedback.** Feedback did **not** moderate the effect: g = 0.63 with feedback (k = 119) and 0.60 without (k = 153).
- **[E] Retention gap.** A gap under 1 day gave g = 0.56, and a gap of 1–6 days gave g = 0.82.
- **[E] Setting.** Classroom studies gave g = 0.67 (k = 30) and lab studies g = 0.62 (k = 223).
- **[R] Caveat.** A commenter on a blog summary (`adesope_blog.txt`) criticised the paper's use of fail-safe N as a publication-bias test. This is practitioner commentary and only a flag.

### 1.3 Yang, Luo, Vadillo, Yu & Shanks (2021), classroom meta-analysis
Psychological Bulletin. DOI [10.1037/bul0000309](https://doi.org/10.1037/bul0000309). Raw files: `yang2021_full.txt` (full PDF) and `yang2021.txt` (Europe PMC abstract).

- **[E] Scale and overall effect.** The review pooled 222 independent studies and 48,478 students. The multilevel random-effects g was 0.499 [0.442, 0.557]. The median was 0.446. After a bootstrapped 3PSM correction for bias, the effect was g = 0.427 [0.395, 0.458].
- **[E] Comparison condition.**
  - Against no or filler activity: 0.610.
  - Against restudying: 0.330.
  - Against other elaborative strategies: 0.095.
- **[E] Quiz format.** The effect held across formats: matching 0.913, fill-in-the-blank 0.773, short answer 0.638, multiple choice 0.567, cued recall 0.316 and free recall 0.238. In classrooms, recognition-type quizzes (0.518) equalled recall-type quizzes (0.520). This departs from Rowland's lab data.
- **[E] Format consistency.** A quiz format matching the exam gave 0.531, and a mismatched format gave 0.399.
- **[E] Rephrasing and untested material.** Rephrased questions gave g = 0.558. Untested material from the same course gave g = 0.321, and tested material gave 0.512.
- **[E] Corrective feedback.** Feedback gave g = 0.537 and no feedback g = 0.374, a significant difference. This agrees with Rowland rather than Adesope.
- **[E] Repetition.** The effect grew with the number of times an item was quizzed:
  - once: 0.444
  - twice: 0.601
  - three or more times: 0.642
  - unlimited attempts: 0.762
  - The meta-regression slope was β = 0.083 per repetition.
- **[E] Knowledge type.** Facts gave 0.524, concepts 0.644 and problem-solving 0.453.
- **[E] Treatment duration.** The effect rose with duration: single class 0.385, less than a semester 0.521, one semester 0.547 and longer than a semester 0.624.
- **[E] Stakes and learner level.** High- and low-stakes quizzes did not differ. Continuing education gave g = 0.314 with a CI crossing zero (p = .119), which is the adult-learner population closest to certification candidates. The authors say no firm conclusion can be drawn there.

**What this means for deck design.** Retrieval beats rereading by roughly g ≈ 0.3–0.5 in real classrooms, and it is larger in the lab. It is larger with feedback, with more repetitions of each item, with delays of a day or more, and when the practice format resembles the exam format. A deck author controls **format, wording and feedback content**. Repetition count and delay belong to the scheduler.

---

## 2. Spacing and lag

- **[E] Cepeda, Pashler, Vul, Wixted & Rohrer (2006), meta-analysis.** Psychological Bulletin. DOI [10.1037/0033-2909.132.3.354](https://doi.org/10.1037/0033-2909.132.3.354). Raw file: `cepeda.txt` (abstract).
  - The analysis covered 839 assessments of distributed practice in 317 experiments from 184 articles.
  - The inter-study interval (ISI) that maximised retention **increased as the retention interval increased**.
  - Summary numbers come via Dunlosky et al. 2013 (`gw_2013-dunlosky.txt`). That review reports Cepeda et al. (2006) as covering "254 studies involving more than 14,000 participants", with 47% recall after spaced study versus 37% after massed study. It also quotes Cepeda: "every study examined here with a retention interval longer than 1 month demonstrated a benefit from distribution of learning across weeks or months." The primary full text was not accessed (the eScholarship PDF was blocked), so these figures are verified at secondary level only.
- **[E] Cepeda, Vul, Rohrer, Wixted & Pashler (2008), "temporal ridgeline".** Psychological Science 19(11). DOI [10.1111/j.1467-9280.2008.02209.x](https://doi.org/10.1111/j.1467-9280.2008.02209.x). Raw files: `cepeda2008_full.txt` (Wixted-lab PDF) and `cepeda.txt` (abstract).
  - **Design.** There were 1,354 participants and 26 gap-by-retention-interval conditions. Participants learned 32 trivia facts to one perfect recall, reviewed after a gap, and were tested after 7, 35, 70 or 350 days.
  - **Optimal gap as a share of retention interval.** The optimal gap was about 20–40% of a 1-week retention interval but only about 5–10% of a 1-year interval. Interpolated optimal recall gaps were about 3, 8, 12 and 27 days, which is 43%, 23%, 17% and 8% of the retention interval.
  - **Size of the gain.** The optimal gap raised final recall by 64% over a zero-day gap (d = 1.1). For the 350-day interval, the gain was 77%.
  - **Asymmetric cost.** "Costs to using a gap that is longer than the optimal value... are much smaller than the costs of using too short a gap."
  - Dunlosky et al. 2013 summarise this as a lag of about 10–20% of the desired retention interval.
- **[E] Cepeda et al. (2009).** Experimental Psychology. DOI [10.1027/1618-3169.56.4.236](https://doi.org/10.1027/1618-3169.56.4.236). Raw file: `cepeda.txt`. An optimal gap "improved final recall by up to 150%", and the gap effects were nonmonotonic.
- **[E] Karpicke & Bauernschmidt (2011).** JEP:LMC. DOI [10.1037/a0023436](https://doi.org/10.1037/a0023436). Raw file: `spacing_extra.txt`. Long absolute spacing between 3 repeated tests gave "a 200% improvement" over unspaced retrieval. The **relative** schedule (expanding, equal or contracting) made no discernible difference.
- **[E] Latimier, Peyre & Ramus, meta-analysis of spaced retrieval.** Preprint DOI [10.31234/osf.io/kzy7u](https://doi.org/10.31234/osf.io/kzy7u); published in Educational Psychology Review, DOI [10.1007/s10648-020-09572-8](https://doi.org/10.1007/s10648-020-09572-8). Raw file: `latimier_full.txt` (OSF preprint).
  - The analysis covered 29 studies.
  - Spaced retrieval beat massed retrieval with g = 0.74.
  - Expanding and uniform schedules did not differ (g = 0.032). Expanding schedules gained ground as the number of tests per item grew.
  - Numbers come from the preprint abstract. The published version's numbers were not verified.
- **[E] Kornell (2009), flashcards.** Applied Cognitive Psychology. DOI [10.1002/acp.1537](https://doi.org/10.1002/acp.1537). Raw file: `misc_kornell.txt` (OpenAlex abstract).
  - One large stack (spaced) beat four small stacks (massed).
  - Spacing beat massing for 90% of participants, yet 72% believed massing had worked better.

**What this means for deck design.** Spacing is a **scheduler** property, and the author mostly cannot control it. The author can avoid designs that defeat it:
- near-duplicate cards that re-expose the same answer minutes apart
- instructions to study in small sub-decks
- "cram" presets

Because the optimal gap scales with the time until the exam, a deck's recommended settings should key on the exam date. Too short a gap is costlier than too long a gap. Expanding versus uniform intervals matters little, while total absolute spacing matters a lot.

---

## 3. Successive relearning

- **[E] Rawson & Dunlosky (2011).** JEP:General. DOI [10.1037/a0023956](https://doi.org/10.1037/a0023956). Raw file: `relearning.txt`.
  - 533 students learned concepts by retrieval practice with restudy, first to 1–4 correct recalls and then in 1–5 relearning sessions. Retention was tested 1–4 months later.
  - Initial criterion and relearning were subadditive: the benefit of a higher initial criterion faded as relearning increased.
  - The authors' prescription: recall to "an initial criterion of 3 correct recalls and then to relearn them 3 times at widely spaced intervals."
- **[E] Rawson, Dunlosky & Sciartelli (2013).** Educational Psychology Review. DOI [10.1007/s10648-013-9240-4](https://doi.org/10.1007/s10648-013-9240-4). The abstract was elided in the APIs, so these figures come via the authors' later guide (`sr_guide_dunlosky.txt`, Dunlosky et al., APA Div. 2 e-book):
  - Successive relearning raised course-exam performance by "over 10%" compared with the baseline control.
  - The exam questions asked students to apply definitions, not recall them, so this is near transfer.
  - On a test 24 days after the exam, students recalled over 60% of the relearned concepts versus under 20% for concepts they studied on their own.
  - Status: [R]-level verification of an [E] result.
- **[E] Rawson, Vaughn, Walsh & Dunlosky (2018).** JEP:Applied. DOI [10.1037/xap0000146](https://doi.org/10.1037/xap0000146). Raw file: `relearning.txt`.
  - Relearning beat single-session learning by ds = 1.52 to 4.19 ("relearning potency").
  - Effects of the initial lag were large before relearning (ds = 1.07–1.87) and small after it (ds = −.20 to .38), which the authors call "relearning override".
- **[E] Vaughn, Dunlosky & Rawson (2016).** Memory & Cognition. DOI [10.3758/s13421-016-0606-y](https://doi.org/10.3758/s13421-016-0606-y). The advantage of a higher initial criterion "do[es] not persist across relearning sessions".
- **[E] Rawson & Dunlosky (2013), JEP:General.** DOI [10.1037/a0030498](https://doi.org/10.1037/a0030498). Raw file: `relearning.txt`. 567 students took part. Relearning "attenuates the benefits and costs of spacing".
- **[E] Higham, Zengel, Bartlett & Hadwin (2022).** J. Educ. Psych. DOI [10.1037/edu0000693](https://doi.org/10.1037/edu0000693). Raw file: `relearning_oa.txt`.
  - This was an introductory psychology class with fill-in-the-blank questions and corrective feedback, three sessions 2 days apart, and exposure time matched against restudy.
  - End-of-semester recall was better after relearning. Students also reported better metacognition and less anxiety.
- **[R] Guide by Dunlosky et al. (`sr_guide_dunlosky.txt`).**
  - A probability problem-solving study (Rawson et al., 2020) showed only a small advantage for relearning (d = .28), with about 50% final performance. The authors say "a different kind of practice may be needed" for mastery of that kind of skill.
  - In the eighth-grade study (Rawson et al., 2021), three relearning sessions produced nearly 60% recall one month later.

**What this means for deck design.** An SRS scheduler (a spaced-repetition system such as Anki) is essentially automated successive relearning: a card is recalled to criterion and then relearned in later spaced sessions. The evidence favours:
- more spaced sessions over over-learning in session one
- letting failed cards come back until they are recalled correctly, which Anki's relearning steps do

The author controls card atomicity, so that "correct recall" is a clean criterion, and the recommended presets. Relearning's benefit is well supported for definitions and facts and weaker for procedural problem-solving.

---

## 4. Interleaving

- **[E] Brunmair & Richter (2019), meta-analysis.** Psychological Bulletin. DOI [10.1037/bul0000209](https://doi.org/10.1037/bul0000209). Raw file: `interleaving.txt`.
  - The analysis covered 59 studies, 238 effect sizes and 158 samples, with an overall g = 0.42.
  - By material: paintings g = 0.67, maths g = 0.34, expository texts and tastes "ambiguous" (non-significant), and **words g = −0.39, a blocking advantage**.
  - Interleaving helped more when categories were **more similar to each other**, when exemplars were **less similar within a category**, and when the material was more complex.
  - The authors advise caution "especially for expository texts and words".
- **[E] Kornell & Bjork (2008).** Psychological Science. Raw file: `gw_2008-kornell.txt`. For learning painters' styles, interleaving beat massing, yet participants rated massing as more effective even after their own results showed the opposite.
- **[E] Carvalho & Goldstone (2014, 2015).** Memory & Cognition DOI [10.3758/s13421-013-0371-0](https://doi.org/10.3758/s13421-013-0371-0), Psychonomic Bulletin & Review DOI [10.3758/s13423-014-0676-4](https://doi.org/10.3758/s13423-014-0676-4) and Frontiers DOI [10.3389/fpsyg.2014.00936](https://doi.org/10.3389/fpsyg.2014.00936). Raw file: `interleaving2.txt`.
  - Interleaving helps categories with high similarity. Blocking helps categories with low similarity.
  - The 2014 Frontiers study suggests the benefit comes from cross-category comparison, not from temporal spacing.
  - Active (classify-then-feedback) study favoured interleaving, and passive study favoured blocking.
- **[E] Rohrer & Taylor (2007).** Instructional Science. DOI [10.1007/s11251-007-9015-8](https://doi.org/10.1007/s11251-007-9015-8). Raw file: `gw_2007-rohrer.txt`. Mixed maths practice was "vastly superior" to blocked practice on a test one week later.
- **[E] Rohrer, Dedrick, Hartwig & Cheung (2019, online-first; final pagination not verified), preregistered cluster RCT.** J. Educ. Psych. DOI [10.1037/edu0000367](https://doi.org/10.1037/edu0000367). Raw file: `gw_2019-rohrer.txt`.
  - 54 seventh-grade classes took part. On an unannounced test one month later, interleaved classes scored 61% versus 38% for blocked classes (d = 0.83).
  - The authors note that "interleaved practice guarantees spaced practice", so the two effects are confounded in practice.
- **[R] Dunlosky et al. (2013).** Raw file: `gw_2013-dunlosky.txt`. The review rated interleaving as of "moderate utility". The literature was then "small, but it contains enough null effects to raise concern".

**What this means for deck design.**
- In a shuffled SRS review queue, interleaving across topics happens anyway.
- The author-controllable lever is **discrimination cards**. These are cards that present an item from a set of confusable categories and require choosing among them, for example "which of these two similar controls or statutes applies here?" This is where the meta-analytic benefit concentrates.
- Do not rely on interleaving for word or vocabulary lists or expository prose. There the evidence is null or favours blocking.
- For new-card introduction, keep a family of confusable concepts introduced close together, and write explicit contrast cards. This follows Carvalho & Goldstone's active-comparison account.

---

## 5. Feedback, including timing

- **[E] Pashler, Cepeda, Wixted & Rohrer (2005).** JEP:LMC. DOI [10.1037/0278-7393.31.1.3](https://doi.org/10.1037/0278-7393.31.1.3). Raw file: `feedback2.txt`.
  - 258 participants learned Luganda–English pairs.
  - Giving the correct answer after an error raised retention one week later by 494%.
  - Feedback after **correct** responses "made little difference".
- **[E] Butler, Karpicke & Roediger (2008).** JEP:LMC. DOI [10.1037/0278-7393.34.4.918](https://doi.org/10.1037/0278-7393.34.4.918). Raw file: `feedback.txt`. Feedback "doubled the retention of correct low-confidence responses". This qualifies Pashler: feedback on correct answers matters when the learner was unsure.
- **[E] Butler, Karpicke & Roediger (2007).** JEP:Applied. DOI [10.1037/1076-898x.13.4.273](https://doi.org/10.1037/1076-898x.13.4.273). Raw file: `feedback.txt`.
  - Delayed feedback on multiple-choice tests beat immediate feedback on a delayed cued-recall test.
  - The authors attribute the benefit to spaced re-presentation.
  - Answer-until-correct feedback equalled standard feedback.
- **[E] Butler & Roediger (2008).** Memory & Cognition. DOI [10.3758/MC.36.3.604](https://doi.org/10.3758/MC.36.3.604). Raw file: `gw_2008-butler.txt`. Multiple-choice testing can teach lures (false knowledge). Immediate or delayed feedback raised correct responses and **reduced lure intrusions**.
- **[E] Kang, McDermott & Roediger (2007).** Eur. J. Cog. Psych. Raw file: `gw_2007-kang.txt`.
  - Without feedback, a multiple-choice quiz beat a short-answer quiz on the final test 3 days later.
  - **With** feedback, the short-answer quiz performed best.
- **[E] Meta-analytic picture.**
  - Rowland: 0.73 with feedback versus 0.39 without.
  - Yang: 0.537 versus 0.374.
  - Adesope: no difference (0.63 versus 0.60).
  - Rowland's delayed-versus-immediate contrast (1.38 versus 0.66) rests on k = 6 and is confounded.
- **[E] Pan & Rickard (2018).** See §8. "Elaborated retrieval practice", which includes explanatory feedback, raised transfer.

**What this means for deck design.** In a flashcard the back of the card *is* the feedback, and it is fully under the author's control. It should:
- show the correct answer unambiguously
- where the concept is transferable, add a one-line explanation of *why*, which is elaborative feedback
- for any multiple-choice-style card, say explicitly why each lure is wrong, to undo lure learning

Feedback timing within a card is immediate by design. The scheduler's next review works as delayed re-exposure, so there is no reason to engineer delays.

---

## 6. Desirable difficulties

- **[R] Bjork (1994).** "Memory and metamemory considerations in the training of human beings", in Metcalfe & Shimamura (Eds.), *Metacognition*, pp. 185–205. Raw file: `gw_1994-bjork.txt`.
  - "Manipulations that speed the rate of acquisition during training can fail to support long-term posttraining performance."
  - Instructors are pushed toward conditions that make "the trainee's life easier".
  - Learners gain "illusions of competence".
- **[R] Bjork, Dunlosky & Kornell (2013).** Annual Review of Psychology. DOI [10.1146/annurev-psych-113011-143823](https://doi.org/10.1146/annurev-psych-113011-143823). Raw file: `gw_2013-bjork.txt`. The review lists spacing, interleaving, generating answers, testing oneself and varying conditions as desirable difficulties. They "impair performance—and, hence, apparent learning—during acquisition, but enhance long-term learning."
- **[R] Bjork & Bjork (2011).** "Making things hard on yourself, but in a good way". Raw file: `bjork2011.txt` (Bjork-lab PDF). "Many difficulties are undesirable... If, however, the learner does not have the background knowledge or skills to respond to them successfully, they become undesirable difficulties."
- **[E] Converging evidence on why difficulty must stay answerable.** Rowland found no testing effect without feedback when initial accuracy was 50% or less (§1.1). Pan & Rickard found transfer rises with initial accuracy (§8).

**What this means for deck design.** Difficulty must come from **retrieval effort**, not from ambiguity. Cards should be hard because the learner has to generate the answer. They should not be hard because:
- the prompt is vague
- several answers would be defensible
- the needed background was never taught

A card with a high failure rate that never converges is an undesirable difficulty and needs rewriting (see "leech" handling in §10).

---

## 7. Retrieval-induced forgetting (RIF)

- **[E] Anderson, Bjork & Bjork (1994).** JEP:LMC. DOI [10.1037/0278-7393.20.5.1063](https://doi.org/10.1037/0278-7393.20.5.1063). Raw file: `rif4.txt`. Practising some members of a category (for example "Fruit Or___") impaired later recall of **unpractised members of the same category**. The effect lasted 20 minutes or more.
- **[E] Murayama, Miyatsu, Buchli & Storm (2014), meta-analysis.** Psychological Bulletin. DOI [10.1037/a0037505](https://doi.org/10.1037/a0037505). Raw file: `murayama2014_full.txt` (author PDF, Reading repository).
  - Across 512 samples, g = 0.35 [0.32, 0.38].
  - The effect was smaller when output interference was controlled (0.22 versus 0.50).
  - **With text materials and output interference controlled, g = 0.08 (non-significant).** Low-integration texts gave g = 0.25 and high-integration texts g = 0.01.
  - Feedback did not strengthen RIF (g = 0.29, k = 43).
- **[E] Chan, McDermott & Roediger (2006).** JEP:General. DOI [10.1037/0096-3445.135.4.553](https://doi.org/10.1037/0096-3445.135.4.553). Raw file: `rif2.txt`. With prose, testing *enhanced* 24-hour recall of related untested material ("retrieval-induced facilitation"), and this "can be modulated by conscious strategies". Chan (2009, JML, DOI [10.1016/j.jml.2009.04.004](https://doi.org/10.1016/j.jml.2009.04.004)) is summarised in Murayama et al.: facilitation arises when text is integrated, and forgetting arises when integration is disrupted. I did not read Chan's abstract.
- **[E] Little & Bjork (2015).** Memory & Cognition. DOI [10.3758/s13421-014-0452-8](https://doi.org/10.3758/s13421-014-0452-8). Raw file: `rif3.txt`. Multiple-choice questions with **competitive** alternatives improved later recall of the information behind the wrong alternatives. Non-competitive alternatives did not.
- **[E] Yang et al. (2021).** In classrooms, quizzing *helped* untested material from the same course (g = 0.321). Pan & Rickard found no reliable transfer to untested material seen during study (d = 0.16, n.s.) unless retrieval practice was elaborated.

**What this means for deck design.** RIF is real in list paradigms but near zero for integrated prose. The risk is highest when a deck tests only *some* members of a set of related items that share a cue, for example 3 of 7 exam domains or 4 of 9 principles. Two rules follow:
- Give every exam-relevant member of a set its own card, rather than sampling.
- Connect items to one another with integrative context on the back, so that retrieval facilitates rather than inhibits.

---

## 8. Transfer of retrieval practice to new questions

- **[E] Pan & Rickard (2018), meta-analysis.** Psychological Bulletin 144(7), 710–756. DOI [10.1037/bul0000151](https://doi.org/10.1037/bul0000151). Raw files: `pan2018_full.txt` (author PDF, sc-pan.github.io) and `pan2018.txt` (abstract).
  - **Scale and overall effect.** The analysis covered 192 transfer effect sizes, 122 experiments, 67 articles and N = 10,382. Overall transfer was d = 0.40 [0.31, 0.50].
  - **Where transfer is strongest.** Across test formats, to application and inference questions, to medical diagnosis problems, and to mediator and related cues.
  - **Where transfer is weakest.** To rearranged stimulus–response items, to untested material, and to worked-example problems.
  - **Response congruency.** When the final question has the **same correct answer** as the practice question, the effect rose by d = 0.35. Elaborated retrieval practice (broad encoding or elaborative feedback) added d = 0.22. With both present, transfer was d = 0.78, and with neither it was d = 0.21.
  - **Publication-bias correction.** After PEESE correction the intercept was "often indicating no positive transfer when none of the aforementioned moderators are present".
  - **Stimulus–response rearrangement.** This means swapping cue and answer, as in term→definition trained and definition→term tested. Overall d = 0.22 (p = .066). For materials other than paired associates it was d = 0.063, which is negligible. For paired associates it was large (about 0.72).
  - **Initial accuracy.** Transfer rose with initial test accuracy.
  - **Authors' four principles.** Transfer is likeliest when:
    1. the answers are the same
    2. practice "involve[s] discriminating between different concepts, constructing an explanation, or recalling a specific concept using several questions that address different levels of knowledge"
    3. elaborative feedback or restudy follows
    4. initial accuracy is higher
  - The authors caution that the data are mostly from the lab.
- **[E] Rickard & Pan (2020).** Memory & Cognition. DOI [10.3758/s13421-020-01048-y](https://doi.org/10.3758/s13421-020-01048-y). Raw file: `pan2018.txt`. Transfer to a rearranged item fails when the training test presents **two or more independent cues** and the final answer differs.
- **[E] Pan, Hutter, D'Andrea, Unwalla & Rickard (2019 preprint).** DOI [10.31234/osf.io/5xs3d](https://doi.org/10.31234/osf.io/5xs3d). Raw file: `pan2018.txt`.
  - For biology process concepts, fill-in-the-blank practice with feedback "improved learning but not transfer".
  - Transfer appeared only with "retrieval-verification-scoring", which combines difficult fill-in-the-blank questions with extensive feedback processing.

**What this means for deck design.** This is the single most important constraint for exam decks. **A card mostly trains the exact retrieval it asks for.** Three consequences follow:
- If the exam asks "given this scenario, which concept?", then a card asking "define concept X" will transfer poorly. The deck needs cards whose *answer* is the concept and whose *prompt* is a scenario, which is what response congruency means.
- Reversed cards are separate learning, not a free bonus. Include them only where the exam asks in both directions.
- Put explanations on the back of the card, and include several questions per important concept at different levels.

---

## 9. Complex materials and the van Gog & Sweller debate

- **[R] van Gog & Sweller (2015).** Educational Psychology Review 27, 247–264. DOI [10.1007/s10648-015-9310-x](https://doi.org/10.1007/s10648-015-9310-x). Raw file: `vangog.txt` (OpenAlex abstract). The testing effect "decreases or even disappears" as element interactivity (complexity) increases, and "may even disappear when the complexity of learning material is very high".
- **[E] van Gog, Kester, Dirkx, Hoogerheide, Boerboom & Verkoeijen (2015).** EPR. DOI [10.1007/s10648-015-9297-3](https://doi.org/10.1007/s10648-015-9297-3). Raw file: `vangog_special.txt`. In four experiments (n = 120, 124, 129 and 75), testing after worked-example study did **not** beat restudying for delayed problem solving.
- **[R] Karpicke & Aue (2015), reply.** EPR 27, 317–326. DOI [10.1007/s10648-015-9309-3](https://doi.org/10.1007/s10648-015-9309-3). Raw file: `karpicke_aue2015.txt` (Purdue lab PDF).
  - "Element interactivity" is not defined measurably.
  - None of the worked-example experiments manipulated it.
  - Studies showing effects with complex materials were omitted.
  - The null results "involved retrieval of isolated words in individual sentences or required immediate, massed retrieval practice", so they failed "because of the retrieval tasks, not because of the complexity".
  - The worked-example data still show "a small positive effect".
- **[E] Meta-analytic context.**
  - Yang et al. found problem-solving g = 0.453 in classrooms.
  - Pan & Rickard found the weakest transfer for worked-example problems.
  - Relearning helped probability problem-solving only slightly (d = .28, §3).
- **Status.** This is an unresolved debate. Both sides agree that retrieval of *isolated words out of sentences* and *immediate massed* retrieval are weak.

**What this means for deck design.**
- Flashcards are a strong tool for the declarative layer of an exam: terms, rules, thresholds, distinctions and mappings from scenario to concept.
- They are a weak tool for multi-step procedures such as calculations and workflows.
- For procedures, cards should target discrete decision points ("which formula applies when…", "what is the next step after…") and point learners to worked problems for full solutions.
- Avoid single-word cloze deletions that pull a word out of a sentence, which is the retrieval task Karpicke & Aue call weak.

---

## 10. Higher-order versus fact retrieval

- **[E] Agarwal (2019).** J. Educ. Psych. 111, 189–209. DOI [10.1037/edu0000282](https://doi.org/10.1037/edu0000282). Raw file: `agarwal2019_full.txt` (author PDF).
  - **Experiment 1.** College students, delayed test after 2 days.
    - Fact quizzes raised the final fact score to 78%, versus 54% for studying once or twice (d ≈ 1.2).
    - Higher-order quizzes raised the final higher-order score to 72%, versus 44–49% (d = 1.39 and 1.12).
    - **Fact quizzes did not help higher-order test performance (46%). Higher-order quizzes did not help fact test performance (53%).**
    - Rereading did not help.
  - **Experiment 3.** 142 sixth-grade students, world history. Mixed quizzes (fact plus higher-order) did best: 91% on the fact test and 82% on the higher-order test, versus 75% for higher-order-only quizzes (p = .078 corrected) and 56% for no quiz.
  - **Caveats.** All quizzes were multiple choice. The author suggests students might have transferred facts with explicit prompts. Experiment 2's final tests had low reliability (α = .462 and .254).
- This converges with Pan & Rickard's response-congruency and "different levels of knowledge" principle, and with Yang's format-consistency moderator.

**What this means for deck design.** Build **both** kinds of card for each key concept:
- fact cards (definition, threshold, list member)
- application cards (scenario → concept or decision; "which is the best/first action")

A deck of only definitions will under-prepare candidates for scenario-style certification items.

---

## 11. Practitioner and tool constraints [P]

- **[P] Wozniak, "Twenty rules of formulating knowledge"** (1999, SuperMemo). Raw file: `wozniak20.txt`. The rules include:
  - "Do not learn if you do not understand"
  - "Learn before you memorize"
  - "Stick to the minimum information principle"
  - "Avoid sets", "Avoid enumerations"
  - "Combat interference"
  - "Redundancy does not contradict minimum information principle"
  - "Provide sources"
  - These are practitioner heuristics, not experiments. The experimental support for atomicity is indirect: criterion-based relearning needs a clean pass/fail per card.
- **[P] Anki manual, deck options** ([docs.ankiweb.net/deck-options.html](https://docs.ankiweb.net/deck-options.html)). Raw file: `anki_deckoptions.txt`.
  - FSRS "desired retention" defaults to 90%. "Above 90% the workload increases very quickly, and above 97% the workload can be overwhelming."
  - Pressing "Hard" on a forgotten card makes intervals "unreasonably high".
  - New-card gather and sort orders can be random or ordered.
  - "Bury siblings" delays cards from the same note to the next day.
  - Leech handling is configurable.
- **[E] Kornell & Bjork (2008), dropping flashcards.** Memory. DOI [10.1080/09658210701763899](https://doi.org/10.1080/09658210701763899). Raw file: `misc_kornell.txt`. Letting learners drop cards they thought they knew had "small but consistently negative effects".
- **[E] Karpicke & Roediger (2008).** Science. DOI [10.1126/science.1152408](https://doi.org/10.1126/science.1152408). Raw file: `karpicke2008.txt`. After an item was recalled once, further studying had no effect on delayed recall, but further *testing* had a large positive effect. Students' predictions of their performance were uncorrelated with actual performance.

### What a deck author can and cannot control

| Lever | Author controls? | Evidence |
|---|---|---|
| Prompt wording, answer congruency with exam items | **Yes** | Pan & Rickard 2018; Yang 2021 format consistency; Agarwal 2019 |
| Recall versus recognition format | **Yes** (type-in or recall, not multiple choice) | Rowland 2014 lab; mixed results in classrooms (Yang 2021, Adesope 2017) |
| Content of feedback on the back of the card | **Yes** | Rowland, Yang, Pashler 2005, Butler 2008, Pan & Rickard |
| Card atomicity and ambiguity (so the difficulty is desirable) | **Yes** | Bjork & Bjork 2011; Rowland on retrieval success |
| Coverage of whole sets (avoiding RIF) | **Yes** | Anderson et al. 1994; Murayama 2014 |
| Discrimination and contrast cards | **Yes** | Brunmair & Richter 2019; Carvalho & Goldstone |
| Fact plus application card pairs | **Yes** | Agarwal 2019; Pan & Rickard |
| Sibling structure (reverse cards, cloze siblings) | Partly (note design; burying is a user setting) | Pan & Rickard on rearrangement |
| Recommended preset (desired retention, steps, order) | Recommend only | Anki manual; Cepeda 2008 |
| Actual intervals, number of sessions, adherence | **No** (the scheduler and the learner) | Cepeda 2006/2008; Rawson & Dunlosky 2011 |
| Honest self-grading | **No**; guidance only | Anki manual on "Hard"; Karpicke & Roediger 2008 |

---

## Implications for our card standard

1. **Every card requires active recall of a specific answer before the reveal.** No "read this" cards. *Evidence:* testing beats restudy (g = 0.50 in Rowland 2014, 0.51 in Adesope 2017 and 0.33 in Yang 2021 versus restudy). In Agarwal (2019) and Karpicke & Roediger (2008), rereading or restudy added nothing.
2. **Default to recall (type-in or free recall of a short answer). Use recognition or multiple-choice cards only for discrimination, and then with competitive lures.** *Evidence:* in the lab, recall beat recognition (Rowland: cued 0.72 and free 0.81 versus recognition 0.36 in the high-exposure set). Classroom data show recognition working as well (Yang: 0.518 versus 0.520), so this is a lean rather than a ban. Competitive multiple-choice alternatives help related items (Little & Bjork 2015).
3. **Match the prompt to how the exam asks.** If the exam gives scenarios, write scenario → concept cards whose *answer* is the tested concept. *Evidence:* response congruency adds d = 0.35 and bias-corrected transfer is about zero without it (Pan & Rickard 2018). Format consistency gives 0.531 versus 0.399 (Yang 2021).
4. **For each key concept, write at least one fact card and at least one application or discrimination card.** Do not assume facts transfer upward. *Evidence:* fact quizzes did not improve higher-order performance, and mixed quizzes were best (Agarwal 2019). Pan & Rickard's "different levels of knowledge" principle points the same way.
5. **Reverse (bidirectional) cards only where the exam asks both directions, and treat them as separate learning.** *Evidence:* stimulus–response rearrangement transfer is about 0 (d = 0.063) for materials other than paired associates (Pan & Rickard 2018; Rickard & Pan 2020).
6. **The back of every card is feedback.** It gives the unambiguous answer, a one-line *why* or mechanism where the concept is transferable, and a source reference. *Evidence:*
   - feedback 0.73 versus 0.39 (Rowland)
   - feedback 0.537 versus 0.374 (Yang)
   - error correction +494% (Pashler 2005)
   - elaborated retrieval practice adds to transfer (Pan & Rickard)
   - the adverse finding is Adesope, with no feedback moderation
7. **Any card with answer options must explain why each distractor is wrong.** *Evidence:* multiple-choice lures can be learned as false knowledge, and feedback reduces lure intrusions (Butler & Roediger 2008).
8. **One retrievable answer per card (atomicity). Never ask for an unordered set or a long enumeration in one card. Split sets into per-member cards plus an optional "how many / which is missing" card.** *Evidence:* successive relearning needs a clean correct/incorrect criterion (Rawson & Dunlosky 2011). Too-hard, ambiguous retrieval without success gives no benefit (Rowland: ≤50% accuracy, g = 0.03). Wozniak's "avoid sets / enumerations" is [P] only.
9. **Cover complete sets.** If a list, framework or family of items is exam-relevant, every member gets a card. Don't sample a subset. *Evidence:* retrieval-induced forgetting of unpractised same-category items (Anderson et al. 1994; meta-analytic g = 0.35 in Murayama 2014).
10. **Add integrative context on the back that links related items** (for example "contrast with X; both belong to Y"). *Evidence:* RIF is about zero for high-integration text (g = 0.01), and testing facilitates related material when it is integrated (Murayama 2014; Chan et al. 2006). Yang found classroom quizzing helps untested related material (0.321).
11. **Write explicit contrast cards for confusable pairs and groups** (which of A/B/C applies to this case), and tag them so they can be studied together. *Evidence:* interleaving helps most when categories are similar to each other (Brunmair & Richter 2019; Carvalho & Goldstone 2014). Wozniak's "combat interference" is [P].
12. **Don't make claims about interleaving for vocabulary or definition lists or prose.** Rely on the scheduler's natural shuffling, not on author-imposed mixing. *Evidence:* words g = −0.39 and expository text is non-significant (Brunmair & Richter 2019).
13. **Avoid single-word cloze deletions ripped out of prose sentences.** Cloze must delete the *concept-bearing* element, with enough context that exactly one answer fits. *Evidence:* Karpicke & Aue (2015) attribute testing-effect failures to "retrieval of isolated words in individual sentences". In Pan et al. (2019), fill-in-the-blank practice did not produce transfer on its own.
14. **Difficulty must come from retrieval effort, not ambiguity or missing prerequisites.** Include a prerequisite-ordering tag, and set a rule that any card with a persistent failure rate (a leech) is rewritten, not just re-drilled. *Evidence:* "If... the learner does not have the background knowledge... they become undesirable difficulties" (Bjork & Bjork 2011). Rowland found no benefit when retrieval success was ≤50% without feedback. Pan & Rickard found transfer rises with initial accuracy.
15. **Scope procedural or multi-step content modestly.** Cards target decision points and formulas-when. The deck README points to worked practice problems for full procedures. *Evidence:* no testing benefit after worked examples in 4 experiments (van Gog et al. 2015). Only d = .28 for relearning on probability problems (Rawson et al. 2020, via the Dunlosky guide). The debate is unresolved (Karpicke & Aue 2015).
16. **Ship a recommended schedule, not a cram mode.** Tell learners to start early and review daily in one mixed deck rather than many small sub-decks. Use Anki's default 90% desired retention, and do not recommend going above it without reason. *Evidence:*
    - one big stack beat small stacks, and 72% of learners misjudged this (Kornell 2009)
    - Anki notes workload rises steeply above 90% [P]
    - the optimal gap is about 10–20% of the retention interval, and too-short gaps are costlier than too-long ones (Cepeda 2008)
17. **Tell learners to keep failed cards in rotation until they recall them, and to relearn across several sessions rather than over-drilling on day one.** *Evidence:* the prescription of 3 correct recalls initially plus 3 spaced relearning sessions (Rawson & Dunlosky 2011). Relearning override (Vaughn et al. 2016; Rawson et al. 2018). Dropping "known" cards hurts (Kornell & Bjork 2008).
18. **Include honest-grading guidance: press "Again" when you failed.** *Evidence:* the Anki manual says "Hard" on a failure inflates intervals [P]. People's judgments of learning are poor (Karpicke & Roediger 2008; Kornell 2009; Kornell & Bjork 2008).
19. **Where the scheduler allows sibling burying, recommend it for notes that generate several related cards.** This keeps near-duplicate retrievals from occurring minutes apart. *Evidence:* massed re-exposure is weaker than spaced (Cepeda 2006/2008; Latimier g = 0.74 spaced versus massed retrieval). The Anki bury-siblings option is [P].
20. **Set honest expectations in deck descriptions.** Quote classroom-scale effects (g ≈ 0.4–0.5 overall, about 0.33 versus restudy), not lab maxima. Note that adult or continuing-education evidence is thin. *Evidence:* Yang 2021: overall 0.499, bias-adjusted 0.427, continuing education 0.314 with a CI crossing 0.

## Open questions and items not verified

- The primary full text of Cepeda et al. (2006) was not accessed. The 254 studies, 14,000+ participants and 47% versus 37% figures are from Dunlosky et al. (2013).
- For Rawson, Dunlosky & Sciartelli (2013), the ">10% exam boost" and ">60% versus <20%" figures are from the authors' own later guide, not the primary paper.
- For Latimier et al., the g = 0.74 and g = 0.032 figures are from the OSF preprint. The published numbers were not checked.
- The primary texts of Chan (2009) and Pyc & Rawson (2009, retrieval-effort hypothesis) were not read, so they are not relied on.
- The adult certification population is under-studied. Most data are from undergraduates and K-12 students.
- Two conflicts are unresolved between meta-analyses: feedback (Adesope: no moderation; Rowland and Yang: moderation) and number of tests (Adesope: one test > several; Yang: more repetitions > fewer). The card standard follows the majority and the classroom data (Yang).
