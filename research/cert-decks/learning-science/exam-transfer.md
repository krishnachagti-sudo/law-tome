# Do flashcards help people pass certification exams, and how do we make them transfer to exam-style questions?

Research brief for the free certification-flashcard project. Compiled 2026-09-24.

**Evidence labels:** [E] experimental (randomised or within-subject manipulation) · [S] observational, correlational or survey · [R] review or meta-analysis · [P] practitioner or vendor positioning (marketing, not evidence).

**Method:** Every number below was read in raw text fetched during this task and saved under `scratchpad/learning/raw-exam/`. Sources were Europe PMC abstracts and full-text XML, Crossref, author-hosted PDFs extracted with pdftotext, the Anki manual, the FSRS tutorial and vendor pages. The file for each claim is named in brackets, e.g. `abs_<PMID>.txt`, `ft_<PMCID>.txt`, `*.txt`. Where I could not get the primary text, the claim is marked **not verified** and left out of the conclusions.

---

## 1. Bottom line (5 bullets)

1. **Flashcard or Anki use is linked to higher scores on knowledge-heavy licensing exams, but the evidence is correlational.** It shows up on USMLE Step 1 and the NBME CBSE. It does not show up on the more clinical-reasoning Step 2 CK, and results on in-course exams are mixed. No randomised trial of Anki against a licensing-exam outcome was found.
2. **Doing exam-style practice questions is as strong as flashcards as a predictor of exam score, and in some datasets stronger.** In the two studies that measured both side by side (Deng 2015; Sherman 2026), question volume predicted the outcome in each. Flashcard volume did so in Deng but not in Sherman.
3. **Fact-level retrieval does not reliably transfer to application or scenario questions.** In controlled experiments, application-level or mixed practice transfers and definition-level practice does not (Agarwal 2019; McDaniel 2013). Transfer happens on average (Pan & Rickard 2018: d = 0.40), but it is weak when practice and test responses are not congruent.
4. **The format of practice (multiple choice or short answer) matters less than doing retrieval with feedback.** In classroom studies MCQ quizzing worked about as well as short-answer quizzing for later exams. Matching the exam format adds a modest amount (Yang 2021: g = 0.531 matched vs 0.399 mismatched).
5. **Spacing beats cramming, and the best spacing depends on how far away the exam is.** The optimal gap is roughly 20–40% of the time-to-test for a 1-week horizon and 5–10% for a 1-year horizon (Cepeda 2008). Knowledge fades after the exam. Unrehearsed medical knowledge was mostly stable for about 1.5–2 years and then declined along a logarithmic curve (Custers & ten Cate 2011). That supports keeping decks after certification.

---

## 2. Flashcards and spaced repetition vs. high-stakes exam performance

### 2.1 Medical licensing (USMLE / COMLEX / CBSE / in-training exams)

| Study | Design | What was found | Label |
|---|---|---|---|
| **Frappa et al. 2026**, *Med Sci Educ*, doi:10.1007/s40670-026-02643-5 (systematic review, 11 studies) | Qualitative synthesis | "Three studies demonstrated a consistent positive association between regular Anki use and USMLE Step 1 performance. High-frequency users outperformed minimal users by 4–13 points, with one study identifying a dose-response effect." Course exams were "more mixed". "Only one study assessed Step 2 CK and found no significant benefit." Conclusion: "evidence is largely observational"; "because Anki use was not randomly assigned in any included study, this apparent dose–response relationship may partly reflect self-selection." Also notes that Step 1 went pass/fail in 2022, which "may reduce the relevance of prior findings." [`abs_42183420.txt`, `ft_PMC13197492.txt`] | [R] of [S] |
| **Deng, Gluckstein & Larsen 2015**, *Perspect Med Educ*, doi:10.1007/s40037-015-0220-x | Cross-sectional survey, n = 72, one institution | All students used practice MCQs (mean 3,870, SD 1,472). Anki users were 31% of respondents and Firecracker users 49%. In multivariate regression, independent predictors of Step 1 were MCQs completed (B = 2.2 × 10⁻³, p < 0.001), unique Anki cards seen (B = 5.9 × 10⁻⁴, p = 0.024), second-year honours and MCAT. Test anxiety was a negative predictor. The review table restates this as "each additional ~1700 Anki cards reviewed was associated with a 1-point increase." *My arithmetic from the same coefficients (derived, not stated by the authors): about 455 MCQs per Step 1 point, against about 1,700 unique cards per point.* [`deng2015.txt`, `ft_PMC13197492.txt`] | [S] |
| **Lu, Farhat & Beck Dallaghan 2021**, *Med Sci Educ*, doi:10.1007/s40670-021-01386-9 | Survey paired with Step 1 scores (n = 201 per review table) | Anki users scored higher than non-users (241.1 ± 13.2 vs 235.5 ± 17.7, p = 0.012). Reviewing past decks "most of the time/always" was associated with higher scores (246.9 vs 236.3). The authors recommend Anki "alongside ... the popular question bank USMLE World." [`abs_34956708.txt`, `ft_PMC13197492.txt`] | [S] |
| **Wothe et al. 2023**, *J Med Educ Curric Dev*, doi:10.1177/23821205231173289 | Survey plus institutional scores; 165 respondents, 18% response rate | Daily Anki use was associated with higher Step 1 (median 238 vs 233.5, p = .039) and not with Step 2. "A variety of study methods can be used to achieve similar medical school outcomes." 67% of students also used a question bank. [`abs_37187920.txt`, `ft_PMC10176558.txt`] | [S] |
| **Gilbert et al. 2023**, *Med Sci Educ*, doi:10.1007/s40670-023-01826-8 | Cohort-control, 130 first-years offered Anki training; 78 used Anki, 52 did not | Anki users scored higher on course exams and the CBSE (12.9%, p = 0.003). "Little correlation between its specific statistical markers and examination performance." [`abs_37546209.txt`] | [S] |
| **Winter et al. 2025**, *J Med Educ Curric Dev*, doi:10.1177/23821205251369705 | n = 36; objective Anki stats exported by add-on | Mature cards (interval over 21 days) were correlated with CBSE (p = 0.002). Above-average mature-card students scored 71.5% vs 60.0%. [`abs_40823200.txt`] | [S] |
| **Spence et al. 2026**, *Med Sci Educ*, doi:10.1007/s40670-025-02549-8 | Cross-sectional, n = 176 first-years | 82% used Anki, but "Anki use was not associated with improved exam performance" on in-house exams. Wellness and 7+ hours of sleep were associated with better written-exam scores. [`abs_41939075.txt`] | [S] |
| **Haughey et al. 2025**, *Med Sci Educ*, doi:10.1007/s40670-025-02504-7 | Pre/post module test plus survey, n = 43 complete | No overall benefit for Anki users on the module as a whole. There was a benefit for extensive vs inconsistent users, and a correlation with physiology scores. [`abs_41798370.txt`] | [S] |
| **Durrani et al. 2024**, *BMC Med Educ*, doi:10.1186/s12909-024-05479-y | Quasi-experimental, n = 115, random allocation to an Anki deck vs books and lectures for 4 weeks, 50-MCQ pre/post | Intervention post-test 30.8 ± 4.56 (pre 27.93). Control 27.22 (pre 27.96). Authors report effect size 0.8. *Limits: single site, unequal groups (70/45), the control did not improve at all, and it is unclear whether the comparison matched time on task.* [`abs_38890623.txt`] | [E] (weak) |
| **Sherman, Stomberger & Porter-Stransky 2026**, *BMC Med Educ*, doi:10.1186/s12909-026-10013-3 | Two cohorts (n = 97, n = 103), platform usage logs | Qmax **practice-question** use predicted CBSE (B = 0.004–0.005) and on-time Step 1 pass. The same platform's **"Flash facts" spaced-repetition flashcards** did not (Traditional B = −0.001, p = 0.411; IOS B = 0.001, p = 0.910). *Caveat: flashcard use was low and highly skewed (Traditional mean 145, SD 558).* [`abs_42723048.txt`, `ft_PMC13560434.txt`] | [S] |
| **Tsai et al. 2021**, *Med Sci Educ*, doi:10.1007/s40670-021-01320-z | 31 ob-gyn residents, 883 custom flashcards | Flashcard use "appeared to correlate" with CREOG in-training exam improvement, but not significantly after adjusting for PGY (β = 10.5, 95% CI −0.60 to 21.7, p = 0.06). [`abs_34457982.txt`] | [S] |
| **Nelson et al. 2024**, *Med Sci Educ*, doi:10.1007/s40670-024-02031-x | Retrospective, residents | More exam-style MCQs answered in a year predicted a larger annual in-training exam gain (p = 0.026 / 0.025). Baseline score had the larger effect. Higher-scoring residents answered fewer questions. [`abs_38887411.txt`] | [S] |
| **Walsh et al. 2026**, *J Educ Perioper Med* | Anesthesiology residents, 3 years | Residents completing over 500 qbank questions had significantly higher in-training exam scores. Those above the 90th percentile averaged more than 1,000 questions. [`abs_42592557.txt`] | [S] |
| **Nelson et al. 2025**, *Cureus*, doi:10.7759/cureus.95568 | National prospective, 293 pediatric residents, daily text-message MCQ | The texts "did not successfully induce residents to answer practice questions". There was no difference in exam scores. **Engagement is the bottleneck.** [`abs_41322801.txt`] | [E] (null, adherence failure) |

**Reading across the medical evidence:**
- **Link to exam score.** Anki and flashcard volume is associated with scores on foundational-knowledge exams (Step 1, CBSE). The association is consistently weaker or absent for more applied exams (Step 2 CK) and short-horizon course exams.
- **Confounding.** Every study is confounded by motivation, ability and study time. The strongest single dataset (Sherman 2026) found practice questions predicted outcomes and in-platform flashcards did not.
- **Direct comparison.** Deng 2015 is the only study that put both into one regression. Both predicted the outcome, and the per-item coefficient for MCQs was about 3.7× the per-card coefficient.

### 2.2 Spaced, question-based education (RCTs in medicine)

These are the closest thing to experimental evidence for "spaced retrieval with feedback" in professionals.

- **Kerfoot et al. 2007**, *J Urol*, doi:10.1016/j.juro.2006.11.074 [E]: RCT, 537 urology residents. The spaced cohort got daily e-mailed questions over 27 weeks; the bolus cohort got all 96 questions at once. Spaced scored higher on staggered online tests (p < 0.001), and its scores "remained stable" while bolus scores decreased linearly (p = 0.007). **But "they did not generalize to higher scores on the In-Service Examination."** [`abs_17382760.txt`]
- **Kerfoot 2009**, *J Urol*, doi:10.1016/j.juro.2009.02.024 [E]: 2-year follow-up of the same trial. Spaced 70.2% vs bolus 66.8%, effect size 0.35, p = 0.03. That is modest but durable. [`abs_19375095.txt`]
- **Kerfoot et al. 2010**, *J Am Coll Surg*, doi:10.1016/j.jamcollsurg.2010.04.023 [E]: 724 urology residents. Daily **clinical scenario plus image** questions with immediate feedback. Long-term gains were 15.2% for spaced education vs 3.4% for web modules (p < 0.01). Title claim: "generates transfer." [`abs_20800189.txt`]
- **Larsen, Butler & Roediger 2009**, *Med Educ*, doi:10.1111/j.1365-2923.2009.03518.x [E]: RCT with residents. Repeated short-answer testing with feedback vs repeated study of a review sheet, about 2 weeks apart. At over 6 months: 39% vs 26%, d = 0.91. [`abs_19930508.txt`]

### 2.3 Nursing (NCLEX), law (bar), IT and finance certifications

- **NCLEX:** I found no quantitative flashcard study. **Blozen 2014** (qualitative interviews with accelerated-nursing graduates) reports that "the most significant finding the participants identified as the factor that contributed to their success was the practicing of NCLEX-RN questions" [`abs_26021133.txt`]. [S, qualitative]
- **Bar exam / law:** The Europe PMC search returned nothing relevant [`bar.txt`]. **Not verified**: no bar-exam flashcard or retrieval study located.
- **IT (CompTIA, Cisco, CISSP), PMP, CFA/CPA:** The Europe PMC search [`itfin.txt`] found no peer-reviewed study linking flashcards or spaced repetition to pass rates on these exams. **The evidence base for our target exams is inferential.** It extrapolates from cognitive psychology and medical licensing.
- **Physician recertification:** **Virani, Fleischer & Peterson 2025**, *J Contin Educ Health Prof*, doi:10.1097/ceh.0000000000000606. The ABFM's open-book, spaced **longitudinal assessment** (FMCLA) was associated with +39 points (95% CI 36.2–42.0) over predicted score vs the 1-day exam, after propensity weighting (n = 12,851). However, "Modality of exam had no impact near the passing score." [`abs_40340967.txt`] [S]

---

## 3. Retrieval practice in classrooms: does quizzing raise real exam scores?

- **Yang, Luo, Vadillo, Yu & Shanks 2021**, *Psychol Bull*, doi:10.1037/bul0000309 [R]: 222 studies, 48,478 students.
  - **Overall effect.** Classroom quizzing raises achievement, g = 0.499.
  - **Publication bias.** Five bias tools "none revealed noteworthy evidence of publication bias."
  - **Comparison conditions.** The effect is larger against restudying (g = 0.330) than against other elaborative strategies (g = 0.095).
  - **Feedback.** Quizzing with corrective feedback gives g = 0.537 vs 0.374 without.
  - **Repetition.** More test repetitions give larger gains.
  - **Untested material.** Quizzing also benefits material that was not itself quizzed (g = 0.321), and rephrased questions (g = 0.558).
  - [`abs_33683913.txt`, `yang2021.txt`]
- **McDaniel, Agarwal, Huelser, McDermott & Roediger 2011**, *J Educ Psychol*, doi:10.1037/a0021782 [E, classroom]: 8th-grade science.
  - Spaced MCQ quizzes with feedback gave "between 13% and 25% gains" on unit exams.
  - "Review quizzing produced the greatest increases in exam performance."
  - Benefits "persisted on cumulative semester and end-of-year exams."
  - [`m11.txt`]
- **Dunlosky et al. 2013**, *Psychol Sci Public Interest*, doi:10.1177/1529100612453266 [R]: Of 10 techniques, "Practice testing and distributed practice received high utility assessments." [`abs_26173288.txt`]

---

## 4. Transfer: from fact recall to application and scenario questions

This is the crux for certification exams. Most IT, finance, PM and aviation exams are scenario-based.

- **Pan & Rickard 2018**, *Psychol Bull*, doi:10.1037/bul0000151 [R]: 192 transfer effect sizes, 122 experiments, N = 10,382.
  - **Average effect.** Testing yields transfer, d = 0.40 (95% CI 0.31–0.50).
  - **Where transfer is strongest.** "Across test formats, to application and inference questions, to problems involving medical diagnoses."
  - **Where it is weakest.** "To rearranged stimulus-response items, to untested materials seen during initial study, and to problems involving worked examples."
  - **What drives it.** "Response congruency and elaborated retrieval practice, as well as initial test performance, strongly influence the likelihood of positive transfer."
  - **Bias caveat.** After correcting for publication bias, "the intercept predictions were substantially reduced, often indicating no positive transfer when none of the aforementioned moderators are present."
  - [`pan2018.txt`]
  - **Implication:** transfer is not automatic. It needs cards that are elaborated, answered successfully, and congruent with what the exam asks you to produce.
- **Agarwal 2019**, *J Educ Psychol*, doi:10.1037/edu0000282 [E, lab + K-12 classroom]:
  - **Main finding.** "Higher order and mixed quizzes improved higher order test performance, but fact quizzes did not." "Building a foundation of factual knowledge via fact-based retrieval practice did not enhance students' higher order learning."
  - **Mixed practice did best (Exp. 3, middle school, 2-day delay).** Mixed quizzes: 91% on the fact test and 82% on the higher-order test. Higher-order-only quizzes: 64% / 75%. No quiz: 64% / 56%.
  - **Author's explanation.** Students may not transfer "without explicit instructions to do so."
  - [`ag_plain.txt`]
- **McDaniel, Thomas, Agarwal, McDermott & Roediger 2013**, *Appl Cogn Psychol*, doi:10.1002/acp.2914 [E, classroom]:
  - Quizzing benefits were "similar ... for both transfer items and identical items."
  - "Application questions increased exam performance for definitional-type questions and for different application questions. Definition questions did not confer benefits for application questions."
  - [`m13.txt`]
- **Butler 2010**, *JEP:LMC*, doi:10.1037/a0019902 [E, lab]: Repeated testing beat restudy on new inferential questions a week later, including questions "from different knowledge domains." [`abs_20804289.txt`]
- **Kerfoot 2007 vs 2010** (above): short fact-style spaced questions did not raise in-service exam scores. Scenario-plus-image spaced questions produced transfer of diagnostic skill. [E]
- **Wothe 2023, Frappa 2026** (above): Anki associations appear for Step 1 but not for the more application-heavy Step 2 CK. [S]

**Synthesis:** Pure fact cards help with fact questions. They do not reliably help with "which should the project manager do NEXT?" or "a user reports X, what is the most likely cause?" For that, the practice itself must require application. A mix of fact and application retrieval is the best-supported pattern (Agarwal 2019 Exp. 3; McDaniel 2013).

---

## 5. Transfer-appropriate processing: should practice match the exam format?

- **Yang 2021** [R]:
  - Quizzing benefits appear across formats: MCQ g = 0.567, short answer g = 0.638, fill-in-the-blank g = 0.773. "Test format does not significantly modulate the benefits of testing."
  - The effect survives format mismatch between quiz and exam.
  - "Consistent test formats (g = 0.531) are associated with a significantly larger effect size than inconsistent formats (g = 0.399)."
  - [`yang2021.txt`]
- **McDermott, Agarwal, D'Antonio, Roediger & McDaniel 2014**, *JEP: Applied*, doi:10.1037/xap0000004 [E, classroom]:
  - "The format of the quiz (multiple-choice or short-answer) did not need to match the format of the criterial test."
  - "Multiple-choice quizzing is as effective as short-answer quizzing."
  - Quizzing beat restudy.
  - [`mcdermott2014.txt`]
- **Smith & Karpicke 2014**, *Memory*, doi:10.1080/09658211.2013.831454 [E]: N = 372.
  - "Little or no advantages of answering short-answer or hybrid format questions over multiple-choice questions in three experiments."
  - Short answer won only "when retrieval success was improved."
  - [`smith2014.txt`]
- **Little, Bjork, Bjork & Angello 2012**, *Psychol Sci*, doi:10.1177/0956797612443370 [E]: MCQs with **plausible** distractors "can indeed trigger productive retrieval processes." They also improved recall of information about the incorrect alternatives, which cued-recall tests did not. [`little2012.txt`]
- Not verified: McDaniel et al. 2007 (*Eur J Cogn Psychol*) and Kang, McDermott & Roediger 2007 on short answer vs MCQ. The abstracts were not retrievable (Crossref has no abstract; the publisher returned 403).

**Synthesis for an MCQ certification exam:**
- **Recall-style flashcards are fine.** Front-back cards are recall practice, and recall practice transfers to MCQ exams.
- **Matching the exam format adds a modest increment.** Some MCQ or scenario-format practice with plausible distractors is worth doing.
- **Well-built MCQs are not a shortcut.** With good distractors they are genuine retrieval practice, and they teach why the wrong options are wrong.
- **Feedback matters in both formats.** It raises the effect (g 0.537 vs 0.374).

---

## 6. What flashcards and practice exams each contribute

Taken together, sections 2–5 give a clear division of labour.

| | Spaced flashcards | Exam-style question banks / mock exams |
|---|---|---|
| Durable recall of facts, terms, ports, formulas, definitions | Strong: spacing + retrieval (Latimier; Cepeda; Kerfoot) [E/R] | Moderate: only for items the qbank happens to cover |
| Application / scenario transfer | Weak if cards are fact-only (Agarwal 2019; McDaniel 2013) [E] | Stronger: practice is congruent with the exam (Pan & Rickard; Yang format match) [R] |
| Observed link to licensing scores | Positive but confounded; null in some datasets (Frappa; Sherman; Spence) [S] | Positive in every study found (Deng; Sherman; Nelson 2024; Walsh) [S] |
| Readiness signal / calibration | Poor (card recall does not equal exam score) | Good; vendors use mock scores as readiness proxies [P] |
| Efficiency per minute | High for discrete facts | Lower per fact, but trains reading stems, eliminating distractors and stamina |

This is a recommended position, not a tested head-to-head. No RCT compares flashcards and question banks for a certification exam. The pairing recommendation rests on the complementary mechanisms above.

---

## 7. Scheduling against an exam date

- **Kornell 2009**, *Appl Cogn Psychol*, doi:10.1002/acp.1537 [E, flashcards specifically]:
  - One large stack (spacing) beat four small stacks (massing), and "spacing was also more effective than cramming—that is, massing study on the last day before the test."
  - "Spacing was more effective than massing for 90% of the participants, yet after the first study session, 72% of the participants believed that massing had been more effective."
  - [`cr_dois.txt`]
- **Cepeda et al. 2008**, *Psychol Sci*, doi:10.1111/j.1467-9280.2008.02209.x [E]: More than 1,350 people, review gaps up to 3.5 months, tests up to 1 year later.
  - "The optimal gap increased as test delay increased."
  - As a proportion of test delay, it "declined from about 20 to 40% of a 1-week test delay to about 5 to 10% of a 1-year test delay."
  - [`abs_19076480.txt`]
- **Cepeda et al. 2006**, *Psychol Bull*, doi:10.1037/0033-2909.132.3.354 [R]: 839 assessments, 317 experiments. The gap "producing maximal retention increased as retention interval increased." [`abs_16719566.txt`]
- **Latimier, Peyre & Ramus** (preprint doi:10.31234/osf.io/kzy7u; published in *Educ Psychol Rev* 2021, doi:10.1007/s10648-020-09572-8; numbers read from the preprint) [R]: 29 studies.
  - Spaced vs massed retrieval: g = 0.74.
  - Expanding vs uniform schedules: no difference (g = 0.032). This does "not support the wide belief that inter-retrieval intervals should be progressively increased."
  - [`latimier_ft.txt`]
- **Rawson, Vaughn, Walsh & Dunlosky 2018**, *JEP: Applied*, doi:10.1037/xap0000146 [E]: Successive relearning (practising to mastery in several sessions) beat single-session learning, ds = 1.52 to 4.19. [`abs_29431462.txt`]
- **McDaniel 2011** [E]: A **review quiz just before the unit exam** gave the largest gains. Final pre-exam review is complementary to spacing, not a replacement for it.

**FSRS / Anki specifics** [P, tool documentation, not outcome evidence]:
- **Desired retention defined.** Anki manual: desired retention is the probability of recall when a card is due. The default is 90%. "As desired retention approaches 100%, the workload increases drastically"; keep it "lower than 97%." Different values can be set per deck. [`anki_deckoptions.txt`]
- **Why not push retention very high.** FSRS tutorial: settings above 0.97 are discouraged because each review "will contribute minimally" and it "transforms the spaced repetition system into a massed repetition system." [`fsrs_tutorial.md`]
- **Exam horizon in the simulator.** "If you are preparing for an exam that is 12 months away, set 'Days to simulate' to 365." [`fsrs_tutorial.md`]
- **Seeing cards before the exam.** "If you still want to see a deck sooner ... because you have an exam coming up, you can use the Advance function of the Helper add-on," which "doesn't skew the grading history." [`fsrs_tutorial.md`]
- **Cramming within Anki.** Filtered decks exist for "cramming cards before a test" and "reviewing ahead of schedule." [`anki_filtered.txt`]
- **No exam-date option.** FSRS has no native deadline or exam-date mode. The GitHub feature request (fsrs4anki-helper #456) was found by search but could not be fetched (403), so its status is **not verified**.

**Inference (mine, from the above):** FSRS optimises long-run retention, not recall on a fixed day.
- **Horizon under about 4–8 weeks.** Raise desired retention a bit (e.g. 0.90 → 0.93–0.95, staying ≤ 0.97). Stop adding new cards about 1–2 weeks out. Use Advance or a filtered deck for a final full pass in the last days.
- **Afterwards.** Return retention to default after the exam.
- **Status.** This is consistent with Cepeda's shorter optimal gaps for shorter horizons and McDaniel's pre-exam review effect. It has not been tested as a protocol.

---

## 8. Retention after the exam, and the case for keeping decks

- **Custers 2010**, *Adv Health Sci Educ*, doi:10.1007/s10459-008-9101-y [R]: "Approximately two-third to three-fourth of knowledge will be retained after one year, with a further decrease to slightly below fifty percent in the next year." [`abs_18274876.txt`]
- **Custers & ten Cate 2011**, *Med Educ*, doi:10.1111/j.1365-2923.2010.03889.x [S, cross-sectional]:
  - When rehearsal is controlled for, "little knowledge is lost for 1.5–2 years after it was last used". After that, forgetting follows a logarithmic curve.
  - Retention was 15–20% after 25 years or more.
  - [`abs_21401691.txt`]
- **Choudhry, Fletcher & Soumerai 2005**, *Ann Intern Med*, doi:10.7326/0003-4819-142-4-200502150-00008 [R]:
  - 32 of 62 evaluations (52%) reported "decreasing performance with increasing years in practice for all outcomes."
  - A further 13 (21%) reported decreasing performance for some outcomes.
  - [`abs_15710959.txt`]
- **Kerfoot 2009** [E]: A spaced-education advantage was still detectable 2 years later (d = 0.35).
- **Kerfoot & Baker 2012**, *Ann Surg*, doi:10.1097/sla.0b013e31825b3912 [E]: A spaced-education game for CME enrolled 1,470 practising urologists from 63 countries. Median baseline score on guideline questions was 48%. [`abs_22664558.txt`]
- **Rottman et al. 2023 (series I)**, *Cogn Res*, doi:10.1186/s41235-023-00496-9 [R]: US specialty boards are moving from a summative test every 6–10 years toward "much more frequent assessments." [`abs_37486508.txt`]
- **Virani 2025** [S]: Spaced longitudinal assessment was associated with higher recertification scores (see §2.3).
- **Not verified:** Arthur et al. 1998 skill-decay meta-analysis (*Human Performance*). Crossref had no abstract.

**Implication:** Certifications with CPE/CEU or recertification cycles are a natural fit for "keep the deck, drop to low-volume maintenance." These include CompTIA CE, (ISC)², PMI PDUs, CFA and aviation recurrent training. The evidence here is from medicine; applying it to IT and finance is an extrapolation.

---

## 9. How prep providers position flashcards vs question banks [P]

- **PMI Study Hall (official PMP prep)** [`p_pmi_faq.txt`]:
  - Describes "practice questions and mini exams that help you prepare and build endurance for complete practice exams" and "digital flashcards to solidify your understanding of PMP concepts."
  - Essentials includes 2 full-length practice exams, 15 mini exams, 200 practice questions and 200+ flashcards.
  - **Flashcards are a supporting component, practice exams the core.**
- **CompTIA CertMaster Practice** [`p_comptia.txt`]:
  - The official product is built on "timed and untimed practice tests to simulate the exam experience and assess readiness" and "exam objective assessments to identify knowledge gaps."
  - It is positioned for learners who "already have foundational knowledge and want to validate readiness."
  - The flashcard term did not appear in the fetched page text.
- **UWorld CFA** (vendor) [`p_uworld_cfa.txt`]:
  - The exam "tests how you apply it under pressure." The page frames the QBank as the core and flashcards as a convenience: "features like flashcards can turn your commute or lunch break into productive study time."
  - It also markets "auto-generated flashcards and spaced repetition" inside the QBank.
- **PM PrepCast** [`p_prepcast.txt`]:
  - Markets PMP eFlashCards for "concepts, terms and PMI-isms" and "PMBOK Guide Glossary definitions," i.e. vocabulary.
  - The page now says the flashcards are "currently NOT available" and recommends its course instead. Its simulator carries "a passing score ... is no guarantee that you will pass."
- **Kaplan Schweser (CFA):** The page returned 403 and was not read. Search-snippet claims about mock-exam pass rates are **not verified** and not used.

**Pattern:** Official and commercial providers put question banks and mock exams at the centre. Flashcards are sold as terminology and on-the-go reinforcement. This matches the research division of labour in §6.

---

## 10. What flashcards can and cannot do for a certification candidate (plain language, for the website)

**What they do well**
- **They make facts stick.** Pulling an answer out of memory, rather than re-reading it, is one of the best-studied ways to remember things. Spacing those attempts over days and weeks beats cramming the night before. In one flashcard study, spacing won for 90% of learners, even though most of them thought cramming had worked better.
- **They are efficient for the "must-know" layer.** This means the terms, acronyms, ports, formulas, framework steps and definitions that every scenario question assumes you already know.
- **They fit into small gaps in your day.** A few minutes a day, done consistently, is what the studies reward. Students who kept up their reviews did better than occasional users.
- **They help you keep what you earned.** Knowledge fades after an exam, and more quickly once you stop using it. A light review habit keeps it available for the job, and for your renewal or continuing-education cycle.

**What they cannot do on their own**
- **They do not teach you to answer scenario questions.** Knowing a definition is not the same as choosing the best action in a situation. In experiments, fact-only quizzing did not improve performance on application questions. Practice that included application questions did.
- **They are not a readiness test.** Getting your cards right tells you that you remember the cards. It does not tell you that you will pass. Timed practice exams do that job.
- **They are not proven on their own.** Students who use flashcards heavily tend to score higher on knowledge-heavy exams. Those studies cannot rule out that they are simply more diligent students. The same studies show practice questions matter at least as much.

**How to use our decks**
1. Start the deck early and review every day. Spacing needs time.
2. From your first week, do exam-style practice questions alongside the deck.
3. When you miss a practice question, find or add the card that covers the fact behind it.
4. In the final week or two, stop adding new cards. Do a full review pass and take timed mock exams.
5. After you pass, keep the deck at a low daily load. It is cheap insurance for the job and for recertification.

---

## 11. Implications for our decks (numbered, evidence-tied)

1. **Add scenario and application cards to every deck, not only definition cards.** Aim for a mix, e.g. roughly a third of cards with a short situation in the stem ("A user reports X... what is the most likely cause / what should you do first?"). *Evidence:* Agarwal 2019 (fact quizzes did not improve higher-order tests; mixed was best); McDaniel 2013 (application practice transferred, definition practice did not); Pan & Rickard 2018 (transfer needs congruent, elaborated retrieval); Kerfoot 2010 vs 2007 (scenario-based spaced items transferred, fact items did not move the in-service exam).
2. **Put a "why" or explanation on every answer, including why common wrong options are wrong.** *Evidence:* Pan & Rickard (elaborated retrieval is a key transfer moderator); Yang 2021 (feedback g 0.537 vs 0.374); Little et al. 2012 (processing plausible alternatives improves learning about them).
3. **Offer an optional MCQ-style note type with plausible distractors for scenario cards, but keep recall-style fronts as the default.** *Evidence:* Yang 2021 (format match g 0.531 vs 0.399: a modest, real increment); McDermott 2014 and Smith & Karpicke 2014 (MCQ is roughly as effective as short answer); Little 2012 (distractors must be plausible).
4. **Position decks explicitly as a companion to practice questions, not a replacement, and say so on every deck page.** Add a "pairing" section that links to official or free practice tests where they exist, such as the vendor's sample questions. *Evidence:* Deng 2015 and Sherman 2026 (question volume predicted outcomes; in Sherman, flashcards did not); Nelson 2024 and Walsh 2026 [S]; provider positioning (PMI, CompTIA) [P].
5. **Tag every card to the official exam objective or domain,** so a candidate who misses practice questions in one domain can filter to that domain. This also supports the "missed question → find the card" loop. *Evidence:* the loop is an inference from retrieval practice plus feedback (Yang 2021) and from vendor "gap-identification" positioning [P]. The tagging itself is untested.
6. **Publish exam-date guidance.** Covers start at least 4–8 weeks out if possible, daily reviews, a new-card cutoff 1–2 weeks before the exam, and a final Advance or filtered-deck pass. Also explain desired retention: 90% default; optionally 0.93–0.95 for the final stretch; never above 0.97; revert afterwards. *Evidence:* Kornell 2009; Cepeda 2006/2008; Latimier (g 0.74 spaced vs massed); McDaniel 2011 (pre-exam review gave the largest gains); Anki manual and FSRS tutorial [P]. The specific retention numbers are **our inference**, not tested.
7. **Size decks to the calendar.** State a card count and an estimated daily load for a typical study window. Also warn that a deck too big to finish before the exam date undercuts spacing. *Evidence:* Cepeda 2008 (the gap must fit the horizon); Anki manual (workload rises steeply with retention). The sizing rule is our inference.
8. **Ship a "post-certification maintenance" recommendation** for each deck: keep it, lower new cards to zero, and let long intervals run. Note relevance to CE/CPE/PDU renewal cycles. *Evidence:* Custers 2010 and Custers & ten Cate 2011 (forgetting curves); Choudhry 2005; Kerfoot 2009 (spaced gains persisted 2 years); Rottman 2023 and Virani 2025 (boards moving to spaced longitudinal assessment).
9. **Mark volatile content with a version tag and review date,** and expect exam objectives to change. Out-of-date cards are worse than none for recertification. *Evidence:* Rottman series II abstract (keeping up with evolving standards is a named challenge) [R]. The practice itself is our inference.
10. **Make honest claims on the website.** Say "consistent with strong learning-science evidence" and "associated with higher scores in medical licensing studies." Do not say "proven to help you pass." Say plainly that no study has tested flashcards for IT, finance, PM or aviation certifications specifically. *Evidence:* Frappa 2026 ("largely observational"); the absence of IT, finance and bar studies in searches (§2.3).
11. **Design for adherence, not just content.** Short daily sessions, sensible defaults and no giant backlogs. The national text-message trial failed because people did not engage. *Evidence:* Nelson 2025 (adherence failure); Lu 2021 and Winter 2025 (consistency and mature-card counts tracked scores) [S].
12. **Where feasible, collect our own outcome data.** An opt-in post-exam survey (pass/fail, deck usage, practice-question usage) would give the first IT and finance evidence. It would still be observational, so it should be framed that way.

---

## 12. Gaps and items not verified

- **Target exams:** no peer-reviewed flashcard or spaced-repetition outcome studies found for IT (CompTIA/Cisco/AWS/CISSP), finance (CFA/CPA), agile/PMP, aviation, bar or NCLEX (quantitative).
- **Unfetched abstracts:** McDaniel et al. 2007 (*Eur J Cogn Psychol*), Kang et al. 2007 and Arthur et al. 1998 could not be retrieved. Their findings are not used.
- **Effect sizes without numbers:** Rowland 2014 and Adesope 2017 abstracts give no pooled effect sizes, so none are quoted.
- **Paywalled or blocked pages:** Kaplan Schweser pages (403) and the FSRS helper GitHub issue #456 (403) were not read.
- **No head-to-head RCT:** no randomised trial compares flashcards with question banks, or with the combination, on a certification or licensing exam.
